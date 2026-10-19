import { useState } from "react";
import { Download, Upload } from "lucide-react";
import {
  STORAGE_KEY,
  initialState,
  useStudy,
  validateBackup,
} from "../lib/store";
import type { StudyState } from "../lib/types";
import { Card, PageTitle } from "../components/ui";
export default function Settings() {
  const { state, setState, error, recover } = useStudy();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<StudyState | null>(null);
  const [reset, setReset] = useState(false);
  const download = (raw: string, name: string) => {
    const url = URL.createObjectURL(
      new Blob([raw], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <PageTitle
        eyebrow="SETTINGS & BACKUP"
        title="Make this workspace yours."
        description="Your study data lives in this browser on this device. Export a backup to keep a copy or move it elsewhere."
      />
      <div className="two-col">
        <Card>
          <h2>Study preferences</h2>
          <label>
            Theme
            <select
              value={state.preferences.theme}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  preferences: {
                    ...s.preferences,
                    theme: e.target.value as StudyState["preferences"]["theme"],
                  },
                }))
              }
            >
              <option value="light">Light · clear and spacious</option>
              <option value="dark">Dark · comfortable contrast</option>
              <option value="focus">Focus · reduced distractions</option>
            </select>
          </label>
          <label>
            Interview date
            <input
              type="date"
              value={state.preferences.interviewDate}
              onChange={(e) => {
                if (e.target.value)
                  setState((s) => ({
                    ...s,
                    preferences: {
                      ...s.preferences,
                      interviewDate: e.target.value,
                    },
                  }));
              }}
            />
          </label>
          <label>
            Daily study target (minutes)
            <input
              type="number"
              min={5}
              max={240}
              value={state.preferences.dailyMinutes}
              onChange={(e) => {
                const n = +e.target.value;
                if (n >= 5 && n <= 240)
                  setState((s) => ({
                    ...s,
                    preferences: { ...s.preferences, dailyMinutes: n },
                  }));
              }}
            />
          </label>
          <p>
            After your interview date, the dashboard automatically shifts to
            general algorithm mastery.
          </p>
        </Card>
        <Card>
          <h2>Keep your progress portable</h2>
          <p>
            Backups include progress, notes, bookmarks, flashcard history,
            journal entries, interview results, drafts, and preferences. Import
            replaces current progress after you confirm the preview.
          </p>
          <div className="row wrap">
            <button
              className="button primary"
              onClick={() =>
                download(
                  JSON.stringify(state, null, 2),
                  "cheatcode-progress-" +
                    new Date().toISOString().slice(0, 10) +
                    ".json",
                )
              }
            >
              <Download size={16} />
              Export JSON
            </button>
            <label className="button file-button">
              <Upload size={16} />
              Import JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    if (file.size > 10000000)
                      throw new Error("Backup must be smaller than 10 MB.");
                    setPending(validateBackup(JSON.parse(await file.text())));
                    setMessage("");
                  } catch (err) {
                    setMessage((err as Error).message);
                    setPending(null);
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {pending && (
            <div className="callout">
              <div>
                <strong>Backup preview</strong>
                <p>
                  {Object.keys(pending.problems).length} tracked problems ·{" "}
                  {Object.keys(pending.reviews).length} reviewed cards ·{" "}
                  {pending.mistakes.length} journal entries ·{" "}
                  {pending.mocks.length} interviews
                </p>
                <p>This will replace your current local progress.</p>
                <div className="row">
                  <button
                    className="button primary"
                    onClick={() => {
                      setState(pending);
                      recover();
                      setPending(null);
                      setMessage("Backup imported successfully.");
                    }}
                  >
                    Replace with this backup
                  </button>
                  <button className="button" onClick={() => setPending(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {message && <p role="status">{message}</p>}
        </Card>
      </div>
      {error && (
        <Card className="mt">
          <h2>Storage recovery</h2>
          <p>{error}</p>
          <div className="row wrap">
            <button
              className="button"
              onClick={() =>
                download(
                  localStorage.getItem(STORAGE_KEY) ?? "{}",
                  "cheatcode-original-storage.json",
                )
              }
            >
              Download original stored data
            </button>
            <button className="button" onClick={recover}>
              Allow saving current session
            </button>
          </div>
        </Card>
      )}
      <Card className="mt">
        <h2>Content coverage & limitations</h2>
        <p>
          All 150 checklist entries are discoverable and trackable across 18
          categories. Each has an original concise study brief; 34 core problems
          also include worked Python solutions and executable example cases. The
          26 full algorithm lessons provide tested Python templates, worked
          examples, correctness explanations, and practice questions. The
          remaining 116 problems currently link to pattern templates rather than
          full individual editorials. Category templates are labeled and are not
          presented as problem-specific solutions.
        </p>
        <p>
          Eight original practice scenarios power blind reasoning and mock
          interviews. Flashcard scheduling and study recommendations use
          transparent local rules. Written reasoning and Python scratchpads are
          self-reviewed against references; they are not automatically executed
          or graded.
        </p>
        <p>
          Visualizers use deterministic traces. Graph, tree, interval, and 2-D
          DP examples are fixed; supported array and string inputs can be
          edited. There is no login, cloud sync, or access to prior ChatGPT
          history. Advanced topics beyond the included Fenwick lesson remain
          future work.
        </p>
      </Card>
      <Card className="mt">
        <h2>Reset local study data</h2>
        <p>Download a backup first if you may want this progress later.</p>
        {reset ? (
          <div className="row">
            <button
              className="button danger-button"
              onClick={() => {
                setState(initialState());
                recover();
                setReset(false);
                setMessage("Local progress reset.");
              }}
            >
              Confirm reset all progress
            </button>
            <button className="button" onClick={() => setReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="button" onClick={() => setReset(true)}>
            Reset progress…
          </button>
        )}
      </Card>
    </>
  );
}
