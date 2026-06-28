'use client'

import { motion } from 'framer-motion'
import RevealOnScroll from '../RevealOnScroll'

const FRAMEWORKS = [
  { flag: '🇪🇺', name: 'EU AI Act', sub: 'High-risk AI · Aug 2026', accent: '#5B5FE3' },
  { flag: '🇮🇳', name: 'DPDP Act', sub: 'Active enforcement', accent: '#6EE7B7' },
  { flag: '📋', name: 'ISO 42001', sub: 'AI Management System', accent: '#5B5FE3' },
  { flag: '🏛️', name: 'NIST AI RMF', sub: 'Risk management', accent: '#6EE7B7' },
  { flag: '🔒', name: 'SOC 2', sub: 'Trust & security', accent: '#5B5FE3' },
  { flag: '🏔️', name: 'Colorado AI Act', sub: 'US state regulation', accent: '#6EE7B7' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function FrameworkGrid() {
  return (
    <section className="relative px-4 py-14 sm:px-8 sm:py-28">
      <div className="relative z-10 mx-auto max-w-6xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Coverage</p>
          <h2 className="section-headline text-ink">Every framework that matters. In one place.</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-secondary">
            Competitors cover 2–3 frameworks. CompliVibe covers 6+.
          </p>
        </RevealOnScroll>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FRAMEWORKS.map((f) => (
            <motion.div
              key={f.name}
              variants={item}
              className="glass glass-lift flex items-center gap-3 p-4 sm:gap-4 sm:p-6"
              style={{ borderLeft: `4px solid ${f.accent}` }}
            >
              <span className="text-3xl">{f.flag}</span>
              <div>
                <h3 className="text-base font-bold text-ink">{f.name}</h3>
                <p className="text-sm text-ink-secondary">{f.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <RevealOnScroll delay={0.1} className="mt-10 text-center">
          <p className="text-ink-secondary">
            More frameworks being added.{' '}
            <span className="font-semibold text-ink">Your industry&apos;s regulation covered.</span>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
