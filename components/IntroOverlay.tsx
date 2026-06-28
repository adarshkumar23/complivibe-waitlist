'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const FLAG = 'complivibe_intro_seen'

/** Fast 0.8s branded splash — once per session only. */
export default function IntroOverlay() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem(FLAG)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (seen || prefersReduced) return
    sessionStorage.setItem(FLAG, '1')
    setShow(true)
    const t = setTimeout(() => setShow(false), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#EEF0FF,#F5F0FF,#E8F4FF)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <motion.div
            className="flex items-center gap-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
              style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
            >
              CV
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-ink">
              Compli<span className="gradient-text">Vibe</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
