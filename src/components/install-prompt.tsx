"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const KEY_VISIT = "ipc-visit-count";
const KEY_DISMISSED = "ipc-install-dismissed";

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const visits = Number(localStorage.getItem(KEY_VISIT) ?? "0") + 1;
    localStorage.setItem(KEY_VISIT, String(visits));
    const dismissed = localStorage.getItem(KEY_DISMISSED) === "1";

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      if (visits >= 2 && !dismissed) setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!visible || !prompt) return null;

  return (
    <div
      className="fixed left-3 right-3 z-50 rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-2xl p-4 flex items-center gap-3"
      style={{
        bottom: "calc(env(safe-area-inset-bottom) + 64px)",
      }}
    >
      <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
        <Download className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">Install Interview Prep</p>
        <p className="text-xs text-muted-foreground">
          Add to home screen for offline flashcards
        </p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await prompt.prompt();
          await prompt.userChoice;
          setVisible(false);
          setPrompt(null);
        }}
        className="rounded-lg bg-foreground text-background text-xs font-semibold px-3 py-1.5"
      >
        Install
      </button>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(KEY_DISMISSED, "1");
          setVisible(false);
        }}
        aria-label="Dismiss"
        className="size-8 rounded-lg hover:bg-muted flex items-center justify-center"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
