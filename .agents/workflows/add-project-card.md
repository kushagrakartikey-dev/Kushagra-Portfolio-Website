---
description: Add the fifth project card (Inventory Optimization & Replenishment Engine) with a real dashboard screenshot, matching the existing four cards.
---

# /add-project-card

> **Status (October 2026): done.**
> - The Inventory Optimization & Replenishment Engine card is live, directly after the S&OP card.
> - Its screenshot is at `assets/images/project-inventory-640.webp` and `-1200.webp`.
> - The odd-count CSS from step 4 is in place.
>
> Keep this workflow as the template for any future card: replace the facts in step 1 and the image names, and re-check the odd/even layout in step 4.

Goal: add a card for `https://github.com/kushagrakartikey-dev/inventory-optimization-engine` to the Projects section, consistent with the four existing cards. Follow `.agents/rules/` throughout. Do **not** add `nutricircle-sop-intelligence`.

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

## 3. Add the card

1. In `index.html`, copy the S&OP card's `<li class="project reveal" data-tilt>` block.
2. Insert the copy directly **after** the S&OP card. The planning-to-inventory order reads logically.
3. Update the copy's metric, title, problem, description and tags. Keep `<p class="visually-hidden">Built with</p>` before the tags list.
4. Update both links, including the visually hidden suffix "for Inventory Optimization & Replenishment Engine (opens in a new tab)".
5. Point `src`/`srcset` at the new images. Keep `width="1200" height="750" loading="lazy" decoding="async"`.
6. Write alt text such as "Inventory Optimization & Replenishment Engine dashboard showing inventory KPIs and charts". Describe what the screenshot actually shows.
7. Change the Projects intro from "Four end-to-end analytics builds" to "Five end-to-end analytics builds".

## 4. Handle the odd card count

Five cards in a 2-column grid leave the last one alone. Add this to `styles.css` (section 10, Projects) so the last card spans the full width, with its image beside the text on desktop:

```css
@media (min-width: 900px) {
  .projects > .project:last-child:nth-child(odd) {
    grid-column: 1 / -1;
    flex-direction: row;
  }
  .projects > .project:last-child:nth-child(odd) .project__media {
    flex: 0 0 55%;
    aspect-ratio: auto;
    border-bottom: 0;
    border-right: 1px solid var(--line-light);
  }
}
```

Below 900px the grid is already one column, so no change is needed there.

## 5. Verify (rule 03)

Re-run the full test matrix at all seven widths. In particular, check:

- the new image loads;
- the wide last card has no overflow at 1024 and 1280;
- both new links open the right pages;
- the tilt still works on mouse hover.

Then report what you checked and what you could not check.
