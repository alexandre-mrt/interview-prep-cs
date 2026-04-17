"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { CardContent } from "@/components/card-content";
import { haptic } from "@/lib/haptics";
import type { Flashcard } from "@/lib/schema";
import { TopicMeta } from "@/lib/schema";
import {
  type CardState,
  defaultCardState,
  intervalLabel,
  type Rating,
} from "@/lib/srs";

type FlashcardProps = {
  card: Flashcard;
  cardState?: CardState;
  onRate: (rating: Rating) => void;
  index: number;
  total: number;
};

const THRESHOLDS = { left: -110, right: 110, up: -100, down: 100 } as const;

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    easy: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    hard: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  };
  return (
    <span
      className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border ${colors[difficulty] ?? "text-muted-foreground bg-muted"}`}
    >
      {difficulty}
    </span>
  );
}

export function FlashcardViewer({
  card,
  cardState,
  onRate,
  index,
  total,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const wasDragged = useRef(false);

  const state = cardState ?? defaultCardState();
  const meta = TopicMeta[card.topic];

  function snapBack() {
    animate(x, 0, { type: "spring", stiffness: 380, damping: 32 });
    animate(y, 0, { type: "spring", stiffness: 380, damping: 32 });
  }

  function exitCard(rating: Rating) {
    haptic(rating === 1 ? "error" : rating === 4 ? "success" : "medium");
    const dirX =
      rating === 1 ? -600 : rating === 4 ? 600 : rating === 3 ? 0 : 0;
    const dirY = rating === 2 ? -600 : rating === 3 ? 0 : 0;
    animate(x, dirX, { duration: 0.22, ease: [0.22, 1, 0.36, 1] });
    animate(y, dirY, { duration: 0.22, ease: [0.22, 1, 0.36, 1] });
    setTimeout(() => {
      onRate(rating);
      x.set(0);
      y.set(0);
      setFlipped(false);
    }, 230);
  }

  const leftOpacity = useTransform(x, [-140, -40], [1, 0]);
  const rightOpacity = useTransform(x, [40, 140], [0, 1]);
  const upOpacity = useTransform(y, [-120, -40], [1, 0]);
  const cardBgTint = useTransform([x, y] as const, ([xv, yv]: number[]) => {
    const tintX = xv / 200;
    const tintY = yv / 200;
    if (tintX < -0.2) return "rgba(244, 63, 94, 0.12)";
    if (tintX > 0.2) return "rgba(16, 185, 129, 0.12)";
    if (tintY < -0.2) return "rgba(245, 158, 11, 0.12)";
    return "transparent";
  });

  return (
    <div className="relative w-full flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full max-w-[480px] px-1">
        <span className="eyebrow text-muted-foreground">
          {meta.emoji} {card.subtopic}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div
        className="relative w-full"
        style={{ height: "68vh", maxWidth: 480 }}
      >
        <motion.div
          drag
          dragElastic={0.18}
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
              haptic("tap");
              setFlipped((f) => !f);
              return;
            }
            if (offset.x < THRESHOLDS.left) {
              exitCard(1);
            } else if (offset.x > THRESHOLDS.right) {
              exitCard(4);
            } else if (offset.y < THRESHOLDS.up) {
              exitCard(2);
            } else {
              snapBack();
            }
          }}
          onClick={() => {
            if (!wasDragged.current) {
              haptic("tap");
              setFlipped((f) => !f);
            }
          }}
          className="absolute inset-0 cursor-pointer select-none"
        >
          <motion.div
            className="relative w-full h-full rounded-3xl overflow-hidden glass-strong topic-glow"
            style={
              {
                backgroundColor: cardBgTint,
                "--accent": meta.accent,
              } as unknown as React.CSSProperties
            }
          >
            <div
              className="absolute top-0 left-6 right-6 h-px opacity-80"
              style={{
                background: `linear-gradient(to right, transparent, ${meta.accent}, transparent)`,
              }}
            />

            <div className="absolute top-3 right-3 z-10">
              <DifficultyBadge difficulty={card.difficulty} />
            </div>

            <div className="absolute inset-0 flex flex-col p-6 pt-10 overflow-hidden">
              {!flipped ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
                  <p className="font-serif text-[28px] leading-[1.15] tracking-[-0.01em] text-balance px-2">
                    {card.front}
                  </p>
                  <span className="eyebrow text-muted-foreground/70">
                    Tap to reveal
                  </span>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-y-auto text-[13.5px]">
                  <CardContent text={card.back} />
                  {card.senior_nuance && (
                    <div
                      className="mt-3 rounded-xl p-3 border"
                      style={{
                        borderColor: `${meta.accent} / 0.25`,
                        background: "var(--muted)",
                      }}
                    >
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                        style={{ color: meta.accent }}
                      >
                        Senior insight
                      </p>
                      <CardContent
                        className="text-[12.5px] text-foreground/85"
                        text={card.senior_nuance}
                      />
                    </div>
                  )}
                  {card.quote_to_say && (
                    <blockquote
                      className="mt-3 border-l-2 pl-3 text-[12.5px] italic text-foreground/80 leading-relaxed"
                      style={{ borderColor: meta.accent }}
                    >
                      “{card.quote_to_say}”
                    </blockquote>
                  )}
                </div>
              )}
            </div>

            <motion.div
              style={{ opacity: leftOpacity }}
              className="absolute top-3 left-3 rounded-full bg-rose-500 text-white px-3 py-1.5 text-xs font-bold tracking-wide pointer-events-none shadow-lg"
            >
              AGAIN
            </motion.div>
            <motion.div
              style={{ opacity: rightOpacity }}
              className="absolute top-3 right-3 rounded-full bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold tracking-wide pointer-events-none shadow-lg"
            >
              EASY
            </motion.div>
            <motion.div
              style={{ opacity: upOpacity }}
              className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 text-white px-3 py-1.5 text-xs font-bold tracking-wide pointer-events-none shadow-lg"
            >
              HARD
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {flipped && (
        <div className="grid grid-cols-4 gap-2 w-full max-w-[480px]">
          <GradeButton
            rating={1}
            color="rose"
            label="Again"
            interval={intervalLabel(1, state)}
            onClick={() => exitCard(1)}
          />
          <GradeButton
            rating={2}
            color="amber"
            label="Hard"
            interval={intervalLabel(2, state)}
            onClick={() => exitCard(2)}
          />
          <GradeButton
            rating={3}
            color="sky"
            label="Good"
            interval={intervalLabel(3, state)}
            onClick={() => exitCard(3)}
          />
          <GradeButton
            rating={4}
            color="emerald"
            label="Easy"
            interval={intervalLabel(4, state)}
            onClick={() => exitCard(4)}
          />
        </div>
      )}

      {!flipped && (
        <div className="flex items-center gap-5 eyebrow text-muted-foreground/60">
          <span>← Again</span>
          <span>↑ Hard</span>
          <span>Easy →</span>
        </div>
      )}
    </div>
  );
}

const BTN_COLORS = {
  rose: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/20",
  amber:
    "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20",
  sky: "bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 border-sky-500/20",
  emerald:
    "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20",
} as const;

function GradeButton({
  rating: _rating,
  color,
  label,
  interval,
  onClick,
}: {
  rating: Rating;
  color: keyof typeof BTN_COLORS;
  label: string;
  interval: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl border transition-all active:scale-95 ${BTN_COLORS[color]}`}
    >
      <span className="text-[12px] font-semibold">{label}</span>
      <span className="text-[10px] opacity-70 tabular-nums">{interval}</span>
    </button>
  );
}
