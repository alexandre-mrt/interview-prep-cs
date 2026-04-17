"use client";

import { ShuffleIcon } from "lucide-react";
import { useCallback, useReducer } from "react";
import { FlashcardViewer } from "@/components/flashcard";
import { Button } from "@/components/ui/button";
import type { Flashcard } from "@/lib/schema";
import { type TopicId, TopicMeta } from "@/lib/schema";
import { isDue, review } from "@/lib/srs";
import { loadStates, saveState } from "@/lib/storage";

type FilterMode = "all" | "due" | "topic";
type Difficulty = "easy" | "medium" | "hard";

type Filters = {
  mode: FilterMode;
  topic: TopicId | "all";
  difficulty: Difficulty | "all";
};

type Session = {
  easy: number;
  medium: number;
  hard: number;
};

type State = {
  filters: Filters;
  deck: Flashcard[];
  index: number;
  session: Session;
  done: boolean;
  shuffleSeed: number;
};

type Action =
  | { type: "SET_FILTER"; filters: Partial<Filters> }
  | { type: "SHUFFLE" }
  | { type: "RATE"; quality: 1 | 2 | 3 }
  | { type: "RESET" };

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

  // Fisher-Yates shuffle seeded by seed
  const arr = [...filtered];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
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
        deck: buildDeck(state.deck.concat(), filters, state.shuffleSeed),
        index: 0,
        session: { easy: 0, medium: 0, hard: 0 },
        done: false,
      };
    }
    case "SHUFFLE": {
      const seed = Date.now();
      return {
        ...state,
        shuffleSeed: seed,
        deck: buildDeck(state.deck.concat(), state.filters, seed),
        index: 0,
        session: { easy: 0, medium: 0, hard: 0 },
        done: false,
      };
    }
    case "RATE": {
      const session = { ...state.session };
      if (action.quality === 1) session.hard++;
      else if (action.quality === 2) session.medium++;
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
        session: { easy: 0, medium: 0, hard: 0 },
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
  };
  const initialSeed = 42;

  const [state, dispatch] = useReducer(reducer, {
    filters: initialFilters,
    deck: buildDeck(cards, initialFilters, initialSeed),
    index: 0,
    session: { easy: 0, medium: 0, hard: 0 },
    done: false,
    shuffleSeed: initialSeed,
  });

  const handleRate = useCallback(
    (quality: 1 | 2 | 3) => {
      const card = state.deck[state.index];
      if (!card) return;
      const states = loadStates();
      const prev = states[card.id];
      const next = review(
        prev ?? { ease: 2.5, interval: 0, dueAt: Date.now(), reps: 0 },
        quality,
      );
      saveState(card.id, next);
      dispatch({ type: "RATE", quality });
    },
    [state.deck, state.index],
  );

  const currentCard = state.deck[state.index];
  const topicOptions = Object.entries(TopicMeta) as [
    TopicId,
    { label: string },
  ][];

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
    return (
      <div className="flex flex-col items-center gap-6 py-10 text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-semibold">Deck complete!</h2>
        <p className="text-sm text-muted-foreground">
          Rated{" "}
          <span className="text-emerald-400 font-medium">
            {state.session.easy} easy
          </span>
          ,{" "}
          <span className="text-amber-400 font-medium">
            {state.session.medium} medium
          </span>
          ,{" "}
          <span className="text-rose-400 font-medium">
            {state.session.hard} hard
          </span>
        </p>
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(state.index / state.deck.length) * 100}%` }}
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch({ type: "SHUFFLE" })}
        >
          <ShuffleIcon className="size-4" />
        </Button>
      </div>

      {currentCard && (
        <FlashcardViewer
          card={currentCard}
          onRate={handleRate}
          index={state.index}
          total={state.deck.length}
        />
      )}

      <Filters state={state} dispatch={dispatch} topicOptions={topicOptions} />
    </div>
  );
}

function Filters({
  state,
  dispatch,
  topicOptions,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  topicOptions: [TopicId, { label: string }][];
}) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <select
        value={state.filters.mode}
        onChange={(e) =>
          dispatch({
            type: "SET_FILTER",
            filters: { mode: e.target.value as FilterMode },
          })
        }
        className="rounded-lg bg-muted border border-foreground/10 px-2 py-1.5 text-foreground text-xs outline-none"
      >
        <option value="all">All cards</option>
        <option value="due">Due only</option>
      </select>

      <select
        value={state.filters.topic}
        onChange={(e) =>
          dispatch({
            type: "SET_FILTER",
            filters: { topic: e.target.value as TopicId | "all" },
          })
        }
        className="rounded-lg bg-muted border border-foreground/10 px-2 py-1.5 text-foreground text-xs outline-none"
      >
        <option value="all">All topics</option>
        {topicOptions.map(([id, meta]) => (
          <option key={id} value={id}>
            {meta.label}
          </option>
        ))}
      </select>

      <select
        value={state.filters.difficulty}
        onChange={(e) =>
          dispatch({
            type: "SET_FILTER",
            filters: { difficulty: e.target.value as Difficulty | "all" },
          })
        }
        className="rounded-lg bg-muted border border-foreground/10 px-2 py-1.5 text-foreground text-xs outline-none"
      >
        <option value="all">All difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
}
