"use client";

import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Flashcard } from "@/lib/schema";
import { type TopicId, TopicMeta } from "@/lib/schema";

type CommandPaletteProps = {
  cards: Flashcard[];
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};

export function CommandPalette({ cards }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(cards, {
        keys: ["front", "back", "tags", "subtopic"],
        threshold: 0.4,
        includeScore: true,
      }),
    [cards],
  );

  const results = useMemo(() => {
    if (!query.trim()) return cards.slice(0, 20);
    return fuse
      .search(query)
      .slice(0, 20)
      .map((r) => r.item);
  }, [query, cards, fuse]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSelect(card: Flashcard) {
    setSelectedCard(card);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search flashcards"
        description="Search across all flashcards by topic, question, or tags"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search cards..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading={query ? "Results" : "Recent cards"}>
              {results.map((card) => {
                const topicMeta = TopicMeta[card.topic as TopicId];
                return (
                  <CommandItem
                    key={card.id}
                    value={card.id}
                    onSelect={() => handleSelect(card)}
                    className="flex items-start gap-2"
                  >
                    <span className="flex-1 truncate text-xs">
                      {card.front}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {topicMeta?.emoji}
                      </span>
                      <span
                        className={`text-xs font-medium ${DIFFICULTY_COLORS[card.difficulty] ?? ""}`}
                      >
                        •
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      {selectedCard && (
        <Dialog
          open={!!selectedCard}
          onOpenChange={(o) => {
            if (!o) setSelectedCard(null);
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-medium leading-snug pr-6">
                {selectedCard.front}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 text-sm">
              <p className="leading-relaxed">{selectedCard.back}</p>
              {selectedCard.senior_nuance && (
                <div className="rounded-lg bg-muted/50 p-3 border border-foreground/5">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Senior insight
                  </p>
                  <p className="text-xs leading-relaxed text-foreground/80">
                    {selectedCard.senior_nuance}
                  </p>
                </div>
              )}
              {selectedCard.quote_to_say && (
                <blockquote className="border-l-2 border-primary pl-3 text-xs italic text-muted-foreground">
                  {selectedCard.quote_to_say}
                </blockquote>
              )}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">
                  {TopicMeta[selectedCard.topic as TopicId]?.emoji}{" "}
                  {TopicMeta[selectedCard.topic as TopicId]?.label}
                </span>
                <span
                  className={`text-xs font-medium ${DIFFICULTY_COLORS[selectedCard.difficulty] ?? ""}`}
                >
                  {selectedCard.difficulty}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
