import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import IntroOverlay from '@/components/IntroOverlay'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://waitlist.complivibe.in'),
  title: 'CompliVibe — AI Trust Infrastructure',
  description: 'The trust layer for every AI system you ship.',
  keywords: [
    'AI compliance',
    'AI governance',
    'AI observability',
    'EU AI Act',
    'ISO 42001',
    'DPDP',
    'NIST AI RMF',
    'AI trust layer',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'CompliVibe — AI Trust Infrastructure',
    description: 'Join the waitlist. Get your AI compliance risk score.',
    url: 'https://waitlist.complivibe.in',
    siteName: 'CompliVibe',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CompliVibe — AI Trust Infrastructure',
    description: 'Join the waitlist. Get your AI compliance risk score.',
  },
}

export const viewport: Viewport = {
  themeColor: '#EEF0FF',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <SmoothScroll />
        <IntroOverlay />
        {children}
      </body>
    </html>
  )
}
