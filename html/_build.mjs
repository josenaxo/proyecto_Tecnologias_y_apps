// Genera la carpeta html/ a partir de src/App.tsx (FinSight MVP).
// Cada pantalla React -> un archivo .html estatico con JS vanilla para la interactividad.
import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = '/home/josenaxo/Documents/proyecto_tecnologia/Finsight app templates'
const OUT = join(ROOT, 'html')
const ASSETS = join(OUT, 'assets')
mkdirSync(ASSETS, { recursive: true })

// ─── DATA (copiada de src/App.tsx) ───────────────────────────────────────────
const TRANSACTIONS = [
  { id: 1, type: 'expense', desc: 'Supermercado Jumbo', cat: 'Alimentación', amount: 85000, date: '30 Ago', emoji: '🛒' },
  { id: 2, type: 'income', desc: 'Salario Agosto', cat: 'Trabajo', amount: 3500000, date: '29 Ago', emoji: '💼' },
  { id: 3, type: 'expense', desc: 'Netflix', cat: 'Entretenimiento', amount: 22900, date: '28 Ago', emoji: '🎬' },
  { id: 4, type: 'expense', desc: 'Gasolina Copec', cat: 'Transporte', amount: 65000, date: '27 Ago', emoji: '⛽' },
  { id: 5, type: 'income', desc: 'Freelance diseño', cat: 'Extra', amount: 450000, date: '26 Ago', emoji: '🎨' },
  { id: 6, type: 'expense', desc: 'Restaurant El Hoyo', cat: 'Restaurantes', amount: 45000, date: '25 Ago', emoji: '🍽️' },
  { id: 7, type: 'expense', desc: 'Spotify Premium', cat: 'Entretenimiento', amount: 12900, date: '24 Ago', emoji: '🎵' },
  { id: 8, type: 'expense', desc: 'Farmacia Cruz Verde', cat: 'Salud', amount: 28500, date: '23 Ago', emoji: '💊' },
  { id: 9, type: 'income', desc: 'Dividendos ETF', cat: 'Inversiones', amount: 125000, date: '22 Ago', emoji: '📈' },
  { id: 10, type: 'expense', desc: 'Ropa Zara', cat: 'Ropa', amount: 189000, date: '21 Ago', emoji: '👕' },
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
  { m: 'Mar', inc: 3.5, exp: 1.8 }, { m: 'Abr', inc: 3.5, exp: 2.1 }, { m: 'May', inc: 3.95, exp: 1.95 },
  { m: 'Jun', inc: 3.5, exp: 2.3 }, { m: 'Jul', inc: 4.0, exp: 1.7 }, { m: 'Ago', inc: 3.95, exp: 2.16 },
]

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n.toLocaleString('es-CL')}`
}

// ─── SHELL ───────────────────────────────────────────────────────────────────
function navIcon(icon, active) {
  const c = active ? '#00D4AA' : '#6B7A99'
  const paths = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    wallet: `<path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3l-8 4"/><circle cx="17" cy="14" r="1.5" fill="${c}" stroke="none"/>`,
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  }
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[icon]}</svg>`
}

function bottomNav(active) {
  const items = [
    { id: 'home', label: 'Inicio', icon: 'home', href: 'home.html' },
    { id: 'accounts', label: 'Cuentas', icon: 'wallet', href: 'accounts.html' },
    { id: 'add', label: '', icon: 'plus', href: 'add.html' },
    { id: 'goals', label: 'Metas', icon: 'target', href: 'goals.html' },
    { id: 'profile', label: 'Perfil', icon: 'user', href: 'profile.html' },
  ]
  const buttons = items.map((item) => {
    if (item.icon === 'plus') {
      return `<a href="${item.href}" class="flex items-center justify-center rounded-full transition-transform active:scale-90" style="width:56px;height:56px;background:linear-gradient(135deg, #00D4AA 0%, #00A882 100%);box-shadow:0 4px 20px rgba(0,212,170,0.45)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </a>`
    }
    const on = active === item.id
    return `<a href="${item.href}" class="flex flex-col items-center gap-1 py-2 px-4 transition-all active:scale-90">
      ${navIcon(item.icon, on)}
      <span style="font-size:10px;font-weight:500;color:${on ? '#00D4AA' : '#6B7A99'}">${item.label}</span>
    </a>`
  }).join('\n        ')
  return `    <div class="bottom-nav-wrap">
      <div class="flex items-center justify-around px-1" style="height:80px;background:linear-gradient(to top, #060B16 75%, rgba(6,11,22,0.9) 100%);border-top:1px solid rgba(255,255,255,0.06)">
        ${buttons}
      </div>
    </div>`
}

function statusBar() {
  const bars = [3, 4, 5, 5].map((h) => `<div style="width:2px;height:${h * 2}px;background:white;border-radius:1px;opacity:0.85"></div>`).join('')
  return `      <div style="padding-top:28px" class="flex items-center justify-between px-6 pb-1">
        <span style="font-family:'JetBrains Mono';font-size:12px;color:#f0f6ff;font-weight:600">9:41</span>
        <div class="flex items-center gap-1.5">
          <div class="flex gap-px items-end" style="height:12px">${bars}</div>
          <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
            <rect x="0.5" y="0.5" width="15" height="10" rx="2" stroke="white" stroke-opacity="0.8"/>
            <rect x="16" y="3.5" width="1.5" height="4" rx="0.75" fill="white" fill-opacity="0.4"/>
            <rect x="1.5" y="1.5" width="11" height="8" rx="1" fill="white"/>
          </svg>
        </div>
      </div>`
}

function backBtn(href, x = false) {
  const icon = x
    ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
    : '<polyline points="15 18 9 12 15 6"/>'
  return `<a href="${href}" class="flex items-center justify-center rounded-xl" style="width:36px;height:36px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0F6FF" stroke-width="2" stroke-linecap="round">${icon}</svg>
        </a>`
}

