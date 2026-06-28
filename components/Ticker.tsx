'use client'

const ITEMS = [
  'EU AI Act',
  'August 2026',
  'DPDP Active',
  'ISO 42001',
  'NIST AI RMF',
  'SOC 2',
  'Colorado AI Act',
]

/** Full-width infinite marquee of regulations between Hero and Stakes. */
export default function Ticker() {
  // duplicate the list so the -50% translate loops seamlessly
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div
      className="relative z-10 overflow-hidden py-4"
      style={{
        background: 'rgba(91,95,227,0.05)',
        borderTop: '1px solid rgba(91,95,227,0.1)',
        borderBottom: '1px solid rgba(91,95,227,0.1)',
      }}
    >
      <div className="ticker-track flex w-max items-center gap-0">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="whitespace-nowrap px-6 text-sm font-semibold tracking-wide text-ink/70">
              {item}
            </span>
            <span className="text-brand-purple/40">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
