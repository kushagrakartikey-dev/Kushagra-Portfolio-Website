# AGENTS.md — Kushagra Kartikey portfolio

You are working on the personal portfolio website of **Kushagra Kartikey, Supply Chain & Operations Professional** (Delhi, India, open to relocation). The audience is recruiters, consulting firms, global capability centres, supply chain leaders, clients and partners. The site must look highly work-oriented and professional.

## What this project is

A single-page static website, published with **GitHub Pages** so anyone with the link opens the website itself, never the repository.

- Plain **HTML5, CSS3 and vanilla JavaScript**. No framework, no npm, no bundler, no build step, no backend, no API keys.
- One external library only: **three.js r160**, vendored locally at `assets/vendor/three.min.js` (classic UMD build) for the two 3D scenes: the hero globe and the capacity-roadmap model. No CDNs.
- Every path is **relative** (never starting with `/`), so the site works at `user.github.io/` and at `user.github.io/repo-name/`.
- No third-party builder branding of any kind (for example "Made with Lovable").

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | All content and structure. **The source of truth for wording.** |
| `styles.css` | Design tokens (section 2) and all styling |
| `script.js` | Menu, scroll spy, reveals, counters, card tilt, copy email, three.js scenes (globe, roadmap model) |
| `README.md` | GitHub Pages deployment guide for the owner |
| `assets/documents/resume.pdf` | Target of every "Download resume" button |
| `assets/images/` | Project dashboard screenshots, WebP, `-640` and `-1200` widths |
| `assets/fonts/` | Instrument Sans variable font (self-hosted) + OFL licence |
| `assets/vendor/` | three.js r160 + MIT licence |
| `assets/icons/favicon.svg` | KK monogram |
| `.agents/rules/` | Always-on rules: content accuracy, design system, quality gates |
| `.agents/workflows/` | `/rebuild-portfolio`, `/add-project-card`, `/qa-and-publish` |
| `.agents/reference/` | Screenshots of the approved design (desktop 1440, mobile 390) |

## Status

The **3D build is complete and tested** (October 2026). It keeps the approved design and adds 3D animation at the owner's request (rule 02, section "3D"). Five project cards are live, including Inventory Optimization & Replenishment Engine, so `/add-project-card` is done. No task is open. The owner has said **do not** add the `nutricircle-sop-intelligence` project and **no headshot**.

The approved pre-3D site remains unchanged in the sibling folder `kushagra-kartikey-portfolio/` for reference.

## How to work here

1. Read all three files in `.agents/rules/` before any edit. They hold the owner's decisions and are not optional.
2. Open the screenshots in `.agents/reference/` and keep the design consistent with them.
3. Make the smallest change that does the job. Keep the existing class names, tokens and structure.
4. Verify in the browser after every change (Antigravity's browser agent): desktop 1440, tablet 768, mobile 390 and 320. Report what you checked and what you could not check. Never claim a test you did not run.
5. Never invent facts, metrics, employers, titles, certifications, links or contact details. If something is missing, ask the owner.
