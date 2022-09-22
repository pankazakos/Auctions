from xmlrpc.client import DateTime
from django.core.management.base import BaseCommand
import xml.etree.ElementTree as et
from base import models
from django.contrib.auth.hashers import make_password
from hashlib import sha256
import datetime
import re
import sys

from base import serializers


class Command(BaseCommand):

    help = "Inserts xml data to database"

    def add_arguments(self, parser) -> None:
        parser.add_argument('phone', type=int)
        parser.add_argument('tin', type=int)
        parser.add_argument('start', type=int)
        parser.add_argument('end', type=int)

    phone_counter = int(sys.argv[2])
    tin_counter = int(sys.argv[3])
    start = int(sys.argv[4])
    end = int(sys.argv[5])


    def fillzeroes(self, strnumber: str, limit):
        fill = ""
        for i in range(0, limit - len(strnumber)):
            fill += "0"
        return fill + strnumber

    def get_or_createuser(self, UserID, location, country):
        try:
            return models.CustomUser.objects.get(UserId=UserID)
        except:
            # User does not exist. Create a new one
            userobj = {"username": None, "password": None, "email": None, "UserId": None, "first_name": None, "last_name": None,
                    "is_superuser": False, "is_staff": False, "is_approved": False, "Phone_Number": None, "TIN": None,
                    "Country": None, "Location": None, "Latitude": None, "Longitude": None}
            userobj["username"] = UserID
            # password is 'password' but hashed with sha256 because front-end sends passwords with sha256
            password = sha256("password".encode("ASCII")).hexdigest()
            # Then hash with backend hashing algorithm pbkdf2
            password = make_password(password)
            userobj["password"] = password
            userobj["email"] = UserID + "@example.com"
            userobj["UserId"] = UserID
            userobj["first_name"] = "fname"
            userobj["last_name"] = "lname"
            userobj["Phone_Number"] = self.fillzeroes(str(self.phone_counter), 12)
            self.phone_counter += 1
            userobj["TIN"] = self.fillzeroes(str(self.tin_counter), 9)
            self.tin_counter += 1
            userobj["Location"] = location
            userobj["Country"] = country

            userSer = serializers.CustomUserSerializer(data=userobj)

            if (userSer.is_valid()):
                userSer.save()
                user = models.CustomUser.objects.get(UserId=UserID)
                return user
            else:
                print(userSer.errors)
                print(datetime.datetime.now())
                raise Exception("Failed to insert user with UserID", UserID)

    # Override to use Command
    def handle(self, *args, **options):
        print("Started:", datetime.datetime.now())

        months = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
        "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"}

        tree = et.parse('ebay-data/items-0.xml')
        root = tree.getroot()

        obj = {"ItemID": None, "Name": None, "categories": None, "Currently": None,
            "Buy_Price": None, "First_Bid": None, "Number_Of_Bids": None, "Started": None,
            "Ends": None, "Active": True, "Seller": None, "Description": None}
        
        # compiling the pattern for alphanumeric string (from https://www.geeksforgeeks.org/how-to-check-a-valid-regex-string-using-python/)
        pat = re.compile(r"[A-Za-z0-9]+")

        for row in root[self.start:self.end]:
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
            if (row[index].tag == "Buy_Price"):
                obj["Buy_Price"] = float(row[index].text.split("$")[1])
                index += 1
                obj["First_Bid"] = float(row[index].text.split("$")[1])
            else:
                obj["First_Bid"] = float(row[index].text.split("$")[1])

            index += 1
            obj["Number_Of_Bids"] = row[index].text

            # bids. Handle them after item creation
            index += 1
            Bids = row[index].findall("Bid")

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

            # Skip users with bad usernames containing symbols except @ sign
            if not re.fullmatch(pat, username):
                continue

            user = self.get_or_createuser(username, location, country)

            obj["Seller"] = user.id

            index += 1
            obj["Description"] = row[index].text

            itemSer = serializers.ItemSerializer(data=obj)

            if (itemSer.is_valid()):
                itemSer.save()
            else:
                print(itemSer.errors)
                print(datetime.datetime.now())
                raise Exception(
                    "Failed to insert item with ItemID (from xml)", row.attrib["ItemID"])

            subtree = list()
            for Bid in Bids:
                bidtree = {"Bidder": None, "Location": None,
                        "Country": None, "Time": None, "Amount": None}
                for child in Bid.iter():
                    # Skip Bid tag
                    if (child.tag == "Bid"):
                        continue
                    # user id from Bidder tag
                    if (child.attrib != {}):
                        bidtree[child.tag] = child.attrib["UserID"]
                        continue
                    # Rest of the tags
                    bidtree[child.tag] = child.text

                subtree.append(bidtree)

            for bitree in subtree:

                # Skip users with bad usernames containing symbols except @ sign
                if not re.fullmatch(pat, bitree["Bidder"]) or bitree["Country"] == None:
                    continue

                # Get or create user if he does not exist
                bidder = self.get_or_createuser(bitree["Bidder"].split(
                    "@")[0], bitree["Location"], bitree["Country"])

                # Create Bid
                bidobj = {"ItemID": models.Item.objects.get(ItemID=itemSer.data["ItemID"]).ItemID, "Bidder": bidder.id,
                        "Amount": float(bitree["Amount"].split("$")[1])}
                bidSer = serializers.BidSerializer(data=bidobj)

                # Create a row inside VisitsAndRecom, because a user cannot make a bid without visiting first the item
                try:
                    models.VisitsAndRecom.objects.get(UserId_id=bitree["Bidder"], ItemID=bitree["ItemID"])
                except:
                    vobj = {"UserId": bidder.id,
                            "ItemID": itemSer.data["ItemID"]}
                    VisitsSer = serializers.VisitsAndRecomSerializer(data=vobj)
                    if (VisitsSer.is_valid()):
                        VisitsSer.save()
                    else:
                        print(VisitsSer.errors)
                        print("Ended:", datetime.datetime.now())
                        raise Exception(
                            "Failed to create row inside VisitsAndRecom for bidder id:", bitree["Bidder"])


                if (bidSer.is_valid()):
                    bidSer.save()
                else:
                    print(bidSer.errors)
                    print("Ended:", datetime.datetime.now())
                    raise Exception(
                        "Failed to create Bid with Bidder Id ", bitree["Bidder"])

        print("Ended:", datetime.datetime.now())

        return "Succesfully filled database with data"
