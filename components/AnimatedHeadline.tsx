'use client'

import { motion } from 'framer-motion'

interface Props {
  /** Lines of text; each renders on its own row. */
  lines: React.ReactNode[][]
  /** Base delay before the first word (seconds). */
  baseDelay?: number
  perWord?: number
  className?: string
}

/**
 * Cinematic word-by-word headline reveal (y + rotateX). Each entry in
 * `lines` is an array of word nodes — pass a <span className="gradient-text">
 * for words that need the brand gradient.
 */
export default function AnimatedHeadline({
  lines,
  baseDelay = 0.4,
  perWord = 0.06,
  className,
}: Props) {
  let index = 0
  return (
    <h1 className={className} style={{ perspective: 800 }}>
      {lines.map((words, li) => (
        <span key={li} className="block">
          {words.map((word, wi) => {
            const delay = baseDelay + index * perWord
            index += 1
            return (
              <motion.span
                key={wi}
                style={{ display: 'inline-block', marginRight: '0.25em' }}
                initial={{ opacity: 0, y: 40, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {word}
              </motion.span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}
