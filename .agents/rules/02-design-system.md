# Rule 02 — Design system (always on)

Minimal, modern, premium and work-oriented. Strong type, generous whitespace, one restrained accent. Match `.agents/reference/*.jpg`.

## Tokens (defined on `:root` in `styles.css`; reference tokens, never raw values)

| Token | Value | Use |
| --- | --- | --- |
| `--navy-900` | `#0E1B2E` | Dark fields (nav, hero, strategy, contact), ink on light |
| `--navy-950` | `#0A1524` | Footer |
| `--navy-800` / `--navy-700` | `#15263D` / `#213650` | Tone steps on dark (ledger, panels, hover) |
| `--paper` / `--paper-2` | `#F5F4F0` / `#EBE9E3` | Light ground / tone step (projects) |
| `--ink-soft` / `--muted` | `#3F4856` / `#5A6371` | Secondary text on light |
| `--on-dark` / `--on-dark-soft` | `#F5F4F0` / `#B7C1CF` | Text on dark |
| `--accent` / `--accent-strong` | `#E5A53A` / `#F0B54E` | Amber: primary buttons, bars, markers, underlines only |
| `--line-light` / `--line-dark` | `rgba(14,27,46,.14)` / `rgba(245,244,240,.16)` | Subtle 1px borders |

Avoid: violet or indigo, gradients, glows, glassmorphism, decorative blobs, emoji, fake dashboards.

## Type

- One family: **Instrument Sans** variable (weight 400–700, width 75–100%), self-hosted, `font-display: swap`, fallback `"Segoe UI", system-ui, -apple-system, Arial, sans-serif`.
- Display (h1, h2, big figures): weight 600, `font-stretch: 78%`, tracking -0.03 to -0.045em, line-height 0.85–0.95.
- Scale: h1 `clamp(3.75rem, 1.5rem + 9.5vw, 9.5rem)`; h2 `clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)`; h3 `clamp(1.375rem, 1.15rem + .9vw, 1.875rem)`; statement `clamp(1.5rem, 1.1rem + 1.6vw, 2.25rem)`; body 16–17px, line-height 1.55.
- Sentence case. No all-caps eyebrow labels, no accent-coloured words in headlines, no 01/02/03 numbering, no monospace. Tabular figures on metrics.

## Shape and spacing

- Buttons are pills (`999px`), min height 48px (44px small). Cards and panels: 6px radius.
- Container max 80rem plus gutters `clamp(1.25rem, .75rem + 2.5vw, 3rem)`. Sections spaced `clamp(5rem, 3rem + 7vw, 10rem)`.
- Neighbouring sections use different compositions. Alternate fields: hero navy, about/experience paper, projects paper-2, skills paper, strategy navy, education paper, contact navy, footer navy-950.

## Sections in order (ids are fixed; nav links point to them)

1. **Header** (sticky, navy): wordmark "Kushagra Kartikey"; links About, Experience, Projects, Skills, Strategy, Education, Contact; amber "Download resume". Collapses to a Menu button below 1100px.
2. **Hero `#top`**: left 7/12 columns hold the h1 name on two lines, role, "Delhi, India | Open to Relocation", value statement, and buttons Contact me (amber), View projects, Download resume (ghost). Right 5/12 holds the globe with a text caption. Below it, a **results ledger** of three panels with a before→after bar each: gross margin 21.2→40.5% (scale 0–50), DSO 70→30 days projected (scale 0–80, outlined "before" mark), stock availability 95%+.
3. **About**: h2 plus statement on the left; three paragraphs and a facts list (Based in, Focus, Sectors) on the right.
4. **Experience**: timeline rows (dates and place in the left 3/12, content in 9/12) with results grids (big figure plus short label, white cells, 1px dividers). The DHL GBSN role adds the capacity-roadmap figure (see 3D) between its results grid and its work list.
5. **Projects**: 2-column grid of cards with screenshot (16:10, `object-position: top left`), metric pill, title, Problem, description, tech tags, "View repository" and "Open live dashboard". With an odd number of cards, the last spans both columns with the image beside the text on desktop.
6. **Skills & tools**: three columns. Title; Operations as ruled list rows; Tools as chips.
7. **Business strategy** (navy): 2×2 theme panels, each with an "In my work" proof box (amber left border); then five sector columns with amber top rules.
8. **Education & credentials**: Education + Leadership and publication on the left; nine linked certifications on the right.
9. **Contact** (navy): h2, invitation statement, large underlined email with "Copy email", six contact tiles (Email, LinkedIn, WhatsApp, Phone, GitHub, Resume in amber).
10. **Footer**: name at very large display size, short meta line, "Back to top".

## Motion (Emil Kowalski-style restraint)

