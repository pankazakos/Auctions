import recom_src
doc_tests = []
class Recommendations:
    def __init__(self):
        self.factors = None

    '''
    █     █ ██████  ██████     █    ███████ ███████ 
    █     █ █     █ █     █  █   █     █    █       
    █     █ ██████  █     █ █     █    █    █████   
    █     █ █       █     █ ███████    █    █       
     █████  █       ██████  █     █    █    ███████ 

    To be called periodically, when there's new data.

    The AI is trained from zero synchronously,
    and in a single thread, all Python. It can be slow.
    '''
    def update_using_array(self, visits, debug=False):
        self.factors = recom_src.Factors(visits, debug)

    def example_update_using_array():
        #              item1 item2 item3
        user1_liked = [True, True, False]
        user2_liked = [False, False, False]
        r = Recommendations()
        r.update_using_array([user1_liked, user2_liked])
    doc_tests.append(example_update_using_array)

    '''



    ███████ █     █ ███████ ██████  █     █ ███████ 
    █     █ █     █    █    █     █ █     █    █    
    █     █ █     █    █    ██████  █     █    █    
    █     █ █     █    █    █       █     █    █    
    ███████  █████     █    █        █████     █    

    The output will likely contain items the user
    has checked before.
    At the same time, there will be items that people
    with similar tastes to him have liked in the past.
    '''
    def for_user(self, user):
        if self.factors is None:
            raise Exception(
                    "uninitiasized self.factors")
        return self.factors.recommend(user)

    def example_for_user():
        recommend = Recommendations()
        recommend.update_using_array([[True], [False]])
        recomm_for_first = recommend.for_user(0)
        assert type(recomm_for_first[0])    == tuple # top 1
        assert type(recomm_for_first[0][0]) == int   # 'id'
        assert type(recomm_for_first[0][1]) == float # %
    doc_tests.append(example_for_user)

    '''



    ██████  ███████ ██████  █     █  █████  
    █     █ █       █     █ █     █ █       
    █     █ █████   ██████  █     █ █  ████ 
    █     █ █       █     █ █     █ █     █ 
    ██████  ███████ ██████   █████   █████  

    Prints a few tables,
    as wide as the number of items
    and as tall as the number of users.
    '''
    def print(self):
        if self.factors is None:
            print('Not initialised.')
            return

        print('')
        print("Recommendation scores overall:")
        self.factors.print()

        print('')
        print("Top first recommendations per user:")
        self.factors.print_order_of_recomm_per_user()

        print('')




def check_examples():
    for test in doc_tests:
        test()

# This file, the file it sources, and the file that tests
# it were done by Theodoros Dimakopoulos, 1115 2019 00048
