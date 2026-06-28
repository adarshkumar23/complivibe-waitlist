'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Linkedin,
  Twitter,
  Link2,
  Rocket,
} from 'lucide-react'
import ScoreMeter from './ScoreMeter'
import type { RiskScore as RiskScoreType, Tier } from '@/lib/types'

interface Props {
  score: RiskScoreType
  gaps: string[]
  email: string
  waitlistId?: string
  tier?: Tier
}

const CONFIG: Record<RiskScoreType, { color: string; label: string; fill: number; bg: string }> = {
  HIGH: { color: '#EF4444', label: 'HIGH RISK', fill: 85, bg: 'rgba(239,68,68,0.12)' },
  MEDIUM: { color: '#F59E0B', label: 'MEDIUM RISK', fill: 55, bg: 'rgba(245,158,11,0.12)' },
  LOW: { color: '#10B981', label: 'LOW RISK', fill: 25, bg: 'rgba(16,185,129,0.12)' },
}

const WAITLIST_URL = 'https://waitlist.complivibe.in'

/** Lightweight confetti burst for the LOW (celebratory) state. */
function Confetti() {
  const colors = ['#5B5FE3', '#6EE7B7', '#10B981', '#F59E0B', '#EF4444']
  const pieces = Array.from({ length: 40 }, (_, i) => i)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((i) => {
        const left = (i * 37) % 100
        const delay = (i % 10) * 0.08
        const color = colors[i % colors.length]
        const size = 6 + (i % 4) * 2
        return (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: 460, opacity: 0, rotate: 360 }}
            transition={{ duration: 2.2, delay, ease: 'easeIn' }}
            style={{
              position: 'absolute',
              top: 0,
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: i % 2 ? '50%' : '2px',
              background: color,
            }}
          />
        )
      })}
    </div>
  )
}

export default function RiskScore({ score, gaps, email, waitlistId, tier }: Props) {
  const cfg = CONFIG[score]
  const [count, setCount] = useState(0)
  const [copied, setCopied] = useState(false)

  // Animated count-up of the exposure figure
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const duration = 1400
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * cfg.fill))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cfg.fill])

  const auditLink = `mailto:adarsh@complivibe.in?subject=${encodeURIComponent(
    `Free AI Audit - ${waitlistId ?? ''}`.trim()
  )}`
  const shareText = encodeURIComponent(
    `I just got my AI compliance risk score from @CompliVibe: ${score} RISK. Find yours 👇`
  )
  const shareUrl = encodeURIComponent(WAITLIST_URL)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(WAITLIST_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  const nextSteps = [
    'Check your email — your offer details are waiting',
    'On launch day, you get a personal login link from Adarsh',
    'Your 3-month free trial activates automatically',
    `Your price is locked at ${tier ?? 'Starter'} — forever`,
  ]

  return (
    <div className="relative">
      {score === 'LOW' && <Confetti />}

      {/* TOP — confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: 'rgba(16,185,129,0.15)' }}
        >
          <CheckCircle2 size={30} className="text-risk-low" />
        </motion.div>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-ink">
          You&apos;re on the waitlist
        </h3>
        {waitlistId && (
          <p className="mt-1.5 text-sm text-ink-secondary">
            Waitlist ID:{' '}
            <span className="font-mono font-bold gradient-text">{waitlistId}</span>
          </p>
        )}
      </motion.div>

      {/* MIDDLE — score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 text-center"
      >
        <p className="eyebrow mb-4">Your AI Compliance Risk</p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.25 }}
          className={`mx-auto w-fit rounded-full ${score === 'HIGH' ? 'animate-pulseRisk' : ''}`}
        >
          <ScoreMeter score={score} percentage={cfg.fill} />
        </motion.div>

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 1 }}
          className="mx-auto mt-5 inline-block rounded-full px-7 py-2.5 text-lg font-extrabold tracking-wide text-white sm:text-xl"
          style={{ background: cfg.color }}
        >
          {cfg.label}
        </motion.div>

        <p className="mt-3 text-sm font-bold tabular-nums" style={{ color: cfg.color }}>
          {count}% exposure
        </p>
      </motion.div>

      {/* Gaps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8"
      >
        <p className="mb-3 text-base font-bold text-ink">
          3 gaps identified in your AI governance:
        </p>
        <ul className="space-y-2.5">
          {gaps.map((gap, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 + i * 0.15 }}
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ background: cfg.bg }}
            >
              <AlertTriangle
                size={18}
                className="mt-0.5 flex-shrink-0"
                style={{ color: cfg.color }}
              />
              <span className="text-sm leading-relaxed text-ink">{gap}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Promise box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="glass gradient-border gradient-border-glow mt-8 p-6"
      >
        <p className="flex items-center gap-2 text-base font-bold text-ink">
          <Rocket size={18} className="text-brand-purple" /> What happens next:
        </p>
        <ul className="mt-3 space-y-2">
          {nextSteps.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
              <Check size={16} className="mt-0.5 flex-shrink-0 text-risk-low" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.45 }}
        className="mt-6 flex flex-col items-center gap-4"
      >
        <a href={auditLink} className="btn-cta w-full sm:w-auto">
          <Calendar size={18} /> Book a Free 15-min AI Audit →
        </a>

        <p className="mt-1 text-xs text-ink-secondary">
          Your offer details are on their way to{' '}
          <span className="font-semibold text-ink">{email}</span>
        </p>

        {/* Share row */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-ink-secondary">
            Share this with your team →
          </span>
          <div className="flex items-center gap-3">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="glass flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
            >
              <Linkedin size={16} className="text-brand-purple" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="glass flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
            >
              <Twitter size={16} className="text-brand-purple" />
            </a>
            <button
              onClick={copyLink}
              aria-label="Copy link"
              className="glass flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
            >
              {copied ? (
                <Check size={16} className="text-risk-low" />
              ) : (
                <Link2 size={16} className="text-brand-purple" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
