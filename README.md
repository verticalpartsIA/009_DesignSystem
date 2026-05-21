# VP Design System — VerticalParts

Fundação visual unificada para todos os produtos internos da **VerticalParts**.
Todo novo projeto deve ser iniciado a partir deste repositório.

> Empresa: VerticalParts — São Paulo, fornecedor de elevadores, escadas rolantes e peças importadas.

---

## Início rápido

```bash
git clone https://github.com/verticalpartsIA/vp-design-system.git meu-projeto
cd meu-projeto
npm install
cp .env.example .env   # configure VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev
```

Acesse `http://localhost:5173/showcase` para o catálogo de componentes.

---

## Stack

| Tecnologia    | Versão | Função                              |
|---------------|--------|-------------------------------------|
| React         | 19     | UI                                  |
| TypeScript    | 5.8    | Tipagem estática                    |
| Vite          | 8      | Build e dev server                  |
| Tailwind CSS  | 3.4    | Design tokens + utilitários         |
| React Router  | 7      | Roteamento client-side              |
| Supabase JS   | 2      | Auth real (email/senha + SSO)       |
| lucide-react  | 1.7    | Ícones                              |

---

## Estrutura do projeto

```
src/
├── tokens/tokens.ts           ← Design tokens (cores, tipografia, sombras)
├── lib/
│   ├── supabase.ts            ← Cliente Supabase
│   ├── auth.tsx               ← Auth real (SSO + email/senha + is_active)
│   └── utils.ts               ← cn()
├── components/
│   ├── brand/Logo.tsx         ← Logo VerticalParts
│   ├── auth/                  ← SplitShell, CenteredShell, Field, FormHead
│   ├── ui/                    ← Button, Badge, Card, KpiCard
│   └── app/                   ← AppShell, Sidebar, Topbar
└── pages/
    ├── LoginPage.tsx          ← Login (email/senha + SSO automático)
    ├── RegisterPage.tsx
    ├── ForgotPasswordPage.tsx
    ├── ResetPasswordPage.tsx
    ├── DashboardPage.tsx      ← Rota protegida de exemplo
    └── ShowcasePage.tsx       ← Catálogo visual de todos os componentes
```

---

## Design Tokens

Cor oficial da marca: **`#F5C400`** (dourado).

```
primary        #F5C400  — dourado oficial
primary-dark   #C99E00  — hover / estados ativos
surface        #0f0f0f  — fundo escuro (sidebar)
surface-card   #1a1a1f  — card escuro
```

Tokens disponíveis em Tailwind (`bg-primary`, `text-primary`) e em TypeScript (`src/tokens/tokens.ts`).

---

## Autenticação

O `AuthProvider` suporta dois fluxos:

**1. Email + Senha**
```tsx
const { signIn } = useAuth()
await signIn(email, password)
```

**2. SSO via vpsistema** — o portal injeta tokens na URL:
```
https://meuapp.com/login?sso_token=...&sso_refresh=...
```
O `LoginPage` detecta e processa automaticamente. Nenhuma ação do usuário necessária.

---

## Como criar um novo projeto a partir deste template

1. Clone este repositório
2. Configure `.env` com as chaves Supabase do novo projeto
3. Defina as rotas em `src/App.tsx`
4. Crie novas páginas usando `AppShell` como base
5. Não modifique os componentes de `src/components/` — apenas estenda

---

## Sources used

- **13 component spec files** uploaded by the user, originally in `uploads/`:
  `colors-primary.html`, `colors-neutrals.html`, `colors-status.html`,
  `type-body.html`, `buttons.html`, `cards.html`, `badges.html`, `inputs.html`,
  `nav.html`, `logo-lockup.html`, `radii.html`, `shadows.html`, `spacing.html`.
  These each `<link>` to `../colors_and_type.css` — this design system file
  formalizes those tokens.
- **Live website snapshot** of `verticalparts.com.br` (home page copy, IA,
  product categories, footer details). Stored as `research/site-notes.md`.
- No Figma or codebase has been linked yet. If one exists, ask the user to
  Import it and we'll re-derive components from the source.

---

## Company / Product context

VerticalParts is a B2B importer & distributor for vertical-transport
equipment. The Portuguese-language site positions the company as:

> *"empresa líder com parceria internacional"* — a leader with an international
> (China) partnership, offering personalized solutions in passenger transport.

**Surfaces represented in this system:**

1. **Marketing site** (`verticalparts.com.br`) — institutional, segmented by
   equipment category (Elevadores · Escadas rolantes · Esteiras rolantes ·
   Corrimãos · Botoeiras · Corrente de degraus · Guia de elevadores · Barreiras
   infravermelhas · Quadro de Comando).
