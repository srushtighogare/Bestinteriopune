# StudioOS — Prototype Build Brief (for Antigravity)

> **How to use this file**
> 1. Before you start, replace every `[STUDIO NAME]`, `[OWNER NAME]`, `[CITY]` with the client's real details, and put the client's logo file in the project as `public/logo.svg` (or `logo.png`). If you only have a photo/JPEG of the logo, get a clean PNG with a transparent background first.
> 2. Paste **Section 1 → Section 4** into Antigravity as the first message ("Read this whole brief, then set up the project and design system only — Step 1 of the build order").
> 3. Then ask it to build **one step at a time** from Section 9 (Build order). After each step, open it in the browser, check it against the checklist in Section 10, and only then move on.
> 4. Keep everything in one GitHub repo — this prototype becomes the front-end of Phase 1.

---

## 1. Role and goal

You are a senior product designer and front-end engineer. Build a **high-fidelity, clickable prototype** of **StudioOS**, a private operations system for **Bestinterio**, an interior design studio in Pune.

It will be shown to the studio owner, **Megha Jadhav**, in a client meeting — as screenshots and as a live click-through on a laptop and a phone. It must feel like **her studio's own system**: elegant, calm, premium, made for an interior designer — not a generic admin template or an accounting ERP.

The system covers exactly three areas, plus setup and login:
1. **Inventory** — material received and used, per site, by category → material.
2. **Bills** — upload bill photos per project; bill items feed expenses and stock.
3. **Site progress** — a Room × Trade progress grid with photo updates and a summary sheet.

Two experiences:
- **Studio console** (desktop/tablet) — Owner and Manager.
- **Site app** (phone, installable web app) — Supervisor and Worker (e.g. carpenter, electrician).

---

## 2. Technical constraints

- **Front-end only.** No backend, no real database, no real auth, no real file storage. All data comes from local mock data files and lives in app state. Actions (submit, upload, approve) must update the screen as if they worked, and **all numbers must recalculate correctly** after an action.
- Stack: **React + TypeScript + Vite + Tailwind CSS**, React Router for real URLs per screen.
- Persist demo changes to `localStorage` so a refresh does not wipe what was shown in the meeting; add a hidden "Reset demo data" option in Settings.
- Make the site app an installable **PWA** (manifest with studio name + logo icon, theme colour, standalone display) so it can be added to a phone home screen.
- Icons: **Lucide** (outline, 1.5px stroke). No Material Symbols, no emoji in the UI.
- Images: no stock photos of random offices. Use calm placeholders (soft gradient or line-drawn room illustrations) for site cover images and progress photos, or a small set of neutral interior photos that look like real residential work in progress.
- Fully responsive. Studio console must work at 1440px, 1280px and iPad (820px). Site app is designed for 375–430px phones. **No horizontal page scroll anywhere.**
- **Future-proof structure (the real app will use Supabase):** all screens read and write data only through a service layer in `src/services/` (e.g. `projectsService.list()`, `stockService.recordUsed()`), never by importing mock data directly. Use **TanStack Query** for data fetching, **React Hook Form + Zod** for forms, and `vite-plugin-pwa` for the PWA. Use database-style IDs (UUID strings) and include a `studioId` on every record. In Phase 1 only the service layer is swapped from mock data to Supabase; screens stay unchanged.
- Single source of truth for data: `src/data/` holds raw records only (projects, rooms, materials, stock movements, bills, bill items, progress updates, users). **Every total, balance, percentage and count must be computed from these records — never typed in by hand.**

---

## 3. Brand and visual language

**Personalisation**
- Studio logo (`/logo.svg`) top-left of the console sidebar, on the login screen, in the site app header, on PDF summaries, and as the PWA icon.
- Studio name used in page titles, greetings and the PDF header: e.g. "Good morning, Megha" and "Bestinterio · StudioOS".
- If the logo has a strong brand colour, use it as the **accent** in place of olive below, keeping everything else neutral.

