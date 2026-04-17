"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { haptic } from "@/lib/haptics";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="size-9 rounded-lg bg-muted/50" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        haptic("light");
        setTheme(isDark ? "light" : "dark");
      }}
      aria-label="Toggle theme"
      className="size-9 rounded-lg border border-border bg-background/50 hover:bg-muted transition-colors flex items-center justify-center"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
