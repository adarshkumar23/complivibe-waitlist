'use client'

import { Lock, Unlock } from 'lucide-react'
import RevealOnScroll from '../RevealOnScroll'
import TiltCard from '../TiltCard'
import CountdownTimer from '../CountdownTimer'
import MagneticButton from '../MagneticButton'

const ALTERNATIVES = [
  { name: 'Credo AI', price: '~$100,000/year' },
  { name: 'BigID', price: '~$80,000/year' },
  { name: 'OneTrust AI', price: '~$150,000/year' },
]

const TIERS = [
  { name: 'Starter', was: '$100/mo', now: '$50/mo', note: '50% off' },
  { name: 'Growth', was: '$299/mo', now: '$149/mo', note: '50% off' },
  { name: 'Enterprise', was: 'Custom', now: '$299/mo', note: 'Was custom (now fixed)' },
]

export default function PricingTeaser() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-8 sm:py-32">
      {/* deep gradient backdrop */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 50%, rgba(91,95,227,0.2) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 70% 50%, rgba(110,231,183,0.1) 0%, transparent 60%), linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #0F1A1A 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3" style={{ color: '#6EE7B7' }}>
            Pricing
          </p>
          <h2 className="section-headline text-white">
            Enterprise-grade AI governance. Startup pricing.
          </h2>
          <p className="mt-5 text-lg text-white/70">
            And for the next 15 days — <span className="gradient-text font-bold">half of that.</span>
          </p>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT — the alternative */}
          <RevealOnScroll delay={0.1} direction="left" className="h-full">
            <TiltCard
              max={8}
              className="flex h-full flex-col rounded-glass border border-white/10 p-5 opacity-80 sm:p-8"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white/80">Other platforms</h3>
                <span className="flex items-center gap-1.5 rounded-full bg-risk-high/20 px-3 py-1 text-xs font-bold text-risk-high">
                  <Lock size={12} /> LOCKED OUT
                </span>
              </div>
              <ul className="space-y-3">
                {ALTERNATIVES.map((a) => (
                  <li
                    key={a.name}
                    className="flex items-center justify-between border-b border-white/5 pb-3 text-white/60"
                  >
                    <span>{a.name}</span>
                    <span className="font-semibold line-through decoration-white/30">
                      {a.price}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 text-sm font-semibold text-white/50">
                Average: $100,000–$200,000/year
              </p>
            </TiltCard>
          </RevealOnScroll>

          {/* RIGHT — CompliVibe */}
          <RevealOnScroll delay={0.2} direction="right" className="h-full">
            <TiltCard
              max={8}
              className="gradient-border flex h-full flex-col rounded-glass p-5 sm:p-8"
              style={{
                background: 'rgba(255,255,255,0.08)',
                boxShadow: '0 0 60px rgba(110,231,183,0.18)',
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">CompliVibe Early Access</h3>
                <span className="flex items-center gap-1.5 rounded-full bg-risk-low/20 px-3 py-1 text-xs font-bold text-risk-low">
                  <Unlock size={12} /> YOUR PRICE
                </span>
              </div>

              <ul className="space-y-4">
                {TIERS.map((t) => (
                  <li
                    key={t.name}
                    className="flex items-center justify-between border-b border-white/10 pb-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/40 line-through">{t.was}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold gradient-text sm:text-2xl">{t.now}</span>
                      <p className="text-[10px] font-semibold text-risk-low sm:text-[11px]">← {t.note}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <span className="flex w-full items-center justify-center gap-1.5 rounded-full bg-risk-low/20 py-2.5 text-sm font-bold text-risk-low">
                  <Lock size={14} /> YOUR PRICE — LOCKED FOREVER
                </span>
              </div>
            </TiltCard>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.15} className="mt-10 text-center">
          <p className="mx-auto max-w-2xl text-white/70">
            That&apos;s a <span className="font-bold text-white">99% price difference</span> from
            the enterprise alternative. Waitlist pricing is locked forever — no price increases
            for early members.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-white/70">
              <span>This pricing expires in</span>
              <span className="rounded-lg bg-white/10 px-2 py-1">
                <CountdownTimer variant="inline" className="!text-white" />
              </span>
            </div>
            <MagneticButton href="#waitlist" className="btn-cta">
              Lock My Price →
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
