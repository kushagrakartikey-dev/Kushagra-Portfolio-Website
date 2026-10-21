# Kushagra Kartikey — Portfolio

A single-page portfolio for Kushagra Kartikey, Supply Chain & Operations Professional (Delhi, India, open to relocation).

It is plain HTML, CSS and JavaScript, in a dark theme styled like a consulting firm's site (navy with one cobalt accent, Source Serif 4 headings and figures, Source Sans 3 text), results shown as graphics (gauges, before→after bars, unit dots) rather than paragraphs, and three interactive 3D scenes built in three.js:
- a globe of where the work has run;
- a model of the coffee cooperative's capacity roadmap;
- a container yard where a gantry crane stacks one container for each tool in the Skills list.

There is no build step, no framework, no package install and no external service. Upload the files to GitHub, turn on GitHub Pages, and the site is live at a public link. Visitors see the website itself, not the repository.

## What is in the repository

```
kushagra-kartikey-portfolio-3d/
├── index.html                 Page content and structure
├── styles.css                 Design tokens, layout, components, motion
├── script.js                  Menu, scroll effects, counters, projects gallery, Animations switch, the three 3D scenes
├── README.md                  This file
└── assets/
    ├── documents/
    │   └── resume.pdf         The file behind every "Download resume" button
    ├── images/                Project dashboard screenshots (WebP, 640 and 1200 px wide)
    ├── logos/                 Official DHL, Decathlon and BWF logos (SVG), shown beside those roles
    ├── icons/
    │   └── favicon.svg        Browser tab icon
    ├── fonts/
    │   ├── source-serif-4.woff2  Source Serif 4 (headings and figures), hosted locally
    │   ├── source-sans-3.woff2   Source Sans 3 (text), hosted locally
    │   ├── OFL-SourceSerif4.txt  Source Serif 4 licence (SIL Open Font License)
    │   └── OFL-SourceSans3.txt   Source Sans 3 licence (SIL Open Font License)
    └── vendor/
        ├── three.min.js       three.js r160, hosted locally (powers the 3D scenes)
        └── three.LICENSE.txt  three.js licence (MIT)

AGENTS.md                      Project brief for AI coding agents (Google Antigravity)
.agents/                       Antigravity rules, workflows, guide and reference screenshots
```

Every path in the site is relative, so it works both at a user site root and under a project-site subpath (explained below).

## Publish on GitHub Pages

### 1. Create a repository

1. Sign in to GitHub and choose **New repository** (the **+** menu, top right).
2. Pick a name. This decides your web address:

   | Repository name | Type | Published address |
   | --- | --- | --- |
   | `kushagrakartikey-dev.github.io` | User site | `https://kushagrakartikey-dev.github.io/` |
   | anything else, e.g. `portfolio` | Project site | `https://kushagrakartikey-dev.github.io/portfolio/` |

   A user site gives the shortest address, and you can have only one. A project site lives under a subpath; you can have as many as you like. This portfolio works with either.
3. Set the repository to **Public**. GitHub Pages on free accounts needs a public repository.
4. Leave "Add a README" unticked (this project already has one), then choose **Create repository**.

### 2. Upload the files

**In the browser (simplest):**

1. On the new repository page, choose **uploading an existing file**.
2. Open the `kushagra-kartikey-portfolio-3d` folder on your computer and drag its **contents** into the page: `index.html`, `styles.css`, `script.js`, `README.md` and the whole `assets` folder.
   Drag the contents, not the outer folder. `index.html` must sit at the top level of the repository, or GitHub Pages shows a 404.
3. Choose **Commit changes**.

**With Git (command line):**

```bash
cd kushagra-kartikey-portfolio-3d
git init
git add .
git commit -m "Publish portfolio"
git branch -M main
git remote add origin https://github.com/kushagrakartikey-dev/<repository-name>.git
git push -u origin main
```

### 3. Make sure the resume and assets are included

After uploading, open the repository on GitHub and check that you can see `assets/documents/resume.pdf`, the `assets/images` folder with ten `.webp` files, `assets/logos` with three `.svg` files, `assets/fonts`, `assets/icons` and `assets/vendor`. If any are missing, upload them into the same folders. Folder and file names are case-sensitive on GitHub Pages: `Resume.pdf` and `resume.pdf` are different files.

### 4. Turn on GitHub Pages

1. In the repository, open **Settings** (top bar, gear icon).
2. In the left sidebar, under **Code and automation**, choose **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch**, choose **`main`** and the folder **`/ (root)`**.
5. Choose **Save**.

### 5. Find the published address

Wait one to two minutes, then reload the Pages settings screen. A box at the top shows **"Your site is live at …"** with a **Visit site** button. That address is the one to share. You can also follow progress in the repository's **Actions** tab, where a "pages build and deployment" run appears; a green tick means it is live.