2. **Loja VerticalParts** (`lojaverticalparts.com`) — separate parts e-commerce
   storefront. Linked from the main site as the path to actually buy SKUs.

**Audience:** Building managers, condominium administrators, retrofit
specialists, and elevator-maintenance companies in Brazil. Technical buyers
who care about availability ("pronta entrega"), compatibility, and SKUs.

**Brand promise** (paraphrased from the site): wide stock, agile delivery,
fair price, qualified team.

---

## Visual identity at a glance

- **Yellow + Black + White** — high-contrast industrial palette. Yellow is the
  hero, used sparingly as an accent block, button surface, and rule.
- **Sharp corners** as the default (`--r-none: 0`), softer radii (`--r-sm`,
  `--r-md`) reserved for cards/inputs.
- **Condensed display type + bold uppercase eyebrows.** Type voice is
  technical and direct, mirroring the industrial-supply category.
- **Solid blocks > gradients.** No blurry/glassy/gradient backgrounds; the
  brand is built from hard rectangles, single-color fills, and a single yellow
  accent stripe.

The full **VISUAL FOUNDATIONS** section is further down this README.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `colors_and_type.css` | Single source of truth for color, type, spacing, shadow, radius, and motion tokens — referenced by every preview card and UI-kit screen. |
| `README.md` | This file. Brand context + content + visual foundations + iconography. |
| `SKILL.md` | Front-matter wrapper so this directory can also be loaded as an Agent Skill. |
| `assets/` | Logo lockups, brand marks, and any imagery copied from the live site. |
| `uploads/` | The user's original 13 HTML spec files — preserved as ground truth. |
| `preview/` | One small HTML card per token group / component cluster. These power the **Design System** review tab. |
| `ui_kits/website/` | Recreation of the VerticalParts marketing site as JSX components — Header, Hero, ServicesGrid, ProductCard, FAQ, Footer — wired into an interactive `index.html`. |
| `research/site-notes.md` | Copy snapshot from `verticalparts.com.br` (categories, SEO blurbs, footer contacts). |

---

## CONTENT FUNDAMENTALS

### Language
- **Portuguese (Brazil)** everywhere. `lang="pt-br"`. Never mix English UI
  with Portuguese copy — even technical terms are localized (*"Orçamento"*,
  *"Pronta entrega"*, *"Corrimão"*).
- English creeps in only for code-like artifacts: SKUs, technical specs
  (`24V DC`, `30mm`), and a handful of imported product names.

### Voice
- **Direct, technical, slightly formal.** Sentences are short and end in a
  concrete benefit. We talk about stock, delivery, compatibility, retrofit
  service. No "wow", no metaphors, no emoji.
- **"Você" implicit** — the site addresses the buyer in second person but
  rarely uses the pronoun; it leans on imperatives ("Solicite um orçamento",
  "Veja o catálogo", "Saiba mais").
- **Authority via numbers.** Trust signals are *"+11 anos"*, *"+4 mil peças
  catalogadas"*, *"entrega em todo BR"*. When in doubt, lead with a number.
- **Sales-friendly CTAs** use exclamation only in marketing hero blocks
  ("Está esperando o quê?"). Functional CTAs do not.

### Casing
- **ALL CAPS** for primary navigation, buttons, eyebrows, badges, and section
  labels. This is a load-bearing brand decision — do not lowercase buttons.
- Title Case for section headings (H2/H3) only when used inside cards.
- Sentence case for body copy, FAQ questions, and helper text.

### Tone examples (from site + uploads)
| Context | Real copy |
|---|---|
| Hero claim | *"Somos especialistas em transporte de passageiros."* |
| Trust stat | *"+11 anos no mercado · +4 mil peças catalogadas"* |
| Service blurb | *"Garantimos qualidade, robustez e segurança, aliados a uma inovação contínua."* |
| Primary CTA | *"Solicitar Orçamento →"* |
| Secondary CTA | *"Saiba mais"*, *"Ver Catálogo"*, *"Acessar"* |
| Status chip | *"Em estoque"* · *"Reposição"* · *"Esgotado"* |
| Eyebrow | *"Catálogo · Escada rolante"* |
| Error helper | *"Informe um número inteiro."* |

### Emoji / decoration
- **No emoji.** B2B-industrial — emoji would feel off-brand. Status uses a
  small filled circle (`•`) instead.
- The arrow `→` is the only decoration permitted on CTAs.
- A short **yellow `vp-rule`** (3px × 24–32px) is the only allowed
  pre-heading flourish.

---

## VISUAL FOUNDATIONS

