+++
title = "Python Interview Cheat Sheet"
date = "2026-11-06"
description = "A last-minute review of Python for coding interviews: data structures and their complexity, idioms, iterators, pitfalls, and algorithm templates."

[extra]
toc = true
+++

**How to read this page.** In the code, `# =>` is the value of the line, `# xs ==
...` is the state after it runs, and `# raises` is the exception it throws.

In the tables, complexities are for CPython. `n` is the size of the collection
and `k` is the size of the other thing involved (a slice, a second collection, a
requested count). Extra space excludes the collection itself. Dict and set
timings are averages; hash collisions make the worst case O(n), though you can
treat them as O(1) in an interview unless asked.

Features newer than Python 3.8 are tagged with their version, because online
judges and interview platforms can lag behind.

## Which structure do I need?

| I need to... | Use | Because |
|---|---|---|
| Access by position, push and pop at one end | `list` | O(1) index, amortised O(1) append |
| Use a stack | `list` | `append` and `pop` |
| Use a queue, or add and remove at both ends | `collections.deque` | O(1) at both ends |
| Test membership or remove duplicates | `set` | O(1) `in` |
| Map a key to a value | `dict` | O(1) lookup, keeps insertion order |
| Count things | `collections.Counter` | Missing keys count as 0 |
| Group things by key | `collections.defaultdict(list)` | No need to initialise each key |
| Repeatedly get the smallest or largest | `heapq` | O(log n) push and pop |
| Keep a sorted list with few inserts | `bisect` | O(log n) search |
| Use a composite or immutable key | `tuple`, `frozenset` | Hashable |
| Build an LRU cache | `collections.OrderedDict` | O(1) move to either end |

## Core data types

### list

A dynamic array. Fast at the end, slow at the front and middle.

```python
xs = [3, 1, 2]

# Add
xs.append(4)        # xs == [3, 1, 2, 4]
xs.insert(0, 9)     # xs == [9, 3, 1, 2, 4]
xs.extend([5, 6])   # xs == [9, 3, 1, 2, 4, 5, 6]

# Remove
xs.pop()            # => 6
xs.pop(0)           # => 9
xs.remove(2)        # xs == [3, 1, 4, 5]
del xs[0]           # xs == [1, 4, 5]
xs.remove(99)       # raises ValueError

# Query
len(xs)             # => 3
4 in xs             # => True
xs.index(4)         # => 1
xs.count(4)         # => 1
xs[-1]              # => 5

# Reorder in place (both return None)
xs.reverse()        # xs == [5, 4, 1]
xs.sort()           # xs == [1, 4, 5]

# Copy
ys = xs.copy()      # ys == [1, 4, 5]
```

| Operation | Time | Extra space |
|---|---|---|
| `xs[i]`, `xs[i] = v`, `len(xs)` | O(1) | O(1) |
| `xs.append(v)`, `xs.pop()` | O(1) amortised | O(1) |
| `xs.insert(i, v)`, `xs.pop(i)`, `del xs[i]` | O(n) | O(1) |
| `xs.remove(v)`, `v in xs`, `xs.index(v)`, `xs.count(v)` | O(n) | O(1) |
| `xs.extend(ys)` | O(k) | O(k) |
| `xs[a:b]` | O(k) | O(k) |
| `xs + ys`, `xs.copy()` | O(n + k), O(n) | same as time |
| `xs * k` | O(nk) | O(nk) |
| `min(xs)`, `max(xs)`, `sum(xs)`, `xs.reverse()` | O(n) | O(1) |
| `xs.sort()`, `sorted(xs)` | O(n log n) | O(n) |

**Adding and removing out of order:**

```python
# Remove at index i when order doesn't matter: swap with the last, then pop. O(1).
xs = [10, 20, 30, 40]
i = 1
xs[i], xs[-1] = xs[-1], xs[i]
xs.pop()            # => 20
xs                  # => [10, 40, 30]

# Remove many: filter once in O(n), rather than calling remove() in a loop, O(n^2).
xs = [1, 2, 3, 4, 5, 6]
keep = [x for x in xs if x % 2]   # keep == [1, 3, 5]

# Insert and keep sorted: O(log n) to find the place, O(n) to shift.
from bisect import insort
xs = [1, 3, 5]
insort(xs, 4)       # xs == [1, 3, 4, 5]
```

### Slicing

Works on `list`, `tuple`, and `str`. Slices copy, and out-of-range bounds don't
raise.

```python
xs = [0, 1, 2, 3, 4, 5]

xs[1:4]             # => [1, 2, 3]
xs[:2]              # => [0, 1]
xs[-2:]             # => [4, 5]
xs[:-2]             # => [0, 1, 2, 3]
xs[::2]             # => [0, 2, 4]
xs[::-1]            # => [5, 4, 3, 2, 1, 0]
xs[:]               # => [0, 1, 2, 3, 4, 5]
xs[4:100]           # => [4, 5]

# Assigning to a slice can change the list's length
xs[1:3] = [9]       # xs == [0, 9, 3, 4, 5]
del xs[::2]         # xs == [9, 4]
```

### tuple

An immutable sequence, hashable if its contents are. Use it for dict keys, set
members, and heap entries.

