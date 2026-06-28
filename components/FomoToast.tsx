'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const MESSAGES = [
  'Ramp AI just joined the waitlist',
  'A fintech company from Bangalore just signed up',
  'A CISO from Mumbai just joined',
  'Healthcare AI startup joined from Delhi',
  'A Series A SaaS company just signed up',
  'An AI lab from Hyderabad just joined',
  'A legal-tech founder just signed up',
]

/** Subtle social-proof toasts, bottom-right, every 45–90s. */
export default function FomoToast() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let dismissTimer: ReturnType<typeof setTimeout>
    let i = 0

    const schedule = () => {
      const delay = 45_000 + Math.random() * 45_000 // 45–90s
      return setTimeout(() => {
        // pseudo-random pick that still varies
        i = (i + 1 + Math.floor(Math.random() * 2)) % MESSAGES.length
        setMessage(MESSAGES[i])
        dismissTimer = setTimeout(() => setMessage(null), 4000)
        loopTimer = schedule()
      }, delay)
    }

    let loopTimer = schedule()
    return () => {
      clearTimeout(loopTimer)
      clearTimeout(dismissTimer)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] left-4 sm:left-auto sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="glass-strong pointer-events-auto flex w-full items-center gap-3 px-4 py-3 sm:max-w-xs sm:w-auto"
          >
            <CheckCircle2 size={18} className="flex-shrink-0 text-risk-low" />
            <p className="text-sm font-medium text-ink">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
