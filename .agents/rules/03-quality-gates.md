# Rule 03 — Quality gates (always on)

No change is finished until these pass. Report results honestly: say what you ran, what passed, and what you could not verify.

## Accessibility (WCAG 2.2 AA)

- Landmarks: `header`, `nav`, `main`, `footer`; one `h1`; every section has an `h2`; skip link to `#main`.
- Visible focus: 3px outline, navy on light fields, amber on dark fields.
- Mobile menu: a `<button>` with `aria-expanded` and `aria-controls="site-menu"`. Escape closes it and returns focus to the button. It also closes after a link is chosen and on an outside click. When closed, its links are not focusable (`visibility: hidden`).
- Every image has real alt text. Decorative SVG icons use `aria-hidden="true"`. The globe canvas is `aria-hidden`; its figcaption carries the information.
- Contrast is at least 4.5:1 for text and 3:1 for focus rings. The current palette measures 5.0:1 at its lowest.
- Touch targets are at least 44px. Never disable zoom.
- Without JavaScript, all content is visible and the menu shows as a plain list.

## Performance

- No external requests at all: fonts, three.js and images are local.
- Images are WebP with `srcset` (640/1200), `width`/`height`, `loading="lazy"` and `decoding="async"`.
- three.js loads after page load, once for both scenes; the roadmap model builds only as it approaches the screen. Both render loops stop off screen and in hidden tabs.
- Animate only `transform` and `opacity`.

## SEO and metadata

- Keep the descriptive title, meta description, viewport, theme-color, Open Graph title and description, and the SVG favicon.
- Add `canonical` and `og:image` only once the owner confirms the final public URL. An `og:image` must be an absolute URL.

## Test matrix (Antigravity browser agent)

Serve the folder over HTTP (`python -m http.server 8000`). Do not test from `file://`, because browsers block web fonts there. Test as a project subpath, for example by serving the parent folder and opening `/kushagra-kartikey-portfolio/`.

At **320, 375, 390, 768, 1024, 1280 and 1440px** check:

1. `document.documentElement.scrollWidth === clientWidth` (no horizontal scroll).
2. No clipped or overlapping text, and no stuck hidden reveals after scrolling the whole page.
3. No console errors and no failed requests.
4. The globe and the roadmap stage have the class `is-ready`, and their labels stay inside their frames.

Interaction checks:

5. Every nav link and both hero CTAs land with the section heading just below the sticky bar.
6. The mobile menu opens, closes on Escape, closes on select and closes on an outside click.
7. Keyboard Tab order runs skip link → wordmark → nav, with focus always visible.
8. The resume download saves `Kushagra_Kartikey_Resume.pdf`.
9. All project images load.
10. Reduced motion leaves every element at opacity 1, and both 3D scenes still (no continuous render loop).
11. With motion on, every revealed element settles at `transform: none`. Both scenes can be dragged, and project cards tilt at most 4° on mouse hover.
12. Without WebGL, and without JavaScript, the 3D areas collapse and their captions remain as text.

Testing notes:
- **Reduce motion on the test machine.** If the operating system has Reduce motion switched on, browsers serve the still version, and the full animation goes untested.
  - Test full motion with Chrome's `--force-prefers-no-reduced-motion` flag.
  - Test reduced motion by emulating `prefers-reduced-motion: reduce`.
- **SwiftShader notices.** Headless Chrome with SwiftShader logs "GPU stall due to ReadPixels" notices from its software compositor. The approved pre-3D site logs the same, so these are environmental and are not site console errors.
- **Screenshots of WebGL.** In headless browsers, full-page screenshots of WebGL canvases are unreliable. Stitch viewport-sized captures instead, and compare canvases with viewport-clip captures.

Static checks:

- HTML validates. `npx html-validate index.html` must show 0 errors.
- No root-relative paths (`href="/` or `src="/`).
- Every `#anchor` has a matching `id`.
- Every local file referenced exists.
- `grep -ri "lovable\|made with\|lorem\|placeholder\|TODO"` finds nothing outside `assets/vendor`.
- `grep -i "cgpa\|lucknow university\|university of lucknow\|physical education"` finds nothing in `index.html`.

External links: open each one once. Some sites block automated checks, such as LinkedIn and wa.me. List those as "not verified" rather than passing them.
