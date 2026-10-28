// @ts-nocheck -- dense index math (same convention as course.tsx); behaviour covered by src/test/codeexpert.test.ts
import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { DpMasterclass } from "./dp-masterclass";

/* ---------- Pure logic (tested) ---------- */

/** E[pos][j]: expected flies eaten from pad `pos` after j jumps; frog eats f[pos] on each landing, jumping off the row ends the walk. */
export function frogExpected(n: number, k: number, m: number, f: number[], p: number[]) {
  const memo = new Map<string, number>();
  const go = (pos: number, j: number): number => {
    if (pos < 0 || pos >= n) return 0;
    if (j === m) return f[pos] ?? 0;
    const key = pos + "," + j;
    const hit = memo.get(key);
    if (hit !== undefined) return hit;
    const pi = p[pos] ?? 0;
    const v = (f[pos] ?? 0) + pi * go(pos - 1, j + 1) + (1 - pi) * go(pos + 1, j + 1);
    memo.set(key, v);
    return v;
  };
  return go(k, 0);
}

export type Harvest = { n: number; v: number[]; p: number[]; d: number[]; roads: [number, number][] };

export function parseHarvest(text: string): Harvest | null {
  const t = text.trim().split(/\s+/).map(Number);
  if (t.some(Number.isNaN)) return null;
  let i = 0;
  const n = t[i++], m = t[i++];
  if (!(n > 0) || m < 0 || n > 12) return null;
  const v: number[] = [], p: number[] = [], d: number[] = [];
  for (let c = 0; c < n; c++) { v.push(t[i++]); p.push(t[i++]); d.push(t[i++]); }
  const roads: [number, number][] = [];
  for (let c = 0; c < m; c++) {
    const a = t[i++], b = t[i++];
    if (a === undefined || b === undefined || a >= n || b >= n || a < 0 || b < 0) return null;
    roads.push([a, b]);
  }
  if ([...v, ...p, ...d].some((x) => x === undefined)) return null;
  return { n, v, p, d, roads };
}

/** Mirrors the Java solution exactly (including its reach loop over the first n nodes). */
export function solveHarvest(h: Harvest) {
  const { n, v, p, d } = h;
  const reach = Array.from({ length: n }, () => Array(n).fill(false) as boolean[]);
  for (const [a, b] of h.roads) reach[a][b] = true;
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
    if (i === j || (reach[i][k] && reach[k][j] && v[i] !== v[j])) reach[i][j] = true;
  const N = 2 * n + 2, S = 2 * n, T = 2 * n + 1;
  const cap = Array.from({ length: N }, () => Array(N).fill(0) as number[]);
  for (let i = 0; i < n; i++) { cap[S][i] += p[i]; cap[i + n][T] += d[i]; }
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) if (reach[a][b]) cap[a][b + n] += p[a];
  const orig = cap.map((r) => [...r]);
  let flow = 0;
  for (;;) {
    const prev = Array(N).fill(-1); prev[S] = S;
    const q = [S];
    while (q.length && prev[T] < 0) { const u = q.shift()!; for (let w = 0; w < N; w++) if (prev[w] < 0 && cap[u][w] > 0) { prev[w] = u; q.push(w); } }
    if (prev[T] < 0) break;
    let b = Infinity;
    for (let w = T; w !== S; w = prev[w]) b = Math.min(b, cap[prev[w]][w]);
    for (let w = T; w !== S; w = prev[w]) { cap[prev[w]][w] -= b; cap[w][prev[w]] += b; }
    flow += b;
  }
  const used = orig.map((r, a) => r.map((c, b) => (c > 0 ? Math.max(0, c - cap[a][b]) : 0)));
  const demand = d.reduce((s, x) => s + x, 0);
  return { reach, orig, used, flow, demand, ok: flow === demand };
}

/* ---------- Code + UI helpers ---------- */

