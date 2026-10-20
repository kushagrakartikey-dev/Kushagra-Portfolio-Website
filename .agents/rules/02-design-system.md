# Rule 02 — Design system (always on)

Premium, work-oriented and cinematic: **one dark theme**, strong type, one amber accent, results shown as graphics rather than prose, and 3D motion with purpose. Match `.agents/reference/*.jpg`.

Owner's decisions (October 2026):
- the site is 3D-animated and dark throughout;
- text is minimal;
- `rehan19-cmd.github.io/portfolio` is inspiration **for structure and motion only**. Copy nothing from it, and none of its ornaments (gradients, glows, eyebrow labels, numbering).

## Tokens (on `:root` in `styles.css`; use tokens, never raw values)

| Token | Value | Use |
| --- | --- | --- |
| `--navy-950` | `#0A1524` | Page ground, header, footer |
| `--navy-900` | `#0E1B2E` | Tiles and panels |
| `--navy-800` / `--navy-700` | `#15263D` / `#213650` | Tags, tracks, frame chrome / hover, empty gauge track |
| `--on-dark` / `--on-dark-soft` / `--on-dark-muted` | `#F5F4F0` / `#B7C1CF` / `#97A3B4` | Text: primary / secondary / notes and captions |
| `--accent` / `--accent-strong` / `--accent-line` | `#E5A53A` / `#F0B54E` / amber at 45% | Buttons, figures' graphics, icons, markers / hover / outlines |
| `--line-soft` / `--line-dark` | off-white at 9% / 16% | Tile borders / spine, menu rules |
| `--brand-dhl` | `#FFCC00` | Only behind the DHL logo |

Contrast: muted text is at least 4.8:1 on every navy, and amber focus rings are 7:1 or more. Avoid violet or indigo, gradients, glows, glassmorphism, blobs, emoji, fake dashboards, eyebrow labels and index numbers. Shadows only on things that float (hero windows, showcase frames).

## Type

- One family: **Instrument Sans** variable (400–700, width 75–100%), self-hosted, `font-display: swap`.
- Display (h1, h2, figures): weight 600, `font-stretch: 78%`, tracking -0.03 to -0.045em.
- Scale: h1 `clamp(3.75rem, 1.5rem + 9.5vw, 9.5rem)`; h2 `clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)`; h3 `clamp(1.375rem, 1.15rem + .9vw, 1.875rem)`; body 16–17px.
- Unit words beside a figure (`.unit`: days, months, ~USD) are set at half size, so a figure never breaks across lines.
- Sentence case. Tabular figures.

## Shape and parts

- Radii: buttons pills; tiles 10px; panels and cards 14px.
- Grid tracks holding unbreakable text use `minmax(0, …)`.
- **Icons:** one inline SVG sprite at the top of `<body>` (`#i-…` symbols), drawn as 1.7px amber line icons. A filled glyph marks its path `.icon-fill`.
- **Logo tiles:** `.logo-tile`, 8.5 × 3.5rem; `--sm` in the ledger; `--tall` for BWF. The logo is unaltered and sized with `max-width`/`max-height` (never stretched), with DHL on DHL yellow and the others on white. Decorative (`aria-hidden`); the name is always in text beside it.
- **Chips:** `.chips` (`--lg`): a pill with an amber icon and a label.
- **Labels:** `.label`, small muted group headings above tiles.

## Sections in order (ids are fixed)

1. **Header:**
   - wordmark, seven links, amber "Download resume";
   - an amber reading-progress line;
   - a Menu button below 1100px.
2. **Hero `#top`:**
   - name in letters, role, pin + "Delhi, India | Open to Relocation", a one-line statement, three buttons;
   - the globe with two floating live dashboards (one on phones), never covering its caption;
   - a **ledger** of three panels (gross margin, DSO projected, stock availability), each with a bar, a short "from" note and the logo of the role it came from.
3. **About:**
   - the h2 and the statement, which lights word by word;
   - six focus tiles (S&OP, Inventory, Sourcing, Working capital, Trade compliance, Delhi / open to relocation);
   - sector chips.
4. **Experience:** a timeline with the dates column sticky on wide screens and a spine that fills amber.
   - **Each role:** a logo tile with the company and title; one short summary line; then **metric tiles**.
   - **Metric tiles** read figure first, then label and note. The graphic sits at the foot:
     - `.gauge` for percentages;
     - `.duo` (before/after bars) and `.bar--down` with `--r15/30/35/40` for reductions;
     - `.dots` for counts;
     - an icon otherwise.
   - **Bento grids:** `metrics--3` (DHL), `--7` (Decathlon), `--5` (BWF). The headline tile (`--feature`) spans two rows, or runs sideways across a full row on narrower screens.
   - **DHL** adds the roadmap model and a `.scope` list (traceability, export, quality, capex).
   - **Earlier roles** are one line each.
