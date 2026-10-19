import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Progress, StudyState, Review } from "./types";
export const STORAGE_KEY = "cheatcode.study.v1";
export const blankProgress = (): Progress => ({
  status: "Not Started",
  completed: false,
  confidence: 0,
  notes: "",
  bookmarked: false,
  updated: 0,
});
export const initialState = (): StudyState => ({
  version: 1,
  problems: {},
  topics: {},
  reviews: {},
  mistakes: [],
  mocks: [],
  activity: [],
  preferences: {
    theme: "light",
    interviewDate: "2026-10-21",
    dailyMinutes: 30,
  },
  drafts: {},
});
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const finite = (x: unknown): x is number =>
  typeof x === "number" && Number.isFinite(x);
export function validateBackup(raw: unknown): StudyState {
  if (!object(raw) || raw.version !== 1)
    throw new Error("Choose a CheatCode version 1 JSON backup.");
  const s = raw as unknown as StudyState;
  for (const key of ["problems", "topics"] as const) {
    if (!object(s[key])) throw new Error(`Invalid ${key} data.`);
    for (const p of Object.values(s[key]))
      if (
        !object(p) ||
        !["Not Started", "Learning", "Practicing", "Mastered"].includes(
          p.status as string,
        ) ||
        typeof p.completed !== "boolean" ||
        !finite(p.confidence) ||
        p.confidence < 0 ||
        p.confidence > 5 ||
        typeof p.notes !== "string" ||
        typeof p.bookmarked !== "boolean" ||
        !finite(p.updated)
      )
        throw new Error("Invalid progress entry.");
  }
  if (
    !object(s.preferences) ||
    !["light", "dark", "focus"].includes(s.preferences.theme) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(s.preferences.interviewDate) ||
    !Number.isFinite(Date.parse(s.preferences.interviewDate)) ||
    new Date(s.preferences.interviewDate).toISOString().slice(0, 10) !==
      s.preferences.interviewDate ||
    !finite(s.preferences.dailyMinutes) ||
    s.preferences.dailyMinutes < 5 ||
    s.preferences.dailyMinutes > 240
  )
    throw new Error("Invalid preferences.");
  if (!object(s.reviews)) throw new Error("Invalid reviews.");
  for (const r of Object.values(s.reviews))
    if (
      !object(r) ||
      ![r.due, r.interval, r.repetitions, r.lapses].every(
        (x) => finite(x) && x >= 0,
      ) ||
      !Array.isArray(r.history) ||
      !r.history.every(
        (h) =>
          object(h) &&
          finite(h.at) &&
          ["Again", "Hard", "Good", "Easy"].includes(h.rating as string),
      )
    )
      throw new Error("Invalid flashcard history.");
  if (
    !Array.isArray(s.mistakes) ||
    !s.mistakes.every(
      (m) =>
        object(m) &&
        ["id", "topic", "confusion", "correction", "example"].every(
          (k) => typeof m[k] === "string",
        ) &&
        finite(m.created),
    )
  )
    throw new Error("Invalid mistake journal.");
  if (
    !Array.isArray(s.mocks) ||
    !s.mocks.every(
      (m) =>
        object(m) &&
        typeof m.id === "string" &&
        typeof m.problem === "string" &&
        typeof m.notes === "string" &&
        [m.duration, m.elapsed, m.hints, m.created].every(finite) &&
        object(m.scores) &&
        Object.values(m.scores).every((x) => finite(x) && x >= 1 && x <= 5),
    )
  )
    throw new Error("Invalid mock interviews.");
  if (
    !Array.isArray(s.activity) ||
    !s.activity.every(
      (a) =>
        object(a) &&
        finite(a.at) &&
        typeof a.text === "string" &&
        (a.topic === undefined || typeof a.topic === "string"),
    )
  )
    throw new Error("Invalid activity.");
  if (
    !object(s.drafts) ||
    !Object.values(s.drafts).every((x) => typeof x === "string")
  )
    throw new Error("Invalid drafts.");
  return structuredClone(s);
}
export function readState(storage: Pick<Storage, "getItem">): {
  state: StudyState;
  error: string;
} {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    return {
      state: saved ? validateBackup(JSON.parse(saved)) : initialState(),
      error: "",
    };
  } catch {
    return {
      state: initialState(),
      error:
        "Your saved data could not be read. It has not been overwritten. Export or recover it in Settings before saving new progress.",
    };
  }
}
export function scheduleReview(
  previous: Review | undefined,
  rating: string,
  now = Date.now(),
): Review {
  const old = previous ?? {
    due: 0,
    interval: 0,
    repetitions: 0,
    lapses: 0,
    history: [],
  };
  const interval =
    rating === "Again"
      ? 0
      : rating === "Hard"
        ? Math.max(1, Math.round(old.interval * 1.2))
        : rating === "Good"
          ? Math.max(1, Math.round(old.interval * 2.5))
          : Math.max(4, Math.round(old.interval * 3.5));
  return {
    interval,
    due: now + (rating === "Again" ? 600000 : interval * 86400000),
    repetitions: old.repetitions + 1,
    lapses: old.lapses + (rating === "Again" ? 1 : 0),
    history: [...old.history, { at: now, rating }].slice(-100),
  };
}
export function daysUntil(date: string, now = new Date()): number {
  const [y, m, d] = date.split("-").map(Number);
  return Math.round(
    (Date.UTC(y, m - 1, d) -
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) /
      86400000,
  );
}
export function dateKey(time: number) {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function streak(
  activity: StudyState["activity"],
  now = Date.now(),
): number {
  const days = new Set(activity.map((a) => dateKey(a.at)));
  const date = new Date(now);
  if (!days.has(dateKey(+date))) date.setDate(date.getDate() - 1);
  let n = 0;
  while (days.has(dateKey(+date))) {
    n++;
    date.setDate(date.getDate() - 1);
  }
  return n;
}
type Store = {
  state: StudyState;
  setState: (update: StudyState | ((s: StudyState) => StudyState)) => void;
  updateProgress: (
    kind: "problems" | "topics",
    id: string,
    patch: Partial<Progress>,
    label?: string,
  ) => void;
  log: (text: string, topic?: string) => void;
  error: string;
  recover: () => void;
};
const Context = createContext<Store | null>(null);
export function StudyProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(() =>
    readState({ getItem: (key) => window.localStorage.getItem(key) }),
  );
  const [state, setState] = useState(loaded.state);
  const [error, setError] = useState(loaded.error);
  const [blocked, setBlocked] = useState(!!loaded.error);
  useEffect(() => {
    document.documentElement.dataset.theme = state.preferences.theme;
    if (blocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setError("");
    } catch {
      setError(
        "Progress could not be saved to this browser. Export a backup before closing.",
      );
    }
  }, [state, blocked]);
  const log = (text: string, topic?: string) =>
    setState((s) => ({
      ...s,
      activity: [{ at: Date.now(), text, topic }, ...s.activity].slice(0, 2000),
    }));
  const updateProgress = (
    kind: "problems" | "topics",
    id: string,
    patch: Partial<Progress>,
    label?: string,
  ) =>
    setState((s) => ({
      ...s,
      [kind]: {
        ...s[kind],
        [id]: {
          ...blankProgress(),
          ...s[kind][id],
          ...patch,
          updated: Date.now(),
        },
      },
      activity: label
        ? [{ at: Date.now(), text: label, topic: id }, ...s.activity].slice(
            0,
            2000,
          )
        : s.activity,
    }));
  return (
    <Context.Provider
      value={{
        state,
        setState,
        updateProgress,
        log,
        error,
        recover: () => {
          setBlocked(false);
          setError("");
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStudy() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("StudyProvider is required");
  return ctx;
}

// Context identity must stay consistent across consumers during development.
// A full reload after editing this module restores the saved state atomically.
if (import.meta.hot) {
  import.meta.hot.accept(() => window.location.reload());
}