function page({ name, title, body, nav = null, script = '' }) {
  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>
<body>
  <div class="app-root">
    <div class="phone-frame">
      <div class="notch"></div>
      <div class="screen">
${body}
      </div>
${nav ? bottomNav(nav) : ''}
    </div>
  </div>
${script ? `  <script>\n${script}\n  </script>` : ''}
</body>
</html>
`
  writeFileSync(join(OUT, name), html)
  console.log('  html/' + name)
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
writeFileSync(join(ASSETS, 'styles.css'), `/* FinSight - estilos compartidos (extraidos de src/index.css + marco de App.tsx) */
* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; padding: 0; }
body {
  background: #030508;
  color: #f0f6ff;
  font-family: 'Inter', system-ui, sans-serif;
}
input::placeholder { color: #6b7a99; }
::-webkit-scrollbar { width: 0; height: 0; }
a { text-decoration: none; color: inherit; }

.app-root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #030508;
}
.phone-frame {
  position: relative;
  overflow: hidden;
  width: 390px;
  height: 844px;
  max-height: 100vh;
  background: #060B16;
  border-radius: 44px;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.03);
}
.notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 26px;
  background: #030508;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  z-index: 50;
}
.screen { position: absolute; inset: 0; overflow: hidden; }
.bottom-nav-wrap { position: absolute; bottom: 0; left: 0; right: 0; z-index: 40; }
`)
console.log('  html/assets/styles.css')

// ─── 1. ONBOARDING ───────────────────────────────────────────────────────────
{
  const logo = `<div class="flex items-center gap-2.5 px-7 pt-16">
          <div class="flex items-center justify-center rounded-xl" style="width:36px;height:36px;background:linear-gradient(135deg, #00D4AA, #00A882)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <span style="font-family:'Outfit';font-weight:700;font-size:20px;color:#F0F6FF">FinSight</span>
        </div>`
  const body = `      <div class="flex flex-col h-full relative" style="background:linear-gradient(160deg, #060B16 0%, #0D1A36 55%, #060B16 100%)">
        <a id="skip" href="home.html" class="absolute top-16 right-6 text-sm font-medium" style="color:#6B7A99">Omitir</a>
        ${logo}
        <div class="flex-1 flex flex-col items-center justify-center px-10 gap-10">
          <div class="flex items-center justify-center rounded-3xl relative" style="width:200px;height:200px;background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.15)">
            <div class="absolute rounded-3xl" style="inset:16px;border:1px solid rgba(0,212,170,0.08)"></div>
            <div class="absolute rounded-2xl" style="inset:32px;border:1px solid rgba(0,212,170,0.05)"></div>
            <span id="ob-emoji" style="font-size:72px">📊</span>
          </div>
          <div class="text-center flex flex-col gap-3">
            <h1 id="ob-title" style="font-family:'Outfit';font-weight:700;font-size:26px;color:#F0F6FF;line-height:1.2"></h1>
            <p id="ob-desc" style="font-size:15px;color:#6B7A99;line-height:1.6"></p>
          </div>
        </div>
        <div id="ob-dots" class="flex justify-center items-center gap-2 pb-6"></div>
        <div class="px-7 pb-12">
          <button id="ob-cta" class="w-full flex items-center justify-center rounded-2xl transition-all active:scale-[0.97]" style="height:56px;background:linear-gradient(135deg, #00D4AA 0%, #00A882 100%);box-shadow:0 4px 28px rgba(0,212,170,0.35);font-family:'Outfit';font-weight:700;font-size:16px;color:white"></button>
        </div>
      </div>`
  const script = `    const slides = [
      { emoji: '📊', title: 'Visión clara de tu dinero', desc: 'Todos tus ingresos y gastos en un solo lugar, presentados de forma simple e intuitiva.' },
      { emoji: '🎯', title: 'Alcanza tus metas', desc: 'Define objetivos de ahorro y sigue tu progreso paso a paso hasta lograrlos.' },
      { emoji: '💡', title: 'Decisiones más inteligentes', desc: 'Analiza tus hábitos financieros y descubre oportunidades de mejora cada mes.' },
    ];
    let page = 0;
    const $ = (id) => document.getElementById(id);
    function render() {
      const s = slides[page];
      $('ob-emoji').textContent = s.emoji;
      $('ob-title').textContent = s.title;
      $('ob-desc').textContent = s.desc;
      $('skip').style.display = page < 2 ? '' : 'none';
      $('ob-cta').textContent = page < 2 ? 'Continuar' : 'Comenzar ahora';
      $('ob-dots').innerHTML = slides.map((_, i) =>
        '<div data-i="' + i + '" class="rounded-full" style="cursor:pointer;transition:all .3s;width:' +
        (i === page ? '24px' : '6px') + ';height:6px;background:' +
        (i === page ? '#00D4AA' : 'rgba(107,122,153,0.35)') + '"></div>'
      ).join('');
      $('ob-dots').querySelectorAll('[data-i]').forEach((d) =>
        d.addEventListener('click', () => { page = +d.dataset.i; render(); }));
    }
    $('ob-cta').addEventListener('click', () => {
      if (page < 2) { page++; render(); } else { location.href = 'home.html'; }
    });
    render();`
  page({ name: 'onboarding.html', title: 'FinSight · Onboarding', body, script })
}

// ─── 2. HOME ─────────────────────────────────────────────────────────────────
{
  const quick = [
    { emoji: '📤', label: 'Transferir', href: '#' },
    { emoji: '📊', label: 'Análisis', href: 'analytics.html' },
    { emoji: '🎯', label: 'Metas', href: 'goals.html' },
    { emoji: '📋', label: 'Presupuesto', href: 'budget.html' },
  ].map((q) => `<a href="${q.href}" class="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-90" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06)">
            <span style="font-size:20px">${q.emoji}</span>
            <span style="font-size:10px;font-weight:500;color:#6B7A99">${q.label}</span>
          </a>`).join('\n          ')

  const txRows = TRANSACTIONS.slice(0, 5).map((tx) => `<div class="flex items-center gap-3 rounded-2xl" style="padding:12px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05)">
            <div class="flex items-center justify-center rounded-xl flex-shrink-0" style="width:40px;height:40px;font-size:20px;background:${tx.type === 'income' ? 'rgba(0,212,170,0.1)' : 'rgba(255,90,126,0.1)'}">${tx.emoji}</div>
            <div class="flex-1 min-w-0">
              <p class="truncate" style="font-size:14px;font-weight:500;color:#F0F6FF">${tx.desc}</p>
              <p style="font-size:11px;color:#6B7A99">${tx.cat} · ${tx.date}</p>
            </div>
            <span style="font-family:'JetBrains Mono';font-weight:600;font-size:13px;color:${tx.type === 'income' ? '#00D4AA' : '#FF5A7E'};flex-shrink:0">${tx.type === 'income' ? '+' : '-'}${fmt(tx.amount)}</span>
          </div>`).join('\n          ')

  const body = `      <div class="flex flex-col h-full overflow-y-auto">
