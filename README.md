# Showcase of Halo: The Most Powerful AI Web app Builder

This repository demonstrates the capabilities of Halo, an AI-powered website builder. Below are examples of landing pages created with a single prompt and no iterations. Full stack agentic framework are in development.

TODO:
Release research paper on how we are blocking LLMs creativity
Release halo.dev platform

## Demos

### 1. Phaser3 Gaming Framework
**Live Demo:** [Phaser3](https://vox-hunter.github.io/halo-demo/phaser3)
**Lovable.dev Comparison:** [https://play-joyful-framework.lovable.app](https://play-joyful-framework.lovable.app) 

**Prompt:**
> "I want to create a landing page for my new phaser 3 gaming framework. we want to showcase our framework's capabilities"

**Constraints:**
- External tools (stock images, icons) were **disabled**.
- The AI was forced to create everything from scratch using only code.
-  Model used: Claude Sonnet 4.5 (128k context window)

### 2. Airy Air Freshener
**Live Demo:** [Airy](https://vox-hunter.github.io/halo-demo/airy)

**Prompt:**
> "I want to create a landing page for my air freshener. we want to showcase our vanilla flavoured air freshener shaped like a flower. our company name is airy."

**Settings:**
- External tools (stock images, icons, AI image, AI 3d) were **enabled**.
- *Note:* Due to budget limits, the AI used a stock image instead of generating a new one.
- 2 iteration prompts (summary: make the 3d model follow the user, fix annotations)
- Model used: Claude Opus 4.5 (128k context window)

## Comparison: Halo vs Lovable.dev

To provide a comparison, we ran the same prompts on Lovable.dev.

### Airy Air Freshener
**Lovable.dev Result:** [https://airy-flower-scent.lovable.app](https://airy-flower-scent.lovable.app)
**Aura.build Result:** [https://airy-scented-97.aura.build](https://airy-scented-97.aura.build) Why aura.build? It's known to be the best vibecoding tool for UI designs

**Prompt:**
> "I want to create a landing page for my air freshener. we want to showcase our vanilla flavoured air freshener shaped like a flower. our company name is airy."

**Settings:**
- All external tools (AI images, stock images, icons) were **enabled** by default.
