"use client";

import {
  BarChart3,
  BookOpen,
  Command,
  Home,
  Layers,
  Sparkles,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { haptic } from "@/lib/haptics";

const items = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/learn",
    label: "Learn",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/learn"),
  },
  {
    href: "/review",
    label: "Review",
    icon: Layers,
    match: (p: string) => p.startsWith("/review") || p.startsWith("/topic"),
  },
  {
    href: "/mock",
    label: "Mock",
    icon: Timer,
    match: (p: string) => p.startsWith("/mock"),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: BarChart3,
    match: (p: string) => p.startsWith("/stats"),
  },
];

export function SideNav() {
  const pathname = usePathname() ?? "/";

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[236px] z-30 flex-col">
      <div className="flex flex-col h-full m-3 rounded-3xl glass-strong p-5 gap-8">
        <Link href="/" className="flex items-center gap-2.5 px-1.5 group">
          <span
            className="size-9 rounded-2xl flex items-center justify-center text-background"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 280), oklch(0.72 0.2 330))",
              boxShadow: "0 6px 20px -6px oklch(0.72 0.18 280 / 0.6)",
            }}
          >
            <Sparkles className="size-4" strokeWidth={2.4} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[18px] italic tracking-tight">
              Interview
            </span>
            <span className="eyebrow text-muted-foreground text-[9.5px] mt-0.5">
              CS · Senior track
            </span>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          <span className="eyebrow text-muted-foreground/70 px-3 mb-1">
            Navigate
          </span>
          {items.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => haptic("tap")}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <span
                  className={`size-7 rounded-lg flex items-center justify-center transition-all ${
                    active
                      ? "bg-foreground text-background"
                      : "bg-transparent group-hover:bg-foreground/10"
                  }`}
                >
                  <Icon className="size-3.5" strokeWidth={2.2} />
                </span>
                <span className="text-[13.5px] font-medium tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="glass rounded-2xl p-3 flex items-center gap-2.5">
            <kbd className="font-mono text-[10px] text-muted-foreground bg-foreground/5 border border-foreground/10 rounded-md px-1.5 py-0.5 flex items-center gap-1">
              <Command className="size-2.5" />K
            </kbd>
            <span className="text-[11px] text-muted-foreground">
              Command palette
            </span>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="eyebrow text-muted-foreground/70">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}