${statusBar()}
        <div class="flex items-center justify-between px-5 pt-2 pb-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center rounded-full" style="width:42px;height:42px;background:linear-gradient(135deg, #00D4AA, #00A882);font-family:'Outfit';font-weight:700;font-size:14px;color:white">VT</div>
            <div>
              <p style="font-size:12px;color:#6B7A99">Buenos días,</p>
              <p style="font-family:'Outfit';font-weight:600;font-size:15px;color:#F0F6FF">Valentina</p>
            </div>
          </div>
          <button class="flex items-center justify-center rounded-full relative" style="width:40px;height:40px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <div style="position:absolute;top:9px;right:9px;width:8px;height:8px;border-radius:50%;background:#FF5A7E;border:1.5px solid #060B16"></div>
          </button>
        </div>

        <div class="mx-5 mb-5 rounded-3xl relative overflow-hidden" style="min-height:384px;background:linear-gradient(145deg, #0C1C38 0%, #09213F 60%, #0B1A30 100%);border:1px solid rgba(0,212,170,0.2)">
          <div style="position:absolute;right:-30px;top:-30px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle, rgba(0,212,170,0.22) 0%, transparent 65%);pointer-events:none;z-index:0"></div>
          <div style="position:absolute;left:-20px;bottom:-20px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle, rgba(0,150,212,0.12) 0%, transparent 70%);pointer-events:none;z-index:0"></div>
          <div style="position:relative;z-index:1;padding:24px 24px 22px">
            <div class="flex items-center justify-between mb-4">
              <span style="font-size:12px;color:#6B7A99;letter-spacing:0.06em;font-weight:500">BALANCE TOTAL</span>
              <button id="toggle" type="button" class="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all active:scale-95" style="background:rgba(255,255,255,0.08);cursor:pointer">
                <span id="eye"></span>
                <span id="eye-label" style="font-size:11px;color:#9BACC0;font-weight:500"></span>
              </button>
            </div>
            <div class="flex items-baseline gap-2 mb-2">
              <span id="balance" style="font-family:'Outfit';font-weight:800;font-size:52px;color:#F0F6FF;letter-spacing:-2px;line-height:1.15;display:block"></span>
              <span id="clp" style="font-size:15px;color:#00D4AA;font-weight:600">CLP</span>
            </div>
            <div class="flex items-center gap-2 mb-5">
              <span class="rounded-full flex items-center gap-1" style="padding:3px 10px;background:rgba(0,212,170,0.14);font-size:11px;color:#00D4AA;font-weight:600">
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#00D4AA" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="10" x2="6" y2="2"/><polyline points="2 6 6 2 10 6"/></svg>
                <span id="change"></span>
              </span>
              <span style="font-size:11px;color:#6B7A99">vs. julio 2026</span>
            </div>
            <div style="height:52px;margin-bottom:16px">
              <svg id="spark" width="100%" height="52" viewBox="0 0 342 52" preserveAspectRatio="none" style="display:block">
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00D4AA" stop-opacity="0.3"/><stop offset="100%" stop-color="#00D4AA" stop-opacity="0"/></linearGradient></defs>
                <path class="spark-p" d="M 0,26 C 28,26 54,38 68,38 C 90,38 114,14 137,14 C 160,14 182,44 205,44 C 228,44 250,4 274,4 C 298,4 320,22 342,22 L 342,52 L 0,52 Z" fill="url(#sg)"/>
                <path class="spark-p" d="M 0,26 C 28,26 54,38 68,38 C 90,38 114,14 137,14 C 160,14 182,44 205,44 C 228,44 250,4 274,4 C 298,4 320,22 342,22" fill="none" stroke="#00D4AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <text x="8" y="51" fill="#6B7A99" font-size="8" font-family="Inter" text-anchor="start">Mar</text>
                <text x="68.4" y="51" fill="#6B7A99" font-size="8" font-family="Inter" text-anchor="middle">Abr</text>
                <text x="136.8" y="51" fill="#6B7A99" font-size="8" font-family="Inter" text-anchor="middle">May</text>
                <text x="205.2" y="51" fill="#6B7A99" font-size="8" font-family="Inter" text-anchor="middle">Jun</text>
                <text x="273.6" y="51" fill="#6B7A99" font-size="8" font-family="Inter" text-anchor="middle">Jul</text>
                <text x="334" y="51" fill="#6B7A99" font-size="8" font-family="Inter" text-anchor="end">Ago</text>
              </svg>
            </div>
            <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:18px"></div>
            <div class="flex gap-3">
              <div class="flex-1 rounded-2xl p-3.5" style="background:rgba(0,212,170,0.08)">
                <div class="flex items-center gap-1.5 mb-2">
                  <div class="flex items-center justify-center rounded-full" style="width:18px;height:18px;background:rgba(0,212,170,0.2)"><svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#00D4AA" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="10" x2="6" y2="2"/><polyline points="2 6 6 2 10 6"/></svg></div>
                  <span style="font-size:11px;color:#00D4AA;font-weight:500">Ingresos</span>
                </div>
                <span id="inc" style="font-family:'JetBrains Mono';font-weight:600;font-size:16px;color:#F0F6FF"></span>
              </div>
              <div class="flex-1 rounded-2xl p-3.5" style="background:rgba(255,90,126,0.08)">
                <div class="flex items-center gap-1.5 mb-2">
                  <div class="flex items-center justify-center rounded-full" style="width:18px;height:18px;background:rgba(255,90,126,0.2)"><svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#FF5A7E" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="2" x2="6" y2="10"/><polyline points="10 6 6 10 2 6"/></svg></div>
                  <span style="font-size:11px;color:#FF5A7E;font-weight:500">Gastos</span>
                </div>
                <span id="exp" style="font-family:'JetBrains Mono';font-weight:600;font-size:16px;color:#F0F6FF"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 mb-5">
          <div class="grid grid-cols-4 gap-2.5">
          ${quick}
          </div>
        </div>

        <div class="px-5 pb-28">
          <div class="flex items-center justify-between mb-4">
            <h2 style="font-family:'Outfit';font-weight:600;font-size:16px;color:#F0F6FF">Recientes</h2>
            <a href="transactions.html" style="font-size:13px;color:#00D4AA;font-weight:500">Ver todo</a>
          </div>
          <div class="flex flex-col gap-2">
          ${txRows}
          </div>
        </div>
      </div>`
  const eyeOpen = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9BACC0" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
  const eyeOff = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9BACC0" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
  const script = `    let visible = true;
    const $ = (id) => document.getElementById(id);
    const eyeOpen = ${JSON.stringify(eyeOpen)};
    const eyeOff = ${JSON.stringify(eyeOff)};
    function render() {
      $('balance').textContent = visible ? '$15.1M' : '\\u2022  \\u2022  \\u2022  \\u2022  \\u2022';
      $('clp').style.display = visible ? '' : 'none';
      $('change').textContent = visible ? '+$1.91M este mes' : '\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022';
      $('inc').textContent = visible ? '$4.07M' : '\\u2022\\u2022\\u2022\\u2022';
      $('exp').textContent = visible ? '$2.16M' : '\\u2022\\u2022\\u2022\\u2022';
      $('eye').innerHTML = visible ? eyeOpen : eyeOff;
      $('eye-label').textContent = visible ? 'Ocultar' : 'Mostrar';
      document.querySelectorAll('.spark-p').forEach((p) => p.style.opacity = visible ? 1 : 0.15);
    }
    $('toggle').addEventListener('click', () => { visible = !visible; render(); });
    render();`
  page({ name: 'home.html', title: 'FinSight · Inicio', body, nav: 'home', script })
}

// ─── 3. TRANSACTIONS ─────────────────────────────────────────────────────────
{
  const totalIncome = TRANSACTIONS.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = TRANSACTIONS.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const rows = TRANSACTIONS.map((tx) => `<div class="tx-row flex items-center gap-3 rounded-2xl" data-type="${tx.type}" data-desc="${tx.desc.toLowerCase()}" style="padding:13px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05)">
            <div class="flex items-center justify-center rounded-xl flex-shrink-0" style="width:44px;height:44px;font-size:22px;background:${tx.type === 'income' ? 'rgba(0,212,170,0.1)' : 'rgba(255,90,126,0.1)'}">${tx.emoji}</div>
            <div class="flex-1 min-w-0">
              <p class="truncate" style="font-size:14px;font-weight:500;color:#F0F6FF">${tx.desc}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="rounded-full px-2 py-0.5" style="font-size:10px;color:#6B7A99;background:rgba(255,255,255,0.06)">${tx.cat}</span>
                <span style="font-size:11px;color:#6B7A99">${tx.date}</span>
              </div>
            </div>
            <span style="font-family:'JetBrains Mono';font-weight:600;font-size:13px;color:${tx.type === 'income' ? '#00D4AA' : '#FF5A7E'};flex-shrink:0">${tx.type === 'income' ? '+' : '-'}${fmt(tx.amount)}</span>
          </div>`).join('\n          ')

  const filters = [
    { f: 'all', label: 'Todos' }, { f: 'income', label: 'Ingresos' }, { f: 'expense', label: 'Gastos' },
  ].map((x) => `<button class="tx-filter flex-1 rounded-xl transition-all" data-f="${x.f}" style="height:36px;font-size:12px;font-weight:500">${x.label}</button>`).join('\n            ')

  const body = `      <div class="flex flex-col h-full overflow-y-auto">
