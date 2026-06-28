'use client'

import { ShieldCheck, Network, Activity, Check } from 'lucide-react'
import RevealOnScroll from '../RevealOnScroll'
import TiltCard from '../TiltCard'

const FRAMEWORK_TAGS = ['EU AI Act', 'DPDP', 'ISO 42001', 'NIST AI RMF', 'SOC 2', 'Colorado AI Act']
const GOV_FEATURES = [
  'Model inventory & registry',
  'Risk assessment workflows',
  'Model cards & documentation',
  'Bias testing & fairness checks',
]
const OBS_FEATURES = [
  'Drift monitoring',
  'Hallucination tracking',
  'Incident response',
  'Data health scoring',
]

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white"
      style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
    >
      {children}
    </div>
  )
}

export default function WhatWeDo() {
  return (
    <section id="platform" className="relative px-4 py-14 sm:px-8 sm:py-28">
      <div className="relative z-10 mx-auto max-w-6xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">The Platform</p>
          <h2 className="section-headline text-ink">One platform. Not three tools.</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-secondary">
            Most companies stitch together 4–6 tools for compliance, governance, and
            observability. CompliVibe is the unified trust layer.
          </p>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1 — Compliance */}
          <RevealOnScroll delay={0} direction="up" className="h-full">
            <TiltCard className="glass flex h-full flex-col p-5 sm:p-8">
              <IconBadge>
                <ShieldCheck size={24} />
              </IconBadge>
              <h3 className="text-xl font-bold text-ink">AI Compliance</h3>
              <p className="mt-2 text-ink-secondary">Stay ahead of every major regulation.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {FRAMEWORK_TAGS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs font-semibold text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-auto pt-6 text-sm font-bold gradient-text">
                6 frameworks. 828 mapped obligations.
              </p>
            </TiltCard>
          </RevealOnScroll>

          {/* Card 2 — Governance (highlighted) */}
          <RevealOnScroll delay={0.12} direction="up" className="h-full">
            <TiltCard className="glass-strong gradient-border gradient-border-glow flex h-full flex-col p-5 sm:p-8">
              <IconBadge>
                <Network size={24} />
              </IconBadge>
              <h3 className="text-xl font-bold text-ink">AI Governance</h3>
              <p className="mt-2 text-ink-secondary">Know every model. Control every risk.</p>
              <ul className="mt-5 space-y-2.5">
                {GOV_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                    <Check size={16} className="flex-shrink-0 text-brand-purple" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 text-sm font-bold gradient-text">
                Full model lifecycle visibility.
              </p>
            </TiltCard>
          </RevealOnScroll>

          {/* Card 3 — Observability */}
          <RevealOnScroll delay={0.24} direction="up" className="h-full">
            <TiltCard className="glass flex h-full flex-col p-5 sm:p-8">
              <IconBadge>
                <Activity size={24} />
              </IconBadge>
              <h3 className="text-xl font-bold text-ink">AI Observability</h3>
              <p className="mt-2 text-ink-secondary">See it fail before your users do.</p>
              <ul className="mt-5 space-y-2.5">
                {OBS_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                    <Check size={16} className="flex-shrink-0 text-brand-purple" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 text-sm font-bold gradient-text">
                Real-time trust signals.
              </p>
            </TiltCard>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.1} className="mt-12 text-center">
          <p className="text-lg font-semibold text-ink">
            Everything connected. Evidence auto-generated.{' '}
            <span className="gradient-text">Audit-ready in days, not months.</span>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