const FROG_JAVA = `import java.util.*;

class Main {
    static int n, m;
    static int[] f;
    static double[] p;
    static double[][] memo;
    static boolean[][] seen;

    public static void main(String[] args) {
        int t = In.readInt();
        for (int i = 0; i < t; i++) testCase();
    }

    static void testCase() {
        n = In.readInt();
        int k = In.readInt();
        m = In.readInt();
        f = new int[n];
        p = new double[n];
        for (int i = 0; i < n; i++) f[i] = In.readInt();
        for (int i = 0; i < n; i++) p[i] = In.readDouble();
        memo = new double[n][m + 1];
        seen = new boolean[n][m + 1];
        Out.println(solve(k, 0));
    }

    // DP[pos][jump] = expected flies eaten from here on
    static double solve(int pos, int jump) {
        if (pos < 0 || pos >= n) return 0;
        if (jump == m) return f[pos];
        if (seen[pos][jump]) return memo[pos][jump];
        double res = f[pos]
            + p[pos] * solve(pos - 1, jump + 1)
            + (1 - p[pos]) * solve(pos + 1, jump + 1);
        seen[pos][jump] = true;
        return memo[pos][jump] = res;
    }
}`;

const HARVEST_JAVA = `import algorithms.*;

class Main {
    public static void main(String[] args) {
        int t = In.readInt();
        for (int i = 0; i < t; i++) {
            testCase();
        }
    }

    public static void testCase() {
        int n = In.readInt();
        int m = In.readInt();
        int [] v = new int [n];
        int [] p = new int [n];
        int [] d = new int [n];
        
        for (int i = 0; i < n; i++){
            v[i] = In.readInt();
            p[i] = In.readInt();
            d[i] = In.readInt();
        }
        
        boolean [][] reach = new boolean [n][n];
        for (int j = 0; j < m; j++){
            reach[In.readInt()][In.readInt()] = true;
        }
        
        reach(m, reach, v);
        
        if(harvey(n, v, p, d, reach)){
            Out.println('y');
        } else {
            Out.println('n');
        }
    }

    public static void reach(int n, boolean [][] reach, int [] v){
        for (int k = 0; k < n; k++){
            for (int i = 0; i < n; i++){
                for (int j = 0; j < n; j++){
                    if(i == j || (reach[i][k] && reach[k][j] && v[i] != v[j])){
                        reach[i][j] = true;
                    }
                }
            }
        }
    }
    
    public static boolean harvey(int n, int [] v, int [] p, int [] d, boolean [][] reach){
        Graph g = new Graph(2 + n * 2);
        int sum = 0;
        for (int i = 0; i < n; i++){
            g.addEdge(2 * n, i, p[i]); 
            g.addEdge(i + n, 2 * n + 1, d[i]);
            sum += d[i];
        }
        
        for (int k = 0; k < n; k++){
            for (int j = 0; j < n; j++){
                if(reach[k][j]){
                    g.addEdge(k, j + n, p[k]);
                }
            }
        }
        
        int maxFlow = g.computeMaximumFlow(2 * n, 2 * n + 1);
        return maxFlow == sum;
    }
}`;

const KW = new Set("import class public static void int double boolean new return if else for true false".split(" "));

function highlight(code: string) {
  return code.split("\n").map((line, li) => {
    const ci = line.indexOf("//");
    const body = ci >= 0 ? line.slice(0, ci) : line;
    const parts = body.split(/(\b[A-Za-z_]+\b|\b\d+\b|'[^']*')/g).map((tok, i) => {
      if (KW.has(tok)) return <span key={i} className="text-primary font-semibold">{tok}</span>;
      if (/^\d+$/.test(tok) || tok.startsWith("'")) return <span key={i} className="text-accent-foreground">{tok}</span>;
      return tok;
    });
    return (
      <div key={li}>
        {parts}
        {ci >= 0 && <span className="text-muted-foreground italic">{line.slice(ci)}</span>}
        {line === "" && " "}
      </div>
    );
  });
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative border border-border bg-card">
      <button type="button" aria-label="Code kopieren"
        onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="absolute right-2 top-2 flex items-center gap-1 border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase hover:border-primary hover:text-primary">
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{copied ? "Kopiert" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-[1.55]"><code>{highlight(code)}</code></pre>
    </div>
  );
}

function Col({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="ce-col">
      <p className="mb-3 font-mono text-[11px] uppercase text-primary">{label}</p>
      {children}
    </section>
  );
}

const inputCls = "w-full border border-border bg-card px-2 py-1.5 font-mono text-xs focus:border-primary focus:outline-none";
const M = ({ children }: { children: ReactNode }) => <span className="font-mono text-[0.92em]">{children}</span>;

/* ---------- Tab 1 ---------- */

