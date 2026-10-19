import { useState } from "react";
import { ArrowRight, Eye, Shuffle } from "lucide-react";
import { challenges, reasoningPrompts } from "../data/practice";
import { lessons } from "../data";
import { useStudy } from "../lib/store";
import { Card, Code, Link, PageTitle, Tag } from "../components/ui";
export default function Practice() {
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const { state, setState, log } = useStudy();
  const c = challenges[index];
  const draft = state.drafts["practice-" + c.id] ?? "";
  const next = () => {
    setIndex((i) => (i + 1) % challenges.length);
    setReveal(false);
    setSelected([]);
    setSubmitted(false);
  };
  return (
    <>
      <PageTitle
        eyebrow="PRACTICE ARENA · BLIND RECOGNITION"
        title="Let the constraints lead you."
        description="The category stays hidden. Build a correct idea before reaching for a familiar template."
        action={
          <button className="button" onClick={next}>
            <Shuffle size={16} />
            Next challenge
          </button>
        }
      />
      <div className="lesson-layout">
        <div className="stack">
          <Card>
            <div className="row between">
              <Tag tone="purple">
                Original challenge {index + 1} / {challenges.length}
              </Tag>
              <Tag tone="neutral">Category hidden</Tag>
            </div>
            <h2>{c.title}</h2>
            <p>{c.prompt}</p>
            <div className="sample">
              <small>EXAMPLE</small>
              <p>{c.sample}</p>
            </div>
            <h3>Constraints</h3>
            <p>{c.constraints}</p>
          </Card>
          <Card>
            <h2>Build your case</h2>
            <p>
              Pick one or more plausible approaches, then explain the state,
              invariant, and complexity. A selection alone does not establish
              correctness.
            </p>
            <div className="choice-chips">
              {lessons
                .filter((l) => !l.level.startsWith("Advanced"))
                .map((l) => (
                  <button
                    key={l.id}
                    aria-pressed={selected.includes(l.id)}
                    className={selected.includes(l.id) ? "chosen" : ""}
                    onClick={() =>
                      setSelected((s) =>
                        s.includes(l.id)
                          ? s.filter((x) => x !== l.id)
                          : [...s, l.id],
                      )
                    }
                  >
                    {l.title}
                  </button>
                ))}
            </div>
            <label>
              Your reasoning
              <textarea
                rows={9}
                placeholder="Restate → constraints → brute force → repeated work → state → invariant → edge cases → complexity"
                value={draft}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    drafts: {
                      ...s.drafts,
                      ["practice-" + c.id]: e.target.value,
                    },
                  }))
                }
              />
            </label>
            <div className="row wrap">
              <button
                className="button primary"
                disabled={!draft.trim()}
                onClick={() => {
                  setSubmitted(true);
                  setReveal(true);
                  log(`Practiced: ${c.title}`, c.topic);
                }}
              >
                Submit & compare
                <ArrowRight size={16} />
              </button>
              <button className="button" onClick={() => setReveal(!reveal)}>
                <Eye size={16} />
                {reveal ? "Hide reference" : "Reveal reference"}
              </button>
            </div>
            <small className="muted">
              Your writing is saved. Feedback compares selected patterns and
              provides a self-review; it does not automatically grade your
              explanation or code.
            </small>
          </Card>
          {reveal && (
            <Card>
              <Tag tone="green">Reference reasoning</Tag>
              <h2>One way to derive the solution</h2>
              {submitted && (
                <div className="callout">
                  <div>
                    <strong>
                      {selected.some((x) => c.approaches.includes(x))
                        ? "You selected a relevant pattern."
                        : "Compare the assumptions behind your selection."}
                    </strong>
                    <p>
                      Reference approaches:{" "}
                      {c.approaches
                        .map((id) => lessons.find((l) => l.id === id)?.title)
                        .join(", ")}
                      . Other approaches may be valid if their correctness and
                      cost fit the constraints.
                    </p>
                  </div>
                </div>
              )}
              <h3>Clues that matter</h3>
              <ul>
                {c.clues.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <h3>Brute force</h3>
              <p>{c.brute}</p>
              <h3>What to track</h3>
              <p>{c.state}</p>
              <h3>Optimization & why it works</h3>
              <p>{c.solution}</p>
              <Code code={c.code} />
              <h3>Complexity</h3>
              <p>{c.complexity}</p>
              <h3>Edge cases</h3>
              <p>{c.edges}</p>
              <h3>Follow-up</h3>
              <p>{c.followup}</p>
              <Link to={"/lesson/" + c.approaches[0]} className="button">
                Revisit the pattern
                <ArrowRight size={16} />
              </Link>
            </Card>
          )}
        </div>
        <aside className="stack">
          <Card>
            <h3>Your thinking checklist</h3>
            {reasoningPrompts.map((p, i) => (
              <label className="check-label checklist-item" key={p}>
                <input
                  type="checkbox"
                  checked={state.drafts[`check-${c.id}-${i}`] === "yes"}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      drafts: {
                        ...s.drafts,
                        [`check-${c.id}-${i}`]: e.target.checked ? "yes" : "no",
                      },
                    }))
                  }
                />
                {p}
              </label>
            ))}
          </Card>
          <Card>
            <h3>One changed constraint</h3>
            <p>
              “Contiguous” versus “subsequence” can change the entire state. So
              can negative weights, online arrivals, or an extra modification
              budget.
            </p>
            <Link to="/lab" className="text-link">
              Explore the decision lab
              <ArrowRight size={15} />
            </Link>
          </Card>
        </aside>
      </div>
    </>
  );
}
