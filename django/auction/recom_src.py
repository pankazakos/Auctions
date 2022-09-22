import random

# Factors from factorisation of a 2d matrix.
# Example of useage at the bottom of the file (test func).
class Factors:

    # Typically, your matrix will be factorised on __init__
    def __init__(self, array_2d, debug=False):
        self.u = self.v = self.latent_factors = None
        if array_2d is None: return

        de_popularise(array_2d)
        res = multi_generation_training(array_2d, debug)

        self.u = res.u
        self.v = res.v
        self.latent_factors = res.latent_factors


    def __copy__(self):
        u = self.u.copy() #TODO

    # The accuracy of the factors. Should be close to 0.
    # Non negative.
    def error(self, array_2d):
        s = 0
        for i in range(len(array_2d)):
            for j in range(len(array_2d[0])):
                s += (array_2d[i][j] - self.get(i, j)) ** 2
        return s

    # Returns Factors which contains partial derivatives.
    # Those are used for tweaking a Factors object to
    # reduce its error.
    def squared_distance_derivatives(self, real):

        d_us = [[]] * self.latent_factors
        d_vs = [[]] * self.latent_factors

        for lf in range(self.latent_factors):
            for user in range(len(real)):
                s = 0
                for item in range(len(real[0])):
                    s += 2 * self.v[lf][item] *\
                            (self.get(user, item) -
                                    real[user][item])
                d_us[lf].append(s)

        for lf in range(self.latent_factors):
            for item in range(len(real[0])):
                s = 0
                for user in range(len(real)):
                    s += 2 * self.u[lf][user] *\
                            (self.get(user, item) -
                                    real[user][item])
                d_vs[lf].append(s)

        return raw_factors(d_us, d_vs, self.latent_factors)


    # Many of them in a loop should train the "AI".
    # The argument is the original data.
    def training_iteration(self, data_set, m=0.1):
        d = self.squared_distance_derivatives(data_set)
        for lf in range(self.latent_factors):
        #for lf in range(1):

            for u in range(len(self.u[0])):
                self.u[lf][u] -= m * d.u[lf][u]

            for v in range(len(self.v[0])):
                self.v[lf][v] -= m * d.v[lf][v]


    # Real time computed recommendation percentage.
    # It's a guess of what the initial matrix was like.
    def get(self, u, v):

        dot_product = 0
        for i in range(self.latent_factors):
            user = self.u[i][u]
            item = self.v[i][v]
            dot_product += user * item
        return dot_product

    # Returns a list. It's one whole column (user).
    def recommend(self, column):

        if self.u is None or self.v is None:
            raise Exception(
                    "uninitialized recommendations")

        res = []
        for item in range(len(self.v[0])):
            preference = self.get(column, item)
            res_with_filler = res + [(-1, -10000.0)]
            for (j, e) in enumerate(res_with_filler):
                if e[1] < preference:
                    res.insert(j, (item, preference))
                    break
        return res

    def resulting_array_2d(self):
        res = [[0.0] * len(self.v[0])
                for u in range(len(self.u[0]))]
        for u in range(len(self.u[0])):
            for v in range(len(self.v[0])):
                res[u][v] = self.get(u, v)
        return res

    def print(self):
        print_array_2d(self.resulting_array_2d())

    def print_sharp(self, delimiter):
        for u in range(len(self.u[0])):
            for v in range(len(self.v[0])):
                p = self.get(u, v)
                if p < delimiter: print('░', end='')
                else:             print('█', end='')
            print('')

    def print_order_of_recomm_per_user(self):
        for user in range(len(self.u[0])):
            recommendation = self.recommend(user)
            l = [0.0] * len(recommendation)
            for i, r in enumerate(recommendation):
                first = 5
                l[r[0]] = max((first - i) / first, 0.0)
            print_array_2d([l])

# Raw init for Factors (Factors.__init__ is friendlier)
def raw_factors(u, v, latent_factors):
    f = Factors(None)
    f.u = u
    f.v = v
    f.latent_factors = latent_factors
    return f


