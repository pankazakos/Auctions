from django.urls import path
from api.views import ActivateItem, ApproveUsers, CreateItem, CreateUser, DeleteItem, GetUser, ListActiveItems, ListAllUsers, ListInactiveItems, ListPendingUsers


urlpatterns = [
    path('list/users/', ListAllUsers.as_view(), name='ListAllUsers'),
    path('create/user/', CreateUser.as_view(), name='CreateUser'),
    path('get/user/<int:pk>', GetUser.as_view(), name='GetUser'),
    path('filter/users/', ListPendingUsers.as_view(), name='ListPendingUsers'),
    path('users/approve/<int:pk>', ApproveUsers.as_view(), name='ApproveUsers'),
    path('create/item/', CreateItem.as_view(), name='CreateItem'),
    path('list/items/inactive', ListInactiveItems.as_view(), name='ListInactiveItems'),
    path('list/items/active', ListActiveItems.as_view(), name="ListAcriveItems"),
    path('delete/item/<int:pk>', DeleteItem.as_view(), name="DeleteItem"),
    path('item/activate/<int:pk>', ActivateItem.as_view(), name="ActivateItem"),
]