```python
point = (1, 2)
single = (1,)       # The comma makes the tuple, not the parentheses
x, y = point        # x == 1

seen = {(0, 0), (0, 1)}
(0, 1) in seen      # => True

# Tuples compare element by element, which is what makes them good sort keys
(1, 2) < (1, 3)     # => True

point[0] = 5        # raises TypeError
```

Index is O(1), `in` is O(n), slicing is O(k).

### str

Immutable, so every "change" builds a new string.

```python
s = "  Hello, World  "

s.strip()                   # => 'Hello, World'
s.strip().lower()           # => 'hello, world'
s.strip().upper()           # => 'HELLO, WORLD'
"a,b,c".split(",")          # => ['a', 'b', 'c']
"a  b c".split()            # => ['a', 'b', 'c']
"-".join(["a", "b"])        # => 'a-b'
"hello".replace("l", "L")   # => 'heLLo'
"hello".find("l")           # => 2
"hello".find("z")           # => -1
"hello".startswith("he")    # => True
"hello"[::-1]               # => 'olleh'

"a1".isalnum()              # => True
"a".isalpha()               # => True
"1".isdigit()               # => True

# Build with a list and join, never += in a loop
"".join(c for c in "a1b2" if c.isalpha())   # => 'ab'

# To edit characters, convert to a list and back
chars = list("cat")
chars[0] = "b"
"".join(chars)              # => 'bat'

# Character arithmetic
ord("c") - ord("a")         # => 2
chr(ord("a") + 2)           # => 'c'

from string import ascii_lowercase, digits
ascii_lowercase[:3]         # => 'abc'
digits[:3]                  # => '012'
```

| Operation | Time | Extra space |
|---|---|---|
| `s[i]`, `len(s)` | O(1) | O(1) |
| `s + t` | O(n + k) | O(n + k) |
| `"".join(parts)` | O(total length) | O(total length) |
| `s[a:b]` | O(k) | O(k) |
| `s.split()`, `s.replace()`, `s.strip()`, `s.lower()`, `s[::-1]` | O(n) | O(n) |
| `t in s`, `s.find(t)` | O(n) typical, assume O(nk) worst | O(1) |

Hashing a string is O(n) the first time, so a dict lookup keyed by a long string
isn't really O(1). This matters when you use strings as memo keys.

### dict

A hash map that preserves insertion order (guaranteed since 3.7). Keys must be
hashable.

```python
d = {"a": 1, "b": 2}

# Read
d["a"]              # => 1
d["z"]              # raises KeyError
d.get("z")          # => None
d.get("z", 0)       # => 0
"a" in d            # => True

# Add and update
d["c"] = 3          # d == {"a": 1, "b": 2, "c": 3}
d.update(a=10)      # d == {"a": 10, "b": 2, "c": 3}
d.setdefault("e", 5)        # => 5
d.setdefault("e", 99)       # => 5

# Remove
del d["e"]          # d == {"a": 10, "b": 2, "c": 3}
d.pop("c")          # => 3
d.pop("z", None)    # => None
d.popitem()         # => ('b', 2)

# Iterate
d = {"a": 1, "b": 2}
list(d)             # => ['a', 'b']
list(d.values())    # => [1, 2]
list(d.items())     # => [('a', 1), ('b', 2)]

# Merge (the right side wins)
{**d, "b": 9}       # => {'a': 1, 'b': 9}
# 3.9+
d | {"b": 9}        # => {'a': 1, 'b': 9}

# Most recently inserted key without removing it, O(1)
next(reversed(d))   # => 'b'
```

| Operation | Time | Extra space |
|---|---|---|
| `d[k]`, `d[k] = v`, `del d[k]`, `k in d`, `d.get(k)`, `d.pop(k)` | O(1) | O(1) |
| `d.popitem()` | O(1) | O(1) |
| `d.keys()`, `d.values()`, `d.items()` (views) | O(1) | O(1) |
| Iterating over any of the above | O(n) | O(1) |
| `d.copy()`, `{**d}` | O(n) | O(n) |
| `d.update(other)` | O(k) | O(k) |

`v in d.values()` is O(n). The first key is `next(iter(d))`, which is O(1) unless
many keys have been deleted from the front.

### set

An unordered hash set with unique, hashable members.

```python
s = {1, 2, 3}
empty = set()       # {} is an empty dict, not an empty set

s.add(4)            # s == {1, 2, 3, 4}
s.discard(99)       # s == {1, 2, 3, 4}
s.remove(99)        # raises KeyError
s.remove(4)         # s == {1, 2, 3}
2 in s              # => True

a, b = {1, 2, 3}, {2, 3, 4}
a | b               # => {1, 2, 3, 4}
a & b               # => {2, 3}
a - b               # => {1}
a ^ b               # => {1, 4}
{2} <= a            # => True

# Remove duplicates, keeping the first-seen order
list(dict.fromkeys([3, 1, 3, 2, 1]))    # => [3, 1, 2]

# A set of sets needs frozenset
{frozenset({1, 2})} == {frozenset({2, 1})}    # => True
```

| Operation | Time | Extra space |
|---|---|---|
| `s.add(v)`, `s.remove(v)`, `s.discard(v)`, `v in s` | O(1) | O(1) |
| `a \| b` | O(len(a) + len(b)) | O(len(a) + len(b)) |
| `a & b` | O(min(len(a), len(b))) | O(min(len(a), len(b))) |
| `a - b`, `a <= b` | O(len(a)) | O(len(a)), O(1) |
| `a ^ b` | O(len(a) + len(b)) | O(len(a) + len(b)) |
| `set(xs)` | O(n) | O(n) |

