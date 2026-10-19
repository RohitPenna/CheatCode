"""Execute our trusted, authored Python templates; never runs user-entered code."""
import copy
import json
from pathlib import Path
lessons = json.loads((Path(__file__).parent.parent / 'src/data/lessons.json').read_text())
count = 0
for lesson in lessons:
    namespace = {}
    exec(compile(lesson['code'], lesson['id'], 'exec'), namespace)
    for case in lesson['cases']:
        actual = namespace['solve'](*copy.deepcopy(case['args']))
        assert actual == case['expected'], (lesson['id'], case, actual)
        count += 1
print(f'{count} Python example checks passed across {len(lessons)} lessons.')

solutions = json.loads((Path(__file__).parent.parent / 'src/data/solutions.json').read_text())
solution_checks = 0
for problem_id, solution in solutions.items():
    namespace = {}
    exec(compile(solution['code'], problem_id, 'exec'), namespace)
    for case in solution['cases']:
        actual = namespace['solve'](*copy.deepcopy(case['args']))
        assert actual == case['expected'], (problem_id, case, actual)
        solution_checks += 1
print(f'{solution_checks} Python problem-solution checks passed across {len(solutions)} problems.')

# Differential checks use independent, deliberately simple exhaustive oracles.
import itertools
import random
rng = random.Random(20261018)
def lesson_function(key):
    scope = {}
    exec(compile(next(l for l in lessons if l['id'] == key)['code'], key, 'exec'), scope)
    return scope['solve']
replacement = lesson_function('character-replacement')
window = lesson_function('sliding-window')
flights = lesson_function('bellman-ford')
differential_checks = 0
for _ in range(150):
    text = ''.join(rng.choice('ABC') for _ in range(rng.randrange(9)))
    k = rng.randrange(4)
    expected = 0
    distinct = 0
    for left in range(len(text)):
        for right in range(left + 1, len(text) + 1):
            piece = text[left:right]
            if len(piece) - max(piece.count(ch) for ch in set(piece)) <= k:
                expected = max(expected, len(piece))
            if len(set(piece)) == len(piece):
                distinct = max(distinct, len(piece))
    assert replacement(text, k) == expected, (text, k, expected)
    assert window(text) == distinct, (text, distinct)
    differential_checks += 2
for _ in range(100):
    n = 4
    edges = [[a, b, rng.randrange(1, 9)] for a in range(n) for b in range(n) if a != b and rng.random() < .35]
    k = rng.randrange(3)
    best = float('inf')
    frontier = [(0, 0)]
    for _round in range(k + 1):
        next_frontier = []
        for node, cost in frontier:
            for a, b, price in edges:
                if a == node:
                    next_frontier.append((b, cost + price))
                    if b == 3:
                        best = min(best, cost + price)
        frontier = next_frontier
    expected = -1 if best == float('inf') else best
    assert flights(n, edges, 0, 3, k) == expected, (edges, k, expected)
    differential_checks += 1
print(f'{differential_checks} seeded differential checks passed for window invariants and edge budgets.')
