# StudioOS — Bestinterio (Pune)

> **Private Operations & Site Execution System for Bestinterio**  
> Custom-tailored for **Megha Jadhav** (Studio Owner) and **Bestinterio**, Pune.

StudioOS is a high-fidelity operations system designed specifically for interior design studios. It replaces messy WhatsApp threads, lost paper bills, and spreadsheet tracking with an elegant, calm, and robust dual-experience workflow:

1. **Studio Console (Desktop / Tablet)**: For the Studio Owner and Managers to oversee multi-site progress, real-time material inventory, reviewed bills, project margins, team permissions, and A4 print summary sheets.
2. **Site App (Phone-first PWA)**: For on-site Supervisors and Trade Leads (Carpentry, Electrical, Civil, Painting, Plumbing, False Ceiling) to record deliveries (with challan photos), log materials used, submit room progress with photos, conduct physical stock checks, and report site problems.

---

## Key Modules & Capabilities

- **Site Progress & Room × Trade Grid**: Real-time matrix of completion across all rooms and trades. Percentages compute automatically from cell status records (`Not started`, `25%`, `50%`, `75%`, `Done`).
- **Site Stock & Deliveries**: Track materials by category and specifications with low-stock thresholds. Every delivery creates a single "To review" bill record with linked movements; office staff review rates without double counting.
- **Bills & Spend vs Budget**: Upload and categorize vendor bills with automatic photo compression. Cumulative spend tracks against contract budgets in real time.
- **Summary Sheets**: Clean A4 print summaries in both **Customer** (progress photos, plan, customer action items) and **Internal** (confidential spend vs budget, deliveries, attention stock) editions.
- **Multi-Role Security & Permissions**: Workers and supervisors never see ₹ rates or financial margins. Managers can only view rates when explicitly granted permission by the owner.
- **Multilingual Site App**: Site app supports one-tap toggle between **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/srushtighogare/Bestinteriopune.git
cd Bestinteriopune

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser:
- To access the **Studio Console**: Navigate to `/login` or `/`
- To access the **Site App**: Navigate to `/site/login` or `/app`

---

## Deployment to Cloudflare Pages

This application is built as a single-page application (SPA) with full client-side routing, offline PWA support, and static asset pre-caching.

### Deploy Steps
1. Connect your GitHub repository to **Cloudflare Pages**.
2. Set the build configuration:
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js Version**: `18` or `20` (add environment variable `NODE_VERSION = 20`)
3. **SPA Routing**: The `public/_redirects` file automatically configures Cloudflare Pages with `/* /index.html 200` to support direct deep-linking on all console and site routes.
4. Click **Save and Deploy**.

To test the production build locally:
```bash
npm run build
npm run preview
```

---

## Demo Accounts & Fast Logins

Both the Console Login and Site App Login feature a **"Demo: sign in as…"** quick switcher for client presentations. You can also sign in manually using the credentials below:

### 1. Studio Console Logins
| Name | Role | Email | Password | Permissions |
|---|---|---|---|---|
| **Megha Jadhav** | Studio Owner | `megha@bestinterio.com` | `studio1234` | Full access, all ₹ rates, spend, bills & settings |
| **Neha Kulkarni** | Studio Manager | `neha@bestinterio.com` | `studio1234` | Project management, inventory, bills (amounts configurable) |

### 2. Site App Logins (Phone + 4-digit PIN)
| Name | Role / Trade | Phone | 4-Digit PIN | Assigned Sites |
|---|---|---|---|---|
| **Rajiv Deshmukh** | Site Supervisor | `9822011223` | `4826` | Mehta Residence, Baner Penthouse, Kharadi Villa |
| **Gurmukh Singh** | Carpenter (Lead) | `9822033445` | `3719` | Mehta Residence |
| **Ramesh Sutar** | Carpenter | `9822044556` | `5820` | Baner Penthouse |
| **Pravin Shinde** | Electrician (Lead) | `9822055667` | `2941` | Mehta Residence |
| **Santosh Yadav** | Painter | `9822066778` | `8314` | Baner Penthouse |

> **Security Demo**:
> - Entering PIN `9999` demonstrates the 5-attempt lockout security screen.
> - Setting obvious PINs (e.g. `1234`, `0000`, `1111`) is blocked by PIN validation rules.

---

## Resetting Demo Data

To return the system to its initial baseline state at any time:
1. Sign in to the **Studio Console** as **Megha Jadhav** (Owner) or **Neha Kulkarni** (Manager).
2. Go to **Settings** in the left sidebar (`/settings`).
3. Select the **Demo** tab from the settings sub-navigation.
4. Click **"Reset demo data to initial state"** and confirm.
5. All mock records (dates relative to today, baseline inventory, bills, scope cells, and team invites) will be restored immediately.

---

## Design System & Token Palette

StudioOS follows an architectural, warm-editorial design system:
- **Ivory (`#F6F2EA`)**: Page canvas
- **Paper (`#FBF9F4`)**: Cards, drawers, and modal surfaces
- **Ink (`#2A2925`)**: Headings, primary text, primary buttons
- **Muted (`#7A756B`)**: Secondary labels and meta info
- **Line (`#E3DCCF`)**: Subtle architectural 1px borders
- **Olive (`#6B7052`)**: Progress, positive states, accent
- **Amber (`#B58A4C`)**: Warnings, running low, pending review
- **Rust (`#A35F4A`)**: Blockers, out of stock, delayed status

Typography combines **Fraunces** (headings) with **Inter** (UI body and tabular figures).
