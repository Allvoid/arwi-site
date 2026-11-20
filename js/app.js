/* ArWi site: the desktop builder on demo.html (page effects live in site.js). No build step, no dependencies.
   Motion curves copied from ArWi (native-ui/src/ui/EdgeSlide.h and the nord theme sheets). */
(() => {
'use strict';

const THEMES = window.ARWI_THEMES;
const TH = Object.fromEntries(THEMES.map(t => [t.id, t]));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- colour helpers ---------------- */
function hexRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (h, a) => { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; };
const rgbStr = h => hexRgb(h).join(',');
function lum(h) {
  const c = hexRgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
}

/* ---------------- app icons ---------------- */
const GLYPH = {
  files: '<path d="M8 11.5a1.5 1.5 0 0 1 1.5-1.5H14l2 2h6.5a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 8 20.5Z" fill="#fff" fill-opacity=".92"/>',
  browser: '<circle cx="16" cy="16" r="7.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M8.5 16h15M16 8.5c3 3.2 3 11.8 0 15M16 8.5c-3 3.2-3 11.8 0 15" fill="none" stroke="#fff" stroke-width="1.6"/>',
  notes: '<rect x="10" y="8" width="12" height="16" rx="2" fill="#fff" fill-opacity=".92"/><path d="M13 13h6M13 16.5h6M13 20h4" stroke="#3a6ea5" stroke-width="1.6" stroke-linecap="round"/>',
  calc: '<rect x="10" y="8" width="12" height="16" rx="2" fill="#fff" fill-opacity=".92"/><rect x="12" y="10" width="8" height="3.5" rx="1" fill="#555"/><g fill="#555"><circle cx="13.5" cy="17" r="1"/><circle cx="16" cy="17" r="1"/><circle cx="18.5" cy="17" r="1"/><circle cx="13.5" cy="20.5" r="1"/><circle cx="16" cy="20.5" r="1"/><circle cx="18.5" cy="20.5" r="1"/></g>',
  music: '<path d="M13 21.5V11l9-2v10.5" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle cx="11" cy="21.5" r="2.4" fill="#fff"/><circle cx="20" cy="19.5" r="2.4" fill="#fff"/>',
  code: '<path d="m13 11-5 5 5 5M19 11l5 5-5 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  term: '<path d="m10 12 4 4-4 4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 21h6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
  chat: '<path d="M9 11.5A2.5 2.5 0 0 1 11.5 9h9a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5H15l-4 3v-3h.5A2.5 2.5 0 0 1 9 17.5Z" fill="#fff" fill-opacity=".92"/>',
  game: '<path d="M11 12h10a4 4 0 0 1 3.9 4.9l-.6 2.8a2.2 2.2 0 0 1-3.8 1L19 19h-6l-1.5 1.7a2.2 2.2 0 0 1-3.8-1l-.6-2.8A4 4 0 0 1 11 12Z" fill="#fff" fill-opacity=".92"/><path d="M12 15v3M10.5 16.5h3" stroke="#2e7d4f" stroke-width="1.5" stroke-linecap="round"/>',
  paint: '<circle cx="16" cy="16" r="7.5" fill="#fff" fill-opacity=".92"/><g><circle cx="13" cy="13.5" r="1.5" fill="#e8142c"/><circle cx="17" cy="12.5" r="1.5" fill="#f4c04f"/><circle cx="19.5" cy="16" r="1.5" fill="#5aa9ff"/><circle cx="13" cy="18" r="1.5" fill="#63d68c"/></g>',
  gear: '<circle cx="16" cy="16" r="3" fill="none" stroke="#fff" stroke-width="2"/><path d="M16 8.5v2.2M16 21.3v2.2M8.5 16h2.2M21.3 16h2.2M10.7 10.7l1.6 1.6M19.7 19.7l1.6 1.6M10.7 21.3l1.6-1.6M19.7 12.3l1.6-1.6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  cube: '<path d="m16 8 7 4v8l-7 4-7-4v-8Z M9 12l7 4 7-4M16 16v8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>',
  rec: '<circle cx="16" cy="16" r="7" fill="none" stroke="#fff" stroke-width="2"/><circle cx="16" cy="16" r="3.2" fill="#fff"/>',
};
const APPS = {
  files:   { name: 'Проводник', c: '#e3a72f', g: 'files' },
  browser: { name: 'Firefox', c: '#ff6d3a', g: 'browser' },
  notes:   { name: 'Блокнот', c: '#3a7bd5', g: 'notes', win: 'note' },
  calc:    { name: 'Калькулятор', c: '#5c6370', g: 'calc', win: 'calc' },
  music:   { name: 'Музыка', c: '#a65fe0', g: 'music' },
  code:    { name: 'Редактор кода', c: '#2b8be6', g: 'code' },
  term:    { name: 'Терминал', c: '#2d333b', g: 'term' },
  chat:    { name: 'Telegram', c: '#2aabee', g: 'chat' },
  game:    { name: 'Steam', c: '#2e9e5f', g: 'game' },
  paint:   { name: 'Paint', c: '#d0457a', g: 'paint' },
  gear:    { name: 'Параметры', c: '#6b7a90', g: 'gear' },
  cube:    { name: 'Blender', c: '#e87d0d', g: 'cube' },
  rec:     { name: 'OBS Studio', c: '#3b3f4a', g: 'rec' },
};
function ico(id) {
  const a = APPS[id] || { c: '#667', g: null, name: '?' };
  const glyph = a.g ? GLYPH[a.g] : `<text x="16" y="21" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="Inter,sans-serif">${a.name[0]}</text>`;
  return `<svg viewBox="0 0 32 32"><rect x="2" y="2" width="28" height="28" rx="8" fill="${a.c}"/><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#arwiGloss)"/>${glyph}</svg>`;
}
document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="arwiGloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs></svg>');

/* ---------------- data ---------------- */
const TASKS = ['files', 'browser', 'notes', 'calc', 'music', 'code', 'chat', 'game'];
const LIVE_WALLS = new Set(['nord', 'pixel', 'brutalist', 'catppuccin', 'gruvbox', 'rosepine', 'tokyo', 'dark-glass']);
const WALLS = ['nord', 'scarlet', 'lime', 'pine', 'city', 'lake', 'paper', 'catppuccin', 'tokyo', 'rosepine', 'pixel', 'gruvbox', 'brutalist', 'dark-glass'];
const WIDGETS = [
  ['weather', 'Погода'], ['note', 'Заметка'], ['player', 'Плеер'], ['res', 'Ресурсы'],
  ['pomodoro', 'Помодоро'], ['calendar', 'Календарь'], ['currency', 'Валюты'], ['copy', 'Быстрые вставки'],
  ['checklist', 'Чек-лист'], ['stopwatch', 'Секундомер'],
];
const LOOKS = [['arwi', 'ArWi'], ['win11', 'Windows 11'], ['win10', 'Windows 10'], ['waybar', 'Waybar'], ['dock', 'Dock'], ['label', 'С подписью']];
const SEARCH_APPS = ['files', 'browser', 'notes', 'calc', 'paint', 'term', 'chat', 'game', 'cube', 'code', 'music', 'gear', 'rec',
  { id: 'clion', name: 'CLion', c: '#21d789' }, { id: 'discord', name: 'Discord', c: '#5865f2' }, { id: 'tm', name: 'Диспетчер задач', c: '#3a7bd5' },
  { id: 'cmd', name: 'Командная строка', c: '#1e1e1e' }, { id: 'ps', name: 'PowerShell', c: '#2b5797' }, { id: 'spot', name: 'Spotify', c: '#1db954' }];
SEARCH_APPS.forEach(a => { if (typeof a === 'object') APPS[a.id] = { name: a.name, c: a.c, g: null }; });
const SEARCH_IDS = SEARCH_APPS.map(a => typeof a === 'object' ? a.id : a);
APPS.code.name = 'Visual Studio Code';

const DEFAULT = {
  theme: 'nord',
  ov: { accent: null, radius: null, shadow: null, hs: null, alpha: null },
  bar: { on: true, look: 'arwi', pos: 'bottom', len: 62, thick: 46, radius: null, transp: null, accent: null, grad: false, gradAngle: 90,
         dock: true, peak: 1.7, wave: 120, under: 'peek', anim: 'slide', ms: 240 },
  widgets: { on: true, side: 'right', hide: 'always', clock: true, list: ['weather', 'note', 'player', 'res', 'copy'] },
  wall: { mode: 'theme', pick: 'nord', live: false },
  folders: { on: true, shape: 'round' },
  win: { magnet: true, dist: 14, inertia: true, border: false },
};
const clone = o => JSON.parse(JSON.stringify(o));
function merge(base, add) {
  for (const k in add) {
    if (add[k] && typeof add[k] === 'object' && !Array.isArray(add[k]) && base[k] && typeof base[k] === 'object') merge(base[k], add[k]);
    else if (k in base) base[k] = add[k];
  }
  return base;
}
let S = clone(DEFAULT);
const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const dec = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
try {
  const m = location.hash.match(/^#b=([\w-]+)/);
  if (m) S = merge(clone(DEFAULT), dec(m[1]));
  else { const saved = localStorage.getItem('arwi-build'); if (saved) S = merge(clone(DEFAULT), JSON.parse(saved)); }
} catch (e) { S = clone(DEFAULT); }
// demo.html#t=<theme id> comes from the theme gallery on the home page: try that theme on the current build
try {
  const t = location.hash.match(/^#t=([\w-]+)/);
  if (t && TH[t[1]]) { S.theme = t[1]; S.ov = clone(DEFAULT.ov); S.bar.accent = null; S.bar.radius = null; S.bar.transp = null; if (S.wall.mode === 'pick') S.wall.mode = 'theme'; history.replaceState(null, '', location.pathname + location.search); }
} catch (e) { /* bad hash */ }
if (!TH[S.theme]) S.theme = 'nord';
let customWall = null; // data URL of an uploaded picture; stays in this tab only
let saveTimer = 0;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try { localStorage.setItem('arwi-build', JSON.stringify(S)); } catch (e) { /* storage may be off */ } }, 250);
}

/* runtime (not saved) */
const R = { desk: 1, maximized: false, concealed: false, popup: null, wins: {} };

/* ---------------- stage scaling ---------------- */
const stageWrap = $('#stageWrap'), stage = $('#stage');
let scale = 1;
function fitStage() {
  scale = stageWrap.clientWidth / 1280;
  stage.style.setProperty('--s', scale);
}
new ResizeObserver(fitStage).observe(stageWrap);
fitStage();
const toStage = (cx, cy) => { const r = stage.getBoundingClientRect(); return [(cx - r.left) / scale, (cy - r.top) / scale]; };
const rectInStage = el => { const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect(); return { x: (r.left - s.left) / scale, y: (r.top - s.top) / scale, w: r.width / scale, h: r.height / scale }; };

/* ---------------- theme tokens ---------------- */
function themeVars() {
  const t = TH[S.theme], o = S.ov;
  const accent = o.accent || t.accent;
  const fg = t.fg;
  const radius = o.radius ?? t.radius;
  const shadowKind = o.shadow || t.shadow;
  const alpha = o.alpha ?? t.cardA;
  const dark = !t.light;
  const sh = {
    none: ['none', 'none'],
    soft: [dark ? '0 18px 50px rgba(0,0,0,.45)' : '0 16px 40px rgba(60,50,40,.18)', dark ? '0 6px 18px rgba(0,0,0,.25)' : '0 4px 14px rgba(60,50,40,.1)'],
    hard: [`6px 6px 0 ${dark ? 'rgba(0,0,0,.65)' : t.bc || fg}`, `4px 4px 0 ${dark ? 'rgba(0,0,0,.55)' : t.bc || fg}`],
    glow: [`0 0 34px ${rgba(accent, .35)}, 0 12px 40px rgba(0,0,0,.3)`, `0 0 18px ${rgba(accent, .22)}`],
  }[shadowKind] || ['none', 'none'];
  const barAcc = S.bar.accent || accent;
  const barOp = S.bar.transp == null ? t.barOp : 100 - S.bar.transp;
  const v = {
    '--t-fg': fg, '--t-accent': accent, '--t-acc-rgb': rgbStr(accent),
    '--t-onacc': lum(accent) > .42 ? '#11151b' : '#ffffff',
    '--t-card': rgba(t.card, clamp(alpha, .2, 1)), '--t-panel': rgba(t.panel, dark ? .9 : .95),
    '--t-bc': t.bc || rgba(fg, .09), '--t-bw': t.bw + 'px', '--t-r': radius + 'px',
    '--t-shadow': sh[0], '--t-shadow-sm': sh[1], '--t-hc': t.hc,
    '--t-font': `"${t.font}", Inter, system-ui, sans-serif`,
    '--t-pal2': t.pal[1], '--t-pal3': t.pal[2] || t.pal[1],
    '--t-progress': `linear-gradient(90deg, ${accent}, ${t.pal[1]})`,
    '--t-barbg': rgba(t.barBg, barOp / 100), '--t-barr': (S.bar.radius ?? t.barR) + 'px',
    '--t-baracc': barAcc,
    '--t-clockfont': t.id === 'lime' ? '"Manrope", sans-serif' : (t.id === 'brutalist' || t.id === 'paper') ? '"Space Grotesk", sans-serif' : 'var(--mono)',
    '--bg1': rgba(barAcc, barOp / 100), '--bg2': rgba(t.pal[1] === barAcc ? t.pal[2] || t.pal[1] : t.pal[1], barOp / 100), '--bga': S.bar.gradAngle + 'deg',
  };
  if (t.id === 'lime') v['--t-numfont'] = '"Manrope", sans-serif';
  return v;
}
function applyTheme() {
  const v = themeVars();
  for (const k in v) stage.style.setProperty(k, v[k]);
  const t = TH[S.theme];
  const hs = S.ov.hs || t.hs;
  stage.classList.remove('hs-classic', 'hs-mono', 'hs-brutal');
  stage.classList.add('hs-' + hs);
  $('#bigClock').style.fontWeight = '';
  // the theme recolours only the mock desktop; the page keeps its own Nord look
  $$('.tcard').forEach(c => c.classList.toggle('on', c.dataset.id === S.theme));
  $$('.tg-item').forEach(c => c.classList.toggle('sel', c.dataset.id === S.theme));
}

/* ---------------- wallpaper ---------------- */
const wallA = $('#wallA'), wallB = $('#wallB'), wallVideo = $('#wallVideo');
let wallFront = wallA, wallKey = '';
function wallSource() {
  const t = TH[S.theme];
  if (S.wall.mode === 'custom' && customWall) return { key: 'custom', css: `url(${customWall})` };
  if (S.wall.mode === 'gradient') {
    const p = t.pal;
    return { key: 'grad-' + t.id, css: `radial-gradient(60% 70% at 78% 30%, ${rgba(p[0], .55)}, transparent 70%), radial-gradient(50% 60% at 15% 85%, ${rgba(p[1], .45)}, transparent 70%), linear-gradient(160deg, ${t.shade}, ${t.light ? t.card : t.panel})` };
  }
  const id = S.wall.mode === 'pick' ? S.wall.pick : t.id;
  return { key: 'img-' + id, css: `url(assets/wall/${id}.webp)`, id };
}
function applyWall() {
  const src = wallSource();
  if (src.key !== wallKey) {
    wallKey = src.key;
    const back = wallFront === wallA ? wallB : wallA;
    back.style.backgroundImage = src.css;
    back.classList.add('on');
    wallFront.classList.remove('on');
    wallFront = back;
  }
  const liveId = src.id && LIVE_WALLS.has(src.id) && S.wall.live ? src.id : null;
  if (liveId) {
    const url = `assets/live/${liveId}.mp4`;
    if (!wallVideo.src.endsWith(url)) {
      wallVideo.classList.remove('on');
      wallVideo.src = url;
      wallVideo.oncanplay = () => { wallVideo.classList.add('on'); if (stageVisible) wallVideo.play().catch(() => {}); };
      wallVideo.load();
    } else if (stageVisible) { wallVideo.play().catch(() => {}); wallVideo.classList.add('on'); }
  } else {
    wallVideo.classList.remove('on');
    wallVideo.pause();
  }
  syncControls();
}

/* ---------------- big clock ---------------- */
const DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const MONTHS_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const p2 = n => String(n).padStart(2, '0');
// the clock ticks every second but touches the page only when a value really changes (the minute, the day);
// the colon blinks from here too, instead of a CSS animation that woke the page up on every frame
const setText = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };
function tickClock() {
  const d = new Date();
  setText($('#bcH'), p2(d.getHours()));
  setText($('#bcM'), p2(d.getMinutes()));
  $('.bc-colon')?.classList.toggle('dim', d.getSeconds() % 2 === 1);
  const en = window.ARWI_LANG?.() === 'en';
  setText($('#bcDay'), en ? d.toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase() : DAYS[d.getDay()]);
  setText($('#bcDate'), en ? `${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'long' })}  ${d.getFullYear()}` : `${d.getDate()} ${MONTHS[d.getMonth()]}  ${d.getFullYear()}`);
  const bc = `${p2(d.getHours())}:${p2(d.getMinutes())}<small>${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}</small>`;
  $$('.b-clock').forEach(c => { if (c.dataset.t !== bc) { c.innerHTML = bc; c.dataset.t = bc; } });
}

