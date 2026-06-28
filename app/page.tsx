import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Ticker from '@/components/Ticker'
import FomoToast from '@/components/FomoToast'
import Hero from '@/components/sections/Hero'
import Stakes from '@/components/sections/Stakes'
import WhatWeDo from '@/components/sections/WhatWeDo'
import FrameworkGrid from '@/components/sections/FrameworkGrid'
import SocialProof from '@/components/sections/SocialProof'
import PricingTeaser from '@/components/sections/PricingTeaser'
import EarlyBenefits from '@/components/sections/EarlyBenefits'
import WaitlistForm from '@/components/sections/WaitlistForm'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated gradient mesh background + drifting blobs */}
      <div className="mesh-bg fixed inset-0 -z-10" />
      <div
        className="mesh-blob fixed animate-floaty"
        style={{ width: 500, height: 500, top: -100, left: -120, background: '#5B5FE3' }}
      />
      <div
        className="mesh-blob fixed animate-floaty"
        style={{
          width: 420,
          height: 420,
          top: '40%',
          right: -120,
          background: '#6EE7B7',
          animationDelay: '2s',
        }}
      />
      <div
        className="mesh-blob fixed animate-floaty"
        style={{
          width: 380,
          height: 380,
          bottom: -120,
          left: '30%',
          background: '#A78BFA',
          animationDelay: '4s',
        }}
      />

      <Navbar />

      <div className="relative z-10">
        <Hero />
        <Ticker />
        <Stakes />
        <WhatWeDo />
        <FrameworkGrid />
        <SocialProof />
        <PricingTeaser />
        <EarlyBenefits />
        <WaitlistForm />
        <Footer />
      </div>

      <FomoToast />
    </main>
  )
}
