import { useState, type ReactNode } from "react";
import { ArrowUpRight, Check, Copy, ChevronRight } from "lucide-react";
import { blankProgress, useStudy } from "../lib/store";
import type { Status } from "../lib/types";
export const go = (path: string) => {
  window.location.hash = path;
};
export function Link({
  to,
  children,
  className = "",
  ...rest
}: {
  to: string;
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <a href={"#" + to} className={className} {...rest}>
      {children}
    </a>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={"card " + className}>{children}</section>;
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function Tag({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={"tag " + tone}>{children}</span>;
}
export function Code({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="code">
      <div className="code-top">
        <span>
          <i /> Python 3
        </span>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              setError("Select the code below to copy it.");
            }
          }}
          aria-label="Copy Python code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {error && <p role="status">{error}</p>}
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: Math.max(0, Math.min(100, value)) + "%" }} />
    </div>
  );
}
export function SectionTitle({
  title,
  to,
  label = "View all",
}: {
  title: string;
  to?: string;
  label?: string;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {to && (
        <Link to={to}>
          {label}
          <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function ProgressControls({
  kind,
  id,
  label,
}: {
  kind: "problems" | "topics";
  id: string;
  label: string;
}) {
  const { state, updateProgress } = useStudy();
  const p = state[kind][id] ?? blankProgress();
  return (
    <div className="tracking">
      <div className="form-row">
        <label>
          Status
          <select
            value={p.status}
            onChange={(e) =>
              updateProgress(
                kind,
                id,
                { status: e.target.value as Status },
                `Updated ${label}`,
              )
            }
          >
            {["Not Started", "Learning", "Practicing", "Mastered"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Confidence
          <select
            value={p.confidence}
            onChange={(e) =>
              updateProgress(
                kind,
                id,
                { confidence: +e.target.value },
                `Rated confidence: ${label}`,
              )
            }
          >
            {[
              "Not rated",
              "1 · Need help",
              "2 · Uncertain",
              "3 · Getting there",
              "4 · Confident",
              "5 · Can teach it",
            ].map((x, i) => (
              <option key={i} value={i}>
                {x}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="row wrap">
        <label className="check-label">
          <input
            type="checkbox"
            checked={p.completed}
            onChange={(e) =>
              updateProgress(
                kind,
                id,
                { completed: e.target.checked },
                `${e.target.checked ? "Completed" : "Reopened"} ${label}`,
              )
            }
          />
          Completed
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={p.bookmarked}
            onChange={(e) =>
              updateProgress(kind, id, { bookmarked: e.target.checked })
            }
          />
          Bookmark
        </label>
      </div>
      <label>
        Personal notes
        <textarea
          value={p.notes}
          onChange={(e) => updateProgress(kind, id, { notes: e.target.value })}
          placeholder="What clicked? What should you revisit?"
          rows={4}
        />
      </label>
      <small>
        Saved automatically in this browser. Completion and confidence are
        separate.
      </small>
    </div>
  );
}
export function External({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-link">
      {children}
      <ArrowUpRight size={14} />
    </a>
  );
}
