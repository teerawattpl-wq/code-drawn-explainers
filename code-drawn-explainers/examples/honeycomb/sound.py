"""Sound effects for story 01. build.py calls cues(T, S, p): T = the timeline, S = the synth
module, p(time, sound, gain) places one sound. Every time comes from T, so the effects move
with the narration in both languages."""


def cues(T, S, p):
    P = lambda n: T["p%d" % n]
    move = lambda t, g=0.16: p(t, S.swish(0.45, 600, 3800), g)   # the camera travelling

    for k in range(7):                                       # pencil ticks while the bee is drawn
        p(0.1 + k * 0.13, S.tap(), 0.16)
    p(1.1, S.swish(0.5, 500, 3000), 0.16)                    # colour floods in
    for k in range(16):                                      # cells popping outward, faster and softer
        p(T["b"] + 0.05 + 1.9 * (k / 16) ** 0.7, S.pop(), 0.2 * (1 - k / 22))
    p(T["q"] - 0.05, S.swish(0.4, 700, 4500), 0.22)          # the push in
    p(T["q"] + 0.45, S.bell(880, 1.2), 0.22)

    for t0 in [T["l2"] - 0.3, P(2)[2] - 0.2, T["l3"] - 0.3, T["l5"] - 0.2, T["l6"] - 0.2, T["l7"] - 0.25, P(7)[2] - 0.1]:
        move(t0)
    for k in range(6):                                       # a flake of wax pressed onto the wall
        p(T["l2"] + 1.1 + k * 0.72, S.tap(), 0.26)
    for k in range(8):                                       # a cell of honey spent
        p(P(2)[2] + 0.3 + k * 0.28, S.pop(), 0.22)
    p(P(2)[3] + 0.4, S.bell(784, 1.0), 0.2)
    p(P(3)[1] + 0.2, S.sweep(300, 700, 1.1) * S.env(1.1, 0.3, 2.0), 0.10)   # honey rising
    p(P(3)[2] + 0.3, S.sweep(700, 420, 0.8) * S.env(0.8, 0.2, 2.0), 0.10)   # walls thinning
    p(T["l4"] - 0.3, S.swish(0.6, 400, 2600), 0.2)           # onto the page
    for k in range(8):
        p(P(4)[1] - 0.3 + k * 0.07, S.pop(), 0.16)
    p(P(4)[1] + 0.8, S.bell(622, 0.8), 0.18)                 # the gaps
    p(P(5)[1], S.bell(880), 0.2)
    for i in range(3):
        move(P(5)[2 + i] - 0.15, 0.12)
        for k in range(7):
            p(P(5)[2 + i] + k * 0.06, S.tap(), 0.14)
    for i in range(3):                                       # a wall unrolled into a bar
        p(P(6)[1 + i] + 0.05, S.sweep(500 + i * 90, 900 + i * 90, 0.9) * S.env(0.9, 0.05, 1.5), 0.09)
    p(P(6)[4], S.bell(1046.5, 1.2), 0.26)
    for k in range(20):                                      # the years ticking past, slow, fast, slow
        u = k / 19
        p(T["l7"] + 0.5 + (T["yearLand"] - T["l7"] - 0.5) * (3 * u * u - 2 * u * u * u), S.tap(), 0.13)
    p(T["yearLand"] + 0.25, S.thud(), 0.5)                   # the stamp
    for k in range(6):
        p(P(7)[3] + 0.35 + k * 0.14, S.pop(), 0.2)           # the others drop away
    p(P(7)[3] + 0.9, S.bell(1318.5, 1.6), 0.24)
    p(T["l8"] - 0.25, S.swish(0.6, 400, 2600), 0.2)          # back to the comb
    for k in range(6):
        p(P(8)[1] - 0.6 + k * 0.18 + 0.4, S.tap(), 0.18)     # bees landing
    p(P(8)[2] + 0.9, S.bell(659.3, 1.8), 0.24)               # the title
