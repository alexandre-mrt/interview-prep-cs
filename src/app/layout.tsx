import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { BottomNav } from "@/components/bottom-nav";
import { CommandPaletteProvider } from "@/components/command-palette-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { PwaRegister } from "@/components/pwa-register";
import { loadAllFlashcards } from "@/lib/content-loader";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Interview Prep — CS",
  description: "Mobile-first flashcards for senior engineering interviews",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Interview Prep",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cards = loadAllFlashcards();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col pb-[calc(env(safe-area-inset-bottom)+64px)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PwaRegister />
          <CommandPaletteProvider cards={cards} />
          {children}
          <InstallPrompt />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