function FrogTab() {
  const [n, setN] = useState("5"), [k, setK] = useState("2"), [m, setM] = useState("3");
  const [fs, setFs] = useState("1 4 2 0 3"), [ps, setPs] = useState("0.5 0.3 0.5 0.8 0.5");
  const res = useMemo(() => {
    const nn = +n, kk = +k, mm = +m;
    const f = fs.trim().split(/[\s,]+/).map(Number), p = ps.trim().split(/[\s,]+/).map(Number);
    if (!(nn >= 1 && nn <= 50) || !(kk >= 0 && kk < nn) || !(mm >= 0 && mm <= 200)) return { err: "Bedingung: 1 ≤ n ≤ 50, 0 ≤ k < n, 0 ≤ m ≤ 200." };
    if (f.length !== nn || p.length !== nn || f.some(isNaN) || p.some((x) => isNaN(x) || x < 0 || x > 1)) return { err: "Genau n Fliegen-Werte und n Wahrscheinlichkeiten in [0,1] angeben." };
    const rows = Array.from({ length: Math.min(mm, 6) + 1 }, (_, j) => f.map((_, pos) => {
      // expected value starting at pos with (m - j) jumps left
      return frogExpected(nn, pos, mm - j, f, p);
    }));
    return { value: frogExpected(nn, kk, mm, f, p), f, p, rows, nn, kk };
  }, [n, k, m, fs, ps]);

  return (
    <div className="ce-grid">
      <Col label="01 · Task Description">
        <div className="space-y-3 text-sm leading-relaxed">
          <p>Ein Frosch sitzt auf einer Reihe von <M>n</M> Lotusblättern, nummeriert <M>0 … n−1</M>, und startet auf Blatt <M>k</M>. Auf Blatt <M>i</M> sitzen <M>f_i</M> Fliegen.</p>
          <p>Bei jeder Landung frisst er die Fliegen des Blatts. Danach springt er mit Wahrscheinlichkeit <M>p_i</M> nach links und mit <M>1−p_i</M> nach rechts — insgesamt höchstens <M>m</M> Sprünge. Springt er über den Rand, fällt er ins Wasser und frisst nichts mehr.</p>
          <p className="border-l-2 border-primary pl-3">Gesucht: der <strong>Erwartungswert</strong> der insgesamt gefressenen Fliegen.</p>
          <p className="font-mono text-[11px] text-muted-foreground">INPUT: t · dann pro Test n k m, f_0…f_{"{n−1}"}, p_0…p_{"{n−1}"}</p>
        </div>
      </Col>
      <Col label="02 · Solution & Explanation">
        <div className="space-y-2 text-sm leading-relaxed">
          <p><strong>Zustand:</strong> <M>DP[pos][jump]</M> = erwartete Fliegen ab Blatt <M>pos</M>, nachdem bereits <M>jump</M> Sprünge gemacht wurden.</p>
          <p className="border border-border bg-card p-2 font-mono text-[11px]">DP[pos][j] = f[pos] + p[pos]·DP[pos−1][j+1] + (1−p[pos])·DP[pos+1][j+1]</p>
          <p><strong>Basis:</strong> <M>DP[pos][m] = f[pos]</M>; außerhalb der Reihe <M>0</M>. Linearität des Erwartungswerts erlaubt das Gewichten der beiden Folgezustände. Laufzeit <M>O(n·m)</M>.</p>
        </div>
        <div className="mt-3"><CodeBlock code={FROG_JAVA} /></div>
      </Col>
      <Col label="03 · Interactive Playground">
        <div className="grid grid-cols-3 gap-2">
          {[["n", n, setN], ["k (Start)", k, setK], ["m (Sprünge)", m, setM]].map(([l, val, set]) => (
            <label key={l as string} className="font-mono text-[10px] uppercase text-muted-foreground">{l as string}
              <input className={inputCls} value={val as string} onChange={(e) => (set as (s: string) => void)(e.target.value)} /></label>
          ))}
        </div>
        <label className="mt-2 block font-mono text-[10px] uppercase text-muted-foreground">Fliegen f_i
          <input className={inputCls} value={fs} onChange={(e) => setFs(e.target.value)} /></label>
        <label className="mt-2 block font-mono text-[10px] uppercase text-muted-foreground">Wahrscheinlichkeit links p_i
          <input className={inputCls} value={ps} onChange={(e) => setPs(e.target.value)} /></label>
        {"err" in res ? (
          <p className="mt-4 border border-destructive p-2 font-mono text-xs text-destructive">{res.err}</p>
        ) : (
          <>
            <div className="mt-4 border-y border-foreground py-3">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">E[Fliegen] ab Blatt {res.kk}</p>
              <p className="text-3xl font-bold tabular-nums" data-testid="frog-result">{res.value.toFixed(4)}</p>
            </div>
            <div className="mt-3 overflow-x-auto">
              <p className="mb-1 font-mono text-[10px] uppercase text-muted-foreground">DP-Tabelle (Zeile = jump, Spalte = pos)</p>
              <table className="w-full border-collapse font-mono text-[10px] tabular-nums">
                <thead><tr><th className="border border-border px-1">j</th>{res.f.map((_, i) => <th key={i} className={`border border-border px-1 ${i === res.kk ? "text-primary" : ""}`}>{i}</th>)}</tr></thead>
                <tbody>{res.rows.map((r, j) => (
                  <tr key={j}><td className="border border-border px-1 text-muted-foreground">{j}</td>
                    {r.map((x, i) => <td key={i} className={`border border-border px-1 text-right ${j === 0 && i === res.kk ? "bg-primary text-primary-foreground" : ""}`}>{x.toFixed(2)}</td>)}</tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}
      </Col>
    </div>
  );
}

/* ---------- Tab 2 ---------- */

const SAMPLE = `4 4
0 5 2
1 3 4
0 0 1
2 2 3
0 1
1 2
2 3
3 0`;

function FlowViz({ h }: { h: Harvest }) {
  const r = solveHarvest(h);
  const n = h.n, W = 420, H = Math.max(220, n * 46 + 40);
  const y = (i: number) => 30 + (i + 0.5) * ((H - 60) / n);
  const S = { x: 24, y: H / 2 }, T = { x: W - 24, y: H / 2 }, L = 140, R = W - 140;
  const edge = (x1: number, y1: number, x2: number, y2: number, c: number, u: number, key: string) => (
    <g key={key}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={u > 0 ? "var(--primary)" : "var(--viz-4)"} strokeWidth={u > 0 ? 1.8 : 1} />
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 3} fontSize="9" textAnchor="middle" fill="var(--muted-foreground)" fontFamily="JetBrains Mono">{u}/{c}</text>
    </g>
  );
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-border bg-canvas" role="img" aria-label="Flussnetzwerk">
        {h.v.map((_, i) => edge(S.x, S.y, L, y(i), r.orig[2 * n][i], r.used[2 * n][i], "s" + i))}
        {h.v.map((_, i) => edge(R, y(i), T.x, T.y, r.orig[i + n][2 * n + 1], r.used[i + n][2 * n + 1], "t" + i))}
        {h.v.flatMap((_, a) => h.v.map((_, b) => r.orig[a][b + n] > 0 ? (
          <line key={a + "-" + b} x1={L} y1={y(a)} x2={R} y2={y(b)} stroke={r.used[a][b + n] > 0 ? "var(--primary)" : "var(--viz-4)"} strokeWidth={r.used[a][b + n] > 0 ? 1.6 : 0.8} />
        ) : null))}
        {[[S, "s"], [T, "t"]].map(([pt, l]) => (
          <g key={l as string}><circle cx={(pt as typeof S).x} cy={(pt as typeof S).y} r={13} fill="var(--foreground)" />
            <text x={(pt as typeof S).x} y={(pt as typeof S).y + 4} fontSize="11" textAnchor="middle" fill="var(--background)" fontFamily="JetBrains Mono">{l as string}</text></g>
        ))}
        {h.v.map((v, i) => (
          <g key={"n" + i} fontFamily="JetBrains Mono" fontSize="10">
            <rect x={L - 15} y={y(i) - 11} width={30} height={22} fill="var(--card)" stroke="var(--foreground)" />
            <text x={L} y={y(i) + 4} textAnchor="middle" fill="var(--foreground)">P{i}</text>
            <text x={L - 20} y={y(i) + 14} textAnchor="end" fontSize="8" fill="var(--muted-foreground)">v{v}</text>
            <rect x={R - 15} y={y(i) - 11} width={30} height={22} fill="var(--card)" stroke="var(--foreground)" />
            <text x={R} y={y(i) + 4} textAnchor="middle" fill="var(--foreground)">D{i}</text>
          </g>
        ))}
      </svg>
      <div className="mt-3 flex items-center justify-between border-y border-foreground py-2 font-mono text-xs">
        <span>maxFlow = {r.flow} · Σd = {r.demand}</span>
        <span data-testid="harvest-result" className={`px-2 py-0.5 ${r.ok ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>OUTPUT: {r.ok ? "y" : "n"}</span>
      </div>
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">P = Produktion (Knoten i), D = Bedarf (Knoten i+n), blau = genutzter Fluss, Label = Fluss/Kapazität.</p>
    </div>
  );
}

function HarvestTab() {
  const [text, setText] = useState(SAMPLE);
  const h = useMemo(() => parseHarvest(text), [text]);
  return (
    <div className="ce-grid">
      <Col label="01 · Task Description">
        <div className="space-y-3 text-sm leading-relaxed">
          <p><strong>The Great Harvest.</strong> In AlgoLand gibt es <M>n</M> Städte. Stadt <M>i</M> produziert Obst der Sorte <M>v_i</M> in Menge <M>p_i</M> und hat einen Bedarf von <M>d_i</M> Einheiten.</p>
          <p>Obst wird über <M>m</M> gerichtete Strassen transportiert. Bürger essen ihr eigenes Obst; anderes Obst nur, wenn die Vorlieben entlang der Route passen (Zwischenstation mit anderer Sorte).</p>
          <p className="border-l-2 border-primary pl-3">Gesucht: Kann die Produktion den gesamten Bedarf aller Städte decken? Ausgabe <M>y</M> oder <M>n</M>.</p>
          <p className="font-mono text-[11px] text-muted-foreground">INPUT: n m · n Zeilen „v p d" · m Zeilen „a b"</p>
        </div>
      </Col>
      <Col label="02 · Solution & Explanation">
        <ol className="space-y-2 text-sm leading-relaxed">
          <li><strong>1. Reachability:</strong> transitive Hülle à la Floyd-Warshall in <M>reach</M> — <M>i→j</M> über <M>k</M> nur, wenn <M>v_i ≠ v_j</M>; jede Stadt erreicht sich selbst.</li>
          <li><strong>2. Graph Construction:</strong> Super-Source <M>2n</M> → Produktion <M>i</M> (Kap. <M>p_i</M>), Bedarf <M>i+n</M> → Super-Sink <M>2n+1</M> (Kap. <M>d_i</M>), sowie <M>k → j+n</M> für jedes erreichbare Paar.</li>
          <li><strong>3. Check:</strong> <M>maxFlow == Σ d_i</M> ⇔ jeder Bedarf ist gedeckt.</li>
        </ol>
        <div className="mt-3"><CodeBlock code={HARVEST_JAVA} /></div>
      </Col>
      <Col label="03 · Interactive Flow Visualizer">
        <label className="block font-mono text-[10px] uppercase text-muted-foreground">Testdaten (ein Testfall)
          <textarea rows={6} className={inputCls + " resize-none"} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} /></label>
        <div className="mt-3">
          {h ? <FlowViz h={h} /> : <p className="border border-destructive p-2 font-mono text-xs text-destructive">Ungültige Eingabe (1 ≤ n ≤ 12, Strassen-Indizes &lt; n).</p>}
        </div>
      </Col>
    </div>
  );
}

const TABS = [
  { id: "theory", n: "T0", label: "Probability DP", sub: "Masterclass" },
  { id: "frog", n: "T1", label: "Probability DP", sub: "Frog Feeding" },
  { id: "harvest", n: "T2", label: "Network Flows & Reductions", sub: "The Great Harvest" },
] as const;

export function CodeExpert() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("theory");
  return (
    <div className="ce-wrap">
      <div role="tablist" aria-label="Aufgaben" className="flex border-y border-foreground">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`flex-1 border-r border-border px-4 py-2.5 text-left last:border-r-0 transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "hover:text-primary"}`}>
            <span className="font-mono text-[11px] uppercase">[{t.n}] {t.label}</span>
            <span className="ml-2 text-sm font-semibold">„{t.sub}“</span>
          </button>
        ))}
      </div>
      {tab === "theory" ? <DpMasterclass /> : tab === "frog" ? <FrogTab /> : <HarvestTab />}
    </div>
  );
}
