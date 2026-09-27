import { useState } from 'react'

type Screen =
  | 'onboarding'
  | 'home'
  | 'transactions'
  | 'accounts'
  | 'add'
  | 'goals'
  | 'analytics'
  | 'budget'
  | 'profile'

// ─── DATA ────────────────────────────────────────────────────────────────────

const TRANSACTIONS = [
  { id: 1, type: 'expense' as const, desc: 'Supermercado Jumbo', cat: 'Alimentación', amount: 85000, date: '30 Ago', emoji: '🛒' },
  { id: 2, type: 'income' as const, desc: 'Salario Agosto', cat: 'Trabajo', amount: 3500000, date: '29 Ago', emoji: '💼' },
  { id: 3, type: 'expense' as const, desc: 'Netflix', cat: 'Entretenimiento', amount: 22900, date: '28 Ago', emoji: '🎬' },
  { id: 4, type: 'expense' as const, desc: 'Gasolina Copec', cat: 'Transporte', amount: 65000, date: '27 Ago', emoji: '⛽' },
  { id: 5, type: 'income' as const, desc: 'Freelance diseño', cat: 'Extra', amount: 450000, date: '26 Ago', emoji: '🎨' },
  { id: 6, type: 'expense' as const, desc: 'Restaurant El Hoyo', cat: 'Restaurantes', amount: 45000, date: '25 Ago', emoji: '🍽️' },
  { id: 7, type: 'expense' as const, desc: 'Spotify Premium', cat: 'Entretenimiento', amount: 12900, date: '24 Ago', emoji: '🎵' },
  { id: 8, type: 'expense' as const, desc: 'Farmacia Cruz Verde', cat: 'Salud', amount: 28500, date: '23 Ago', emoji: '💊' },
  { id: 9, type: 'income' as const, desc: 'Dividendos ETF', cat: 'Inversiones', amount: 125000, date: '22 Ago', emoji: '📈' },
  { id: 10, type: 'expense' as const, desc: 'Ropa Zara', cat: 'Ropa', amount: 189000, date: '21 Ago', emoji: '👕' },
]

const ACCOUNTS = [
  { id: 1, name: 'Banco de Chile Ahorro', type: 'Cuenta de Ahorro', balance: 4250000, color: '#00D4AA', last: '4521' },
  { id: 2, name: 'Santander Corriente', type: 'Cuenta Corriente', balance: 1820000, color: '#FFB347', last: '8834' },
  { id: 3, name: 'Mach', type: 'Cuenta Digital', balance: 380000, color: '#A78BFA', last: '2291' },
  { id: 4, name: 'Portafolio ETF', type: 'Inversiones', balance: 8650000, color: '#FF5A7E', last: '—' },
]

const GOALS = [
  { id: 1, name: 'Viaje a Europa', target: 12000000, saved: 4800000, color: '#00D4AA', emoji: '✈️', deadline: 'Jun 2027' },
  { id: 2, name: 'Fondo de Emergencia', target: 6000000, saved: 5100000, color: '#FFB347', emoji: '🛡️', deadline: 'Dic 2026' },
  { id: 3, name: 'MacBook Pro M4', target: 9500000, saved: 2850000, color: '#A78BFA', emoji: '💻', deadline: 'Mar 2027' },
  { id: 4, name: 'Cursos de Inglés', target: 1800000, saved: 900000, color: '#FF5A7E', emoji: '📚', deadline: 'Nov 2026' },
]

const CATEGORIES = [
  { name: 'Alimentación', budget: 600000, spent: 385000, color: '#00D4AA', emoji: '🛒' },
  { name: 'Transporte', budget: 300000, spent: 215000, color: '#FFB347', emoji: '🚗' },
  { name: 'Entretenimiento', budget: 200000, spent: 188000, color: '#A78BFA', emoji: '🎬' },
  { name: 'Salud', budget: 150000, spent: 85000, color: '#FF5A7E', emoji: '💊' },
  { name: 'Restaurantes', budget: 250000, spent: 195000, color: '#60A5FA', emoji: '🍽️' },
  { name: 'Hogar', budget: 400000, spent: 120000, color: '#34D399', emoji: '🏠' },
]

