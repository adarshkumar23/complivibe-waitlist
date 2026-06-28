'use client'

import { Quote } from 'lucide-react'
import RevealOnScroll from '../RevealOnScroll'
import TiltCard from '../TiltCard'
import AnimatedNumber from '../AnimatedNumber'

const METRICS = [
  { value: 5, suffix: '', label: 'Patents Filed', duration: 800 },
  { value: 23, suffix: '+', label: 'Integrations', duration: 800 },
  { value: 6, suffix: '', label: 'Frameworks', duration: 800 },
  { value: 828, suffix: '', label: 'Obligations Mapped', duration: 1200 },
]

export default function SocialProof() {
  return (
    <section className="relative px-4 py-14 sm:px-8 sm:py-28">
      <div className="relative z-10 mx-auto max-w-6xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Traction</p>
          <h2 className="section-headline text-ink">
            Built by people who&apos;ve seen the problem from inside.
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <RevealOnScroll key={m.label} delay={(i % 4) * 0.1} direction="scale" className="h-full">
              <TiltCard className="glass flex h-full flex-col items-center justify-center p-4 text-center sm:p-7">
                <AnimatedNumber
                  value={m.value}
                  suffix={m.suffix}
                  duration={m.duration}
                  className="text-3xl font-extrabold gradient-text sm:text-4xl md:text-5xl"
                />
                <span className="mt-2 text-sm font-medium text-ink-secondary">{m.label}</span>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.1} className="mt-10 text-center">
          <p className="text-base text-ink-secondary">
            Founded by engineers from{' '}
            <span className="font-semibold text-ink">Google, IBM, and Databricks</span>. Built
            because we lived this problem.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15} direction="up" className="mx-auto mt-10 max-w-3xl">
          <div className="glass-strong relative p-5 sm:p-10">
            <Quote
              size={40}
              className="absolute -top-3 left-6 text-brand-purple/30"
              fill="currentColor"
            />
            <p className="text-base leading-relaxed text-ink sm:text-lg md:text-xl">
              &ldquo;I spent months at an enterprise company manually mapping AI risks across 4
              different tools. There was no single source of truth. That&apos;s why we built
              CompliVibe.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
              >
                AS
              </div>
              <div>
                <p className="font-bold text-ink">Adarsh Sharma</p>
                <p className="text-sm text-ink-secondary">Founder &amp; CEO</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