### Color
- **Yellow `#F5C400`** is the single accent. It carries primary buttons, the
  bottom border of the dark nav, the heading rule, hover states on outlined
  buttons, and the `PARTS` half of the wordmark.
- **Black `#000`** is both ink and the inverse surface (dark navbars, dark
  CTAs). When yellow appears on black it's at full saturation.
- Neutrals follow a **9-stop grayscale ramp** (50, 100, 200, 300, 400, 500,
  700, 900, Ink). Dividers default to `--vp-gray-200`, body text to
  `--vp-gray-700`, hint copy to `--vp-gray-500`.
- **Status palette** uses material-style mids (Success `#2E7D32`, Info
  `#1565C0`, Warning `#ED8C00`, Danger `#C62828`) each paired with a 50-level
  tint for chip backgrounds. Status colors **never** become brand accents.

### Type
- **Display:** `Barlow Condensed` (substitute — see Font note). Bold,
  uppercase, tight letter-spacing for H1–H3 and the wordmark. The condensed
  form keeps long Portuguese headlines on one line.
- **Sans / UI:** `Inter` for body, labels, buttons, helper text.
- **Mono:** `JetBrains Mono` for SKUs, hex values, and breadcrumb paths —
  signaling "this is a code/identifier, not prose".
- Headings are **ALWAYS uppercase**, body is sentence case. Letter-spacing on
  headings is slightly negative (`-0.005em` / `-0.01em`); on eyebrows it's
  wide (`.18em`).

### Spacing
- 4px base scale: `4, 8, 12, 16, 24, 32, 48, 64, 96` (tokens `--sp-1`–`--sp-24`).
- Inner card padding defaults to 16–18px; section padding 48–96px on desktop.

### Radii
- **Default is 0.** This is the brand's industrial signal.
- 4–6px reserved for inputs and "soft" KPI cards.
- 999px (pill) used only for SKU/tag badges.

### Shadows
- `--shadow-xs/sm/md/lg/xl` — a conventional elevation ramp, but used
  *sparingly*. Sharp cards usually have **no shadow** and rely on a 1px
  `--border` instead. Soft cards (the exception) get `--shadow-sm`.
- **`--shadow-yellow`** is a special **offset solid-black block** beneath
  yellow CTAs — gives the button a "stamped" feel rather than a soft glow.

### Backgrounds
- Solid `#FFFFFF` and `--vp-gray-50` for most surfaces.
- The live site uses **full-bleed photographs** of escalators / lifts /
  handrails as section headers, color-corrected toward warm-neutral gray (not
  cool, not over-saturated). No grain, no duotone.
- **No gradients, no blurs, no glass.** A flat block of yellow or black is
  always preferred to a gradient.

### Imagery vibe
- Product photography is warm-neutral, daylit, with high contrast and
  factory/commercial settings. Equipment in situ (a shopping mall, an
  airport, a supermarket) rather than studio cutouts.
- The site's logo "Selo Vertical" mark is a circular badge in yellow/black —
  reuse for trust badges where appropriate.

### Animation / motion
- Subtle, mechanical, fast (120–200ms).
- `--ease-out: cubic-bezier(.22,.61,.36,1)` for everything that enters.
- Cards lift **3px on hover** with a snap to a yellow border (`transform:
  translateY(-3px); border-color: #F5C400`). No skew, no rotate, no spring.
- Buttons darken-or-brighten on hover; **no scale or shadow growth** except
  the yellow primary which adds the solid offset block.

### Hover & press
- **Primary button:** hover → `#FFD400` + offset black block; press → no scale.
- **Outline button:** hover → fills with yellow, border yellow, ink stays
  black.
- **Ghost / text link:** hover → text shifts to `--accent-press` (`#C99E00`).
- **Card (sharp):** hover → `translateY(-3px)` + yellow 1px border.
- **Nav link:** hover → color flips to yellow.

### Borders
- 1px `--border` (gray-200) for cards and dividers.
- 1px `--border-strong` (gray-300) for input borders.
- 2px `#F5C400` strip under the dark navbar — a load-bearing brand detail.
- Outline buttons use a 2px black border that becomes yellow on hover.

### Transparency / blur
- Used almost never. Only the yellow brand badge uses
  `rgba(245,196,0,.10)` as a chip wash. Never blur the backdrop.

### Layout rules
- The dark nav is **fixed height 80px** with a 2px yellow underline.
- Breadcrumbs sit in a 14px row directly under the nav, monospaced, with
  yellow `/` separators.
- Marketing sections are full-width with internal max-width ~1200px.
- Product / catalog cards are **edge-to-edge sharp rectangles** with a 3px
  yellow stripe at the top-left and the price right-aligned in tabular nums.

