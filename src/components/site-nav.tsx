import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const META = ["THU 16:15", "HG", "SPRACHE: GERMAN"];

export function Brand() {
  return (
    <span className="font-mono text-sm font-bold tracking-normal">
      A&amp;W<span className="text-primary">//</span> Junior Ngwa
    </span>
  );
}

export function MetaBadges() {
  return (
    <div className="flex divide-x divide-border border border-border font-mono text-[11px] uppercase tracking-normal">
      {META.map((b) => <span key={b} className="px-3 py-1.5">{b}</span>)}
    </div>
  );
}

const navCls = "px-3 py-1.5 font-mono text-xs uppercase tracking-normal transition-colors hover:text-primary";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-foreground bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link to="/"><Brand /></Link>
          <nav aria-label="Hauptnavigation" className="flex items-center gap-1">
            <Link to="/" className={navCls} activeOptions={{ exact: true }}>Home</Link>
            <Link to="/materials/" className={navCls} activeProps={{ className: "text-primary underline underline-offset-8" }}>Materials</Link>
            <Link to="/lab/" className={navCls} activeProps={{ className: "text-primary underline underline-offset-8" }}>Lab</Link>
            <Link to="/codeexpert/" className={navCls} activeProps={{ className: "text-primary underline underline-offset-8" }}>CodeExpert</Link>
          </nav>
        </div>
      </header>
      <main className="workspace-main mx-auto w-full max-w-6xl px-4 md:px-6">{children}</main>
      <footer className="border-t border-foreground">
        <div className="mx-auto flex max-w-6xl justify-between px-4 py-3 md:px-6 font-mono text-[11px] uppercase tracking-normal text-muted-foreground">
          <span>A&amp;W · Übungsstunde</span><span>ETH Zürich · D-INFK</span>
        </div>
      </footer>
    </div>
  );
}
