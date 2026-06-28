'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  to: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
  /** Start immediately on mount instead of waiting for scroll-in. */
  immediate?: boolean
}

/** Animated number count-up; triggers on scroll into view (or immediately). */
export default function Counter({
  to,
  duration = 1600,
  className,
  suffix = '',
  prefix = '',
  immediate = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    if (!immediate && !inView) return
    started.current = true

    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, immediate, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}