### Component motifs to reuse
- **Eyebrow → Headline → Body → Meta-row** vertical stack inside cards.
- **Yellow stripe** (3×24px) as the only acceptable pre-heading flourish.
- **SKU pill** rendered in mono inside a gray pill — "this is a part number".
- **Status dot + UPPERCASE label** for stock indicators.
- **Solid yellow CTA + arrow** — the primary call to action is always
  `→` not `>` and never an icon.

---

## ICONOGRAPHY

The live site does **not** ship a documented icon set; it uses ad-hoc
WordPress/Elementor inline SVGs for FAQ chevrons, social icons, and feature
bullets. We have therefore standardized on a single CDN icon set that
matches the industrial / utilitarian feel:

> **Lucide** (https://lucide.dev) — 1.5px stroke, square caps. Loaded via
> CDN: `https://unpkg.com/lucide@latest`. This is a **substitution** — please
> flag if you want to use a different family. Heroicons (outline, 1.5px) is
> the closest alternative.

Usage rules:
- Stroke icons only, **never filled**, to match the thin-line aesthetic.
- Default icon size **20px** inline with body; **16px** inside chips; **28px**
  in cards.
- Color inherits from text (`currentColor`). Hover/active states change the
  text color, not the icon directly.
- The yellow arrow `→` in CTAs is **text, not an icon** (so it inherits the
  uppercase letter-spacing).
- **No emoji** in product UI.
- **No unicode symbols** except `→` (right arrow), `·` (middle dot, used as
  separator in breadcrumbs and eyebrows), and `•` (filled circle, status dot).
- Status dots are CSS `.dot { width:6px; height:6px; border-radius:50%; background:currentColor; }`.

### Logo
- **Real horizontal lockup** lives at `assets/logo-verticalparts-color.png`
  (color) and `assets/logo-verticalparts-white.png` (white-on-dark variant
  auto-derived from the color file).
- The cropped circular icon is `assets/logo-mark.png` (default gray), plus
  `logo-mark-white.png` and `logo-mark-yellow.png` for dark / yellow
  surfaces.
- The wordmark uses **gray `#6E6E6E` for "VERTICAL"** and **yellow `#F5C400`
  for "PARTS"** — the CSS fallback `.vp-wordmark` matches this if the PNG
  ever fails to load.

---

## Font note — substitution flagged ⚠️

The original uploads reference token names but **do not bundle any font
files**. We have substituted with the closest Google Fonts:

| Role | Substitute | Likely original (please confirm) |
|---|---|---|
| Display (`--font-display`) | **Barlow Condensed** | A bold condensed sans — possibly Bebas Neue, Oswald, or a custom face. |
| UI / body (`--font-sans`) | **Inter** | A neutral geometric sans — possibly Montserrat or a system stack. |
| Mono (`--font-mono`) | **JetBrains Mono** | Any mono used for SKUs. |

If you want a different family, send a TTF/WOFF2 into `fonts/` and update
`@import` in `colors_and_type.css`.

---

## UI Kits

- **`ui_kits/website/`** — VerticalParts marketing site recreation.
  - `index.html` is a click-through home page with working nav, hero,
    services grid, product catalogue cards, FAQ accordion, and footer.
  - Components are factored as individual JSX files so they can be lifted
    into mocks: `Header.jsx`, `Hero.jsx`, `TrustStats.jsx`,
    `ServiceCard.jsx`, `ProductCard.jsx`, `FAQ.jsx`, `Footer.jsx`,
    `Button.jsx`, `Eyebrow.jsx`.
  - See `ui_kits/website/README.md` for the inventory.

A second kit for **`lojaverticalparts.com`** (the parts store) is not yet
built — the live store wasn't included in the uploaded specs. Ask if you'd
like that next.

---

## How to use this system

1. **In a new prototype HTML file** — include the stylesheet:
   ```html
   <link rel="stylesheet" href="colors_and_type.css">
   <body class="vp">…</body>
   ```
2. **Reach for tokens first**: `var(--vp-yellow)`, `var(--fg2)`,
   `var(--sp-6)`, `var(--shadow-md)`, `var(--ease-out)`. Don't invent new
   hexes.
3. **Headings get `.vp-h1` / `.vp-h2` / `.vp-h3`** — they apply the display
   font + uppercase rules in one shot.
4. **Buttons & form elements** — copy from `uploads/buttons.html` and
   `uploads/inputs.html`. These are the canonical, browser-tested versions.
5. **Cards** — start sharp with a yellow stripe (`.card.sharp` in
   `uploads/cards.html`), only go soft for KPI/stat cards.