${statusBar()}
        <div class="flex items-center gap-3 px-5 pt-2 pb-4">
          ${backBtn('home.html')}
          <h1 style="font-family:'Outfit';font-weight:700;font-size:22px;color:#F0F6FF">Movimientos</h1>
        </div>
        <div class="px-5 mb-4 flex gap-3">
          <div class="flex-1 p-3 rounded-2xl" style="background:rgba(0,212,170,0.08);border:1px solid rgba(0,212,170,0.14)">
            <p style="font-size:10px;color:#00D4AA;margin-bottom:2px">Total ingresos</p>
            <p style="font-family:'JetBrains Mono';font-weight:700;font-size:16px;color:#F0F6FF">+${fmt(totalIncome)}</p>
          </div>
          <div class="flex-1 p-3 rounded-2xl" style="background:rgba(255,90,126,0.08);border:1px solid rgba(255,90,126,0.14)">
            <p style="font-size:10px;color:#FF5A7E;margin-bottom:2px">Total gastos</p>
            <p style="font-family:'JetBrains Mono';font-weight:700;font-size:16px;color:#F0F6FF">-${fmt(totalExpense)}</p>
          </div>
        </div>
        <div class="px-5 mb-4">
          <div class="flex items-center gap-3 px-4 rounded-2xl" style="height:44px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.06)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="search" placeholder="Buscar movimiento..." class="flex-1 bg-transparent outline-none" style="font-size:14px;color:#F0F6FF" />
          </div>
        </div>
        <div class="px-5 mb-4">
          <div class="flex gap-2">
            ${filters}
          </div>
        </div>
        <div id="tx-list" class="px-5 pb-10 flex flex-col gap-2">
          ${rows}
          <div id="tx-empty" class="flex flex-col items-center justify-center gap-3 py-16" style="display:none">
            <span style="font-size:40px">🔍</span>
            <p style="font-size:14px;color:#6B7A99">Sin resultados</p>
          </div>
        </div>
      </div>`
  const script = `    let filter = 'all';
    const rows = [...document.querySelectorAll('.tx-row')];
    const empty = document.getElementById('tx-empty');
    const search = document.getElementById('search');
    const btns = [...document.querySelectorAll('.tx-filter')];
    function styleBtns() {
      btns.forEach((b) => {
        const on = b.dataset.f === filter;
        const activeBg = b.dataset.f === 'income' ? 'rgba(0,212,170,0.15)' : b.dataset.f === 'expense' ? 'rgba(255,90,126,0.15)' : '#00D4AA';
        const activeColor = b.dataset.f === 'all' ? '#060B16' : b.dataset.f === 'income' ? '#00D4AA' : '#FF5A7E';
        b.style.background = on ? activeBg : 'rgba(255,255,255,0.04)';
        b.style.color = on ? activeColor : '#6B7A99';
        b.style.border = on ? 'none' : '1px solid rgba(255,255,255,0.06)';
      });
    }
    function apply() {
      const q = search.value.toLowerCase();
      let shown = 0;
      rows.forEach((r) => {
        let ok = true;
        if (filter !== 'all' && r.dataset.type !== filter) ok = false;
        if (q && !r.dataset.desc.includes(q)) ok = false;
        r.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      empty.style.display = shown === 0 ? 'flex' : 'none';
    }
    btns.forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; styleBtns(); apply(); }));
    search.addEventListener('input', apply);
    styleBtns(); apply();`
  page({ name: 'transactions.html', title: 'FinSight · Movimientos', body, script })
}

// ─── 4. ACCOUNTS ─────────────────────────────────────────────────────────────
{
  const total = ACCOUNTS.reduce((s, a) => s + a.balance, 0)
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
  const donutSegs = segs.map((s) => `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${s.color}" stroke-width="16" stroke-dasharray="${s.dash.toFixed(3)} ${(circ - s.dash).toFixed(3)}" stroke-dashoffset="${(-s.offset).toFixed(3)}" style="transform:rotate(-90deg);transform-origin:70px 70px"/>`).join('\n            ')
  const legend = ACCOUNTS.map((a) => `<div class="flex items-center gap-2">
              <div style="width:8px;height:8px;border-radius:50%;background:${a.color};flex-shrink:0"></div>
              <div>
                <p style="font-size:12px;font-weight:500;color:#F0F6FF;line-height:1.2">${a.name}</p>
                <p style="font-size:10px;color:#6B7A99">${((a.balance / total) * 100).toFixed(1)}% · ${fmt(a.balance)}</p>
              </div>
            </div>`).join('\n            ')
  const cards = ACCOUNTS.map((a) => `<div class="flex items-center gap-3 rounded-2xl" style="padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)">
            <div class="flex items-center justify-center rounded-xl flex-shrink-0" style="width:44px;height:44px;background:${a.color}14">
              <div style="width:12px;height:12px;border-radius:50%;background:${a.color}"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p style="font-size:14px;font-weight:500;color:#F0F6FF">${a.name}</p>
              <p style="font-size:11px;color:#6B7A99">${a.type} · ****${a.last}</p>
            </div>
            <div class="text-right">
              <p style="font-family:'JetBrains Mono';font-weight:600;font-size:14px;color:#F0F6FF">${fmt(a.balance)}</p>
              <p style="font-size:10px;color:#00D4AA">+2.1%</p>
            </div>
          </div>`).join('\n          ')
  const body = `      <div class="flex flex-col h-full overflow-y-auto">
${statusBar()}
        <div class="flex items-center justify-between px-5 pt-2 pb-4">
          <h1 style="font-family:'Outfit';font-weight:700;font-size:22px;color:#F0F6FF">Mis Cuentas</h1>
          <button class="flex items-center justify-center rounded-xl" style="width:36px;height:36px;background:rgba(0,212,170,0.1);border:1px solid rgba(0,212,170,0.2)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div class="px-5 mb-5 flex items-center gap-4">
          <div class="relative flex-shrink-0">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="${r}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="16"/>
              ${donutSegs}
              <text x="70" y="65" text-anchor="middle" fill="#F0F6FF" font-size="13" font-weight="700" font-family="Outfit">$15.1M</text>
              <text x="70" y="81" text-anchor="middle" fill="#6B7A99" font-size="10" font-family="Inter">patrimonio</text>
            </svg>
          </div>
          <div class="flex flex-col gap-2.5">
            ${legend}
          </div>
        </div>
        <div class="px-5 pb-28 flex flex-col gap-3">
          <p style="font-size:11px;font-weight:600;color:#6B7A99;letter-spacing:0.06em;margin-bottom:4px">CUENTAS VINCULADAS</p>
          ${cards}
          <a href="budget.html" class="flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-[0.97] mt-1" style="height:44px;background:rgba(0,212,170,0.07);border:1px solid rgba(0,212,170,0.2);font-size:13px;font-weight:500;color:#00D4AA">
            Ver presupuesto por categoría
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        </div>
      </div>`
  page({ name: 'accounts.html', title: 'FinSight · Cuentas', body, nav: 'accounts' })
}

