// @ts-nocheck -- same convention as codeexpert.tsx; logic covered by src/test/dp-masterclass.test.ts
import { useMemo, useState, type ReactNode } from "react";

/* ---------- Pure logic (tested) ---------- */

/** Backward DP: P(exactly / at least K heads) from coins i..N-1. Returns full table dp[i][j]. */
export function coinTable(p: number[], K: number, atLeast = false) {
  const N = p.length;
  const dp = Array.from({ length: N + 1 }, () => Array(K + 1).fill(0));
  for (let j = 0; j <= K; j++) dp[N][j] = j === 0 ? 1 : 0;
  for (let i = N - 1; i >= 0; i--)
    for (let j = 0; j <= K; j++) {
      const heads = j === 0 ? (atLeast ? 1 : 0) : dp[i + 1][j - 1];
      dp[i][j] = j === 0 && atLeast ? 1 : p[i] * heads + (1 - p[i]) * dp[i + 1][j];
    }
  return dp;
}

/** DP[s] = expected extra rolls of a fair d-sided die until sum ≥ X. Returns DP[0..X-1]. */
export function diceExpected(X: number, sides = 6) {
  const dp = Array(X + sides).fill(0);
  for (let s = X - 1; s >= 0; s--) {
    let sum = 0;
    for (let i = 1; i <= sides; i++) sum += dp[s + i];
    dp[s] = 1 + sum / sides;
  }
  return dp.slice(0, Math.max(X, 0));
}

/** Self-loop chain: DP[i] = 1 + p·DP[i] + (1−p)·DP[i+1]  ⇒  DP[i] = 1/(1−p) + DP[i+1]. */
export function selfLoopSteps(n: number, p: number) {
  return n / (1 - p);
}

/** Solves A·x = b by Gaussian elimination with partial pivoting. */
export function gauss(A: number[][], b: number[]) {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    if (Math.abs(M[c][c]) < 1e-12) return null;
    for (let r = 0; r < n; r++) if (r !== c) {
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r, i) => r[n] / r[i]);
}

/* ---------- UI ---------- */

const M = ({ children }: { children: ReactNode }) => <span className="font-mono text-[0.92em]">{children}</span>;
const Eq = ({ children }: { children: ReactNode }) => (
  <p className="border border-border bg-card px-3 py-2 font-mono text-[11px] leading-relaxed">{children}</p>
);
const inputCls = "w-full border border-border bg-card px-2 py-1.5 font-mono text-xs focus:border-primary focus:outline-none";

