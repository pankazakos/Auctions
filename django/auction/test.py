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



matrix = [
    # users have similar rating for items 0 and 1. So, item 10 will be recommended to user 0 because of user's 1 rating
    [1, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 1],
]

recomm = recommend.Recommendations()
recomm.update_using_array(matrix, debug=False)


for i in range(len(matrix)):
    print('Top Recommendations for user #', str(i))
    scoreslst = recomm.for_user(i)

    for r in scoreslst[:3]:
        print('item from position', r[0], ', points: ', r[1])

    print("\n")
