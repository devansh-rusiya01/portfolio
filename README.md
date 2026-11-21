# Devansh Rusiya — Portfolio

A minimal, dark portfolio site built with plain HTML, CSS and JavaScript.
No frameworks, no build step, no dependencies — just static files.

**Stack:** HTML · CSS · vanilla JS · Geist / Geist Mono (Google Fonts)

## Structure

```
.
├── index.html              # single page
├── assets/
│   ├── styles.css          # design tokens + layout + motion
│   ├── main.js             # reveal, nav state, preview, clock, copy
│   ├── favicon.svg
│   └── devansh-rusiya-resume.pdf
├── .gitignore
└── README.md
```

## Run locally

Any static server works:

```bash
python3 -m http.server 5173
```

Then open <http://localhost:5173>.

## Deploy

The site is fully static, so it drops onto any host:

- **Vercel** — `vercel --prod` (framework preset: *Other*, output: root)
- **Netlify** — drag the folder into the dashboard, or `netlify deploy --prod --dir .`
- **GitHub Pages** — Settings → Pages → deploy from `main` / root

## Editing content

- Copy and project entries live in `index.html`, one `<li class="work-item">` per project.
- Colours, spacing and type scale are CSS custom properties at the top of `assets/styles.css`.
- The accent colour is `--accent` (currently `#c8f24e`).
- Project hover previews use the `data-hue` attribute on each item (0–360).

## Accessibility

- Semantic landmarks, skip link, visible focus states.
- `prefers-reduced-motion` disables the marquee, reveals and hover previews.
- Hover previews are pointer-fine only, so touch devices are unaffected.

## Notes

The résumé PDF is included in `assets/` so the "Résumé" links work offline.
It contains a phone number — remove or replace the file before making the repo
public if you'd rather not publish it.

---

© Devansh Rusiya
