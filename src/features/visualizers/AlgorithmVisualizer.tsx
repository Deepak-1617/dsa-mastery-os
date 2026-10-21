import { useEffect, useState } from "react";
import type { VisualizerConfig } from "../../types/models";

export function AlgorithmVisualizer({ config }: { config: VisualizerConfig }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const step = config.steps[index];

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [config.title, config.steps]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setIndex((current) => {
        if (current >= config.steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, speed);
    return () => window.clearTimeout(id);
  }, [playing, index, speed, config.steps.length]);

  if (!step) return null;
  const cells = step.array ?? [];
  const windowRange = step.window;

  return (
    <div className="viz" aria-label={config.title}>
      <div>
        <p className="eyebrow">VISUALIZER</p>
        <h3>{config.title}</h3>
        <p className="muted">{config.description}</p>
      </div>
      {cells.length > 0 && (
        <div className="viz-cells">
          {cells.map((value, i) => {
            const active = step.highlight?.includes(i);
            const inWindow =
              windowRange && i >= windowRange.left && i <= windowRange.right;
            const pointer = step.pointers
              ? Object.entries(step.pointers)
                  .filter(([, idx]) => idx === i)
                  .map(([name]) => name)
                  .join(" ")
              : "";
            return (
              <div key={`${i}-${value}`} className={`viz-cell ${active ? "active" : ""} ${inWindow ? "in-window" : ""}`}>
                <div>{value}</div>
                <small>{pointer || i}</small>
              </div>
            );
          })}
        </div>
      )}
      {step.stack && <p>Stack (top at right): [{step.stack.join(", ")}]</p>}
      {step.queue && <p>Queue (front at left): [{step.queue.join(", ")}]</p>}
      {step.bits && <p>Bits value={step.bits.value} {step.bits.mask != null ? `mask=${step.bits.mask}` : ""}</p>}
      {step.nodes && (
        <p>
          Nodes: {step.nodes.map((node) => `${node.value}→${node.next ?? "null"}`).join("  ")}
        </p>
      )}
      {step.extra && (
        <p className="viz-meta">
          {Object.entries(step.extra)
            .map(([k, v]) => `${k}: ${String(v)}`)
            .join(" · ")}
        </p>
      )}
      <p>
        <strong>{step.label}</strong>
        {step.operation ? ` — ${step.operation}` : ""}
      </p>
      <div className="viz-controls">
        <button className="button button-secondary" onClick={() => setIndex(0)}>Reset</button>
        <button className="button button-secondary" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>Previous</button>
        <button className="button button-primary" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
        <button className="button button-secondary" disabled={index >= config.steps.length - 1} onClick={() => setIndex((i) => Math.min(config.steps.length - 1, i + 1))}>Next</button>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Speed
          <input
            type="range"
            min={300}
            max={1600}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label="Visualizer speed"
          />
        </label>
        <span className="viz-meta">
          Step {index + 1} / {config.steps.length}
        </span>
      </div>
    </div>
  );
}
