export interface Trace {
  values: (number | string)[];
  active: number[];
  muted?: number[];
  variables: Record<string, string | number>;
  message: string;
  line: number;
  graph?: { nodes: string[]; edges: [number, number, number?][] };
  grid?: number[][];
}
export const visualAlgorithms = [
  ["binary-search", "Binary search"],
  ["sliding-window", "Sliding window"],
  ["two-pointers", "Two pointers"],
  ["dp", "1-D dynamic programming"],
  ["lcs", "2-D dynamic programming"],
  ["bfs", "Graph BFS"],
  ["dfs", "Graph DFS"],
  ["tree-bfs", "Tree BFS"],
  ["tree-dfs", "Tree DFS"],
  ["dijkstra", "Dijkstra"],
  ["bellman-ford", "Edge-limited Bellman–Ford"],
  ["topological", "Topological sorting"],
  ["union-find", "Union-Find"],
  ["monotonic-stack", "Monotonic stack"],
  ["stack", "Stack operations"],
  ["heap", "Heap operations"],
  ["merge-sort", "Merge sort"],
  ["linked-list", "Linked list reversal"],
  ["backtracking", "Backtracking"],
  ["greedy", "Greedy interval selection"],
  ["intervals", "Interval merging"],
  ["bits", "Bit manipulation"],
] as const;
export const defaults: Record<string, string> = {
  "binary-search": "2, 5, 8, 12, 16, 23, 38",
  "sliding-window": "abcabcbb",
  "two-pointers": "1, 3, 5, 7, 9",
  dp: "1, 3, 4",
  "monotonic-stack": "73, 74, 75, 71, 69, 72, 76, 73",
  "merge-sort": "8, 3, 5, 1, 9, 2",
  heap: "7, 3, 9, 1, 5",
  "linked-list": "1, 2, 3, 4",
  bits: "4, 1, 2, 1, 2",
  stack: "2, 5, 3",
  backtracking: "1, 2, 3",
};
export function makeTrace(id: string, input: string, target = 12): Trace[] {
  const steps: Trace[] = [];
  const emit = (
    values: (number | string)[],
    active: number[],
    variables: Record<string, string | number>,
    message: string,
    line = 1,
    extra: Partial<Trace> = {},
  ) =>
    steps.push({
      values: [...values],
      active: [...active],
      variables: { ...variables },
      message,
      line,
      ...extra,
    });
  const numbers = () => {
    const nums = input.trim()
      ? input.split(",").map((x) => Number(x.trim()))
      : [];
    if (
      nums.length > 20 ||
      nums.some(
        (n) =>
          !Number.isFinite(n) || !Number.isInteger(n) || Math.abs(n) > 1000000,
      ) ||
      input.split(",").some((x) => input.trim() && !x.trim())
    )
      throw new Error(
        "Use up to 20 comma-separated integers between −1,000,000 and 1,000,000.",
      );
    return nums;
  };
  if (id === "binary-search") {
    const a = numbers();
    if (a.some((v, i) => i > 0 && v < a[i - 1]))
      throw new Error(
        "Binary search needs sorted input. Enter values in ascending order.",
      );
    let left = 0,
      right = a.length - 1;
    emit(
      a,
      [],
      { left, right, target },
      "The target, if present, is inside the inclusive boundaries.",
    );
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      emit(
        a,
        [mid],
        { left, right, mid, target },
        `Inspect index ${mid}: ${a[mid]} ${a[mid] === target ? "matches" : a[mid] < target ? "is smaller than" : "is larger than"} ${target}.`,
        4,
        { muted: a.map((_, i) => i).filter((i) => i < left || i > right) },
      );
      if (a[mid] === target) {
        emit(
          a,
          [mid],
          { left, right, mid, result: mid },
          "Found the target. Return its index.",
          6,
        );
        return steps;
      }
      if (a[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    emit(
      a,
      [],
      { left, right, result: -1 },
      "The candidate interval is empty. The target is absent.",
      11,
      { muted: a.map((_, i) => i) },
    );
  } else if (id === "sliding-window") {
    if (input.length > 24)
      throw new Error("Use at most 24 characters for a readable trace.");
    const a = Array.from(input);
    let left = 0,
      best = 0;
    const seen = new Set<string>();
    emit(
      a,
      [],
      { left, right: -1, best, window: "" },
      "Start with an empty window.",
    );
    for (let right = 0; right < a.length; right++) {
      while (seen.has(a[right])) {
        const removed = a[left];
        seen.delete(removed);
        left++;
        emit(
          a,
          Array.from({ length: right - left }, (_, i) => left + i),
          { left, right, best, window: [...seen].join(""), valid: "repairing" },
          `Remove ${removed} from the left to clear the duplicate.`,
          7,
        );
      }
      seen.add(a[right]);
      best = Math.max(best, right - left + 1);
      emit(
        a,
        Array.from({ length: right - left + 1 }, (_, i) => left + i),
        {
          left,
          right,
          best,
          window: a.slice(left, right + 1).join(""),
          valid: "yes",
        },
        `Add ${a[right]}. The window has no repeated characters.`,
        10,
      );
    }
    emit(
      a,
      [],
      { result: best },
      `Longest distinct window length: ${best}.`,
      11,
    );
  } else if (id === "two-pointers") {
    const a = numbers();
    if (a.some((v, i) => i > 0 && v < a[i - 1]))
      throw new Error(
        "Use ascending sorted values for this pair-sum movement rule.",
      );
    let left = 0,
      right = a.length - 1;
    while (left < right) {
      const sum = a[left] + a[right];
      emit(
        a,
        [left, right],
        { left, right, sum, target },
        sum === target
          ? "Pair found."
          : sum < target
            ? "Sum is too small; discard the left value."
            : "Sum is too large; discard the right value.",
        4,
      );
      if (sum === target) {
        emit(
          a,
          [left, right],
          { result: `[${left}, ${right}]` },
          "Return the two distinct indices.",
          6,
        );
        return steps;
      }
      if (sum < target) left++;
      else right--;
    }
    emit(a, [], { result: "No pair" }, "No pair remains.");
  } else if (id === "dp") {
    const coins = numbers();
    if (
      coins.some((x) => x <= 0) ||
      target < 0 ||
      target > 30 ||
      !Number.isInteger(target)
    )
      throw new Error(
        "Use positive coin values and an integer target from 0 to 30.",
      );
    const dp = Array(target + 1).fill(Infinity);
    dp[0] = 0;
    const show = () => dp.map((x) => (x === Infinity ? "∞" : x));
    emit(
      show(),
      [0],
      { amount: 0, answer: 0 },
      "Base case: zero coins make amount zero.",
      3,
    );
    for (let a = 1; a <= target; a++) {
      for (const coin of coins)
        if (coin <= a) {
          dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
          emit(
            show(),
            [a, a - coin],
            { amount: a, coin, dependency: a - coin },
            `Try final coin ${coin}: dp[${a}] = min(current, 1 + dp[${a - coin}]).`,
            7,
          );
        }
    }
    emit(
      show(),
      [target],
      { result: dp[target] === Infinity ? -1 : dp[target] },
      "All dependencies were computed at smaller amounts.",
      8,
    );
  } else if (id === "lcs") {
    const a = "ace",
      b = "abcde";
    const dp = Array.from({ length: 4 }, () => Array(6).fill(0));
    emit(
      [],
      [],
      { a, b },
      "Empty suffixes form the zero-valued last row and column.",
      3,
      { grid: dp.map((r) => [...r]) },
    );
    for (let i = 2; i >= 0; i--)
      for (let j = 4; j >= 0; j--) {
        dp[i][j] =
          a[i] === b[j]
            ? 1 + dp[i + 1][j + 1]
            : Math.max(dp[i + 1][j], dp[i][j + 1]);
        emit(
          [],
          [],
          { i, j, a: a[i], b: b[j], value: dp[i][j] },
          a[i] === b[j]
            ? "Characters match: add 1 to the diagonal suffix answer."
            : "Characters differ: take the better of skipping from either string.",
          a[i] === b[j] ? 7 : 9,
          { grid: dp.map((r) => [...r]) },
        );
      }
    emit(
      [],
      [],
      { result: dp[0][0] },
      "The answer for the complete strings is dp[0][0] = 3.",
      10,
      { grid: dp.map((r) => [...r]) },
    );
  } else if (
    [
      "bfs",
      "dfs",
      "tree-bfs",
      "tree-dfs",
      "dijkstra",
      "topological",
      "union-find",
      "bellman-ford",
    ].includes(id)
  ) {
    const weighted = id === "dijkstra" || id === "bellman-ford";
    const tree = id.startsWith("tree");
    const graph = {
      nodes: ["A", "B", "C", "D", "E", "F"],
      edges: (weighted
        ? [
            [0, 1, 4],
            [0, 2, 1],
            [2, 1, 2],
            [1, 3, 1],
            [2, 4, 5],
            [3, 5, 3],
            [4, 5, 1],
          ]
        : tree
          ? [
              [0, 1],
              [0, 2],
              [1, 3],
              [1, 4],
              [2, 5],
            ]
          : [
              [0, 1],
              [0, 2],
              [1, 3],
              [2, 3],
              [2, 4],
              [3, 5],
              [4, 5],
            ]) as [number, number, number?][],
    };
    const graphEmit = (
      active: number[],
      variables: Record<string, string | number>,
      message: string,
      values: (number | string)[] = graph.nodes,
    ) => emit(values, active, variables, message, 1, { graph });
    if (weighted) {
      let dist = Array(6).fill(Infinity);
      dist[0] = 0;
      const show = () => dist.map((x) => (x === Infinity ? "∞" : x));
      graphEmit(
        [0],
        { distances: JSON.stringify(show()) },
        "Start at A with distance 0. Other nodes are unreachable so far.",
        show(),
      );
      if (id === "dijkstra") {
        const heap: [number, number][] = [[0, 0]];
        while (heap.length) {
          heap.sort((a, b) => a[0] - b[0]);
          const [cost, u] = heap.shift()!;
          if (cost !== dist[u]) {
            graphEmit(
              [u],
              { cost, known: dist[u] },
              "Skip a stale heap entry.",
              show(),
            );
            continue;
          }
          graphEmit(
            [u],
            {
              cost,
              "priority queue (min first)": JSON.stringify(
                [...heap]
                  .sort((a, b) => a[0] - b[0])
                  .map(([d, n]) => [d, graph.nodes[n]]),
              ),
            },
            `Settle ${graph.nodes[u]} at distance ${cost}.`,
            show(),
          );
          for (const [a, b, w] of graph.edges)
            if (a === u && cost + w! < dist[b]) {
              dist[b] = cost + w!;
              heap.push([dist[b], b]);
              graphEmit(
                [a, b],
                {
                  from: graph.nodes[a],
                  to: graph.nodes[b],
                  distance: dist[b],
                  "priority queue (min first)": JSON.stringify(
                    [...heap]
                      .sort((a, b) => a[0] - b[0])
                      .map(([d, n]) => [d, graph.nodes[n]]),
                  ),
                },
                `Relax ${graph.nodes[a]} → ${graph.nodes[b]}.`,
                show(),
              );
            }
        }
        graphEmit(
          [],
          { result: JSON.stringify(show()) },
          "All reachable minimum distances are finalized.",
          show(),
        );
      } else {
        for (let r = 1; r <= 3; r++) {
          const next = [...dist];
          for (const [a, b, w] of graph.edges) {
            if (dist[a] + w! < next[b]) {
              next[b] = dist[a] + w!;
              graphEmit(
                [a, b],
                {
                  round: r,
                  edgeBudget: r,
                  previous: JSON.stringify(show()),
                  next: JSON.stringify(
                    next.map((x) => (x === Infinity ? "∞" : x)),
                  ),
                },
                "Read the previous round, write the next. This adds at most one edge.",
                next.map((x) => (x === Infinity ? "∞" : x)),
              );
            }
          }
          dist = next;
        }
        graphEmit(
          [],
          { result: JSON.stringify(show()), edgeBudget: 3 },
          "Cheapest routes using at most 3 edges (2 intermediate stops).",
          show(),
        );
      }
    } else if (id === "union-find") {
      const parent = [0, 1, 2, 3, 4, 5];
      let count = 6;
      const find = (x: number): number =>
        parent[x] === x ? x : find(parent[x]);
      graphEmit(
        [],
        { parents: parent.join(","), components: count },
        "Each node begins in its own component. Ignore arrow direction for this undirected connectivity example.",
      );
      for (const [a, b] of graph.edges) {
        const ra = find(a),
          rb = find(b);
        if (ra !== rb) {
          parent[rb] = ra;
          count--;
        }
        graphEmit(
          [a, b],
          {
            parents: parent.map((x) => graph.nodes[x]).join(","),
            components: count,
          },
          ra === rb
            ? "Already connected; do not decrement the count."
            : "Join distinct roots, merging exactly two components.",
        );
      }
    } else if (id === "topological") {
      const degree = Array(6).fill(0);
      graph.edges.forEach(([, b]) => degree[b]++);
      const q = degree.flatMap((x, i) => (x === 0 ? [i] : []));
      const order: string[] = [];
      graphEmit(
        q,
        {
          indegrees: degree.join(","),
          ready: q.map((i) => graph.nodes[i]).join(","),
        },
        "Start with zero-indegree nodes.",
      );
      while (q.length) {
        const u = q.shift()!;
        order.push(graph.nodes[u]);
        for (const [a, b] of graph.edges)
          if (a === u && --degree[b] === 0) q.push(b);
        graphEmit(
          [u],
          {
            indegrees: degree.join(","),
            ready: q.map((i) => graph.nodes[i]).join(","),
            order: order.join(" → "),
          },
          `Place ${graph.nodes[u]} next, then remove its outgoing prerequisites.`,
        );
      }
    } else {
      const dfs = id.includes("dfs");
      const pending = [0];
      const seen = new Set<number>();
      const order: string[] = [];
      if (!dfs) seen.add(0);
      graphEmit(
        [0],
        { frontier: "A" },
        "Begin at A. Directed edges describe the traversal.",
      );
      while (pending.length) {
        const u = dfs ? pending.pop()! : pending.shift()!;
        if (dfs && seen.has(u)) continue;
        seen.add(u);
        order.push(graph.nodes[u]);
        const neighbors = graph.edges
          .filter((e) => e[0] === u)
          .map((e) => e[1]);
        for (const v of dfs ? neighbors.reverse() : neighbors)
          if (!seen.has(v)) {
            pending.push(v);
            if (!dfs) seen.add(v);
          }
        graphEmit(
          [u],
          {
            [dfs ? "stack" : "queue"]:
              pending.map((x) => graph.nodes[x]).join(", ") || "empty",
            order: order.join(" → "),
          },
          `${dfs ? "Pop the most recent candidate" : "Remove the oldest queued vertex"}: ${graph.nodes[u]}.`,
        );
      }
    }
  } else if (id === "monotonic-stack") {
    const a = numbers(),
      stack: number[] = [],
      answer = Array(a.length).fill(0);
    emit(
      a,
      [],
      { stack: "[]", answer: answer.join(",") },
      "Keep indices of unresolved days.",
    );
    for (let i = 0; i < a.length; i++) {
      while (stack.length && a[stack.at(-1)!] < a[i]) {
        const j = stack.pop()!;
        answer[j] = i - j;
        emit(
          a,
          [j, i],
          { stack: JSON.stringify(stack), answer: answer.join(",") },
          `Day ${i} is the first warmer day for day ${j}: wait ${i - j}.`,
          6,
        );
      }
      stack.push(i);
      emit(
        a,
        [i],
        { stack: JSON.stringify(stack), answer: answer.join(",") },
        `Push day ${i}; temperatures on the stack are nonincreasing.`,
        8,
      );
    }
    emit(
      answer,
      [],
      { result: answer.join(",") },
      "Unresolved days keep zero. The boxes now show waiting times.",
    );
  } else if (id === "merge-sort") {
    const a = numbers();
    emit(a, [], {}, "Split ranges, then merge sorted halves.");
    const sort = (lo: number, hi: number) => {
      if (hi - lo <= 1) return;
      const mid = Math.floor((lo + hi) / 2);
      emit(
        a,
        Array.from({ length: hi - lo }, (_, i) => lo + i),
        { left: lo, mid, right: hi },
        "Split this half-open range.",
      );
      sort(lo, mid);
      sort(mid, hi);
      const merged: number[] = [];
      let i = lo,
        j = mid;
      while (i < mid && j < hi) merged.push(a[i] <= a[j] ? a[i++] : a[j++]);
      merged.push(...a.slice(i, mid), ...a.slice(j, hi));
      a.splice(lo, hi - lo, ...merged);
      emit(
        a,
        Array.from({ length: hi - lo }, (_, i) => lo + i),
        { left: lo, right: hi },
        "Merge the sorted halves by repeatedly taking the smaller front.",
      );
    };
    sort(0, a.length);
    emit(
      a,
      [],
      { result: a.join(",") },
      "All elements are sorted. O(n log n) time, O(n) auxiliary space.",
    );
  } else if (id === "heap") {
    const a = numbers(),
      heap: number[] = [];
    for (const value of a) {
      heap.push(value);
      let i = heap.length - 1;
      emit(
        heap,
        [i],
        { inserted: value },
        "Append the new value at the end of the heap.",
      );
      while (i > 0) {
        const p = Math.floor((i - 1) / 2);
        if (heap[p] <= heap[i]) break;
        [heap[p], heap[i]] = [heap[i], heap[p]];
        emit(
          heap,
          [p, i],
          { parent: p, child: i },
          "Swap with a larger parent to restore min-heap order.",
        );
        i = p;
      }
    }
    emit(
      heap,
      [0],
      { minimum: heap[0] ?? "empty" },
      "The root is the minimum; the remaining array is not fully sorted.",
      1,
      {
        graph: {
          nodes: heap.map(String),
          edges: heap.flatMap((_, i) =>
            i ? [[Math.floor((i - 1) / 2), i] as [number, number]] : [],
          ),
        },
      },
    );
  } else if (id === "linked-list") {
    const a = numbers();
    const edges: [number, number][] = a.flatMap((_, i) =>
      i < a.length - 1 ? [[i, i + 1] as [number, number]] : [],
    );
    emit(
      a,
      [],
      { prev: "None", current: 0 },
      "Original next pointers form the unreversed list.",
      1,
      { graph: { nodes: a.map(String), edges: [...edges] } },
    );
    for (let i = 0; i < a.length; i++) {
      const rest = edges.filter(([from]) => from !== i);
      edges.splice(0, edges.length, ...rest);
      if (i > 0) edges.push([i, i - 1]);
      emit(
        a,
        [i],
        {
          prev: i,
          current: i + 1 < a.length ? i + 1 : "None",
          savedNext: i + 1 < a.length ? i + 1 : "None",
        },
        `Save the original successor, point node ${i} to ${i ? i - 1 : "None"}, then advance.`,
        1,
        { graph: { nodes: a.map(String), edges: [...edges] } },
      );
    }
    emit(
      a,
      [],
      { head: a.length ? a.length - 1 : "None" },
      "The previous pointer is the new head.",
      1,
      { graph: { nodes: a.map(String), edges: [...edges] } },
    );
  } else if (id === "backtracking") {
    const a = numbers();
    if (a.length > 6)
      throw new Error("Use at most 6 values for subset discovery.");
    const path: number[] = [];
    let outputs = 0;
    const visit = (start: number) => {
      outputs++;
      emit(
        a,
        [...path],
        {
          path: JSON.stringify(path.map((i) => a[i])),
          subsets: outputs,
          callStack: `visit(${start}), depth ${path.length}`,
        },
        "Record a copy of the current path as a subset.",
      );
      for (let i = start; i < a.length; i++) {
        path.push(i);
        emit(
          a,
          [...path],
          { choice: a[i], path: JSON.stringify(path.map((j) => a[j])) },
          "Choose an item and explore its branch.",
        );
        visit(i + 1);
        path.pop();
        emit(
          a,
          [...path],
          { path: JSON.stringify(path.map((j) => a[j])), subsets: outputs },
          "Undo the choice before exploring its sibling.",
        );
      }
    };
    visit(0);
  } else if (id === "greedy" || id === "intervals") {
    const intervals =
      id === "greedy"
        ? [
            [1, 4],
            [2, 3],
            [3, 5],
            [5, 6],
          ]
        : [
            [1, 3],
            [2, 6],
            [8, 10],
            [9, 12],
          ];
    intervals.sort((a, b) => (id === "greedy" ? a[1] - b[1] : a[0] - b[0]));
    const labels = intervals.map((p) => `[${p}]`);
    let end = -Infinity,
      count = 0;
    const result: number[][] = [];
    for (let i = 0; i < intervals.length; i++) {
      const [s, e] = intervals[i];
      if (id === "greedy") {
        const take = s >= end;
        if (take) {
          end = e;
          count++;
        }
        emit(
          labels,
          [i],
          { end, count, decision: take ? "take" : "skip" },
          take
            ? "Earliest finishing compatible interval leaves the most room."
            : "This interval overlaps the last selected interval.",
        );
      } else {
        if (result.length && s <= result.at(-1)![1])
          result.at(-1)![1] = Math.max(result.at(-1)![1], e);
        else result.push([s, e]);
        emit(
          labels,
          [i],
          { merged: JSON.stringify(result) },
          "Merge touching ranges, or start a new disjoint range.",
        );
      }
    }
  } else if (id === "bits") {
    const a = numbers();
    if (a.some((n) => n < 0 || n > 255))
      throw new Error(
        "Use integers from 0 to 255 for the eight-bit XOR trace.",
      );
    let result = 0;
    emit(
      a,
      [],
      { xor: 0, binary: "00000000" },
      "Start with XOR identity 0. This isolates an unpaired value only when all others occur twice.",
    );
    a.forEach((n, i) => {
      result ^= n;
      emit(
        a,
        [i],
        { xor: result, binary: result.toString(2).padStart(8, "0") },
        `XOR with ${n}: equal bit patterns cancel.`,
      );
    });
  } else {
    const a = numbers(),
      stack: number[] = [];
    for (const n of a) {
      stack.push(n);
      emit(
        stack,
        [stack.length - 1],
        { top: n },
        "Push onto the last-in-first-out stack.",
      );
    }
    while (stack.length) {
      const n = stack.pop()!;
      emit(
        stack,
        stack.length ? [stack.length - 1] : [],
        { popped: n, top: stack.at(-1) ?? "empty" },
        "Pop the most recently added value.",
      );
    }
  }
  return steps.length
    ? steps
    : [
        {
          values: [],
          active: [],
          variables: {},
          message: "Empty input: there is no work to do.",
          line: 1,
        },
      ];
}
