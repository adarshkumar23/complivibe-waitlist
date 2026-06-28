'use client'

import { motion, useInView, type Variants } from 'framer-motion'
import { useRef } from 'react'

type Direction = 'up' | 'left' | 'right' | 'scale'

interface Props {
  children: React.ReactNode
  delay?: number
  direction?: Direction
  className?: string
}

const VARIANTS: Record<Direction, Variants> = {
  up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
}

/** Premium scroll reveal — used for every section. */
export default function RevealOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      variants={VARIANTS[direction]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
