from django.urls import path
from api.views import (BidView, ListBiddedItems, SearchItems, ActivateItem, ApproveUsers, CreateItem, CreateUser, DeleteItem,
                       EditItem, GetUser, ListActiveItems, ListAllUsers, ListInactiveItems, ListPendingUsers, getItem)


urlpatterns = [
    path('list/users/', ListAllUsers.as_view(), name='ListAllUsers'),
    path('create/user/', CreateUser.as_view(), name='CreateUser'),
    path('get/user/<int:pk>', GetUser.as_view(), name='GetUser'),
    path('filter/users/', ListPendingUsers.as_view(), name='ListPendingUsers'),
    path('users/approve/<int:pk>', ApproveUsers.as_view(), name='ApproveUsers'),
    path('create/item/', CreateItem.as_view(), name='CreateItem'),
    path('list/items/inactive/', ListInactiveItems.as_view(),
         name='ListInactiveItems'),
    path('list/items/active/', ListActiveItems.as_view(), name="ListAcriveItems"),
    path('list/items/bidded/', ListBiddedItems.as_view(), name="ListBiddedItems"),
    path('list/items/all/', SearchItems.as_view(), name="ListAllItems"),
    path('get/item/<int:pk>', getItem.as_view(), name="GetItem"),
    path('delete/item/<int:pk>', DeleteItem.as_view(), name="DeleteItem"),
    path('item/activate/<int:pk>', ActivateItem.as_view(), name="ActivateItem"),
    path('edit/item/<int:pk>', EditItem.as_view(), name="EditItem"),
    path('bids/', BidView.as_view(), name="CreateBid"),
]
