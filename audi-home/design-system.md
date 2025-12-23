## Observed Design System Signals (from landing page rendering)

**Note:** These are *observed* values taken directly from CSS in the landing page HTML (no inference).

### Colors
- Body background: `rgb(16, 19, 25)`
- Header colors (observed CSS vars):
  - `--one-header-color-white: hsla(216,33%,99%,1)`
  - `--one-header-color-black: hsla(216,26%,1%,1)`
  - `--one-header-color-link: hsla(216,33%,99%,0.7)`
  - `--one-header-color-hover: hsla(216,33%,99%,1)`
- Footer colors (CSS vars):
  - `--one-footer-color-black: hsla(216,26%,1%,1)`
  - `--one-footer-color-white: hsla(216,33%,99%,1)`

### Typography
- Observed font families (from @font-face):
  - `AudiType` (variable format): `https://assets.one.audi/assets/fonts/AudiTypeVF.woff2` (font-face declared)
  - `AudiType-Normal`: multiple sources, e.g. `https://assets.audi.com/audi-fonts/1/AudiTypeVF.woff2` and `https://assets.audi.com/audi-fonts/1/AudiType-Normal.woff2`
- Observed weights: 400 (normal), 500 (medium) seen in rules for titles and nav
- Observed sizes (examples):
  - body / nav text ~ `14px` (line-height 20px in header)
  - prominent headings show responsive increases (e.g. 28px → 36px → 40px → 44px across breakpoints) as observed in heading rules

### Spacing (CSS variables)
- `--page-margin` responsive (16px → 28px → 40px → 60px → 96px)
- Spacing tokens (relative):
  - `--spacing-relative-2xs: 4px`
  - `--spacing-relative-xs: 8px`
  - `--spacing-relative-sm: 12px`
  - `--spacing-relative-md: 16px`
  - `--spacing-relative-lg: 24px`
  - `--spacing-relative-xl: 28px` (and larger tokens up to `--spacing-relative-8xl` used for large sections)

### Buttons & Controls
- Pill buttons with large radius: often `border-radius: 999px` (observed on cookie modal buttons and pill controls)
- Raised/solid buttons: background colors observed: `rgb(0, 0, 0)` and `rgb(101, 112, 130)` in modal; text color `rgb(252, 252, 253)` used for high-contrast buttons
- Focus outlines: `outline` rules present (e.g., `outline: rgb(9, 137, 255) solid 4px` on focus-visible in modals)

### Cards & Surfaces
- Card borders: thin `1px` separators (`border-top: 1px solid rgb(221, 221, 221)` or neutral tokens)
- Footer sections use `padding` tokens and neutral background `var(--one-footer-color-black)`
- Card radius values: small corner rounding used in modals (4px) and large pill radii for interactive toggle controls

### Motion & Animation (observed)
- Keyframe names observed in page CSS: `kxLTmt` (rotation), `kteWYl` (stroke-dash animations)
- Durations: `1.5s` (repeating animations), `420ms` (transitions), `250ms` (micro transitions)

### Fonts, Assets & Delivery
- Fonts loaded via `@font-face` from Audi CDN (links above) with `font-display: swap` and variable format (woff2-variations).
- Images served from `emea-dam.audi.com` (Adobe DAM) with many `preferwebp=true` hints in URLs.

---

If you want, I can extract these CSS vars and font-face declarations into a machine-readable `design-system.json` next (include exact token mapping & example CSS).