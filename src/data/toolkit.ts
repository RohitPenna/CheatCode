export const toolkit = [
  {
    title: "Lists: append, pop, insert, remove",
    group: "Collections",
    description:
      "Lists are dynamic arrays. Appending and popping at the end are amortized O(1); inserting or removing near the front shifts elements in O(n). remove finds the first equal value, not an index.",
    code: "values = [3, 1, 4]\nvalues.append(2)\nlast = values.pop()\nvalues.extend([5, 6])\nvalues.insert(0, 9)  # O(n)\nvalues.remove(1)     # first equal value; ValueError if absent\nvalues.reverse()    # in-place, O(n)",
    gotcha:
      "list.sort() and list.reverse() return None. Do not assign their return value back to your list.",
  },
  {
    title: "Dictionary: get, items, keys, values",
    group: "Collections",
    description:
      "A dictionary associates a hashable key with a value. Membership tests keys. Lookup, update, and deletion are expected O(1). Iterating all entries takes O(n).",
    code: 'counts = {}\nfor ch in "banana":\n    counts[ch] = counts.get(ch, 0) + 1\nfor key, value in counts.items():\n    print(key, value)\nkeys = list(counts.keys())\nvalues = list(counts.values())\ncounts.setdefault("z", 0)\nremoved = counts.pop("z", 0)',
    gotcha:
      "Do not change dictionary size while iterating over it. Iterate over list(counts) if keys must be removed.",
  },
  {
    title: "Set: presence, remove vs discard",
    group: "Collections",
    description:
      "Use a set when you only need unique membership. add, membership, remove, and discard are expected O(1). remove raises KeyError for an absent value; discard does nothing.",
    code: "seen = {1, 2, 3}\nseen.add(4)\nseen.discard(99)  # safe if absent\nseen.remove(2)\nother = {3, 4, 5}\nunion = seen | other\ncommon = seen & other\nonly_seen = seen - other\nunique = {x * x for x in range(5)}",
    gotcha:
      "An empty set is set(), not {}. set.pop() removes an arbitrary element, not the smallest.",
  },
  {
    title: "Strings: split, join, strip, replace",
    group: "Strings",
    description:
      "Strings are immutable. Build pieces in a list and join once. Most operations that inspect or copy the whole string take O(n) time or more depending on the searched pattern.",
    code: 'words = "  a,b,c  ".strip().split(",")\ntext = "-".join(words)\nupdated = text.replace("a", "A")\nposition = text.find("b")  # -1 if absent\ncount = text.count("-")\nstarts = text.startswith("a")\nends = text.endswith("c")\nletter = chr(ord("a") + 2)',
    gotcha:
      "Repeated concatenation can be quadratic. Slicing creates a copy and costs O(slice length).",
  },
  {
    title: "enumerate, zip, range, reversed",
    group: "Built-ins",
    description:
      "Use enumerate for index/value pairs and zip for parallel iteration. range and reversed are lazy sequence iterators. zip stops at the shortest input unless strict=True is used.",
    code: "for i, value in enumerate([7, 8], start=0):\n    print(i, value)\nfor a, b in zip([1, 2], [3, 4]):\n    print(a + b)\nfor i in range(5, -1, -1):\n    print(i)\nbackward = list(reversed([1, 2, 3]))",
    gotcha:
      "range excludes its stop value. reversed does not mutate the original list.",
  },
  {
    title: "min, max, sum, len, any, all",
    group: "Built-ins",
    description:
      "min/max/sum/any/all scan their input; any and all short-circuit. len is O(1) on built-in lists, tuples, strings, sets, and dictionaries.",
    code: "values = [2, 5, 1]\nsmallest = min(values)\nlargest = max(values)\ntotal = sum(values)\nlength = len(values)\nhas_negative = any(x < 0 for x in values)\nall_positive = all(x > 0 for x in values)\nsafe_min = min([], default=0)",
    gotcha:
      "all([]) is True and any([]) is False. min/max on an empty iterable need a default or raise ValueError.",
  },
  {
    title: "sorted, sort, lambda, multiple keys",
    group: "Sorting",
    description:
      "sorted returns a new list; list.sort mutates in place. Python sorting is stable and O(n log n) worst-case. A key is computed once per item.",
    code: 'pairs = [(2, 3), (1, 7), (2, 1)]\nordered = sorted(pairs, key=lambda p: (p[0], -p[1]))\ncounts = {"a": 2, "b": 5}\nby_count = sorted(counts, key=counts.get, reverse=True)\nsmallest_key = min(counts)\nmost_frequent_key = max(counts, key=counts.get)',
    gotcha:
      "Sorting a dictionary iterates keys. min(d) finds the smallest key, not the smallest value.",
  },
  {
    title: "Counter and defaultdict",
    group: "Standard library",
    description:
      "Counter counts occurrences; defaultdict creates a missing value on indexed access. Both help express hashing patterns without repeated membership branches.",
    code: 'from collections import Counter, defaultdict\ncounts = Counter("banana")\nfrequency = counts["a"]\nmost_common = counts.most_common(2)\ngroups = defaultdict(list)\nfor word in ["eat", "tea", "tan"]:\n    groups[tuple(sorted(word))].append(word)',
    gotcha:
      "defaultdict.get does not create a missing entry. Keys must be hashable: use tuples rather than lists.",
  },
  {
    title: "deque: queues and two-ended operations",
    group: "Standard library",
    description:
      "deque supports O(1) appends and pops at both ends. It is the standard BFS queue and is useful for monotonic queues.",
    code: "from collections import deque\nqueue = deque([0])\nqueue.append(1)\nnode = queue.popleft()\nqueue.appendleft(2)\nlast = queue.pop()",
    gotcha:
      "Random access in the middle of a deque is O(n); use a list for indexed access.",
  },
  {
    title: "heapq: min heap and portable max heap",
    group: "Standard library",
    description:
      "heapify builds in O(n); heappush/heappop cost O(log n); heap[0] is the minimum in O(1). Negation gives a portable max heap for numeric values.",
    code: 'import heapq\nheap = [5, 1, 4]\nheapq.heapify(heap)\nheapq.heappush(heap, 2)\nsmallest = heapq.heappop(heap)\nmax_heap = [-x for x in [5, 1, 4]]\nheapq.heapify(max_heap)\nlargest = -heapq.heappop(max_heap)\n# tuple entries sort by priority, then a unique tie-breaker\nentry = (3, 0, "task")',
    gotcha:
      "Heap arrays are only partially ordered. Equal priorities can trigger comparison of payloads; add a unique sequence number if payloads are not comparable.",
  },
  {
    title: "bisect_left and bisect_right",
    group: "Standard library",
    description:
      "On sorted data, bisect_left finds the first position with value ≥ x; bisect_right finds the first with value > x. Each search is O(log n).",
    code: "from bisect import bisect_left, bisect_right, insort\nnums = [1, 2, 2, 4]\nleft = bisect_left(nums, 2)   # 1\nright = bisect_right(nums, 2) # 3\ncount = right - left         # 2\ninsort(nums, 3)              # O(n) shifting",
    gotcha:
      "Binary search is logarithmic, but inserting into a Python list still costs O(n). The input must stay sorted.",
  },
  {
    title: "cache and lru_cache",
    group: "Standard library",
    description:
      "Memoization stores function results by arguments. cache is unbounded; lru_cache(maxsize=None) is equivalent. Arguments must be hashable.",
    code: "from functools import cache\n\ndef count_ways(n):\n    @cache\n    def ways(remaining):\n        if remaining < 0:\n            return 0\n        if remaining == 0:\n            return 1\n        return ways(remaining - 1) + ways(remaining - 2)\n    return ways(n)",
    gotcha:
      "Caching does not eliminate recursion depth limits. Define a cache inside the outer function when results depend on that call’s input.",
  },
  {
    title: "itertools: combinations, permutations, product",
    group: "Standard library",
    description:
      "These produce lazy iterators, but consuming them can still require exponential or factorial work. combinations ignores order; permutations keeps it.",
    code: "from itertools import combinations, permutations, product, accumulate\npairs = list(combinations([1, 2, 3], 2))\norders = list(permutations([1, 2, 3]))\nbits = list(product([0, 1], repeat=3))\nprefix = [0, *accumulate([2, -1, 4])]",
    gotcha:
      "An iterator avoids storing all outputs at once; it does not make producing every output cheap.",
  },
  {
    title: "math, abs, divmod, numeric conversion",
    group: "Built-ins",
    description:
      "Use integer arithmetic when the result must be exact. divmod returns quotient and remainder. math.isqrt gives an exact integer square root.",
    code: 'import math\nquotient, remainder = divmod(17, 5) # (3, 2)\nceiling = (17 + 5 - 1) // 5       # positive operands\nroot = math.isqrt(99)             # 9\ngcd = math.gcd(12, 18)            # 6\ndistance = abs(-7)\nnumber = int("101", 2)            # 5\ninfinity = float("inf")\ntext = str(42)',
    gotcha:
      "// floors toward negative infinity: -3 // 2 == -2. int(-3 / 2) truncates toward zero, but float conversion can lose precision for huge integers.",
  },
  {
    title: "Comprehensions, map and filter",
    group: "Python basics",
    description:
      "Comprehensions build collections. Generator expressions produce values lazily. map and filter also return iterators in Python 3.",
    code: 'squares = [x*x for x in range(5)]\nlookup = {x: x*x for x in range(5)}\nunique = {x % 3 for x in range(10)}\npositive = list(filter(lambda x: x > 0, [-1, 2, 3]))\nnumbers = list(map(int, ["1", "2"]))\ntotal = sum(x*x for x in range(100))',
    gotcha:
      "A list comprehension stores every output. A generator can be exhausted after one pass.",
  },
  {
    title: "Scope, functions, nonlocal, type hints",
    group: "Python basics",
    description:
      "Assignment inside a function creates a local binding unless declared nonlocal or global. nonlocal refers to an enclosing function binding; mutating an existing list does not rebind its name.",
    code: "def outer(values: list[int]) -> int:\n    best = 0\n    def visit(value: int) -> None:\n        nonlocal best\n        best = max(best, value)\n    for value in values:\n        visit(value)\n    return best",
    gotcha:
      "Type hints document intent; Python does not enforce them at runtime. global refers to module scope, not the nearest enclosing function.",
  },
  {
    title: "Slicing, unpacking, tuples and copies",
    group: "Python basics",
    description:
      "Negative indices count from the end. Slices use [start:stop:step] and exclude stop. A shallow copy duplicates the outer container but shares nested objects.",
    code: "values = [1, 2, 3, 4]\nlast = values[-1]\npart = values[1:3]\nreverse_copy = values[::-1]\nfirst, *middle, last = values\na, b = 1, 2\na, b = b, a\npoint = (3, 4)\ncopy = values[:]",
    gotcha:
      "A tuple can be a dictionary key only if every contained item is hashable. A tuple containing a list is not hashable.",
  },
  {
    title: "Independent matrix rows",
    group: "Gotchas",
    description:
      "Repeating a list of mutable objects repeats references. A comprehension creates a separate row for each iteration.",
    code: "bad = [[0] * 3] * 3\nbad[0][0] = 1  # every row now begins with 1\ngood = [[0] * 3 for _ in range(3)]\ngood[0][0] = 1 # only the first row changes",
    gotcha:
      "The same issue applies to lists of sets, dictionaries, or custom mutable objects.",
  },
  {
    title: "Mutable default arguments",
    group: "Gotchas",
    description:
      "A default argument is evaluated once when the function is defined. Use None to request a fresh mutable container per call.",
    code: "def collect(value, items=None):\n    if items is None:\n        items = []\n    items.append(value)\n    return items",
    gotcha: "def collect(value, items=[]) reuses the same list across calls.",
  },
  {
    title: "Truthiness and safe mutation",
    group: "Gotchas",
    description:
      "Empty containers, zero, None, and False are falsy. Use explicit is None when zero is a valid answer. Rebuild a list rather than deleting from it during forward iteration.",
    code: 'answer = 0\nif answer is not None:\n    print(answer)\nvalues = [0, 1, 0, 2]\nvalues = [x for x in values if x != 0]\nfor key in list({"a": 1, "b": 2}):\n    pass',
    gotcha:
      "if answer would wrongly treat the valid result 0 as missing. Floating point also needs tolerance when comparing approximate results.",
  },
];
