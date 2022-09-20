from django.core.management.base import BaseCommand
import xml.etree.ElementTree as et
from models import CustomUser


class Command(BaseCommand):

    help = "Inserts xml data to database"

    def handle(self, *args, **options):
        tree = et.parse('ebay-data/items-0.xml')
        root = tree.getroot()

        obj = {"ItemID": None, "Name": None, "categories": None, "Currently": None,
            "Buy_Price": None, "First_Bid": None, "Number_Of_Bids": None, "Started": None,
            "Ends": None, "Active": None, "Seller": None, "Description": None}

        row = root[0]

        # ItemID increments automatically
        
        index = 0
        obj["Name"] = row[index].text
        index += 1
        catlst = list()
        while row[index].tag == "Category":
            catlst.append(row[index].text)
            index += 1

        obj["categories"] = catlst
        obj["Currently"] = row[index].text
        index += 1
        print(row[index].tag)
        if(row[index].tag == "Buy_Price"):
            obj["Buy_Price"] = row[index].text
            index += 1
            obj["First_Bid"] = row[index].text
        else:
            obj["First_Bid"] = row[index].text
        
        index += 1
        obj["Number_Of_Bids"] = row[index].text

        # Skip bids location and country
        index += 1
        index += 1
        index += 1

        index += 1
        obj["Started"] = row[index].text

        index += 1
        obj["Ends"] = row[index].text

        # Seller
        index += 1

        index += 1
        obj["Description"] = row[index].text

        print(obj)

        return "Succesfully filled database with data"
