from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # return jwt tokens to only approved users.
    def validate(self, attrs):
        data = super().validate(attrs)
        return data if self.user.is_approved or self.user.is_superuser else "Not approved"
