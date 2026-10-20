# Using this project in Google Antigravity

This folder already contains everything Antigravity's agent needs to understand, continue or fully rebuild your portfolio:

| File | What Antigravity does with it |
| --- | --- |
| `AGENTS.md` | Read automatically when you open the folder: the project brief and status |
| `.agents/rules/01-content-accuracy.md` | Always-on rule: your decisions (no CGPA, no Lucknow University, no badminton or competitions, no headshot, no NutriCircle) and every verified fact, metric and link |
| `.agents/rules/02-design-system.md` | Always-on rule: colours, type, layout, motion and the two three.js scenes (globe, roadmap model) |
| `.agents/rules/03-quality-gates.md` | Always-on rule: accessibility, performance and the test checklist |
| `.agents/workflows/add-project-card.md` | Run with `/add-project-card` |
| `.agents/workflows/qa-and-publish.md` | Run with `/qa-and-publish` |
| `.agents/workflows/rebuild-portfolio.md` | Run with `/rebuild-portfolio` |
| `.agents/reference/*.jpg` | Screenshots of the approved design for the agent to match |

## One-time setup

1. Download and install Antigravity from https://antigravity.google and sign in with your Google account.
2. Install Python 3 (needed for the local preview server and image steps). Node.js is optional; it is only used for HTML validation.
3. Have the `kushagra-kartikey-portfolio-3d` folder on your computer (unzip it first if you received it as a zip).
4. In Antigravity, choose **File → Open Folder** and select the `kushagra-kartikey-portfolio-3d` folder itself, not the folder above it. The rules only load from the folder you open.
5. Open the agent panel. In the **"…" → Customizations** panel, check that the three rules appear under **Rules** (Workspace) and the three workflows appear under **Workflows**. If the panel shows nothing, the files still apply: reopen the folder, or mention a rule directly with `@01-content-accuracy.md`.
6. Choose **Agent-assisted** mode with review before terminal commands. You approve every command and every push to GitHub.
7. When the agent first uses the browser, Antigravity may ask you to install its Chrome browser extension. Allow it, because the visual testing depends on it.

## Path A: continue the finished site (recommended)

The 3D site is already built and tested, and the fifth project card is done. Paste these prompts into the agent panel one at a time and review each result before moving on.

**Prompt 1: orientation**

```
Read AGENTS.md, every file in .agents/rules/, and look at the screenshots in .agents/reference/. Then serve the site locally (python -m http.server from the parent folder) and open /kushagra-kartikey-portfolio-3d/ in the browser at 1440 and 390 wide. Confirm it matches the reference screenshots and summarise anything that differs. Do not edit any files yet.
```

**Prompt 2: test and publish**

```
/qa-and-publish
```

The agent will stop and ask before it creates the GitHub repository or pushes. Tell it the repository name you want. `kushagrakartikey-dev.github.io` gives the shortest address.

## Path B: rebuild everything from scratch

Use this path if you want Antigravity to write the whole site itself.

1. Make a new empty folder.
2. Copy into it `AGENTS.md`, the whole `.agents` folder, and your resume as `assets/documents/resume.pdf`.
3. Open that folder in Antigravity.
4. Paste this prompt:

```
/rebuild-portfolio

Build the complete Kushagra Kartikey portfolio website following AGENTS.md and every rule in .agents/rules/ exactly. Match the approved design in .agents/reference/. Start with an Implementation Plan for me to review, then work phase by phase. Test every phase in the browser at 320, 390, 768, 1024 and 1440 wide. Use only facts from rule 01 and my resume. Ask me before guessing anything, and never invent links, metrics or titles. Finish with the deployment README and an honest QA report.
```

## Useful follow-up prompts

- **Change text:** `In the About section, change "<old sentence>" to "<new sentence>". Keep the layout, then show me the section at 1440 and 390.`
- **Replace the resume:** `I have replaced assets/documents/resume.pdf. Check that every Download resume button still works.`
- **Add canonical and preview tags once the site is live:** `The site is live at <URL>. Add the canonical and og:image tags as described in /qa-and-publish step 5.`
- **Design check:** `Compare the live site with .agents/reference/ at 1440 and 390 and list any visual differences, worst first. Do not change anything until I approve.`

## Things to know

- Antigravity reads rules from `.agents/rules/` (older versions used `.agent/rules/`, which also still works). Each rule or workflow file may hold up to 12,000 characters, and all of these are well under that.
- GitHub Pages does not publish dot-folders, so `.agents/` (rules and screenshots) stays out of the public site.
- Double-clicking `index.html` shows a fallback font, because browsers block web fonts on `file://`. Always preview through the local server or the live site.
