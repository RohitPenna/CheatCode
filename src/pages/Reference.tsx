import { useState } from "react";
import { Search } from "lucide-react";
import { toolkit } from "../data/toolkit";
import { lessons } from "../data";
import { Card, Code, Link, PageTitle, Tag } from "../components/ui";
export function Toolkit() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("All");
  const [templates, setTemplates] = useState(false);
  return (
    <>
      <PageTitle
        eyebrow="PYTHON TOOLKIT"
        title="Less syntax friction. More thinking."
        description="Copyable Python 3 references, realistic examples, operation costs, and the gotchas that matter."
      />
      <div className="toolbar">
        <div className="input-icon">
          <Search size={17} />
          <input
            aria-label="Search Python toolkit"
            placeholder="Search functions, templates, or gotchas…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          aria-label="Python reference group"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          {["All", ...new Set(toolkit.map((t) => t.group))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button
          className={"button " + (templates ? "selected" : "")}
          aria-pressed={templates}
          onClick={() => setTemplates(!templates)}
        >
          Algorithm templates
        </button>
      </div>
      <div className="two-col">
        {!templates
          ? toolkit
              .filter(
                (t) =>
                  (group === "All" || group === t.group) &&
                  (
                    t.title +
                    " " +
                    t.description +
                    " " +
                    t.code +
                    " " +
                    t.gotcha
                  )
                    .toLowerCase()
                    .includes(q.toLowerCase()),
              )
              .map((t) => (
                <Card key={t.title}>
                  <Tag tone="neutral">{t.group}</Tag>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                  <Code code={t.code} />
                  <div className="callout">
                    <p>{t.gotcha}</p>
                  </div>
                </Card>
              ))
          : lessons
              .filter((l) =>
                (l.title + " " + l.code + " " + l.clues)
                  .toLowerCase()
                  .includes(q.toLowerCase()),
              )
              .map((l) => (
                <Card key={l.id}>
                  <Tag>{l.category}</Tag>
                  <h3>{l.title}</h3>
                  <p>{l.state}</p>
                  <Code code={l.code} />
                  <p>{l.time}</p>
                  <Link to={"/lesson/" + l.id} className="text-link">
                    Understand why it works
                  </Link>
                </Card>
              ))}
      </div>
    </>
  );
}
export function Sheets() {
  const [q, setQ] = useState("");
  return (
    <>
      <PageTitle
        eyebrow="CHEAT SHEETS"
        title="A small cue. The whole idea."
        description="Recognition is a starting hypothesis. Check the invariant, constraints, and complexity before committing."
      />
      <input
        aria-label="Search cheat sheets"
        className="full-search"
        placeholder="Search algorithms, clues, or templates…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="two-col">
        {lessons
          .filter((l) =>
            (l.title + " " + l.clues + " " + l.pitfalls)
              .toLowerCase()
              .includes(q.toLowerCase()),
          )
          .map((l) => (
            <Card key={l.id}>
              <h3>{l.title}</h3>
              <div className="reference-fact">
                <small>CONSIDER WHEN</small>
                <p>{l.clues}</p>
              </div>
              <div className="reference-fact">
                <small>WHY IT WORKS</small>
                <p>{l.invariant}</p>
              </div>
              <div className="reference-fact">
                <small>COST</small>
                <p>
                  {l.time}
                  <br />
                  {l.space}
                </p>
              </div>
              <div className="reference-fact">
                <small>CAVEAT</small>
                <p>{l.pitfalls}</p>
              </div>
              <details>
                <summary>Python template</summary>
                <Code code={l.code} />
              </details>
              <Link to={"/lesson/" + l.id} className="text-link">
                Open lesson
              </Link>
            </Card>
          ))}
      </div>
    </>
  );
}
