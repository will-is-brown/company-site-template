# Company Site Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](package.json)
[![Tests Passing](https://img.shields.io/badge/Tests-12%20passing-brightgreen.svg)](test/app.test.js)
[![Font: Self--Hosted](https://img.shields.io/badge/Font-Self--Hosted%20WOFF2-c2410c.svg)](#typography--performance)

A high-craft, single-page marketing site template for **local and service companies** — plumbing, HVAC, electrical, roofing, clinics, studios. Built on **Blueprint**, the w-b.dev design system ([design.w-b.dev](https://design.w-b.dev)).

This is the sibling of [`marketing-page-template`](https://github.com/will-is-brown/marketing-page-template), which targets APIs and developer tools. **That one sells "try my tool now"; this one sells "call these people."** Different anatomy, different conversion path, same engineering discipline.

---

## The Philosophy: Local Buyers Are Scared

A local service buyer has one fear: *the person who shows up is not who I expected*. Every section of this page answers a version of that fear.

| Section | Fear it answers |
|---|---|
| Ticker | Are they even operating right now? |
| Stat strip | Have they done this before, a lot? |
| Service area card | Do they actually cover my street? |
| Service cards | Do they do *my* job, and at what price? |
| Ink band | What happens if something goes wrong? |
| Recent work | Can I see evidence, not adjectives? |
| Reviews | What did my neighbours actually experience? |
| FAQ | What will they try to charge me for? |
| Booking form | How fast will someone respond? |

> **The anti-hype rule:** every number on the page is a place to change with your own record. Do not invent "2,400+ jobs" or a 4.9 rating you cannot evidence. Local buyers check.

---

## Page Anatomy

```
┌────────────────────────────────────────────────────────────────────────┐
│ .ticker (Ink marquee: availability, hours, coverage, credentials)      │
├────────────────────────────────────────────────────────────────────────┤
│ .nav (Sticky: wordmark + mono links + phone + CTA)                    │
├────────────────────────────────────────────────────────────────────────┤
│ .hero (Paper, on the 44px mat grid)                                   │
│   [ FIG.01 tag · Colossal uppercase headline · lede · dual CTAs ]     │
│   [ .stats (3 credibility numbers) ]                                   │
│   [ .area-card (phone, hours, coverage, next slot) ]                  │
├────────────────────────────────────────────────────────────────────────┤
│ .services (4 cards: icon plate, title, copy, "from $X" price anchor)  │
├────────────────────────────────────────────────────────────────────────┤
│ .band (INK — the three commitments, in writing)                        │
├────────────────────────────────────────────────────────────────────────┤
│ .work (4 recent jobs: line-art plate, job title, area + duration)      │
├────────────────────────────────────────────────────────────────────────┤
│ .reviews (3 quote cards: stars, quote, name · neighbourhood)           │
├────────────────────────────────────────────────────────────────────────┤
│ .faq (Native <details> accordion, hard corners, + / − affordance)     │
├────────────────────────────────────────────────────────────────────────┤
│ .contact (Booking form: name, phone, service, timing, details)        │
├────────────────────────────────────────────────────────────────────────┤
│ footer (Ink — wordmark, service links, company links, contact)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## The Blueprint Aesthetic

White paper dominates. One accent colour. Black ink carries structure. Hard corners, solid offset shadows, deliberate lines. It reads like an engineer's drawing of a job site — precise, tactile, and legible under bad light.

### 1. Palette tokens

| CSS Variable | Value | Purpose |
|---|---|---|
| `--t-paper` | `#ffffff` | Page and card background |
| `--t-ink` | `#0a0a0a` | Text, borders, structure |
| `--t-muted` | `#6b6b6b` | Secondary text, labels |
| `--t-accent` | `#c2410c` | The one accent — trade orange |
| `--t-accent-deep` | `#9a3412` | Pressed state, price anchors |
| `--t-accent-tint` | `#fdf0e6` | Icon plates, hover fills |
| `--t-accent-grid` | `#f7e6db` | The 44px background grid |
| `--t-accent-on-ink` | `#f4a259` | Accent text on ink surfaces |

**Contrast, measured:** accent on paper `5.18:1`, accent-deep on paper `7.31:1`, accent-on-ink on ink `9.58:1`. All pass WCAG AA for normal text. The accent is never used as a page background and never behind body copy.

### 2. Solid offset shadows — never blurred

```css
--t-shadow:       6px 6px 0 var(--t-accent);
--t-shadow-ink:   6px 6px 0 var(--t-ink);
--t-shadow-hover: 9px 9px 0 var(--t-ink);
--t-shadow-active: 2px 2px 0 var(--t-ink);
```

Hover lifts the element by `-2px` and grows the shadow; press sinks it `3px` and shrinks it. Depth is cast, not blurred.

### 3. Hard corners

`border-radius: 0` everywhere. Exceptions are `6px` for nested inner elements and `15px` for badge caps. No pills.

### 4. The mat grid

```css
body {
  background-image: var(--t-bg-grid);
  background-size: 44px 44px;
}
```

A faint 44px grid across the whole page. It is the only gradient in the system.

### 5. Typography

| Role | Face | Style |
|---|---|---|
| Display | Big Shoulders Display 900 | UPPERCASE, leading .92, tracking -.01em |
| Labels & annotations | Space Mono 700 | UPPERCASE, tracking .14–.18em, .72rem |
| Body | Archivo 400–700 | Sentence case, leading 1.5 |
| Wordmark | Archivo 900 | lowercase, tracking -.055em |

The display face never runs prose. Body measure stays at 52–60ch.

---

## Quick Start

```bash
cd company-site-template

npm start        # http://localhost:3000
npm test         # 12 assertions, node:test, zero dependencies
```

---

## Customisation (5-Minute Adaptation)

1. **Accent colour.** Override four variables in `page.css` `:root`:
   ```css
   --t-accent:       #2563eb;
   --t-accent-deep:  #1d4ed8;
   --t-accent-tint:  #eff6ff;
   --t-accent-grid:  #e8f0fe;
   --t-accent-on-ink:#93c5fd;
   ```
   Everything downstream — shadows, dividers, focus rings, the grid — picks it up. Use the live picker at [design.w-b.dev](https://design.w-b.dev) to derive the four from any hex.

2. **Identity.** Replace the wordmark text in `.logo` (nav and footer) and the inline SVG favicon.

3. **Headline.** Edit the hero `h1`. The `<em>` span takes the accent; keep the two halves to one line each on desktop.

4. **Numbers.** Replace `.stats` with your own three figures, and the `.area-card` `<dl>` with your real phone, hours, coverage and next slot.

5. **Services.** One `.card` per service. Keep the `.plate` icon, the description to two sentences, and end with a `.price` anchor — that anchor is what a local buyer looks for.

6. **Band promises.** The three `.facts` in `.band` are the guarantees you will actually be held to. Write the ones you will honour.

7. **Work and reviews.** Swap the inline SVG placeholders for real photographs. Keep the `4 / 3` aspect ratio on `.shot` so the grid stays even.

8. **FAQ.** Native `<details>` — no JavaScript needed. One `<summary>` per question, plain answers in `.answer`.

9. **Form endpoint.** In `page.js`, replace the simulated `await new Promise(...)` with a real `fetch()` to your endpoint.

---

## Typography & Performance

- **Fonts are self-hosted.** Four WOFF2 files, 89 KB total, no Google Fonts, no CDN, no tracking. `font-display: swap` prevents invisible text.
- **Two files are preloaded** — the display face and the body face, the only ones needed above the fold.
- **Fonts are cached forever** (`max-age=31536000, immutable`).
- **Zero third-party requests.** The page loads only from its own origin.

---

## Accessibility

- Visible focus: `outline: 2.5px solid var(--t-accent)` with `outline-offset: 3px`.
- The mobile menu is a real disclosure with `aria-expanded` and `aria-controls`; Escape closes it and returns focus to the button.
- Every input has a `<label>`; every form status is announced via `role="status" aria-live="polite"`.
- The accordion is native `<details>`, so it is keyboard and screen-reader correct for free.
- `prefers-reduced-motion: reduce` disables the marquee, the scroll reveals and the draw-on animation.
- Light only — `color-scheme: only light`. No dark mode, no auto-inversion.

---

## Rendering the whole page at once

The scroll-reveal animation hides lower sections until they enter the viewport. A renderer that captures the page **without scrolling it** — a headless screenshot, a social-card generator, a PDF service — would therefore produce a page with blank sections.

Append `?static` to skip the animation entirely and reveal every section:

```
http://localhost:3000/?static
```

Printing is also covered: the print stylesheet drops the marquee, the nav toggle and the form, removes the grid background and the shadows, and forces every revealed element visible, so a printed service sheet shows all services, prices and questions.

---

## Project Structure

```
company-site-template/
├── index.html              # Semantic HTML5 with complete metadata
├── page.css                # Blueprint tokens + components, no build step
├── page.js                 # Nav, scroll reveal, form validation, tel: fix
├── assets/
│   └── fonts/              # 4 self-hosted WOFF2 subsets (89 KB)
│       ├── big-shoulders-100-900.woff2
│       ├── archivo-100-900.woff2
│       ├── space-mono-400.woff2
│       └── space-mono-700.woff2
├── server.js               # Web-standard HTTP server, immutable caching
├── test/
│   └── app.test.js         # node:test suite, 12 assertions
├── package.json            # Zero runtime dependencies
├── LICENSE                 # MIT
└── README.md
```

---

## Deployment

### Static hosting (Cloudflare Pages, GitHub Pages, Netlify, Vercel)

Point the host at the repository root. No build command required.

### Node / Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
ENV PORT=3000 NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Relationship to the API template

| | API template | This one |
|---|---|---|
| Aesthetic | Viktor — warm sunrise gradient, pills, soft shadows | Blueprint — white paper, mat grid, hard corners, offset shadows |
| Audience | Developers | Local buyers and small businesses |
| Centrepiece | Interactive live tool | Service area + credibility proof |
| Conversion | "Try the tool now" | "Request a quote" + "Call now" |
| Structure | Sky → band → docs → footer | Ticker → hero → services → band → work → reviews → FAQ → form → footer |

Both ship the same guarantees: zero dependencies, zero third-party requests, self-hosted fonts, immutable caching, a `node:test` suite, and an accessible progressive-enhancement approach.

---

## License

Created by [Daniel Willis-Brown](https://w-b.dev). Released under the [MIT License](LICENSE).
