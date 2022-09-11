from django.urls import path
from api.views import ApproveUsers, CreateItem, CreateUser, GetUser, ListAllUsers, ListInactiveItems, ListPendingUsers


urlpatterns = [
    path('list/users/', ListAllUsers.as_view(), name='ListAllUsers'),
    path('create/user/', CreateUser.as_view(), name='CreateUser'),
    path('get/user/<int:pk>', GetUser.as_view(), name='GetUser'),
    path('filter/users/', ListPendingUsers.as_view(), name='ListPendingUsers'),
    path('users/approve/<int:pk>', ApproveUsers.as_view(), name='ApproveUsers'),
    path('create/item/', CreateItem.as_view(), name='CreateItem'),
    path('list/items/inactive', ListInactiveItems.as_view(), name='ListInactiveItems'),
]