export default function Footer() {
  const year = 2026
  return (
    <footer className="relative z-10 px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass flex flex-col items-center gap-4 px-8 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold text-white"
              style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
            >
              CV
            </span>
            <span className="text-base font-extrabold tracking-tight text-ink">
              Compli<span className="gradient-text">Vibe</span>
            </span>
          </div>

          <p className="max-w-md text-sm text-ink-secondary">
            The AI trust layer — compliance, governance, and observability in one place.
          </p>

          <div className="flex flex-col items-center gap-1 text-sm text-ink-secondary sm:items-end">
            <a
              href="mailto:adarsh@complivibe.in"
              className="font-semibold text-brand-purple hover:underline"
            >
              adarsh@complivibe.in
            </a>
            <a href="https://complivibe.in" className="hover:text-brand-purple">
              complivibe.in
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-secondary">
          © {year} CompliVibe. All rights reserved. · Built for the AI-first enterprise.
        </p>
      </div>
    </footer>
  )
}