### collections.deque

A double-ended queue. Use it for BFS, and for sliding windows that need both
ends. `list.pop(0)` is the classic slow substitute.

```python
from collections import deque

q = deque([1, 2, 3])
q.append(4)         # q == deque([1, 2, 3, 4])
q.appendleft(0)     # q == deque([0, 1, 2, 3, 4])
q.pop()             # => 4
q.popleft()         # => 0
q[0]                # => 1
q[-1]               # => 3

q.rotate(1)         # q == deque([3, 1, 2])
q.rotate(-1)        # q == deque([1, 2, 3])

# A bounded deque silently drops from the far end: "the last k items"
last_two = deque([1, 2, 3], maxlen=2)   # last_two == deque([2, 3])
```

| Operation | Time | Extra space |
|---|---|---|
| `append`, `appendleft`, `pop`, `popleft` | O(1) | O(1) |
| `q[0]`, `q[-1]`, `len(q)` | O(1) | O(1) |
| `q[i]` in the middle | O(n) | O(1) |
| `q.insert(i, v)`, `q.remove(v)`, `v in q` | O(n) | O(1) |
| `q.rotate(k)` | O(k) | O(1) |

### collections.Counter

A dict subclass for counting.

```python
from collections import Counter

c = Counter("banana")
c["a"]                  # => 3
c["z"]                  # => 0
"z" in c                # => False
c.most_common(1)        # => [('a', 3)]
sum(c.values())         # => 6

c.update("aa")          # c["a"] == 5
c["b"] -= 1             # c["b"] == 0
"b" in c                # => True

# Anagram check
Counter("listen") == Counter("silent")      # => True

# Arithmetic drops zero and negative counts
Counter("aab") - Counter("ab")              # => Counter({'a': 1})
```

Building is O(n) time and O(unique) space. `most_common(k)` is O(n log k), and
`most_common()` is O(n log n).

### collections.defaultdict

A dict that builds a default for a missing key. Reading a missing key with
`d[k]` inserts it, so test with `in` or `.get()` when you don't want that.

```python
from collections import defaultdict

groups = defaultdict(list)
for word in ["eat", "tea", "tan"]:
    groups["".join(sorted(word))].append(word)
dict(groups)            # => {'aet': ['eat', 'tea'], 'ant': ['tan']}

counts = defaultdict(int)
counts["x"] += 1        # counts["x"] == 1

graph = defaultdict(set)
graph["a"].add("b")     # graph["a"] == {"b"}
```

### collections.OrderedDict

Plain dicts keep order too. Reach for `OrderedDict` when you need to move a key
to an end or pop from the front, which is the core of an LRU cache. Both are
O(1).

```python
from collections import OrderedDict

od = OrderedDict(a=1, b=2, c=3)
od.move_to_end("a")         # list(od) == ["b", "c", "a"]
od.popitem(last=False)      # => ('b', 2)
od.popitem()                # => ('a', 1)
```

### heapq

A binary **min**-heap stored in a plain list. `h[0]` is always the smallest, but
the rest of the list isn't sorted.

```python
import heapq

nums = [5, 1, 4]
heapq.heapify(nums)             # nums[0] == 1
heapq.heappush(nums, 0)         # nums[0] == 0
nums[0]                         # => 0
heapq.heappop(nums)             # => 0
heapq.heappop(nums)             # => 1

# Max-heap: negate on the way in and out
h = []
heapq.heappush(h, -5)
heapq.heappush(h, -9)
-heapq.heappop(h)               # => 9

# Priority queue. The counter breaks ties, so the items are never compared.
from itertools import count
tiebreak = count()
pq = []
heapq.heappush(pq, (1, next(tiebreak), {"task": "a"}))
heapq.heappush(pq, (1, next(tiebreak), {"task": "b"}))
heapq.heappop(pq)[2]            # => {'task': 'a'}

# Top k
heapq.nlargest(2, [1, 5, 3])    # => [5, 3]
heapq.nsmallest(2, [1, 5, 3])   # => [1, 3]
heapq.nlargest(1, ["a", "bbb"], key=len)    # => ['bbb']
```

| Operation | Time | Extra space |
|---|---|---|
| `h[0]` | O(1) | O(1) |
| `heapify(xs)` | O(n) | O(1) |
| `heappush`, `heappop`, `heapreplace`, `heappushpop` | O(log n) | O(1) |
| `nlargest(k, xs)`, `nsmallest(k, xs)` | O(n log k) | O(k) |

Python 3.14 adds `heappush_max`, `heappop_max`, and friends, but negating still
works everywhere.

### bisect

Binary search on a list that is already sorted.

```python
from bisect import bisect_left, bisect_right, insort

xs = [1, 3, 3, 5]
bisect_left(xs, 3)      # => 1
bisect_right(xs, 3)     # => 3
bisect_right(xs, 3) - bisect_left(xs, 3)    # => 2

# Is v present?
i = bisect_left(xs, 3)
i < len(xs) and xs[i] == 3      # => True

insort(xs, 4)           # xs == [1, 3, 3, 4, 5]
```