// ─── 5. ADD TRANSACTION ──────────────────────────────────────────────────────
{
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((d) => {
    const inner = d === '⌫'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F0F6FF" stroke-width="2" stroke-linecap="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>'
      : d
    return `<button class="key flex items-center justify-center rounded-2xl transition-all active:scale-90" data-k="${d}" style="height:52px;background:rgba(255,255,255,0.05);font-family:'JetBrains Mono';font-weight:600;font-size:18px;color:#F0F6FF">${inner}</button>`
  }).join('\n          ')

  const body = `      <div class="flex flex-col h-full overflow-y-auto">
${statusBar()}
        <div class="flex items-center gap-3 px-5 pt-2 pb-4">
          ${backBtn('home.html', true)}
          <h1 style="font-family:'Outfit';font-weight:700;font-size:22px;color:#F0F6FF">Nuevo movimiento</h1>
        </div>
        <div class="mx-5 mb-5 rounded-2xl p-1 flex" style="background:rgba(255,255,255,0.05)">
          <button class="type-btn flex-1 rounded-xl transition-all" data-t="expense" style="height:40px;font-family:'Outfit';font-weight:600;font-size:14px">↓  Gasto</button>
          <button class="type-btn flex-1 rounded-xl transition-all" data-t="income" style="height:40px;font-family:'Outfit';font-weight:600;font-size:14px">↑  Ingreso</button>
        </div>
        <div class="text-center mb-6 px-5">
          <p id="amount" style="font-family:'Outfit';font-weight:800;font-size:48px;color:#F0F6FF;letter-spacing:-2px">$0</p>
          <p style="font-size:12px;color:#6B7A99;margin-top:4px">Pesos Chilenos (CLP)</p>
        </div>
        <div class="px-8 mb-5 grid grid-cols-3 gap-3">
          ${keys}
        </div>
        <div class="px-5 mb-5">
          <p style="font-size:11px;font-weight:600;color:#6B7A99;letter-spacing:0.06em;margin-bottom:12px">CATEGORÍA</p>
          <div id="cats" class="grid grid-cols-4 gap-2"></div>
        </div>
        <div class="px-5 mb-6">
          <input placeholder="Descripción (opcional)" class="w-full outline-none bg-transparent rounded-2xl px-4" style="height:44px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.04);font-size:14px;color:#F0F6FF" />
        </div>
        <div class="px-5 pb-10">
          <button id="save" class="w-full flex items-center justify-center rounded-2xl transition-all active:scale-[0.97]" style="height:56px;font-family:'Outfit';font-weight:700;font-size:16px;color:white">Guardar movimiento</button>
        </div>
      </div>`
  const script = `    const expCats = [
      { e: '🛒', l: 'Alimentación' }, { e: '🚗', l: 'Transporte' }, { e: '🎬', l: 'Ocio' },
      { e: '💊', l: 'Salud' }, { e: '🍽️', l: 'Restaurantes' }, { e: '🏠', l: 'Hogar' }, { e: '👕', l: 'Ropa' }, { e: '📱', l: 'Tech' },
    ];
    const incCats = [
      { e: '💼', l: 'Salario' }, { e: '🎨', l: 'Freelance' }, { e: '📈', l: 'Inversión' },
      { e: '🎁', l: 'Regalo' }, { e: '🏦', l: 'Intereses' }, { e: '💸', l: 'Otro' }, { e: '🏘️', l: 'Arriendo' }, { e: '📦', l: 'Venta' },
    ];
    let type = 'expense', amount = '', category = '';
    const $ = (id) => document.getElementById(id);
    function accent() { return type === 'expense' ? '#FF5A7E' : '#00D4AA'; }
    function accentBg() { return type === 'expense' ? 'rgba(255,90,126,0.12)' : 'rgba(0,212,170,0.12)'; }
    function renderType() {
      document.querySelectorAll('.type-btn').forEach((b) => {
        const on = b.dataset.t === type;
        b.style.background = on ? (b.dataset.t === 'expense' ? '#FF5A7E' : '#00D4AA') : 'transparent';
        b.style.color = on ? 'white' : '#6B7A99';
      });
      $('save').style.background = type === 'expense' ? 'linear-gradient(135deg, #FF5A7E, #D93D65)' : 'linear-gradient(135deg, #00D4AA, #00A882)';
      $('save').style.boxShadow = type === 'expense' ? '0 4px 24px rgba(255,90,126,0.3)' : '0 4px 24px rgba(0,212,170,0.3)';
    }
    function renderCats() {
      const cats = type === 'expense' ? expCats : incCats;
      $('cats').innerHTML = cats.map((c) => {
        const on = category === c.l;
        return '<button class="cat flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all" data-l="' + c.l + '" style="background:' +
          (on ? accentBg() : 'rgba(255,255,255,0.04)') + ';border:1px solid ' + (on ? accent() : 'rgba(255,255,255,0.06)') + '">' +
          '<span style="font-size:20px">' + c.e + '</span>' +
          '<span style="font-size:9px;color:' + (on ? '#F0F6FF' : '#6B7A99') + ';text-align:center;line-height:1.2">' + c.l + '</span></button>';
      }).join('');
      $('cats').querySelectorAll('.cat').forEach((b) =>
        b.addEventListener('click', () => { category = b.dataset.l; renderCats(); }));
    }
    function renderAmount() {
      $('amount').textContent = amount ? '$' + parseInt(amount).toLocaleString('es-CL') : '$0';
    }
    document.querySelectorAll('.key').forEach((k) => k.addEventListener('click', () => {
      const d = k.dataset.k;
      if (d === '⌫') { amount = amount.slice(0, -1); }
      else if (amount.length < 9) { amount += d; }
      renderAmount();
    }));
    document.querySelectorAll('.type-btn').forEach((b) => b.addEventListener('click', () => {
      type = b.dataset.t; category = ''; renderType(); renderCats();
    }));
    renderType(); renderCats(); renderAmount();`
  page({ name: 'add.html', title: 'FinSight · Nuevo movimiento', body, nav: 'add', script })
}