5. **Projects:** alternating rows, 7/12 frame and 5/12 text.
   - Each screenshot sits in a browser frame showing its live address.
   - Text, always in this order: metric chip, title, one line, stack tags, then **Live dashboard** (amber button) and **Repository** (ghost button).
6. **Skills & tools:** the title, Operations rows and Tool chips on the left; the container yard on the right (sticky). Below 1024px the yard sits under the title.
7. **Business strategy:** four cards in 2×2. Each has an icon, a title, a one-line principle and "In my work" with a big figure and its qualifier. Then sector chips.
8. **Education & credentials:** three degree cards, two cards (leadership, publication) and nine certificate tiles in a 3-column grid.
9. **Contact:** the h2, one line, the email with "Copy email", and six tiles (Resume in amber).
10. **Footer:** the name on one line at `min(14.4vw, 13.2rem)`, a meta line with the trademark note, and "Back to top".

## Motion

- **Curves and properties.** `--ease-out: cubic-bezier(0.23,1,0.32,1)` and `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`. Never `ease-in`, `transition: all` or `scale(0)`. Animate only transform and opacity: the gauge sweeps by rotating a half ring; bars scale.
- **Hero.** Letters stand up from a 72° tilt (32ms stagger). Text rises 28px. The ledger panels lift in turn while their bars grow and the numbers count. The dashboards float in at ~1.3s, then bob and lean from the pointer.
- **Reveals.** Under `html.js.reveal-ready`, with a failsafe:
  - **Elements** rise 24px from a 7° tilt.
  - **h2s and the footer name** split into words (letters for single words) that stand up in turn, with a visually hidden copy for assistive technology.
  - **Staggered lists** (`.reveal.stagger`) hold still while their tiles arrive in turn (`--k` × 75ms, a 12° tilt). The tile's graphic then plays (gauge sweep, bars, dots one by one, icon) and its counter counts.
  - **Keyframes** use `fill-mode: backwards`, so each tile ends on its own resting style.
- **Scroll loop.** A single rAF loop reads layout before writing. It drives the progress line, word lighting, the spine, the showcase frames and the yard.
- **Showcase frames.** They straighten at mid-screen (≤16° turn, ≤10° tilt), lean ≤6° toward a mouse, and spin ≤42° when dragged, then spring back (k 90, c 14).
- **Tile lean.** `[data-lean]` tiles lean toward a mouse in 3D: at most 1100 ÷ their larger side in degrees, from 1.5° to 6°. Fine pointers only.
- **Hover.** Only inside `(hover:hover) and (pointer:fine)`. `:active` scale 0.97. UI transitions 160–220ms.
- **`prefers-reduced-motion: reduce`.** Everything is visible and final: no travel, no counting, no lighting, no tool markers; frames are flat; the scenes are still but can still be dragged.

## 3D (three.js r160, classic build `window.THREE`)

There are three scenes, each shown in its section above; add none without the owner's approval. Every scene:
- uses only rule 01 facts and the palette;
- pauses off screen;
- is still under reduced motion;
- has an `aria-hidden` canvas, with the figcaption carrying the same information.

three.js loads after `window.load` (idle time), once for all scenes. The roadmap and yard build as they near the screen. Without WebGL, a scene gets `.is-unavailable` and only its caption remains. DPR is capped at 2. The roadmap and yard share the three-tone face shader and `dragToTurn`.

- **Hero globe:**
  - camera: fov 32, z 4.6;
  - land: an 18k-dot Fibonacci sphere (11k on mobile), masked by the embedded 240×120 NOAA GLOBE land mask, thinning toward the rim;
  - places: amber markers for Delhi, Lucknow, Mumbai, Uganda, EU market, Varna and Washington DC, labelled at the first clear spot;
  - lanes: arcs Uganda→EU, DC→Uganda, Delhi→Varna, Delhi→Mumbai and Delhi→Lucknow, which draw in and carry amber pulses;
  - intro: ~3s, with the dots gathering in a wave;
  - motion: 0.07 rad/s; drag with inertia; it leans ≤0.12 rad to the mouse and recedes as the hero scrolls away.
- **Capacity roadmap** (DHL role):
  - content: 2,000 farm dots, 3 solid + 3 dashed washing stations, a dashed stack of 20 containers (384 MT) and the lane to the EU;
  - it assembles at 30% visible, then amber flow runs;
  - shape: 2:1 (16:11 under 900px, 5:6 under 600px);
  - drag: ±0.6 rad, then it eases back.
- **Container yard** (Skills):
  - a gantry crane stacks eight 20 ft containers, 2 × 4, painted SAP, WMS, Excel, Power BI, Tableau, MySQL, Python and RPA (the same size: no proficiency);
  - each lift: truck, spreader down, lift, carry, lower, return;
  - wide screens: the scroll drives it, from 55% down the screen to the foot of the lists, and each tool chip gains an amber marker as its container lands; off screen it settles at once;
  - narrow screens: it plays once (9s) at 35% visible;
  - drag: ±0.4 rad, pulling back slightly to stay framed.