/* ---------------- bar ---------------- */
const bar = $('#bar'), barBody = $('#barBody');
const SVG_SEARCH = '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>';
const TRAY = `<div class="ti" title="Скрытые значки"><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg></div>
  <div class="ti" title="Язык ввода">RU</div>
  <div class="ti" title="Сеть"><svg viewBox="0 0 24 24"><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19" r=".6" fill="currentColor"/></svg></div>
  <div class="ti" title="Громкость: 60%"><svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg></div>`;

function deskHtml() {
  return [1, 2, 3].map(n => `<div class="b-desk${n === R.desk ? ' on' : ''}" data-desk="${n}">${n}</div>`).join('') + '<div class="b-desk add" data-add="1">+</div>';
}
function tasksHtml() {
  return TASKS.map(id => {
    const a = APPS[id];
    return `<div class="b-task" data-task="${id}" title=""><span class="ico">${ico(id)}</span><span class="lbl">${a.name}</span></div>`;
  }).join('');
}
function buildBar() {
  const b = S.bar, look = b.look;
  const vert = b.pos === 'left' || b.pos === 'right';
  const full = look === 'win11' || look === 'win10' || look === 'waybar';
  bar.className = `bar pos-${b.pos} look-${look}${vert ? ' vert' : ''}${full ? ' full' : ''}${b.grad ? ' bar-grad' : ''}`;
  const thick = look === 'waybar' ? Math.round(b.thick * .72) : look === 'dock' ? Math.round(b.thick * 1.12) : b.thick;
  bar.style.setProperty('--bt', thick + 'px');
  bar.style.setProperty('--ico', Math.round(thick * (look === 'dock' ? .62 : look === 'waybar' ? .6 : .56)) + 'px');
  const edge = vert ? 760 : 1280;
  bar.style.setProperty('--blen', look === 'dock' || look === 'label' ? 'auto' : full ? '100%' : Math.round(edge * b.len / 100) + 'px');
  const logo = '<div class="b-btn b-logo" data-act="win" title="Win-панель"><span class="logo-mark"></span></div>';
  const search = '<div class="b-btn b-search" data-act="search" title="Поиск · Win+S">' + SVG_SEARCH + '</div>';
  const field = `<div class="b-field" data-act="search">${SVG_SEARCH}<span>Поиск</span></div>`;
  const desks = `<div class="b-desks">${deskHtml()}</div>`;
  const tasks = `<div class="b-tasks">${tasksHtml()}</div>`;
  const tray = `<div class="b-tray">${TRAY}</div>`;
  const clock = '<div class="b-clock" title="Календарь"></div>';
  const mods = '<div class="b-mod">CPU 4%</div><div class="b-mod">🔊 60%</div><div class="b-mod">🔋 88%</div>';
  let html;
  switch (look) {
    case 'win11': html = `<div class="b-center">${logo}${search}${desks}${tasks}</div><div class="b-fill"></div>${tray}${clock}`; break;
    case 'win10': html = `${logo}${vert ? search : field}${desks}<div class="b-sep"></div>${tasks}<div class="b-fill"></div>${tray}${clock}<div class="b-show" title="Показать рабочий стол"></div>`; break;
    case 'waybar': html = `${desks}<div class="b-sep"></div>${tasks}<div class="b-fill"></div>${vert ? '' : mods}${tray}${clock}`; break;
    case 'dock': html = `${logo}${desks}<div class="b-sep"></div>${tasks}<div class="b-sep"></div>${tray}${clock}`; break;
    default: html = `${logo}${search}${desks}<div class="b-sep"></div>${tasks}<div class="b-fill"></div>${tray}${clock}`;
  }
  barBody.innerHTML = html;
  barBody.style.width = ''; barBody.style.height = '';
  if (look === 'dock' || look === 'label') { if (vert) barBody.style.height = 'auto'; else barBody.style.width = 'auto'; }
  bar.classList.toggle('off', !b.on);
  updateTaskStates();
  tickClock();
  updateConcealment(true);
  dockTargets = []; dockCur = []; dockBase = null;
}
function updateTaskStates() {
  $$('.b-task', barBody).forEach(el => {
    const a = APPS[el.dataset.task];
    const w = a.win && R.wins[a.win];
    el.classList.toggle('open', !!w && !w.closed);
    el.classList.toggle('focus', !!w && !w.closed && !w.min && w.desk === R.desk && R.top === a.win);
  });
  $$('.b-desk[data-desk]', barBody).forEach(el => el.classList.toggle('on', +el.dataset.desk === R.desk));
}

