from django.core.management.base import BaseCommand
import xml.etree.ElementTree as et
from base import models
from django.contrib.auth.hashers import make_password
from hashlib import sha256
import datetime

from base import serializers


class Command(BaseCommand):

    help = "Inserts xml data to database"

    def handle(self, *args, **options):

        months = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
        "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"}

        tree = et.parse('ebay-data/items-0.xml')
        root = tree.getroot()

        obj = {"ItemID": None, "Name": None, "categories": None, "Currently": None,
            "Buy_Price": None, "First_Bid": None, "Number_Of_Bids": None, "Started": None,
            "Ends": None, "Active": True, "Seller": None, "Description": None}

        row = root[1]

        # d = DateTime("Dec-03-01 18:10:40")
        # print(type(d))

        # ItemID increments automatically

        index = 0
        obj["Name"] = row[index].text
        index += 1
        catids = list()
        while row[index].tag == "Category":
            catids.append(models.Category.objects.get_or_create(
                Name=row[index].text)[0].id)
            index += 1

        obj["categories"] = catids
        obj["Currently"] = float(row[index].text.split("$")[1])

        index += 1
        if(row[index].tag == "Buy_Price"):
            obj["Buy_Price"] = float(row[index].text.split("$")[1])
            index += 1
            obj["First_Bid"] = float(row[index].text.split("$")[1])
        else:
            obj["First_Bid"] = float(row[index].text.split("$")[1])
        
        index += 1
        obj["Number_Of_Bids"] = row[index].text

        # Skip bids
        index += 1
        for child in row[index].iter():
            # There are Bids. Create new Bids and Bidders (users) if not they do not already exist
            print(child.tag)

        index += 1
        location = row[index].text

        index += 1
        country = row[index].text

        index += 1
        # 'Started' datetime (need to change format)
        # First change month to a number as string from dict monthsd
        sdatetime = row[index].text.split(" ")
        date = sdatetime[0].split("-")
        time = sdatetime[1]

        dStartdt = date[1]
        mStartdt = date[0]
        mStartdt = months[mStartdt]
        # assume every date is past the year 2000
        yStartdt = "20" + date[2]
        date = yStartdt + "-" + mStartdt + "-" + dStartdt

        Startdt = date + " " + time

        Startdt = datetime.datetime.strptime(Startdt, "%Y-%m-%d %H:%M:%S")
        obj["Started"] = Startdt


        index += 1
        # 'Ends' datetime (need to change format)
        # First change month to a number as string from dict monthsd
        edatetime = row[index].text.split(" ")
        date = edatetime[0].split("-")
        time = edatetime[1]

        dEndsdt = date[1]
        mEndsdt = date[0]
        mEndsdt = months[mEndsdt]
        # assume every date is past the year 2000
        yEndsdt = "20" + date[2]
        date = yEndsdt + "-" + mEndsdt + "-" + dEndsdt

        Endsdt = date + " " + time

        Endsdt = datetime.datetime.strptime(Endsdt, "%Y-%m-%d %H:%M:%S")
        obj["Ends"] = Endsdt

        # Seller
        index += 1
        username = row[index].attrib["UserID"]
        # Get first characters before @ sign as username if userid contains email 
        username = username.split("@")[0]
        try:
            user = models.CustomUser.objects.get(username=row[index].attrib['UserID'])
        except:
            # User does not exist. Create a new one
            userobj = {"username": None, "password": None, "email": None, "UserId": None, "first_name": None, "last_name": None,
            "is_superuser": False, "is_staff": False, "is_approved": False, "Phone_Number": None, "TIN": None,
            "Country": None, "Location": None, "Latitude": None, "Longitude": None}
            userobj["username"] = username
            # password is 'password' but hashed with sha256 because front-end sends passwords with sha256
            password = sha256("password".encode("ASCII")).hexdigest()
            # Then hash with backend hashing algorithm pbkdf2
            password = make_password(password)
            userobj["password"] = password
            userobj["email"] = username + "@example.com"
            userobj["UserId"] = username
            userobj["first_name"] = "fname"
            userobj["last_name"] = "lname"
            userobj["Phone_Number"] = "01000000000" + str(1)
            userobj["TIN"] = "00000000" + str(1)
            userobj["Location"] = location
            userobj["Country"] = country

            userSer = serializers.CustomUserSerializer(data=userobj)

            if(userSer.is_valid()):
                userSer.save()
                user = models.CustomUser.objects.get(username=username)
            else:
                print(userSer.errors)
                raise Exception("Failed to insert user with UserID",
                                row[index].attrib["UserID"])
            

        obj["Seller"] = user.id

        index += 1
        obj["Description"] = row[index].text

        # itemSer = serializers.ItemSerializer(data=obj)

        # if(itemSer.is_valid()):
        #     itemSer.save()
        # else:
        #     print(itemSer.errors)
        #     raise Exception("Failed to insert item with ItemID (from xml)", row.attrib["ItemID"])

        return "Succesfully filled database with data"
