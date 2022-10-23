from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import InvalidToken

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    # return jwt tokens to only approved users.
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_approved:
            return data
        else:
            raise InvalidToken
