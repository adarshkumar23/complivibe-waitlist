'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Lock } from 'lucide-react'
import RiskScore from '../RiskScore'
import MagneticButton from '../MagneticButton'
import {
  FRAMEWORK_OPTIONS,
  CHALLENGE_OPTIONS,
  ROLE_OPTIONS,
  MODEL_COUNT_OPTIONS,
  MODEL_COUNT_LABELS,
  type RiskScore as RiskScoreType,
  type Tier,
  type WaitlistApiResponse,
} from '@/lib/types'

const STEPS = ['About you', 'Your situation', 'Your risk']

interface FormState {
  name: string
  email: string
  company: string
  role: string
  frameworks: string[]
  modelCount: string
  challenges: string[]
  nightRegulation: string
}

const EMPTY: FormState = {
  name: '',
  email: '',
  company: '',
  role: '',
  frameworks: [],
  modelCount: '',
  challenges: [],
  nightRegulation: '',
}

type Phase = 'form' | 'loading' | 'result'

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 60 : -60, opacity: 0, scale: 0.98 }),
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center">
      {STEPS.map((label, i) => {
        const active = i <= step
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                animate={
                  active
                    ? { background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)', color: '#fff', scale: 1 }
                    : { background: 'rgba(255,255,255,0.3)', color: '#9CA3AF', scale: 1 }
                }
                transition={{ duration: 0.3 }}
                style={{ border: active ? 'none' : '1px solid rgba(255,255,255,0.4)' }}
              >
                {i + 1}
              </motion.div>
              <span
                className={`mt-1.5 hidden text-[11px] font-semibold sm:block ${
                  active ? 'text-brand-purple' : 'text-ink-secondary'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                <motion.div
                  className="h-full"
                  initial={false}
                  animate={{ width: i < step ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                  style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= text.length) return
    const t = setTimeout(() => setN((v) => v + 1), 35)
    return () => clearTimeout(t)
  }, [n, text])
  return <>{text.slice(0, n)}</>
}

const ANALYZING_LINES = [
  'Scanning your AI governance posture...',
  'Mapping regulatory exposure...',
  'Calculating risk profile...',
]

/** Reveals each analysis line in sequence (0.5s apart), typed out. */
function AnalyzingSequence() {
  const [shown, setShown] = useState(1)
  useEffect(() => {
    if (shown >= ANALYZING_LINES.length) return
    const t = setTimeout(() => setShown((s) => s + 1), 500)
    return () => clearTimeout(t)
  }, [shown])

  return (
    <div className="mt-7 space-y-2">
      {ANALYZING_LINES.slice(0, shown).map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-ink"
        >
          <Typewriter text={line} />
        </motion.p>
      ))}
    </div>
  )
}

export default function WaitlistForm() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [phase, setPhase] = useState<Phase>('form')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    score: RiskScoreType
    gaps: string[]
    waitlistId?: string
    tier?: Tier
  } | null>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const go = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const step1Valid =
    form.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.company.trim() &&
    form.role
  const step2Valid = form.modelCount

  async function handleSubmit() {
    setError('')
    setPhase('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as WaitlistApiResponse

      await new Promise((r) => setTimeout(r, 1800)) // let the analysis play

      if (!res.ok || !data.success || !data.riskScore || !data.gaps) {
        setError(data.error || 'Something went wrong. Please try again.')
        setPhase('form')
        return
      }
      setResult({
        score: data.riskScore,
        gaps: data.gaps,
        waitlistId: data.waitlistId,
        tier: data.tier,
      })
      setPhase('result')
    } catch {
      setError('Network error. Please check your connection and try again.')
      setPhase('form')
    }
  }

  return (
    <section id="waitlist" className="relative px-4 py-14 sm:px-8 sm:py-28">
      <div className="relative z-10 mx-auto max-w-[640px]">
        <div className="glass-strong overflow-hidden p-5 sm:p-10">
          <AnimatePresence mode="wait">
            {phase === 'result' && result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <RiskScore
                  score={result.score}
                  gaps={result.gaps}
                  email={form.email}
                  waitlistId={result.waitlistId}
                  tier={result.tier}
                />
              </motion.div>
            ) : phase === 'loading' ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                {/* CSS gradient spinner */}
                <div
                  className="h-12 w-12 animate-spin rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(91,95,227,0), #5B5FE3, #6EE7B7)',
                    WebkitMask:
                      'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
                    mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
                  }}
                />
                <AnalyzingSequence />
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="mb-7 text-center">
                  <p className="eyebrow mb-2">Get Early Access</p>
                  <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    Join the waitlist. Get your risk score.
                  </h2>
                  <p className="mt-2 text-ink-secondary">
                    Takes 2 minutes. Instant personalized AI compliance risk score.
                  </p>
                </div>

                <ProgressBar step={step} />

                {error && (
                  <div className="mb-5 rounded-xl bg-risk-high/10 px-4 py-3 text-sm font-medium text-risk-high">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <AnimatePresence mode="wait" custom={dir}>
                    {step === 0 && (
                      <motion.div
                        key="s1"
                        custom={dir}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="space-y-4"
                      >
                        <Field label="Full name">
                          <input
                            className="glass-input"
                            placeholder="Jane Doe"
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                          />
                        </Field>
                        <Field label="Work email">
                          <input
                            type="email"
                            className="glass-input"
                            placeholder="jane@company.com"
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                          />
                        </Field>
                        <Field label="Company name">
                          <input
                            className="glass-input"
                            placeholder="Acme AI"
                            value={form.company}
                            onChange={(e) => set('company', e.target.value)}
                          />
                        </Field>
                        <Field label="Role">
                          <div className="flex flex-wrap gap-2">
                            {ROLE_OPTIONS.map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => set('role', r)}
                                className={`pill ${form.role === r ? 'pill-active' : ''}`}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        </Field>

                        <button
                          type="button"
                          disabled={!step1Valid}
                          onClick={() => go(1)}
                          className="btn-cta mt-2 w-full"
                        >
                          Continue →
                        </button>
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div
                        key="s2"
                        custom={dir}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="space-y-6"
                      >
                        <Field label="Which frameworks matter to your company?">
                          <div className="flex flex-wrap gap-2">
                            {FRAMEWORK_OPTIONS.map((f) => (
                              <button
                                key={f}
                                type="button"
                                onClick={() => set('frameworks', toggle(form.frameworks, f))}
                                className={`pill ${
                                  form.frameworks.includes(f) ? 'pill-active' : ''
                                }`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </Field>

                        <Field label="How many AI models does your company run?">
                          <select
                            className="glass-input cursor-pointer"
                            value={form.modelCount}
                            onChange={(e) => set('modelCount', e.target.value)}
                          >
                            <option value="" disabled>
                              Select range…
                            </option>
                            {MODEL_COUNT_OPTIONS.map((m) => (
                              <option key={m} value={m}>
                                {MODEL_COUNT_LABELS[m]}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label="What's your biggest AI governance challenge right now?">
                          <div className="flex flex-wrap gap-2">
                            {CHALLENGE_OPTIONS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => set('challenges', toggle(form.challenges, c))}
                                className={`pill ${
                                  form.challenges.includes(c) ? 'pill-active' : ''
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </Field>

                        <div className="flex gap-3">
                          <button type="button" onClick={() => go(0)} className="btn-ghost flex-1">
                            ← Back
                          </button>
                          <button
                            type="button"
                            disabled={!step2Valid}
                            onClick={() => go(2)}
                            className="btn-cta flex-[2]"
                          >
                            Almost there →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="s3"
                        custom={dir}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="space-y-4"
                      >
                        <Field label="What regulation is keeping your team up at night?">
                          <textarea
                            className="glass-input resize-none"
                            rows={3}
                            maxLength={200}
                            placeholder="e.g. We're expanding to EU and have no idea if our AI models qualify as high-risk under the EU AI Act..."
                            value={form.nightRegulation}
                            onChange={(e) => set('nightRegulation', e.target.value)}
                          />
                          <p className="mt-1 text-right text-xs text-ink-secondary">
                            {form.nightRegulation.length} / 200
                          </p>
                        </Field>

                        <MagneticButton
                          onClick={handleSubmit}
                          className="btn-cta h-14 w-full text-lg"
                        >
                          Calculate My Risk Score →
                        </MagneticButton>

                        <button
                          type="button"
                          onClick={() => go(1)}
                          className="w-full text-center text-sm text-ink-secondary hover:text-brand-purple"
                        >
                          ← Back
                        </button>

                        <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-ink-secondary">
                          <Lock size={12} /> No spam. No sales calls. Your data stays with CompliVibe.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-ink">{label}</label>
      {children}
    </div>
  )
}
