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

    serializer_class = serializers.ListUserSerializer
    queryset = models.CustomUser.objects.all()


# Register new user
class CreateUser(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        obj = {"UserId": request.data['username']}

        obj.update(request.data)

        ser = serializers.RegisterUserSerializer(data=obj)

        if(ser.is_valid()):
            ser.save()
        else:
            print(ser.errors)
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
        obj.update({"Seller": models.CustomUser.objects.get(username=request.user).id})
        obj['categories'] = catidlst

        ser = serializers.ItemSerializer(data=obj)

        if (ser.is_valid()):
            ser.save()

        else:
            print(ser.errors)
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response("Item created", status=status.HTTP_200_OK)


class ListInactiveItems(APIView):

    permission_classes = [permissions.IsAuthenticated]
 
    def get(self, request):
        itemqueryset =  models.Item.objects.filter(Seller=request.user, Active=False)
        objlst = list()
        print(request.user.UserId)
        for item in itemqueryset:
            obj = {"ItemID": None, "Name": None, "categories": None, "Currently": None, "Buy_Price": None, 
            "First_Bid": None, "Number_Of_Bids": None, "Started": None, "Ends": None,
            "Seller": None, "Description": None}
            obj['ItemID'] = item.ItemID
            obj['Name'] = item.Name
            catqueryset = item.categories.all()
            catlst = list()
            for cat in catqueryset:
                catId = int(re.findall(r'\b\d+\b', cat.Name)[0])
                catlst.append(models.Category.objects.get(id=catId).Name)
            obj['categories'] = catlst
            obj['Currently'] = item.Currently
            obj['Buy_Price'] = item.Buy_Price
            obj['First_Bid'] = item.First_Bid
            obj['Number_Of_Bids'] = item.Number_Of_Bids
            obj['Started'] = item.Started
            obj['Ends'] = item.Ends
            obj['Seller'] = request.user.UserId
            obj['Description'] = item.Description
            objlst.append(obj)

        return Response(objlst, status=status.HTTP_200_OK)


class ListActiveItems(APIView):
        
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        itemqueryset =  models.Item.objects.filter(Seller=request.user, Active=True)
        objlst = list()
        print(request.user.UserId)
        for item in itemqueryset:
            obj = {"Name": None, "categories": None, "Currently": None, "Buy_Price": None, 
            "First_Bid": None, "Number_Of_Bids": None, "Started": None, "Ends": None,
            "Seller": None, "Description": None}
            obj['Name'] = item.Name
            catqueryset = item.categories.all()
            catlst = list()
            for cat in catqueryset:
                catId = int(re.findall(r'\b\d+\b', cat.Name)[0])
                catlst.append(models.Category.objects.get(id=catId).Name)
            obj['categories'] = catlst
            obj['Currently'] = item.Currently
            obj['Buy_Price'] = item.Buy_Price
            obj['First_Bid'] = item.First_Bid
            obj['Number_Of_Bids'] = item.Number_Of_Bids
            obj['Started'] = item.Started
            obj['Ends'] = item.Ends
            obj['Seller'] = request.user.UserId
            obj['Description'] = item.Description
            objlst.append(obj)

        return Response(objlst, status=status.HTTP_200_OK)


class DeleteItem(generics.DestroyAPIView):

    permission_classes = [ItemPermission]
    serializer_class = serializers.ItemSerializer
    queryset = models.Item.objects.all()