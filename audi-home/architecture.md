# Page Structure & Component Breakdown (landing page: https://www.audi.com/)

Order is top-to-bottom as observed in the rendered page.

1. Global header
   - Purpose: primary navigation and brand entry point
   - Contained components: logo (inline SVG), main nav links, search/control icons, language/country selector
   - Text references: navigation labels found in footer nav groups and header (see `content.md`)

2. Hero / Lead section
   - Purpose: lead headline and hero imagery promoting platform/feature
   - Components: H1 "Up-to-Date Thanks to over-the-air", subtext ("Digital lifecycle management keeps vehicles up to date"), a hero image (large editorial photo)
   - Associated assets: `1080x1920_MF_2024_1010_AUDI_EB_00947.jpg` (see metadata)
   - Text refs: top H1 and CTA links "Read more"

3. Editorial / Topic grid (Current topics from the world of Audi)
   - Purpose: highlight news cards and editorial items
   - Components: dated article cards (date, title, blurb, CTA), editorial images
   - Assets: multiple editorial imagery (see `metadata.json` assets list)
   - Text refs: article headings like "Vehicle safety at Audi: When milliseconds count"

4. Feature sections (Innovation, E-Mobility, Artificial Intelligence, Sustainability)
   - Purpose: category entry blocks linking to deeper content
   - Components: image + label + CTA; sometimes image tiles link to category pages
   - Assets: `1920x1920_Innovation_A230547_01.jpg`, `1440x1440_A251206_large.jpg`, `1920x1080_A250752_large.jpg`, `1920x1080_A251204_large.jpg`

5. Careers / Tech Stories
   - Purpose: recruitment/brand culture; links to Tech Stories and career content
   - Components: cover image, label "Tech Stories", CTA
   - Asset: `1920x1080_MST_IK_Landingpage_CoverImage_1065_01.jpg`

6. Press & Media
   - Purpose: PR highlights and press release CTAs
   - Components: press image thumbnails, headlines, links
   - Assets: press images `A251983_large.png`, `A251980_large.jpg`, etc.

7. Model Discovery CTA
   - Purpose: bottom CTA guiding users to model discovery/configurator
   - Components: H-level callout, short blurb, CTA link "Discover all models" and regulatory footnote lines (consumption/emissions)

8. Global Footer
   - Purpose: sitewide utility links, legal, cookie controls, country selector
   - Components: multi-column link groups, legal links, social links, copyright
   - Text refs: legal links and cookie policy text verbatim (see `content.md`)

Notes:
- Many interactive/overlay components exist (cookie modal with toggles, consent buttons, live chat hooks). These are realized as feature-apps and script-injected components in the page.
- Asset mapping is supplied in `metadata.json` with suggested folder placement for each asset.

---

This breakdown intentionally maps sections to exact assets and verbatim text references so a coding agent can reconstruct the layout and wire content to components.