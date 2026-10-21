---
description: Rebuild the complete Kushagra Kartikey portfolio from scratch (static HTML/CSS/JS + three three.js scenes), phase by phase, matching the approved reference screenshots.
---

# /rebuild-portfolio

Use this workflow when the folder has the rules and reference screenshots but no finished site, or when the owner asks for a full rebuild. Facts, design and quality bars live in `.agents/rules/01–03`; follow them exactly. The target look is in `.agents/reference/`.

Act as senior frontend engineer, UI/UX designer, accessibility specialist, performance engineer and QA tester. Deliver working files, not mockups. Create an Implementation Plan artifact first, then work through the phases in order.

## Phase 1 — Inspect

1. Read the resume (`assets/documents/resume.pdf` or the file the owner provides) and rule 01. List any conflicts between them and ask the owner. Do not guess.
2. Open each project repository README listed in rule 01. Use only the features those READMEs confirm, and note that each one runs on synthetic data.
3. Look at the reference screenshots and `https://rehan19-cmd.github.io/portfolio/` (inspiration only; copy nothing).

## Phase 2 — Assets

1. **Fonts.** From the Google Fonts releases, take `Sora[wght].ttf` and `Inter[opsz,wght].ttf`. With fontTools, pin Inter at `opsz=14`. Subset both to Latin plus U+20B9 (₹), U+2190–2193 and U+2212, keeping `kern, liga, calt, tnum, lnum, pnum` and the other default features. Save them as WOFF2: `assets/fonts/sora.woff2` and `inter.woff2`, with `OFL-Sora.txt` and `OFL-Inter.txt`. Sora has no ₹ or arrows, so `--font-display` lists Inter second.
2. **three.js.** Get the r160 classic build from the npm package `three@0.160.0`, at `build/three.min.js`. Save it to `assets/vendor/three.min.js` with the MIT licence. Its first statement is a `console.warn('Scripts "build/three.js"…')` deprecation notice; replace that call (and only that call) with `void 0`. Keep the licence comment.
3. **Land mask.** Run `pip install global-land-mask`. Load `globe_combined_mask_compressed.npz`, whose `mask` array is True for water, with row 0 at 90°N and column 0 at 180°W. Downsample it to 240×120 by block mean, treating a cell as land when its water fraction is below 0.35. Invert it so 1 means land, then `numpy.packbits` it row by row and base64 encode the result (about 4,800 characters). Paste the string into `script.js` as `LAND_MASK`.
4. **Project screenshots.** Open each live dashboard at 1440×900, wait for the charts to render, and capture the first screen. Crop to 16:10 from the top-left. Save each as WebP at 1200 and 640 pixels wide, named `assets/images/project-<sop|sourcing|procurement|lean-six-sigma>-<width>.webp`. If the procurement dashboard does not load, use `docs/images/dashboard_compliance.png` from its repository instead.
5. **Favicon.** Make `assets/icons/favicon.svg`: a blue → cyan → emerald rounded square with "KK" in dark ink.
6. **Logos.** Save the official DHL, Decathlon and BWF logos as served on each organisation's own website (dhl.com's header `dhl-logo.svg`, decathlon.in's header logo, bwfbadminton.com's `logo-bwf-rgb.svg`) to `assets/logos/dhl.svg`, `decathlon.svg` and `bwf.svg`. Use them unaltered: strip only scripts or tracking attributes, and check they contain no `<script>` or event handlers.
7. **Resume.** Use the owner's own PDF if they provide one. Otherwise typeset a two-page A4 PDF from the resume text, applying the exclusions in rule 01 (no CGPA, no Lucknow University, no badminton or competitions, no Lovable link). Print it with headless Chromium to `assets/documents/resume.pdf`, then ask the owner to review it.

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
- **Value statement:** "I run supply chain operations and measure every change by its result."
- **About statement:** "3+ years across leadership, consulting, business strategy, operations and supply chain, measured in stock availability, margin and cash." A summary follows it: a cross-functional leader and Six Sigma Black Belt, then the roles at Decathlon and DHL, the consulting group's board and the analytics builds.
- **Contact invitation:** "Working on planning, sourcing, inventory or trade operations? I would like to hear about it."

