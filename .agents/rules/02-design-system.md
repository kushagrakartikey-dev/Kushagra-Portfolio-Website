# Rule 02 — Design system (always on)

Professional and industry-centric, in the manner of a consulting firm, on one dark theme:
- navy ink grounds and **one cobalt accent**;
- Source Serif 4 for headings and figures, Source Sans 3 for text;
- results shown as graphics, figures set like an annual report;
- 3D motion with purpose (every animation from earlier rounds is kept).

Match `.agents/reference/*.jpg`.

Owner's decisions (October 2026):
- the site is 3D-animated and dark throughout, and keeps all its animations;
- round 6: it must not look "AI-generated". So there is no gradient text, no glow, no multi-colour palette, no dot grid, no tinted icon tiles, and no progress bars;
- **liquid glass** only at a few points of floating chrome: the header, the gallery's step strip and the motion prompt;
- `rehan19-cmd.github.io/portfolio` is inspiration **for structure and motion only**. Copy nothing from it.

## Tokens (`:root` in `styles.css`; use tokens, never raw values)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#07111F` | Page ground, footer |
| `--surface` / `--surface-2` / `--surface-3` | `#0C1A2C` / `#112235` / `#182C44` | Tiles and panels / chips / tracks, hover |
| `--text` / `--text-soft` / `--text-muted` | `#F1F4F8` / `#B6C0CE` / `#8E9BAD` | Primary / secondary / notes (≥5.6:1 on every ground) |
| `--accent` | `#5B8DEF` | The one accent: icons, rules, gauges, bars, unit squares, links, the current step (5.9:1 on `--bg`) |
| `--accent-strong` / `--accent-hover` | `#2F64D6` / `#3A72E8` | Fills carrying white text: primary buttons, the logo mark, the Resume tile (5.4:1) |
| `--blue` `--cyan` `--emerald` `--teal` `--amber` `--coral`, `--grad`, `--grad-v` | all resolve to `--accent` | Older names kept so every part speaks with one colour |
| `--line` / `--line-strong` | blue-grey at 12% / 22% | Tile borders / dividers |
| `--brand-dhl` | `#FFCC00` | Only behind the DHL logo |

- Avoid: emoji, gradient text, coloured glows, neon hues, decorative grids, stock blobs, fake dashboards.
- Shadows are neutral and dark. The only light effects are the globe's own atmosphere and one soft, slowly drifting cobalt light behind the hero and the contact panel.
- The focus ring is 3px cobalt.

## Type

- **Families:** Source Serif 4 (`--font-serif`: h1, h2, the statements, project titles, every figure, the footer line, the marquee) and Source Sans 3 (`--font-display` and `--font-body`: text, h3/h4, buttons, labels). Both are variable, self-hosted subsets (`assets/fonts`, OFL) that include ₹, → and −, with `font-display: swap`. The serif is pinned at optical size 32.
- **Figures:** `font-variant-numeric: var(--figures)` (lining, tabular), weight 600, solid `--text`. Unit words (`.unit`) are in the sans, at 0.46em, muted.
- **Scale:**
  - h1: `clamp(3.25rem, 1.4rem + 7.2vw, 7.5rem)`, 600, -0.03em; the last name is the same serif at 400;
  - h2: `clamp(2.375rem, 1.5rem + 3.6vw, 4.5rem)`, 600, -0.025em, with a 3rem × 3px cobalt rule beneath;
  - body: 16–17px at 1.6.

## Shape and parts

- **Shape:**
  - radii: tiles 10px, panels 12px, gallery cards 14px, contact panel 16px, buttons 8px, chips as pills;
  - grid tracks holding unbreakable text use `minmax(0, …)`.
- **Liquid glass (`.glass`, and the header):** a translucent navy tint, `blur(18px) saturate(170%)`, a brighter top rim, an inset highlight and a dark shadow. It is near-opaque without `backdrop-filter` and under `prefers-reduced-transparency`. Never use it on data or large content panels.
- **Logo:** `.wordmark__mark` is a cobalt "KK" tile in the serif beside the name. `favicon.svg` matches.
- **Icons:** an inline SVG sprite at the top of `<body>`, stroked in `--accent`. Industry and value-chain icons stand bare, or on a hairline circle node; never in tinted squares.
- **Logo tiles:** official logos unaltered (`max-width`/`max-height`): DHL on DHL yellow, the others on white. They are decorative; the name is always in text.
- **Tile light:** under a mouse, every `[data-lean]` tile's edge turns cobalt (masked `::before`), and a faint white light follows the pointer (`::after`, `--mx`/`--my`).
- **Chips, labels:** `.chips`, `.label`.

## Sections in order (ids fixed)