- Curves: `--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`. Never `ease-in`, never `transition: all`, never `scale(0)`.
- Hero entrance: CSS keyframes, staggered 70–340ms. The two name lines stand up in 3D (`perspective(900px)`, rotateX 42° → 0, rise 28px, fade); role, location, statement and buttons rise 28px and fade; the ledger lifts as one panel. Ledger bars grow from "before" to "after" (`scaleX`), and the numbers count up in JS.
- Scroll reveals: IntersectionObserver adds `.is-visible`; elements rise 24px and fade with a 7° perspective tilt that settles flat; display headings (h2, footer name) stand up from 38°; project cards lift from 10°. Stagger `--i × 70ms` among elements arriving together (90ms for cards). Styles apply only under `html.js.reveal-ready`. A failsafe reveals anything scrolled past. Every settled state is `transform: none`; state it explicitly whenever a hidden-state selector has the same specificity as the visible one.
- Tilting display text shrink-wraps (`width: fit-content`), so the perspective centres on the words.
- Hover effects only inside `@media (hover:hover) and (pointer:fine)`. Press feedback via `:active` scale 0.97. UI transitions 160–220ms.
- `prefers-reduced-motion: reduce`: no travel, everything visible, globe still (it can still be dragged).

## 3D (three.js r160, classic build `window.THREE`)

Owner's decision (October 2026): the site is 3D-animated. It has two deliberate three.js scenes, the **hero globe** and the **capacity-roadmap model**, plus CSS 3D depth in the motion system. Do not add further scenes without the owner's approval. Every scene:
- shows only facts from rule 01;
- stays inside the palette (no glows, gradients or bloom);
- pauses off screen;
- is still under reduced motion.

Shared foundation:
- Load `assets/vendor/three.min.js` lazily after `window.load`, via `requestIdleCallback`, once for both scenes. Check WebGL first; on failure add `.is-unavailable` and leave the caption as text.
- Each scene's canvas is `aria-hidden`; its figcaption carries the same information.
- DPR capped at 2. Animation curves in JS reuse `--ease-out` and `--ease-in-out` (cubic-bezier solved in `script.js`).

### Hero globe

- Scene: PerspectiveCamera fov 32 at z 4.6 (4.2 under 600px wide). Tilt group `rotation.x = 0.36`. Spin group starts centred on 45°E.
- Opaque ocean sphere `#15263D` (radius 0.985) hides the back side. A faint camera-facing silhouette ring.
- Land as dots: a Fibonacci sphere (18k points, 11k on mobile) filtered by the embedded 240×120 land mask. PointsMaterial `#C9D3E0`, size 0.042 (0.05 mobile), round canvas texture.
- Places: Delhi, Lucknow, Mumbai, Uganda, EU market (Brussels), Varna, Washington DC. Amber markers with pulsing rings and HTML labels positioned by projection, clamped inside the frame.
- Arcs along great circles: Uganda→EU (primary), DC→Uganda, Delhi→Varna, Delhi→Mumbai, Delhi→Lucknow. They draw in once, then small travellers move along them.
- Slow auto-rotation (0.07 rad/s). Drag to rotate with inertia (`touch-action: pan-y` keeps vertical scrolling). Pause when off screen or the tab is hidden.
- Land dots keep `PointsMaterial` (extended through `onBeforeCompile`): they thin and dim toward the rim.
- Intro (about 3 s):
  - dots gather from just above the surface, in a wave spreading from the side facing the viewer;
  - meanwhile the camera eases in (z + 1.1 → base) and the globe turns 0.55 rad into place;
  - markers land with a small settle (never from scale 0);
  - arcs, drawn as thin tubes, draw in; then a short amber pulse carries each traveller along its lane.
- It leans up to 0.12 rad toward a mouse pointer over the hero (fine pointer only). As the hero scrolls away, it recedes (camera + 0.8) and turns a further 0.6 rad.

### Capacity-roadmap model

- Placement: Experience → DHL GBSN Fellowship, between the results grid and the work list.
- Panel: `figure.roadmap`, navy, 6px radius, a caption with a legend. Aspect ratio 2:1, 16:11 under 900px, 5:6 under 600px.
- Content, from rule 01 only:
  - 2,000 smallholder farms (exactly 2,000 dots over rolling terrain);
  - washing stations: 3 in place (solid) and 3 recommended (dashed outline);
  - the roadmap to 20 export containers (384 MT) a year, as a dashed-outline stack;
  - the export lane to the EU market, with an amber marker like the globe's.
- Legend: solid = in place; dashed outline = recommended or roadmap.
- Assembly, once, when 30% of the model is visible:
  - farms rise left to right;
  - the stations in place grow, then the recommended ones appear;
  - the containers drop in one by one;
  - the lanes draw, and amber flow dots start running farms → stations in place → stack → EU market.
- Camera: fitted to the panel's shape (wide panels look across the flow, tall ones down it), with a slow sway. Drag turns it ±0.6 rad and it eases back after 3 s; it leans slightly toward a mouse.
- Labels are HTML, kept inside the frame, and nudged apart when they collide. Under 600px they are smaller and the long one wraps.
- Reduced motion: final state at once, still.

### CSS 3D

- Project cards tilt toward a mouse pointer (max 4°, eased in JS like a light spring; wide cards tilt less), and the screenshot drifts the opposite way. Mouse hover only, never under reduced motion. Each card's transform carries its own `perspective()`; the grid sets none.
