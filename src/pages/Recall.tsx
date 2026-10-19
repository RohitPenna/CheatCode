import { useEffect, useMemo, useState } from "react";
import { Brain, RotateCw, Shuffle } from "lucide-react";
import { cards, categories } from "../data";
import { scheduleReview, useStudy } from "../lib/store";
import { Card, Empty, PageTitle, ProgressBar, Tag } from "../components/ui";
export default function Recall() {
  const { state, setState } = useStudy();
  const [topic, setTopic] = useState("All topics");
  const [difficulty, setDifficulty] = useState("All difficulties");
  const [type, setType] = useState("All card types");
  const [queue, setQueue] = useState("Due & new");
  const [revealed, setRevealed] = useState(false);
  const [offset, setOffset] = useState(0);
  const [seed, setSeed] = useState(0);
  const [rated, setRated] = useState(0);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const deck = useMemo(
    () =>
      cards
        .filter(
          (c) =>
            (topic === "All topics" || topic === c.topic) &&
            (difficulty === "All difficulties" ||
              c.difficulty === difficulty) &&
            (type === "All card types" || type === c.type) &&
            (queue === "All cards" ||
              (queue === "Missed cards"
                ? (state.reviews[c.id]?.lapses ?? 0) > 0
                : !state.reviews[c.id] || state.reviews[c.id].due <= now)),
        )
        .sort((a, b) => {
          if (seed) {
            const h = (s: string) =>
              Array.from(s).reduce(
                (x, c) => (x * 31 + c.charCodeAt(0)) % 100003,
                seed,
              );
            return h(a.id) - h(b.id);
          }
          return (
            (state.reviews[b.id]?.lapses ?? 0) -
            (state.reviews[a.id]?.lapses ?? 0)
          );
        }),
    [topic, difficulty, type, queue, state.reviews, seed, now],
  );
  const current = deck[offset % Math.max(1, deck.length)];
  const rate = (rating: string) => {
    if (!current || !revealed) return;
    setState((s) => ({
      ...s,
      reviews: {
        ...s.reviews,
        [current.id]: scheduleReview(s.reviews[current.id], rating),
      },
      activity: [
        { at: Date.now(), text: `Recall: ${rating}`, topic: current.topic },
        ...s.activity,
      ].slice(0, 2000),
    }));
    setRated((r) => r + 1);
    setRevealed(false);
    if (queue !== "Due & new") setOffset((o) => o + 1);
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      )
        return;
      if (
        e.code === "Space" &&
        (e.target as HTMLElement).tagName !== "BUTTON"
      ) {
        e.preventDefault();
        setRevealed((x) => !x);
      }
      if (revealed && ["1", "2", "3", "4"].includes(e.key))
        rate(["Again", "Hard", "Good", "Easy"][+e.key - 1]);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  const reset = () => {
    setOffset(0);
    setRevealed(false);
  };
  return (
    <>
      <PageTitle
        eyebrow="ACTIVE RECALL"
        title="Retrieve it. Don’t just reread it."
        description="Explain the idea before you turn the card. A little effort now makes the next recall easier."
      />
      <div className="toolbar filters">
        <select
          aria-label="Flashcard topic"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            reset();
          }}
        >
          {["All topics", ...categories].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Flashcard difficulty"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            reset();
          }}
        >
          {["All difficulties", "Easy", "Medium", "Hard"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Flashcard type"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            reset();
          }}
        >
          {["All card types", ...new Set(cards.map((c) => c.type))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Review queue"
          value={queue}
          onChange={(e) => {
            setQueue(e.target.value);
            reset();
          }}
        >
          {["Due & new", "Missed cards", "All cards"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button
          className="button"
          onClick={() => {
            setSeed(Math.floor(Math.random() * 9999) + 1);
            reset();
          }}
        >
          <Shuffle size={16} />
          Shuffle
        </button>
      </div>
      <div className="recall-container">
        <div className="row between">
          <small>{deck.length} cards in this queue</small>
          <small>{rated} reviewed this session</small>
        </div>
        <ProgressBar value={(rated / (rated + deck.length || 1)) * 100} />
        {current ? (
          <>
            <Card className={"flashcard " + (revealed ? "flipped" : "")}>
              <div className="row between">
                <Tag tone="purple">{current.type}</Tag>
                <Brain size={24} />
              </div>
              <div className="flashcard-body">
                <small>{revealed ? "REFERENCE ANSWER" : "THINK FIRST"}</small>
                <p className="preserve">
                  {revealed ? current.answer : current.prompt}
                </p>
              </div>
              <button className="button" onClick={() => setRevealed(!revealed)}>
                <RotateCw size={16} />
                {revealed ? "Show question" : "Reveal answer"}
                <kbd>Space</kbd>
              </button>
            </Card>
            {revealed ? (
              <div className="rating-grid">
                {[
                  ["Again", "10 minutes", "red"],
                  ["Hard", "At least 1 day", "orange"],
                  ["Good", "Growing interval", "blue"],
                  ["Easy", "At least 4 days", "green"],
                ].map(([x, n, c], i) => (
                  <button
                    className={"rating " + c}
                    key={x}
                    onClick={() => rate(x)}
                  >
                    <span>
                      {x}
                      <kbd>{i + 1}</kbd>
                    </span>
                    <small>{n}</small>
                  </button>
                ))}
              </div>
            ) : (
              <p className="center muted">
                Say your answer aloud. Then compare it with the reference.
              </p>
            )}
            <p className="footer-note">
              Ratings are your self-assessment. Again returns in 10 minutes;
              other ratings schedule the next review in days. Review history is
              saved locally.
            </p>
          </>
        ) : (
          <Card>
            <Empty title="You’re caught up with this queue.">
              Try another topic, review all cards, or return when your next
              review is due.
            </Empty>
            <button
              className="button primary"
              onClick={() => {
                setQueue("All cards");
                reset();
              }}
            >
              Browse all cards
            </button>
          </Card>
        )}
      </div>
    </>
  );
}
