# Rule 02 — Design system (always on)

Bright, premium and professional on one dark theme:
- a blue → cyan → emerald signature gradient, with amber and coral highlights;
- Sora and Inter;
- results shown as graphics;
- 3D motion with purpose.

Match `.agents/reference/*.jpg`.

Owner's decisions (October 2026):
- the site is 3D-animated and dark throughout;
- text is minimal;
- **bright colours, gradients and soft glow are welcome**;
- `rehan19-cmd.github.io/portfolio` is inspiration **for structure and motion only**. Copy nothing from it.

## Tokens (`:root` in `styles.css`; use tokens, never raw values)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#060B18` | Page ground, header (frosted), footer |
| `--surface` / `--surface-2` / `--surface-3` | `#0C1528` / `#111D36` / `#18284A` | Tiles and panels / chips / tracks, hover |
| `--text` / `--text-soft` / `--text-muted` | `#F2F5FC` / `#B8C4DA` / `#8E9CB6` | Primary / secondary / notes (≥5.2:1 on every ground) |
| `--blue` `--cyan` `--emerald` `--teal` | `#4D8DFF` `#22D3EE` `#34D399` `#2DD4BF` | Brand hues: gradient stops, icons, gauges, lanes |
| `--amber` `--coral` | `#FFB648` `#FF7A66` | Highlights: "In my work", unit dots, markers, tags |
| `--grad` (and `--grad-v`) | blue → cyan → emerald | Primary buttons, logo mark, last name, figures, bars, progress, spine |
| `--ink` | `#050B17` | Text on bright fills (≥6.1:1) |
| `--line` / `--line-strong` | blue-white at 11% / 22% | Tile borders / dividers |
| `--brand-dhl` | `#FFCC00` | Only behind the DHL logo |

- Avoid: emoji, fake dashboards, stock blobs.
- Glow only where it means something: the globe's atmosphere, floating frames, the current project, the spine's head.
- The focus ring is 3px cyan.

## Type

- **Families:** Sora (display: headings, figures, buttons, labels) and Inter (body). Both variable, self-hosted (`assets/fonts`, OFL), with `font-display: swap`.
- **Scale:**
  - h1: `clamp(3.25rem, 1.4rem + 7.2vw, 7.5rem)`, 700, -0.05em;
  - h2: `clamp(2.375rem, 1.5rem + 3.6vw, 4.5rem)`, 700, -0.04em, with a gradient bar beneath;
  - body: 16–17px at 1.6.
- **Gradient text:** the last name and the footer name carry `--grad`, one slice per letter (`--n`/`--count`), with padding so descenders paint. Figures in feature tiles and Strategy cards carry it too.
- **Units:** words beside a figure (`.unit`) are half size.

## Shape and parts

- **Shape:**
  - radii: tiles 14px, panels 18px, gallery cards 24px, buttons pills;
  - grid tracks holding unbreakable text use `minmax(0, …)`.
- **Logo:** `.wordmark__mark` is a "KK" gradient tile beside the name in Sora. `favicon.svg` matches.
- **Icons:** an inline SVG sprite at the top of `<body>`, stroked with `url(#g-brand)`. Industry tiles stroke in their own hue.
- **Logo tiles:** official logos unaltered (`max-width`/`max-height`): DHL on DHL yellow, the others on white. They are decorative; the name is always in text.
- **Tile light:** every `[data-lean]` tile gains a gradient edge (masked `::before`) and a pointer-following spotlight (`::after`, `--mx`/`--my`) under a mouse.
- **Chips, labels:** `.chips`, `.label`.

## Sections in order (ids fixed)

1. **Header:**
   - frosted glass;
   - logo mark and name, eight links, the **Animations switch** and the gradient "Download resume";
   - a gradient progress line;
   - a Menu button below 1200px.
2. **Hero:**
   - aurora (radial washes, drifting) and a masked dot grid;
   - name (last name in the gradient), role, pin + location, one line, three magnetic buttons;
   - the globe with a CSS halo, plus two floating dashboards (one on phones);
   - a ledger of three panels with gradient bars and role logos.
3. **About:**
   - left (sticky on wide screens): statement (lights word by word) and a location pill;
   - **What I work on, across the value chain:** five stage rows (Plan blue, Source cyan, Make emerald, Deliver amber, Enable coral), each with an icon, three capabilities and one counted result, linked by a gradient line that draws down;
   - **Sectors I can serve:** sixteen chips, then a link to Industries.
4. **Experience:**
   - a timeline with sticky dates and a gradient spine with a glowing head;
   - per role: logo tile, company and title, one summary line, and bento **metric tiles**:
     - `.gauge` (cyan) for percentages;
     - `.duo` for before/after;
     - `.bar--down` (emerald) for reductions;
     - `.dots` (amber) for counts;
     - an icon otherwise;
   - DHL adds the roadmap model and `.scope` tiles;
   - earlier roles one line each.
5. **Projects:**
   - **wide screens with full motion:** a pinned **gallery**. The vertical scroll slides the cards sideways one-to-one; each card turns by its distance from the centre (rotateY ≤24°, pushed back ≤140px, dimmed). The current card glows in its hue. Beneath: an "n / 5" count, one step per project (a button that jumps to its card, `aria-current="step"`) and a gradient bar. Focus in a card centres it.
   - **fit:** spacing and the title scale with the screen height, so a card fits at common laptop sizes (1280×657 up). If one still does not fit (e.g. 1024×620), the script keeps the list.
   - **elsewhere:** alternating rows.
   - **every project:** its hue (`project--blue/cyan/emerald/amber/coral`).
     - Head: a category and an industry chip with its icon.
     - Text: the title, then the problem and what was built (two short sentences).
     - Results: an **impact strip** of three, each figure in the hue over its label (a `<dl>`, counted), then "Modelled on synthetic data". The body is a size container, so the figures scale with it and become rows on narrow cards.
     - Then the stack (pills; one quiet line in the gallery), **Live dashboard** (gradient) and **Repository** (ghost).
     - The frame shows the live address.
