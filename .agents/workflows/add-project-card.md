---
description: Add the fifth project (Inventory Optimization & Replenishment Engine) with a real dashboard screenshot, matching the existing four.
---

# /add-project-card

> **Status (October 2026): done.**
> - The Inventory Optimization & Replenishment Engine card is live, directly after the S&OP card.
> - Its screenshot is at `assets/images/project-inventory-640.webp` and `-1200.webp`.
> - Since the second design round, projects are full-width showcase rows that alternate sides, so any number of projects lays out correctly. The odd-count CSS this workflow once added has been removed.
>
> Keep this workflow as the template for any future project: replace the facts in step 1 and the image names.

Goal: add a project for `https://github.com/kushagrakartikey-dev/inventory-optimization-engine` to the Projects section, consistent with the four existing projects. Follow `.agents/rules/` throughout. Do **not** add `nutricircle-sop-intelligence`.

## 1. Confirm the facts

Open the repository README in the browser and confirm the details below before writing anything. All of them come from that README.

- **Title:** Inventory Optimization & Replenishment Engine
- **Metric pill:** 500 SKUs, 2 DCs, 4 warehouses, 12 stores
- **Problem:** spreadsheet rules (two weeks of safety cover on everything, buying about a quarter at a time) over-protect stable items, under-protect volatile ones and tie up cash.
- **Description:** ABC-XYZ segmentation, safety stock sized from forecast error, EOQ under MOQ and case-pack limits, multi-echelon buffer placement (MILP), 1,000 Monte Carlo simulation runs, a SimPy replenishment engine and a working-capital business case.
- **Stack tags:** Python, PuLP, SimPy, scikit-learn, Plotly Dash, Excel, Power BI, Tableau.
- **Repository link:** `https://github.com/kushagrakartikey-dev/inventory-optimization-engine`
- **Live dashboard link:** `https://kushagrakartikey-dev.github.io/inventory-optimization-engine/`

Use only the figures above for the card. The README also has modelled results (for example "-28.5% safety stock"). Do not put those on the card unless you label them "modelled, synthetic data".

## 2. Capture the screenshot

1. Open the live dashboard URL in the browser agent at a 1440×900 viewport. Wait about 6 seconds for the charts to render.
2. Capture the first screen. The other four cards use the dashboard's overview tab, cropped from the top.
3. If the live page does not load, run it locally instead:

   ```
   git clone https://github.com/kushagrakartikey-dev/inventory-optimization-engine
   cd inventory-optimization-engine
   pip install -r requirements.txt
   python dashboard/app.py
   ```

   Then open http://127.0.0.1:8050.
4. Crop the capture to 16:10 from the top-left corner. Save it as WebP (quality 80) at two sizes:
   - `assets/images/project-inventory-1200.webp` (1200×750)
   - `assets/images/project-inventory-640.webp` (640×400)

   With Python and Pillow you can resize, then save with `save(path, 'WEBP', quality=80, method=6)`.

## 3. Add the project

1. In `index.html`, copy the S&OP project's `<li class="project reveal">` block, from its `<!-- 1. S&OP -->` comment down to its closing `</li>`.
2. Insert the copy directly **after** the S&OP project, and renumber the comments. The planning-to-inventory order reads logically.
3. In the browser frame (`.project__window`), set the address bar `.project__url` to the live dashboard's address without `https://` or the closing slash: `kushagrakartikey-dev.github.io/inventory-optimization-engine`. Keep `data-spin data-ui` on the frame and `aria-hidden="true"` on `.project__chrome`.
4. Update the copy's metric chip, title, one-line description and tags. The description is one sentence of about 20 words that names what the build does (the problem stays in the README, not on the card). Keep `<p class="visually-hidden">Built with</p>` before the tags list.
5. Update both buttons: **Live dashboard** (`btn btn--accent btn--small`, arrow icon after the text) and **Repository** (`btn btn--ghost btn--small`, GitHub icon before the text). Update each one's visually hidden suffix, "for Inventory Optimization & Replenishment Engine (opens in a new tab)".
6. Point `src`/`srcset` at the new images. Keep `sizes="(min-width: 900px) 56vw, 92vw" width="1200" height="750" loading="lazy" decoding="async"`.
7. Write alt text such as "Inventory Optimization & Replenishment Engine dashboard showing inventory KPIs and charts". Describe what the screenshot actually shows.
8. Change the Projects intro from "Four end-to-end analytics builds" to "Five end-to-end analytics builds".

## 4. Check the layout

No CSS is needed. Rows alternate sides on their own: odd rows put the frame on the left and even rows on the right, and every row stacks below 900px. The address bar truncates with an ellipsis, so a long address cannot widen the page.

## 5. Verify (rule 03)

Re-run the full test matrix at all seven widths. In particular, check:

- the new image loads;
- the rows still alternate, with no horizontal scroll at 320, 1024 and 1280;
- the address bar shows the right address;
- both new links open the right pages;
- the frame leans toward the mouse, spins when dragged and springs back.

Then report what you checked and what you could not check.
