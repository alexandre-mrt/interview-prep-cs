"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { dueCount } from "@/lib/storage";

type DailyReviewCtaProps = {
  allCardIds: string[];
};

export function DailyReviewCta({ allCardIds }: DailyReviewCtaProps) {
  const [due, setDue] = useState<number | null>(null);

  useEffect(() => {
    setDue(dueCount(allCardIds));
  }, [allCardIds]);

  const label =
    due === null
      ? "Start today's review"
      : due === 0
        ? "All caught up — review all cards"
        : `Start today's review (${due} due)`;

  const href = due === 0 ? "/review?mode=all" : "/review?mode=due";

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        Interview Prep — CS
      </h1>
      <p className="text-muted-foreground text-sm max-w-xs">
        Senior engineering flashcards with spaced repetition
      </p>
      <Link href={href}>
        <Button size="lg" className="h-12 px-8 text-base mt-2">
          {label}
        </Button>
      </Link>
    </div>
  );
}