/* dock wave: icon under the cursor grows, neighbours fall off by a cosine of the distance */
let dockTargets = [], dockCur = [], dockRaf = 0, dockPointer = null, dockBase = null;
function dockFrame() {
  dockRaf = 0;
  const tasks = $$('.b-task', barBody);
  if (!tasks.length) return;
  const vert = bar.classList.contains('vert');
  const R0 = S.bar.wave, peak = S.bar.peak;
  let moving = false;
  // centres of the icons at rest: measured once per hover, so the spreading wave does not feed back into itself
  if (!dockBase || dockBase.length !== tasks.length) {
    dockBase = tasks.map((el, i) => {
      const s = dockCur[i] ?? 1, r = rectInStage(el);
      return s === 1 ? (vert ? r.y + r.h / 2 : r.x + r.w / 2) : null;
    });
    if (dockBase.includes(null)) dockBase = null;
  }
  tasks.forEach((el, i) => {
    let target = 1;
    if (dockPointer && S.bar.dock && dockBase) {
      const c = dockBase[i];
      const d = Math.abs((vert ? dockPointer[1] : dockPointer[0]) - c);
      const k = d >= R0 ? 0 : (Math.cos(Math.PI * d / R0) + 1) / 2;
      target = 1 + (peak - 1) * k;
    }
    const cur = dockCur[i] ?? 1;
    const next = reduceMotion ? target : cur + (target - cur) * .32;
    dockCur[i] = Math.abs(next - target) < .002 ? target : next;
    if (dockCur[i] !== target) moving = true;
    const s = dockCur[i];
    const origin = { bottom: '50% 100%', top: '50% 0%', left: '0% 50%', right: '100% 50%' }[S.bar.pos];
    el.style.transformOrigin = origin;
    el.style.transform = s === 1 ? '' : `scale(${s.toFixed(3)})`;
    const grow = (s - 1) * (vert ? el.offsetHeight : el.offsetWidth) / 2;
    el.style.margin = s === 1 ? '' : (vert ? `${grow.toFixed(1)}px 0` : `0 ${grow.toFixed(1)}px`);
    el.style.zIndex = s > 1.01 ? Math.round(s * 10) : '';
  });
  if (moving) dockRaf = requestAnimationFrame(dockFrame);
  else if (!dockPointer) dockBase = null;
}
const kickDock = () => { if (!dockRaf) dockRaf = requestAnimationFrame(dockFrame); };

/* ---------------- bar concealment under a maximised window ---------------- */
let concealTimer = 0;
function barOutTransform(peek) {
  const b = S.bar, look = b.look;
  const thick = parseFloat(bar.style.getPropertyValue('--bt')) || b.thick;
  const gap = bar.classList.contains('full') ? 0 : 10;
  const dist = thick + gap + 2 - (peek ? 5 : 0);
  return { bottom: `translateY(${dist}px)`, top: `translateY(${-dist}px)`, left: `translateX(${-dist}px)`, right: `translateX(${dist}px)` }[b.pos];
}
function shouldConceal() {
  return S.bar.on && R.maximized && S.bar.under !== 'none' && !R.popup && maxWinOnDesk();
}
function updateConcealment(instant) {
  bar.style.setProperty('--bar-out', barOutTransform(false));
  const want = shouldConceal() && !R.edgeHover;
  if (want === R.concealed && !instant) return;
  R.concealed = want;
  bar.classList.toggle('revealing', !want);
  bar.style.transform = want ? barOutTransform(S.bar.under === 'peek') : '';
}
function maxWinOnDesk() { return Object.values(R.wins).some(w => w.max && !w.min && !w.closed && w.desk === R.desk); }

/* ---------------- popups ---------------- */
const popWin = $('#popWin'), popSearch = $('#popSearch'), popDesk = $('#popDesk'), popPreview = $('#popPreview');
function popAnimClass(el) {
  ['anim-fade', 'anim-scale', 'anim-slide', 'anim-none'].forEach(c => el.classList.remove(c));
  el.classList.add('anim-' + S.bar.anim);
  el.style.setProperty('--pop-ms', S.bar.ms + 'ms');
  const d = { bottom: ['0px', '46px'], top: ['0px', '-46px'], left: ['-46px', '0px'], right: ['46px', '0px'] }[S.bar.on ? S.bar.pos : 'bottom'];
  el.style.setProperty('--sx', d[0]); el.style.setProperty('--sy', d[1]);
  el.style.transformOrigin = { bottom: '50% 100%', top: '50% 0', left: '0 50%', right: '100% 50%' }[S.bar.pos];
}
function placeBig(el) {
  const box = el.firstElementChild;
  const w = box.offsetWidth, h = box.offsetHeight;
  const br = rectInStage(barBody);
  let x = (1280 - w) / 2, y = (760 - h) / 2;
  if (S.bar.on) {
    if (S.bar.pos === 'bottom') y = br.y - h - 12;
    else if (S.bar.pos === 'top') y = br.y + br.h + 12;
    else if (S.bar.pos === 'left') { x = br.x + br.w + 12; y = (760 - h) / 2; }
    else { x = br.x - w - 12; y = (760 - h) / 2; }
  }
  el.style.left = clamp(x, 8, 1272 - w) + 'px';
  el.style.top = clamp(y, 8, 752 - h) + 'px';
}
function openPopup(name) {
  if (R.popup === name) { closePopups(); return; }
  closePopups(true);
  const el = name === 'win' ? popWin : popSearch;
  if (name === 'win') renderWinPanel(); else renderSearch();
  popAnimClass(el);
  el.classList.remove('on');
  placeBig(el);
  void el.offsetWidth;
  el.classList.add('on');
  R.popup = name;
  $$('.b-btn', barBody).forEach(b => b.classList.toggle('active', b.dataset.act === name));
  const inp = $('input', el);
  if (inp && matchMedia('(pointer:fine)').matches) setTimeout(() => inp.focus({ preventScroll: true }), 30);
  updateConcealment();
}
function closePopups(keep) {
  [popWin, popSearch].forEach(p => p.classList.remove('on'));
  $$('.b-btn', barBody).forEach(b => b.classList.remove('active'));
  R.popup = null;
  hideSmall();
  if (!keep) updateConcealment();
}

function renderWinPanel() {
  popWin.innerHTML = `<div class="pop-box">
    <div class="pw-search">${SVG_SEARCH}<input type="text" placeholder="Поиск приложений" aria-label="Поиск приложений"></div>
    <div class="pw-grid">
      <div class="card w-note" style="--i:0"><h6>Заметка</h6><p>Купить молоко<br>Проверить сервер<br>Позвонить дизайнеру</p></div>
      <div class="card w-weather" style="--i:1"><h6>Погода</h6><div class="ww"><div class="sun"></div><div><div class="deg">2°</div><div class="muted">Облачно</div></div></div><div class="muted" style="margin-top:8px">Влажность 81% · ветер 3 м/с</div></div>
      <div class="card w-copy" style="--i:2;grid-column:span 2"><h6>Быстрые вставки</h6><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><div class="cp" data-copy>Приветствие<small>Привет!</small></div><div class="cp" data-copy>Спасибо<small>Спасибо!</small></div></div></div>
    </div>
    <div class="pw-foot"><span>Закреплённые виджеты · Win</span><div class="pw-power" title="Питание"><svg viewBox="0 0 24 24"><path d="M12 3v8M6.3 6.3a8 8 0 1 0 11.4 0"/></svg></div></div>
  </div>`;
  $('input', popWin).addEventListener('input', e => { if (e.target.value) { const v = e.target.value; openPopup('search'); const i = $('input', popSearch); i.value = v; runSearch(v); } });
}

/* layout-inversion search: "сДшщт" finds CLion, "ашкуащч" finds Firefox */
const EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
const RU = 'йцукенгшщзхъфывапролджэячсмитьбюё';
const swapLayout = (s, from, to) => [...s].map(ch => { const lo = ch.toLowerCase(); const i = from.indexOf(lo); return i < 0 ? lo : to[i]; }).join('');
function renderSearch() {
  popSearch.innerHTML = `<div class="pop-box">
    <div class="ps-input">${SVG_SEARCH}<input type="text" placeholder="Поиск приложений" aria-label="Поиск приложений"></div>
    <div class="ps-results"><div class="ps-list" id="psList"></div><div class="ps-actions" id="psActions"></div></div>
  </div>`;
  const inp = $('input', popSearch);
  inp.addEventListener('input', () => runSearch(inp.value));
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const sel = $('.ps-item.sel', popSearch); if (sel) launch(sel.dataset.id); }
  });
  runSearch('');
}
function runSearch(q) {
  const list = $('#psList'), act = $('#psActions');
  if (!list) return;
  q = q.trim().toLowerCase();
  if (!q) {
    list.innerHTML = `<div class="ps-hint">Недавние приложения ниже. Попробуйте набрать название в неправильной раскладке: <b data-try="ашкуащч">ашкуащч</b> или <b data-try="сДшщт">сДшщт</b></div>` +
      ['browser', 'files', 'code', 'chat'].map((id, i) => item(id, APPS[id].name, i)).join('');
  } else {
    const variants = [[q, false], [swapLayout(q, RU, EN), true], [swapLayout(q, EN, RU), true]];
    const seen = new Set(), hits = [];
    for (const [v, inv] of variants) {
      if (!v) continue;
      SEARCH_IDS.forEach(id => {
        const name = window.tr(APPS[id].name), ln = name.toLowerCase();
        const at = ln.indexOf(v);
        if (at < 0 || seen.has(id)) return;
        seen.add(id);
        hits.push({ id, name, at, len: v.length, inv, rank: (at === 0 ? 0 : 1) + (inv ? 2 : 0) });
      });
    }
    hits.sort((a, b) => a.rank - b.rank);
    list.innerHTML = hits.length
      ? hits.slice(0, 7).map((h, i) => item(h.id, h.name.slice(0, h.at) + '<mark>' + h.name.slice(h.at, h.at + h.len) + '</mark>' + h.name.slice(h.at + h.len), i, h.inv ? 'найдено по другой раскладке' : 'Приложение')).join('')
      : '<div class="ps-empty">Ничего не нашлось</div>';
  }
  const first = $('.ps-item', list);
  if (first) first.classList.add('sel');
  act.innerHTML = first ? '<span>Открыть</span><span>От администратора</span><span>Открыть расположение</span><span>Закрепить на баре</span><span class="danger">Удалить</span>' : '';
  function item(id, label, i, sub) { return `<div class="ps-item" data-id="${id}" style="--i:${i}"><span class="ico">${ico(id)}</span><div>${label}${sub ? `<small>${sub}</small>` : ''}</div></div>`; }
}
function launch(id) {
  closePopups();
  const a = APPS[id];
  if (a && a.win) { const w = R.wins[a.win]; w.closed = false; w.min = false; w.desk = R.desk; layoutWindows(); focusWin(a.win); }
  else toast(`Запуск: ${a ? a.name : id}`);
}