function Col({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="ce-col">
      <p className="mb-3 font-mono text-[11px] uppercase text-primary">{label}</p>
      <div className="space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function TypesModule() {
  return (
    <div className="ce-grid">
      <Col label="A · Wahrscheinlichkeiten">
        <p><M>DP[state]</M> = Wahrscheinlichkeit, <strong>von hier aus</strong> zu gewinnen. Grundlage: Satz der totalen Wahrscheinlichkeit.</p>
        <Eq>DP[s] = Σ P(s → s') · DP[s']</Eq>
        <p>Basis: Gewinn-Zustand <M>1.0</M>, Verlust-Zustand <M>0.0</M>. Antwort: <M>DP[start]</M>.</p>
        <p className="font-mono text-[10px] uppercase text-muted-foreground">Typ B · Erwartungswerte</p>
        <p><M>DP[state]</M> = erwartete <strong>verbleibende</strong> Kosten. Linearität des Erwartungswerts:</p>
        <Eq>DP[s] = Σ p · (cost + DP[s'])  =  1 + Σ p · DP[s']</Eq>
        <p>Basis: Zielzustand <M>0</M> — man ist schon da.</p>
      </Col>
      <Col label="Perspective 1 vs. Perspective 2">
        <table className="w-full border-collapse text-xs">
          <thead><tr className="border-b border-foreground text-left font-mono text-[10px] uppercase">
            <th className="py-1 pr-2"> </th><th className="py-1 pr-2">P1 · Arriving / Forward</th><th className="py-1">P2 · Future / Backward</th></tr></thead>
          <tbody>
            {[
              ["Frage", "Wie komme ich hierher?", "Was passiert ab hier?"],
              ["Basis", "DP[start] = 1", "DP[ziel] = 1 bzw. 0"],
              ["Antwort", "Σ über Endzustände", "DP[start]"],
              ["Erwartung", "Pfadlängen mitführen — mühsam", "1 + Σ p·DP[next] — trivial"],
              ["Rekursion", "unnatürlich", "Top-Down + Memo"],
            ].map(([a, b, c]) => (
              <tr key={a} className="border-b border-border align-top">
                <td className="py-1.5 pr-2 font-mono text-[10px] uppercase text-muted-foreground">{a}</td>
                <td className="py-1.5 pr-2">{b}</td><td className="py-1.5 font-medium">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-mono text-[10px] uppercase text-muted-foreground">Beispiel A → B|C → T (Münze 0.5)</p>
        <p>P1: <M>DP[A]=1</M>, <M>DP[B]=DP[C]=0.5</M>, <M>DP[T]=0.5+0.5=1</M>.<br />P2: <M>DP[T]=1</M>, <M>DP[B]=DP[C]=1</M>, <M>DP[A]=0.5·1+0.5·1=1</M>. Gleiches Ergebnis.</p>
      </Col>
      <Col label="Warum P2 für die Prüfung">
        <ol className="space-y-2">
          <li><strong>1.</strong> Einzige saubere Methode für Erwartungswerte (Züge, Kosten, Schritte).</li>
          <li><strong>2.</strong> Passt perfekt zu Top-Down-Rekursion mit Memoization — schneller zu schreiben, weniger Fehler.</li>
          <li><strong>3.</strong> Kein Index-Shifting nach links: <M>dp(0, K)</M> ist genau die Frage.</li>
          <li><strong>4.</strong> Anpassbar: „mindestens K" ⇒ nur der Basisfall ändert sich.</li>
        </ol>
        <p className="border-l-2 border-primary pl-3">„Um das Problem in meinem Zustand zu lösen, löse ich es rekursiv für alle nächsten Zustände und kombiniere die Ergebnisse."</p>
      </Col>
    </div>
  );
}

function BlueprintModule() {
  const steps = [
    ["01", "Zustand definieren", "Was identifiziert die Konfiguration eindeutig? Minimal halten: (turn, sum), Bitmaske, HP. Vergangenes nur, wenn es die Zukunft beeinflusst.", "dp(i, j) = Wert von hier bis zum Ziel"],
    ["02", "Top-Down vs. Bottom-Up", "Memoization spiegelt den Zufallsprozess und besucht nur erreichbare Zustände. Tabulation braucht eine strikte topologische Ordnung (meist rückwärts).", "if (seen[i][j]) return memo[i][j];"],
    ["03", "Basis-Fälle", "Wahrscheinlichkeit: Gewinn = 1.0, Verlust = 0.0. Erwartung: Ziel = 0. Ausserhalb des Feldes abfangen.", "if (i == N) return j == 0 ? 1.0 : 0.0;"],
    ["04", "Transitionen — Lazy Boss / GPS", "Nur einen Schritt vorausschauen. Jede unmittelbare Zukunft × ihre Wahrscheinlichkeit × dp(next). Der Rekursion vertrauen. Check: Σ p = 1.", "cost + pA·dp(A) + pB·dp(B)"],
  ];
  return (
    <div className="ce-grid ce-grid-4">
      {steps.map(([n, t, d, c]) => (
        <Col key={n} label={`Schritt ${n}`}>
          <p className="text-lg font-bold leading-tight">{t}</p>
          <p>{d}</p>
          <Eq>{c}</Eq>
          {n === "04" && <p className="text-xs text-muted-foreground">Checkliste: Wo stehe ich? · Was passiert als Nächstes? · Wie sieht die Zukunft danach aus?</p>}
        </Col>
      ))}
    </div>
  );
}

function ExamplesModule() {
  const [ps, setPs] = useState("0.5 0.3 0.8 0.6");
  const [K, setK] = useState("2");
  const [atLeast, setAtLeast] = useState(false);
  const [X, setX] = useState("10");
  const coin = useMemo(() => {
    const p = ps.trim().split(/[\s,]+/).map(Number);
    const k = +K;
    if (p.some((x) => isNaN(x) || x < 0 || x > 1) || p.length > 10 || !(k >= 0 && k <= p.length)) return null;
    return { p, k, dp: coinTable(p, k, atLeast) };
  }, [ps, K, atLeast]);
  const dice = useMemo(() => (+X >= 1 && +X <= 40 ? diceExpected(+X) : null), [X]);

  return (
    <div className="ce-grid">
      <Col label="Bsp. 1 · Coin Tossing (Typ A)">
        <p><M>N</M> Münzen, Münze <M>i</M> zeigt Kopf mit <M>p_i</M>. P(genau <M>K</M> Köpfe)?</p>
        <Eq>dp(i,j) = p_i·dp(i+1,j−1) + (1−p_i)·dp(i+1,j)<br />dp(N,j) = [j == 0]   ·   Antwort dp(0,K)</Eq>
        <div className="grid grid-cols-[1fr_4rem] gap-2">
          <label className="font-mono text-[10px] uppercase text-muted-foreground">p_i<input className={inputCls} value={ps} onChange={(e) => setPs(e.target.value)} /></label>
          <label className="font-mono text-[10px] uppercase text-muted-foreground">K<input className={inputCls} value={K} onChange={(e) => setK(e.target.value)} /></label>
        </div>
        <label className="flex items-center gap-2 font-mono text-[10px] uppercase"><input type="checkbox" checked={atLeast} onChange={(e) => setAtLeast(e.target.checked)} /> mindestens K (nur Basisfall ändert sich)</label>
        {coin ? (
          <>
            <div className="border-y border-foreground py-2">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">dp(0, {coin.k})</p>
              <p className="text-3xl font-bold tabular-nums" data-testid="coin-result">{coin.dp[0][coin.k].toFixed(4)}</p>
            </div>
            <table className="w-full border-collapse font-mono text-[10px] tabular-nums">
              <thead><tr><th className="border border-border px-1">i \ j</th>{coin.dp[0].map((_, j) => <th key={j} className="border border-border px-1">{j}</th>)}</tr></thead>
              <tbody>{coin.dp.map((r, i) => (
                <tr key={i}><td className="border border-border px-1 text-muted-foreground">{i}</td>
                  {r.map((x, j) => <td key={j} className={`border border-border px-1 text-right ${i === 0 && j === coin.k ? "bg-primary text-primary-foreground" : i === coin.p.length ? "text-muted-foreground" : ""}`}>{x.toFixed(3)}</td>)}</tr>
              ))}</tbody>
            </table>
          </>
        ) : <p className="border border-destructive p-2 font-mono text-xs text-destructive">p_i ∈ [0,1], max. 10 Münzen, 0 ≤ K ≤ N.</p>}
      </Col>
      <Col label="Bsp. 2 · Dice Roll (Typ B)">
        <p>Fairer Würfel. Erwartete Würfe, bis die Summe ≥ <M>X</M>?</p>
        <Eq>DP[s] = 1 + Σ_(i=1..6) ⅙ · DP[s+i]<br />DP[s] = 0 für s ≥ X   ·   rückwärts von X−1 bis 0</Eq>
        <label className="block font-mono text-[10px] uppercase text-muted-foreground">X (1–40)<input className={inputCls} value={X} onChange={(e) => setX(e.target.value)} /></label>
        {dice ? (
          <>
            <div className="border-y border-foreground py-2">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">E[Würfe] = DP[0]</p>
              <p className="text-3xl font-bold tabular-nums" data-testid="dice-result">{dice[0].toFixed(4)}</p>
            </div>
            <div className="flex h-28 items-end gap-px border-b border-foreground" aria-label="DP-Werte pro Summe s">
              {dice.map((v, s) => (
                <div key={s} className="flex flex-1 flex-col items-center justify-end" title={`DP[${s}] = ${v.toFixed(3)}`}>
                  <div className={s === 0 ? "w-full bg-primary" : "w-full bg-foreground/70"} style={{ height: `${(v / dice[0]) * 100}%` }} />
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">Balken = DP[s] für s = 0 … {+X - 1}; blau = Antwort.</p>
          </>
        ) : <p className="border border-destructive p-2 font-mono text-xs text-destructive">X zwischen 1 und 40.</p>}
      </Col>
      <Col label="Lazy Boss · Würfel bis zur 6">
        <p>Jeder Fehlwurf (1–5) kostet <M>$1</M>, eine 6 beendet das Spiel. Erwartete Kosten <M>E</M>?</p>
        <Eq>E = ⅙·0 + ⅚·(1 + E)<br />E − ⅚E = ⅚  ⇒  ⅙E = ⅚  ⇒  E = 5</Eq>
        <p>Ein unendlicher Zyklus — gelöst mit drei Zeilen, weil wir nur einen Schritt vorausschauen.</p>
        <p className="font-mono text-[10px] uppercase text-muted-foreground">Denkwechsel</p>
        <ul className="space-y-1 text-xs">
          <li><s className="text-muted-foreground">Wie bin ich hierher gekommen?</s> → Was ist der Weg von hier zum Ende?</li>
          <li><s className="text-muted-foreground">Wie wahrscheinlich ist dieser Pfad?</s> → Wie wahrscheinlich gewinne ich von hier?</li>
        </ul>
      </Col>
    </div>
  );
}

function CyclesModule() {
  const [p, setP] = useState("0.4");
  const [n, setN] = useState("5");
  const pv = +p, nv = +n;
  const ok = pv >= 0 && pv < 1 && nv >= 1 && nv <= 50;
  // 3-state cycle example: A→B (1), B→C 0.5 / B→A 0.5, C→T 0.5 / C→A 0.5; expected steps
  const cyc = gauss([[1, -1, 0], [-0.5, 1, -0.5], [-0.5, 0, 1]], [1, 1, 1]);
  return (
    <div className="ce-grid">
      <Col label="Szenario 1 · Simple Self-Loop">
        <p>Bei Misserfolg (Wahrscheinlichkeit <M>p</M>) bleibt man im Zustand:</p>
        <Eq>DP[i] = 1 + p·DP[i] + (1−p)·DP[i+1]</Eq>
        <p><M>DP[i]</M> steht beidseitig — isolieren:</p>
        <Eq>DP[i]·(1−p) = 1 + (1−p)·DP[i+1]<br />DP[i] = 1/(1−p) + DP[i+1]</Eq>
        <p>Zyklus eliminiert, normal berechenbar.</p>
      </Col>
      <Col label="Playground · Kette mit Self-Loops">
        <div className="grid grid-cols-2 gap-2">
          <label className="font-mono text-[10px] uppercase text-muted-foreground">p (bleiben)<input className={inputCls} value={p} onChange={(e) => setP(e.target.value)} /></label>
          <label className="font-mono text-[10px] uppercase text-muted-foreground">Stufen n<input className={inputCls} value={n} onChange={(e) => setN(e.target.value)} /></label>
        </div>
        {ok ? (
          <>
            <div className="border-y border-foreground py-2">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">DP[0] = n / (1−p)</p>
              <p className="text-3xl font-bold tabular-nums" data-testid="loop-result">{selfLoopSteps(nv, pv).toFixed(4)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
              {Array.from({ length: Math.min(nv, 10) }, (_, i) => (
                <span key={i} className="border border-border px-1.5 py-1">{i}<sup className="text-primary">↺{pv}</sup></span>
              ))}{nv > 10 && <span>…</span>}<span className="bg-foreground px-1.5 py-1 text-background">Ziel</span>
            </div>
            <p className="text-xs text-muted-foreground">Jede Stufe kostet im Schnitt <M>1/(1−p) = {(1 / (1 - pv)).toFixed(3)}</M> Versuche (geometrische Verteilung).</p>
          </>
        ) : <p className="border border-destructive p-2 font-mono text-xs text-destructive">0 ≤ p &lt; 1 und 1 ≤ n ≤ 50.</p>}
      </Col>
      <Col label="Szenario 2 · Complex Cycles">
        <p>Bilden Zustände einen Zyklus (<M>A → B → C → A</M>), hilft Algebra pro Zeile nicht. Stattdessen: <strong>N Gleichungen für N Zustände</strong>, lösen mit Gauss-Elimination in <M>O(N³)</M>.</p>
        <p className="font-mono text-[10px] uppercase text-muted-foreground">Beispiel: A→B · B→C|A (½) · C→T|A (½)</p>
        <Eq>E_A − E_B = 1<br />−½E_A + E_B − ½E_C = 1<br />−½E_A + E_C = 1</Eq>
        {cyc && <p className="font-mono text-xs">E_A = {cyc[0].toFixed(2)} · E_B = {cyc[1].toFixed(2)} · E_C = {cyc[2].toFixed(2)}</p>}
      </Col>
    </div>
  );
}

const MODULES = [
  { id: "types", n: "M1", label: "Kern-Typen", C: TypesModule },
  { id: "blueprint", n: "M2", label: "4-Schritte-Blueprint", C: BlueprintModule },
  { id: "examples", n: "M3", label: "Beispiele & Playground", C: ExamplesModule },
  { id: "cycles", n: "M4", label: "Zyklen & Self-Loops", C: CyclesModule },
] as const;

export function DpMasterclass() {
  const [m, setM] = useState<(typeof MODULES)[number]["id"]>("types");
  const Active = MODULES.find((x) => x.id === m)!.C;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div role="tablist" aria-label="Module" className="flex flex-wrap gap-x-5 border-b border-border py-2">
        {MODULES.map((x) => (
          <button key={x.id} role="tab" aria-selected={m === x.id} onClick={() => setM(x.id)}
            className={`font-mono text-[11px] uppercase ${m === x.id ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}>
            {x.n} · {x.label}
          </button>
        ))}
      </div>
      <Active />
    </div>
  );
}
