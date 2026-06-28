'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'

const FALLBACK = 847

/**
 * Live waitlist counter — counts up from 0 to the real Supabase count,
 * re-fetches every 30s, and floats a "+1" when the number grows.
 */
export default function LiveCounter({ className }: { className?: string }) {
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 18 })
  const [display, setDisplay] = useState(0)
  const [bump, setBump] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(Math.round(v)))
    return () => unsub()
  }, [spring])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const res = await fetch('/api/waitlist/count', { cache: 'no-store' })
        const data = (await res.json()) as { count: number }
        if (!active) return
        const next = typeof data.count === 'number' ? data.count : FALLBACK
        if (next > prev.current && prev.current !== 0) setBump((b) => b + 1)
        prev.current = next
        mv.set(next)
      } catch {
        if (prev.current === 0) mv.set(FALLBACK)
      }
    }

    load()
    const id = setInterval(load, 30_000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [mv])

  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      {display.toLocaleString()}
      <AnimatePresence>
        {bump > 0 && (
          <motion.span
            key={bump}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -22, scale: 1 }}
            exit={{ opacity: 0, y: -34 }}
            transition={{ duration: 0.8 }}
            className="absolute -right-7 top-0 text-sm font-bold text-risk-low"
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
