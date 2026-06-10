# v9 a11y / Structured Data QA

Date: 2026-06-11 JST

## Build

- `npx next build`: passed
- Generated pages: 481

## Structured Data

- Guide pages: 10
- Guide `Article`: 10 / 10
- Guide `FAQPage`: 10 / 10
- Guide `BreadcrumbList`: 10 / 10
- Top page `FAQPage`: present
- Video pages: 461
- Video `VideoObject`: 461 / 461

## Accessibility Checks

- `Image` / `img` alt attributes: all present
- Decorative images keep `alt=""` where appropriate
- Unified focus ring: `2px solid var(--color-accent)` with `outline-offset: 2px`
- Reduced motion: new hover lifts, guide progress bar, FAQ chevron, and mobile snap behavior are disabled or neutralized under `prefers-reduced-motion: reduce`

## Contrast

- `--color-muted` on white: 5.83:1
- `--color-muted` on `--color-bg`: 5.48:1
- `--color-muted` on `--color-bg-soft`: 5.28:1
- Result: `.why-pain` and muted guide/supporting text meet WCAG AA for normal text on the checked light backgrounds.