// ─── 6. GOALS ────────────────────────────────────────────────────────────────
{
  const totalSaved = GOALS.reduce((s, g) => s + g.saved, 0)
  const totalTarget = GOALS.reduce((s, g) => s + g.target, 0)
  const pct = Math.round((totalSaved / totalTarget) * 100)
  const list = GOALS.map((g) => {
    const gPct = Math.round((g.saved / g.target) * 100)
    return `<div class="p-4 rounded-3xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05)">
            <div class="flex items-start gap-3 mb-3">
              <div class="flex items-center justify-center rounded-xl flex-shrink-0" style="width:44px;height:44px;font-size:22px;background:${g.color}14">${g.emoji}</div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-0.5">
                  <p style="font-family:'Outfit';font-weight:600;font-size:15px;color:#F0F6FF">${g.name}</p>
                  <span style="font-family:'JetBrains Mono';font-weight:600;font-size:13px;color:${g.color}">${gPct}%</span>
                </div>
                <p style="font-size:11px;color:#6B7A99">Vence: ${g.deadline}</p>
              </div>
            </div>
            <div class="rounded-full overflow-hidden mb-2" style="height:6px;background:rgba(255,255,255,0.06)">
              <div style="width:${gPct}%;height:100%;border-radius:9999px;background:${g.color}"></div>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <span style="font-family:'JetBrains Mono';font-size:12px;font-weight:600;color:#F0F6FF">${fmt(g.saved)}</span>
                <span style="font-size:11px;color:#6B7A99;margin:0 4px">de</span>
                <span style="font-family:'JetBrains Mono';font-size:12px;color:#6B7A99">${fmt(g.target)}</span>
              </div>
              <span style="font-size:11px;color:#6B7A99">Faltan ${fmt(g.target - g.saved)}</span>
            </div>
          </div>`
  }).join('\n          ')
  const body = `      <div class="flex flex-col h-full overflow-y-auto">
${statusBar()}
        <div class="flex items-center justify-between px-5 pt-2 pb-4">
          <h1 style="font-family:'Outfit';font-weight:700;font-size:22px;color:#F0F6FF">Metas de Ahorro</h1>
          <button class="flex items-center justify-center rounded-xl" style="width:36px;height:36px;background:rgba(0,212,170,0.1);border:1px solid rgba(0,212,170,0.2)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div class="mx-5 mb-5 p-5 rounded-3xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)">
          <div class="flex items-end justify-between mb-4">
            <div>
              <p style="font-size:12px;color:#6B7A99;margin-bottom:4px">Total ahorrado</p>
              <p style="font-family:'Outfit';font-weight:800;font-size:32px;color:#F0F6FF;letter-spacing:-1px">${fmt(totalSaved)}</p>
            </div>
            <div class="text-right">
              <p style="font-size:12px;color:#6B7A99;margin-bottom:4px">Meta total</p>
              <p style="font-family:'Outfit';font-weight:600;font-size:20px;color:#6B7A99">${fmt(totalTarget)}</p>
            </div>
          </div>
          <div class="rounded-full overflow-hidden" style="height:8px;background:rgba(255,255,255,0.07)">
            <div style="width:${pct}%;height:100%;border-radius:9999px;background:linear-gradient(90deg, #00D4AA, #00A882)"></div>
          </div>
          <p style="font-size:12px;color:#00D4AA;margin-top:8px">${pct}% del objetivo total alcanzado</p>
        </div>
        <div class="px-5 pb-28 flex flex-col gap-3">
          ${list}
          <button class="flex items-center justify-center gap-2 rounded-3xl transition-all active:scale-[0.97]" style="height:56px;border:1.5px dashed rgba(0,212,170,0.3);color:#00D4AA;background:rgba(0,212,170,0.04);font-size:14px;font-family:'Outfit';font-weight:600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva meta de ahorro
          </button>
        </div>
      </div>`
  page({ name: 'goals.html', title: 'FinSight · Metas', body, nav: 'goals' })
}

// ─── 7. ANALYTICS ────────────────────────────────────────────────────────────
{
  const catRows = CATEGORIES.slice(0, 5).map((c) => {
    const p = Math.round((c.spent / c.budget) * 100)
    const isHigh = p >= 88
    return `<div>
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2"><span style="font-size:14px">${c.emoji}</span><span style="font-size:13px;font-weight:500;color:#F0F6FF">${c.name}</span></div>
                <div class="flex items-center gap-2"><span style="font-family:'JetBrains Mono';font-size:11px;color:#6B7A99">${fmt(c.spent)}</span><span style="font-size:10px;color:${isHigh ? '#FF5A7E' : '#6B7A99'}">${p}%</span></div>
              </div>
              <div class="rounded-full overflow-hidden" style="height:4px;background:rgba(255,255,255,0.06)">
                <div style="width:${Math.min(p, 100)}%;height:100%;border-radius:9999px;background:${isHigh ? '#FF5A7E' : c.color}"></div>
              </div>
            </div>`
  }).join('\n            ')
  const body = `      <div class="flex flex-col h-full overflow-y-auto">
${statusBar()}
        <div class="flex items-center gap-3 px-5 pt-2 pb-4">
          ${backBtn('home.html')}
          <h1 style="font-family:'Outfit';font-weight:700;font-size:22px;color:#F0F6FF">Análisis</h1>
        </div>
        <div class="px-5 mb-5 flex gap-2">
          <button class="per-btn rounded-xl px-4 transition-all" data-p="3m" style="height:32px;font-size:12px;font-weight:500">3 meses</button>
          <button class="per-btn rounded-xl px-4 transition-all" data-p="6m" style="height:32px;font-size:12px;font-weight:500">6 meses</button>
          <button class="per-btn rounded-xl px-4 transition-all" data-p="1y" style="height:32px;font-size:12px;font-weight:500">1 año</button>
        </div>
        <div class="px-5 mb-5 grid grid-cols-2 gap-3">
          <div class="p-4 rounded-2xl" style="background:rgba(0,212,170,0.08);border:1px solid rgba(0,212,170,0.14)">
            <p style="font-size:10px;color:#00D4AA;margin-bottom:6px">Ahorro neto</p>
            <p style="font-family:'Outfit';font-weight:700;font-size:24px;color:#F0F6FF">$1.91M</p>
            <p style="font-size:11px;color:#00D4AA;margin-top:4px">↑ +12% vs anterior</p>
          </div>
          <div class="p-4 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)">
            <p style="font-size:10px;color:#6B7A99;margin-bottom:6px">Tasa de ahorro</p>
            <p style="font-family:'Outfit';font-weight:700;font-size:24px;color:#F0F6FF">48.3%</p>
            <p style="font-size:11px;color:#6B7A99;margin-top:4px">de ingresos totales</p>
          </div>
        </div>
        <div class="mx-5 mb-5 p-4 rounded-3xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)">
          <div class="flex items-center justify-between mb-4">
            <p style="font-family:'Outfit';font-weight:600;font-size:14px;color:#F0F6FF">Ingresos vs Gastos</p>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5"><div style="width:8px;height:8px;border-radius:50%;background:#00D4AA"></div><span style="font-size:10px;color:#6B7A99">Ingreso</span></div>
              <div class="flex items-center gap-1.5"><div style="width:8px;height:8px;border-radius:50%;background:#FF5A7E"></div><span style="font-size:10px;color:#6B7A99">Gasto</span></div>
            </div>
          </div>
          <div id="bars" class="flex items-end gap-3" style="height:120px"></div>
        </div>
        <div class="mx-5 mb-5 p-4 rounded-3xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)">
          <p style="font-family:'Outfit';font-weight:600;font-size:14px;color:#F0F6FF;margin-bottom:16px">Gastos por categoría</p>
          <div class="flex flex-col gap-3.5">
            ${catRows}
          </div>
        </div>
        <div style="height:112px"></div>
      </div>`
  const script = `    const MONTHLY = ${JSON.stringify(MONTHLY)};
    let period = '6m';
    function renderBars() {
      const data = period === '3m' ? MONTHLY.slice(-3) : MONTHLY;
      const maxVal = Math.max(...data.map((m) => Math.max(m.inc, m.exp)));
      document.getElementById('bars').innerHTML = data.map((m) =>
        '<div class="flex-1 flex flex-col items-center gap-1">' +
          '<div class="w-full flex gap-0.5 items-end" style="height:100px">' +
            '<div class="flex-1 rounded-t-md" style="height:' + (m.inc / maxVal * 100) + '%;background:rgba(0,212,170,0.75)"></div>' +
            '<div class="flex-1 rounded-t-md" style="height:' + (m.exp / maxVal * 100) + '%;background:rgba(255,90,126,0.75)"></div>' +
          '</div>' +
          '<span style="font-size:9px;color:#6B7A99">' + m.m + '</span>' +
        '</div>'
      ).join('');
    }
    function renderBtns() {
      document.querySelectorAll('.per-btn').forEach((b) => {
        const on = b.dataset.p === period;
        b.style.background = on ? '#00D4AA' : 'rgba(255,255,255,0.05)';
        b.style.color = on ? '#060B16' : '#6B7A99';
      });
    }
    document.querySelectorAll('.per-btn').forEach((b) => b.addEventListener('click', () => {
      period = b.dataset.p; renderBtns(); renderBars();
    }));
    renderBtns(); renderBars();`
  page({ name: 'analytics.html', title: 'FinSight · Análisis', body, script })
}

