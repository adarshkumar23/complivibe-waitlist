'use client'

import RevealOnScroll from '../RevealOnScroll'
import TiltCard from '../TiltCard'

const BENEFITS = [
  {
    icon: '🎁',
    title: '3 Months Free',
    desc: 'Full platform access, zero charge, from day one of launch. No credit card during trial.',
  },
  {
    icon: '🔍',
    title: 'Free AI Compliance Audit',
    desc: 'A $2,000 value. Our team reviews your AI systems and delivers a gap report within 48 hours of your signup.',
  },
  {
    icon: '🔒',
    title: 'Founder Pricing. Forever.',
    desc: 'Your waitlist price is locked. When we raise prices (and we will), you pay the same rate you locked in today.',
  },
  {
    icon: '📞',
    title: 'Direct Founder Access',
    desc: 'Onboard directly with Adarsh. Not a sales rep. Not a ticket queue. The founder.',
  },
]

export default function EarlyBenefits() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="relative z-10 mx-auto max-w-5xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">What You Get</p>
          <h2 className="section-headline text-ink">
            Waitlist members get things nobody else will.
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <RevealOnScroll
              key={b.title}
              delay={(i % 2) * 0.12}
              direction={i % 2 === 0 ? 'left' : 'right'}
              className="h-full"
            >
              <TiltCard className="glass flex h-full gap-5 p-7" max={8}>
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/50 text-2xl">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">{b.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-secondary">{b.desc}</p>
                </div>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
