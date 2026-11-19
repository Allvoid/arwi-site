/* ArWi site: effects shared by every page (nav, reveal on scroll, card spotlight, the demo bar wave, the theme gallery,
   the typed "theme as code" demo, the real footage, the hero clock). The builder itself lives in app.js (demo.html only). */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const p2 = n => String(n).padStart(2, '0');
function rgba(h, a) {
  h = h.replace('#', '');
  if (h.length === 3) h = [...h].map(c => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}

// the bar clock in the hero
const hc = $('#heroClock');
if (hc) { const t = () => { const d = new Date(); hc.textContent = `${p2(d.getHours())}:${p2(d.getMinutes())}`; }; t(); setInterval(t, 10000); }

// nav background after scroll
const nav = $('#nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 20);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal, .engine').forEach(el => io.observe(el));

// spotlight that follows the cursor on feature cards
$$('[data-tilt]').forEach(card => card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

// dock wave on the feature card demo bar
(() => {
  const dbar = $('.db-bar');
  if (!dbar) return;
  const apps = $$('.db-app', dbar);
  let pt = null, raf = 0;
  const cur = apps.map(() => 1);
  let base = null;
  const frame = () => {
    raf = 0; let moving = false;
    if (!base && cur.every(c => c === 1)) base = apps.map(el => { const r = el.getBoundingClientRect(); return r.left + r.width / 2; });
    apps.forEach((el, i) => {
      let target = 1;
      if (pt != null && base) { const d = Math.abs(pt - base[i]); const R0 = 110; target = 1 + .75 * (d >= R0 ? 0 : (Math.cos(Math.PI * d / R0) + 1) / 2); }
      cur[i] += (target - cur[i]) * .3;
      if (Math.abs(cur[i] - target) > .002) moving = true; else cur[i] = target;
      el.style.transform = `scale(${cur[i].toFixed(3)})`;
      el.style.margin = `0 ${((cur[i] - 1) * 17).toFixed(1)}px`;
    });
    if (moving) raf = requestAnimationFrame(frame);
    else if (pt == null) base = null;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  dbar.addEventListener('pointermove', e => { pt = e.clientX; kick(); });
  dbar.addEventListener('pointerleave', () => { pt = null; kick(); });
  // touch screens: an automatic sweep once the card is visible
  new IntersectionObserver(([en], obs) => {
    if (!en.isIntersecting) return;
    obs.disconnect();
    const a = apps[0].getBoundingClientRect(), b = apps.at(-1).getBoundingClientRect();
    const t0 = performance.now();
    const run = now => { const k = Math.min(1, (now - t0) / 1400); const e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; const ra = apps[0].getBoundingClientRect(); pt = ra.left + (b.right - a.left) * e; kick(); if (k < 1) requestAnimationFrame(run); else { pt = null; kick(); } };
    setTimeout(() => requestAnimationFrame(run), 500);
  }, { threshold: .6 }).observe(dbar);
})();

// themes gallery (home page): each card opens the demo with that theme
const gal = $('#themeGallery');
if (gal && window.ARWI_THEMES) {
  gal.innerHTML = window.ARWI_THEMES.map(t => `
  <a class="tg-item reveal" href="demo.html#t=${t.id}" data-id="${t.id}" style="--c:${t.accent};--fg2:${t.fg}">
    <div class="tg-thumb"><img src="assets/wall/${t.id}.webp" alt="" loading="lazy"><div class="tg-minibar" style="--bb:${rgba(t.barBg, t.barOp / 100)};--br:${Math.min(t.barR, 8)}px"><i></i><i></i><i></i><i></i></div></div>
    <div class="tg-meta"><b>${t.name}</b><span>${t.desc}</span><div class="tg-sw">${t.sw.map(c => `<i style="--c:${c}"></i>`).join('')}</div></div>
  </a>`).join('');
  $$('.tg-item', gal).forEach((el, i) => { el.style.setProperty('--d', (i % 4) * .05 + 's'); io.observe(el); });
}

// "theme written as code" typing demo
(() => {
  const el = $('#edCode'), prev = $('#ctPreview');
  if (!el || !prev) return;
  const parts = [
    ['c', '/* бар без скруглений, с градиентом */\n'], ['k', '.bar'], ['', ' {\n  '], ['p', 'border-radius'], ['', ': '], ['v', '0'], ['', ';\n  '], ['p', 'background'], ['', ': '], ['v', 'linear-gradient'], ['', '(90deg, '], ['s', '#ff3d7f'], ['', ', '], ['s', '#7a5cff'], ['', ');\n}\n', 1],
    ['c', '/* круглые значки, которые пляшут */\n'], ['k', '.task'], ['', ' { '], ['p', 'border-radius'], ['', ': '], ['v', '50%'], ['', '; }\n'], ['k', '.task:hover'], ['', ' { '], ['p', 'transform'], ['', ': '], ['v', 'scale(1.25) rotate(-6deg)'], ['', '; }\n', 2],
    ['c', '/* неоновые часы */\n'], ['k', '.clock'], ['', ' { '], ['p', 'letter-spacing'], ['', ': '], ['v', '.25em'], ['', '; '], ['p', 'text-shadow'], ['', ': '], ['v', '0 0 8px #ff3d7f'], ['', '; }', 3],
  ];
  let started = false;
  const run = async () => {
    for (;;) {
      el.innerHTML = ''; prev.className = 'ct-preview';
      $('.ed-head span').textContent = window.tr('моя-тема.rcss');
      const caret = document.createElement('span'); caret.className = 'ed-caret';
      el.appendChild(caret);
      for (const [cls, raw, step] of parts) {
        const text = cls === 'c' ? window.tr(raw.trim()) + '\n' : raw;
        const span = document.createElement('span'); if (cls) span.className = cls;
        el.insertBefore(span, caret);
        for (const ch of text) { span.textContent += ch; await new Promise(r => setTimeout(r, reduceMotion ? 0 : ch === '\n' ? 90 : 22)); }
        if (step) prev.classList.add('s' + step);
      }
      await new Promise(r => setTimeout(r, 4200));
    }
  };
  new IntersectionObserver(([en]) => { if (en.isIntersecting && !started) { started = true; run(); } }, { threshold: .4 }).observe(el);
})();

// real footage plays only while it is on screen
(() => {
  const v = $('#realVideo');
  if (!v) return;
  new IntersectionObserver(([en]) => { if (en.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: .25 }).observe(v);
})();
})();
