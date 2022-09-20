#!/bin/env python
import recommend

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

recommend.check_examples()

visits = [
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
recomm = recommend.Recommendations()
recomm.update_using_array(visits, debug=True)

print('')
print('Top 3 recommendations for user #2:')
for r in recomm.for_user(2)[:3]:
    print('item from position', r[0], ', points: ', r[1])

recomm.print()
