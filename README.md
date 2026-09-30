# IEEE CS MBITS — WebNova 2026

> **Code. Connect. Create.**  
> Official website for IEEE Computer Society, MBITS Student Branch  
> Built for the **WebNova** website design competition

---

## 🚀 Live Demo

[🌐 View Live on GitHub Pages](https://ieeecsmbits.github.io/webnova-2026)

---

## ✨ What Makes This Design Unique

1. **Cinematic depth without a single library** — A CSS-variable-driven dual-theme system (dark/light) combined with a live WebGL-style canvas particle network, drifting radial gradient meshes, and real glassmorphism cards creates a stunning futuristic aesthetic entirely in vanilla HTML/CSS/JS — zero dependencies, sub-50 KB footprint.

2. **Layered micro-interaction system** — Every element reacts: a dual-layer custom cursor with laggy outline tracking, 3D perspective tilt on hover for every card (respecting `prefers-reduced-motion`), terminal-style phrase cycling in the hero, animated count-up statistics triggered precisely by IntersectionObserver, and a CSS draw-on circle + checkmark success animation in the contact form — producing an interface that feels genuinely alive.

3. **Progressive delight and accessibility-first** — The site achieves WCAG 2.1 AA compliance through semantic HTML5, full ARIA labelling, visible focus rings, and `prefers-reduced-motion` support, while rewarding power users with a hidden Konami code Easter egg (↑↑↓↓←→←→BA) that triggers a confetti burst — demonstrating that accessibility and delight are not mutually exclusive.

---

## 📁 File Structure

```
ieee-cs-mbits/
├── index.html          ← Single-page site with all 8 sections
├── css/
│   └── style.css       ← All styles (theming, animations, responsive)
├── js/
│   └── script.js       ← All interactivity (no dependencies)
├── assets/             ← Ready for images/fonts (currently SVG placeholders)
└── README.md           ← This file
```

---

## 🛠️ Sections

| # | Section | Key Features |
|---|---------|-------------|
| 1 | **Hero** | Canvas particles, floating glass cards, terminal typing, animated headline |
| 2 | **About** | Mission/Vision/Gain/Community glass cards with tilt effect |
| 3 | **Events** | Filter tabs (All / Workshops / Contests / Talks), upcoming & past event cards |
| 4 | **Achievements** | Count-up stats, vertical timeline with active-pulse dot |
| 5 | **Gallery** | CSS masonry grid, gradient/SVG placeholders, keyboard-accessible lightbox |
| 6 | **Team** | 3D flip cards on hover, initials avatars, social icon links |
| 7 | **Join/Contact** | Client-side validated form, SVG draw-on success animation |
| 8 | **Footer** | Social links, quick nav, Konami hint, copyright |

---

## 🌐 Deploy to GitHub Pages

### Option A — From GitHub UI (easiest)

1. **Fork / upload** this repository to your GitHub account.
2. Go to **Settings → Pages**.
3. Under **Source**, select `Deploy from a branch`.
4. Set branch to **`main`** and folder to **`/ (root)`**.
5. Click **Save**. GitHub will publish to `https://<username>.github.io/<repo-name>/` within ~2 minutes.

### Option B — GitHub CLI

```bash
# 1. Clone your GitHub repo
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 2. Copy all project files into the repo folder
#    (index.html, css/, js/, assets/, README.md)

# 3. Push to main
git add .
git commit -m "feat: IEEE CS MBITS WebNova 2026 website"
git push origin main

# 4. Enable Pages from GitHub Settings → Pages (see Option A steps 3-5)
```

### Option C — Direct ZIP Upload

1. Zip the project folder (`index.html`, `css/`, `js/`, `assets/`, `README.md`).
2. Create a new GitHub repository.
3. Upload via **Add file → Upload files**.
4. Enable GitHub Pages (Option A, steps 2–5).

> **Note:** No build step required. The site runs directly from static files.

---

## 🎮 Hidden Easter Egg

Type the **Konami Code** anywhere on the page:

```
↑  ↑  ↓  ↓  ←  →  ←  →  B  A
```

A confetti burst will celebrate your discovery! 🎉

---

## ♿ Accessibility

- Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels on all interactive elements
- `aria-live` regions for dynamic content (typing animation, form errors, count-up)
- Full keyboard navigation with visible `:focus-visible` outlines
- `prefers-reduced-motion` media query disables all animations for users who prefer it
- Color contrast ratios meet WCAG 2.1 AA

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| External requests | 1 (Google Fonts) |
| JavaScript (minified) | ~12 KB |
| CSS (minified) | ~18 KB |
| HTML | ~22 KB |
| Third-party libraries | **0** |
| Build step required | **None** |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary blue | `#00629B` |
| Primary light | `#0082CC` |
| Accent (copper) | `#C8843A` |
| Dark background | `#080C12` |
| Font — body | Inter |
| Font — display | Space Grotesk |

---

## 🔗 Social

| Platform | Link |
|----------|------|
| Instagram | [@ieeecsmbits](https://instagram.com/ieeecsmbits) |
| LinkedIn | [IEEE CS MBITS](https://linkedin.com/company/ieeecsmbits) |
| Website | [ieeesbmbits.in](https://ieeesbmbits.in) |
| Email | ieeecs@mbits.edu.in |

---

## 📄 License

© 2026 IEEE Computer Society, MBITS Student Branch. All rights reserved.  
Built with ❤️ for **WebNova 2026**.
