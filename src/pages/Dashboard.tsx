import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock3,
  Code2,
  Flame,
  Layers3,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { cards, categories, lessons, primaryLesson, problems } from "../data";
import { dateKey, daysUntil, streak, useStudy } from "../lib/store";
import { recommend } from "../lib/recommend";
import {
  Card,
  Link,
  PageTitle,
  ProgressBar,
  SectionTitle,
  Tag,
} from "../components/ui";
export default function Dashboard() {
  const { state } = useStudy();
  const completed = problems.filter(
    (p) => state.problems[p.id]?.completed,
  ).length;
  const mastered = lessons.filter(
    (l) => state.topics[l.id]?.status === "Mastered",
  ).length;
  const due = cards.filter(
    (c) => !state.reviews[c.id] || state.reviews[c.id].due <= Date.now(),
  ).length;
  const reviewed = Object.keys(state.reviews).length;
  const days = daysUntil(state.preferences.interviewDate);
  const next = recommend(state);
  const recent = state.activity.slice(0, 4);
  const activeDays = new Map<string, number>();
  state.activity.forEach((a) =>
    activeDays.set(dateKey(a.at), (activeDays.get(dateKey(a.at)) ?? 0) + 1),
  );
  const topics = [
    "Arrays & Hashing",
    "Two Pointers",
    "Sliding Window",
    "Binary Search",
    "Trees",
    "Graphs",
    "1-D Dynamic Programming",
  ];
  return (
    <>
      <PageTitle
        eyebrow="YOUR LEARNING WORKSPACE"
        title="A little progress. A stronger problem solver."
        description="Build intuition, connect the patterns, and make your next solution your own."
        action={
          <Link to="/cram" className="date-pill">
            <span className="google-dots">
              <i />
              <i />
              <i />
              <i />
            </span>
            {days >= 0
              ? `${days} ${days === 1 ? "day" : "days"} to your interview`
              : "Algorithm mastery mode"}
            <ArrowRight size={15} />
          </Link>
        }
      />
      <div className="dashboard-grid">
        <div className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={14} /> YOUR NEXT BEST STEP
            </div>
            <h2>{next.title}</h2>
            <p>{next.description}</p>
            <div className="row">
              <Link className="button primary" to={next.to}>
                {next.label}
                <ArrowRight size={16} />
              </Link>
              <span className="muted inline">
                <Clock3 size={14} />
                {next.minutes} min
              </span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="art-node node-a">[ ]</div>
            <div className="art-node node-b">∞</div>
            <div className="art-node node-c">⌘</div>
            <div className="art-core">
              <Code2 size={46} strokeWidth={1.6} />
            </div>
            <span className="art-caption">understand → apply → grow</span>
          </div>
        </div>
        <Card className="progress-card">
          <div className="row between">
            <h3>Your NeetCode journey</h3>
            <Tag tone="neutral">150 problems</Tag>
          </div>
          <div className="ring">
            <svg
              viewBox="0 0 160 160"
              aria-label={`${completed} of 150 problems completed`}
            >
              <circle cx="80" cy="80" r="65" className="ring-bg" />
              <circle
                cx="80"
                cy="80"
                r="65"
                className="ring-fill"
                strokeDasharray={`${(completed / 150) * 408.4} 408.4`}
              />
            </svg>
            <div>
              <strong>
                {completed}
                <span>/150</span>
              </strong>
              <small>problems completed</small>
            </div>
          </div>
          <div className="difficulty-summary">
            {["Easy", "Medium", "Hard"].map((d) => (
              <div key={d}>
                <i className={d.toLowerCase()} />
                <span>{d}</span>
                <b>
                  {
                    problems.filter(
                      (p) =>
                        p.difficulty === d && state.problems[p.id]?.completed,
                    ).length
                  }
                  <small>
                    {" "}
                    / {problems.filter((p) => p.difficulty === d).length}
                  </small>
                </b>
              </div>
            ))}
          </div>
          <Link to="/problems" className="progress-footer">
            Continue your journey
            <ArrowRight size={15} />
          </Link>
        </Card>
      </div>
      <div className="stats-grid">
        {[
          {
            icon: Flame,
            n: streak(state.activity),
            label: "day study streak",
            color: "orange",
            note: state.activity.length
              ? "Keep showing up"
              : "Your first session starts it",
          },
          {
            icon: Layers3,
            n: mastered,
            label: "concepts mastered",
            color: "blue",
            note: `${lessons.length} guided lessons to explore`,
          },
          {
            icon: Brain,
            n: due,
            label: "cards ready to review",
            color: "purple",
            note: `${reviewed} cards studied so far`,
          },
          {
            icon: Target,
            n: state.mocks.length,
            label: "mock interviews",
            color: "green",
            note: "Turn your thinking into words",
          },
        ].map((s) => (
          <Card className="stat" key={s.label}>
            <span className={"icon-tile " + s.color}>
              <s.icon size={20} />
            </span>
            <div>
              <strong>{s.n}</strong>
              <span>{s.label}</span>
              <small>{s.note}</small>
            </div>
          </Card>
        ))}
      </div>
      <SectionTitle title="How do you want to grow today?" />
      <div className="action-grid">
        {[
          {
            to: "/learn",
            icon: BookOpen,
            color: "blue",
            title: "Learn a concept",
            description: "From the first intuition to the “aha” moment.",
            meta: "26 lessons · 18 categories",
          },
          {
            to: "/practice",
            icon: Brain,
            color: "purple",
            title: "Test my thinking",
            description: "An unfamiliar problem. Your own reasoning.",
            meta: "Blind patterns · Guided discovery",
          },
          {
            to: "/mock",
            icon: Timer,
            color: "green",
            title: "Simulate an interview",
            description: "Practice the conversation, not just the code.",
            meta: "30, 45 or 60 minutes",
          },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="action-card">
            <div className="row between">
              <span className={"icon-tile " + a.color}>
                <a.icon size={22} />
              </span>
              <ArrowRight size={18} />
            </div>
            <h3>{a.title}</h3>
            <p>{a.description}</p>
            <small>{a.meta}</small>
          </Link>
        ))}
      </div>
      <div className="two-col dashboard-bottom">
        <Card>
          <SectionTitle title="Build your foundations" to="/learn" />
          <div className="topic-bars">
            {topics.map((c) => {
              const ps = problems.filter((p) => p.category === c);
              const done = ps.filter(
                (p) => state.problems[p.id]?.completed,
              ).length;
              return (
                <Link
                  key={c}
                  to={"/category/" + encodeURIComponent(c)}
                  className="topic-bar"
                >
                  <span>{c}</span>
                  <ProgressBar value={(done / ps.length) * 100} />
                  <small>
                    {done}/{ps.length}
                  </small>
                </Link>
              );
            })}
          </div>
          <div className="card-note">
            <TrendingUp size={15} /> Mastery grows with understanding, not just
            checkmarks.
          </div>
        </Card>
        <Card>
          <SectionTitle
            title="Your study rhythm"
            to="/cram"
            label="Study planner"
          />
          <div
            className="heatmap"
            aria-label="Study activity over the past 56 days"
          >
            {Array.from({ length: 56 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - 55 + i);
              const key = dateKey(+d);
              const n = activeDays.get(key) ?? 0;
              return (
                <div
                  key={key}
                  title={`${key}: ${n} activities`}
                  className={n > 5 ? "active-high" : n ? "active-low" : ""}
                />
              );
            })}
          </div>
          <div className="heatmap-caption">
            <span>Last 8 weeks</span>
            <span>
              Less <i />
              <i className="active-low" />
              <i className="active-high" /> More
            </span>
          </div>
          <h3 className="recent-heading">Recent activity</h3>
          {recent.length ? (
            recent.map((a, i) => (
              <div className="activity-row" key={i}>
                <span className="activity-dot" />
                <div>
                  <span>{a.text}</span>
                  <small>
                    {new Date(a.at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p className="muted empty-inline">
              Your story starts here. Complete a lesson, practice a problem, or
              review a card to see your activity.
            </p>
          )}
        </Card>
      </div>
      <div className="bottom-banner">
        <span className="icon-tile yellow">
          <Sparkles size={20} />
        </span>
        <div>
          <strong>Understand the pattern. Solve the unfamiliar.</strong>
          <p>
            The Problem-Solving Lab helps you turn a brute-force idea into an
            efficient solution.
          </p>
        </div>
        <Link to="/lab" className="button">
          Explore the lab
          <ArrowRight size={16} />
        </Link>
      </div>
      {lessons.some((l) => state.topics[l.id]?.bookmarked) && (
        <Card>
          <SectionTitle title="Your bookmarks" />
          <div className="row wrap">
            {lessons
              .filter((l) => state.topics[l.id]?.bookmarked)
              .map((l) => (
                <Link className="button" to={"/lesson/" + l.id} key={l.id}>
                  {l.title}
                </Link>
              ))}
          </div>
        </Card>
      )}
      <p className="footer-note">
        Built for thoughtful practice. Your progress stays in this browser.{" "}
        <Link to="/settings">Back it up</Link> · {categories.length} categories
        · Start with{" "}
        <Link to={"/lesson/" + primaryLesson["Arrays & Hashing"]}>
          the fundamentals
        </Link>
        .
      </p>
    </>
  );
}
