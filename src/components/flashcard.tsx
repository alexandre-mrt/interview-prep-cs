"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { Flashcard } from "@/lib/schema";

type RatingQuality = 1 | 2 | 3;

type FlashcardProps = {
  card: Flashcard;
  onRate: (quality: RatingQuality) => void;
  index: number;
  total: number;
};

const DRAG_THRESHOLDS = { left: -100, right: 100, up: -80 } as const;

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    easy: "text-emerald-400 bg-emerald-400/10",
    medium: "text-amber-400 bg-amber-400/10",
    hard: "text-rose-400 bg-rose-400/10",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[difficulty] ?? "text-muted-foreground bg-muted"}`}
    >
      {difficulty}
    </span>
  );
}

export function FlashcardViewer({
  card,
  onRate,
  index,
  total,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const wasDragged = useRef(false);

  function snapBack() {
    animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    animate(y, 0, { type: "spring", stiffness: 400, damping: 30 });
  }

  function exitCard(quality: RatingQuality) {
    const targetX = quality === 1 ? -600 : quality === 3 ? 600 : 0;
    const targetY = quality === 2 ? -600 : 0;
    animate(x, targetX, { duration: 0.25 });
    animate(y, targetY, { duration: 0.25 });
    setTimeout(() => {
      onRate(quality);
      x.set(0);
      y.set(0);
      setFlipped(false);
    }, 280);
  }

  const leftOpacity = useTransform(x, [-120, -40], [1, 0]);
  const rightOpacity = useTransform(x, [40, 120], [0, 1]);
  const upOpacity = useTransform(y, [-100, -40], [1, 0]);

  return (
    <div className="relative w-full flex flex-col items-center gap-4">
      <div className="text-xs text-muted-foreground self-end">
        {index + 1} / {total}
      </div>

      <div
        className="relative w-full"
        style={{ height: "72vh", maxWidth: 480 }}
      >
        <motion.div
          drag
          dragElastic={0.15}
          dragMomentum={false}
          style={{ x, y, rotate, touchAction: "none" }}
          onDragStart={(_, info) => {
            dragStartX.current = info.point.x;
            dragStartY.current = info.point.y;
            wasDragged.current = false;
          }}
          onDrag={(_, info) => {
            const dx = Math.abs(info.point.x - dragStartX.current);
            const dy = Math.abs(info.point.y - dragStartY.current);
            if (dx > 8 || dy > 8) wasDragged.current = true;
          }}
          onDragEnd={(_, info) => {
            const { offset } = info;
            if (!wasDragged.current) {
              setFlipped((f) => !f);
              return;
            }
            if (offset.x < DRAG_THRESHOLDS.left) {
              exitCard(1);
            } else if (offset.x > DRAG_THRESHOLDS.right) {
              exitCard(3);
            } else if (offset.y < DRAG_THRESHOLDS.up) {
              exitCard(2);
            } else {
              snapBack();
            }
          }}
          onClick={() => {
            if (!wasDragged.current) {
              setFlipped((f) => !f);
            }
          }}
          className="absolute inset-0 cursor-pointer select-none"
        >
          <div
            className="relative w-full h-full rounded-2xl ring-1 ring-foreground/10 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.205 0 0) 0%, oklch(0.17 0 0) 100%)",
            }}
          >
            <motion.div className="absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {card.subtopic}
            </motion.div>
            <div className="absolute top-2 right-2">
              <DifficultyBadge difficulty={card.difficulty} />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pt-12">
              {!flipped ? (
                <div className="flex flex-col items-center gap-6 text-center">
                  <p className="text-lg font-medium leading-relaxed">
                    {card.front}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap to reveal answer
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-full w-full text-sm">
                  <p className="leading-relaxed">{card.back}</p>
                  {card.senior_nuance && (
                    <div className="rounded-lg bg-muted/50 p-3 border border-foreground/5">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Senior insight
                      </p>
                      <p className="text-xs leading-relaxed text-foreground/80">
                        {card.senior_nuance}
                      </p>
                    </div>
                  )}
                  {card.quote_to_say && (
                    <blockquote className="border-l-2 border-primary pl-3 text-xs italic text-muted-foreground">
                      {card.quote_to_say}
                    </blockquote>
                  )}
                </div>
              )}
            </div>

            <motion.div
              style={{ opacity: leftOpacity }}
              className="absolute inset-y-0 left-0 w-16 flex items-center justify-center bg-rose-500/10 pointer-events-none"
            >
              <span className="text-rose-400 font-bold text-sm">Hard</span>
            </motion.div>
            <motion.div
              style={{ opacity: rightOpacity }}
              className="absolute inset-y-0 right-0 w-16 flex items-center justify-center bg-emerald-500/10 pointer-events-none"
            >
              <span className="text-emerald-400 font-bold text-sm">Easy</span>
            </motion.div>
            <motion.div
              style={{ opacity: upOpacity }}
              className="absolute inset-x-0 top-0 h-16 flex items-center justify-center bg-amber-500/10 pointer-events-none"
            >
              <span className="text-amber-400 font-bold text-sm">Medium</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {flipped && (
        <div className="flex gap-3 w-full max-w-[480px]">
          <button
            type="button"
            onClick={() => exitCard(1)}
            className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 text-sm font-medium hover:bg-rose-500/20 transition-colors"
          >
            Hard ←
          </button>
          <button
            type="button"
            onClick={() => exitCard(2)}
            className="flex-1 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors"
          >
            Medium ↑
          </button>
          <button
            type="button"
            onClick={() => exitCard(3)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
          >
            Easy →
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>← Hard</span>
        <span className="opacity-40">|</span>
        <span>↑ Medium</span>
        <span className="opacity-40">|</span>
        <span>Easy →</span>
        <span className="opacity-40">|</span>
        <span>Tap to flip</span>
      </div>
    </div>
  );
}