`bisect_left` and `bisect_right` are O(log n). `insort` is O(n), because of the
shift. The `key=` parameter needs 3.10+.

## Comprehensions

```python
nums = [1, 2, 3, 4]

# List
[x * x for x in nums]                   # => [1, 4, 9, 16]
[x for x in nums if x % 2 == 0]         # => [2, 4]
["even" if x % 2 == 0 else "odd" for x in nums[:2]]     # => ['odd', 'even']

# Set
{x % 2 for x in nums}                   # => {0, 1}

# Dict
{x: x * x for x in nums[:2]}            # => {1: 1, 2: 4}
{v: k for k, v in {"a": 1}.items()}     # => {1: 'a'}

# Generator: lazy, O(1) memory, no brackets needed as a sole argument
sum(x * x for x in nums)                # => 30

# Nested: the for clauses read in the same order as nested loops
matrix = [[1, 2], [3, 4]]
[x for row in matrix for x in row]      # => [1, 2, 3, 4]
[[row[i] for row in matrix] for i in range(2)]      # => [[1, 3], [2, 4]]

# All pairs i < j
[(i, j) for i in range(3) for j in range(i + 1, 3)]     # => [(0, 1), (0, 2), (1, 2)]
```

The position of `if` matters. A trailing `if` filters, and a leading `a if c else
b` chooses a value for every element.

## Sorting

`xs.sort()` sorts in place and returns `None`. `sorted(iterable)` returns a new
list and takes any iterable. Both are stable Timsort: O(n log n) time, O(n)
space, and close to O(n) on nearly sorted input.

```python
words = ["pear", "fig", "apple", "kiwi"]

sorted(words)                           # => ['apple', 'fig', 'kiwi', 'pear']
sorted(words, reverse=True)             # => ['pear', 'kiwi', 'fig', 'apple']
sorted(words, key=len)                  # => ['fig', 'pear', 'kiwi', 'apple']
sorted(words, key=lambda w: w[1])       # => ['pear', 'fig', 'kiwi', 'apple']

# Several keys: return a tuple. Negate numbers for descending.
sorted(words, key=lambda w: (-len(w), w))   # => ['apple', 'kiwi', 'pear', 'fig']

# Sort a dict by its values
d = {"a": 3, "b": 1, "c": 2}
sorted(d, key=d.get)                    # => ['b', 'c', 'a']
sorted(d.items(), key=lambda kv: kv[1]) # => [('b', 1), ('c', 2), ('a', 3)]
max(d, key=d.get)                       # => 'a'

# min and max take a key too
min(words, key=len)                     # => 'fig'

# Records: oldest first, then by name
people = [("Cat", 30), ("Bob", 25), ("Ann", 30)]
sorted(people, key=lambda p: (-p[1], p[0]))
# => [('Ann', 30), ('Cat', 30), ('Bob', 25)]

# The same result without negating, for keys you can't negate, such as strings:
# stability lets you sort by the least significant key first.
result = sorted(people, key=lambda p: p[0])
result = sorted(result, key=lambda p: p[1], reverse=True)
result
# => [('Ann', 30), ('Cat', 30), ('Bob', 25)]

# itemgetter and attrgetter are the tidy alternatives to lambda
from operator import itemgetter
sorted(people, key=itemgetter(1))       # => [('Bob', 25), ('Cat', 30), ('Ann', 30)]

# When the order depends on comparing two items: "largest number" from digits
from functools import cmp_to_key
def order(a, b):
    return -1 if a + b > b + a else 1
"".join(sorted(["3", "30", "34"], key=cmp_to_key(order)))   # => '34330'
```

## Initialising values

```python
# Fill
[0] * 3                     # => [0, 0, 0]
[None] * 2                  # => [None, None]
list(range(3))              # => [0, 1, 2]
dict.fromkeys("ab", 0)      # => {'a': 0, 'b': 0}

# 2D grid: the inner list must be built once per row
rows, cols = 2, 3
grid = [[0] * cols for _ in range(rows)]
grid[0][0] = 1
grid                        # => [[1, 0, 0], [0, 0, 0]]

# 26 letter counts
counts = [0] * 26
counts[ord("c") - ord("a")] += 1

# Bounds for min and max tracking
best = float("inf")
worst = float("-inf")

# Several at once, and swaps with no temporary
lo, hi = 0, 10
lo, hi = hi, lo             # lo == 10

# Star unpacking
first, *rest = [1, 2, 3]    # rest == [2, 3]
first, *mid, last = [1, 2, 3, 4]    # mid == [2, 3]

# Count without Counter or defaultdict
freq = {}
for ch in "aab":
    freq[ch] = freq.get(ch, 0) + 1
freq                        # => {'a': 2, 'b': 1}

# Group without defaultdict
groups = {}
for n in [1, 2, 3]:
    groups.setdefault(n % 2, []).append(n)
groups                      # => {1: [1, 3], 0: [2]}

# Build a dict from two lists, or an adjacency list from edges
from collections import defaultdict
dict(zip("ab", [1, 2]))     # => {'a': 1, 'b': 2}

graph = defaultdict(list)
for u, v in [(1, 2), (2, 3)]:
    graph[u].append(v)
    graph[v].append(u)
graph[2]                    # => [1, 3]

# Conditional expression and chained comparison
x = 5
"big" if x > 3 else "small" # => 'big'
0 <= x < 10                 # => True

# Assign inside an expression (3.8+)
if (n := len("abc")) > 2:
    size = n
size                        # => 3
```

