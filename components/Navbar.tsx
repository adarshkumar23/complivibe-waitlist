'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
        borderColor: scrolled ? 'rgba(91,95,227,0.12)' : 'rgba(255,255,255,0.2)',
      }}
      transition={{ duration: 0.3 }}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-8">
        <motion.a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="CompliVibe home"
          animate={{ scale: scrolled ? 0.95 : 1 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'left center' }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-[9px] text-sm font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
          >
            CV
          </span>
          <span className="text-[19px] font-extrabold tracking-tight text-ink">
            Compli<span className="gradient-text">Vibe</span>
          </span>
        </motion.a>

        <a
          href="#waitlist"
          className="text-sm font-semibold text-ink-secondary transition-colors hover:text-brand-purple"
        >
          Already signed up? →
        </a>
      </nav>
    </motion.header>
  )
}