/* small popovers: desk contents and window preview */
let smallTimer = 0;
function hideSmall() { clearTimeout(smallTimer); popDesk.classList.remove('on'); popPreview.classList.remove('on'); }
function placeSmall(el, anchor) {
  const a = rectInStage(anchor), box = el.firstElementChild;
  const w = box.offsetWidth, h = box.offsetHeight;
  let x = a.x + a.w / 2 - w / 2, y;
  const pos = S.bar.pos;
  if (pos === 'bottom') y = a.y - h - 14;
  else if (pos === 'top') y = a.y + a.h + 14;
  else { y = a.y + a.h / 2 - h / 2; x = pos === 'left' ? a.x + a.w + 14 : a.x - w - 14; }
  el.style.left = clamp(x, 6, 1274 - w) + 'px';
  el.style.top = clamp(y, 6, 754 - h) + 'px';
}
function showDeskPop(chip) {
  const n = +chip.dataset.desk;
  const wins = Object.entries(R.wins).filter(([, w]) => w.desk === n && !w.closed);
  popDesk.innerHTML = `<div class="pop-box"><h5>Рабочий стол ${n}</h5>${wins.length ? wins.map(([k, w]) => `<div class="pd-row" data-go="${k}"><span class="ico">${ico(w.app)}</span>${APPS[w.app].name}</div>`).join('') : '<div class="pd-empty">Пусто — окон нет</div>'}</div>`;
  popAnimClass(popDesk);
  popDesk.classList.remove('on');
  placeSmall(popDesk, chip);
  void popDesk.offsetWidth;
  popDesk.classList.add('on');
}
function showPreview(task) {
  const a = APPS[task.dataset.task];
  const w = a.win && R.wins[a.win];
  popPreview.innerHTML = `<div class="pop-box"><h5>${a.name}${w && !w.closed && w.desk !== R.desk ? ` · стол ${w.desk}` : ''}</h5>${w && !w.closed
    ? `<div class="pv-thumb${a.win === 'calc' ? ' dark' : ''}"><i style="top:24px"></i><i style="top:36px;right:60px"></i><i style="top:48px;right:80px"></i></div>`
    : '<div class="pd-empty">Закреплено · щёлкните, чтобы запустить</div>'}</div>`;
  popAnimClass(popPreview);
  popPreview.classList.remove('on');
  placeSmall(popPreview, task);
  void popPreview.offsetWidth;
  popPreview.classList.add('on');
}

/* bar events */
barBody.addEventListener('pointermove', e => { dockPointer = toStage(e.clientX, e.clientY); kickDock(); });
barBody.addEventListener('pointerleave', () => { dockPointer = null; kickDock(); });
barBody.addEventListener('click', e => {
  const act = e.target.closest('[data-act]');
  if (act) { hideSmall(); openPopup(act.dataset.act); return; }
  const desk = e.target.closest('.b-desk');
  if (desk) {
    hideSmall();
    if (desk.dataset.add) { toast('В ArWi «+» создаёт новый рабочий стол'); return; }
    switchDesk(+desk.dataset.desk);
    return;
  }
  const task = e.target.closest('.b-task');
  if (task) {
    hideSmall();
    closePopups();
    const a = APPS[task.dataset.task];
    if (!a.win) { toast(`Запуск: ${a.name}`); task.animate([{ translate: '0 0' }, { translate: S.bar.pos === 'top' ? '0 6px' : '0 -8px' }, { translate: '0 0' }], { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' }); return; }
    const w = R.wins[a.win];
    if (w.closed) { w.closed = false; w.min = false; w.desk = R.desk; layoutWindows(); focusWin(a.win); return; }
    if (w.desk !== R.desk) { switchDesk(w.desk); w.min = false; layoutWindows(); focusWin(a.win); toast(`Окно на столе ${w.desk} — переключились туда`); return; }
    if (!w.min && R.top === a.win) { w.min = true; } else { w.min = false; focusWin(a.win); }
    layoutWindows();
    return;
  }
  if (e.target.closest('.b-show')) { const anyOpen = Object.values(R.wins).some(w => !w.min && !w.closed && w.desk === R.desk); Object.values(R.wins).forEach(w => { if (w.desk === R.desk && !w.closed) w.min = anyOpen; }); layoutWindows(); return; }
  if (e.target.closest('.b-clock')) { toast('Щелчок по часам открывает календарь'); }
});
barBody.addEventListener('pointerover', e => {
  const desk = e.target.closest('.b-desk[data-desk]');
  const task = e.target.closest('.b-task');
  if (!desk && !task) return;
  clearTimeout(smallTimer);
  smallTimer = setTimeout(() => { if (R.popup) return; desk ? showDeskPop(desk) : showPreview(task); }, desk ? 260 : 420);
});
barBody.addEventListener('pointerout', e => {
  if (e.relatedTarget && (e.relatedTarget.closest?.('.b-desk,.b-task') === e.target.closest('.b-desk,.b-task'))) return;
  clearTimeout(smallTimer);
  smallTimer = setTimeout(() => { if (!popDesk.matches(':hover')) hideSmall(); }, 160);
});
popDesk.addEventListener('pointerleave', () => hideSmall());
popDesk.addEventListener('click', e => {
  const row = e.target.closest('[data-go]');
  if (!row) return;
  const w = R.wins[row.dataset.go];
  switchDesk(w.desk); w.min = false; layoutWindows(); focusWin(row.dataset.go); hideSmall();
});
popWin.addEventListener('click', e => { if (e.target.closest('[data-copy]')) toast('Скопировано в буфер'); if (e.target.closest('.pw-power')) toast('Здесь меню питания: сон, перезагрузка, выключение'); });
popSearch.addEventListener('click', e => {
  const tr = e.target.closest('[data-try]');
  if (tr) { const i = $('input', popSearch); i.value = tr.dataset.try; runSearch(tr.dataset.try); i.focus({ preventScroll: true }); return; }
  const it = e.target.closest('.ps-item');
  if (it) { launch(it.dataset.id); return; }
  if (e.target.closest('.ps-actions span')) toast('Действие с приложением');
});
popSearch.addEventListener('pointerover', e => { const it = e.target.closest('.ps-item'); if (!it) return; $$('.ps-item', popSearch).forEach(x => x.classList.toggle('sel', x === it)); });

stage.addEventListener('pointerdown', e => {
  if (R.popup && !e.target.closest('.popup') && !e.target.closest('[data-act]')) closePopups();
  if (!e.target.closest('.mf') && !e.target.closest('.mf-open')) $('#mfOpen').classList.remove('on');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePopups(); $('#mfOpen').classList.remove('on'); } });

/* reveal the hidden bar / widget panel when the pointer reaches the screen edge */
stage.addEventListener('pointermove', e => {
  const [x, y] = toStage(e.clientX, e.clientY);
  if (shouldConceal()) {
    const pos = S.bar.pos;
    const d = { bottom: 760 - y, top: y, left: x, right: 1280 - x }[pos];
    const thick = parseFloat(bar.style.getPropertyValue('--bt')) || 46;
    if (d < 18) { clearTimeout(concealTimer); if (!R.edgeHover) { R.edgeHover = true; updateConcealment(); } }
    else if (R.edgeHover && d > thick + 40) { clearTimeout(concealTimer); concealTimer = setTimeout(() => { R.edgeHover = false; updateConcealment(); }, 380); }
    else if (R.edgeHover) clearTimeout(concealTimer);
  }
  const wp = $('#wPanel');
  if (S.widgets.on && S.widgets.hide !== 'always') {
    const dx = S.widgets.side === 'right' ? 1280 - x : x;
    if (dx < 16) wp.classList.add('peek-open');
    else if (dx > 330) wp.classList.remove('peek-open');
  }
});
stage.addEventListener('pointerleave', () => {
  if (R.edgeHover) { R.edgeHover = false; updateConcealment(); }
  $('#wPanel').classList.remove('peek-open');
});

/* ---------------- desks & windows ---------------- */
function initWindows() {
  R.wins = {
    note: { app: 'notes', desk: 1, x: 150, y: 190, w: 380, h: 250, min: false, closed: false, max: false },
    calc: { app: 'calc', desk: 2, x: 440, y: 170, w: 250, h: 330, min: false, closed: false, max: false },
  };
  R.top = 'note';
  const host = $('#windows');
  host.innerHTML = `
  <div class="win" data-win="note">
    <div class="win-title"><span class="wi" style="--c:${APPS.notes.c}"></span><span>Заметки.txt — Блокнот</span>
      <div class="win-btn" data-wb="min"><svg viewBox="0 0 10 10"><path d="M1 5h8"/></svg></div><div class="win-btn" data-wb="max"><svg viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8"/></svg></div><div class="win-btn x" data-wb="close"><svg viewBox="0 0 10 10"><path d="m1 1 8 8M9 1 1 9"/></svg></div></div>
    <div class="win-menu"><span>Файл</span><span>Правка</span><span>Вид</span></div>
    <div class="win-body">Перетащите это окно за заголовок.<br>Оно прилипнет к краю экрана и к другим окнам, а если бросить его в движении — доедет по инерции.<br><br>Бросьте окно на номер стола на баре, чтобы перенести его на другой стол.</div>
  </div>
  <div class="win dark" data-win="calc">
    <div class="win-title"><span class="wi" style="--c:${APPS.calc.c}"></span><span>Калькулятор</span>
      <div class="win-btn" data-wb="min"><svg viewBox="0 0 10 10"><path d="M1 5h8"/></svg></div><div class="win-btn" data-wb="max"><svg viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8"/></svg></div><div class="win-btn x" data-wb="close"><svg viewBox="0 0 10 10"><path d="m1 1 8 8M9 1 1 9"/></svg></div></div>
    <div class="win-body"><div class="calc-disp">2 026</div><div class="calc-grid">${['%', 'CE', 'C', '⌫', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '±', '0', ',', '='].map(k => `<span${k === '=' ? ' class="eq"' : ''}>${k}</span>`).join('')}</div></div>
  </div>
  <div class="snap-guide" id="snapV"></div><div class="snap-guide" id="snapH"></div>`;
  $$('.win', host).forEach(el => {
    el.addEventListener('pointerdown', () => focusWin(el.dataset.win));
    $('.win-title', el).addEventListener('pointerdown', e => { if (!e.target.closest('.win-btn')) startDrag(e, el.dataset.win); });
    $('.win-title', el).addEventListener('dblclick', e => { if (!e.target.closest('.win-btn')) toggleMax(el.dataset.win); });
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-wb]');
      if (!b) return;
      const w = R.wins[el.dataset.win];
      if (b.dataset.wb === 'min') w.min = true;
      if (b.dataset.wb === 'close') { w.closed = true; w.max = false; R.maximized = maxWinOnDesk(); }
      if (b.dataset.wb === 'max') { toggleMax(el.dataset.win); return; }
      layoutWindows();
    });
  });
  layoutWindows();
}
function focusWin(k) {
  R.top = k;
  let z = 1;
  Object.keys(R.wins).forEach(key => { const el = $(`.win[data-win="${key}"]`); if (el) el.style.zIndex = key === k ? 5 : z++; });
  updateTaskStates();
}
function toggleMax(k) {
  const w = R.wins[k];
  w.max = !w.max;
  R.maximized = maxWinOnDesk();
  focusWin(k);
  layoutWindows();
}
function layoutWindows() {
  Object.entries(R.wins).forEach(([k, w]) => {
    const el = $(`.win[data-win="${k}"]`);
    el.classList.toggle('other-desk', w.desk !== R.desk);
    el.classList.toggle('hidden', w.min || w.closed);
    el.classList.toggle('max', w.max);
    if (w.max) { el.style.left = '0px'; el.style.top = '0px'; el.style.width = '1280px'; el.style.height = '760px'; }
    else { el.style.left = w.x + 'px'; el.style.top = w.y + 'px'; el.style.width = w.w + 'px'; el.style.height = w.h + 'px'; }
  });
  R.maximized = maxWinOnDesk();
  $('#btnMax').textContent = R.maximized ? 'Вернуть окно' : 'Развернуть окно';
  updateTaskStates();
  updateConcealment();
}
function switchDesk(n) {
  if (n === R.desk) return;
  R.desk = n; // instant, as in ArWi: no slide animation between desks
  R.edgeHover = false;
  layoutWindows();
  const top = Object.entries(R.wins).find(([, w]) => w.desk === n && !w.closed && !w.min);
  if (top) focusWin(top[0]);
}

