'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Search,
  RefreshCw,
  Download,
  Copy,
  Check,
  LogOut,
  Lock,
  X,
  ExternalLink,
  Inbox,
  Link2,
} from 'lucide-react'
import AnimatedNumber from '@/components/AnimatedNumber'
import type { RiskScore, WaitlistSignup } from '@/lib/types'

const LS_KEY = 'complivibe_admin_pw'
const ADMIN_EMAIL = 'admin@complivibe.in'
const WAITLIST_URL = 'https://waitlist.complivibe.in'

type View = 'overview' | 'signups' | 'analytics' | 'settings'

const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'signups', label: 'All Signups', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const RISK_BADGE: Record<RiskScore, { bg: string; color: string; border: string }> = {
  HIGH: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  MEDIUM: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  LOW: { bg: 'rgba(16,185,129,0.15)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
}

const ROLE_FILTERS = ['All Roles', 'CEO', 'CTO', 'CISO', 'Head of Compliance', 'Legal', 'Other']
const RISK_FILTERS = ['All Risk', 'HIGH', 'MEDIUM', 'LOW']

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`
  return new Date(iso).toLocaleDateString()
}

function toCsv(rows: WaitlistSignup[]): string {
  const headers = [
    'Name',
    'Email',
    'Company',
    'Role',
    'Risk',
    'Frameworks',
    'Models',
    'Challenges',
    'Night Regulation',
    'Date',
  ]
  const esc = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`
  const lines = rows.map((r) =>
    [
      r.name,
      r.email,
      r.company,
      r.role,
      r.risk_score,
      (r.frameworks || []).join('; '),
      r.model_count,
      (r.challenges || []).join('; '),
      r.night_regulation || '',
      new Date(r.created_at).toISOString(),
    ]
      .map((v) => esc(String(v)))
      .join(',')
  )
  return [headers.join(','), ...lines].join('\n')
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwInput, setPwInput] = useState('')
  const [shake, setShake] = useState(false)
  const [pwError, setPwError] = useState('')

  const [signups, setSignups] = useState<WaitlistSignup[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [updatedLabel, setUpdatedLabel] = useState('just now')

  const [view, setView] = useState<View>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [riskFilter, setRiskFilter] = useState('All Risk')
  const [copiedEmail, setCopiedEmail] = useState('')
  const [selected, setSelected] = useState<WaitlistSignup | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      setPassword(saved)
      setAuthed(true)
    }
  }, [])

  const fetchSignups = async (pw: string, announce = false) => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/admin/signups', {
        headers: { Authorization: `Bearer ${pw}` },
      })
      if (res.status === 401) {
        localStorage.removeItem(LS_KEY)
        setAuthed(false)
        setPwError('Session expired. Please log in again.')
        return
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setLoadError(data.error || 'Failed to load signups.')
        return
      }
      const data = (await res.json()) as { signups: WaitlistSignup[] }
      setSignups(data.signups || [])
      setUpdatedLabel('just now')
      if (announce) showToast('Data refreshed')
    } catch {
      setLoadError('Network error loading signups.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed && password) fetchSignups(password)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    try {
      const res = await fetch('/api/admin/signups', {
        headers: { Authorization: `Bearer ${pwInput}` },
      })
      if (res.status === 401) {
        setShake(true)
        setPwError('Wrong password')
        setTimeout(() => setShake(false), 500)
        return
      }
      localStorage.setItem(LS_KEY, pwInput)
      setPassword(pwInput)
      setAuthed(true)
      setPwInput('')
    } catch {
      setPwError('Network error. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(LS_KEY)
    setAuthed(false)
    setPassword('')
    setSignups([])
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return signups.filter((s) => {
      if (roleFilter !== 'All Roles' && s.role !== roleFilter) return false
      if (riskFilter !== 'All Risk' && s.risk_score !== riskFilter) return false
      if (q) {
        const hay = `${s.name} ${s.email} ${s.company}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [signups, search, roleFilter, riskFilter])

  const stats = useMemo(
    () => ({
      total: signups.length,
      high: signups.filter((s) => s.risk_score === 'HIGH').length,
      medium: signups.filter((s) => s.risk_score === 'MEDIUM').length,
      low: signups.filter((s) => s.risk_score === 'LOW').length,
    }),
    [signups]
  )

  const todayCount = useMemo(() => {
    const today = new Date().toDateString()
    return signups.filter((s) => new Date(s.created_at).toDateString() === today).length
  }, [signups])

  const daily = useMemo(() => {
    const days: { label: string; count: number }[] = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = d.toDateString()
      const count = signups.filter((s) => new Date(s.created_at).toDateString() === key).length
      days.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), count })
    }
    return days
  }, [signups])

  const exportCsv = () => {
    const csv = toCsv(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `complivibe-signups-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('CSV exported')
  }

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      showToast('Email copied to clipboard')
      setTimeout(() => setCopiedEmail(''), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  const copyWaitlistLink = async () => {
    try {
      await navigator.clipboard.writeText(WAITLIST_URL)
      showToast('Waitlist link copied')
    } catch {
      /* clipboard unavailable */
    }
  }

  // ---------------------------------------------------------------- LOGIN
  if (!authed) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
        <DarkBg />
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative w-full max-w-sm rounded-3xl p-12 ${shake ? 'animate-shake' : ''}`}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <span
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-extrabold text-white"
              style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
            >
              CV
            </span>
            <h1 className="text-[28px] font-bold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-white/50">CompliVibe Admin</p>
          </div>

          <input
            type="password"
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-white outline-none transition-all placeholder:text-white/30"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#5B5FE3'
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(91,95,227,0.15)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            placeholder="Password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
          />

          {pwError && <p className="mt-2 text-sm font-medium text-[#EF4444]">{pwError}</p>}

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)',
              boxShadow: '0 4px 20px rgba(91,95,227,0.35)',
            }}
          >
            <Lock size={16} /> Enter Dashboard
          </button>
        </motion.form>

        <ToastHost toast={toast} />
      </main>
    )
  }

  const viewLabel = NAV.find((n) => n.id === view)?.label ?? 'Overview'

  // ------------------------------------------------------------ DASHBOARD
  return (
    <div className="relative min-h-screen text-white">
      <DarkBg />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col lg:flex"
        style={{ background: '#0F0F1A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <SidebarContent
          view={view}
          setView={setView}
          onLogout={handleLogout}
        />
      </motion.aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col lg:hidden"
              style={{ background: '#0F0F1A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent
                view={view}
                setView={(v) => {
                  setView(v)
                  setSidebarOpen(false)
                }}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:pl-60">
        {/* Header bar */}
        <header
          className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 sm:px-6"
          style={{
            background: 'rgba(10,10,20,0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-white/60 hover:bg-white/5 lg:hidden"
              aria-label="Open menu"
            >
              <LayoutDashboard size={18} />
            </button>
            <p className="text-sm text-white/50">
              Admin <span className="px-1 text-white/25">/</span>
              <span className="text-white/90"> {viewLabel}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-xs text-white/40 sm:inline">
              Last updated: {updatedLabel}
            </span>
            <button
              onClick={() => fetchSignups(password, true)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6">
          {loadError && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
            >
              {loadError}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {(view === 'overview' || view === 'analytics') && (
                <MetricCards stats={stats} todayCount={todayCount} />
              )}

              {(view === 'overview' || view === 'analytics') && (
                <div className="mt-5">
                  <DailyChart data={daily} onCopyLink={copyWaitlistLink} />
                </div>
              )}

              {view === 'analytics' && (
                <div className="mt-5">
                  <RiskDistribution stats={stats} />
                </div>
              )}

              {(view === 'overview' || view === 'signups') && (
                <div className="mt-5">
                  <FilterBar
                    search={search}
                    setSearch={setSearch}
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                    riskFilter={riskFilter}
                    setRiskFilter={setRiskFilter}
                    onExport={exportCsv}
                    onRefresh={() => fetchSignups(password, true)}
                    loading={loading}
                  />
                  <div className="mt-4">
                    <SignupsTable
                      rows={filtered}
                      total={signups.length}
                      loading={loading}
                      copiedEmail={copiedEmail}
                      onCopyEmail={copyEmail}
                      onCopyLink={copyWaitlistLink}
                      onSelect={setSelected}
                    />
                  </div>
                </div>
              )}

              {view === 'settings' && (
                <SettingsPanel onLogout={handleLogout} onCopyLink={copyWaitlistLink} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Detail slide-out */}
      <AnimatePresence>
        {selected && (
          <DetailPanel
            signup={selected}
            onClose={() => setSelected(null)}
            onCopyEmail={copyEmail}
          />
        )}
      </AnimatePresence>

      <ToastHost toast={toast} />
    </div>
  )
}

/* ------------------------------------------------------------------ atoms */

function DarkBg() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(91,95,227,0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 90% 10%, rgba(110,231,183,0.07) 0%, transparent 55%), #0A0A14',
      }}
    />
  )
}

function ToastHost({ toast }: { toast: string }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80]">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white"
            style={{
              background: 'rgba(20,20,32,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
            }}
          >
            <Check size={15} className="text-[#10B981]" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SidebarContent({
  view,
  setView,
  onLogout,
}: {
  view: View
  setView: (v: View) => void
  onLogout: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-white"
          style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
        >
          CV
        </span>
        <span className="text-[15px] font-bold text-white">CompliVibe</span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: 'rgba(91,95,227,0.2)', color: '#A5A8F0' }}
        >
          Admin
        </span>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = view === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              style={{
                background: active ? 'rgba(91,95,227,0.12)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent'
              }}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r"
                  style={{ background: 'linear-gradient(180deg,#5B5FE3,#6EE7B7)' }}
                />
              )}
              <Icon size={17} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mb-2 px-3">
          <p className="text-[11px] text-white/35">Signed in as</p>
          <p className="truncate text-xs font-medium text-white/70">{ADMIN_EMAIL}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </>
  )
}

function MetricCards({
  stats,
  todayCount,
}: {
  stats: { total: number; high: number; medium: number; low: number }
  todayCount: number
}) {
  const cards = [
    {
      value: stats.total,
      label: 'Total Signups',
      color: '#fff',
      accent: 'linear-gradient(180deg,#5B5FE3,#6EE7B7)',
      sub: `↑ ${todayCount} today`,
    },
    {
      value: stats.high,
      label: 'HIGH Risk',
      color: '#EF4444',
      accent: '#EF4444',
      sub: 'Needs immediate attention',
    },
    {
      value: stats.medium,
      label: 'MEDIUM Risk',
      color: '#F59E0B',
      accent: '#F59E0B',
      sub: 'Monitor closely',
    },
    {
      value: stats.low,
      label: 'LOW Risk',
      color: '#10B981',
      accent: '#10B981',
      sub: 'Well positioned',
    },
  ]

  return (
    <motion.div
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {cards.map((c) => (
        <motion.div
          key={c.label}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: c.accent }} />
          <span className="block text-[40px] font-bold leading-none" style={{ color: c.color }}>
            <AnimatedNumber value={c.value} immediate />
          </span>
          <p className="mt-2 text-xs font-medium text-white/50">{c.label}</p>
          <p className="mt-3 text-[11px] text-white/35">{c.sub}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

function DailyChart({
  data,
  onCopyLink,
}: {
  data: { label: string; count: number }[]
  onCopyLink: () => void
}) {
  const total = data.reduce((a, d) => a + d.count, 0)
  const max = Math.max(1, ...data.map((d) => d.count))

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Signups · Last 7 days</h3>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: 'rgba(91,95,227,0.2)', color: '#A5A8F0' }}
        >
          {total} total
        </span>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Inbox size={32} className="text-white/20" />
          <p className="mt-3 text-sm text-white/50">No signups yet</p>
          <button
            onClick={onCopyLink}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#A5A8F0] hover:underline"
          >
            <Link2 size={13} /> Share your waitlist link
          </button>
        </div>
      ) : (
        <div className="flex h-44 items-end justify-between gap-2 sm:gap-4">
          {data.map((d, i) => {
            const h = (d.count / max) * 100
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-white/70">{d.count}</span>
                <div className="flex h-full w-full items-end">
                  <motion.div
                    className="w-full rounded-md"
                    style={{ background: 'linear-gradient(180deg,#6EE7B7,#5B5FE3)' }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(h, 2)}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[11px] text-white/35">{d.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function RiskDistribution({
  stats,
}: {
  stats: { total: number; high: number; medium: number; low: number }
}) {
  const rows: { label: string; count: number; color: string }[] = [
    { label: 'HIGH', count: stats.high, color: '#EF4444' },
    { label: 'MEDIUM', count: stats.medium, color: '#F59E0B' },
    { label: 'LOW', count: stats.low, color: '#10B981' },
  ]
  const total = Math.max(1, stats.total)

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <h3 className="mb-5 text-sm font-semibold text-white">Risk distribution</h3>
      <div className="space-y-4">
        {rows.map((r, i) => {
          const pct = Math.round((r.count / total) * 100)
          return (
            <div key={r.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-semibold" style={{ color: r.color }}>
                  {r.label}
                </span>
                <span className="text-white/50">
                  {r.count} · {pct}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: r.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FilterBar({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  riskFilter,
  setRiskFilter,
  onExport,
  onRefresh,
  loading,
}: {
  search: string
  setSearch: (v: string) => void
  roleFilter: string
  setRoleFilter: (v: string) => void
  riskFilter: string
  setRiskFilter: (v: string) => void
  onExport: () => void
  onRefresh: () => void
  loading: boolean
}) {
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  }
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          className="w-full rounded-[10px] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/30"
          style={inputStyle}
          placeholder="Search by name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <select
        className="rounded-[10px] px-3 py-2.5 text-sm text-white outline-none"
        style={inputStyle}
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        {ROLE_FILTERS.map((r) => (
          <option key={r} className="bg-[#14141F]">
            {r}
          </option>
        ))}
      </select>
      <select
        className="rounded-[10px] px-3 py-2.5 text-sm text-white outline-none"
        style={inputStyle}
        value={riskFilter}
        onChange={(e) => setRiskFilter(e.target.value)}
      >
        {RISK_FILTERS.map((r) => (
          <option key={r} className="bg-[#14141F]">
            {r}
          </option>
        ))}
      </select>
      <button
        onClick={onExport}
        className="flex items-center justify-center gap-1.5 rounded-[10px] px-4 py-2.5 text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
      >
        <Download size={14} /> Export CSV
      </button>
      <button
        onClick={onRefresh}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white/70"
        style={inputStyle}
        aria-label="Refresh"
      >
        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
      </button>
    </div>
  )
}

function SignupsTable({
  rows,
  total,
  loading,
  copiedEmail,
  onCopyEmail,
  onCopyLink,
  onSelect,
}: {
  rows: WaitlistSignup[]
  total: number
  loading: boolean
  copiedEmail: string
  onCopyEmail: (email: string) => void
  onCopyLink: () => void
  onSelect: (s: WaitlistSignup) => void
}) {
  const headers = [
    '#',
    'Name',
    'Email',
    'Company',
    'Role',
    'Risk',
    'Frameworks',
    'Models',
    'Challenges',
    'Night Regulation',
    'Date',
  ]

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="thin-scroll max-h-[60vh] overflow-auto">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr style={{ background: 'rgba(91,95,227,0.15)', borderBottom: '1px solid rgba(91,95,227,0.2)' }}>
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase"
                  style={{ letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', background: '#15131f' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <Inbox size={26} className="text-white/30" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-white">
                      {loading ? 'Loading signups…' : total === 0 ? 'No signups yet' : 'No matches'}
                    </p>
                    <p className="mt-1 text-sm text-white/40">
                      {total === 0
                        ? 'Share waitlist.complivibe.in to start collecting signups'
                        : 'Try adjusting your search or filters'}
                    </p>
                    {total === 0 && !loading && (
                      <button
                        onClick={onCopyLink}
                        className="mt-4 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
                      >
                        <Link2 size={14} /> Copy Waitlist Link
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((s, i) => {
                const badge = RISK_BADGE[s.risk_score]
                return (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i, 25) * 0.04 }}
                    onClick={() => onSelect(s)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-4 py-3 text-white/30">{i + 1}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-white/90">{s.name}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onCopyEmail(s.email)
                        }}
                        className="flex items-center gap-1.5 font-mono text-xs text-[#A5A8F0] hover:underline"
                        title="Click to copy"
                      >
                        {s.email}
                        {copiedEmail === s.email ? (
                          <Check size={12} className="text-[#10B981]" />
                        ) : (
                          <Copy size={12} className="opacity-40" />
                        )}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(s.company)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-white/85 hover:text-white hover:underline"
                      >
                        {s.company}
                        <ExternalLink size={10} className="opacity-40" />
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/70">{s.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                        style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
                      >
                        {s.risk_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50">{(s.frameworks || []).join(', ') || '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/50">{s.model_count}</td>
                    <td className="px-4 py-3 text-white/50">{(s.challenges || []).join(', ') || '—'}</td>
                    <td className="max-w-[220px] px-4 py-3 text-white/50">
                      <span className="line-clamp-2">{s.night_regulation || '—'}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/40">
                      {relativeTime(s.created_at)}
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <div
        className="px-4 py-3 text-xs text-white/40"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        Showing {rows.length} of {total} signups
      </div>
    </div>
  )
}

function SettingsPanel({
  onLogout,
  onCopyLink,
}: {
  onLogout: () => void
  onCopyLink: () => void
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <div
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-sm font-semibold text-white">Account</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Signed in as</span>
            <span className="text-sm font-medium text-white/90">{ADMIN_EMAIL}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Password</span>
            <span className="text-sm font-medium text-white/90">
              Set via <span className="font-mono text-xs text-[#A5A8F0]">ADMIN_PASSWORD</span>
            </span>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-sm font-semibold text-white">Waitlist</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-sm text-white/70">{WAITLIST_URL}</span>
          <button
            onClick={onCopyLink}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#5B5FE3,#6EE7B7)' }}
          >
            <Link2 size={13} /> Copy Link
          </button>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#EF4444] transition-colors hover:bg-[#EF4444]/10"
        style={{ border: '1px solid rgba(239,68,68,0.3)' }}
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  )
}

function DetailPanel({
  signup,
  onClose,
  onCopyEmail,
}: {
  signup: WaitlistSignup
  onClose: () => void
  onCopyEmail: (email: string) => void
}) {
  const badge = RISK_BADGE[signup.risk_score]
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: 'Waitlist ID',
      value: <span className="font-mono text-[#A5A8F0]">{signup.waitlist_id || '—'}</span>,
    },
    { label: 'Name', value: signup.name },
    {
      label: 'Email',
      value: (
        <button
          onClick={() => onCopyEmail(signup.email)}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#A5A8F0] hover:underline"
        >
          {signup.email} <Copy size={12} className="opacity-50" />
        </button>
      ),
    },
    { label: 'Company', value: signup.company },
    { label: 'Role', value: signup.role },
    { label: 'Models', value: signup.model_count },
    { label: 'Frameworks', value: (signup.frameworks || []).join(', ') || '—' },
    { label: 'Challenges', value: (signup.challenges || []).join(', ') || '—' },
    { label: 'Night Regulation', value: signup.night_regulation || '—' },
    { label: 'Signed up', value: new Date(signup.created_at).toLocaleString() },
  ]

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="fixed inset-y-0 right-0 z-[70] w-full max-w-md overflow-y-auto p-7 text-white"
        style={{
          background: '#0F0F1A',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
              Signup detail
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">{signup.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-5">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
          >
            {signup.risk_score} RISK
          </span>
        </div>

        <dl className="space-y-3">
          {rows.map((r) => (
            <div key={r.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="pb-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                {r.label}
              </dt>
              <dd className="mt-0.5 text-sm text-white/85">{r.value}</dd>
            </div>
          ))}
        </dl>

        {signup.risk_gaps && signup.risk_gaps.length > 0 && (
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
              Critical gaps
            </p>
            <ul className="mt-2 space-y-2">
              {signup.risk_gaps.map((g, i) => (
                <li
                  key={i}
                  className="rounded-lg px-3 py-2 text-sm text-white/85"
                  style={{ background: badge.bg, border: `1px solid ${badge.border}` }}
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.aside>
    </>
  )
}
