'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  /** Max tilt in degrees (default 12). */
  max?: number
  style?: React.CSSProperties
}

/**
 * 3D tilt-on-hover with a cursor-following glare. Spring-damped so it
 * feels weighty, not twitchy. Apply to glass cards.
 */
export default function TiltCard({ children, className, max = 12, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 })
  const springGlare = useSpring(glareX, { stiffness: 200, damping: 25 })

  const glareBg = useMotionTemplate`radial-gradient(circle at ${springGlare}% 40%, rgba(255,255,255,0.25), transparent 55%)`

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    rotateX.set((0.5 - y) * max)
    rotateY.set((x - 0.5) * max)
    glareX.set(x * 100)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
        ...style,
      }}
      className={`relative ${className ?? ''}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        style={{ background: glareBg }}
      />
      {children}
    </motion.div>
  )
}