/* drag with magnet and inertia (ArWi "Окна" module) */
let drag = null;
function snapTargets(k) {
  const xs = [0, 1280], ys = [0, 760];
  if (S.bar.on && !R.concealed) {
    const br = rectInStage(barBody);
    if (S.bar.pos === 'bottom') ys.push(br.y - 6); if (S.bar.pos === 'top') ys.push(br.y + br.h + 6);
    if (S.bar.pos === 'left') xs.push(br.x + br.w + 6); if (S.bar.pos === 'right') xs.push(br.x - 6);
  }
  if (S.widgets.on && !$('#wPanel').classList.contains('collapsed') && S.widgets.hide === 'always') {
    const wr = rectInStage($('#wPanel'));
    xs.push(S.widgets.side === 'right' ? wr.x - 8 : wr.x + wr.w + 8);
  }
  Object.entries(R.wins).forEach(([key, w]) => {
    if (key === k || w.desk !== R.desk || w.min || w.closed || w.max) return;
    xs.push(w.x, w.x + w.w); ys.push(w.y, w.y + w.h);
  });
  return { xs, ys };
}
function snapAxis(pos, size, lines, dist) {
  let best = null;
  for (const L of lines) {
    for (const [edge, off] of [[pos, 0], [pos + size, size]]) {
      const d = Math.abs(edge - L);
      if (d < dist && (!best || d < best.d)) best = { d, v: L - off, line: L };
    }
  }
  return best;
}
function guide(id, line, vertical) {
  const g = $(id);
  if (line == null) { g.classList.remove('on'); return; }
  Object.assign(g.style, vertical ? { left: line - 1 + 'px', top: '0', width: '2px', height: '760px' } : { top: line - 1 + 'px', left: '0', height: '2px', width: '1280px' });
  g.classList.add('on');
}
function startDrag(e, k) {
  const w = R.wins[k];
  e.preventDefault();
  const el = $(`.win[data-win="${k}"]`);
  const [px, py] = toStage(e.clientX, e.clientY);
  if (w.max) { // pull a maximised window down, like Windows does
    w.max = false;
    w.x = clamp(px - w.w / 2, 0, 1280 - w.w); w.y = Math.max(0, py - 16);
    R.maximized = maxWinOnDesk();
    layoutWindows();
  }
  cancelAnimationFrame(w.slide || 0);
  drag = { k, el, dx: px - w.x, dy: py - w.y, hist: [[performance.now(), px, py]], overDesk: null };
  el.classList.add('dragging');
  el.setPointerCapture(e.pointerId);
  el.addEventListener('pointermove', onDrag);
  el.addEventListener('pointerup', endDrag, { once: true });
  el.addEventListener('pointercancel', endDrag, { once: true });
}
function onDrag(e) {
  if (!drag) return;
  const w = R.wins[drag.k];
  const [px, py] = toStage(e.clientX, e.clientY);
  let x = px - drag.dx, y = py - drag.dy;
  let gx = null, gy = null;
  if (S.win.magnet && !e.altKey) {
    const t = snapTargets(drag.k);
    const sx = snapAxis(x, w.w, t.xs, S.win.dist), sy = snapAxis(y, w.h, t.ys, S.win.dist);
    if (sx) { x = sx.v; gx = sx.line; }
    if (sy) { y = sy.v; gy = sy.line; }
  }
  w.x = clamp(x, -w.w + 80, 1280 - 80); w.y = clamp(y, 0, 760 - 32);
  drag.el.style.left = w.x + 'px'; drag.el.style.top = w.y + 'px';
  guide('#snapV', gx, true); guide('#snapH', gy, false);
  drag.hist.push([performance.now(), px, py]);
  if (drag.hist.length > 6) drag.hist.shift();
  // dropping a window on a desk number moves it to that desk
  const under = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.classList?.contains('b-desk') && n.dataset.desk);
  if (drag.overDesk && drag.overDesk !== under) drag.overDesk.classList.remove('drop');
  drag.overDesk = under || null;
  if (under) under.classList.add('drop');
}
function endDrag() {
  if (!drag) return;
  const { k, el, hist, overDesk } = drag;
  el.removeEventListener('pointermove', onDrag);
  el.classList.remove('dragging');
  guide('#snapV', null); guide('#snapH', null);
  const w = R.wins[k];
  drag = null;
  if (overDesk) {
    overDesk.classList.remove('drop');
    const n = +overDesk.dataset.desk;
    if (n !== w.desk) { w.desk = n; w.y = Math.min(w.y, 380); layoutWindows(); toast(`Окно перенесено на стол ${n}`); return; }
  }
  if (!S.win.inertia || hist.length < 2) return;
  const a = hist[0], b = hist[hist.length - 1];
  const dt = Math.max(16, b[0] - a[0]);
  let vx = (b[1] - a[1]) / dt * 16, vy = (b[2] - a[2]) / dt * 16; // px per frame
  if (Math.hypot(vx, vy) < 2.5) return;
  el.classList.add('sliding');
  const friction = 1 - (8 + S.win.dist * 0) / 100; // ArWi default slowdown feels like ~0.92 per frame
  let last = performance.now();
  const step = now => {
    const f = Math.min(3, (now - last) / 16.7); last = now;
    w.x += vx * f; w.y += vy * f;
    const decay = Math.pow(friction, f);
    vx *= decay; vy *= decay;
    // catch edges on the fly when the magnet is on, otherwise bounce off the screen bounds
    if (w.x < 0) { w.x = 0; vx = S.win.magnet ? 0 : -vx * .4; }
    if (w.x + w.w > 1280) { w.x = 1280 - w.w; vx = S.win.magnet ? 0 : -vx * .4; }
    if (w.y < 0) { w.y = 0; vy = S.win.magnet ? 0 : -vy * .4; }
    const floor = 760 - (S.bar.on && S.bar.pos === 'bottom' && !R.concealed ? rectInStage(barBody).h + 16 : 0);
    if (w.y + w.h > floor) { w.y = floor - w.h; vy = S.win.magnet ? 0 : -vy * .4; }
    el.style.left = w.x + 'px'; el.style.top = w.y + 'px';
    if (Math.hypot(vx, vy) > .15) w.slide = requestAnimationFrame(step);
    else { el.classList.remove('sliding'); w.slide = 0; }
  };
  w.slide = requestAnimationFrame(step);
}

