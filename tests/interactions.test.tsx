// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "../src/App";
import { StudyProvider, STORAGE_KEY, initialState } from "../src/lib/store";
import Recall from "../src/pages/Recall";
import Mock from "../src/pages/Mock";
import Settings from "../src/pages/Settings";
import Visualizer from "../src/pages/Visualizer";
import Practice from "../src/pages/Practice";
import { LessonPage } from "../src/pages/Learn";
import { Problems } from "../src/pages/Problems";
const wrap = (ui: React.ReactNode) =>
  render(<StudyProvider>{ui}</StudyProvider>);
beforeEach(() => {
  localStorage.clear();
  window.location.hash = "/";
  vi.stubGlobal("scrollTo", vi.fn());
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
describe("critical learning interactions", () => {
  it("tracks completion independently of confidence and reloads persisted progress", () => {
    let view = wrap(<Problems />);
    const box = screen.getByLabelText("Complete Two Sum");
    fireEvent.click(box);
    let s = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(s.problems["two-sum"].completed).toBe(true);
    expect(s.problems["two-sum"].confidence).toBe(0);
    view.unmount();
    view = wrap(<Problems />);
    expect(
      (screen.getByLabelText("Complete Two Sum") as HTMLInputElement).checked,
    ).toBe(true);
    fireEvent.change(screen.getByLabelText("Search problems"), {
      target: { value: "median of two" },
    });
    expect(screen.getByText("1 problems shown")).toBeTruthy();
  });
  it("filters all 150 problems by topic and difficulty", () => {
    wrap(<Problems />);
    fireEvent.change(screen.getByLabelText("Filter by category"), {
      target: { value: "Backtracking" },
    });
    expect(screen.getByText("10 problems shown")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Filter by difficulty"), {
      target: { value: "Hard" },
    });
    expect(screen.getByText("1 problems shown")).toBeTruthy();
  });
  it("changes lesson depth without losing a saved discovery prediction", () => {
    wrap(<LessonPage id="binary-search" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Deep Dive", exact: true }),
    );
    expect(screen.getByText("Start from brute force")).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: "Interactive Discovery" }),
    );
    fireEvent.change(screen.getByLabelText("What happens next, and why?"), {
      target: { value: "Discard the smaller half." },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Quick Learn", exact: true }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Interactive Discovery" }),
    );
    expect(
      (
        screen.getByLabelText(
          "What happens next, and why?",
        ) as HTMLTextAreaElement
      ).value,
    ).toBe("Discard the smaller half.");
    fireEvent.click(
      screen.getByRole("button", { name: /Explain more simply/ }),
    );
    expect(
      screen.getAllByText(/Check the middle of a sorted shelf/).length,
    ).toBeGreaterThan(0);
  });
  it("requires a reveal before rating and saves the spaced repetition schedule", () => {
    wrap(<Recall />);
    expect(screen.queryByRole("button", { name: /Again/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Reveal answer/ }));
    fireEvent.click(screen.getByRole("button", { name: /Again/ }));
    const reviews = Object.values(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).reviews,
    ) as { due: number; lapses: number }[];
    expect(reviews).toHaveLength(1);
    expect(reviews[0].lapses).toBe(1);
    expect(reviews[0].due - Date.now()).toBeGreaterThan(590000);
    expect(screen.getByText("1 reviewed this session")).toBeTruthy();
  });
  it("moves the visualizer forward and backward and validates edited input", () => {
    wrap(<Visualizer initial="binary-search" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Next step", exact: true }),
    );
    expect(screen.getByText(/Inspect index 3: 12 matches 12/)).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: "Previous step", exact: true }),
    );
    expect(screen.getByText("Step 1 of 3")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Values, separated by commas"), {
      target: { value: "8,1,4" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply input" }));
    expect(screen.getByRole("alert").textContent).toContain("sorted");
  });
  it("runs playback then pauses without advancing further", () => {
    vi.useFakeTimers();
    wrap(<Visualizer initial="binary-search" />);
    fireEvent.click(screen.getByRole("button", { name: "Play", exact: true }));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Pause", exact: true }));
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
  });
  it("hides reference answers during blind practice and saves reasoning", () => {
    wrap(<Practice />);
    expect(screen.queryByText("Reference reasoning")).toBeNull();
    const submit = screen.getByRole("button", { name: "Submit & compare" });
    expect((submit as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText("Your reasoning"), {
      target: { value: "Track last positions and move left past any repeat." },
    });
    fireEvent.click(submit);
    expect(screen.getByText("Reference reasoning")).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).drafts[
        "practice-quiet-channel"
      ],
    ).toContain("last positions");
  });
  it("keeps the mock deadline across remounts and records honest self-assessment", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-18T12:00:00"));
    let view = wrap(<Mock />);
    fireEvent.click(screen.getByRole("button", { name: "Start interview" }));
    act(() => vi.advanceTimersByTime(30000));
    expect(screen.getByText("44:30")).toBeTruthy();
    view.unmount();
    view = wrap(<Mock />);
    expect(screen.getByText("44:30")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Finish & review" }));
    expect(screen.getByText("Self-assessment")).toBeTruthy();
    for (const label of [
      "Understanding",
      "Pattern recognition",
      "Algorithm selection",
      "Correctness",
      "Complexity",
      "Edge cases",
      "Communication",
      "Reasoning efficiency",
    ])
      fireEvent.change(screen.getByLabelText(label + " score"), {
        target: { value: "3" },
      });
    fireEvent.click(
      screen.getByRole("button", { name: "Save interview review" }),
    );
    const m = JSON.parse(localStorage.getItem(STORAGE_KEY)!).mocks[0];
    expect(m.elapsed).toBe(30);
    expect(m.hints).toBe(0);
    expect(Object.values(m.scores)).toEqual(Array(8).fill(3));
  });
  it("automatically exposes review when a mock deadline expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-18T12:00:00"));
    wrap(<Mock />);
    fireEvent.change(screen.getByLabelText("Duration"), {
      target: { value: "30" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Start interview" }));
    act(() => vi.advanceTimersByTime(30 * 60 * 1000));
    expect(screen.getByText("Session complete")).toBeTruthy();
    expect(screen.getByText("Reference review")).toBeTruthy();
  });
  it("theme controls persist and imported data needs a concrete replacement confirmation", () => {
    wrap(<Settings />);
    fireEvent.change(screen.getByLabelText("Theme"), {
      target: { value: "dark" },
    });
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).preferences.theme,
    ).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Reset progress…" }));
    expect(
      screen.getByRole("button", { name: "Confirm reset all progress" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).preferences.theme,
    ).toBe("dark");
  });
  it("opens working global search and routes to a lesson", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Search anything" }));
    fireEvent.change(screen.getByLabelText("Global search query"), {
      target: { value: "dijkstra" },
    });
    expect(
      screen.getByRole("link", { name: /Dijkstra’s shortest paths/ }),
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole("link", { name: /Dijkstra’s shortest paths/ }),
    );
    await waitFor(() => expect(window.location.hash).toBe("#/lesson/dijkstra"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("uses mastery mode after the configured interview date", () => {
    const s = initialState();
    s.preferences.interviewDate = "2020-01-01";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    render(<App />);
    expect(screen.getByText("Algorithm mastery mode")).toBeTruthy();
  });
});

describe("backup import safety", () => {
  it("previews a valid backup and leaves current data untouched until replacement", async () => {
    wrap(<Settings />);
    const imported = initialState();
    imported.preferences.theme = "dark";
    imported.preferences.interviewDate = "2027-01-15";
    const file = new File(["backup"], "backup.json", {
      type: "application/json",
    });
    Object.defineProperty(file, "text", {
      value: async () => JSON.stringify(imported),
    });
    fireEvent.change(screen.getByLabelText("Import JSON"), {
      target: { files: [file] },
    });
    await waitFor(() =>
      expect(screen.getByText("Backup preview")).toBeTruthy(),
    );
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).preferences.theme,
    ).toBe("light");
    fireEvent.click(
      screen.getByRole("button", { name: "Replace with this backup" }),
    );
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).preferences.interviewDate,
    ).toBe("2027-01-15");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByText("Backup imported successfully.")).toBeTruthy();
  });
  it("rejects invalid imported data and preserves existing progress", async () => {
    wrap(<Settings />);
    const file = new File(["invalid"], "bad.json", {
      type: "application/json",
    });
    Object.defineProperty(file, "text", {
      value: async () => JSON.stringify({ version: 99 }),
    });
    fireEvent.change(screen.getByLabelText("Import JSON"), {
      target: { files: [file] },
    });
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("version 1"),
    );
    expect(screen.queryByText("Backup preview")).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).version).toBe(1);
  });
});

describe("route coverage", () => {
  it.each([
    "/",
    "/learn",
    "/category/Backtracking",
    "/lesson/dijkstra",
    "/problems",
    "/problem/two-sum",
    "/lab",
    "/practice",
    "/recall",
    "/visualizer",
    "/mock",
    "/journal",
    "/toolkit",
    "/sheets",
    "/cram",
    "/interview",
    "/settings",
  ])("renders %s without an error boundary", (path) => {
    window.location.hash = path;
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.queryByText("Something interrupted this page.")).toBeNull();
  });
});
