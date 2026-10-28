import { createFileRoute, Link } from "@tanstack/react-router";
import { Brand, MetaBadges } from "@/components/site-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A&W" },
      { name: "description", content: "TA-Seite von Junior Ngwa für Algorithmen & Wahrscheinlichkeiten: Kursmaterialien und interaktiver Algorithm Simulator." },
      { property: "og:title", content: "A&W" },
      { property: "og:description", content: "Kursmaterialien und interaktiver Algorithm Simulator für A&W." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

const ENTRIES = [
  { to: "/materials/" as const, n: "01", title: "Course Materials", desc: "Wochenübersicht aller Übungsstunden, Themen und Aufgaben." },
  { to: "/lab/" as const, n: "02", title: "Algorithm Simulator", desc: "Interaktive Visualisierungen — Schritt für Schritt." },
  { to: "/codeexpert/" as const, n: "03", title: "CodeExpert", desc: "How to master DP and reach Flow-State" },
  { to: "/lab/" as const, n: "04", title: "Extras", desc: "Contacts, wisdom, etc." },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Brand /><MetaBadges />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-normal text-muted-foreground">Algorithmen &amp; Wahrscheinlichkeiten · FS 2027</p>
        <h1 className="mt-6 text-4xl font-extrabold leading-[0.95] tracking-normal md:text-7xl">
          A&amp;W<span className="text-primary"> @ </span>ju<br />
        </h1>
        <div className="mt-12 grid border-t border-foreground md:grid-cols-2">
          {ENTRIES.map((e, i) => (
            <Link key={e.n} to={e.to}
              className={`group flex flex-col justify-between gap-8 border-b border-border p-8 transition-colors hover:bg-primary hover:text-primary-foreground md:min-h-[220px] ${i === 0 ? "md:border-r" : ""}`}>
              <span className="font-mono text-sm tracking-normal">[{e.n} // {e.title.toUpperCase()}]</span>
              <div>
                <h2 className="text-4xl font-bold tracking-normal md:text-4xl">{e.title} <span className="inline-block transition-transform group-hover:translate-x-2">→</span></h2>
                <p className="mt-3 max-w-sm text-muted-foreground group-hover:text-primary-foreground">{e.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
