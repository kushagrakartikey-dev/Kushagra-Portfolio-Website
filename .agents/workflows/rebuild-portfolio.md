---
description: Rebuild the complete Kushagra Kartikey portfolio from scratch (static HTML/CSS/JS + two three.js scenes), phase by phase, matching the approved reference screenshots.
---

# /rebuild-portfolio

Use this workflow when the folder has the rules and reference screenshots but no finished site, or when the owner asks for a full rebuild. Facts, design and quality bars live in `.agents/rules/01–03`; follow them exactly. The target look is in `.agents/reference/`.

Act as senior frontend engineer, UI/UX designer, accessibility specialist, performance engineer and QA tester. Deliver working files, not mockups. Create an Implementation Plan artifact first, then work through the phases in order.

## Phase 1 — Inspect

1. Read the resume (`assets/documents/resume.pdf` or the file the owner provides) and rule 01. List any conflicts between them and ask the owner. Do not guess.
2. Open each project repository README listed in rule 01. Use only the features those READMEs confirm, and note that each one runs on synthetic data.
3. Look at the reference screenshots and `https://rehan19-cmd.github.io/portfolio/` (inspiration only; copy nothing).

## Phase 2 — Assets

1. **Font.** Download Instrument Sans as a variable WOFF2 (latin subset, weight and width axes). The npm package `@fontsource-variable/instrument-sans` contains `files/instrument-sans-latin-standard-normal.woff2`. Save it as `assets/fonts/instrument-sans-latin.woff2` with its OFL licence beside it.
2. **three.js.** Get the r160 classic build from the npm package `three@0.160.0`, at `build/three.min.js`. Save it to `assets/vendor/three.min.js` with the MIT licence. Its first statement is a `console.warn('Scripts "build/three.js"…')` deprecation notice; replace that call (and only that call) with `void 0`. Keep the licence comment.
3. **Land mask.** Run `pip install global-land-mask`. Load `globe_combined_mask_compressed.npz`, whose `mask` array is True for water, with row 0 at 90°N and column 0 at 180°W. Downsample it to 240×120 by block mean, treating a cell as land when its water fraction is below 0.35. Invert it so 1 means land, then `numpy.packbits` it row by row and base64 encode the result (about 4,800 characters). Paste the string into `script.js` as `LAND_MASK`.
4. **Project screenshots.** Open each live dashboard at 1440×900, wait for the charts to render, and capture the first screen. Crop to 16:10 from the top-left. Save each as WebP at 1200 and 640 pixels wide, named `assets/images/project-<sop|sourcing|procurement|lean-six-sigma>-<width>.webp`. If the procurement dashboard does not load, use `docs/images/dashboard_compliance.png` from its repository instead.
5. **Favicon.** Make `assets/icons/favicon.svg`: a navy rounded square with "KK" in off-white and a short amber bar.
6. **Resume.** Use the owner's own PDF if they provide one. Otherwise typeset a two-page A4 PDF from the resume text, applying the exclusions in rule 01 (no CGPA, no Lucknow University, no badminton or competitions, no Lovable link). Print it with headless Chromium to `assets/documents/resume.pdf`, then ask the owner to review it.

## Phase 3 — Build `index.html`

Build the sections and ids in the order set by rule 02.

**Head:**
- title "Kushagra Kartikey | Supply Chain & Operations Professional";
- a meta description;
- viewport and `theme-color` `#0E1B2E`;
- Open Graph title and description;
- the favicon and a font preload;
- an inline script that swaps the class `no-js` for `js` on `<html>` before first paint.

**Copy to use:**
- **Value statement:** "I run supply chain operations and analyse cost, cash and capacity to decide what changes, then measure each change by its result."
- **About statement:** "Two years across store-level retail operations and international trade consulting, measured in stock availability, margin and cash."
- **Contact invitation:** "Recruiters, consulting teams, clients and partners: if you are working on planning, sourcing, inventory or trade operations, I would like to hear about it."

Write all other copy in plain, confident professional English. Use no filler adjectives, and keep every sentence to facts from rule 01.

## Phase 4 — Build `styles.css`

Order: font-face, tokens, base, layout helpers, navigation, buttons, hero, globe and ledger, about, experience, projects, skills, strategy, education, contact, footer, motion, responsive, print.

Breakpoints:
- 1100px: navigation collapses to the menu button;
- 1024px: hero stacks; ledger, about and contact become one column;
- 900px: projects, themes and the role grid become one column;
- 600px: full-width hero buttons, one-column skills, sectors and contact tiles.

Two anchor-offset rules:
- `html { scroll-padding-top: calc(var(--nav-h) + 1rem) }`;
- `.section { scroll-margin-top: calc(1rem - var(--section-space)) }`, so headings land about 2rem under the sticky bar.

## Phase 5 — Build `script.js`

Write one IIFE in `'use strict'` mode. Wrap each module in `safely(name, fn)` so one failure never blocks the rest. Modules, in order:

1. **header** — adds `.is-scrolled`.
2. **menu** — as specified in rule 03.
3. **scroll spy** — `aria-current="true"` on the nav link for the section in view.
4. **reveal** — IntersectionObserver plus the scroll-settle failsafe.
5. **counters** — ledger numbers count from their before value to after; skipped under reduced motion.
6. **tilt** — mouse only, at most 4°, applied with `requestAnimationFrame`.
7. **copy email** — shown only when the Clipboard API exists in a secure context; announces through a `role="status"` region.
8. **year** — footer year.
9. **globe** — as specified in rule 02.
10. **roadmap** — the capacity-roadmap model, as specified in rule 02; built only as it approaches the screen.

## Phase 6 — Test and refine

Run `/qa-and-publish` steps 1 and 2, with full motion and with reduced motion (see the testing notes in rule 03). Compare screenshots against `.agents/reference/` at 1440 and 390, and fix differences in hierarchy, spacing or colour. Then do a final design pass: remove one unnecessary flourish, confirm the headline fits in two lines at every width, and confirm no section looks empty.

## Phase 7 — Deliver

1. Write `README.md`. It must cover:
   - creating the repository, and the difference between a user site and a project site;
   - uploading the folder contents with `index.html` at the root;
   - checking that the assets and resume uploaded;
   - Settings → Pages: deploy from a branch, `main`, `/ (root)`, Save;
   - finding the live URL, updating the site, and troubleshooting;
   - credits for the font, three.js and the NOAA GLOBE land data.
2. Report to the owner:
   - the folder structure;
   - the sections built;
   - the project cards and their URLs;
   - the contact links;
   - the QA results, separating what was verified from what was not;
   - any information that is still missing.
