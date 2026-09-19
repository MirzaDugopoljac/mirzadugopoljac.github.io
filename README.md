# Mirza OS — landscape architecture portfolio

A desktop-inspired portfolio with eight working apps: Projects, Maps, Gallery, Drawings, About, CV, Contact and Studio. English, Turkish and Bosnian; light/dark themes; reduced-motion support; responsive mobile app views.

## Development

Run `node scripts/preview.cjs` and open http://127.0.0.1:8000.
Run `node scripts/build.cjs` after template changes, then `node scripts/check.cjs`.

## Architecture

- `assets/os/desktop.js`: desktop, dock, command search, preferences and image preview.
- `assets/os/window-manager.js`: focus, stacking, dragging, resizing and browser history.
- `assets/os/apps.js`: the eight portfolio apps and project detail views.
- `assets/os/data.js`, `icons.js`, `os.css`: translations, routes, SVG icons and styles.
- `assets/js/projects.js`: the six real projects and translated project content.
- `scripts/os-build.cjs`: adds the desktop interface to generated pages while preserving readable static HTML for JavaScript-disabled visitors.
- `assets/vendor/gsap/`: GSAP 3.15.0 and Flip, installed from the supplied local GSAP distribution. Original license headers remain intact.
- `files/`: CV, portfolio and Gemlik jury PDFs.

Gemlik contains all 13 supplied renders and six drawing boards. Proje 1 (School Canteen) and Cat House are removed from the current listing; legacy project URLs redirect to the portfolio index. Original source files remain preserved.

Keyboard: Ctrl+K opens search, Escape closes overlays, arrow keys navigate image previews, Space previews a focused project card. Window titlebars support Alt+arrow movement and Alt+Shift+arrow resizing.

`scripts/verify-os.cjs` exercises core interactions using Playwright and installed Edge. Set PLAYWRIGHT_MODULE to your Playwright module path if it is not installed in the standard Node resolution path. The local Codex runtime is supported as a fallback.

## Design and publishing

`design/README.md` records the design comparison and intentional adaptations. The prior editorial templates provide the static fallback. The iTech and ceramics showcases retain their independent designs.

Ready for the repository's GitHub Pages workflow. Local build and preview commands do not publish the site.
