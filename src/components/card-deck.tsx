"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check, ChevronDown, ShuffleIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { FlashcardViewer } from "@/components/flashcard";
import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/haptics";
import type { Flashcard } from "@/lib/schema";
import { type TopicId, TopicMeta } from "@/lib/schema";
import { defaultCardState, isDue, type Rating, review } from "@/lib/srs";
import {
  loadStates,
  recordReview,
  recordReviewDay,
  saveState,
} from "@/lib/storage";

type FilterMode = "all" | "due" | "topic";
type Difficulty = "easy" | "medium" | "hard";
type Interleave = "none" | "mixed";

type Filters = {
  mode: FilterMode;
  topic: TopicId | "all";
  difficulty: Difficulty | "all";
  interleave: Interleave;
};

type Session = {
  again: number;
  hard: number;
  good: number;
  easy: number;
};

type State = {
  filters: Filters;
  allCards: Flashcard[];
  deck: Flashcard[];
  index: number;
  session: Session;
  done: boolean;
  shuffleSeed: number;
};

type Action =
  | { type: "SET_FILTER"; filters: Partial<Filters> }
  | { type: "SHUFFLE" }
  | { type: "RATE"; rating: Rating }
  | { type: "RESET" };

function interleaveShuffle(cards: Flashcard[], seed: number): Flashcard[] {
  const buckets = new Map<string, Flashcard[]>();
  for (const c of cards) {
    const arr = buckets.get(c.topic) ?? [];
    arr.push(c);
    buckets.set(c.topic, arr);
  }
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s) / 0xffffffff;
  };
  for (const arr of buckets.values()) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  const out: Flashcard[] = [];
  const keys = [...buckets.keys()];
  while (keys.length > 0) {
    for (let i = keys.length - 1; i >= 0; i--) {
      const k = keys[i];
      const arr = buckets.get(k);
      if (arr && arr.length > 0) {
        out.push(arr.shift() as Flashcard);
      } else {
        keys.splice(i, 1);
      }
    }
  }
  return out;
}

function buildDeck(
  cards: Flashcard[],
  filters: Filters,
  seed: number,
): Flashcard[] {
  const states = loadStates();
  const filtered = cards.filter((c) => {
    if (filters.topic !== "all" && c.topic !== filters.topic) return false;
    if (filters.difficulty !== "all" && c.difficulty !== filters.difficulty)
      return false;
    if (filters.mode === "due" && !isDue(states[c.id])) return false;
    return true;
  });

  if (filters.interleave === "mixed" && filters.topic === "all") {
    return interleaveShuffle(filtered, seed);
  }

  const arr = [...filtered];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FILTER": {
      const filters = { ...state.filters, ...action.filters };
      return {
        ...state,
        filters,
        deck: buildDeck(state.allCards, filters, state.shuffleSeed),
        index: 0,
        session: { again: 0, hard: 0, good: 0, easy: 0 },
        done: false,
      };
    }
    case "SHUFFLE": {
      const seed = Date.now();
      return {
        ...state,
        shuffleSeed: seed,
        deck: buildDeck(state.allCards, state.filters, seed),
        index: 0,
        session: { again: 0, hard: 0, good: 0, easy: 0 },
        done: false,
      };
    }
    case "RATE": {
      const session = { ...state.session };
      if (action.rating === 1) session.again++;
      else if (action.rating === 2) session.hard++;
      else if (action.rating === 3) session.good++;
      else session.easy++;
      const next = state.index + 1;
      return {
        ...state,
        session,
        index: next,
        done: next >= state.deck.length,
      };
    }
    case "RESET":
      return {
        ...state,
        index: 0,
        session: { again: 0, hard: 0, good: 0, easy: 0 },
        done: false,
      };
    default:
      return state;
  }
}

type CardDeckProps = {
  cards: Flashcard[];
  initialMode?: FilterMode;
  initialTopic?: string;
  initialDifficulty?: string;
};