// ─── 8. BUDGET ───────────────────────────────────────────────────────────────
{
  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0)
  const totalSpent = CATEGORIES.reduce((s, c) => s + c.spent, 0)
  const remaining = totalBudget - totalSpent
  const overallPct = Math.round((totalSpent / totalBudget) * 100)
  const isNearLimit = overallPct >= 80
  const cats = CATEGORIES.map((c) => {
    const p = Math.round((c.spent / c.budget) * 100)
    const isOver = p >= 88
    return `<div class="p-4 rounded-2xl" style="background:rgba(255,255,255,0.03);border:1px solid ${isOver ? 'rgba(255,90,126,0.2)' : 'rgba(255,255,255,0.05)'}">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex items-center justify-center rounded-xl flex-shrink-0" style="width:38px;height:38px;font-size:18px;background:${c.color}12">${c.emoji}</div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-0.5">
                  <p style="font-size:14px;font-weight:500;color:#F0F6FF">${c.name}</p>
                  ${isOver ? '<span class="rounded-full px-2" style="font-size:9px;font-weight:600;background:rgba(255,90,126,0.15);color:#FF5A7E;padding:2px 8px">Casi límite</span>' : ''}
                </div>
                <div class="flex items-center gap-1">
                  <span style="font-family:'JetBrains Mono';font-size:12px;font-weight:600;color:#F0F6FF">${fmt(c.spent)}</span>
                  <span style="font-size:11px;color:#6B7A99">de ${fmt(c.budget)}</span>
                </div>
              </div>
            </div>
            <div class="rounded-full overflow-hidden" style="height:5px;background:rgba(255,255,255,0.06)">
              <div style="width:${Math.min(p, 100)}%;height:100%;border-radius:9999px;background:${isOver ? '#FF5A7E' : c.color}"></div>
            </div>
          </div>`
  }).join('\n          ')
  const body = `      <div class="flex flex-col h-full overflow-y-auto">
${statusBar()}
        <div class="flex items-center gap-3 px-5 pt-2 pb-4">
          ${backBtn('accounts.html')}
          <h1 style="font-family:'Outfit';font-weight:700;font-size:22px;color:#F0F6FF">Presupuesto</h1>
        </div>
        <div class="flex items-center justify-between px-5 mb-5">
          <button style="padding:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
          <p style="font-family:'Outfit';font-weight:600;font-size:16px;color:#F0F6FF">Agosto 2026</p>
          <button style="padding:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
        <div class="mx-5 mb-5 p-5 rounded-3xl" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)">
          <div class="flex items-end justify-between mb-4">
            <div>
              <p style="font-size:12px;color:#6B7A99;margin-bottom:4px">Gastado</p>
              <p style="font-family:'Outfit';font-weight:800;font-size:28px;color:#F0F6FF;letter-spacing:-0.5px">${fmt(totalSpent)}</p>
            </div>
            <div class="text-right">
              <p style="font-size:12px;color:#6B7A99;margin-bottom:4px">Disponible</p>
              <p style="font-family:'Outfit';font-weight:600;font-size:22px;color:#00D4AA">${fmt(remaining)}</p>
            </div>
          </div>
          <div class="rounded-full overflow-hidden mb-2" style="height:8px;background:rgba(255,255,255,0.07)">
            <div style="width:${overallPct}%;height:100%;border-radius:9999px;background:${isNearLimit ? 'linear-gradient(90deg, #FFB347, #FF5A7E)' : 'linear-gradient(90deg, #00D4AA, #00A882)'}"></div>
          </div>
          <div class="flex items-center justify-between">
            <p style="font-size:11px;color:#6B7A99">${overallPct}% del presupuesto mensual</p>
            <p style="font-family:'JetBrains Mono';font-size:11px;color:#6B7A99">de ${fmt(totalBudget)}</p>
          </div>
        </div>
        <div class="px-5 pb-28 flex flex-col gap-3">
          <div class="flex items-center justify-between mb-1">
            <p style="font-family:'Outfit';font-weight:600;font-size:15px;color:#F0F6FF">Por categoría</p>
            <button style="font-size:13px;color:#00D4AA;font-weight:500">Editar</button>
          </div>
          ${cats}
        </div>
      </div>`
  page({ name: 'budget.html', title: 'FinSight · Presupuesto', body })
}

// ─── 9. PROFILE ──────────────────────────────────────────────────────────────
{
  const settings = [
    { emoji: '🔔', label: 'Notificaciones', detail: 'Activadas' },
    { emoji: '🔒', label: 'Seguridad', detail: 'Face ID' },
    { emoji: '💳', label: 'Cuentas vinculadas', detail: '4 cuentas' },
    { emoji: '🌙', label: 'Tema', detail: 'Oscuro' },
    { emoji: '📤', label: 'Exportar datos', detail: 'CSV / PDF' },
    { emoji: '❓', label: 'Ayuda y soporte', detail: '' },
    { emoji: '📋', label: 'Términos y privacidad', detail: '' },
  ].map((s) => `<button class="flex items-center gap-3 rounded-2xl w-full text-left transition-all active:scale-[0.98]" style="padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05)">
            <span style="font-size:20px;width:28px">${s.emoji}</span>
            <span class="flex-1" style="font-size:14px;font-weight:500;color:#F0F6FF">${s.label}</span>
            ${s.detail ? `<span style="font-size:12px;color:#6B7A99">${s.detail}</span>` : ''}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7A99" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>`).join('\n          ')
  const stats = [
    { label: 'Cuentas', value: '4' }, { label: 'Metas', value: '4' }, { label: 'Movimientos', value: '247' },
  ].map((s, i, arr) => `<div class="flex-1 flex flex-col items-center gap-1" style="border-right:${i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'}">
            <p style="font-family:'Outfit';font-weight:700;font-size:22px;color:#F0F6FF">${s.value}</p>
            <p style="font-size:11px;color:#6B7A99">${s.label}</p>
          </div>`).join('\n          ')
  const body = `      <div class="flex flex-col h-full overflow-y-auto">
${statusBar()}
        <div class="px-5 pt-2 pb-4">
          <h1 style="font-family:'Outfit';font-weight:700;font-size:22px;color:#F0F6FF">Mi Perfil</h1>
        </div>
        <div class="flex flex-col items-center gap-3 py-4 px-5 mb-4">
          <div class="relative flex items-center justify-center rounded-2xl" style="width:80px;height:80px;background:linear-gradient(135deg, #00D4AA, #00A882);font-family:'Outfit';font-weight:700;font-size:26px;color:white">
            VT
            <button class="absolute flex items-center justify-center rounded-lg" style="bottom:-6px;right:-6px;width:26px;height:26px;background:#0D1526;border:2px solid #060B16">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" stroke-width="2.5" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
          <div class="text-center">
            <p style="font-family:'Outfit';font-weight:700;font-size:20px;color:#F0F6FF">Valentina Torres</p>
            <p style="font-size:13px;color:#6B7A99;margin-top:2px">vale.torres@gmail.com</p>
          </div>
          <div class="flex gap-2">
            <span class="rounded-full px-3 py-1" style="font-size:12px;font-weight:500;background:rgba(0,212,170,0.1);color:#00D4AA">✦ Premium</span>
            <span class="rounded-full px-3 py-1" style="font-size:12px;background:rgba(255,255,255,0.05);color:#6B7A99">Desde Ene 2024</span>
          </div>
        </div>
        <div class="mx-5 mb-5 p-4 rounded-2xl flex" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)">
          ${stats}
        </div>
        <div class="px-5 pb-28 flex flex-col gap-2">
          ${settings}
          <button class="flex items-center gap-3 rounded-2xl w-full text-left transition-all active:scale-[0.98] mt-2" style="padding:14px 16px;background:rgba(255,90,126,0.06);border:1px solid rgba(255,90,126,0.15)">
            <span style="font-size:20px;width:28px">🚪</span>
            <span class="flex-1" style="font-size:14px;font-weight:600;color:#FF5A7E">Cerrar sesión</span>
          </button>
        </div>
      </div>`
  page({ name: 'profile.html', title: 'FinSight · Perfil', body, nav: 'profile' })
}

