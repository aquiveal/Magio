import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Radar, Mail, Eye, MapPin, ShieldCheck, Download, Lock, Server,
  ArrowRight, MousePointerClick, Send, LineChart,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Magio — Know when your emails are opened',
  description:
    'Magio embeds an invisible tracking pixel in your Gmail messages and shows you exactly when, where, and how they are read — from a browser extension and a clean dashboard. Open source and self-hostable.',
};

const REPO = 'https://github.com/DeepakSilaych/Magio';
const LATEST_RELEASE = 'https://github.com/DeepakSilaych/Magio/releases/latest';

const FEATURES = [
  { icon: Eye, title: 'Real-time open tracking', body: 'A 1×1 pixel logs every open the instant a recipient views your message — no polling, no guesswork.' },
  { icon: Mail, title: 'Native to Gmail', body: 'Toggle tracking right from the Gmail compose toolbar. The pixel is embedded automatically on send.' },
  { icon: MapPin, title: 'Rich view details', body: 'See each open with approximate location, device, OS and browser — parsed from the request.' },
  { icon: LineChart, title: 'Clean analytics dashboard', body: 'Total opens, unique viewers, first and last seen, and a per-email timeline of every view.' },
  { icon: Lock, title: 'Private accounts', body: 'Password-protected sign-in for the dashboard and a per-user API token for the extension.' },
  { icon: Server, title: 'Open source & self-hostable', body: 'Next.js + Prisma + Postgres. Point the extension at your own server — your data stays yours.' },
];

const STEPS = [
  { icon: MousePointerClick, title: 'Install & connect', body: 'Load the extension, enter your Magio server URL, and sign in.' },
  { icon: Send, title: 'Compose as usual', body: 'Write your email in Gmail. Magio quietly embeds a tracking pixel when you hit send.' },
  { icon: Radar, title: 'Watch the opens', body: 'The moment it’s read, the open appears on your dashboard with full detail.' },
];

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] opacity-60"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/20 p-1.5">
            <Radar className="h-5 w-5 text-primary" />
          </div>
          <span className="text-base font-semibold tracking-tight">Magio</span>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <a href="#features" className="hidden rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground sm:inline">Features</a>
          <a href="#how" className="hidden rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground sm:inline">How it works</a>
          <a href={REPO} target="_blank" rel="noreferrer" className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">GitHub</a>
          {user ? (
            <Link href="/overview" className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link href="/login" className="ml-1 rounded-lg px-3.5 py-2 font-medium text-foreground transition-colors hover:bg-accent">Log in</Link>
          )}
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center sm:pt-24">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Email open tracking for Gmail
        </div>

        <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          Know the moment your{' '}
          <span className="bg-gradient-to-r from-primary to-[oklch(0.7_0.15_300)] bg-clip-text text-transparent">
            email is opened
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Magio embeds an invisible tracking pixel in your Gmail messages and shows you exactly
          when, where, and how they’re read — through a browser extension and a clean dashboard.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={user ? '/overview' : '/signup'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            {user ? 'Go to dashboard' : 'Get started — it’s free'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={LATEST_RELEASE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-3 font-medium text-foreground transition-colors hover:bg-accent sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download extension
          </a>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Free · open source · self-hostable</p>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need to track opens</h2>
          <p className="mt-3 text-muted-foreground">Lightweight by design, detailed where it counts.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-[15px] font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">From install to insight in minutes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="relative rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="text-[15px] font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* privacy note */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
          <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
          <div>
            <h3 className="text-[15px] font-medium">Your data, your server</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Magio is fully open source. Run it on your own infrastructure and the extension talks
              only to the server you choose — no third-party analytics, no vendor lock-in.
            </p>
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="rounded-2xl border border-border bg-gradient-to-b from-card to-background p-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Start tracking your emails today</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Create an account, connect the extension, and see your first open roll in.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={user ? '/overview' : '/signup'} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto">
              {user ? 'Open dashboard' : 'Create your account'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!user && (
              <Link href="/login" className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-card px-5 py-3 font-medium text-foreground transition-colors hover:bg-accent sm:w-auto">
                Log in
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-primary" />
            <span>Magio — Email view analytics</span>
          </div>
          <div className="flex items-center gap-5">
            <a href={REPO} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">GitHub</a>
            <a href={LATEST_RELEASE} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">Extension</a>
            <Link href="/login" className="transition-colors hover:text-foreground">Log in</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
