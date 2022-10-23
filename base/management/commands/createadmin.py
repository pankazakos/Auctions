from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from hashlib import sha256
from getpass import getpass
from base.models import CustomUser
import sys

class Command(BaseCommand):
    help = "creates admin user"

    def add_arguments(self, parser) -> None:
        parser.add_argument('auto', type=int)
    
    automode = int(sys.argv[2])
    
    def handle(self, *args , **options):
        if self.automode == 1:
            username = "admin"
            email = "admin@example.com"
            UserId = "admin1"
            password = "admin"
            cpassword = "admin"
        else:
            username = input("Username: ")
            email = input("email: ")
            UserId = input("UserID: ")
            password = getpass()
            cpassword = getpass("Confirm Password: ")
        while(password != cpassword):
            print("passwords don't match")
            password = getpass()
            cpassword = getpass("Confirm Password: ")

        # First hash with sha256 and then with pbkdf2_sha256
        password = sha256(password.encode("ASCII")).hexdigest()
        obj = {"UserId": UserId, "username": username, "email": email, "password": make_password(password), 
        "is_approved": True, "is_superuser": True, "is_staff": True}
        CustomUser.objects.create(**obj)
        return "Succesfully created admin"