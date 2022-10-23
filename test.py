#!/bin/env python
import recommend

recommend.check_examples()


'''^^^\__/^^\__/^^^^^^\__/^^\__/^\__/^^\__/^^^^\__/\__/^^^^
┌─────────────────────────────────────────────────────────┐
│ ███████ █     █    █    █     █ ██████  █       ███████ │
│ █        █   █    █ █   ██   ██ █     █ █       █       │
│ █         █ █    █   █  █ █ █ █ █     █ █       █       │
│ █████      █    █     █ █  █  █ ██████  █       █████   │
│ █         █ █   ███████ █     █ █       █       █       │
│ █        █   █  █     █ █     █ █       █       █       │
│ ███████ █     █ █     █ █     █ █       ███████ ███████ │
└─────────────────────────────────────────────────────────┘
^\__/^\__/^^^^\__/^^\__/^^^^^\__/^\__/\__/^^^\__/^^\__/^'''



ex1 = [
    # users have similar rating for items 0 and 1. So, item 10 will be recommended to user 0
    [1, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 1],
]

ex2 = [
    [x == 'O' for x in '.OO....O...O...'],
    [x == 'O' for x in '....O......O...'],
    [x == 'O' for x in '...........O.O.'],
    [x == 'O' for x in '.O.......O....O'],  # eccentric
    [x == 'O' for x in '..O....O...O...'],
    [x == 'O' for x in '.......O.......'],
    [x == 'O' for x in '....O..O...O...'],
    [x == 'O' for x in '.O............O'],  # similar
    [x == 'O' for x in 'O..........O...'],
    [x == 'O' for x in '..O....O...O...'],
]

matrix = ex1

recomm = recommend.Recommendations()
recomm.update_using_array(matrix, debug=False)


for i in range(len(matrix)):
    print('Top Recommendations for user #', str(i))
    scoreslst = recomm.for_user(i)

    for r in scoreslst[:3]:
        print('item from position', r[0], ', points: ', r[1])

    print("\n")

recomm.print()
