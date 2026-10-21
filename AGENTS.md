# AGENTS.md — Kushagra Kartikey portfolio

You are working on the personal portfolio website of **Kushagra Kartikey, Supply Chain & Operations Professional** (Delhi, India, open to relocation). The audience is recruiters, consulting firms, global capability centres, supply chain leaders, clients and partners. The site must look highly work-oriented and professional.

## What this project is

A single-page static website, published with **GitHub Pages** so anyone with the link opens the website itself, never the repository.

- Plain **HTML5, CSS3 and vanilla JavaScript**. No framework, no npm, no bundler, no build step, no backend, no API keys.
- One external library only: **three.js r160**, vendored locally at `assets/vendor/three.min.js` (classic UMD build), for the three 3D scenes: the hero globe, the capacity-roadmap model and the Skills container yard. No CDNs.
- Every path is **relative** (never starting with `/`), so the site works at `user.github.io/` and at `user.github.io/repo-name/`.
- No third-party builder branding of any kind (for example "Made with Lovable").

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | All content and structure. **The source of truth for wording.** |
| `styles.css` | Design tokens (section 2) and all styling |
| `script.js` | Motion modes and the Animations switch, menu, scroll spy, reveals, split headings and staggered tiles, one shared scroll loop (word lighting, spine, frames, projects gallery and its steps), counters, tile lean, magnetic buttons, copy email, three.js scenes (globe, roadmap model, container yard) |
| `README.md` | GitHub Pages deployment guide for the owner |
| `assets/documents/resume.pdf` | Target of every "Download resume" button |
| `assets/images/` | Project dashboard screenshots, WebP, `-640` and `-1200` widths; `social-card.jpg` (1200×630 link preview) |
| `assets/logos/` | Official DHL, Decathlon and BWF logos (SVG, unaltered), shown beside those roles |
| `assets/fonts/` | Sora and Inter variable fonts (self-hosted subsets with ₹ and arrows) + OFL licences |
| `assets/vendor/` | three.js r160 + MIT licence |
| `assets/icons/favicon.svg` | KK monogram |
| `.agents/rules/` | Always-on rules: content accuracy, design system, quality gates |
| `.agents/workflows/` | `/rebuild-portfolio`, `/add-project-card`, `/qa-and-publish` |
| `.agents/reference/` | Screenshots of the approved design (desktop 1440, mobile 390) |

## Status

The **3D build is complete and tested** (October 2026), and it is live on GitHub Pages. A second round at the owner's request made it more cinematic. It took structure and motion ideas from a reference site, copying nothing (rule 02):
- floating dashboards in the hero;
- a dark project showcase in browser frames;
- a third scene, the container yard;
- split-text headings, word lighting and a timeline spine.

A third round (October 2026), at the owner's request:
- one dark theme throughout;
- far less text: results shown as gauges, bars and unit dots;
- official DHL, Decathlon and BWF logos beside those roles;
- the companies shown as "DHL" and "BWF (Badminton World Federation)" (rule 01);
- clearer, uniformly structured projects;
- 3D tile lean across the page.

A fourth round (October 2026), at the owner's request:
- a bright palette (blue → cyan → emerald gradient, amber and coral);
- Sora and Inter, and a KK logo mark;
- a pinned 3D projects gallery, a skills marquee and an Industries section;
- the 3D scenes re-coloured, with a globe atmosphere;
- two motion modes with an Animations switch, so a device that asks for reduced motion still gets gentle animation.

A fifth round (October 2026), at the owner's request ("impactful and industry driven", "more sectors"):
- project cards led by their industry, the business problem and three modelled results from each README, with steps under the gallery that jump to a project;
- About's "What I work on" as a value chain (Plan, Source, Make, Deliver, Enable), each stage with three capabilities and one result from a role;
- sixteen sectors: chips in About, and an Industries section in four groups with the evidence for each.

A sixth round (October 2026), at the owner's request ("looks AI slopish; make it more professional and industry centric; keep the animations; remove the progress bar"):
- consulting-firm styling: navy ink with one cobalt accent, Source Serif 4 headings and figures (lining, tabular), Source Sans 3 text;
- no gradient text, glows, neon hues, dot grid or tinted icon tiles; the reading-progress line and the gallery bar are gone;
- liquid glass only on the header, the gallery's step strip and the motion prompt;
- every animation and 3D scene kept, with the scenes re-coloured to match.

A seventh round (October 2026), at the owner's request ("refine and fine tune, do not make a lot of changes"; replace the big name at the bottom):
- the footer closes on the value chain, "Plan → Source → Make → Deliver → Enable", above a three-column sitemap (wordmark and role, Sections, Connect) and the legal line;
- link previews: canonical address, a 1200×630 social card from the hero, `summary_large_image`, and Person structured data;
- no lone last words in paragraphs (`text-wrap: pretty`), balanced h3/h4.

An eighth round (October 2026), at the owner's request ("the 2:05 pm version was more visually appealing; blend the two"):
- the round 4–5 look is back: Sora and Inter, the blue → cyan → emerald gradient (last name, buttons, logo mark, spine, bars), stage and industry hues, the aurora and the brighter 3D scenes;
- kept from rounds 6–7: no progress bars, figures in solid ink with tabular digits, liquid glass on the header, gallery strip and motion prompt, no hero dot grid, the value-chain footer, link previews and tidy line breaks.

Five projects are live, including Inventory Optimization & Replenishment Engine, so `/add-project-card` is done. No task is open. The owner has said **do not** add the `nutricircle-sop-intelligence` project and **no headshot**.

The approved pre-3D site remains unchanged in the sibling folder `kushagra-kartikey-portfolio/` for reference.

## How to work here

1. Read all three files in `.agents/rules/` before any edit. They hold the owner's decisions and are not optional.
2. Open the screenshots in `.agents/reference/` and keep the design consistent with them.
3. Make the smallest change that does the job. Keep the existing class names, tokens and structure.
4. Verify in the browser after every change (Antigravity's browser agent): desktop 1440, tablet 768, mobile 390 and 320. Report what you checked and what you could not check. Never claim a test you did not run.
5. Never invent facts, metrics, employers, titles, certifications, links or contact details. If something is missing, ask the owner.
