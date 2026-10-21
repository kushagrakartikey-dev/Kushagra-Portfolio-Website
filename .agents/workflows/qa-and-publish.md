---
description: Run the full quality gate on the portfolio, fix what fails, then publish to GitHub Pages and verify the live URL.
---

# /qa-and-publish

## 1. Serve locally

Serve from the **parent** folder, so the site runs under a subpath the way a GitHub Pages project site does:

```
cd ..
python -m http.server 8000
```

Then open http://localhost:8000/kushagra-kartikey-portfolio-3d/ in the browser agent.

## 2. Run the gate

Run every check in `.agents/rules/03-quality-gates.md`: the seven widths, the interaction checks, and the static checks. Run the visual and interaction checks twice: once with full motion, once with reduced motion (see the testing notes in rule 03). For HTML validation, run `npx --yes html-validate index.html` (requires Node). Fix each failure with the smallest change, then run that check again.

Some CSS validators flag `clamp()` and `min()` as invalid. These are standard CSS and work in every current browser, so they are not errors. Do not remove them.

## 3. Publish

Ask the owner before pushing; this action is theirs to approve.

- **Commit authorship.** Every commit is authored and committed by the owner alone, Kushagra Kartikey: no `Co-Authored-By` lines and no tool or agent attributions, in commits or files.
- **Updating the live site.** The site is already published from `kushagrakartikey-dev/portfolio` (GitHub Pages, `main`, `/ (root)`) at `https://kushagrakartikey-dev.github.io/portfolio/`. That is the owner's resume link: keep the repository name, and keep Pages on, because "Unpublish site" or a source of None takes the link down. Commit and push to `main`, wait for the "pages build and deployment" run to finish green, then continue at section 4, "Verify live".

For a first publish, once the owner agrees:

1. Create a public GitHub repository under `kushagrakartikey-dev`, or use one the owner names.
2. Push the folder **contents** so that `index.html` sits at the repository root:

   ```
   git init
   git add .
   git commit -m "Publish portfolio"
   git branch -M main
   git remote add origin https://github.com/kushagrakartikey-dev/<repo>.git
   git push -u origin main
   ```

3. In the repository, go to Settings → Pages. Set Source to "Deploy from a branch", choose `main` and `/ (root)`, then Save.
4. Wait for the "pages build and deployment" run in the Actions tab to finish green.
5. Open the published URL:
   - `https://kushagrakartikey-dev.github.io/` if the repository is named `kushagrakartikey-dev.github.io`;
   - `https://kushagrakartikey-dev.github.io/<repo>/` for any other name.

Dot-folders such as `.agents/` are not served by GitHub Pages, because its default Jekyll build skips them. The reference screenshots and rules therefore stay private to the repository.

## 4. Verify live

On the published URL:

1. Repeat the desktop (1440) and mobile (390) checks.
2. Click every external link once.
3. Download the resume.
4. Confirm the globe, the roadmap model and the container yard load, and that the three company logos show inside their tiles.
5. On a device that asks for reduced motion, confirm the page starts gentle and the Animations switch turns full motion on.

## 5. Optional, after the URL is final

Ask the owner before adding these. In `<head>`, add:

- `<link rel="canonical" href="<final URL>">`
- an `og:image` pointing to an absolute URL of a 1200×630 preview image saved in `assets/images/`.

## 6. Report

Give the owner three lists:
- the checks that passed;
- the checks that failed and how each was fixed;
- the links or checks that could not be verified.

Never report a check you did not run.
