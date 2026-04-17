"use client";

import { BarChart3, BookOpen, Home, Layers, Timer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    label: "Drill",
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

export function BottomNav() {
  const pathname = usePathname() ?? "/";
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/70 backdrop-blur-2xl backdrop-saturate-150 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 max-w-lg mx-auto">
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => haptic("tap")}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground/70 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`size-5 transition-transform ${active ? "scale-110" : ""}`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span className="text-[10px] font-medium tracking-wide">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
