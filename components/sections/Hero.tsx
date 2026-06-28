'use client'

import { motion } from 'framer-motion'
import AnimatedHeadline from '../AnimatedHeadline'
import MagneticButton from '../MagneticButton'
import CountdownTimer from '../CountdownTimer'

const SOCIAL_PROOF = [
  { icon: '👥', text: '3 paying customers' },
  { icon: '🧪', text: '5 beta trials' },
  { icon: '⏳', text: '13-account waitlist' },
  { icon: '📋', text: '828 mapped obligations' },
  { icon: '🔌', text: '23+ integrations' },
]

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:px-8"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        {/* t=0.2s eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
          className="eyebrow mb-5"
        >
          AI Trust Infrastructure
        </motion.p>

        {/* t=0.4s headline — word by word */}
        <AnimatedHeadline
          className="hero-headline text-ink"
          baseDelay={0.4}
          perWord={0.06}
          lines={[
            ['Your', 'AI', 'is', 'live.'],
            ['Your', <span className="gradient-text">governance</span>, "isn't."],
          ]}
        />

        {/* t=0.9s subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.55, ease }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-secondary sm:text-xl"
        >
          CompliVibe unifies AI compliance, governance, and observability into one trust layer
          — so you can ship AI without the regulatory risk.
        </motion.p>

        {/* t=1.1s CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.55, ease }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton href="#waitlist" className="btn-cta h-14 w-full sm:w-auto">
            Get Early Access →
          </MagneticButton>
          <a href="#platform" className="btn-ghost h-14 w-full sm:w-auto">
            View Platform →
          </a>
        </motion.div>

        {/* t=1.3s social proof strip — marquee on mobile, static on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-10"
        >
          {/* desktop */}
          <div className="hidden max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink-secondary sm:mx-auto sm:flex">
            {SOCIAL_PROOF.map((s, i) => (
              <span key={s.text} className="flex items-center gap-1.5">
                {i > 0 && <span className="mr-3 text-brand-purple/30">·</span>}
                <span>{s.icon}</span>
                <span className="font-medium">{s.text}</span>
              </span>
            ))}
          </div>
          {/* mobile ticker */}
          <div className="overflow-hidden sm:hidden">
            <div className="ticker-track flex w-max items-center">
              {[...SOCIAL_PROOF, ...SOCIAL_PROOF].map((s, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 whitespace-nowrap px-4 text-sm text-ink-secondary"
                >
                  <span>{s.icon}</span>
                  <span className="font-medium">{s.text}</span>
                  <span className="ml-3 text-brand-purple/30">·</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* t=1.5s countdown timer */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease }}
          className="mt-10 flex justify-center"
        >
          <div className="glass flex flex-col items-center justify-center px-8 py-5">
            <span className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-ink-secondary">
              Launch in
            </span>
            <CountdownTimer />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-brand-purple/30 p-1"
        >
          <span className="h-1.5 w-1 rounded-full bg-brand-purple/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
