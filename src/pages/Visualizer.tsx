import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { defaults, makeTrace, visualAlgorithms } from "../lib/traces";
import { lessons } from "../data";
import { Card, Code, Link, PageTitle, Tag } from "../components/ui";
export default function Visualizer({ initial }: { initial?: string }) {
  const [algorithm, setAlgorithm] = useState(
    visualAlgorithms.some((x) => x[0] === initial) ? initial! : "binary-search",
  );
  const [input, setInput] = useState(defaults[algorithm] ?? "");
  const [target, setTarget] = useState(12);
  const [applied, setApplied] = useState({
    input: defaults[algorithm] ?? "",
    target: 12,
  });
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [showCode, setShowCode] = useState(false);
  const result = useMemo(() => {
    try {
      return {
        trace: makeTrace(algorithm, applied.input, applied.target),
        error: "",
      };
    } catch (e) {
      return { trace: [], error: (e as Error).message };
    }
  }, [algorithm, applied]);
  const trace = result.trace;
  const current = trace[Math.min(step, Math.max(0, trace.length - 1))];
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () =>
        setStep((s) => {
          if (s >= trace.length - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      speed,
    );
    return () => clearInterval(t);
  }, [playing, speed, trace.length]);
  const choose = (id: string) => {
    setAlgorithm(id);
    setInput(defaults[id] ?? "");
    setApplied({ input: defaults[id] ?? "", target: id === "dp" ? 6 : 12 });
    setTarget(id === "dp" ? 6 : 12);
    setStep(0);
    setPlaying(false);
  };
  const l = lessons.find((l) => l.id === algorithm);
  return (
    <>
      <PageTitle
        eyebrow="ALGORITHM VISUALIZER"
        title="Make every step make sense."
        description="Inspect real execution states. Pause at a decision, predict the next move, then test your intuition."
      />
      <div className="toolbar filters">
        <label>
          Algorithm
          <select value={algorithm} onChange={(e) => choose(e.target.value)}>
            {visualAlgorithms.map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </label>
        {algorithm in defaults && (
          <>
            <label>
              {algorithm === "sliding-window"
                ? "String"
                : "Values, separated by commas"}
              <input value={input} onChange={(e) => setInput(e.target.value)} />
            </label>
            {["binary-search", "two-pointers", "dp"].includes(algorithm) && (
              <label>
                Target
                <input
                  className="small-input"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(+e.target.value)}
                />
              </label>
            )}
            <button
              className="button primary"
              onClick={() => {
                setApplied({ input, target });
                setStep(0);
                setPlaying(false);
              }}
            >
              Apply input
            </button>
            <button className="button" onClick={() => choose(algorithm)}>
              Reset example
            </button>
          </>
        )}
      </div>
      {result.error ? (
        <div role="alert" className="callout danger">
          {result.error}
        </div>
      ) : (
        current && (
          <>
            <Card className="visualizer-stage">
              <div className="row between">
                <Tag>
                  Step {step + 1} of {trace.length}
                </Tag>
                <span className="muted">
                  {visualAlgorithms.find((x) => x[0] === algorithm)?.[1]}
                </span>
              </div>
              {current.graph && (
                <svg
                  className="graph"
                  viewBox="0 0 640 300"
                  role="img"
                  aria-label="Directed graph showing active vertices and weighted edges"
                >
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="10"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                    </marker>
                  </defs>
                  {(() => {
                    const n = current.graph!.nodes.length;
                    const coords = current.graph!.nodes.map((_, i) => {
                      if (algorithm === "linked-list")
                        return [50 + (i * 540) / Math.max(1, n - 1), 150];
                      if (
                        algorithm === "heap" ||
                        algorithm.startsWith("tree")
                      ) {
                        const depth = Math.floor(Math.log2(i + 1)),
                          start = 2 ** depth - 1,
                          pos = i - start;
                        return [
                          ((pos + 1) * 640) / (2 ** depth + 1),
                          40 +
                            depth *
                              (220 / Math.max(1, Math.floor(Math.log2(n)))),
                        ];
                      }
                      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
                      return [
                        320 + 210 * Math.cos(angle),
                        150 + 110 * Math.sin(angle),
                      ];
                    });
                    return (
                      <>
                        {current.graph!.edges.map(([a, b, w], i) => {
                          const [x1, y1] = coords[a],
                            [x2, y2] = coords[b];
                          const d = Math.hypot(x2 - x1, y2 - y1) || 1;
                          const dx = ((x2 - x1) / d) * 24,
                            dy = ((y2 - y1) / d) * 24;
                          return (
                            <g key={i}>
                              <line
                                x1={x1 + dx}
                                y1={y1 + dy}
                                x2={x2 - dx}
                                y2={y2 - dy}
                                markerEnd="url(#arrow)"
                                className={
                                  current.active.includes(a) &&
                                  current.active.includes(b)
                                    ? "edge-active"
                                    : ""
                                }
                              />
                              {w !== undefined && (
                                <text
                                  x={(x1 + x2) / 2 + 8}
                                  y={(y1 + y2) / 2 - 8}
                                  className="weight"
                                >
                                  {w}
                                </text>
                              )}
                            </g>
                          );
                        })}
                        {coords.map(([x, y], i) => (
                          <g
                            key={i}
                            className={
                              current.active.includes(i)
                                ? "graph-node active"
                                : "graph-node"
                            }
                          >
                            <circle cx={x} cy={y} r={23} />
                            <text x={x} y={y + 5}>
                              {current.graph!.nodes[i]}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              )}
              {current.grid ? (
                <div
                  className="dp-grid"
                  style={{
                    gridTemplateColumns: `repeat(${current.grid[0].length}, 1fr)`,
                  }}
                >
                  {current.grid.flatMap((row, i) =>
                    row.map((v, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={
                          current.variables.i === i && current.variables.j === j
                            ? "active"
                            : ""
                        }
                      >
                        <small>
                          {i},{j}
                        </small>
                        {v}
                      </div>
                    )),
                  )}
                </div>
              ) : (
                <div className="array-visual">
                  {current.values.map((v, i) => (
                    <div
                      className={
                        "array-cell " +
                        (current.active.includes(i) ? "active " : "") +
                        (current.muted?.includes(i) ? "eliminated" : "")
                      }
                      key={i}
                    >
                      <span>{v}</span>
                      <small>{i}</small>
                      {current.variables.left === i && <b>L</b>}
                      {current.variables.right === i && <b>R</b>}
                    </div>
                  ))}
                </div>
              )}
              <div className="trace-message" aria-live="polite">
                {current.message}
              </div>
              <div className="player-controls">
                <button
                  aria-label="Restart visualization"
                  className="button"
                  onClick={() => {
                    setStep(0);
                    setPlaying(false);
                  }}
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  aria-label="Previous step"
                  className="button"
                  disabled={step === 0}
                  onClick={() => {
                    setStep((s) => s - 1);
                    setPlaying(false);
                  }}
                >
                  <SkipBack size={18} />
                </button>
                <button
                  className="button primary"
                  onClick={() => {
                    if (step >= trace.length - 1) setStep(0);
                    setPlaying(!playing);
                  }}
                >
                  {playing ? <Pause size={18} /> : <Play size={18} />}{" "}
                  {playing ? "Pause" : "Play"}
                </button>
                <button
                  aria-label="Next step"
                  className="button"
                  disabled={step >= trace.length - 1}
                  onClick={() => {
                    setStep((s) => s + 1);
                    setPlaying(false);
                  }}
                >
                  <SkipForward size={18} />
                </button>
                <select
                  aria-label="Playback speed"
                  value={speed}
                  onChange={(e) => setSpeed(+e.target.value)}
                >
                  <option value={1800}>0.5× speed</option>
                  <option value={1000}>1× speed</option>
                  <option value={500}>2× speed</option>
                </select>
              </div>
              <input
                type="range"
                aria-label="Trace step"
                min={0}
                max={trace.length - 1}
                value={step}
                onChange={(e) => {
                  setStep(+e.target.value);
                  setPlaying(false);
                }}
              />
            </Card>
            <Card className="mt">
              <h3>State at this step</h3>
              <div className="variables">
                {Object.entries(current.variables).map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <code>{String(v)}</code>
                  </div>
                ))}
              </div>
            </Card>
            {l && (
              <Card className="mt">
                <div className="row between">
                  <Link to={"/lesson/" + l.id} className="text-link">
                    Read the full lesson
                  </Link>
                  <button
                    className="button"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? "Hide" : "Show"} Python template
                  </button>
                </div>
                {showCode && <Code code={l.code} />}
              </Card>
            )}
          </>
        )
      )}
    </>
  );
}