1. **Header:**
   - liquid glass;
   - logo mark and name, eight links, the **Animations switch** and the cobalt "Download resume";
   - no progress line (removed at the owner's request);
   - a Menu button below 1200px.
2. **Hero:**
   - one soft cobalt light, drifting;
   - name (serif; last name at 400), role, pin + location, one line, three magnetic buttons;
   - the globe with a CSS halo, plus two floating dashboards (one on phones);
   - a ledger of three panels with serif figures, bars and role logos.
3. **About:**
   - left (sticky on wide screens at least 820px tall): statement (lights word by word), a summary paragraph with its key phrases in bold, and a location pill;
   - **What I work on, across the value chain:** five stage rows (Plan, Source, Make, Deliver, Enable), each with an icon on a hairline node, three capabilities and one counted serif figure, linked by a cobalt hairline that draws down;
   - **Sectors I can serve:** sixteen chips, then a link to Industries.
4. **Experience:**
   - a timeline with sticky dates and a cobalt spine with a small white head;
   - per role: logo tile, company and title, one summary line, and bento **metric tiles**:
     - `.gauge` for percentages;
     - `.duo` for before/after;
     - `.bar--down` for reductions;
     - `.dots` (squares) for counts;
     - an icon otherwise;
   - DHL adds the roadmap model and `.scope` tiles;
   - earlier roles one line each.
5. **Projects:**
   - **wide screens with full motion:** a pinned **gallery**. The vertical scroll slides the cards sideways one-to-one; each card turns by its distance from the centre (rotateY ≤24°, pushed back ≤140px, dimmed). The current card's edge turns cobalt. Beneath, on a glass strip: an "n / 5" count and one step per project (a button that jumps to its card, `aria-current="step"`, underlined when current). No bar. Focus in a card centres it.
   - **fit:** spacing and the title scale with the screen height, so a card fits at common laptop sizes (1280×657 up). If one still does not fit (e.g. 1024×620), the script keeps the list.
   - **elsewhere:** alternating rows.
   - **every project:** one accent for all (the `project--*` classes remain).
     - The serif title, then a meta line (category and an industry chip), then the problem and what was built.
     - Results: an **impact strip** of three, each figure in the hue over its label (a `<dl>`, counted), then "Modelled on synthetic data". The body is a size container, so the figures scale with it and become rows on narrow cards.
     - Then the stack (pills; one quiet line in the gallery), **Live dashboard** (cobalt) and **Repository** (ghost).
     - The frame shows the live address.
6. **Skills & tools:** a two-row marquee (outlined and solid, opposite directions, pauses on hover), then the lists and the sticky container yard.
7. **Business strategy:** four cards: icon, title, principle, and "In my work" with a serif figure.
8. **Industries:** sixteen tiles in four groups under ruled titles: Consumer and retail, Industrial and manufacturing, Trade and logistics, Services and sustainability.
   - Each tile is a row: icon, name, and the evidence behind it (rule 01).
   - Wide screens: four columns that share rows (subgrid). Two columns below 1200px, one below 600px.
9. **Education & credentials:** degree cards, leadership and publication cards, nine certificate tiles.
10. **Contact:** a panel with a slow cobalt light, holding the h2, one line, the email with "Copy email", and six tiles (Resume in cobalt).
11. **Footer** (round 7): "Plan → Source → Make → Deliver → Enable" in the serif, cobalt arrows never starting a line; a sitemap (wordmark, Sections, Connect); the trademark line, "Back to top".

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
  - Split h2s and the footer line: parts stand up from 64° (fade only in reduced).
  - Staggered lists: tiles at `--k` × 75ms, rising from 12° in full; then their graphics play.
- **One scroll loop** (reads before writes): word lighting, spine and head, frames, gallery, yard.
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
  - an 18k-dot Fibonacci sphere (11k on mobile), masked by NOAA GLOBE land, tinted cobalt to pale cobalt;
  - ocean `#0B1D44`;
  - an atmosphere: a back-side halo and a fresnel rim, additive and premultiplied;
  - places in muted amber (`0xE3AE55`), labelled at the first clear spot;
  - lanes in pale cobalt, with Uganda→EU in near-white, drawing in and carrying pulses;
  - motion: the dots gather in a ~3s intro, then it spins at 0.07 rad/s; drag with inertia; it leans toward the mouse and recedes as the hero scrolls away.
- **Roadmap** (DHL):
  - content: 2,000 muted-green farm dots; cobalt stations, 3 solid + 3 recommended (dashed); a muted-amber dashed stack of 20 containers (384 MT); a lane to the EU marker;
  - it assembles at 30% visible, then amber flow runs;
  - drag: ±0.6 rad.
- **Container yard** (Skills):
  - a crane with an ochre trolley and spreader;
  - eight containers, 2 × 4, labelled in Source Sans 3, in real container colours: SAP cobalt, WMS steel, Excel green, Power BI ochre, Tableau rust, MySQL grey, Python navy, RPA olive (one size, so no proficiency is implied);
  - wide screens: the scroll drives it, and each tool chip lights as its container lands;
  - narrow screens: it plays once;
  - drag: ±0.4 rad.
