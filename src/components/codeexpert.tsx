import { useState } from "react";
import { DpMasterclass } from "./dp-masterclass";

function FlowsPlaceholder() {
  const topics = [
    ["01", "Flussnetzwerke", "Kapazitäten, Fluss-Erhaltung, Quelle & Senke"],
    ["02", "Max-Flow / Min-Cut", "Ford-Fulkerson, Residualgraph, augmentierende Pfade"],
    ["03", "Reduktionen", "Matchings, Knoten-Kapazitäten, Super-Source / Super-Sink"],
    ["04", "Playground", "Interaktiver Fluss-Visualizer"],
  ];
  return (
    <div className="ce-grid ce-grid-4">
      {topics.map(([n, t, d]) => (
        <section key={n} className="ce-col">
          <p className="mb-3 font-mono text-[11px] uppercase text-primary">Modul {n}</p>
          <p className="text-lg font-bold leading-tight">{t}</p>
          <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          <p className="mt-4 inline-block border border-dashed border-border px-2 py-1 font-mono text-[10px] uppercase text-muted-foreground">In Vorbereitung</p>
        </section>
      ))}
    </div>
  );
}

const TABS = [
  { id: "theory", n: "T1", label: "Probability DP", sub: "Masterclass" },
  { id: "flows", n: "T2", label: "Networks & Flows", sub: "Masterclass" },
] as const;

export function CodeExpert() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("theory");
  return (
    <div className="ce-wrap">
      <div role="tablist" aria-label="Themen" className="flex border-y border-foreground">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`flex-1 border-r border-border px-4 py-2.5 text-left last:border-r-0 transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "hover:text-primary"}`}>
            <span className="font-mono text-[11px] uppercase">[{t.n}] {t.label}</span>
            <span className="ml-2 text-sm font-semibold">„{t.sub}“</span>
          </button>
        ))}
      </div>
      {tab === "theory" ? <DpMasterclass /> : <FlowsPlaceholder />}
    </div>
  );
}
