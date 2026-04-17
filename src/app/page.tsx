import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-semibold">Interview Prep — CS</h1>
      <p className="text-muted-foreground text-sm">
        Mobile-first flashcards for senior engineering interviews
      </p>
      <Link className="underline" href="/review">
        Start review →
      </Link>
    </main>
  );
}