export function CardDeck({
  cards,
  initialMode = "all",
  initialTopic,
  initialDifficulty,
}: CardDeckProps) {
  const initialFilters: Filters = {
    mode: initialMode,
    topic: (initialTopic as TopicId) ?? "all",
    difficulty: (initialDifficulty as Difficulty) ?? "all",
    interleave: "none",
  };
  const initialSeed = 42;

  const [state, dispatch] = useReducer(reducer, {
    filters: initialFilters,
    allCards: cards,
    deck: buildDeck(cards, initialFilters, initialSeed),
    index: 0,
    session: { again: 0, hard: 0, good: 0, easy: 0 },
    done: false,
    shuffleSeed: initialSeed,
  });

  const [currentState, setCurrentState] = useState(() => {
    const states = loadStates();
    return state.deck[0] ? states[state.deck[0].id] : undefined;
  });

  const handleRate = useCallback(
    (rating: Rating) => {
      const card = state.deck[state.index];
      if (!card) return;
      const states = loadStates();
      const prev = states[card.id] ?? defaultCardState();
      const next = review(prev, rating);
      saveState(card.id, next);
      recordReview(rating);
      recordReviewDay();
      dispatch({ type: "RATE", rating });
      const upcoming = state.deck[state.index + 1];
      if (upcoming) {
        const s2 = loadStates();
        setCurrentState(s2[upcoming.id]);
      }
    },
    [state.deck, state.index],
  );

  const currentCard = state.deck[state.index];
  const topicOptions = useMemo(
    () =>
      Object.entries(TopicMeta) as [
        TopicId,
        { label: string; emoji: string; accent: string },
      ][],
    [],
  );

  const pullY = useMotionValue(0);
  const pullIndicator = useTransform(pullY, [0, 80], [0, 1]);
  const pullRotate = useTransform(pullY, [0, 80], [0, 360]);
  const triggered = useRef(false);

  if (state.deck.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <p className="text-muted-foreground">No cards match. Adjust filters.</p>
        <Filters
          state={state}
          dispatch={dispatch}
          topicOptions={topicOptions}
        />
      </div>
    );
  }

  if (state.done) {
    const total =
      state.session.again +
      state.session.hard +
      state.session.good +
      state.session.easy;
    const recallRate = total
      ? Math.round(
          ((state.session.good +
            state.session.easy +
            state.session.hard * 0.5) /
            total) *
            100,
        )
      : 0;
    return (
      <div className="flex flex-col items-center gap-6 py-10 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-semibold tracking-tight">Deck complete</h2>
        <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
          <Stat
            label="Recall"
            value={`${recallRate}%`}
            tone={recallRate >= 80 ? "good" : recallRate >= 60 ? "ok" : "bad"}
          />
          <Stat label="Reviewed" value={String(total)} tone="neutral" />
          <Stat label="Again" value={String(state.session.again)} tone="bad" />
          <Stat label="Easy" value={String(state.session.easy)} tone="good" />
        </div>
        <Button onClick={() => dispatch({ type: "RESET" })}>
          Review again
        </Button>
        <Filters
          state={state}
          dispatch={dispatch}
          topicOptions={topicOptions}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-4"
      drag="y"
      dragConstraints={{ top: 0, bottom: 120 }}
      dragElastic={0.35}
      style={{ y: pullY }}
      onDrag={(_, info) => {
        if (info.offset.y > 80 && !triggered.current) {
          triggered.current = true;
          haptic("medium");
        }
      }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 80) {
          dispatch({ type: "SHUFFLE" });
        }
        triggered.current = false;
      }}
    >
      <motion.div
        style={{ opacity: pullIndicator, rotate: pullRotate }}
        className="self-center text-xs text-muted-foreground"
      >
        <ShuffleIcon className="size-5" />
      </motion.div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1">
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(state.index / state.deck.length) * 100}%`,
                background: "var(--primary)",
              }}
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            haptic("light");
            dispatch({ type: "SHUFFLE" });
          }}
          aria-label="Shuffle deck"
        >
          <ShuffleIcon className="size-4" />
        </Button>
      </div>

      {currentCard && (
        <FlashcardViewer
          key={currentCard.id}
          card={currentCard}
          cardState={currentState}
          onRate={handleRate}
          index={state.index}
          total={state.deck.length}
        />
      )}

      <Filters state={state} dispatch={dispatch} topicOptions={topicOptions} />
    </motion.div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "bad" | "ok" | "neutral";
}) {
  const tones = {
    good: "bg-emerald-500/10 text-emerald-500",
    bad: "bg-rose-500/10 text-rose-500",
    ok: "bg-amber-500/10 text-amber-500",
    neutral: "bg-muted text-foreground",
  };
  return (
    <div className={`rounded-xl p-3 ${tones[tone]}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

type SegmentOption<V extends string> = {
  value: V;
  label: string;
  dot?: "emerald" | "amber" | "rose";
};

