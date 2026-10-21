# Rule 03 — Quality gates (always on)

No change is finished until these pass. Report results honestly: say what you ran, what passed, and what you could not verify.

## Accessibility (WCAG 2.2 AA)

- Landmarks: `header`, `nav`, `main`, `footer`; one `h1`; every section has an `h2`; skip link to `#main`.
- Visible focus: 3px cyan outline everywhere (the whole site is dark).
- Mobile menu: a `<button>` with `aria-expanded` and `aria-controls="site-menu"`. Escape closes it and returns focus to the button. It also closes after a link is chosen and on an outside click. When closed, its links are not focusable (`visibility: hidden`).
- Every image has real alt text. Decorative images use `alt=""` inside an `aria-hidden` wrapper: the hero's floating windows, and the logo tiles, whose company name is always in the text beside them. Icons and metric graphics are `aria-hidden`; the figure and label next to them carry the meaning.
- Every 3D canvas is `aria-hidden`; its figcaption carries the information.
- Split text keeps one readable copy: the hero name and split headings put their letter or word spans in an `aria-hidden` copy, beside a visually hidden full copy.
- Contrast is at least 4.5:1 for text and 3:1 for focus rings. The lowest text pairing is `--text-muted` on `--surface-3`, at 5.3:1. Dark ink on every bright fill is at least 6.1:1.
- Motion: the **Animations switch** (`aria-pressed`) lets any visitor stop all continuous movement (globe spin, marquee, aurora), as WCAG 2.2.2 requires. A system request for reduced motion starts the gentle mode.
- Touch targets are at least 44px. Never disable zoom.
- Without JavaScript, all content is visible and the menu shows as a plain list.

## Performance

- No external requests at all: fonts, three.js, images and logos are local.
- Project images are WebP with `srcset` (640/1200), `width`/`height`, `loading="lazy"` and `decoding="async"`. The hero's floating windows reuse the 640px files, without lazy loading, because they are on the first screen.
- three.js loads after page load, once for all three scenes. The roadmap and the yard build only as they approach the screen. Every render loop stops off screen and in hidden tabs.
- Scroll-linked effects share one `requestAnimationFrame` loop that reads layout before it writes.
- Continuous CSS animations (auroras, marquee) pause while out of view (`.is-idle`).
- Animate only `transform` and `opacity`.

## SEO and metadata

- Keep the descriptive title, meta description, viewport, theme-color, Open Graph title and description, and the SVG favicon.
- Add `canonical` and `og:image` only once the owner confirms the final public URL. An `og:image` must be an absolute URL.

## Test matrix (Antigravity browser agent)

Serve the folder over HTTP (`python -m http.server 8000`). Do not test from `file://`, because browsers block web fonts there. Test as a project subpath, for example by serving the parent folder and opening `/kushagra-kartikey-portfolio-3d/`.

At **320, 375, 390, 768, 1024, 1280 and 1440px** check:

1. `document.documentElement.scrollWidth === clientWidth` (no horizontal scroll).
2. No clipped or overlapping text, and no stuck hidden reveals after scrolling the whole page.
   - The hero windows never cover the globe caption.
   - The footer name holds one line.
3. No console errors and no failed requests.
4. The globe, roadmap and yard stages have the class `is-ready`, and every label stays inside its frame.
5. All six logo images load and sit inside their tiles; no figure breaks across lines.

Interaction checks:

6. Every nav link (eight, including Industries) and both hero CTAs land with the section's first block just below the sticky bar. That block is the heading, the marquee in Skills, or the panel in Contact. Jump instantly when testing; the final position matches a smooth scroll's.
7. The mobile menu opens, closes on Escape, closes on select and closes on an outside click.
8. Keyboard Tab order runs skip link → wordmark → nav, with focus always visible.
9. The resume download saves `Kushagra_Kartikey_Resume.pdf`.
10. All project images load.
11. Reduced motion (the gentle mode):
    - nothing travels or turns: every reveal, tile, split heading and hero letter keeps `transform: none`;
    - the gallery is off (a list);
    - everything is visible after scrolling;
    - every scene is still, in its final state (no continuous render loop);
    - the roadmap and yard still turn when dragged, then ease back and stop;
    - the Animations switch turns full motion on (the globe turns), is remembered after a reload, and turns it off again;
    - with no saved choice the motion prompt shows, and "Turn on animations" starts full motion and dismisses it. A device without the request never sees the prompt.
