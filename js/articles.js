/* ArWi site: the articles page. One article is shown at a time; the topic list on the left picks it and the address
   keeps it (articles.html#steam), so a topic can be linked to directly. The ink behind the active topic slides like
   ArWi's segmented tabs, and the article comes in with ArWi's popup curve. */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const toc = $('#artToc'), ink = $('#tocInk'), title = $('#artTitle'), next = $('#artNext'), body = $('#artBody');
const links = $$('a[data-art]', toc);
const arts = $$('.art', body);
const ids = links.map(a => a.dataset.art);
let current = null;

function moveInk() {
  const on = links.find(a => a.dataset.art === current);
  if (!on) return;
  const horizontal = getComputedStyle(toc).flexDirection === 'row';
  ink.style.width = on.offsetWidth + 'px';
  ink.style.height = on.offsetHeight + 'px';
  ink.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
  if (horizontal) toc.scrollTo({ left: on.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function renderNext() {
  const i = ids.indexOf(current);
  const n = links[(i + 1) % links.length];
  next.innerHTML = `<span>${window.tr ? window.tr('Дальше') : 'Дальше'}</span><a href="#${n.dataset.art}">${n.querySelector('b').textContent}</a>`;
}

function show(id, scroll) {
  if (!ids.includes(id)) id = ids[0];
  if (id === current) return;
  current = id;
  links.forEach(a => { const on = a.dataset.art === id; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  arts.forEach(a => { a.classList.toggle('on', a.dataset.art === id); });
  title.textContent = links.find(a => a.dataset.art === id).querySelector('b').textContent;
  renderNext();
  moveInk();
  if (scroll) {
    const top = body.closest('.art-win').getBoundingClientRect().top + scrollY - 84;
    if (scrollY > top) scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}

addEventListener('hashchange', () => show(location.hash.slice(1), true));
document.addEventListener('arwi:lang', () => { const id = current; current = null; show(id); });
new ResizeObserver(moveInk).observe(toc);
document.fonts?.ready.then(moveInk);
document.fonts?.addEventListener?.('loadingdone', moveInk);

show(location.hash.slice(1), false);
// the first placement of the ink should not slide in from the corner
ink.classList.add('ready');
})();