/* ---------------- widget panel ---------------- */
const W = {
  weather: () => `<div class="card w-weather"><h6>Погода</h6><div class="ww"><div class="sun"></div><div><div class="deg">2°</div><div class="muted">Облачно</div></div></div><div class="muted" style="margin-top:8px">Влажность 81% · ветер 3 м/с<br>Восход 08:02 · закат 16:24</div></div>`,
  note: () => `<div class="card w-note"><h6>Заметка</h6><p>Купить молоко<br>Проверить сервер<br>Позвонить дизайнеру</p></div>`,
  player: () => `<div class="card w-player${player.on ? ' playing' : ''}"><h6>Плеер</h6><div class="pl"><div class="cover"></div><div><div class="tt">Night Drive</div><div class="muted">Synthwave Radio</div></div></div><div class="ctr"><b></b><em data-play></em><b></b></div><div class="track"><i style="--v:${player.p}%"></i></div></div>`,
  res: () => `<div class="card w-res"><h6>Ресурсы ArWi</h6>${[['CPU', res.cpu], ['RAM', res.ram], ['GPU', res.gpu]].map(([n, v]) => `<div class="rr"><span class="muted">${n}</span><div class="track"><i data-res="${n}" style="--v:${v}%"></i></div><span data-resv="${n}">${v.toFixed(n === 'CPU' ? 1 : 0)}%</span></div>`).join('')}</div>`,
  pomodoro: () => `<div class="card w-pomo"><h6>Помодоро</h6><div class="pt" data-pomo>${fmt(pomo.left)}</div><div class="track" style="margin-top:6px"><i data-pomobar style="--v:${100 - pomo.left / 15}%"></i></div><button data-pomobtn>${pomo.on ? 'Пауза' : 'Старт'}</button></div>`,
  calendar: () => { const d = new Date(), first = (new Date(d.getFullYear(), d.getMonth(), 1).getDay() + 6) % 7, days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); let g = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(x => `<b>${x}</b>`).join(''); for (let i = 0; i < first; i++) g += '<span></span>'; for (let i = 1; i <= days; i++) g += `<span class="${i === d.getDate() ? 'today' : ''}${i % 9 === 3 ? ' dotted' : ''}">${i}</span>`; return `<div class="card w-cal"><h6>${window.ARWI_LANG?.() === 'en' ? d.toLocaleDateString('en-GB', { month: 'long' }) : MONTHS_NOM[d.getMonth()]} ${d.getFullYear()}</h6><div class="cg">${g}</div></div>`; },
  currency: () => `<div class="card w-cur"><h6>Валюты</h6><div class="cr"><span>USD</span><b>81,42 <span class="up">▲</span></b></div><div class="cr"><span>EUR</span><b>94,10 <span class="dn">▼</span></b></div><div class="cr"><span>BTC</span><b>$96 210 <span class="up">▲</span></b></div></div>`,
  copy: () => `<div class="card w-copy"><h6>Быстрые вставки</h6><div class="cp" data-copy>Приветствие<small>Привет!</small></div><div class="cp" data-copy>Спасибо<small>Спасибо!</small></div></div>`,
  checklist: () => `<div class="card w-check"><h6>Чек-лист</h6>${checks.map((c, i) => `<label class="${c[1] ? 'done' : ''}" data-chk="${i}"><i></i>${c[0]}</label>`).join('')}</div>`,
  stopwatch: () => `<div class="card w-sw"><h6>Секундомер</h6><div class="pt" data-sw>${fmtMs(sw.ms)}</div><div style="text-align:center"><button data-swbtn style="margin-top:8px;border:var(--t-bw) solid var(--t-bc);background:color-mix(in srgb,var(--t-accent) 18%,transparent);color:var(--t-fg);border-radius:calc(var(--t-r)*.5);padding:5px 14px;font-size:11.5px;font-weight:600;cursor:pointer">${sw.on ? 'Стоп' : 'Старт'}</button></div></div>`,
};
const player = { on: true, p: 34 };
const res = { cpu: 0.1, ram: 22, gpu: 3 };
const pomo = { left: 25 * 60, on: false };
const sw = { ms: 0, on: false, t0: 0 };
const checks = [['Обновить драйверы', true], ['Собрать свой стол', false], ['Подписаться на канал', false]];
const fmt = s => `${p2(Math.floor(s / 60))}:${p2(s % 60)}`;
const fmtMs = ms => `${p2(Math.floor(ms / 60000))}:${p2(Math.floor(ms / 1000) % 60)}.${Math.floor(ms / 100) % 10}`;
function renderWidgets() {
  const wp = $('#wPanel'), inner = $('#wpInner');
  const w = S.widgets;
  wp.classList.toggle('off', !w.on);
  wp.classList.remove('side-left', 'side-right', 'hide-always', 'hide-peek', 'hide-hidden');
  wp.classList.add('side-' + w.side, 'hide-' + w.hide);
  if (w.hide !== 'always') wp.classList.remove('collapsed');
  inner.innerHTML = WIDGETS.filter(([id]) => w.list.includes(id)).map(([id]) => W[id]()).join('') || '<div class="card"><h6>Пусто</h6><div class="muted">Включите виджеты в настройках справа</div></div>';
  $$('.card', inner).forEach((c, i) => c.style.animationDelay = i * 45 + 'ms');
  // keep the bar from overlapping the panel: shift panel away from a vertical bar on the same side
  const barSide = S.bar.on && (S.bar.pos === 'left' || S.bar.pos === 'right') ? S.bar.pos : null;
  const off = barSide === w.side ? (parseFloat(bar.style.getPropertyValue('--bt')) || 46) + 22 : 14;
  wp.style.right = w.side === 'right' ? off + 'px' : '';
  wp.style.left = w.side === 'left' ? off + 'px' : '';
  const bottomBar = S.bar.on && S.bar.pos === 'bottom' && !R.concealed ? (parseFloat(bar.style.getPropertyValue('--bt')) || 46) + 22 : 14;
  const topBar = S.bar.on && S.bar.pos === 'top' ? (parseFloat(bar.style.getPropertyValue('--bt')) || 46) + 22 : 14;
  wp.style.bottom = bottomBar + 'px'; wp.style.top = topBar + 'px';
  $('#bigClock').classList.toggle('off', !w.clock);
  placeFolders();
}
$('#wpArrow').addEventListener('click', () => $('#wPanel').classList.toggle('collapsed'));
$('#wpInner').addEventListener('click', e => {
  if (e.target.closest('[data-play]')) { player.on = !player.on; e.target.closest('.w-player').classList.toggle('playing', player.on); }
  if (e.target.closest('[data-copy]')) toast('Скопировано в буфер');
  if (e.target.closest('[data-pomobtn]')) { pomo.on = !pomo.on; e.target.textContent = pomo.on ? 'Пауза' : 'Старт'; }
  if (e.target.closest('[data-swbtn]')) { sw.on = !sw.on; sw.t0 = performance.now() - sw.ms; e.target.textContent = sw.on ? 'Стоп' : 'Старт'; if (sw.on) swLoop(); }
  const chk = e.target.closest('[data-chk]');
  if (chk) { const c = checks[+chk.dataset.chk]; c[1] = !c[1]; chk.classList.toggle('done', c[1]); }
});
function swLoop() {
  if (!sw.on) return;
  sw.ms = performance.now() - sw.t0;
  const el = $('[data-sw]'); if (el) el.textContent = fmtMs(sw.ms);
  if (stageVisible) requestAnimationFrame(swLoop); else setTimeout(swLoop, 500);
}
function widgetTick() {
  if (player.on) { player.p = (player.p + .6) % 100; const t = $('.w-player .track i'); if (t) t.style.setProperty('--v', player.p + '%'); }
  if (pomo.on && pomo.left > 0) { pomo.left--; const el = $('[data-pomo]'); if (el) el.textContent = fmt(pomo.left); const b = $('[data-pomobar]'); if (b) b.style.setProperty('--v', (100 - pomo.left / 15) + '%'); }
}
function resTick() {
  res.cpu = clamp(res.cpu + (Math.random() - .5) * .08, .05, .3);
  res.ram = clamp(res.ram + (Math.random() - .5) * 1.2, 18, 26);
  res.gpu = clamp(res.gpu + (Math.random() - .5) * 1.5, 1, 6);
  [['CPU', res.cpu, 1], ['RAM', res.ram, 0], ['GPU', res.gpu, 0]].forEach(([n, v, d]) => {
    const t = $(`[data-res="${n}"]`), s = $(`[data-resv="${n}"]`);
    if (t) t.style.setProperty('--v', (n === 'CPU' ? v * 20 : v) + '%');
    if (s) s.textContent = v.toFixed(d) + '%';
  });
}

/* ---------------- mini folders ---------------- */
const FOLDERS = [
  { name: 'Игры', apps: ['game', 'cube', 'rec', 'discord', 'chat', 'music', 'browser', 'files', 'spot'] },
  { name: 'Работа', apps: ['code', 'term', 'clion', 'ps', 'cmd', 'notes', 'calc', 'files', 'gear'] },
  { name: 'Медиа', apps: ['paint', 'music', 'rec', 'spot'] },
];
function renderFolders() {
  const host = $('#miniFolders');
  host.className = 'minifolders' + (S.folders.on ? '' : ' off');
  host.innerHTML = FOLDERS.map((f, i) => `<div class="mf mf-${S.folders.shape}" data-f="${i}" title="${f.name}">${f.apps.slice(0, S.folders.shape === 'capsule' ? 8 : 9).map(a => `<i style="--c:${APPS[a].c}"></i>`).join('')}</div>`).join('');
  placeFolders();
}
function placeFolders() {
  const host = $('#miniFolders');
  const panelRight = S.widgets.on && S.widgets.side === 'right';
  const vBarLeft = S.bar.on && S.bar.pos === 'left';
  host.style.left = panelRight ? (vBarLeft ? '96px' : '40px') : 'auto';
  host.style.right = panelRight ? 'auto' : (S.bar.on && S.bar.pos === 'right' ? '96px' : '40px');
  host.style.top = S.bar.on && S.bar.pos === 'top' ? '120px' : '90px';
}
$('#miniFolders').addEventListener('click', e => {
  const tile = e.target.closest('.mf');
  if (!tile) return;
  const f = FOLDERS[+tile.dataset.f];
  const open = $('#mfOpen');
  open.innerHTML = `<h5>${f.name}</h5><div class="mfo-grid">${f.apps.map(a => `<div class="mfo-app"><span style="width:30px;height:30px;display:block">${ico(a)}</span><span class="mfo-name">${APPS[a].name}</span></div>`).join('')}</div>`;
  const r = rectInStage(tile);
  const leftSide = r.x < 640;
  open.style.transformOrigin = leftSide ? 'left center' : 'right center';
  open.style.left = (leftSide ? r.x + r.w + 12 : r.x - 272) + 'px';
  open.style.top = clamp(r.y - 40, 10, 500) + 'px';
  open.classList.remove('on'); void open.offsetWidth; open.classList.add('on');
});
$('#mfOpen').addEventListener('click', e => { const a = e.target.closest('.mfo-app'); if (a) { toast('Запуск: ' + $('.mfo-name', a).textContent); $('#mfOpen').classList.remove('on'); } });