6. **Skills & tools:** a two-row marquee (outlined and solid, opposite directions, pauses on hover), then the lists and the sticky container yard.
7. **Business strategy:** four cards: icon, title, principle, and "In my work" with a gradient figure.
8. **Industries:** sixteen tiles in four groups, one hue each: Consumer and retail (blue), Industrial and manufacturing (amber), Trade and logistics (cyan), Services and sustainability (emerald).
   - Each tile is a row: icon, name, and the evidence behind it (rule 01).
   - Wide screens: four columns that share rows (subgrid). Two columns below 1200px, one below 600px.
9. **Education & credentials:** degree cards, leadership and publication cards, nine certificate tiles.
10. **Contact:** a glowing panel holding the h2, one line, the email with "Copy email", and six tiles (Resume in the gradient).
11. **Footer:** the gradient name on one line at `min(10vw, 9.25rem)`, a trademark note, and "Back to top".

## Motion

**Two modes**, on `<html data-motion>`, set before first paint:
- **Full.**
- **Reduced:** the gentle mode. A system request for reduced motion starts the page in it, and the **Animations switch** lets anyone choose; the choice is remembered (`localStorage`).
- **Motion prompt:** on such a device, until the visitor chooses, a small card at the foot of the screen (`.motion-note`, a `<section>` with an `aria-label`) offers "Turn on animations" or "Keep calm". Either answer is saved, so it never returns, and the header switch dismisses it too. Devices that do not ask never see it.
- **Reduced keeps:** fades, word-by-word headings fading in, tiles fading in turn, counters, gauge sweeps, bar and dot fills, word lighting, the spine and the heading bars.
- **Reduced drops:**
  - travel and 3D turns;
  - the hero's standing letters;
  - the aurora, bobbing and marquee;
  - the gallery (it becomes the list);
  - the frames' scroll turn;
  - lean and magnetic buttons;
  - smooth scrolling;
  - globe spin, and the scenes' intros (they show their final state).
- Without JavaScript nothing is hidden or moving.

- **Curves and properties.** `--ease-out: cubic-bezier(0.23,1,0.32,1)` and `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`. Never `ease-in`, `transition: all` or `scale(0)`. Animate transform and opacity (plus the aurora's transform). Entrance keyframes use `fill-mode: backwards`, so pointer lean can take over.
- **Hero (full).** Letters stand up from 72° (32ms stagger). Text rises 28px. The ledger lifts in turn. Dashboards float in, bob and lean from the pointer.
- **Reveals.**
  - Elements fade; in full motion they also rise 24px from 7°.
  - Split h2s and the footer name: parts stand up from 64° (fade only in reduced).
  - Staggered lists: tiles at `--k` × 75ms, rising from 12° in full; then their graphics play.
- **One scroll loop** (reads before writes): progress, word lighting, spine and head, frames, gallery, yard.
- **Pointer (fine pointers, full motion).**
  - Tiles lean at most 1100 ÷ their larger side in degrees, from 1.5° to 6°.
  - Hero buttons drift up to 5px using the `translate` property.
  - Frames lean ≤6° and spin ≤42° when dragged, then spring back (k 90, c 14).

## 3D (three.js r160, `window.THREE`)

There are three scenes; add none without the owner's approval. Every scene:
- uses only rule 01 facts;
- pauses off screen;
- is still in reduced mode, though it can still be dragged;
- has an `aria-hidden` canvas, with the figcaption carrying the same information.

three.js loads after `window.load`, once. The roadmap and yard build near the screen. Without WebGL a scene gets `.is-unavailable`. DPR is capped at 2. Built-in materials take `THREE.Color`; shader uniforms take sRGB vectors.

- **Globe:**
  - an 18k-dot Fibonacci sphere (11k on mobile), masked by NOAA GLOBE land, with dots tinted blue (south) to cyan (north);
  - ocean `#0B1D44`;
  - an atmosphere: a back-side halo and a fresnel rim, additive and premultiplied;
  - places in amber, labelled at the first clear spot;
  - lanes in cyan, with Uganda→EU in emerald, drawing in and carrying pulses;
  - motion: the dots gather in a ~3s intro, then it spins at 0.07 rad/s; drag with inertia; it leans toward the mouse and recedes as the hero scrolls away.
- **Roadmap** (DHL):
  - content: 2,000 emerald farm dots; blue stations, 3 solid + 3 recommended in cyan dashes; an amber dashed stack of 20 containers (384 MT); a cyan lane to an amber EU marker;
  - it assembles at 30% visible, then amber flow runs;
  - drag: ±0.6 rad.
- **Container yard** (Skills):
  - a crane with an amber trolley and spreader;
  - eight containers, 2 × 4, painted in Sora: SAP blue, WMS cyan, Excel emerald, Power BI amber, Tableau coral, MySQL ice, Python periwinkle, RPA teal (the same size, so no proficiency is implied);
  - wide screens: the scroll drives it, and each tool chip lights as its container lands;
  - narrow screens: it plays once;
  - drag: ±0.4 rad.