// ─── INDEX / GALERIA ─────────────────────────────────────────────────────────
{
  const screens = [
    { n: 'onboarding.html', t: 'Onboarding', d: 'Bienvenida en 3 pasos' },
    { n: 'home.html', t: 'Inicio / Dashboard', d: 'Balance, accesos rápidos y movimientos recientes' },
    { n: 'transactions.html', t: 'Movimientos', d: 'Lista con búsqueda y filtros' },
    { n: 'accounts.html', t: 'Cuentas', d: 'Donut de patrimonio y cuentas vinculadas' },
    { n: 'add.html', t: 'Nuevo movimiento', d: 'Teclado numérico y categorías' },
    { n: 'goals.html', t: 'Metas de Ahorro', d: 'Progreso por objetivo' },
    { n: 'analytics.html', t: 'Análisis', d: 'Ingresos vs gastos y categorías' },
    { n: 'budget.html', t: 'Presupuesto', d: 'Control mensual por categoría' },
    { n: 'profile.html', t: 'Perfil', d: 'Datos del usuario y ajustes' },
  ].map((s, i) => `<a href="${s.n}" class="card">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <span class="t">${s.t}</span>
        <span class="d">${s.d}</span>
        <span class="f">${s.n}</span>
      </a>`).join('\n      ')
  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FinSight · Plantillas HTML</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #030508; color: #f0f6ff; font-family: 'Inter', system-ui, sans-serif; min-height: 100vh; padding: 48px 24px; }
    .wrap { max-width: 900px; margin: 0 auto; }
    .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .logo { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #00D4AA, #00A882); display: flex; align-items: center; justify-content: center; }
    h1 { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 28px; margin: 0; }
    .sub { color: #6B7A99; font-size: 14px; margin: 4px 0 36px; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
    .card { display: flex; flex-direction: column; gap: 4px; padding: 20px; border-radius: 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); text-decoration: none; color: inherit; transition: all .18s; }
    .card:hover { border-color: rgba(0,212,170,0.4); background: rgba(0,212,170,0.05); transform: translateY(-2px); }
    .num { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #00D4AA; }
    .t { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 16px; }
    .d { font-size: 12px; color: #6B7A99; line-height: 1.5; }
    .f { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #43506b; margin-top: 6px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="brand">
      <div class="logo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
      <h1>FinSight — Plantillas HTML</h1>
    </div>
    <p class="sub">MVP exportado desde <code>src/App.tsx</code> (React) a HTML estático. Cada tarjeta abre una pantalla independiente. La navegación inferior y los enlaces entre pantallas funcionan; la interactividad (saldo, filtros, teclado numérico, slider) está reescrita en JavaScript vanilla.</p>
    <div class="grid">
      ${screens}
    </div>
  </div>
</body>
</html>
`
  writeFileSync(join(OUT, 'index.html'), html)
  console.log('  html/index.html')
}

// ─── README + copia del generador ────────────────────────────────────────────
writeFileSync(join(OUT, 'README.md'), `# FinSight — Plantillas HTML

Versión **HTML estática** del MVP que vive en \`../src/App.tsx\` (React + Vite + Tailwind).
Generada para poder abrir, compartir o entregar cada pantalla sin necesidad de compilar el proyecto React.

## Contenido

| Archivo | Pantalla | Origen en App.tsx |
|---|---|---|
| \`index.html\` | Galería / índice de pantallas | — |
| \`onboarding.html\` | Bienvenida (3 slides) | \`Onboarding\` |
| \`home.html\` | Inicio / Dashboard | \`Home\` |
| \`transactions.html\` | Movimientos (búsqueda + filtros) | \`Transactions\` |
| \`accounts.html\` | Cuentas (donut de patrimonio) | \`Accounts\` |
| \`add.html\` | Nuevo movimiento (teclado numérico) | \`AddTransaction\` |
| \`goals.html\` | Metas de ahorro | \`Goals\` |
| \`analytics.html\` | Análisis (barras + categorías) | \`Analytics\` |
| \`budget.html\` | Presupuesto mensual | \`Budget\` |
| \`profile.html\` | Perfil y ajustes | \`Profile\` |
| \`assets/styles.css\` | Marco de teléfono + reset (de \`src/index.css\` + \`App.tsx\`) | — |

## Cómo verlo

Abre \`index.html\` directamente en el navegador (doble clic), o levanta un servidor estático:

\`\`\`bash
cd "Finsight app templates/html"
python3 -m http.server 4000
# http://localhost:4000
\`\`\`

## Notas

- **Tailwind** se carga desde el CDN (\`cdn.tailwindcss.com\`) y las **fuentes** desde Google Fonts, así que la primera carga necesita internet.
- Los datos (transacciones, cuentas, metas, categorías) están "horneados" en el HTML: se copiaron de \`App.tsx\` en el momento de generar.
- La interactividad con estado de React (\`useState\`) se reescribió en JS vanilla dentro de cada archivo: toggle de saldo, slider de onboarding, filtros/buscador, teclado numérico, selector de periodo.
- Para regenerar tras cambiar \`App.tsx\`: \`node _build.mjs\` (revisa antes que los datos y textos coincidan).
`)
console.log('  html/README.md')

const __dir = dirname(fileURLToPath(import.meta.url))
copyFileSync(join(__dir, 'build.mjs'), join(OUT, '_build.mjs'))
console.log('  html/_build.mjs')

console.log('\nListo.')