const MONTHLY = [
  { m: 'Mar', inc: 3.5, exp: 1.8 },
  { m: 'Abr', inc: 3.5, exp: 2.1 },
  { m: 'May', inc: 3.95, exp: 1.95 },
  { m: 'Jun', inc: 3.5, exp: 2.3 },
  { m: 'Jul', inc: 4.0, exp: 1.7 },
  { m: 'Ago', inc: 3.95, exp: 2.16 },
]

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n.toLocaleString('es-CL')}`
}

// ─── STATUS BAR ──────────────────────────────────────────────────────────────

function StatusBar() {
  const now = new Date()
  const time = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false })
  return (
    <div style={{ paddingTop: '28px' }} className="flex items-center justify-between px-6 pb-1">
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#f0f6ff', fontWeight: 600 }}>{time}</span>
      <div className="flex items-center gap-1.5">
        <div className="flex gap-px items-end" style={{ height: '12px' }}>
          {[3, 4, 5, 5].map((h, i) => (
            <div key={i} style={{ width: '2px', height: `${h * 2}px`, background: 'white', borderRadius: '1px', opacity: 0.85 }} />
          ))}
        </div>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
          <rect x="0.5" y="0.5" width="15" height="10" rx="2" stroke="white" strokeOpacity="0.8" />
          <rect x="16" y="3.5" width="1.5" height="4" rx="0.75" fill="white" fillOpacity="0.4" />
          <rect x="1.5" y="1.5" width="11" height="8" rx="1" fill="white" />
        </svg>
      </div>
    </div>
  )
}

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? '#00D4AA' : '#6B7A99'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function WalletIcon({ active }: { active: boolean }) {
  const c = active ? '#00D4AA' : '#6B7A99'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
      <path d="M16 3l-8 4" />
      <circle cx="17" cy="14" r="1.5" fill={c} stroke="none" />
    </svg>
  )
}

function TargetIcon({ active }: { active: boolean }) {
  const c = active ? '#00D4AA' : '#6B7A99'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  const c = active ? '#00D4AA' : '#6B7A99'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

const NAV: { id: Screen; label: string; icon: 'home' | 'wallet' | 'plus' | 'target' | 'user' }[] = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'accounts', label: 'Cuentas', icon: 'wallet' },
  { id: 'add', label: '', icon: 'plus' },
  { id: 'goals', label: 'Metas', icon: 'target' },
  { id: 'profile', label: 'Perfil', icon: 'user' },
]

function BottomNav({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <div
      className="flex items-center justify-around px-1"
      style={{
        height: '80px',
        background: 'linear-gradient(to top, #060B16 75%, rgba(6,11,22,0.9) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {NAV.map((item) => {
        if (item.icon === 'plus') {
          return (
            <button
              key="add"
              onClick={() => setScreen('add')}
              className="flex items-center justify-center rounded-full transition-transform active:scale-90"
              style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #00D4AA 0%, #00A882 100%)',
                boxShadow: '0 4px 20px rgba(0,212,170,0.45)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )
        }
        const active = screen === item.id
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className="flex flex-col items-center gap-1 py-2 px-4 transition-all active:scale-90"
          >
            {item.icon === 'home' && <HomeIcon active={active} />}
            {item.icon === 'wallet' && <WalletIcon active={active} />}
            {item.icon === 'target' && <TargetIcon active={active} />}
            {item.icon === 'user' && <UserIcon active={active} />}
            <span style={{ fontSize: '10px', fontWeight: 500, color: active ? '#00D4AA' : '#6B7A99' }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── SCREEN 1: ONBOARDING ────────────────────────────────────────────────────

function Onboarding({ onStart }: { onStart: () => void }) {
  const [page, setPage] = useState(0)
  const slides = [
    { emoji: '📊', title: 'Visión clara de tu dinero', desc: 'Todos tus ingresos y gastos en un solo lugar, presentados de forma simple e intuitiva.' },
    { emoji: '🎯', title: 'Alcanza tus metas', desc: 'Define objetivos de ahorro y sigue tu progreso paso a paso hasta lograrlos.' },
    { emoji: '💡', title: 'Decisiones más inteligentes', desc: 'Analiza tus hábitos financieros y descubre oportunidades de mejora cada mes.' },
  ]
  const slide = slides[page]

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ background: 'linear-gradient(160deg, #060B16 0%, #0D1A36 55%, #060B16 100%)' }}
    >
      {/* Skip */}
      {page < 2 && (
        <button
          onClick={onStart}
          className="absolute top-16 right-6 text-sm font-medium"
          style={{ color: '#6B7A99' }}
        >
          Omitir
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-7 pt-16">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00D4AA, #00A882)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '20px', color: '#F0F6FF' }}>FinSight</span>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 gap-10">
        <div
          className="flex items-center justify-center rounded-3xl relative"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(0,212,170,0.06)',
            border: '1px solid rgba(0,212,170,0.15)',
          }}
        >
          <div
            className="absolute rounded-3xl"
            style={{ inset: '16px', border: '1px solid rgba(0,212,170,0.08)' }}
          />
          <div
            className="absolute rounded-2xl"
            style={{ inset: '32px', border: '1px solid rgba(0,212,170,0.05)' }}
          />
          <span style={{ fontSize: '72px' }}>{slide.emoji}</span>
        </div>

        <div className="text-center flex flex-col gap-3">
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '26px', color: '#F0F6FF', lineHeight: 1.2 }}>
            {slide.title}
          </h1>
          <p style={{ fontSize: '15px', color: '#6B7A99', lineHeight: 1.6 }}>{slide.desc}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center items-center gap-2 pb-6">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setPage(i)}
            className="rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === page ? '24px' : '6px',
              height: '6px',
              background: i === page ? '#00D4AA' : 'rgba(107,122,153,0.35)',
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="px-7 pb-12">
        <button
          onClick={page < 2 ? () => setPage((p) => p + 1) : onStart}
          className="w-full flex items-center justify-center rounded-2xl transition-all active:scale-[0.97]"
          style={{
            height: '56px',
            background: 'linear-gradient(135deg, #00D4AA 0%, #00A882 100%)',
            boxShadow: '0 4px 28px rgba(0,212,170,0.35)',
            fontFamily: 'Outfit',
            fontWeight: 700,
            fontSize: '16px',
            color: 'white',
          }}
        >
          {page < 2 ? 'Continuar' : 'Comenzar ahora'}
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN 2: HOME / DASHBOARD ──────────────────────────────────────────────

function Home({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [visible, setVisible] = useState(true)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #00D4AA, #00A882)', fontFamily: 'Outfit', fontWeight: 700, fontSize: '14px', color: 'white' }}
          >
            VT
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6B7A99' }}>Buenos días,</p>
            <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '15px', color: '#F0F6FF' }}>Valentina</p>
          </div>
        </div>
        <button
          className="flex items-center justify-center rounded-full relative"
          style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div style={{ position: 'absolute', top: '9px', right: '9px', width: '8px', height: '8px', borderRadius: '50%', background: '#FF5A7E', border: '1.5px solid #060B16' }} />
        </button>
      </div>

      {/* Balance card */}
      <div
        className="mx-5 mb-5 rounded-3xl relative overflow-hidden"
        style={{
          minHeight: '384px',
          background: 'linear-gradient(145deg, #0C1C38 0%, #09213F 60%, #0B1A30 100%)',
          border: '1px solid rgba(0,212,170,0.2)',
        }}
      >
        {/* Glow blobs — pointer-events:none so they never steal clicks */}
        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.22) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,150,212,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* All interactive content sits above the blobs */}
        <div style={{ position: 'relative', zIndex: 1, padding: '24px 24px 22px' }}>

          {/* Label + eye toggle */}
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: '12px', color: '#6B7A99', letterSpacing: '0.06em', fontWeight: 500 }}>BALANCE TOTAL</span>
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.08)', cursor: 'pointer' }}
            >
              {visible ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9BACC0" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9BACC0" strokeWidth="2" strokeLinecap="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
              <span style={{ fontSize: '11px', color: '#9BACC0', fontWeight: 500 }}>{visible ? 'Ocultar' : 'Mostrar'}</span>
            </button>
          </div>

          {/* Main balance — lineHeight 1.15 prevents clipping at top */}
          <div className="flex items-baseline gap-2 mb-2">
            <span
              style={{
                fontFamily: 'Outfit',
                fontWeight: 800,
                fontSize: '52px',
                color: '#F0F6FF',
                letterSpacing: '-2px',
                lineHeight: 1.15,
                display: 'block',
              }}
            >
              {visible ? '$15.1M' : '•  •  •  •  •'}
            </span>
            {visible && (
              <span style={{ fontSize: '15px', color: '#00D4AA', fontWeight: 600 }}>CLP</span>
            )}
          </div>

          {/* Monthly change badge */}
          <div className="flex items-center gap-2 mb-5">
            <span
              className="rounded-full flex items-center gap-1"
              style={{ padding: '3px 10px', background: 'rgba(0,212,170,0.14)', fontSize: '11px', color: '#00D4AA', fontWeight: 600 }}
            >
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round">
                <line x1="6" y1="10" x2="6" y2="2" /><polyline points="2 6 6 2 10 6" />
              </svg>
              {visible ? '+$1.91M este mes' : '••••••'}
            </span>
            <span style={{ fontSize: '11px', color: '#6B7A99' }}>vs. julio 2026</span>
          </div>

          {/* Sparkline — ahorro neto mensual (Mar–Ago) */}
          <div style={{ height: '52px', marginBottom: '16px' }}>
            <svg width="100%" height="52" viewBox="0 0 342 52" preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,26 C 28,26 54,38 68,38 C 90,38 114,14 137,14 C 160,14 182,44 205,44 C 228,44 250,4 274,4 C 298,4 320,22 342,22 L 342,52 L 0,52 Z"
                fill="url(#sg)"
                opacity={visible ? 1 : 0.15}
              />
              <path
                d="M 0,26 C 28,26 54,38 68,38 C 90,38 114,14 137,14 C 160,14 182,44 205,44 C 228,44 250,4 274,4 C 298,4 320,22 342,22"
                fill="none"
                stroke="#00D4AA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={visible ? 1 : 0.15}
              />
              {['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'].map((m, i) => (
                <text key={m} x={i === 0 ? 8 : i === 5 ? 334 : i * 68.4} y="51" fill="#6B7A99" fontSize="8" fontFamily="Inter" textAnchor={i === 0 ? 'start' : i === 5 ? 'end' : 'middle'}>
                  {m}
                </text>
              ))}
            </svg>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '18px' }} />

          {/* Income / Expense chips */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-2xl p-3.5" style={{ background: 'rgba(0,212,170,0.08)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center justify-center rounded-full" style={{ width: '18px', height: '18px', background: 'rgba(0,212,170,0.2)' }}>
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="6" y1="10" x2="6" y2="2" /><polyline points="2 6 6 2 10 6" />
                  </svg>
                </div>
                <span style={{ fontSize: '11px', color: '#00D4AA', fontWeight: 500 }}>Ingresos</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: '16px', color: '#F0F6FF' }}>
                {visible ? '$4.07M' : '••••'}
              </span>
            </div>
            <div className="flex-1 rounded-2xl p-3.5" style={{ background: 'rgba(255,90,126,0.08)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center justify-center rounded-full" style={{ width: '18px', height: '18px', background: 'rgba(255,90,126,0.2)' }}>
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#FF5A7E" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="6" y1="2" x2="6" y2="10" /><polyline points="10 6 6 10 2 6" />
                  </svg>
                </div>
                <span style={{ fontSize: '11px', color: '#FF5A7E', fontWeight: 500 }}>Gastos</span>
              </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: '16px', color: '#F0F6FF' }}>
              {visible ? '$2.16M' : '••••'}
            </span>
          </div>
        </div>
        </div>{/* end inner content wrapper */}
      </div>{/* end balance card */}

      {/* Quick actions */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { emoji: '📤', label: 'Transferir', action: undefined },
            { emoji: '📊', label: 'Análisis', action: () => setScreen('analytics') },
            { emoji: '🎯', label: 'Metas', action: () => setScreen('goals') },
            { emoji: '📋', label: 'Presupuesto', action: () => setScreen('budget') },
          ].map(({ emoji, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontSize: '20px' }}>{emoji}</span>
              <span style={{ fontSize: '10px', fontWeight: 500, color: '#6B7A99' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="px-5 pb-28">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '16px', color: '#F0F6FF' }}>Recientes</h2>
          <button onClick={() => setScreen('transactions')} style={{ fontSize: '13px', color: '#00D4AA', fontWeight: 500 }}>
            Ver todo
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {TRANSACTIONS.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-2xl"
              style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: '40px', height: '40px', fontSize: '20px', background: tx.type === 'income' ? 'rgba(0,212,170,0.1)' : 'rgba(255,90,126,0.1)' }}
              >
                {tx.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: '14px', fontWeight: 500, color: '#F0F6FF' }}>{tx.desc}</p>
                <p style={{ fontSize: '11px', color: '#6B7A99' }}>{tx.cat} · {tx.date}</p>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: '13px', color: tx.type === 'income' ? '#00D4AA' : '#FF5A7E', flexShrink: 0 }}>
                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN 3: TRANSACTIONS ──────────────────────────────────────────────────

function Transactions({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [search, setSearch] = useState('')

  const filtered = TRANSACTIONS.filter((t) => {
    if (filter === 'income' && t.type !== 'income') return false
    if (filter === 'expense' && t.type !== 'expense') return false
    if (search && !t.desc.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalIncome = TRANSACTIONS.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = TRANSACTIONS.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      <div className="flex items-center gap-3 px-5 pt-2 pb-4">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center justify-center rounded-xl"
          style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0F6FF" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', color: '#F0F6FF' }}>Movimientos</h1>
      </div>

      {/* Summary */}
      <div className="px-5 mb-4 flex gap-3">
        <div className="flex-1 p-3 rounded-2xl" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.14)' }}>
          <p style={{ fontSize: '10px', color: '#00D4AA', marginBottom: '2px' }}>Total ingresos</p>
          <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '16px', color: '#F0F6FF' }}>+{fmt(totalIncome)}</p>
        </div>
        <div className="flex-1 p-3 rounded-2xl" style={{ background: 'rgba(255,90,126,0.08)', border: '1px solid rgba(255,90,126,0.14)' }}>
          <p style={{ fontSize: '10px', color: '#FF5A7E', marginBottom: '2px' }}>Total gastos</p>
          <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '16px', color: '#F0F6FF' }}>-{fmt(totalExpense)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-3 px-4 rounded-2xl" style={{ height: '44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar movimiento..."
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: '14px', color: '#F0F6FF' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {(['all', 'income', 'expense'] as const).map((f) => {
            const labels = { all: 'Todos', income: 'Ingresos', expense: 'Gastos' }
            const active = filter === f
            const activeBg = f === 'income' ? 'rgba(0,212,170,0.15)' : f === 'expense' ? 'rgba(255,90,126,0.15)' : '#00D4AA'
            const activeColor = f === 'all' ? '#060B16' : f === 'income' ? '#00D4AA' : '#FF5A7E'
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-1 rounded-xl transition-all"
                style={{
                  height: '36px',
                  fontSize: '12px',
                  fontWeight: 500,
                  background: active ? activeBg : 'rgba(255,255,255,0.04)',
                  color: active ? activeColor : '#6B7A99',
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {labels[f]}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div className="px-5 pb-10 flex flex-col gap-2">
        {filtered.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 rounded-2xl"
            style={{ padding: '13px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: '44px', height: '44px', fontSize: '22px', background: tx.type === 'income' ? 'rgba(0,212,170,0.1)' : 'rgba(255,90,126,0.1)' }}
            >
              {tx.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: '14px', fontWeight: 500, color: '#F0F6FF' }}>{tx.desc}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="rounded-full px-2 py-0.5" style={{ fontSize: '10px', color: '#6B7A99', background: 'rgba(255,255,255,0.06)' }}>{tx.cat}</span>
                <span style={{ fontSize: '11px', color: '#6B7A99' }}>{tx.date}</span>
              </div>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: '13px', color: tx.type === 'income' ? '#00D4AA' : '#FF5A7E', flexShrink: 0 }}>
              {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <span style={{ fontSize: '40px' }}>🔍</span>
            <p style={{ fontSize: '14px', color: '#6B7A99' }}>Sin resultados</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SCREEN 4: ACCOUNTS ──────────────────────────────────────────────────────

function Accounts({ setScreen }: { setScreen: (s: Screen) => void }) {
  const total = ACCOUNTS.reduce((s, a) => s + a.balance, 0)

  // Donut chart via stroke-dasharray
  const r = 54
  const circ = 2 * Math.PI * r
  const GAP = 6
  let offset = 0
  const segs = ACCOUNTS.map((a) => {
    const dash = (a.balance / total) * (circ - GAP * ACCOUNTS.length)
    const seg = { ...a, dash, offset }
    offset += dash + GAP
    return seg
  })

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      <div className="flex items-center justify-between px-5 pt-2 pb-4">
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', color: '#F0F6FF' }}>Mis Cuentas</h1>
        <button
          className="flex items-center justify-center rounded-xl"
          style={{ width: '36px', height: '36px', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Donut + legend */}
      <div className="px-5 mb-5 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
            {segs.map((s, i) => (
              <circle
                key={i}
                cx="70" cy="70" r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="16"
                strokeDasharray={`${s.dash} ${circ - s.dash}`}
                strokeDashoffset={-s.offset}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
              />
            ))}
            <text x="70" y="65" textAnchor="middle" fill="#F0F6FF" fontSize="13" fontWeight="700" fontFamily="Outfit">$15.1M</text>
            <text x="70" y="81" textAnchor="middle" fill="#6B7A99" fontSize="10" fontFamily="Inter">patrimonio</text>
          </svg>
        </div>
        <div className="flex flex-col gap-2.5">
          {ACCOUNTS.map((a) => (
            <div key={a.id} className="flex items-center gap-2">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#F0F6FF', lineHeight: 1.2 }}>{a.name}</p>
                <p style={{ fontSize: '10px', color: '#6B7A99' }}>{((a.balance / total) * 100).toFixed(1)}% · {fmt(a.balance)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account cards */}
      <div className="px-5 pb-28 flex flex-col gap-3">
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#6B7A99', letterSpacing: '0.06em', marginBottom: '4px' }}>CUENTAS VINCULADAS</p>
        {ACCOUNTS.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-2xl"
            style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: '44px', height: '44px', background: `${a.color}14` }}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: a.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#F0F6FF' }}>{a.name}</p>
              <p style={{ fontSize: '11px', color: '#6B7A99' }}>{a.type} · ****{a.last}</p>
            </div>
            <div className="text-right">
              <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: '14px', color: '#F0F6FF' }}>{fmt(a.balance)}</p>
              <p style={{ fontSize: '10px', color: '#00D4AA' }}>+2.1%</p>
            </div>
          </div>
        ))}
        <button
          onClick={() => setScreen('budget')}
          className="flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-[0.97] mt-1"
          style={{ height: '44px', background: 'rgba(0,212,170,0.07)', border: '1px solid rgba(0,212,170,0.2)', fontSize: '13px', fontWeight: 500, color: '#00D4AA' }}
        >
          Ver presupuesto por categoría
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN 5: ADD TRANSACTION ────────────────────────────────────────────────

function AddTransaction({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')

  const expCats = [
    { e: '🛒', l: 'Alimentación' }, { e: '🚗', l: 'Transporte' }, { e: '🎬', l: 'Ocio' },
    { e: '💊', l: 'Salud' }, { e: '🍽️', l: 'Restaurantes' }, { e: '🏠', l: 'Hogar' }, { e: '👕', l: 'Ropa' }, { e: '📱', l: 'Tech' },
  ]
  const incCats = [
    { e: '💼', l: 'Salario' }, { e: '🎨', l: 'Freelance' }, { e: '📈', l: 'Inversión' },
    { e: '🎁', l: 'Regalo' }, { e: '🏦', l: 'Intereses' }, { e: '💸', l: 'Otro' }, { e: '🏘️', l: 'Arriendo' }, { e: '📦', l: 'Venta' },
  ]
  const cats = type === 'expense' ? expCats : incCats

  const tap = (d: string) => {
    if (d === '⌫') { setAmount((p) => p.slice(0, -1)); return }
    if (amount.length >= 9) return
    setAmount((p) => p + d)
  }

  const displayAmount = amount
    ? `$${parseInt(amount).toLocaleString('es-CL')}`
    : '$0'

  const accent = type === 'expense' ? '#FF5A7E' : '#00D4AA'
  const accentBg = type === 'expense' ? 'rgba(255,90,126,0.12)' : 'rgba(0,212,170,0.12)'

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      <div className="flex items-center gap-3 px-5 pt-2 pb-4">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center justify-center rounded-xl"
          style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F0F6FF" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', color: '#F0F6FF' }}>Nuevo movimiento</h1>
      </div>

      {/* Type toggle */}
      <div className="mx-5 mb-5 rounded-2xl p-1 flex" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className="flex-1 rounded-xl transition-all"
            style={{
              height: '40px',
              fontFamily: 'Outfit',
              fontWeight: 600,
              fontSize: '14px',
              background: type === t ? (t === 'expense' ? '#FF5A7E' : '#00D4AA') : 'transparent',
              color: type === t ? 'white' : '#6B7A99',
            }}
          >
            {t === 'expense' ? '↓  Gasto' : '↑  Ingreso'}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className="text-center mb-6 px-5">
        <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '48px', color: '#F0F6FF', letterSpacing: '-2px' }}>
          {displayAmount}
        </p>
        <p style={{ fontSize: '12px', color: '#6B7A99', marginTop: '4px' }}>Pesos Chilenos (CLP)</p>
      </div>

      {/* Numpad */}
      <div className="px-8 mb-5 grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((d) => (
          <button
            key={d}
            onClick={() => tap(d)}
            className="flex items-center justify-center rounded-2xl transition-all active:scale-90"
            style={{ height: '52px', background: 'rgba(255,255,255,0.05)', fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: '18px', color: '#F0F6FF' }}
          >
            {d === '⌫' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F0F6FF" strokeWidth="2" strokeLinecap="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" /><line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            ) : d}
          </button>
        ))}
      </div>

      {/* Category */}
      <div className="px-5 mb-5">
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#6B7A99', letterSpacing: '0.06em', marginBottom: '12px' }}>CATEGORÍA</p>
        <div className="grid grid-cols-4 gap-2">
          {cats.map((c) => {
            const active = category === c.l
            return (
              <button
                key={c.l}
                onClick={() => setCategory(c.l)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all"
                style={{
                  background: active ? accentBg : 'rgba(255,255,255,0.04)',
                  border: active ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontSize: '20px' }}>{c.e}</span>
                <span style={{ fontSize: '9px', color: active ? '#F0F6FF' : '#6B7A99', textAlign: 'center', lineHeight: 1.2 }}>{c.l}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Description input */}
      <div className="px-5 mb-6">
        <input
          placeholder="Descripción (opcional)"
          className="w-full outline-none bg-transparent rounded-2xl px-4"
          style={{ height: '44px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.04)', fontSize: '14px', color: '#F0F6FF' }}
        />
      </div>

      {/* Save */}
      <div className="px-5 pb-10">
        <button
          className="w-full flex items-center justify-center rounded-2xl transition-all active:scale-[0.97]"
          style={{
            height: '56px',
            background: type === 'expense' ? 'linear-gradient(135deg, #FF5A7E, #D93D65)' : 'linear-gradient(135deg, #00D4AA, #00A882)',
            boxShadow: type === 'expense' ? '0 4px 24px rgba(255,90,126,0.3)' : '0 4px 24px rgba(0,212,170,0.3)',
            fontFamily: 'Outfit',
            fontWeight: 700,
            fontSize: '16px',
            color: 'white',
          }}
        >
          Guardar movimiento
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN 6: GOALS ─────────────────────────────────────────────────────────

function Goals({ setScreen: _setScreen }: { setScreen: (s: Screen) => void }) {
  const totalSaved = GOALS.reduce((s, g) => s + g.saved, 0)
  const totalTarget = GOALS.reduce((s, g) => s + g.target, 0)
  const pct = Math.round((totalSaved / totalTarget) * 100)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      <div className="flex items-center justify-between px-5 pt-2 pb-4">
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', color: '#F0F6FF' }}>Metas de Ahorro</h1>
        <button
          className="flex items-center justify-center rounded-xl"
          style={{ width: '36px', height: '36px', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Overall summary */}
      <div className="mx-5 mb-5 p-5 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p style={{ fontSize: '12px', color: '#6B7A99', marginBottom: '4px' }}>Total ahorrado</p>
            <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '32px', color: '#F0F6FF', letterSpacing: '-1px' }}>{fmt(totalSaved)}</p>
          </div>
          <div className="text-right">
            <p style={{ fontSize: '12px', color: '#6B7A99', marginBottom: '4px' }}>Meta total</p>
            <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '20px', color: '#6B7A99' }}>{fmt(totalTarget)}</p>
          </div>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: '8px', background: 'rgba(255,255,255,0.07)' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: '9999px', background: 'linear-gradient(90deg, #00D4AA, #00A882)' }} />
        </div>
        <p style={{ fontSize: '12px', color: '#00D4AA', marginTop: '8px' }}>{pct}% del objetivo total alcanzado</p>
      </div>

      {/* Goals list */}
      <div className="px-5 pb-28 flex flex-col gap-3">
        {GOALS.map((g) => {
          const gPct = Math.round((g.saved / g.target) * 100)
          return (
            <div
              key={g.id}
              className="p-4 rounded-3xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: '44px', height: '44px', fontSize: '22px', background: `${g.color}14` }}
                >
                  {g.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '15px', color: '#F0F6FF' }}>{g.name}</p>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: '13px', color: g.color }}>{gPct}%</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#6B7A99' }}>Vence: {g.deadline}</p>
                </div>
              </div>
              <div className="rounded-full overflow-hidden mb-2" style={{ height: '6px', background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ width: `${gPct}%`, height: '100%', borderRadius: '9999px', background: g.color }} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 600, color: '#F0F6FF' }}>{fmt(g.saved)}</span>
                  <span style={{ fontSize: '11px', color: '#6B7A99', margin: '0 4px' }}>de</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#6B7A99' }}>{fmt(g.target)}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#6B7A99' }}>Faltan {fmt(g.target - g.saved)}</span>
              </div>
            </div>
          )
        })}
        <button
          className="flex items-center justify-center gap-2 rounded-3xl transition-all active:scale-[0.97]"
          style={{ height: '56px', border: '1.5px dashed rgba(0,212,170,0.3)', color: '#00D4AA', background: 'rgba(0,212,170,0.04)', fontSize: '14px', fontFamily: 'Outfit', fontWeight: 600 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva meta de ahorro
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN 7: ANALYTICS ─────────────────────────────────────────────────────

function Analytics({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m')
  const data = period === '3m' ? MONTHLY.slice(-3) : MONTHLY
  const maxVal = Math.max(...data.map((m) => Math.max(m.inc, m.exp)))

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      <div className="flex items-center gap-3 px-5 pt-2 pb-4">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center justify-center rounded-xl"
          style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0F6FF" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', color: '#F0F6FF' }}>Análisis</h1>
      </div>

      {/* Period selector */}
      <div className="px-5 mb-5 flex gap-2">
        {(['3m', '6m', '1y'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="rounded-xl px-4 transition-all"
            style={{
              height: '32px',
              fontSize: '12px',
              fontWeight: 500,
              background: period === p ? '#00D4AA' : 'rgba(255,255,255,0.05)',
              color: period === p ? '#060B16' : '#6B7A99',
            }}
          >
            {p === '3m' ? '3 meses' : p === '6m' ? '6 meses' : '1 año'}
          </button>
        ))}
      </div>

      {/* Key metrics */}
      <div className="px-5 mb-5 grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.14)' }}>
          <p style={{ fontSize: '10px', color: '#00D4AA', marginBottom: '6px' }}>Ahorro neto</p>
          <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '24px', color: '#F0F6FF' }}>$1.91M</p>
          <p style={{ fontSize: '11px', color: '#00D4AA', marginTop: '4px' }}>↑ +12% vs anterior</p>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '10px', color: '#6B7A99', marginBottom: '6px' }}>Tasa de ahorro</p>
          <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '24px', color: '#F0F6FF' }}>48.3%</p>
          <p style={{ fontSize: '11px', color: '#6B7A99', marginTop: '4px' }}>de ingresos totales</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="mx-5 mb-5 p-4 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', color: '#F0F6FF' }}>Ingresos vs Gastos</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D4AA' }} />
              <span style={{ fontSize: '10px', color: '#6B7A99' }}>Ingreso</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5A7E' }} />
              <span style={{ fontSize: '10px', color: '#6B7A99' }}>Gasto</span>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3" style={{ height: '120px' }}>
          {data.map((m) => (
            <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end" style={{ height: '100px' }}>
                <div
                  className="flex-1 rounded-t-md"
                  style={{ height: `${(m.inc / maxVal) * 100}%`, background: 'rgba(0,212,170,0.75)' }}
                />
                <div
                  className="flex-1 rounded-t-md"
                  style={{ height: `${(m.exp / maxVal) * 100}%`, background: 'rgba(255,90,126,0.75)' }}
                />
              </div>
              <span style={{ fontSize: '9px', color: '#6B7A99' }}>{m.m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mx-5 mb-5 p-4 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', color: '#F0F6FF', marginBottom: '16px' }}>Gastos por categoría</p>
        <div className="flex flex-col gap-3.5">
          {CATEGORIES.slice(0, 5).map((c) => {
            const p = Math.round((c.spent / c.budget) * 100)
            const isHigh = p >= 88
            return (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '14px' }}>{c.emoji}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#F0F6FF' }}>{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#6B7A99' }}>{fmt(c.spent)}</span>
                    <span style={{ fontSize: '10px', color: isHigh ? '#FF5A7E' : '#6B7A99' }}>{p}%</span>
                  </div>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ width: `${Math.min(p, 100)}%`, height: '100%', borderRadius: '9999px', background: isHigh ? '#FF5A7E' : c.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ height: '112px' }} />
    </div>
  )
}

// ─── SCREEN 8: BUDGET ────────────────────────────────────────────────────────

function Budget({ setScreen }: { setScreen: (s: Screen) => void }) {
  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0)
  const totalSpent = CATEGORIES.reduce((s, c) => s + c.spent, 0)
  const remaining = totalBudget - totalSpent
  const overallPct = Math.round((totalSpent / totalBudget) * 100)
  const isNearLimit = overallPct >= 80

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      <div className="flex items-center gap-3 px-5 pt-2 pb-4">
        <button
          onClick={() => setScreen('accounts')}
          className="flex items-center justify-center rounded-xl"
          style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0F6FF" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', color: '#F0F6FF' }}>Presupuesto</h1>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between px-5 mb-5">
        <button style={{ padding: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '16px', color: '#F0F6FF' }}>Agosto 2026</p>
        <button style={{ padding: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" strokeWidth="2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Overall */}
      <div className="mx-5 mb-5 p-5 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p style={{ fontSize: '12px', color: '#6B7A99', marginBottom: '4px' }}>Gastado</p>
            <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', color: '#F0F6FF', letterSpacing: '-0.5px' }}>{fmt(totalSpent)}</p>
          </div>
          <div className="text-right">
            <p style={{ fontSize: '12px', color: '#6B7A99', marginBottom: '4px' }}>Disponible</p>
            <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '22px', color: '#00D4AA' }}>{fmt(remaining)}</p>
          </div>
        </div>
        <div className="rounded-full overflow-hidden mb-2" style={{ height: '8px', background: 'rgba(255,255,255,0.07)' }}>
          <div style={{
            width: `${overallPct}%`, height: '100%', borderRadius: '9999px',
            background: isNearLimit ? 'linear-gradient(90deg, #FFB347, #FF5A7E)' : 'linear-gradient(90deg, #00D4AA, #00A882)',
          }} />
        </div>
        <div className="flex items-center justify-between">
          <p style={{ fontSize: '11px', color: '#6B7A99' }}>{overallPct}% del presupuesto mensual</p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#6B7A99' }}>de {fmt(totalBudget)}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 pb-28 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '15px', color: '#F0F6FF' }}>Por categoría</p>
          <button style={{ fontSize: '13px', color: '#00D4AA', fontWeight: 500 }}>Editar</button>
        </div>
        {CATEGORIES.map((c) => {
          const p = Math.round((c.spent / c.budget) * 100)
          const isOver = p >= 88
          return (
            <div
              key={c.name}
              className="p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${isOver ? 'rgba(255,90,126,0.2)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: '38px', height: '38px', fontSize: '18px', background: `${c.color}12` }}
                >
                  {c.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#F0F6FF' }}>{c.name}</p>
                    {isOver && (
                      <span className="rounded-full px-2" style={{ fontSize: '9px', fontWeight: 600, background: 'rgba(255,90,126,0.15)', color: '#FF5A7E', padding: '2px 8px' }}>
                        Casi límite
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 600, color: '#F0F6FF' }}>{fmt(c.spent)}</span>
                    <span style={{ fontSize: '11px', color: '#6B7A99' }}>de {fmt(c.budget)}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: '5px', background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ width: `${Math.min(p, 100)}%`, height: '100%', borderRadius: '9999px', background: isOver ? '#FF5A7E' : c.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SCREEN 9: PROFILE ───────────────────────────────────────────────────────

function Profile() {
  const settings = [
    { emoji: '🔔', label: 'Notificaciones', detail: 'Activadas' },
    { emoji: '🔒', label: 'Seguridad', detail: 'Face ID' },
    { emoji: '💳', label: 'Cuentas vinculadas', detail: '4 cuentas' },
    { emoji: '🌙', label: 'Tema', detail: 'Oscuro' },
    { emoji: '📤', label: 'Exportar datos', detail: 'CSV / PDF' },
    { emoji: '❓', label: 'Ayuda y soporte', detail: '' },
    { emoji: '📋', label: 'Términos y privacidad', detail: '' },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <StatusBar />

      <div className="px-5 pt-2 pb-4">
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', color: '#F0F6FF' }}>Mi Perfil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 py-4 px-5 mb-4">
        <div
          className="relative flex items-center justify-center rounded-2xl"
          style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #00D4AA, #00A882)', fontFamily: 'Outfit', fontWeight: 700, fontSize: '26px', color: 'white' }}
        >
          VT
          <button
            className="absolute flex items-center justify-center rounded-lg"
            style={{ bottom: '-6px', right: '-6px', width: '26px', height: '26px', background: '#0D1526', border: '2px solid #060B16' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '20px', color: '#F0F6FF' }}>Valentina Torres</p>
          <p style={{ fontSize: '13px', color: '#6B7A99', marginTop: '2px' }}>vale.torres@gmail.com</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full px-3 py-1" style={{ fontSize: '12px', fontWeight: 500, background: 'rgba(0,212,170,0.1)', color: '#00D4AA' }}>
            ✦ Premium
          </span>
          <span className="rounded-full px-3 py-1" style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: '#6B7A99' }}>
            Desde Ene 2024
          </span>
        </div>
      </div>

      {/* Stats */}
      <div
        className="mx-5 mb-5 p-4 rounded-2xl flex"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {[
          { label: 'Cuentas', value: '4' },
          { label: 'Metas', value: '4' },
          { label: 'Movimientos', value: '247' },
        ].map((s, i, arr) => (
          <div
            key={s.label}
            className="flex-1 flex flex-col items-center gap-1"
            style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
          >
            <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', color: '#F0F6FF' }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: '#6B7A99' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Settings list */}
      <div className="px-5 pb-28 flex flex-col gap-2">
        {settings.map((s) => (
          <button
            key={s.label}
            className="flex items-center gap-3 rounded-2xl w-full text-left transition-all active:scale-[0.98]"
            style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span style={{ fontSize: '20px', width: '28px' }}>{s.emoji}</span>
            <span className="flex-1" style={{ fontSize: '14px', fontWeight: 500, color: '#F0F6FF' }}>{s.label}</span>
            {s.detail && <span style={{ fontSize: '12px', color: '#6B7A99' }}>{s.detail}</span>}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
        <button
          className="flex items-center gap-3 rounded-2xl w-full text-left transition-all active:scale-[0.98] mt-2"
          style={{ padding: '14px 16px', background: 'rgba(255,90,126,0.06)', border: '1px solid rgba(255,90,126,0.15)' }}
        >
          <span style={{ fontSize: '20px', width: '28px' }}>🚪</span>
          <span className="flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#FF5A7E' }}>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const NAV_SCREENS: Screen[] = ['home', 'accounts', 'add', 'goals', 'profile']

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding')

  const showNav = NAV_SCREENS.includes(screen)

  const render = () => {
    switch (screen) {
      case 'onboarding': return <Onboarding onStart={() => setScreen('home')} />
      case 'home': return <Home setScreen={setScreen} />
      case 'transactions': return <Transactions setScreen={setScreen} />
      case 'accounts': return <Accounts setScreen={setScreen} />
      case 'add': return <AddTransaction setScreen={setScreen} />
      case 'goals': return <Goals setScreen={setScreen} />
      case 'analytics': return <Analytics setScreen={setScreen} />
      case 'budget': return <Budget setScreen={setScreen} />
      case 'profile': return <Profile />
    }
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: '#030508' }}
    >
      {/* Phone frame */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '390px',
          height: '844px',
          maxHeight: '100vh',
          background: '#060B16',
          borderRadius: '44px',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '110px', height: '26px', background: '#030508',
            borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 50,
          }}
        />

        {/* Screen */}
        <div className="absolute inset-0 overflow-hidden">
          {render()}
        </div>

        {/* Bottom nav */}
        {showNav && (
          <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 40 }}>
            <BottomNav screen={screen} setScreen={setScreen} />
          </div>
        )}
      </div>
    </div>
  )
}
