from django.core.management.base import BaseCommand
from base import models, serializers
import recommend


class Command(BaseCommand):

    help = """creates matrix with ratings and runs the Matrix factorization
    algorithm to calculate the recommendations for each user"""


    def handle(self, *args, **options) -> str:

        users = models.CustomUser.objects.filter(is_superuser=False)
        items = models.Item.objects.all()

        matrix = []

        useridx = 0
        for user in users:
            # Create a list for each user inside matrix list
            matrix.append([])
            for item in items:
                bids = models.Bid.objects.filter(Bidder_id=user.id, ItemID=item.ItemID).count()
                try:
                    # Get specific row from Recommendations table which holds number of visits
                    Visit = models.VisitsAndRecom.objects.get(UserId_id=user.id, ItemID=item.ItemID)
                    rating = Visit.visits * 0.1 + bids * 0.3
                    if (rating > 1):
                        rating = 1
                except:
                    # fill with zeroes if there are no visits and no bids
                    rating = 0 + 0.3 * bids
                    if (rating > 1):
                        rating = 1


                matrix[useridx].append(rating)


            useridx += 1


        recomm = recommend.Recommendations()
        recomm.update_using_array(matrix, debug=False)

        for i in range(len(matrix)):
            print('Top 3 Recommendations for user with id:', str(users[i].id))
            scoreslst = recomm.for_user(i)

            # Reset scores from past calculations
            past = models.VisitsAndRecom.objects.filter(UserId=users[i])
            for p in past:
                # row is useless for now. It will be created again if the user visits the item or gets high score 
                if(p.visits == 0):
                    p.delete()
                else:
                    p.score = 0
                    p.save()

            for r in scoreslst[:3]:
                print('item with id:', items[r[0]].ItemID, ', points: ', r[1])
                try:
                    rec = models.VisitsAndRecom.objects.get(UserId_id=users[i].id, ItemID_id=items[r[0]].ItemID)
                    rec.score = r[1]
                    rec.save()
                except:
                    # Create a new row in VisitsAndRecom table
                    obj = {"UserId": users[i].id, "ItemID": items[r[0]].ItemID,"visits": 0 , "score": r[1]}
                    VisitsSer = serializers.VisitsAndRecomSerializer(data=obj)
                    if (VisitsSer.is_valid()):
                        VisitsSer.save()

            print("\n")

        return "Succesfully calculated recommendations"