## Update the site after publishing

Edit the files and upload them again (in the browser, open the file on GitHub, choose the pencil icon, edit, and commit; or `git add`, `git commit`, `git push`). GitHub republishes automatically within a minute or two. If you still see the old version, do a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac).

Common updates:

| To change | Edit |
| --- | --- |
| Any text, role, metric or link | `index.html` (each section starts with a comment such as `============ EXPERIENCE ============`) |
| The resume | Replace `assets/documents/resume.pdf` with a file of the same name |
| Colours, fonts, spacing | The tokens at the top of `styles.css` (section 2) |
| Places and lanes on the globe | `PLACES` and `ARCS` near the globe code in `script.js` |
| A result in Experience | Its tile in `index.html`: the figure, its `data-count-to` value, and the graphic's class (for example `gauge--95` or `bar--r30`, defined near `.gauge` and `.bar` in `styles.css`) |
| The roadmap model's figures | `ROADMAP` and the labels in `buildRoadmap` in `script.js`, and the figure caption in `index.html` (keep them identical) |
| The tools in the container yard | `YARD_TOOLS` in `script.js`, and the Tools list and the yard caption in `index.html` (keep all three in the same order) |
| A new project | Follow `.agents/workflows/add-project-card.md`: copy one `<li class="project …">` block in `index.html`, then change its colour class, category, industry, problem line, three results (from its README, under "Modelled on synthetic data"), tags, links and address bar. Add its screenshot to `assets/images/`, a step under the gallery, and the new total in the counter ("/ 5") |
| An industry | Its tile in the Industries section of `index.html` (in one of the four groups): name, icon and the evidence line (keep it true to your resume), plus its chip under "Sectors I can serve" in About |
| What I work on | The five stages in About in `index.html`: capabilities, and the result with its `data-count-to` value (each result comes from Experience) |
| A company logo | Replace the file in `assets/logos/` with the official one from the company's own website, keeping the same name |

## The 3D scenes

- **Hero globe.** Land drawn as 18,000 dots (11,000 on phones), with the places named in its caption and arcs for each lane. On arrival the dots gather into the continents while the camera eases in, the markers land and the arcs draw in. A short amber pulse then travels each lane. The globe turns slowly, leans toward the mouse pointer and recedes as you scroll away. Drag it to turn it.
- **Capacity-roadmap model** (Experience, DHL). Built only from resume figures:
  - 2,000 smallholder farms;
  - 3 washing stations in place, and the 3 more recommended;
  - the roadmap to 20 export containers (384 MT) a year;
  - the export lane to the EU market.

  Solid shapes are in place; dashed outlines are recommended or on the roadmap. The model assembles when it scrolls into view, and amber dots show the flow. Drag it to turn it; it eases back after a pause.
- **Container yard** (Skills). A gantry crane lifts eight containers off a truck and stacks them, one for each tool: SAP, WMS, Excel, Power BI, Tableau, MySQL, Python and RPA. Each container carries its tool's name. On a computer the yard stays beside the lists and your scrolling drives the crane, and each tool in the list gains an amber marker as its container lands. On a phone the crane plays once when the yard comes into view. Drag it to turn it.

Around the scenes, the page itself moves in depth:
- **Hero:**
  - one soft cobalt light drifts slowly behind the page;
  - the letters of your name stand up one by one, in a serif;
  - two of your live dashboards float behind the globe;
  - the buttons drift slightly toward the mouse.
- **Headings and About:** headings rise word by word, and the About statement lights up word by word as you read. Beside it, your work runs across the value chain (Plan, Source, Make, Deliver, Enable), each stage with one result that counts up, joined by a line that draws down; sixteen sector chips follow.
- **Experience:** a cobalt line runs down the roles as you pass them. Each role shows its company logo, and its results arrive as tiles one after another: gauges sweep to their percentage, reduction bars shrink, dots appear one by one and every figure counts up.
- **Projects:** on a computer or a landscape iPad, the section pins in place and your scrolling slides the five projects sideways like a coverflow, each turning in 3D as it reaches the centre, with a counter (1 / 5), a step for each project that jumps to it, and a progress bar. Each project leads with its industry, the business problem it answers and three results in large figures, labelled as modelled on synthetic data. Each has its own colour and sits in a browser frame showing its live address. Frames lean toward the mouse and can be spun with a drag before they spring back. On phones the projects stack.
- **Skills:** two rows of your skills and tools glide past in opposite directions above the container yard.
- **Industries:** sixteen tiles in four colour-coded groups (consumer and retail, industrial and manufacturing, trade and logistics, services and sustainability), each naming the role, project or certificate behind it.
- **Tiles everywhere** (results, strategy, industries, education, certificates) lean slightly toward the mouse in 3D, with a cobalt edge and a faint light that follows the pointer.
- **Header and floating panels:** a sparing "liquid glass" finish (translucent, blurred, with a bright rim) on the header, the strip under the projects and the motion prompt. There is no progress bar.

