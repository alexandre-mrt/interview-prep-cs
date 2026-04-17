"use client";

import { CommandPalette } from "@/components/command-palette";
import type { Flashcard } from "@/lib/schema";

type CommandPaletteProviderProps = {
  cards: Flashcard[];
};

export function CommandPaletteProvider({ cards }: CommandPaletteProviderProps) {
  return <CommandPalette cards={cards} />;
}
