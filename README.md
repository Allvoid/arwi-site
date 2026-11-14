# ArWi site

Landing page for ArWi (customisation of Windows 10/11) with an interactive desktop builder. Static files only, made for
GitHub Pages: no build step, no dependencies (fonts come from Google Fonts).

## What is on the page

- What ArWi is and its two principles: customisation and saving resources.
- Features: own bar, widget panels, search that understands the wrong keyboard layout, mini-folders, window magnet and
  inertia, live wallpapers, recoloured Windows menus.
- Lightness: no WebView, native core, sleeping when the desktop is covered, events instead of polling.
- **Builder** (`#build`): a simplified desktop mock-up laid out in a fixed 1280x760 space and scaled to the screen. The
  visitor picks one of the 13 built-in themes, the bar look (ArWi, Windows 11, Windows 10, Waybar, Dock, with labels),
  edge, length, thickness, rounding, transparency, colour or gradient, dock wave, bar behaviour under a maximised window,
  popup animation, widgets, widget panel edge and hiding, wallpaper (theme, gallery, gradient, own file), mini-folder
  shape, window magnet, inertia and border. The build is kept in `localStorage` and can be shared as a link (`#b=...`).
- Themes: real footage of all 13 themes, the theme gallery, "tip of the iceberg" and themes written as code (in work).
- Telegram channel t.me/ArWiApp with a QR code.

## Languages

English (default) and Russian, switched by EN / RU in the header; the choice is kept in `localStorage`. The page and the
builder are written in Russian; `js/i18n.js` swaps every Russian text node and the `title`, `placeholder`, `aria-label`
and `alt` attributes for the English text from its `EN` table (exact match on the trimmed text) or its `PATTERNS`
(texts built from parts, such as "Desktop 2"). A `MutationObserver` translates whatever the builder renders later, and
switching back to Russian restores the originals. New Russian text needs a line in `EN`; to find what is missing,
switch to English and look for Cyrillic left on the page.

## Where the data comes from

- `js/themes.js` is generated from ArWi `native-ui/data/theme-presets.json` (palettes, radii, shadows, bar colours).
- `assets/wall/*.webp` and `assets/live/*.mp4` are the built-in ArWi wallpapers (`native-ui/assets/wallpapers`).
- `assets/logo.svg` is the ArWi bar logo, `assets/splash.svg` is the ArWi start-up animation.
- `assets/real-themes.mp4` is a cropped silent recording of the real desktop cycling through the themes.
- Motion curves are the ArWi ones: edge reveal `cubic-bezier(.2,1.45,.35,1)` with overshoot, conceal
  `cubic-bezier(.45,0,.25,1)`, popup slide `cubic-bezier(.16,.9,.3,1)`, hover colour 0.16 s.

When ArWi gets a new theme or feature, update `js/themes.js` and the texts in `index.html`. After changing CSS or JS,
bump the `?v=` number on the three links at the end of `index.html` so browsers fetch the new files.

## Local preview

Run `serve.cmd` and open http://127.0.0.1:8417 (needs Python).

## Publishing

GitHub Pages from the `main` branch, root folder.