**Animations switch and reduced motion.** The header has an **Animations** switch:
- **On** is full motion.
- **Off** is a gentle mode. Content still fades in, figures still count and gauges still fill, but nothing travels, turns or spins.
- **Default:** if a device asks for reduced motion (on a Mac: System Settings → Accessibility → Display → Reduce motion; on an iPad: Settings → Accessibility → Motion), the site starts in the gentle mode. A small prompt at the foot of the screen then offers **Turn on animations** or **Keep calm**, and the answer is remembered on that device.
- **Choice:** any visitor can switch, and the site remembers the choice on that device. Your Mac has Reduce Motion on, so switch Animations on once to see everything there.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| 404 "There isn't a GitHub Pages site here" | Pages is not enabled, or still deploying. Repeat step 4 and wait two minutes. Check `index.html` is at the repository root, not inside a subfolder. |
| The page shows the README instead of the website | You opened the repository address (`github.com/...`). Use the Pages address (`...github.io/...`). |
| Page loads with no styling | `styles.css` is missing or renamed. Check it sits next to `index.html` with exactly that name. |
| Resume button gives a 404 | `assets/documents/resume.pdf` is missing or named differently (names are case-sensitive). |
| Images or a 3D scene missing | The `assets` folder was not uploaded in full. Re-upload it. |
| Animations look reduced on a computer or iPad | The device asks for reduced motion, so the site starts gentle. Switch **Animations** on in the header (or in the Menu on smaller screens). |
| Old version still showing | Hard refresh, or wait for the Actions run to finish. |
| Plain font when opening `index.html` by double-clicking | Browsers block web fonts on `file://` pages. The site is fine on GitHub Pages. To preview locally with the real font, run `python -m http.server` in the folder and open `http://localhost:8000`. |

## Working on the site in Google Antigravity

`AGENTS.md` and the `.agents/` folder let Google Antigravity's agent continue or rebuild this site with your decisions built in. Open this folder in Antigravity (**File → Open Folder**), then follow `.agents/ANTIGRAVITY_GUIDE.md`. GitHub Pages does not publish dot-folders, so `.agents/` stays out of the public site.

## Technical notes

- **Accessibility:**
  - semantic landmarks, one `h1`, a heading on every section, and a skip link;
  - visible focus outlines and a keyboard-operable menu (`aria-expanded`, `aria-controls`, Escape to close);
  - text alternatives for images and WCAG AA colour contrast throughout.

  The 3D canvases, icons, metric graphics and logo tiles are decorative: each sits beside text that carries the same information. Headings split into words or letters for animation keep a single readable copy for screen readers.
- **Motion:**
  - Motion has two modes: full, and a gentle mode that keeps fades, counts and fills but drops travel, turns, spin and parallax. A system request for reduced motion starts the gentle mode, and the Animations switch lets any visitor choose (WCAG 2.2.2: continuous movement can be stopped).
  - Content is never hidden if JavaScript fails. Reveal styles apply only after the script has started, and a failsafe shows anything already scrolled past.
  - Without WebGL or JavaScript, the 3D areas collapse and their captions remain as text.
- **Performance:**
  - No external requests. Images are WebP with fixed dimensions; the project screenshots use `srcset` and lazy loading.
  - three.js loads only after the page has finished loading, once for all three scenes. The roadmap and the yard are built only as they approach the screen.
  - Each scene's render loop stops when it is off screen or the tab is hidden, and the pixel ratio is capped at 2.
  - Every scroll-linked effect runs in one shared animation-frame loop, and continuous CSS animations pause while out of view.
- **three.js:** the vendored `three.min.js` is the unmodified r160 build except for one line: its built-in "this build is deprecated" console notice is replaced with `void 0`, so visitors' consoles stay clean. The licence header is intact.
- **Globe data:** land outlines come from a 1.5° land mask derived from the NOAA GLOBE dataset (via the `global-land-mask` package), embedded in `script.js`.
- **Project screenshots** are captures of the published dashboards in each project repository. Those projects use synthetic data, as their own READMEs state, and the site says so.

## Credits

- Typefaces: Source Serif 4 and Source Sans 3, SIL Open Font License (`assets/fonts/OFL-SourceSerif4.txt`, `assets/fonts/OFL-SourceSans3.txt`), subset from the Google Fonts releases.
- 3D library: three.js, MIT License (`assets/vendor/three.LICENSE.txt`).
- Land outline data: NOAA GLOBE dataset.
- Company logos: DHL (Deutsche Post AG), Decathlon (Decathlon SE) and BWF (Badminton World Federation) are trademarks of their owners. Each file is the official logo as served on that organisation's own website, used unaltered to identify a past role.