12. With motion on:
    - Every revealed element settles at `transform: none`; every staggered tile ends visible; every counter ends on its exact value.
    - A `[data-lean]` tile leans toward the mouse and clears its transform when the mouse leaves.
    - The globe and roadmap turn when dragged.
    - The projects gallery pins under the header and slides with the scroll; midway the counter reads 3 / 5; focusing a link in the last card centres that card; the "Procurement" step centres the fourth card and carries `aria-current="step"`.
    - A whole card fits the pinned view at 1280×657, 1366×657, 1440×789 and 1536×730 (the gallery stays on there).
    - The page holds 5 value-chain stages, 16 sector chips, 16 industries in 4 groups, and 3 results plus the "Modelled on synthetic data" line on every project.
    - A showcase frame leans at most 6° toward a mouse, spins at most 42° when dragged, and springs back after release.
    - At the end of Skills (wide screens), the yard has stacked all 8 containers and all 8 tool chips are marked; above Skills, none are.
    - At the end of Experience, the spine is full and all 4 roles are marked as reached.
13. Without WebGL, and without JavaScript, all three 3D areas collapse and their captions remain as text.

Testing notes:
- **Reduce motion on the test machine.** If the operating system has Reduce motion switched on, browsers serve the still version, and the full animation goes untested.
  - Test full motion with Chrome's `--force-prefers-no-reduced-motion` flag.
  - Test reduced motion by emulating `prefers-reduced-motion: reduce`.
- **SwiftShader notices.** Headless Chrome with SwiftShader logs "GPU stall due to ReadPixels" notices from its software compositor. The approved pre-3D site logs the same, so these are environmental and are not site console errors.
- **Screenshots of WebGL.** In headless browsers, full-page screenshots of WebGL canvases are unreliable. Stitch viewport-sized captures instead, and compare canvases with viewport-clip captures.
- **Proving a drag.** Test drags under reduced motion, where the scenes are still, so a changed canvas can only come from the drag.
- **Comparing canvases.** Compositing can shift a few pixels by a level or two without anything moving, so "still" allows a largest change of 2 out of 255.
- **Real GPU versus screenshots.** Headless Chrome on a real GPU can capture WebGL canvases blank. To prove a scene draws there, read the canvas's own pixels (create contexts with `preserveDrawingBuffer`) rather than trusting a screenshot.
- **Software rendering is slow.** Under SwiftShader, smooth scrolls can stall for over a second and frames can back up. Set up scroll positions instantly, and wait for a quiet second before judging that render loops stopped.
- **Unbreakable text in grids.** A grid track holding unbreakable text, such as a showcase address bar, must be `minmax(0, 1fr)`. A bare `1fr` grows to the text's width and scrolls the page sideways on phones.

Static checks:

- HTML validates. `npx html-validate index.html` must show 0 errors.
- No root-relative paths (`href="/` or `src="/`).
- Every `#anchor` has a matching `id`.
- Every local file referenced exists.
- `grep -ri "lovable\|made with\|lorem\|placeholder\|TODO"` finds nothing outside `assets/vendor`.
- `grep -i "cgpa\|lucknow university\|university of lucknow\|physical education\|syed modi\|gbsn fellowship"` finds nothing in `index.html`.
- Text stays minimal. Visible words measured:
  - 1,029 after round 3 (down from 1,828);
  - 1,143 after round 4, which added the Industries section (122 words) the owner asked for;
  - 1,423 after round 5, which added each project's problem and results, the value chain and sixteen sectors, also at the owner's request.

External links: open each one once. Some sites block automated checks, such as LinkedIn and wa.me. List those as "not verified" rather than passing them.
