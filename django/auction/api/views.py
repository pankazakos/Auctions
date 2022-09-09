from email import message
from http import HTTPStatus
from tokenize import Name
from rest_framework import status
from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.permissions import BasePermission
from base import models, serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from api.serializers import MyTokenObtainPairSerializer
from rest_framework.views import APIView

# Custom View for api/token in order to return tokens only to approved users


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# API for users

# Custom permission


class UserPermission(BasePermission):
    message = "You don't have access on this account's information"

    def has_object_permission(self, request, view, obj):
        return obj == request.user

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
class CreateUser(generics.CreateAPIView):

    permission_classes = [permissions.AllowAny]

    serializer_class = serializers.RegisterUserSerializer
    queryset = models.CustomUser.objects.all()


# List users that have not been approved yet
class ListPendingUsers(generics.ListAPIView):

    permission_classes = [permissions.IsAdminUser]

    serializer_class = serializers.CustomUserSerializer
    queryset = models.CustomUser.objects.filter(is_approved=False)


# Api for items

class CreateItem(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        obj = {'ItemID': '1043374545'}

        catidlst = list()
        for i in range(len(request.data['Categories'])):
            catidlst.append(models.Category.objects.get_or_create(Name=request.data['Categories'][i])[0].id)

        obj.update(request.data)
        obj.update({"Seller": models.CustomUser.objects.get(username=request.user).id})
        obj['Categories'] = catidlst

        serializer = serializers.ItemSerializer(data=obj)

        if (serializer.is_valid()):
            serializer.save()

        else:
            print(serializer.errors)
            if (str(serializer.errors['ItemID'][0]) == "item with this ItemID already exists."):
                obj['ItemID'] = '144325'
                serializer = serializers.ItemSerializer(data=obj)
                if(serializer.is_valid()):
                    serializer.save()
                    return Response("created", status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response("created", status=status.HTTP_200_OK)
