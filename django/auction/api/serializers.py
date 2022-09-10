from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    # return jwt tokens to only approved users.
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_approved:
            return data
        else:
           return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