## Iterators and functional tools

Most of these are lazy: they cost O(1) memory until consumed, and can be consumed
only once. Wrap them in `list()` to materialise or inspect them.

### Built-ins

```python
nums = [3, 1, 2]

# enumerate: index and value
list(enumerate("ab"))           # => [(0, 'a'), (1, 'b')]
list(enumerate("ab", start=1))  # => [(1, 'a'), (2, 'b')]

# zip: stops at the shortest input
list(zip("ab", [1, 2, 3]))      # => [('a', 1), ('b', 2)]

# Unzip and transpose
names, ages = zip(*[("Ann", 30), ("Bob", 25)])
names                           # => ('Ann', 'Bob')
list(map(list, zip(*[[1, 2], [3, 4]])))     # => [[1, 3], [2, 4]]

# Adjacent pairs
list(zip(nums, nums[1:]))       # => [(3, 1), (1, 2)]

# map and filter
list(map(str, nums))            # => ['3', '1', '2']
list(map(lambda x: x * 2, nums))        # => [6, 2, 4]
list(filter(lambda x: x > 1, nums))     # => [3, 2]
a, b = map(int, "4 5".split())  # b == 5

# Reversed and range
list(reversed(nums))            # => [2, 1, 3]
list(range(5, 0, -2))           # => [5, 3, 1]

# Aggregates: any and all short-circuit
any(x > 2 for x in nums)        # => True
all(x > 2 for x in nums)        # => False
sum(x > 1 for x in nums)        # => 2
min(nums), max(nums)            # => (1, 3)
min([], default=0)              # => 0
min([])                         # raises ValueError

# First match, with a fallback
next((x for x in nums if x > 5), None)  # => None
```

`zip(a, b, strict=True)` raises if the lengths differ (3.10+).

### Generators

A function with `yield` pauses between values, so it holds O(1) state however long
the sequence is.

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

list(countdown(3))      # => [3, 2, 1]

# yield from delegates to another iterable
def flatten(items):
    for item in items:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item

list(flatten([1, [2, [3]]]))    # => [1, 2, 3]

# Driving an iterator by hand
it = iter([1, 2])
next(it)                # => 1
next(it)                # => 2
next(it, "done")        # => 'done'
next(it)                # raises StopIteration

# Generators are single-use
gen = (x for x in [1, 2])
list(gen)               # => [1, 2]
list(gen)               # => []
```

### itertools

```python
from itertools import (accumulate, chain, combinations, count, groupby, islice,
                       permutations, product, zip_longest)
import operator

# Combinatorics: output sizes are n!/(n-k)!, n!/(k!(n-k)!), and n^k
list(permutations([1, 2, 3], 2))[:2]        # => [(1, 2), (1, 3)]
list(combinations([1, 2, 3], 2))            # => [(1, 2), (1, 3), (2, 3)]
list(product("ab", [1, 2]))[:2]             # => [('a', 1), ('a', 2)]
list(product([0, 1], repeat=2))[:2]         # => [(0, 0), (0, 1)]

# Running totals
list(accumulate([1, 2, 3]))                 # => [1, 3, 6]
list(accumulate([3, 1, 2], max))            # => [3, 3, 3]
list(accumulate([1, 2, 3], operator.mul))   # => [1, 2, 6]

# Join and flatten
list(chain([1], [2, 3]))                    # => [1, 2, 3]
list(chain.from_iterable([[1], [2, 3]]))    # => [1, 2, 3]

# Slice any iterator
list(islice(count(10), 2))                  # => [10, 11]

# zip to the longest input
list(zip_longest("ab", [1], fillvalue=0))   # => [('a', 1), ('b', 0)]

# groupby groups *adjacent* items, so sort first unless you want runs
[(k, len(list(g))) for k, g in groupby("aabbba")]   # => [('a', 2), ('b', 3), ('a', 1)]
```

Newer additions: `pairwise(xs)` gives adjacent pairs (3.10+), and `batched(xs, n)`
gives chunks of n (3.12+).

### functools

```python
from functools import cache, lru_cache, reduce
import operator

reduce(operator.mul, [1, 2, 3, 4])      # => 24
reduce(operator.xor, [1, 2, 1])         # => 2

# Memoise a recursive function. Arguments must be hashable.
@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

fib(50)                 # => 12586269025
```

`@cache` is shorthand for `@lru_cache(maxsize=None)` (3.9+). Both use O(unique
arguments) memory.

## Numbers and bits

```python
import math

# Integers have arbitrary precision, so they don't overflow
2 ** 100 > 10 ** 30     # => True

# // and % floor towards negative infinity
7 // 2                  # => 3
-7 // 2                 # => -4
-7 % 3                  # => 2
divmod(7, 2)            # => (3, 1)

# To truncate towards zero, as C and Java do
int(-7 / 2)             # => -3

# Rounding
math.floor(2.5)         # => 2
math.ceil(2.1)          # => 3
round(2.5)              # => 2
round(3.5)              # => 4

