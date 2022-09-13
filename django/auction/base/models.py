from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator


# Admin can be defined from the CustomUser


class CustomUser(AbstractUser):
    # Inherited fields: id, username, password, first_name, last_name, last_login, is_superuser, is_staff, is_active, date_joined
    UserId = models.CharField(unique=True, max_length=150)
    # override email to make it unique
    email = models.EmailField(unique=True)
    is_approved = models.BooleanField(default=False)
    Phone_Number = models.CharField(max_length=12, validators=[
                                    MinLengthValidator(12)], unique=True)
    TIN = models.CharField(max_length=9, validators=[
                           MinLengthValidator(9)], unique=True)
    Country = models.CharField(max_length=50)
    Location = models.CharField(max_length=100)
    Latitude = models.FloatField(null=True)
    Longitude = models.FloatField(null=True)


class Category(models.Model):
    # CategoryID is created automatically
    Name = models.CharField(max_length=100)


class Item(models.Model):
    ItemID = models.BigAutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    categories = models.ManyToManyField(Category)
    Currently = models.FloatField()
    Buy_Price = models.FloatField(null=True)
    First_Bid = models.FloatField()
    Number_Of_Bids = models.IntegerField()
    Started = models.DateTimeField(auto_now_add=True)
    Ends = models.DateTimeField(null=True)
    Active = models.BooleanField(default=False)
    Seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    Description = models.TextField()


class Bid(models.Model):
    # BidID is created automatically
    ItemID = models.ForeignKey(Item, on_delete=models.CASCADE)
    Bidder = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    Time = models.DateTimeField(auto_now=True)
    Amount = models.IntegerField()