/* ---------------- toast ---------------- */
let toastTimer = 0;
function toast(text) {
  const t = $('#stageToast');
  t.textContent = text;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 1900);
}

/* ---------------- controls ---------------- */
const page = name => $(`.page[data-page="${name}"]`);
const seg = (key, opts) => `<div class="seg" data-seg="${key}">${opts.map(([v, l]) => `<button type="button" data-v="${v}">${l}</button>`).join('')}</div>`;
const tgl = (key, label, note) => `<div class="row"><span>${label}${note ? `<small>${note}</small>` : ''}</span><button type="button" class="tgl" data-tgl="${key}" aria-label="${label}"></button></div>`;
const rng = (key, label, min, max, step, unit) => `<div class="group"><div class="g-title">${label}</div><div class="rng"><input type="range" data-rng="${key}" min="${min}" max="${max}" step="${step}" aria-label="${label}"><output data-out="${key}"></output></div></div>`.replace('</div></div>', `</div></div>`).replace(/data-out="([^"]+)"/, `data-out="$1" data-unit="${unit || ''}"`);
const get = path => path.split('.').reduce((o, k) => o?.[k], S);
function set(path, v) { const ks = path.split('.'); let o = S; ks.slice(0, -1).forEach(k => o = o[k]); o[ks.at(-1)] = v; }

function buildControls() {
  const extra = ['#88C0D0', '#E8142C', '#C5F13A', '#FF8C42', '#CBA6F7', '#7AA2F7', '#F0410E', '#4C59B0', '#FFD400', '#2AABEE'];
  page('theme').innerHTML = `
    <div class="group"><div class="g-title">Встроенные темы <small>13 штук</small></div><div class="theme-cards">${THEMES.map(t => `
      <button type="button" class="tcard" data-id="${t.id}" style="background-image:url(assets/wall/thumb/${t.id}.webp)" title="${t.desc}">
        <span class="tc-check"></span><span class="tc-dots">${t.pal.map(c => `<i style="--c:${c}"></i>`).join('')}</span><span class="tc-name">${t.name}</span></button>`).join('')}</div></div>
    <div class="group"><div class="g-title">Акцент</div><div class="swatches" id="accSw"></div><p class="g-note" id="customNote">Встроенные темы в ArWi не испортить: любая правка создаёт вашу копию темы — «Настроить под себя».</p></div>
    ${rng('ov.radius', 'Скругление карточек', 0, 36, 1, 'px')}
    ${rng('ov.alpha', 'Плотность карточек', .2, 1, .01, '%')}
    <div class="group"><div class="g-title">Тень</div>${seg('ov.shadow', [['none', 'Нет'], ['soft', 'Мягкая'], ['hard', 'Жёсткая'], ['glow', 'Свечение']])}</div>
    <div class="group"><div class="g-title">Заголовки карточек</div>${seg('ov.hs', [['classic', 'Обычные'], ['mono', 'Моно [ TUI ]'], ['brutal', 'КАПС']])}</div>`;
  $('#accSw').innerHTML = '<span id="accTheme"></span>' + extra.map(c => `<button type="button" class="sw" data-acc="${c}" style="--c:${c}" aria-label="Акцент ${c}"></button>`).join('') + '<label class="sw sw-pick" title="Свой цвет"><input type="color" id="accPick" aria-label="Свой цвет акцента"></label>';

  page('bar').innerHTML = `
    <div class="group">${tgl('bar.on', 'Показывать бар', 'вместо панели задач Windows')}</div>
    <div class="group"><div class="g-title">Вид полосы</div>${seg('bar.look', LOOKS)}</div>
    <div class="group"><div class="g-title">Край экрана</div>${seg('bar.pos', [['bottom', 'Снизу'], ['top', 'Сверху'], ['left', 'Слева'], ['right', 'Справа']])}</div>
    ${rng('bar.len', 'Длина', 30, 100, 1, '%')}
    ${rng('bar.thick', 'Толщина', 34, 64, 1, 'px')}
    ${rng('bar.radius', 'Скругление', 0, 30, 1, 'px')}
    ${rng('bar.transp', 'Прозрачность', 0, 90, 1, '%')}
    <div class="group"><div class="g-title">Цвет бара</div><div class="swatches" id="barSw"></div>${tgl('bar.grad', 'Градиент', 'из цветов темы')}</div>
    <div class="group">${tgl('bar.dock', 'Dock-анимация значков', 'значок под курсором растёт волной')}
      <div class="rng" style="margin-top:6px"><input type="range" data-rng="bar.peak" min="1.1" max="2.6" step=".05" aria-label="Пиковый масштаб"><output data-out="bar.peak" data-unit="×"></output></div>
      <p class="g-note">Пиковый масштаб. В ArWi значки могут вырасти до 500% и выйти за пределы бара.</p></div>
    <div class="group"><div class="g-title">Под развёрнутым окном</div>${seg('bar.under', [['none', 'Ничего'], ['peek', 'Полоска'], ['hide', 'Скрывать']])}
      <p class="g-note">Нажмите «Развернуть окно» под макетом и подведите мышь к краю — бар выедет с лёгкой инерцией.</p></div>
    <div class="group"><div class="g-title">Анимация всплывающих окон</div>${seg('bar.anim', [['scale', 'Масштаб'], ['slide', 'Выезд'], ['fade', 'Проявление'], ['none', 'Без']])}
      <div class="rng" style="margin-top:10px"><input type="range" data-rng="bar.ms" min="80" max="600" step="10" aria-label="Длительность"><output data-out="bar.ms" data-unit="мс"></output></div>
      <p class="g-note">Одна анимация на Win-панель, поиск, превью окон и столов. Щёлкните логотип или лупу на баре.</p></div>`;
  $('#barSw').innerHTML = '<span id="barTheme"></span>' + extra.map(c => `<button type="button" class="sw" data-baracc="${c}" style="--c:${c}" aria-label="Цвет бара ${c}"></button>`).join('');

  page('widgets').innerHTML = `
    <div class="group">${tgl('widgets.on', 'Панель виджетов')}${tgl('widgets.clock', 'Большие часы на столе')}</div>
    <div class="group"><div class="g-title">Виджеты на панели <small>щёлкните, чтобы включить</small></div><div class="wlist">${WIDGETS.map(([id, n]) => `<button type="button" class="wchip" data-w="${id}"><i></i>${n}</button>`).join('')}</div>
      <p class="g-note">В ArWi есть ещё GitHub, Discord, статусы сайтов, калькулятор, Bash-заготовки и запуск приложений.</p></div>
    <div class="group"><div class="g-title">Край</div>${seg('widgets.side', [['left', 'Слева'], ['right', 'Справа']])}</div>
    <div class="group"><div class="g-title">Скрытие панели</div>${seg('widgets.hide', [['always', 'Всегда видна'], ['peek', 'Полоска'], ['hide', 'Скрывать']])}
      <p class="g-note">В режимах «Полоска» и «Скрывать» панель выезжает, когда мышь у края экрана. Стрелка сбоку сворачивает её целиком.</p></div>`;

  page('wall').innerHTML = `
    <div class="group"><div class="g-title">Источник</div>${seg('wall.mode', [['theme', 'Обои темы'], ['pick', 'Галерея'], ['gradient', 'Градиент'], ['custom', 'Свой файл']])}</div>
    <div class="group" id="wallGalleryG"><div class="g-title">Галерея <small>обои встроенных тем</small></div><div class="wall-grid">${WALLS.map(id => `<button type="button" class="wcard" data-wall="${id}" style="background-image:url(assets/wall/thumb/${id}.webp)" aria-label="Обои ${id}"></button>`).join('')}</div></div>
    <div class="group">${tgl('wall.live', 'Живые обои', 'видео-версия обоев, где она есть')}<p class="g-note" id="liveNote"></p></div>
    <div class="group"><label class="upload"><input type="file" accept="image/*" id="wallFile"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>Загрузить свою картинку</label>
      <p class="g-note">Картинка остаётся только в этой вкладке браузера и никуда не отправляется.</p></div>`;

  page('more').innerHTML = `
    <div class="group">${tgl('folders.on', 'Мини-папки на столе', 'щёлкните папку на макете')}<div class="g-title" style="margin-top:8px">Форма плитки</div>${seg('folders.shape', [['round', 'Скруглённая'], ['circle', 'Круг'], ['capsule', 'Капсула'], ['hex', 'Шестиугольник'], ['cut', 'Срезанные углы']])}</div>
    <div class="group"><div class="g-title">Окна</div>${tgl('win.magnet', 'Магнит', 'окна прилипают к краям и друг к другу')}
      <div class="rng"><input type="range" data-rng="win.dist" min="4" max="40" step="1" aria-label="Дистанция притягивания"><output data-out="win.dist" data-unit="px"></output></div>
      ${tgl('win.inertia', 'Инерция', 'брошенное окно доезжает и тормозит')}${tgl('win.border', 'Цветная рамка окон', 'цвет акцента темы')}</div>
    <div class="group"><div class="g-title">Рабочие столы</div><p class="g-note" style="margin-top:0">Наведите на номер стола на баре — появится список его окон. Переключение мгновенное, без анимации. Окно можно перетащить прямо на номер другого стола.</p></div>`;

  // events
  $('#tabPages').addEventListener('click', onControlClick);
  $('#tabPages').addEventListener('input', onControlInput);
  $('#wallFile').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { customWall = rd.result; S.wall.mode = 'custom'; applyWall(); };
    rd.readAsDataURL(f);
  });
  syncControls();
}
function onControlClick(e) {
  const b = e.target.closest('button');
  if (!b) return;
  const segEl = b.closest('[data-seg]');
  if (segEl) { set(segEl.dataset.seg, b.dataset.v); return changed(segEl.dataset.seg); }
  if (b.dataset.tgl) { set(b.dataset.tgl, !get(b.dataset.tgl)); return changed(b.dataset.tgl); }
  if (b.classList.contains('tcard')) { setTheme(b.dataset.id); return; }
  if (b.dataset.acc !== undefined) { S.ov.accent = b.dataset.acc === '' ? null : b.dataset.acc; return changed('ov.accent'); }
  if (b.dataset.baracc !== undefined) { S.bar.accent = b.dataset.baracc || null; return changed('bar.accent'); }
  if (b.dataset.w) { const l = S.widgets.list; const i = l.indexOf(b.dataset.w); i < 0 ? l.push(b.dataset.w) : l.splice(i, 1); return changed('widgets.list'); }
  if (b.dataset.wall) { S.wall.mode = 'pick'; S.wall.pick = b.dataset.wall; return changed('wall'); }
}
function onControlInput(e) {
  const r = e.target.closest('[data-rng]');
  if (r) { set(r.dataset.rng, +r.value); changed(r.dataset.rng, true); return; }
  if (e.target.id === 'accPick') { S.ov.accent = e.target.value.toUpperCase(); changed('ov.accent'); }
}
function setTheme(id) {
  S.theme = id;
  S.ov = clone(DEFAULT.ov);
  S.bar.accent = null; S.bar.radius = null; S.bar.transp = null;
  if (S.wall.mode === 'pick') S.wall.mode = 'theme';
  changed('theme');
}
function changed(path, live) {
  const top = path.split('.')[0];
  if (top === 'theme' || top === 'ov') { applyTheme(); applyWall(); renderWidgets(); }
  if (top === 'bar') {
    if (/^bar\.(peak|ms|accent|transp|radius|grad|gradAngle)$/.test(path)) applyTheme();
    if (!/^bar\.(peak|ms|anim|dock|wave|under|accent|transp)$/.test(path)) buildBar();
    if (path === 'bar.under' || path === 'bar.on') updateConcealment(true);
    if (path === 'bar.peak') { dockPointer = null; demoDockPulse(); }
    renderWidgets();
  }
  if (top === 'widgets') renderWidgets();
  if (top === 'wall') applyWall();
  if (top === 'folders') renderFolders();
  if (top === 'win') stage.classList.toggle('win-border', S.win.border);
  syncControls();
  save();
  if (!live) closePopups();
}
function demoDockPulse() {
  // show the new peak once: sweep a virtual pointer across the icons
  const tasks = $$('.b-task', barBody);
  if (!tasks.length) return;
  const a = rectInStage(tasks[0]), b = rectInStage(tasks.at(-1));
  const vert = bar.classList.contains('vert');
  const from = vert ? a.y : a.x, to = vert ? b.y + b.h : b.x + b.w;
  const t0 = performance.now();
  const run = now => {
    const k = Math.min(1, (now - t0) / 700);
    const p = from + (to - from) * k;
    dockPointer = vert ? [0, p] : [p, 0];
    kickDock();
    if (k < 1) requestAnimationFrame(run); else { dockPointer = null; kickDock(); }
  };
  requestAnimationFrame(run);
}
function syncControls() {
  const t = TH[S.theme];
  $$('[data-seg]').forEach(s => {
    let v = get(s.dataset.seg);
    if (v == null && s.dataset.seg === 'ov.shadow') v = t.shadow;
    if (v == null && s.dataset.seg === 'ov.hs') v = t.hs;
    $$('button', s).forEach(b => b.classList.toggle('on', b.dataset.v === v));
  });
  $$('[data-tgl]').forEach(b => b.classList.toggle('on', !!get(b.dataset.tgl)));
  const defaults = { 'ov.radius': t.radius, 'ov.alpha': t.cardA, 'bar.radius': t.barR, 'bar.transp': 100 - t.barOp };
  $$('[data-rng]').forEach(r => {
    let v = get(r.dataset.rng);
    if (v == null) v = defaults[r.dataset.rng];
    r.value = v;
    const p = (v - r.min) / (r.max - r.min) * 100;
    r.style.setProperty('--p', p + '%');
    const o = $(`[data-out="${r.dataset.rng}"]`);
    if (o) { const u = o.dataset.unit; o.textContent = u === '%' && r.dataset.rng === 'ov.alpha' ? Math.round(v * 100) + '%' : u === '×' ? (+v).toFixed(2) + '×' : v + (u ? (u === 'мс' ? ' мс' : u) : ''); }
  });
  const lenDisabled = ['win11', 'win10', 'waybar', 'dock', 'label'].includes(S.bar.look);
  const lenR = $('[data-rng="bar.len"]'); if (lenR) { lenR.disabled = lenDisabled; lenR.closest('.group').style.opacity = lenDisabled ? .45 : 1; }
  const accTheme = $('#accTheme');
  if (accTheme) accTheme.outerHTML = `<button type="button" class="sw" id="accTheme" data-acc="" style="--c:${t.accent}" title="Акцент темы"></button>`;
  $$('[data-acc]').forEach(b => b.classList.toggle('on', (b.dataset.acc || null) === S.ov.accent || (!S.ov.accent && b.dataset.acc === '')));
  const barTheme = $('#barTheme');
  if (barTheme) barTheme.outerHTML = `<button type="button" class="sw" id="barTheme" data-baracc="" style="--c:${S.ov.accent || t.accent}" title="Как акцент темы"></button>`;
  $$('[data-baracc]').forEach(b => b.classList.toggle('on', (b.dataset.baracc || null) === S.bar.accent));
  $$('.wchip').forEach(b => b.classList.toggle('on', S.widgets.list.includes(b.dataset.w)));
  $$('.wcard').forEach(b => b.classList.toggle('on', S.wall.mode === 'pick' ? b.dataset.wall === S.wall.pick : S.wall.mode === 'theme' && b.dataset.wall === S.theme));
  const src = wallSource();
  const ln = $('#liveNote');
  if (ln) ln.textContent = src.id && LIVE_WALLS.has(src.id) ? 'У этих обоев есть живая версия: видео декодирует видеокарта, под игрой оно встаёт на паузу.' : 'У этих обоев нет живой версии — выберите Nord, Пиксель, Catppuccin, Tokyo, Gruvbox, Rosé Pine или Brutalist.';
  const custom = S.ov.accent || S.ov.radius != null || S.ov.shadow || S.ov.hs || S.ov.alpha != null;
  const note = $('#customNote');
  if (note) note.innerHTML = custom ? `Сейчас это <b>своя тема на основе «${t.name}»</b>. В ArWi её можно сохранить, экспортировать в файл и поделиться.` : 'Встроенные темы в ArWi не испортить: любая правка создаёт вашу копию темы — «Настроить под себя».';
}

