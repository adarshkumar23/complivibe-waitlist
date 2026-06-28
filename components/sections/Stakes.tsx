'use client'

import RevealOnScroll from '../RevealOnScroll'
import TiltCard from '../TiltCard'
import AnimatedNumber from '../AnimatedNumber'

const CARDS = [
  {
    prefix: '€',
    value: 35,
    suffix: 'M',
    accent: '#5B5FE3',
    text: 'Maximum fine for EU AI Act non-compliance. Enforcement for high-risk AI systems begins August 2026. No exceptions.',
  },
  {
    prefix: '',
    value: 3,
    suffix: '+',
    accent: '#EF4444',
    text: 'Major AI product lawsuits filed in 2024. Every single company lacked documented governance and bias testing records.',
  },
  {
    prefix: '',
    value: 95,
    suffix: '%',
    accent: '#F59E0B',
    text: 'Of AI companies have zero ISO 42001 controls in place today. The regulation exists. The compliance does not.',
  },
]

export default function Stakes() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div
        className="absolute inset-x-0 top-0 -z-0 h-full"
        style={{ background: 'rgba(91,95,227,0.04)' }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">The Cost of Waiting</p>
          <h2 className="section-headline text-ink">
            Regulators aren&apos;t waiting. Neither should you.
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <RevealOnScroll key={c.value} delay={i * 0.12} direction="up" className="h-full">
              <TiltCard
                className="glass h-full p-8"
                style={{ borderLeft: `4px solid ${c.accent}` }}
              >
                <span
                  className="block text-5xl font-extrabold tracking-tight sm:text-6xl"
                  style={{ color: c.accent }}
                >
                  <AnimatedNumber
                    value={c.value}
                    prefix={c.prefix}
                    suffix={c.suffix}
                    duration={1500}
                  />
                </span>
                <p className="mt-4 text-base leading-relaxed text-ink-secondary">{c.text}</p>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
