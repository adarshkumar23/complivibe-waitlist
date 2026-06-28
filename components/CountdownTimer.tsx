'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const TARGET = Date.UTC(2026, 6, 15, 0, 0, 0) // July 15, 2026 00:00:00 UTC

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function getTimeLeft(): TimeLeft {
  const diff = TARGET - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { days, hours, minutes, seconds, expired: false }
}

const pad = (n: number) => String(n).padStart(2, '0')

interface Props {
  variant?: 'inline' | 'block'
  className?: string
}

export default function CountdownTimer({ variant = 'block', className = '' }: Props) {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  // Avoid hydration mismatch — render placeholder until mounted
  if (!time) {
    return (
      <span className={className} aria-hidden>
        {variant === 'inline' ? '—d —h —m —s' : ''}
      </span>
    )
  }

  if (time.expired) {
    return <span className={`font-extrabold gradient-text ${className}`}>LIVE NOW 🚀</span>
  }

  if (variant === 'inline') {
    return (
      <span className={`font-bold tabular-nums text-ink ${className}`}>
        {time.days}d {pad(time.hours)}h {pad(time.minutes)}m {pad(time.seconds)}s
      </span>
    )
  }

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Min', value: time.minutes },
    { label: 'Sec', value: time.seconds },
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          <div className="glass flex min-w-[44px] flex-col items-center px-2 py-1.5 sm:min-w-[52px] sm:px-2.5 sm:py-2">
            <motion.span
              key={u.value}
              initial={{ scale: 1.15, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-extrabold tabular-nums text-ink sm:text-2xl"
            >
              {pad(u.value)}
            </motion.span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-secondary">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && <span className="text-lg font-bold text-brand-purple/40">:</span>}
        </div>
      ))}
    </div>
  )
}