/* tabs with a sliding ink, like ArWi's segmented tabs */
function moveInk() {
  const on = $('.tab.on'), ink = $('#tabInk');
  ink.style.width = on.offsetWidth + 'px';
  ink.style.transform = `translateX(${on.offsetLeft}px)`;
}
$('#tabs').addEventListener('click', e => {
  const t = e.target.closest('.tab');
  if (!t) return;
  $$('.tab').forEach(x => x.classList.toggle('on', x === t));
  $$('.page').forEach(p => p.classList.toggle('on', p.dataset.page === t.dataset.tab));
  moveInk();
});
addEventListener('resize', moveInk);

/* actions under the stage */
$('#btnMax').addEventListener('click', () => {
  const k = Object.keys(R.wins).find(key => R.wins[key].desk === R.desk && !R.wins[key].closed);
  if (!k) { toast('На этом столе нет окон — откройте Блокнот с бара'); return; }
  const w = R.wins[k];
  w.min = false;
  toggleMax(k);
  if (R.maximized && S.bar.under !== 'none') toast('Подведите мышь к краю экрана — бар выедет');
});
$('#btnReset').addEventListener('click', () => { S = clone(DEFAULT); customWall = null; R.desk = 1; initWindows(); applyAll(); toast('Демо сброшено'); });
$('#btnRandom').addEventListener('click', () => {
  const pick = a => a[Math.floor(Math.random() * a.length)];
  S.theme = pick(THEMES).id; S.ov = clone(DEFAULT.ov);
  S.bar.look = pick(LOOKS)[0]; S.bar.pos = Math.random() < .7 ? 'bottom' : pick(['top', 'left', 'right']);
  S.bar.accent = null; S.bar.radius = null; S.bar.transp = null;
  S.bar.len = 45 + Math.round(Math.random() * 40); S.bar.thick = 40 + Math.round(Math.random() * 16);
  S.bar.anim = pick(['scale', 'slide', 'fade']);
  S.widgets.side = pick(['left', 'right']);
  S.widgets.list = WIDGETS.map(w => w[0]).filter(() => Math.random() < .5);
  if (!S.widgets.list.length) S.widgets.list = ['weather', 'player'];
  S.wall = { mode: Math.random() < .2 ? 'gradient' : 'theme', pick: 'nord', live: false };
  S.folders.shape = pick(['round', 'circle', 'capsule', 'hex', 'cut']);
  applyAll();
});
$('#btnShare').addEventListener('click', async () => {
  const url = location.href.split('#')[0] + '#b=' + enc(S);
  history.replaceState(null, '', url);
  let ok = false;
  try { await navigator.clipboard.writeText(url); ok = true; } catch (e) { /* clipboard may be blocked */ }
  toast(ok ? 'Ссылка скопирована' : 'Ссылка — в адресной строке');
});

function applyAll() {
  applyTheme();
  buildBar();
  renderWidgets();
  renderFolders();
  applyWall();
  stage.classList.toggle('win-border', S.win.border);
  syncControls();
  save();
}

/* pause the builder when it is off screen — the same rule ArWi follows */
let stageVisible = false;
new IntersectionObserver(([en]) => {
  stageVisible = en.isIntersecting;
  if (stageVisible && S.wall.live && wallVideo.src) wallVideo.play().catch(() => {});
  if (!stageVisible) wallVideo.pause();
}, { threshold: .05 }).observe(stageWrap);
setInterval(() => { tickClock(); if (stageVisible) widgetTick(); }, 1000);
setInterval(() => { if (stageVisible) resTick(); }, 2000);

document.addEventListener('arwi:lang', () => { tickClock(); renderWidgets(); moveInk(); if (R.popup) closePopups(); });

/* ---------------- start ---------------- */
buildControls();
initWindows();
applyAll();
focusWin('note');
requestAnimationFrame(moveInk);
document.fonts?.ready.then(moveInk);
document.fonts?.addEventListener?.('loadingdone', moveInk);
tickClock();
})();
