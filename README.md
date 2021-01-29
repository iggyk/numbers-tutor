# Number tutoring for kids (Russian)

A simple application for kids to learn numbers. Currently supports Russian only.

The interface represents a written out number and a sound playback button which pronounces the number out loud. The player has to pick the correct variant from the ones presented. If an incorrect variant is picked, the variants are reshuffled, to avoid guess-clicking. All attempts are recorded and can be seen in the `track` collapsible control located top right; it displays the numbers played and the number of guesses it took to get to the right one.

Hosted on github.io: https://iggyk.github.io/numbers-tutor/index.html?from={N}&to={N}&variants={N}

Supported parameters:

| Paramerter | Type | Value range & description |
| --- | --- | --- |
| `from` | number | 0 to 999; must be lower than `to` |
| `to` | number | 1 to 999; must be higher than `from` |
| `variants` | number | > 0; number of answer variants to generate. Recommended to keep this value between 4 and 10, provided that the range allows for this many. |

This hasn't been tested for edge cases, providing dumb values will most likely cause endless loops.