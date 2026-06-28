export type RiskScore = 'HIGH' | 'MEDIUM' | 'LOW'

export type Role =
  | 'CEO'
  | 'CTO'
  | 'CISO'
  | 'Head of Compliance'
  | 'Legal'
  | 'Other'

export type ModelCount = '1-5' | '6-20' | '20-50' | '50+'

export const MODEL_COUNT_LABELS: Record<ModelCount, string> = {
  '1-5': '1–5 models',
  '6-20': '6–20 models',
  '20-50': '20–50 models',
  '50+': '50+ models',
}

export const FRAMEWORK_OPTIONS = [
  'EU AI Act',
  'DPDP Act',
  'ISO 42001',
  'NIST AI RMF',
  'SOC 2',
  'Colorado AI Act',
  'Other',
] as const

export const CHALLENGE_OPTIONS = [
  'No model inventory',
  'No bias testing',
  'No compliance framework',
  'No observability',
  'Multiple tools not unified',
  "Don't know where to start",
] as const

export const ROLE_OPTIONS: Role[] = [
  'CEO',
  'CTO',
  'CISO',
  'Head of Compliance',
  'Legal',
  'Other',
]

export const MODEL_COUNT_OPTIONS: ModelCount[] = ['1-5', '6-20', '20-50', '50+']

/** Shape submitted by the client form / accepted by the API. */
export interface WaitlistInput {
  name: string
  email: string
  company: string
  role: string
  frameworks: string[]
  modelCount: string
  challenges: string[]
  nightRegulation?: string
}

/** Tier a signup locks in (derived from model footprint). */
export type Tier = 'Starter' | 'Growth' | 'Enterprise'

/** Row as stored in / read from Supabase. */
export interface WaitlistSignup {
  id: string
  waitlist_id: string | null
  name: string
  email: string
  company: string
  role: string
  frameworks: string[]
  model_count: string
  challenges: string[]
  night_regulation: string | null
  risk_score: RiskScore
  risk_gaps: string[]
  created_at: string
}

export interface WaitlistApiResponse {
  success: boolean
  riskScore?: RiskScore
  gaps?: string[]
  waitlistId?: string
  tier?: Tier
  error?: string
}

/** Map a model-count token to the tier that signup locks in. */
export function tierFromModelCount(modelCount: string): Tier {
  if (modelCount === '50+') return 'Enterprise'
  if (modelCount === '20-50' || modelCount === '6-20') return 'Growth'
  return 'Starter'
}
