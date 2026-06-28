'use client'

import { motion } from 'framer-motion'
import type { RiskScore } from '@/lib/types'

const COLORS: Record<RiskScore, string> = {
  HIGH: '#EF4444',
  MEDIUM: '#F59E0B',
  LOW: '#10B981',
}

interface Props {
  score: RiskScore
  percentage: number
}

/** Animated circular risk gauge (SVG arc fills from 0 → percentage). */
export default function ScoreMeter({ score, percentage }: Props) {
  const r = 54
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const color = COLORS[score]

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8" />
      <motion.circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        transform="rotate(-90 70 70)"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <text x="70" y="64" textAnchor="middle" fontSize="11" fill="#6B7280" fontWeight="500">
        RISK
      </text>
      <motion.text
        x="70"
        y="88"
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fill={color}
        initial={{ opacity: 0, scale: 1.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.4 }}
        style={{ transformOrigin: '70px 82px' }}
      >
        {score}
      </motion.text>
    </svg>
  )
}
