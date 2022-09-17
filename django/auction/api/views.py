from math import ceil
from django.core.paginator import Paginator
import datetime
from dateutil.parser import isoparse
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.permissions import BasePermission
from base import models, serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from api.serializers import MyTokenObtainPairSerializer
from rest_framework.views import APIView
import re

# Custom View for api/token in order to return tokens only to approved users


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# API for users

# Custom permission
class UserPermission(BasePermission):
    message = "You don't have access on this account's information"

    def has_object_permission(self, request, view, obj):
        return obj == request.user


class ItemPermission(BasePermission):
    message = "You don't have access on this Item"

    def has_object_permission(self, request, view, obj):
        return obj.Seller == request.user

# Display users


class ListAllUsers(generics.ListAPIView):

    permission_classes = [permissions.IsAdminUser]

    serializer_class = serializers.ListUserSerializer
    queryset = models.CustomUser.objects.filter(
        is_approved=False, is_superuser=False)


class ApproveUsers(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]

    serializer_class = serializers.ApproveUserSerializer
    queryset = models.CustomUser.objects.filter(
        is_approved=False, is_superuser=False)


# Get individual user by id
class GetUser(generics.RetrieveAPIView):
    permission_classes = [UserPermission]
    serializer_class = serializers.CustomUserSerializer
    queryset = models.CustomUser.objects.all()


