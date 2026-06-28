'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Props {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  /** Pull strength 0–1 (default 0.3). */
  strength?: number
}

/**
 * Magnetic hover — the element drifts toward the cursor with spring
 * physics, then snaps back on leave. Renders as <a> when `href` is set,
 * otherwise <button>. Falls back to no pull when reduced motion is on.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  type = 'button',
  disabled,
  strength = 0.3,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const common = {
    ref: ref as never,
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: reset,
    whileTap: { scale: 0.97 },
    className,
  }

  if (href) {
    return (
      <motion.a href={href} {...common}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} {...common}>
      {children}
    </motion.button>
  )
}
