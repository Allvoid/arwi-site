# ArWi site

Site for ArWi (customisation of Windows 10/11): a welcome page, an in-browser demo and articles. Static files only, made
for GitHub Pages: no build step, no dependencies (fonts come from Google Fonts).

## Pages

- `index.html` — home. Greets the visitor and says plainly that ArWi is still in development: it cannot be downloaded
  yet, the release is planned for winter on Steam, news comes out in the Telegram channel. Below that, three "windows"
  in the ArWi Nord look open the rest of the site: the demo, the articles and the Telegram channel. Then what ArWi is,
  features, lightness (50–80 MB of RAM without live wallpapers, up to 200 MB with them), real footage of the themes, the
  theme gallery (each card opens the demo with that theme, `demo.html#t=<id>`), themes as code and the Telegram card.
- `demo.html` — the demo: a simplified desktop mock-up with real ArWi themes, wallpapers and animations, laid out in a
  fixed 1280x760 space and scaled to the screen. A notice window says that nothing is downloaded or installed and that
  the real app is a Windows program coming to Steam. The visitor picks one of the built-in themes, the bar look (ArWi,
  Windows 11, Windows 10, Waybar, Dock, with labels), edge, length, thickness, rounding, transparency, colour or
  gradient, dock wave, bar behaviour under a maximised window, popup animation, widgets, widget panel edge and hiding,
  wallpaper (theme, gallery, gradient, own file), mini-folder shape, window magnet, inertia and border. The state is kept
  in `localStorage` and can be shared as a link (`#b=...`).
- `articles.html` — articles. Topics on the left (a horizontal strip on phones), one article at a time on the right in an
  ArWi-style window; the address keeps the topic so it can be linked to: `#why` (why ArWi and not the alternatives —
  the main one), `#steam` (the Steam release), `#paid` (why ArWi is paid), `#custom` (what can be customised; ArWi is a
  core first of all), `#resources` (resource use), `#platforms` (Windows 10 and 11), `#stack` (C++, own core, no
  Electron or WebView), `#who` (there is no "we": one solo developer).

Every card on the site is an ArWi window (`.awin`: a title bar with a dot, the title and the window buttons, then the
body), the same as the three cards on the home page. Only cards that are links lift on hover.

## Scripts

- `js/themes.js` — theme data, generated from ArWi `native-ui/data/theme-presets.json` (palettes, radii, shadows, bar
  colours). The site still lists 13 themes; ArWi has more since (Туман, Хвоя, Кармин), so the articles say "more than
  ten".
- `js/i18n.js` — English / Russian, see below.
- `js/site.js` — effects shared by every page: nav, reveal on scroll, card spotlight, the demo bar wave, the theme
  gallery, the typed "theme as code" demo, the real footage, the hero clock.
- `js/app.js` — the builder, `demo.html` only. `#t=<theme id>` puts that theme on the current build.
- `js/articles.js` — topic switching on `articles.html`.

## Languages

English (default) and Russian, switched by EN / RU in the header; the choice is kept in `localStorage`. The pages and the
builder are written in Russian; `js/i18n.js` swaps every Russian text node and the `title`, `placeholder`, `aria-label`
and `alt` attributes for the English text from its `EN` table (exact match on the trimmed text) or its `PATTERNS`
(texts built from parts, such as "Desktop 2"). A `MutationObserver` translates whatever the builder renders later, and
switching back to Russian restores the originals. New Russian text needs a line in `EN`; to find what is missing,
switch to English and look for Cyrillic left on the page.

The articles are long, so each one is written twice instead: a `.lang-ru` block and a `.lang-en` block, and CSS shows
the one that matches `html[lang]`. Only the topic titles in the left column go through the `EN` table.

## Where the data comes from

- `assets/wall/*.webp` and `assets/live/*.mp4` are the built-in ArWi wallpapers (`native-ui/assets/wallpapers`).
- `assets/logo.svg` is the ArWi bar logo, `assets/splash.svg` is the ArWi start-up animation.
- `assets/real-themes.mp4` is a silent full-screen recording of the real desktop cycling through the themes (ArWi
  `docs/private/promo-1112/assets/theme_cycle_all.mp4`, scaled to 1600x900). The widget panel was hidden in that take.
- Motion curves are the ArWi ones: edge reveal `cubic-bezier(.2,1.45,.35,1)` with overshoot, conceal
  `cubic-bezier(.45,0,.25,1)`, popup slide `cubic-bezier(.16,.9,.3,1)`, hover colour 0.16 s.

When ArWi gets a new theme or feature, update `js/themes.js` and the texts in the pages. After changing CSS or JS, bump
the `?v=` number on the style and script links of all three pages so browsers fetch the new files.

## Local preview

Run `serve.cmd` and open http://127.0.0.1:8417 (needs Python).

## Publishing

GitHub Pages from the `main` branch, root folder.
