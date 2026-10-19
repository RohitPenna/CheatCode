import rawProblems from "./problems.json";
import rawLessons from "./lessons.json";
import type { Lesson, Problem } from "../lib/types";
export const problems = rawProblems as Problem[];
export const lessons = rawLessons as Lesson[];
export const categories = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
];
export const categoryDescription: Record<string, string> = {
  "Arrays & Hashing":
    "Trade repeated searching for a useful memory of what you have seen.",
  "Two Pointers":
    "Move through candidates with a rule that proves what you can discard.",
  "Sliding Window":
    "Maintain exactly the information needed for a contiguous range.",
  Stack: "Use order and unresolved candidates to make the next decision.",
  "Binary Search": "Define a search space, then safely remove half of it.",
  "Linked List":
    "Reason about pointers, ownership of links, and unchanged suffixes.",
  Trees: "Design what each recursive call returns to its parent.",
  Tries: "Share prefixes and prune impossible word searches early.",
  "Heap / Priority Queue":
    "Keep the next best candidate available without sorting everything.",
  Backtracking:
    "Explore choices, prune impossible branches, and restore state.",
  Graphs:
    "Model relationships; choose traversal based on what the question asks.",
  "Advanced Graphs":
    "Add weights, ordering, or connectivity constraints to your graph model.",
  "1-D Dynamic Programming":
    "Define a reusable subproblem before writing a recurrence.",
  "2-D Dynamic Programming":
    "Track independent dimensions of progress and respect dependencies.",
  Greedy:
    "Make a local decision only after proving it preserves an optimal answer.",
  Intervals:
    "Sort endpoints and reason carefully about overlap and boundaries.",
  "Math & Geometry":
    "Turn geometric or arithmetic structure into simple operations.",
  "Bit Manipulation":
    "Represent, inspect, and combine information one bit at a time.",
};
export const primaryLesson: Record<string, string> = {
  "Arrays & Hashing": "hashing",
  "Two Pointers": "two-pointers",
  "Sliding Window": "sliding-window",
  Stack: "monotonic-stack",
  "Binary Search": "binary-search",
  "Linked List": "linked-list",
  Trees: "trees",
  Tries: "trie",
  "Heap / Priority Queue": "heap",
  Backtracking: "backtracking",
  Graphs: "bfs",
  "Advanced Graphs": "dijkstra",
  "1-D Dynamic Programming": "dp",
  "2-D Dynamic Programming": "lcs",
  Greedy: "greedy",
  Intervals: "intervals",
  "Math & Geometry": "matrix",
  "Bit Manipulation": "bits",
};
export const lessonById = (id: string) => lessons.find((l) => l.id === id);
export interface Card {
  id: string;
  topic: string;
  type: string;
  difficulty: string;
  prompt: string;
  answer: string;
}
export const cards: Card[] = lessons.flatMap((l) => [
  {
    id: l.id + "-recognition",
    topic: l.category,
    type: "Guess the Algorithm",
    difficulty: l.level.startsWith("Advanced") ? "Hard" : "Medium",
    prompt: l.clues,
    answer: l.title + " — " + l.summary,
  },
  {
    id: l.id + "-state",
    topic: l.category,
    type: "Track the State",
    difficulty: "Medium",
    prompt: `For ${l.title.toLowerCase()}, what information must you track, and what does it mean?`,
    answer: l.state + " " + l.invariant,
  },
  {
    id: l.id + "-correctness",
    topic: l.category,
    type: "Teach It Back",
    difficulty: "Medium",
    prompt: `Explain why ${l.title.toLowerCase()} works without saying “because that is the algorithm.”`,
    answer: l.invariant,
  },
  {
    id: l.id + "-complexity",
    topic: l.category,
    type: "Analyze Complexity",
    difficulty: "Medium",
    prompt: `Analyze this code. Count total operations, not just nested loops.\n\n${l.code}`,
    answer: l.time + " Space: " + l.space,
  },
  {
    id: l.id + "-followup",
    topic: l.category,
    type: "Interview Follow-Up",
    difficulty: "Medium",
    prompt: l.quiz.question,
    answer: l.quiz.explanation,
  },
  {
    id: l.id + "-predict",
    topic: l.category,
    type: "Predict the Output",
    difficulty: "Easy",
    prompt: `What does solve return for ${JSON.stringify(l.cases[0].args)}? Explain before revealing.\n\n${l.code}`,
    answer: JSON.stringify(l.cases[0].expected) + "\n" + l.example.join("\n"),
  },
]);
cards.push(
  {
    id: "bug-rows",
    topic: "2-D Dynamic Programming",
    type: "Find the Bug",
    difficulty: "Easy",
    prompt:
      "grid = [[0] * 3] * 3\ngrid[0][0] = 1\n\nWhy did all three rows change?",
    answer:
      "All rows reference the same inner list. Use [[0] * 3 for _ in range(3)] to allocate independent rows.",
  },
  {
    id: "counter-negative-window",
    topic: "Sliding Window",
    type: "Counterexample Challenge",
    difficulty: "Hard",
    prompt:
      "Claim: For any integers, shrink a sum window whenever its sum exceeds target. Find a counterexample for finding a target-sum subarray.",
    answer:
      "[4, -1], target 3. Shrinking after seeing 4 removes a value needed for the later valid subarray [4,-1]. Prefix sums with a map handle mixed signs.",
  },
  {
    id: "choose-queue",
    topic: "Graphs",
    type: "Choose the Data Structure",
    difficulty: "Easy",
    prompt:
      "You must process waiting tasks in arrival order, removing from the front frequently. Which Python collection fits?",
    answer:
      "collections.deque: append and popleft are O(1). list.pop(0) shifts the remaining items in O(n).",
  },
  {
    id: "compare-static",
    topic: "Heap / Priority Queue",
    type: "Compare Approaches",
    difficulty: "Medium",
    prompt:
      "All scores are known, and you need the full ranking once. Heap or sorting? What if scores arrive continuously and you only need top 10?",
    answer:
      "Sort the static list in O(n log n). For an ongoing stream, maintain a min heap of at most 10 values with O(log 10) updates.",
  },
);
