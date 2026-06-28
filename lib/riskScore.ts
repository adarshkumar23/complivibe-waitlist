import type { RiskScore } from './types'

export function calculateRiskScore(data: {
  frameworks: string[]
  modelCount: string
  challenges: string[]
}): { score: RiskScore; gaps: string[] } {
  const gaps: string[] = []
  let riskPoints = 0

  // No frameworks selected = maximum risk
  if (data.frameworks.length === 0) {
    riskPoints += 4
    gaps.push('No compliance framework mapped — you have zero regulatory coverage')
  }

  // EU AI Act not selected but they should know about it
  if (!data.frameworks.includes('EU AI Act')) {
    riskPoints += 1
    gaps.push(
      'EU AI Act enforcement begins August 2026 — high-risk systems face fines up to €35M'
    )
  }

  // Model count risk
  if (data.modelCount === '50+') {
    riskPoints += 3
    gaps.push('50+ AI models with no unified inventory is a critical governance gap')
  } else if (data.modelCount === '20-50') {
    riskPoints += 2
    gaps.push('20-50 models without a model registry creates untracked liability')
  } else if (data.modelCount === '6-20') {
    riskPoints += 1
  }

  // Challenges risk
  if (data.challenges.includes('No model inventory')) {
    riskPoints += 2
    gaps.push(
      'No model inventory means you cannot prove what AI systems exist or what data they use'
    )
  }
  if (data.challenges.includes('No bias testing')) {
    riskPoints += 2
    gaps.push('Bias testing gaps expose you to discrimination lawsuits — 3 filed in 2024 alone')
  }
  if (data.challenges.includes('No compliance framework')) {
    riskPoints += 2
    gaps.push('Operating AI without a compliance framework is the #1 cause of regulatory action')
  }
  if (data.challenges.includes('No observability')) {
    riskPoints += 1
    gaps.push(
      'No drift or hallucination monitoring means incidents go undetected until they are lawsuits'
    )
  }
  if (data.challenges.includes('Multiple tools not unified')) {
    riskPoints += 1
    gaps.push(
      'Fragmented tooling creates audit evidence gaps that regulators specifically look for'
    )
  }

  // Determine score
  let score: RiskScore
  if (riskPoints >= 4) score = 'HIGH'
  else if (riskPoints >= 2) score = 'MEDIUM'
  else score = 'LOW'

  // Always return exactly 3 gaps, fill with defaults if needed
  const defaultGaps = [
    'No unified AI trust layer means compliance evidence is scattered across tools',
    'ISO 42001 absent at 95%+ of AI companies — early movers gain regulatory advantage',
    'DPDP enforcement is active — Indian AI companies need documented data governance now',
  ]

  while (gaps.length < 3) {
    const next = defaultGaps.find((g) => !gaps.includes(g))
    if (next) gaps.push(next)
    else break
  }

  return { score, gaps: gaps.slice(0, 3) }
}
