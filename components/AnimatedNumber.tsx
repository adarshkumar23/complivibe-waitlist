'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
  /** Slightly slower for big dramatic figures. */
  immediate?: boolean
}

/** Counts up from 0 to `value` (easeOutExpo) on scroll into view. */
export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  duration = 1500,
  className,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const [displayed, setDisplayed] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    if (!immediate && !isInView) return
    started.current = true

    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayed(Math.floor(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, immediate, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayed.toLocaleString()}
      {suffix}
    </span>
  )
}
