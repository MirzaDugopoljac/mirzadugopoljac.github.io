# Mirza Dugopoljac — Landscape Architecture Portfolio

Bilingual EN/TR, responsive, GitHub Pages-ready portfolio built from the supplied PDF.

## Included
- Full-screen editorial homepage
- 7 separate case-study pages
- EN/TR switch with saved preference
- Project filters
- Responsive CSS Grid
- Scroll reveal + reduced-motion support
- Full-screen keyboard image viewer
- Tabbed urban-planning board viewer
- SEO / Open Graph metadata
- Original portfolio PDF
- Contact section with only GitHub, LinkedIn and email
- Plain HTML/CSS/JS: no build step

## Preview locally
```bash
python -m http.server 8000
```
Open `http://localhost:8000`.

## Connect it to your GitHub repository
Clone your repository and copy the **contents** of this folder into the repository root:

```bash
git clone https://github.com/MirzaDugopoljac/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
git add .
git commit -m "Build landscape architecture portfolio"
git push origin main
```

GitHub Pages uses the root `index.html`. If your existing repository already has one and you want a backup, rename it to `index-old.html` before copying this version.

## Deploy on GitHub Pages
1. Repository → **Settings**
2. **Pages**
3. **Build and deployment** → **Deploy from a branch**
4. Branch: **main**
5. Folder: **/(root)**
6. **Save**

The site uses relative URLs, so it works under a project URL like:
`https://mirzadugopoljac.github.io/repository-name/`

## Contact links
- GitHub: https://github.com/MirzaDugopoljac
- LinkedIn: https://www.linkedin.com/in/mirzadugopoljac/
- Email: mirzaadc@gmail.com

## Main files
- `index.html` — homepage
- `styles.css` — all styling/responsive layout
- `script.js` — language toggle, filters, animation, tabs, lightbox
- `projects/` — case-study pages
- `assets/img/` — optimized WebP images extracted from the portfolio
- `assets/Mirza-Dugopoljac-Portfolio.pdf` — original PDF