# Integer ceiling division, with no floats involved
-(-7 // 2)              # => 4

# Maths helpers
math.gcd(12, 18)        # => 6
math.isqrt(17)          # => 4
math.comb(5, 2)         # => 10
math.factorial(4)       # => 24
pow(2, 10, 1000)        # => 24
abs(-3)                 # => 3

# Floats
0.1 + 0.2 == 0.3                # => False
math.isclose(0.1 + 0.2, 0.3)    # => True

# Bases and formatting
bin(5)                  # => '0b101'
int("101", 2)           # => 5
int("ff", 16)           # => 255
f"{5:04b}"              # => '0101'
f"{3.14159:.2f}"        # => '3.14'

# Bit tricks
x = 0b1100
x & 1                   # => 0
x >> 1                  # => 6
x << 1                  # => 24
x | 1                   # => 13
x ^ x                   # => 0
x & (x - 1)             # => 8
x & -x                  # => 4
x & (1 << 2) != 0       # => True
bin(x).count("1")       # => 2
```

`x & (x - 1)` clears the lowest set bit, and `x & -x` isolates it. `x.bit_count()`
needs 3.10+, and `math.lcm` needs 3.9+. Arbitrary precision isn't free: arithmetic
on very large integers costs more than O(1).

## Common pitfalls

```python
# 1. Sharing one inner list between rows
bad = [[0] * 2] * 2
bad[0][0] = 1
bad                     # => [[1, 0], [1, 0]]

# 2. A mutable default is shared between calls
def append_bad(x, items=[]):
    items.append(x)
    return items
append_bad(1)
append_bad(2)           # => [1, 2]

def append_good(x, items=None):
    items = [] if items is None else items
    items.append(x)
    return items
append_good(1)
append_good(2)          # => [2]

# 3. sort() returns None
xs = [2, 1]
result = xs.sort()      # result == None

# 4. Mutating a dict while iterating over it. Iterate over a copy of the keys.
d = {"a": 1, "b": 2}
for k in list(d):
    del d[k]
d                       # => {}

# 5. Mutating a list while iterating over it skips items
xs = [1, 1, 2]
for x in xs:
    if x == 1:
        xs.remove(x)
xs                      # => [1, 2]

# 6. Shallow copies share nested objects
import copy
a = [[1]]
shallow = a.copy()
deep = copy.deepcopy(a)
a[0].append(2)
shallow                 # => [[1, 2]]
deep                    # => [[1]]

# 7. Backtracking: append a copy, not the list you keep mutating
path, out = [1], []
out.append(path)
out.append(path[:])
path.append(2)
out                     # => [[1, 2], [1]]

# 8. Lists aren't hashable. Convert to a tuple first.
{(1, 2): "ok"}[tuple([1, 2])]   # => 'ok'
{[1, 2]: "no"}                  # raises TypeError

# 9. Closures capture variables, not values
fns = [lambda: i for i in range(3)]
[f() for f in fns]              # => [2, 2, 2]
fns = [lambda i=i: i for i in range(3)]
[f() for f in fns]              # => [0, 1, 2]

# 10. `or` replaces every falsy value, including a legitimate 0
count = 0
count or 10                     # => 10
count if count is not None else 10  # => 0

# 11. is compares identity. Use it for None, and == for values.
[1] == [1]              # => True
[1] is [1]              # => False

# 12. Assigning to an outer variable from a nested function needs nonlocal
def counter():
    total = 0
    def bump():
        nonlocal total
        total += 1
    bump()
    return total
counter()               # => 1
```

**Hidden quadratics:**

| Looks harmless | Costs | Instead |
|---|---|---|
| `s += c` in a loop | O(n²) worst case | Build a list, then `"".join(parts)` |
| `xs.pop(0)` in a loop | O(n²) | `deque.popleft()` |
| `x in xs` in a loop | O(n²) | Build a `set` first |
| `xs[1:]` in recursion | O(n²) time and space | Pass an index |
| `sum(lists, [])` to flatten | O(n²) | `chain.from_iterable(lists)` |
| `xs.remove(v)` in a loop | O(n²) | Filter with a comprehension |

**Recursion:** the default depth limit is 1000, so a deep recursive DFS raises
`RecursionError`. Use an explicit stack, or call `sys.setrecursionlimit(10**6)`.
Recursion uses O(depth) stack space, which counts towards your space complexity.
Python doesn't optimise tail calls.

## Classes and language basics

```python
from dataclasses import dataclass, field

@dataclass(frozen=True, order=True)
class Point:
    x: int
    y: int = 0

Point(1) == Point(1, 0)         # => True
Point(1, 2) < Point(2, 0)       # => True
len({Point(1), Point(1)})       # => 1

@dataclass
class Bag:
    # A mutable default has to go through a factory
    items: list = field(default_factory=list)

Bag().items                     # => []

# A hand-written class, ordered so that it works in a heap or with sorted()
class Task:
    def __init__(self, priority, name):
        self.priority = priority
        self.name = name

    def __lt__(self, other):
        return self.priority < other.priority

    def __eq__(self, other):
        return (self.priority, self.name) == (other.priority, other.name)

    # Defining __eq__ removes the default __hash__, so bring it back
    def __hash__(self):
        return hash((self.priority, self.name))

    def __repr__(self):
        return f"Task({self.priority}, {self.name!r})"

min(Task(2, "b"), Task(1, "a"))     # => Task(1, "a")
len({Task(1, "a"), Task(1, "a")})   # => 1

# Exceptions
def safe_div(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
    finally:
        pass  # Runs either way: release resources here

safe_div(1, 0)                  # => None

# Debug print that shows the expression too
value = 3
f"{value=}"                     # => 'value=3'
```

Type hints from a typical judge's starter code: `list[int]` (3.9+), `int | None`
(3.10+), and on older versions `from typing import List, Optional`.

For platforms that make you parse stdin yourself:

```python
import sys

n = int(sys.stdin.readline())
nums = list(map(int, sys.stdin.readline().split()))
rest = sys.stdin.read().split()

n               # => 3
nums            # => [1, 2, 3]
rest            # => ['x', 'y']
```

## Algorithm templates

### Binary search

Search for the boundary of a condition, not for a value. This one form covers
most variants. O(log n) time, O(1) space.

```python
def first_true(lo, hi, pred):
    """Smallest x in [lo, hi) where pred(x) is true, or hi if none is."""
    while lo < hi:
        mid = (lo + hi) // 2
        if pred(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo

first_true(0, 100, lambda x: x * x >= 50)       # => 8

xs = [1, 3, 5, 7]
first_true(0, len(xs), lambda i: xs[i] >= 5)    # => 2
```

### Two pointers

O(n) time, O(1) space, for sorted input.

```python
def two_sum_sorted(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        total = nums[lo] + nums[hi]
        if total == target:
            return lo, hi
        if total < target:
            lo += 1
        else:
            hi -= 1
    return None

two_sum_sorted([1, 2, 4, 7], 6)     # => (1, 2)
```

### Hash map lookup

O(n) time, O(n) space, for unsorted input.

```python
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return seen[target - x], i
        seen[x] = i
    return None

two_sum([3, 2, 4], 6)               # => (1, 2)
```

### Sliding window

Grow on the right and shrink on the left. O(n) time, O(alphabet) space.

```python
def longest_unique(s):
    last_seen = {}
    start = best = 0
    for i, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= start:
            start = last_seen[ch] + 1
        last_seen[ch] = i
        best = max(best, i - start + 1)
    return best

longest_unique("abcabcbb")          # => 3
```

### Prefix sums

O(n) to build and O(1) per range query.

```python
from itertools import accumulate

nums = [2, 4, 1, 3]
prefix = [0, *accumulate(nums)]     # prefix == [0, 2, 6, 7, 10]

# sum(nums[1:3])
prefix[3] - prefix[1]               # => 5
```

### Monotonic stack

For "next greater" and "previous smaller" problems. O(n) time and space, because
each index is pushed and popped at most once.

```python
def next_greater(nums):
    answer = [-1] * len(nums)
    stack = []
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            answer[stack.pop()] = x
        stack.append(i)
    return answer

next_greater([2, 1, 3, 0])          # => [3, 3, -1, -1]
```

### Merging intervals

O(n log n) time, O(n) space.

```python
def merge(intervals):
    merged = []
    for start, end in sorted(intervals):
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

merge([[8, 10], [1, 3], [2, 6]])    # => [[1, 6], [8, 10]]
```

### Linked lists

Reversing is O(n) time, O(1) space. A dummy head removes the special case for an
empty result.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev

def from_list(values):
    dummy = tail = ListNode()
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next

# Fast and slow pointers: the middle of the list, or cycle detection
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow

reverse(from_list([1, 2, 3])).val   # => 3
middle(from_list([1, 2, 3])).val    # => 2
```

### Binary trees

Traversals are O(n) time and O(height) space, and level order is O(width) space.

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(node):
    if node:
        yield from inorder(node.left)
        yield node.val
        yield from inorder(node.right)

def height(node):
    return 1 + max(height(node.left), height(node.right)) if node else 0

def level_order(root):
    levels, queue = [], deque([root] if root else [])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            queue.extend(c for c in (node.left, node.right) if c)
        levels.append(level)
    return levels

root = TreeNode(2, TreeNode(1), TreeNode(3))
list(inorder(root))     # => [1, 2, 3]
height(root)            # => 2
level_order(root)       # => [[2], [1, 3]]
```

### Graph BFS and DFS

Both are O(V + E) time and O(V) space. BFS finds shortest paths when edges are
unweighted.

```python
from collections import deque

graph = {"a": ["b", "c"], "b": ["d"], "c": ["d"], "d": []}

def bfs_distances(graph, start):
    dist = {start: 0}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for nxt in graph[node]:
            # Mark on enqueue, not on dequeue, or nodes get queued many times
            if nxt not in dist:
                dist[nxt] = dist[node] + 1
                queue.append(nxt)
    return dist

def dfs(graph, start):
    seen, stack = {start}, [start]
    while stack:
        node = stack.pop()
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                stack.append(nxt)
    return seen

bfs_distances(graph, "a")   # => {'a': 0, 'b': 1, 'c': 1, 'd': 2}
dfs(graph, "b")             # => {'b', 'd'}

# Neighbours on a grid
def neighbours(r, c, rows, cols):
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols:
            yield nr, nc

list(neighbours(0, 0, 2, 2))    # => [(1, 0), (0, 1)]
```

### Topological sort

Kahn's algorithm. O(V + E) time, O(V) space. A short result means a cycle.

```python
from collections import deque

def topo_sort(graph):
    indegree = {node: 0 for node in graph}
    for node in graph:
        for nxt in graph[node]:
            indegree[nxt] += 1
    queue = deque(n for n, d in indegree.items() if d == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return order if len(order) == len(graph) else None

topo_sort({"a": ["b"], "b": ["c"], "c": []})    # => ['a', 'b', 'c']
topo_sort({"a": ["b"], "b": ["a"]})             # => None
```

### Dijkstra

Shortest paths with non-negative weights. O(E log V) time, O(V + E) space.

```python
import heapq

def dijkstra(graph, start):
    dist = {start: 0}
    heap = [(0, start)]
    while heap:
        d, node = heapq.heappop(heap)
        # heapq has no decrease-key, so skip stale entries instead
        if d > dist[node]:
            continue
        for nxt, weight in graph[node]:
            if d + weight < dist.get(nxt, float("inf")):
                dist[nxt] = d + weight
                heapq.heappush(heap, (dist[nxt], nxt))
    return dist

g = {"a": [("b", 4), ("c", 1)], "b": [], "c": [("b", 2)]}
dijkstra(g, "a")        # => {'a': 0, 'b': 3, 'c': 1}
```

### Union-find

Near O(1) amortised per operation, O(n) space. Use it for connected components
and cycle detection in undirected graphs.

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.size[a] < self.size[b]:
            a, b = b, a
        self.parent[b] = a
        self.size[a] += self.size[b]
        return True

uf = UnionFind(3)
uf.union(0, 1)          # => True
uf.union(1, 0)          # => False
uf.find(0) == uf.find(1)    # => True
uf.find(0) == uf.find(2)    # => False
```

### Backtracking

Choose, explore, un-choose. Subsets are O(2ⁿ · n) time, permutations O(n! · n),
with O(n) space beyond the output.

```python
def subsets(nums):
    out, path = [], []
    def go(i):
        if i == len(nums):
            out.append(path[:])
            return
        go(i + 1)
        path.append(nums[i])
        go(i + 1)
        path.pop()
    go(0)
    return out

subsets([1, 2])         # => [[], [2], [1], [1, 2]]
```

### Dynamic programming

Top-down is usually quickest to write, and bottom-up lets you trim the space.
Time is the number of states times the work per state.

```python
from functools import lru_cache

# Top-down
def grid_paths(rows, cols):
    @lru_cache(maxsize=None)
    def go(r, c):
        if r == 0 or c == 0:
            return 1
        return go(r - 1, c) + go(r, c - 1)
    return go(rows - 1, cols - 1)

grid_paths(3, 3)        # => 6

# Bottom-up: fewest coins for an amount
def coin_change(coins, amount):
    dp = [0] + [float("inf")] * amount
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1

coin_change([1, 2, 5], 11)      # => 3
coin_change([2], 3)             # => -1
```

### Trie

O(length of the word) per operation. Nested dicts keep it short.

```python
class Trie:
    END = "$"

    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node[self.END] = True

    def _walk(self, text):
        node = self.root
        for ch in text:
            if ch not in node:
                return None
            node = node[ch]
        return node

    def contains(self, word):
        node = self._walk(word)
        return node is not None and self.END in node

    def has_prefix(self, prefix):
        return self._walk(prefix) is not None

t = Trie()
t.insert("cat")
t.contains("cat")       # => True
t.contains("ca")        # => False
t.has_prefix("ca")      # => True
```

### Common patterns as one-liners

```python
from collections import Counter
import heapq

nums = [1, 1, 1, 2, 2, 3]

# Top k frequent
[x for x, _ in Counter(nums).most_common(2)]    # => [1, 2]

# Kth largest
heapq.nlargest(2, nums)[-1]                     # => 2

# Palindrome
s = "racecar"
s == s[::-1]                                    # => True

# Group anagrams key
"".join(sorted("tea"))                          # => 'aet'

# Rotate a matrix 90 degrees clockwise
m = [[1, 2], [3, 4]]
[list(row) for row in zip(*m[::-1])]            # => [[3, 1], [4, 2]]

# The single number that isn't paired (XOR cancels pairs)
from functools import reduce
reduce(lambda a, b: a ^ b, [4, 1, 2, 1, 2])     # => 4
```

## Sizing up a problem

The input size often hints at the intended complexity. Assume Python manages very
roughly 10⁷ simple operations per second.

| Input size n | Target complexity | Typical approach |
|---|---|---|
| up to 20 | O(2ⁿ), O(n!) for n ≤ 10 | Backtracking, bitmask |
| up to 500 | O(n³) | Nested loops, interval DP |
| up to 5,000 | O(n²) | Nested loops, 2D DP |
| up to 10⁶ | O(n log n), O(n) | Sorting, heap, hash map, two pointers |
| above 10⁷ or so | O(log n), O(1) | Binary search, maths |

## Before saying you're done

- **Clarify first:** input size, value ranges, duplicates, negatives, sorted or
not, and what to return when there's no answer.
- **State the brute force and its complexity** before optimising.
- **Walk through a small example** by hand before running anything.
- **Test the edges:** empty input, a single element, all duplicates, negatives,
already sorted, the largest size.
- **Give the time and space complexity,** counting recursion depth and the
hidden costs of slices and `in`.
