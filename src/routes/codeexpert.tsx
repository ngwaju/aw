import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-nav";
import { CodeExpert } from "@/components/codeexpert";

export const Route = createFileRoute("/codeexpert")({
  head: () => ({
    meta: [
      { title: "CodeExpert — A&W // ju ngwa" },
      { name: "description", content: "ETH-Prüfungsaufgaben verstehen: Probability DP (Frog Feeding) und Network Flows (The Great Harvest) mit Lösung, Java-Code und interaktivem Playground." },
      { property: "og:title", content: "CodeExpert — A&W" },
      { property: "og:description", content: "DP und Max-Flow-Reduktionen an echten Prüfungsaufgaben, interaktiv." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteShell>
      <section className="workspace-page">
        <div className="workspace-heading flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase text-primary">§ 03</p>
            <h1 className="mt-2 text-3xl font-bold">CodeExpert</h1>
          </div>
          <p className="hidden font-mono text-xs text-muted-foreground md:block">ETH-PRÜFUNGSAUFGABEN · 2 TASKS</p>
        </div>
        <CodeExpert />
      </section>
    </SiteShell>
  );
}
