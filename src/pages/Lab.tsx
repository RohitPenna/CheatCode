import { useState } from "react";
import { ArrowRight, GitBranch, Lightbulb } from "lucide-react";
import { challenges, reasoningPrompts } from "../data/practice";
import { comparisons } from "../data/comparisons";
import { lessons } from "../data";
import { useStudy } from "../lib/store";
import { Card, Code, Link, PageTitle, Tag } from "../components/ui";
export function DecisionTool() {
  const [structure, setStructure] = useState("Sequence");
  const [goal, setGoal] = useState("Find a value / pair");
  const [contiguous, setContiguous] = useState(false);
  const [negative, setNegative] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [monotonic, setMonotonic] = useState(false);
  const [overlap, setOverlap] = useState(false);
  const [weights, setWeights] = useState("Equal");
  const [size, setSize] = useState("100,000");
  const suggestions: { id: string; why: string; caveat: string }[] = [];
  const add = (id: string, why: string, caveat: string) => {
    if (!suggestions.some((s) => s.id === id))
      suggestions.push({ id, why, caveat });
  };
  if (structure === "Graph") {
    if (goal === "Connectivity")
      add(
        "union-find",
        "Repeated component merges match disjoint sets.",
        "A single static graph may be simpler with DFS/BFS; deletions need more machinery.",
      );
    if (weights === "Equal")
      add(
        "bfs",
        "Each layer adds the same edge cost, so BFS finds shortest edge-count paths.",
        "For unequal weights, fewest edges may not mean cheapest.",
      );
    else if (weights === "0 or 1")
      add(
        "zero-one-bfs",
        "A deque can preserve distance order with binary weights.",
        "Relax distances; do not freeze a vertex on discovery.",
      );
    else if (weights === "Nonnegative")
      add(
        "dijkstra",
        "The minimum tentative distance is safe to finalize with nonnegative weights.",
        "A stop budget needs an extra state dimension.",
      );
    else
      add(
        "bellman-ford",
        "Repeated relaxation can accommodate negative edges.",
        "Ordinary Bellman–Ford needs a negative-cycle check; this lesson focuses on the edge-limited variant.",
      );
    if (goal === "Dependency order")
      add(
        "topological",
        "Prerequisite edges need an order respecting every dependency.",
        "A directed cycle means no full topological order exists.",
      );
  }
  if (structure === "Tree")
    add(
      "trees",
      "Children describe smaller subproblems; define what each returns.",
      "Deep skewed trees may need an explicit stack.",
    );
  if (structure === "Sequence") {
    if (contiguous) {
      if (negative)
        add(
          "prefix-sums",
          "Signed values break simple monotonic sum windows; differences of prefix sums remain valid.",
          "For counting exact sums, store prefix frequencies; a plain prefix array alone is not enough.",
        );
      else
        add(
          "sliding-window",
          "A contiguous range may support incremental updates and shrinking.",
          "Prove that shrinking repairs validity; contiguity alone is not sufficient.",
        );
    }
    if (sorted)
      add(
        "two-pointers",
        "Ordering may let you discard pair candidates safely.",
        "Write the inequality that justifies each movement.",
      );
    if (sorted || goal === "Find a value / pair")
      add(
        sorted ? "binary-search" : "hashing",
        sorted
          ? "Sorted order supports halving a lookup space."
          : "A map may replace repeated linear membership searches.",
        "Check whether you need original indices, counts, or only presence.",
      );
  }
  if (monotonic)
    add(
      "answer-search",
      "You identified a monotonic feasibility predicate.",
      "Prove the direction of monotonicity and include the cost of each feasibility check.",
    );
  if (overlap)
    add(
      "dp",
      "Repeated equivalent subproblems can share their results.",
      "A state must include every variable that affects future choices.",
    );
  if (goal === "Generate all possibilities")
    add(
      "backtracking",
      "A decision tree can enumerate every valid choice sequence.",
      "The output itself may be exponential; prune only when impossibility is proven.",
    );
  if (goal === "Repeated minimum / maximum")
    add(
      "heap",
      "A priority queue gives repeated access to the next extreme.",
      "Sort once if the complete static ordering is all you need.",
    );
  if (!suggestions.length)
    add(
      "hashing",
      "Start by asking whether remembering counts or membership removes repeated work.",
      "This is a hypothesis, not a conclusion. Model a small example and prove correctness.",
    );
  return (
    <div className="two-col">
      <Card>
        <h2>Describe the structure</h2>
        <p>
          These are candidate approaches, not a verdict. Test the assumptions
          behind each one.
        </p>
        <label>
          Input structure
          <select
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
          >
            {["Sequence", "Graph", "Tree"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Primary goal
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            {[
              "Find a value / pair",
              "Count / optimize",
              "Connectivity",
              "Dependency order",
              "Generate all possibilities",
              "Repeated minimum / maximum",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        {structure === "Graph" ? (
          <label>
            Edge weights
            <select
              value={weights}
              onChange={(e) => setWeights(e.target.value)}
            >
              {["Equal", "0 or 1", "Nonnegative", "May be negative"].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
        ) : (
          <>
            <label className="check-label">
              <input
                type="checkbox"
                checked={contiguous}
                onChange={(e) => setContiguous(e.target.checked)}
              />
              The answer is a contiguous section
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={negative}
                onChange={(e) => setNegative(e.target.checked)}
              />
              Values can be negative
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={sorted}
                onChange={(e) => setSorted(e.target.checked)}
              />
              Input is sorted
            </label>
          </>
        )}
        <label className="check-label">
          <input
            type="checkbox"
            checked={monotonic}
            onChange={(e) => setMonotonic(e.target.checked)}
          />
          Feasibility is monotonic in a candidate answer
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={overlap}
            onChange={(e) => setOverlap(e.target.checked)}
          />
          Different branches reach identical subproblems
        </label>
        <label>
          Approximate input size
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            {["20", "1,000", "100,000"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <div className="callout">
          <p>
            {size === "20"
              ? "Exponential exploration may be plausible, but count outputs and branches. 20! is still enormous."
              : size === "1,000"
                ? "Quadratic work may be plausible; account for constants, language, and the time limit."
                : "Usually aim for O(n) or O(n log n). O(n²) means about ten billion pair operations."}{" "}
            These are rough screening heuristics, not runtime guarantees.
          </p>
        </div>
      </Card>
      <div className="stack">
        {suggestions.map((s) => (
          <Card key={s.id}>
            <Tag>Candidate approach</Tag>
            <h3>{lessons.find((l) => l.id === s.id)?.title}</h3>
            <p>{s.why}</p>
            <div className="callout">
              <Lightbulb size={18} />
              <p>{s.caveat}</p>
            </div>
            <Link to={"/lesson/" + s.id} className="text-link">
              Inspect the invariant
              <ArrowRight size={15} />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
export default function Lab() {
  const [tab, setTab] = useState("Derive a solution");
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [comparison, setComparison] = useState(0);
  const [connection, setConnection] = useState(0);
  const { state, setState } = useStudy();
  const c = challenges[index];
  const refs = [
    c.prompt,
    c.constraints,
    c.sample,
    c.brute,
    c.brute,
    c.clues.join(" "),
    c.state,
    c.solution,
    c.solution,
    c.edges,
    c.complexity,
    c.followup,
  ];
  const links = [
    [
      "Sliding window",
      "Two pointers + frequency maps",
      "A window uses two moving boundaries. Counts or last-seen positions tell it exactly when the range is invalid.",
      "sliding-window",
    ],
    [
      "Dijkstra",
      "Graphs + heaps + greedy",
      "The graph models routes. The heap picks the cheapest frontier. Nonnegative weights justify the greedy finalization.",
      "dijkstra",
    ],
    [
      "Backtracking",
      "DFS + state restoration",
      "DFS explores the decision tree. Undoing each choice ensures siblings start with the same state.",
      "backtracking",
    ],
    [
      "Dynamic programming",
      "Recursion + memoization",
      "Equivalent remaining problems share an answer. A complete state is the key used for caching.",
      "dp",
    ],
    [
      "Binary search",
      "Order + monotonic feasibility",
      "A monotonic predicate separates false from true, allowing safe elimination of half the candidates.",
      "answer-search",
    ],
    [
      "Topological sorting",
      "Directed graphs + dependencies",
      "Zero-indegree vertices are ready. Removing them exposes the next dependency layer.",
      "topological",
    ],
  ];
  const pair = comparisons[comparison];
  return (
    <>
      <PageTitle
        eyebrow="PROBLEM-SOLVING LAB"
        title="Learn how to find the solution."
        description="From a correct brute force to an efficient idea you can justify. This is where patterns become intuition."
      />
      <div className="tabs">
        {[
          "Derive a solution",
          "Decision guide",
          "Compare approaches",
          "Pattern map",
        ].map((x) => (
          <button
            key={x}
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "Decision guide" ? (
        <DecisionTool />
      ) : tab === "Compare approaches" ? (
        <>
          <label className="comparison-select">
            Choose a comparison
            <select
              value={comparison}
              onChange={(e) => setComparison(+e.target.value)}
            >
              {comparisons.map((x, i) => (
                <option key={x[0] + x[1]} value={i}>
                  {x[0]} vs {x[1]}
                </option>
              ))}
            </select>
          </label>
          <Card>
            <div className="comparison-visual">
              <span>{pair[0]}</span>
              <GitBranch size={32} />
              <span>{pair[1]}</span>
            </div>
            <h2>What changes?</h2>
            <p>{pair[2]}</p>
            <h3>Concrete example</h3>
            <p>{pair[3]}</p>
            <h3>Typical cost</h3>
            <p>{pair[4]}</p>
            <div className="callout danger">
              <div>
                <strong>Where the wrong choice fails</strong>
                <p>{pair[5]}</p>
              </div>
            </div>
            <h3>A question to ask yourself</h3>
            <p>{pair[6]}</p>
            <Link to="/practice" className="button">
              Try a blind problem
              <ArrowRight size={16} />
            </Link>
          </Card>
        </>
      ) : tab === "Pattern map" ? (
        <Card>
          <h2>Algorithms are connected ideas.</h2>
          <div className="pattern-map">
            {links.map((l, i) => (
              <button
                className={connection === i ? "selected" : ""}
                key={l[0]}
                onClick={() => setConnection(i)}
              >
                <GitBranch size={22} />
                <strong>{l[0]}</strong>
                <span>{l[1]}</span>
              </button>
            ))}
          </div>
          <div className="callout">
            <div>
              <h3>
                {links[connection][0]} → {links[connection][1]}
              </h3>
              <p>{links[connection][2]}</p>
              <Link
                to={"/lesson/" + links[connection][3]}
                className="text-link"
              >
                Explore this connection
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="lesson-layout">
          <div className="stack">
            <Card>
              <label>
                Worked challenge
                <select
                  value={index}
                  onChange={(e) => {
                    setIndex(+e.target.value);
                    setStep(0);
                    setShow(false);
                  }}
                >
                  {challenges.map((x, i) => (
                    <option value={i} key={x.id}>
                      {x.title}
                    </option>
                  ))}
                </select>
              </label>
              <h2>{c.title}</h2>
              <p>{c.prompt}</p>
              <div className="sample">{c.sample}</div>
            </Card>
            <Card>
              <Tag tone="purple">
                Step {step + 1} / {reasoningPrompts.length}
              </Tag>
              <h2>{reasoningPrompts[step]}</h2>
              <label>
                Your thinking
                <textarea
                  rows={6}
                  value={state.drafts[`lab-${c.id}-${step}`] ?? ""}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      drafts: {
                        ...s.drafts,
                        [`lab-${c.id}-${step}`]: e.target.value,
                      },
                    }))
                  }
                  placeholder="Make a prediction. A rough idea is a useful starting point."
                />
              </label>
              <div className="row wrap">
                <button
                  className="button"
                  disabled={step === 0}
                  onClick={() => {
                    setStep((s) => s - 1);
                    setShow(false);
                  }}
                >
                  Previous
                </button>
                <button className="button" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Compare with"} reference
                </button>
                <button
                  className="button primary"
                  disabled={step === reasoningPrompts.length - 1}
                  onClick={() => {
                    setStep((s) => s + 1);
                    setShow(false);
                  }}
                >
                  Next step
                  <ArrowRight size={16} />
                </button>
              </div>
              {show && (
                <div className="callout">
                  <Lightbulb size={20} />
                  <p>{refs[step]}</p>
                </div>
              )}
              {step >= 7 && (
                <details>
                  <summary>See the reference implementation</summary>
                  <Code code={c.code} />
                </details>
              )}
            </Card>
          </div>
          <Card>
            <h3>A repeatable process</h3>
            <div className="lab-steps">
              {reasoningPrompts.map((p, i) => (
                <button
                  className={i === step ? "active" : ""}
                  onClick={() => {
                    setStep(i);
                    setShow(false);
                  }}
                  key={p}
                >
                  <span>{i + 1}</span>
                  {p}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