Write all other copy in plain, confident professional English, and as little of it as the facts allow (rule 01, minimal text): one line per role summary and per project, results as figures with short labels. Use no filler adjectives, and keep every sentence to facts from rule 01.

## Phase 4 — Build `styles.css`

Order: font-face, tokens, base, layout helpers, shared parts (icons, logo tiles, chips, labels, tile light), navigation (liquid glass), buttons, hero (aurora, globe, floating windows, ledger), about (value chain, sector chips), experience (spine and head, metric tiles and their graphics, roadmap), projects gallery, skills (marquee, yard), strategy cards, industries, education cards, contact panel, footer, motion (two modes), responsive, print. The page ground is `--bg`, tiles `--surface`.

Breakpoints:
- 1200px: navigation collapses to the menu button;
- 1024px: hero stacks; ledger, about and contact become one column; the yard moves between the Skills title and the lists, and stops being sticky;
- 900px: project rows, themes and the role grid become one column;
- 600px: full-width hero buttons, one-column skills, industry groups and contact tiles; value-chain results move under their stage; only one hero window.

Any grid track that holds unbreakable text (the showcase address bar) is `minmax(0, 1fr)`, never a bare `1fr`.

Two anchor-offset rules:
- `html { scroll-padding-top: calc(var(--nav-h) + 1rem) }`;
- `.section { scroll-margin-top: calc(1rem - var(--section-space)) }`, so headings land about 2rem under the sticky bar.

## Phase 5 — Build `script.js`

Write one IIFE in `'use strict'` mode. Wrap each module in `safely(name, fn)` so one failure never blocks the rest. Modules, in order:

0. **motion** — before everything else (and in the head's inline script): set `<html data-motion>` to full or reduced, from the visitor's saved choice or the system setting.
1. **header** — adds `.is-scrolled`.
2. **menu** — as specified in rule 03.
3. **scroll spy** — `aria-current="true"` on the nav link for the section in view.
4. **split text** — splits the h2s and the footer line into words (letters for one-word headings), keeping a visually hidden full copy; each footer arrow joins the word before it and is read as a comma.
5. **reveal** — IntersectionObserver plus the scroll-settle failsafe.
6. **counters** — every `[data-count-to]` figure counts from its before value as it comes into view, in both modes, keeping thousands separators.
7. **word light** — lights the About statement word by word; skipped under reduced motion.
8. **spine** — fills the timeline spine and marks each role as reached.
9. **float windows** — the hero windows lean from a mouse pointer by depth.
10. **showcase** — project frames straighten toward mid-screen, lean toward a mouse, spin when dragged and spring back.
11. **gallery** — pins the projects on wide screens with full motion and slides them as a coverflow; the steps jump to a card and focus centres one; if a card cannot fit the pinned view, the list stays.
11a. **lean** — `[data-lean]` tiles lean toward a mouse in 3D and set the spotlight position (fine pointers, full motion).
11b. **magnetic** — `[data-magnet]` buttons drift toward the pointer.
12c. **motion toggle** and **idle animations** — the Animations switch; pausing off-screen CSS animations.
12. **copy email** — shown only when the Clipboard API exists in a secure context; announces through a `role="status"` region.
13. **year** — footer year.
14. **globe** — as specified in rule 02.
15. **roadmap** — the capacity-roadmap model, as specified in rule 02; built only as it approaches the screen.
16. **yard** — the Skills container yard, as specified in rule 02; built only as it approaches the screen.

Word light, spine, showcase, gallery and yard share one scroll loop (`onScroll`): each reads layout and returns a write, and all reads run before any write in the same frame.

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
