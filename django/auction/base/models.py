from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator, MaxValueValidator, MinValueValidator


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
    # Category id is created automatically
    Name = models.CharField(max_length=100)


class Item(models.Model):
    ItemID = models.BigAutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    categories = models.ManyToManyField(Category)
    Currently = models.FloatField()
    Buy_Price = models.FloatField(null=True)
    First_Bid = models.FloatField()
    Number_Of_Bids = models.IntegerField()
    Started = models.DateTimeField(null=True)
    Ends = models.DateTimeField(null=True)
    Active = models.BooleanField(default=False)
    Seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    Description = models.TextField(null=True)


class Bid(models.Model):
    BidID = models.BigAutoField(primary_key=True)
    ItemID = models.ForeignKey(Item, on_delete=models.CASCADE)
    Bidder = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    Time = models.DateTimeField(auto_now=True)
    Amount = models.FloatField()


"""
Each time a user visits an item, number of visits is updated or a new row is created in case it is the first time.
Also, this table holds the scores from the recommendator which are updated whenever the update script runs.
These items will be first fetched by SearchItems view and order them by their scores. 
Note: This table does not contain all items because it would take too long to sort all items, so SearchItems has to fetch the rest from Item table.
"""
class VisitsAndRecom(models.Model):
    # id is created automatically
    UserId = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    ItemID = models.ForeignKey(Item, on_delete=models.CASCADE)
    visits = models.IntegerField(default=1)
    score = models.FloatField(default=0.0)


# # For every user store score result from recommendation algorithm for each item (m x n table size).
# class Matrix(models.Model):
#     # id is created automatically
#     UserId = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     ItemID = models.ForeignKey(Item, on_delete=models.CASCADE)
#     score = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)], default=0.0)