# Register new user
class CreateUser(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        obj = {"UserId": request.data['username']}

        obj.update(request.data)

        ser = serializers.RegisterUserSerializer(data=obj)

        if (ser.is_valid()):
            ser.save()
        else:
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response("User created", status=status.HTTP_200_OK)


# List users that have not been approved yet
class ListPendingUsers(generics.ListAPIView):

    permission_classes = [permissions.IsAdminUser]

    serializer_class = serializers.CustomUserSerializer
    queryset = models.CustomUser.objects.filter(is_approved=False)


# Api for items

class CreateItem(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        catidlst = list()
        for i in range(len(request.data['categories'])):
            catobj = models.Category.objects.get_or_create(
                Name=request.data['categories'][i])
            catidlst.append(catobj[0].id)

        obj = dict((request.data))
        obj.update(
            {"Seller": models.CustomUser.objects.get(username=request.user).id})
        obj['categories'] = catidlst

        ser = serializers.ItemSerializer(data=obj)

        if (ser.is_valid()):
            ser.save()

        else:
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response("Item created", status=status.HTTP_200_OK)


class ListInactiveItems(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = models.Item.objects.filter(Seller=request.user, Active=False)
        lstitems = list()
        for item in items:
            data = serializers.ItemSerializer(item).data
            catids = data['categories']
            categories = list()
            for id in catids:
                cat = models.Category.objects.get(id=id)
                refid = int(re.findall(r'\b\d+\b', cat.Name)[0])
                refcat = models.Category.objects.get(id=refid)
                categories.append(refcat.Name)
            data['categories'] = categories
            del data['Number_Of_Bids']
            del data['Started']
            del data['Ends']
            del data['Active']
            del data['Seller']
            lstitems.append(data)

        return Response(lstitems, status=status.HTTP_200_OK)


class ListActiveItems(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = models.Item.objects.filter(Seller=request.user, Active=True)
        lstitems = list()
        for item in items:
            data = serializers.ItemSerializer(item).data
            catids = data['categories']
            categories = list()
            for id in catids:
                cat = models.Category.objects.get(id=id)
                refid = int(re.findall(r'\b\d+\b', cat.Name)[0])
                refcat = models.Category.objects.get(id=refid)
                categories.append(refcat.Name)
            data['categories'] = categories
            del data['Active']
            del data['Seller']
            lstitems.append(data)

        return Response(lstitems, status=status.HTTP_200_OK)


class SearchItems(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        items = models.Item.objects.filter(Active=True)
        itperpage = 4

        name = request.GET.get('name')
        if (not name == "null"):
            items = items.filter(Name__icontains=name)
        lprice = request.GET.get('lprice')
        rprice = request.GET.get('rprice')

        if (not lprice == "" and not lprice == "null" or not rprice == "" and not rprice == "null"):
            if (rprice == "" or rprice == "null"):
                items = items.filter(Currently__gte=lprice)
            elif (lprice == "" or lprice == "null"):
                items = items.filter(Currently__lte=rprice)
            else:
                items = items.filter(Currently__range=[lprice, rprice])
        
        categories = request.GET.get('cat')
        if(not categories == "null" and not categories == ""):
            categories = categories.split(',')
            categories = [cat.strip() for cat in categories]
            categories = list(filter(None, categories))
            catids = [models.Category.objects.get(Name=cat).id for cat in categories]
            refnames = ["Category object (" + str(id) + ")" for id in catids]
            refcats = models.Category.objects.filter(Name__in=refnames)
            refids = [refcat.id for refcat in refcats]
            items = items.filter(categories__in=refids).distinct()

        location = request.GET.get('location')
        if (not location == "null" and not location == ""):
            users = models.CustomUser.objects.filter(is_approved=True, Location=location)
            userids = [user.id for user in users]
            items = items.filter(Seller__in=userids)

        if (not request.GET.get('page') == 'null'):
            page = int(request.GET.get('page'))
        else:
            page = 1
        
        num = items.count()
        start = (page - 1) * itperpage
        if (start  > num):
            return Response("Page does not exist", status=status.HTTP_400_BAD_REQUEST)

        end = page * itperpage
        items = items[start:end]
        lstitems = list()
        for item in items:
            data = serializers.ItemSerializer(item).data
            catids = data['categories']
            categories = list()
            for id in catids:
                cat = models.Category.objects.get(id=id)
                refid = int(re.findall(r'\b\d+\b', cat.Name)[0])
                refcat = models.Category.objects.get(id=refid)
                categories.append(refcat.Name)
            data['categories'] = categories
            sellerid = data['Seller']
            user = models.CustomUser.objects.get(id=sellerid)
            data['Seller'] = user.UserId
            del data['Active']
            del data['First_Bid']
            lstitems.append(data)

        return Response([{"items": lstitems}, {"count": ceil(num / itperpage)}, {"page": page}], status=status.HTTP_200_OK)


class getItem(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            item = models.Item.objects.get(ItemID=pk, Active=True)
        except:
            return Response("Item Not Found", status=status.HTTP_404_NOT_FOUND)
        data = serializers.ItemSerializer(item).data
        catids = data['categories']
        categories = list()
        for id in catids:
            cat = models.Category.objects.get(id=id)
            refid = int(re.findall(r'\b\d+\b', cat.Name)[0])
            refcat = models.Category.objects.get(id=refid)
            categories.append(refcat.Name)
        data['categories'] = categories
        sellerid = data['Seller']
        user = models.CustomUser.objects.get(id=sellerid)
        data['Seller'] = user.UserId
        del data['Active']
        del data['First_Bid']

        return Response(data, status=status.HTTP_200_OK)


class DeleteItem(generics.DestroyAPIView):

    permission_classes = [ItemPermission]
    serializer_class = serializers.ItemSerializer
    queryset = models.Item.objects.all()


class ActivateItem(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        item = models.Item.objects.get(ItemID=pk, Active=False)
        if (not request.user == item.Seller):
            return Response("Forbidden", status=status.HTTP_403_FORBIDDEN)

        dtends = request.data['Ends']
        dtnow = datetime.datetime.now(tz=timezone.utc)
        try:
            parsed_dtends = isoparse(dtends)
        except:
            return Response("Date is not in correct format", status=status.HTTP_400_BAD_REQUEST)

        if (parsed_dtends <= dtnow):
            return Response("End datetime cannot be set to smaller datetime than current", status=status.HTTP_400_BAD_REQUEST)

        item.Started = dtnow
        item.Ends = parsed_dtends
        item.Active = True
        item.save()

        return Response({"Started": item.Started, "Ends": item.Ends, "Active": item.Active}, status=status.HTTP_200_OK)


class EditItem(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        item = models.Item.objects.get(ItemID=pk)
        if (request.user != item.Seller):
            return Response("Forbidden", status=status.HTTP_403_FORBIDDEN)

        if (request.data['Name'] != ""):
            item.Name = request.data['Name']

        categories = request.data['categories']
        if (categories != ['']):
            catids = list()
            for cat in categories:
                if (cat != ''):
                    catobj = models.Category.objects.get_or_create(Name=cat)
                    refobj = models.Category.objects.get_or_create(
                        Name=catobj[0])
                    catids.append(refobj[0].id)

            currcat = models.Category.objects.filter(item=pk)
            for curr in currcat:
                item.categories.remove(curr)

            for id in catids:
                item.categories.add(id)

        if (request.data['Buy_Price'] != None):
            item.Buy_Price = request.data['Buy_Price']

        first_bid = request.data['First_Bid']
        if (first_bid != None):
            item.First_Bid = first_bid
            item.Currently = first_bid

        if (request.data['Description'] != ""):
            item.Description = request.data['Description']

        item.save()

        return Response("OK", status=status.HTTP_200_OK)
