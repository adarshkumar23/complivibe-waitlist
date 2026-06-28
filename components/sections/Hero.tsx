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
    /*
     * Mobile: natural height, items start from top with padding.
     * Desktop (sm+): full viewport height, content vertically centered.
     * justify-center on flex with overflow clips the top on mobile — avoid it.
     */
    <section
      id="top"
      className="relative flex flex-col items-center px-4 pb-10 pt-[72px] text-center
                 sm:min-h-[100svh] sm:justify-center sm:px-8 sm:pb-16 sm:pt-0"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45, ease }}
          className="eyebrow mb-3 sm:mb-5"
        >
          AI Trust Infrastructure
        </motion.p>

        {/* Headline */}
        <AnimatedHeadline
          className="hero-headline text-ink"
          baseDelay={0.35}
          perWord={0.05}
          lines={[
            ['Your', 'AI', 'is', 'live.'],
            ['Your', <span className="gradient-text">governance</span>, "isn't."],
          ]}
        />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease }}
          className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-secondary
                     sm:mt-5 sm:max-w-2xl sm:text-base md:text-lg"
        >
          CompliVibe unifies AI compliance, governance, and observability into one trust layer
          — so you can ship AI without the regulatory risk.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5, ease }}
          className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4"
        >
          <MagneticButton
            href="#waitlist"
            className="btn-cta h-12 w-full text-sm sm:h-14 sm:w-auto sm:text-base"
          >
            Get Early Access →
          </MagneticButton>
          <a
            href="#platform"
            className="btn-ghost h-12 w-full text-sm sm:h-14 sm:w-auto sm:text-base"
          >
            View Platform →
          </a>
        </motion.div>

        {/* Social proof — ticker on mobile, static pills on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-6 sm:mt-8"
        >
          {/* Desktop: static wrap */}
          <div className="hidden flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-ink-secondary sm:flex sm:text-sm">
            {SOCIAL_PROOF.map((s, i) => (
              <span key={s.text} className="flex items-center gap-1.5">
                {i > 0 && <span className="mr-2 text-brand-purple/30">·</span>}
                <span>{s.icon}</span>
                <span className="font-medium">{s.text}</span>
              </span>
            ))}
          </div>
          {/* Mobile: scrolling ticker */}
          <div className="overflow-hidden sm:hidden">
            <div className="ticker-track flex w-max items-center">
              {[...SOCIAL_PROOF, ...SOCIAL_PROOF].map((s, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 whitespace-nowrap px-3 text-xs text-ink-secondary"
                >
                  <span>{s.icon}</span>
                  <span className="font-medium">{s.text}</span>
                  <span className="ml-2 text-brand-purple/30">·</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Countdown timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5, ease }}
          className="mt-6 flex justify-center sm:mt-8"
        >
          <div className="glass flex flex-col items-center justify-center px-5 py-3 sm:px-8 sm:py-5">
            <span className="mb-1.5 text-[10px] font-semibold uppercase tracking-[2px] text-ink-secondary sm:mb-2 sm:text-xs">
              Launch in
            </span>
            <CountdownTimer />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue — only visible on desktop where hero fills viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
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