function Segmented<V extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: SegmentOption<V>[];
  value: V;
  onChange: (v: V) => void;
  ariaLabel?: string;
}) {
  const DOT: Record<NonNullable<SegmentOption<V>["dot"]>, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  return (
    <fieldset
      aria-label={ariaLabel}
      className="glass relative inline-flex items-center rounded-full p-0.5 gap-0.5 border-0"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => {
              if (!active) {
                haptic("tap");
                onChange(opt.value);
              }
            }}
            className="relative px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            {active && (
              <motion.span
                layoutId={`seg-${ariaLabel ?? opt.value}`}
                className="absolute inset-0 rounded-full bg-foreground/10 border border-foreground/15 shadow-[inset_0_1px_0_color-mix(in_oklch,white_14%,transparent)]"
                transition={{ type: "spring", stiffness: 520, damping: 36 }}
              />
            )}
            <span
              className={`relative flex items-center gap-1.5 ${
                active ? "text-foreground" : "text-muted-foreground/80"
              }`}
            >
              {opt.dot && (
                <span className={`size-1.5 rounded-full ${DOT[opt.dot]}`} />
              )}
              {opt.label}
            </span>
          </button>
        );
      })}
    </fieldset>
  );
}

function TopicPicker({
  value,
  options,
  onChange,
}: {
  value: TopicId | "all";
  options: [TopicId, { label: string; emoji: string; accent: string }][];
  onChange: (v: TopicId | "all") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  const current =
    value === "all"
      ? { label: "All topics", emoji: "✦", accent: "var(--foreground)" }
      : options.find(([id]) => id === value)?.[1];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          haptic("tap");
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium hover:border-foreground/20 transition-colors"
        style={
          value !== "all" && current
            ? ({ "--accent": current.accent } as React.CSSProperties)
            : undefined
        }
      >
        {value !== "all" && current && (
          <span
            className="size-1.5 rounded-full"
            style={{ background: current.accent }}
          />
        )}
        <span className="text-base leading-none">{current?.emoji}</span>
        <span className="text-foreground">{current?.label}</span>
        <ChevronDown
          className={`size-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
            role="listbox"
            className="glass-strong absolute z-20 mt-1.5 left-0 min-w-[220px] rounded-2xl p-1.5 origin-top-left"
          >
            <OptionRow
              active={value === "all"}
              emoji="✦"
              label="All topics"
              accent="var(--foreground)"
              onClick={() => {
                onChange("all");
                setOpen(false);
              }}
            />
            <div className="h-px bg-foreground/8 my-1 mx-1" />
            {options.map(([id, meta]) => (
              <OptionRow
                key={id}
                active={value === id}
                emoji={meta.emoji}
                label={meta.label}
                accent={meta.accent}
                onClick={() => {
                  onChange(id);
                  setOpen(false);
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionRow({
  active,
  emoji,
  label,
  accent,
  onClick,
}: {
  active: boolean;
  emoji: string;
  label: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={() => {
        haptic("tap");
        onClick();
      }}
      className={`relative w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[12.5px] text-left transition-colors ${
        active
          ? "bg-foreground/8 text-foreground"
          : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
      }`}
    >
      <span
        className="size-1.5 rounded-full shrink-0"
        style={{ background: accent }}
      />
      <span className="text-base leading-none">{emoji}</span>
      <span className="flex-1 truncate">{label}</span>
      {active && (
        <Check
          className="size-3.5 text-foreground/80 shrink-0"
          strokeWidth={2.5}
        />
      )}
    </button>
  );
}

function Filters({
  state,
  dispatch,
  topicOptions,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  topicOptions: [TopicId, { label: string; emoji: string; accent: string }][];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented<FilterMode | "topic">
        ariaLabel="Deck mode"
        options={[
          { value: "all", label: "All" },
          { value: "due", label: "Due" },
        ]}
        value={state.filters.mode === "topic" ? "all" : state.filters.mode}
        onChange={(v) =>
          dispatch({
            type: "SET_FILTER",
            filters: { mode: v as FilterMode },
          })
        }
      />

      <TopicPicker
        value={state.filters.topic}
        options={topicOptions}
        onChange={(v) =>
          dispatch({ type: "SET_FILTER", filters: { topic: v } })
        }
      />

      <Segmented<Difficulty | "all">
        ariaLabel="Difficulty"
        options={[
          { value: "all", label: "Any" },
          { value: "easy", label: "Easy", dot: "emerald" },
          { value: "medium", label: "Med", dot: "amber" },
          { value: "hard", label: "Hard", dot: "rose" },
        ]}
        value={state.filters.difficulty}
        onChange={(v) =>
          dispatch({
            type: "SET_FILTER",
            filters: { difficulty: v },
          })
        }
      />

      <Segmented<Interleave>
        ariaLabel="Ordering"
        options={[
          { value: "none", label: "Linear" },
          { value: "mixed", label: "Interleave" },
        ]}
        value={state.filters.interleave}
        onChange={(v) =>
          dispatch({ type: "SET_FILTER", filters: { interleave: v } })
        }
      />
    </div>
  );
}