**Colour tokens** (define as CSS variables / Tailwind theme):
| Token | Value | Use |
|---|---|---|
| `ivory` | `#F6F2EA` | App background |
| `paper` | `#FBF9F4` | Cards, panels |
| `ink` | `#2A2925` | Headings, primary text, primary buttons |
| `ink-2` | `#4A4740` | Body text |
| `muted` | `#7A756B` | Secondary text, labels |
| `line` | `#E3DCCF` | Borders, dividers |
| `sand` | `#DCD2C2` | Subtle fills, empty states |
| `olive` | `#6B7052` | Accent: active states, progress, positive |
| `olive-soft` | `#E6E7DA` | Accent background |
| `amber` | `#B58A4C` / soft `#F3E8D6` | Warnings: running low, pending |
| `rust` | `#A35F4A` / soft `#F2E1DA` | Problems: out of stock, delayed, overused |

No bright blues, no pure black, no heavy shadows. Use one soft shadow at most for floating elements.

**Typography**
- Display / headings: an elegant serif — **Fraunces** or **Cormorant Garamond** (Google Fonts), weight 500.
- UI and body: **Inter** (400/500/600).
- Numbers in tables: Inter with tabular figures.
- Sizes: page title 28–32px serif; section title 18–20px serif; body 14–15px; labels 12px uppercase with letter-spacing for small section labels only.

**Feel**
- Generous whitespace, 8px spacing grid, 12–16px card radius, thin 1px borders instead of shadows.
- Subtle architectural details: thin rule lines, a faint floor-plan line drawing on the login screen and empty states.
- Calm motion: 150–200ms fades/slides. No bouncing, no confetti.
- Plain language everywhere (see Section 7). This must read like a designer's tool, not a ledger.

---

## 4. Users, roles and access

| Role | Experience | Sees | Cannot see |
|---|---|---|---|
| Owner | Studio console | Everything, including rates, amounts, spend | — |
| Manager | Studio console | Projects, inventory, bills, team, settings. (Costs visible — make this a toggle in Settings: "Managers can see amounts") | Owner-only settings |
| Supervisor | Site app | Only assigned sites. Material received + bill photo, material used, progress, stock check, issues | Rates, amounts, other sites |
| Worker (trade lead) | Site app | Only assigned sites; materials of his trade first. Material used + work done photos | Rates, amounts, bills, other sites |

---

## 5. Studio console (Owner / Manager) — screens

Layout: Left sidebar (240px, collapsible to icons on tablet), content area max-width ~1200px, centred. Sidebar items:
`Home · Projects · Inventory · Bills · Team · Settings`

- 5.1 Home (`/`)
- 5.2 Projects list (`/projects`)
- 5.3 Project detail (`/projects/:id`)
- 5.4 Inventory (`/inventory`)
- 5.5 Bills (`/bills`)
- 5.6 Team (`/team`)
- 5.7 Settings (`/settings`)
- 5.8 Summary sheet (`/projects/:id/summary`)
- 5.9 New project wizard (`/projects/new`)

---

## 6. Site app (Supervisor / Worker) — phone screens

- 6.1 Home (`/app`)
- 6.2 Material received (`/app/received`)
- 6.3 Material used (`/app/used`)
- 6.4 Work done / Progress update (`/app/progress`)
- 6.5 Report a problem (`/app/problem`)
- 6.6 Stock check (`/app/stock-check`)
- 6.7 Stock tab (`/app/stock`)
- 6.8 Me (`/app/me`)

---

## 7. Copy and language rules

| Use | Never use |
|---|---|
| Home | Executive dashboard, Console |
| Material received / Material used | Inward, Consumption, Intake, Disbursement |
| In stock / Running low / Out of stock | Critical shortage, Depleted, Reorder level |
| Bills | Fiduciary outlay, Vouchers, Ledger |
| Spend / Spent so far | Capital, Outlay, Burn |
| Stock check / Adjustment | Compensating reversal, Discrepancy incident |
| Needs your attention | Priority queue, Action required |
| Material | SKU |

---

## 8. Mock data (realistic, internally consistent)

All dates around **October 2026** (today = 26 Oct 2026).
**Studio:** Bestinterio, Pune. Owner: Megha Jadhav. Manager: Neha Kulkarni.
