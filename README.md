# Charlie Telecom

Landing page for Charlie Telecom, an electronic security and telecom installer based in Bauru, SP, serving a radius of about 200km. The site covers CFTV/IP cameras, alarm systems, gate automation, and network infrastructure, with WhatsApp as the main conversion channel.

Live focus: fast, mobile-first, and built to convert a visitor into a quote request.

## Stack

- Static HTML, no framework or server runtime
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config, no `tailwind.config.js`)
- Vanilla JavaScript for scroll reveals, the auto-rotating product photo cards, and the mobile menu
- Google Fonts: [Sora](https://fonts.google.com/specimen/Sora) for headings, [Manrope](https://fonts.google.com/specimen/Manrope) for body text

No build step is required to view the page, only to regenerate the compiled CSS after editing `src/input.css` or changing Tailwind classes in `index.html`.

## Getting started

```bash
npm install
npm run build:css
```

Then serve the project root with any static file server (the page uses root-relative paths like `/assets/css/styles.css`, so it needs to be served from the project root rather than opened directly as a `file://` URL):

```bash
python -m http.server 5500
```

Open `http://localhost:5500`.

While editing styles, run the watcher instead of rebuilding manually:

```bash
npm run watch:css
```

## Project structure

```
index.html              Single-page site, all sections
src/input.css            Tailwind source (theme tokens, custom components)
assets/css/styles.css    Compiled CSS (generated, do not edit by hand)
assets/js/main.js        Scroll reveals, photo rotators, nav behavior
assents/                 Images and logos used on the page
scripts/                 One-off Node scripts used to prep images (background
                          removal, cropping) during development
PRODUCT.md                Internal product/context notes for this project
PLANO-PROJETO.md          Original project brief
```

## Sections

Header, hero, brand bar, services, why-us, founder bio and career timeline, certifications, and more to come (how-it-works, FAQ, final CTA, footer).

## Image handling

Several source images (logos, diplomas) come from real files with backgrounds or formatting that needed cleanup before they could go on a dark, mobile-first layout. The scripts in `scripts/` handle that with plain Node (`jpeg-js` and `pngjs`, no native image binaries) so they run anywhere without extra system dependencies:

- `white-to-transparent.mjs` / `logo-to-transparent.mjs`: key out a white background and crop tight to content
- `trim-dark-bg.mjs`: crop a dark-background logo tight to its content
- `floodfill-transparent.mjs`: remove a background by flood-filling from the image edges, which works even when the background and part of the artwork share a similar dark color
- `crop-png.mjs` / `crop-and-trim-dark.mjs`: manual region crops with auto-trim

Diploma and ID scans that expose personal data (CPF, RG, birthdate) are intentionally kept out of this repository and never used as images on the site. Where that information matters, it's presented as plain text credential cards instead.

## License

MIT, see [LICENSE](LICENSE).
