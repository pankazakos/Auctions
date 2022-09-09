from dataclasses import field
from rest_framework import serializers
from base import models
from django.contrib.auth.hashers import make_password


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = '__all__'


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ['password', 'username', 'first_name', 'last_name', 'email',
                  'Phone_Number', 'TIN', 'Country', 'Location', 'Latitude', 'Longitude']

    def validate_password(self, value: str) -> str:
        """
        Hash password
        """
        return make_password(value)


class ListUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'Phone_Number', 'TIN', 'Country', 'Location', 'Latitude', 'Longitude', 'is_superuser', 'is_staff', 'is_approved']

class ApproveUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ['is_approved']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Item
        fields = '__all__'

    def create(self, validated_data):
        catobjs = list()
        for i in range(len(validated_data['Categories'])):
            catobjs.append(models.Category.objects.get_or_create(
                Name=validated_data['Categories'][i])[0])

        validated_data.pop('Categories')
        print(validated_data)
        item = models.Item.objects.create(**validated_data)
        print("hello")

        for obj in catobjs:
            item.Categories.add(obj)
        return item


class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Bid
        fields = ['id', 'ItemID', 'Bidder', 'Time', 'Amount']