# Of course I fiddled a bit too much with this.
def print_array_2d(array_2d):
    for u in array_2d:
        for v in u:
            if   v < -1:   print(' ', end='')
            elif v < 0.0:  print('-', end='')
            elif v < 0.2:  print('░', end='')
            elif v < 0.4:  print('▒', end='')
            elif v < 0.6:  print('▓', end='')
            elif v < 0.8:  print('█', end='')
            elif v < 1:    print('█', end='')
            else:          print('^', end='')
        print('')


# Weight data so popular items are considered less.
def de_popularise(data_set):

    # Measuring popularity of items.
    item_popularity = [0] * len(data_set[0])
    for user in data_set:
        for item, has_inspected in enumerate(user):
            if has_inspected:
                item_popularity[item] += 1
    divide_with = 1 / max(item_popularity)

    only_i_like_weight = 1.0
    max_popular_weight = 0.5
    item_weight = [1.0] * len(item_popularity)
    assert len(item_weight) == len(data_set[0])

    # weights
    for i in range(len(item_popularity)):
        percent_pop = item_popularity[i] * divide_with
        item_weight[i] = only_i_like_weight\
                - percent_pop\
                * (1 - max_popular_weight)

    # weighting
    for user in range(len(data_set)):
        for item in range(len(data_set[user])):
            data_set[user][item] =\
                    float(data_set[user][item])\
                    * item_weight[item]


# Exchange True / False with non zero numbers
def workable_numbers(data_set):
    for u in range(len(data_set)):
        for i in range(len(data_set[u])):
            if data_set[u][i] == True:
                data_set[u][i] = 1.0
            elif data_set[u][i] == False:
                data_set[u][i] = 0.1
            else:
                raise Exception("not boolean value")


#       Please don't use it!
# I'm keeping it because it shows a mindset, simplified.
def simple_training(data_set):

    users = len(data_set   )
    items = len(data_set[0])
    lf = 3
    factors = raw_factors(
            [[0.5] * users] * lf,
            [[0.5] * items] * lf,
            lf
            )
    for i in range(40 + 1):
        factors.training_iteration(data_set, 0.01)
        if i % 10 == 0:
            print(i)
            #factors.print()

    return factors


# Starting from multiple random generations
def multi_generation_training(data_set, debug=False):

    users = len(data_set   )
    items = len(data_set[0])
    lf = max(3, int(min(
        len(data_set),
        len(data_set[0])) / 3))

    num_of_generations = 1000
    cleanup_every = 5
    graduating_gens = 10
    assert graduating_gens<num_of_generations/cleanup_every
    generations = []
    cleaned_up = []

    fat_loops = 10
    fat_step = 0.05
    grinding_loops = 50
    grinding_step = 0.01

    # first bunch
    for i in range(num_of_generations):
        r = random.random
        u = [[r() for i in range(users)] for i in range(lf)]
        v = [[r() for i in range(items)] for i in range(lf)]
        f = raw_factors(u, v, lf)
        for _ in range(fat_loops):
            f.training_iteration(data_set, fat_step)
        generations.append(f)
        if debug and i % 100 == 0 and i > 0:
            print("Trained generation", i)

        # freeing memory
        if i % cleanup_every == 0 and i > 0:
            def err(arg): return arg.error(data_set)
            best = min(generations, key=err)
            cleaned_up.append(best)
            generations.clear()
    generations.clear()
    generations = None  # don't use it anymore

    # winners
    def get_error(arg): return arg.error(data_set)
    cleaned_up.sort(key=get_error)
    if debug:
        print('\nBest and worst:')
        print(cleaned_up[0].error(data_set))
        print(cleaned_up[-1].error(data_set))
    better_generations = cleaned_up[:graduating_gens]

    # grinding
    for f in better_generations:
        for i in range(grinding_loops):
            f.training_iteration(data_set, grinding_step)

    # best
    def get_error(arg): return arg.error(data_set)
    better_generations.sort(key=get_error)
    if debug:
        print('\nFinal best and worst:')
        print(better_generations[0].error(data_set))
        print(better_generations[-1].error(data_set))
    return better_generations[0]


