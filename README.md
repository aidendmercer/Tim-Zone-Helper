# Time-Zone Comparison App

**Modern timezone comparison** with a global 24h timeline, per-city timelines, draggable hour marker (snaps on release), dimmed real-time indicator, sidebar with live local times, and a simple table view of the selected time across all cities. Built with **Next.js (App Router), TypeScript, Tailwind CSS, Luxon**.

## Features
- Left sidebar: searchable city list with flag + live local time
- Main: global 24h scale, per-city 24h bars with hourly grid & muted day-period colors
- Visible date break line + pill when city’s calendar day differs from reference
- Draggable marker (snaps to nearest hour) + always-visible dimmed NOW indicator
- 12h/24h toggle, Add City dialog (popular suggestions + search)
- Preferences & cities saved locally (IndexedDB via `idb-keyval`)
- Dark theme by default, accessible focus rings, keyboard friendly

---

## BEGINNER SETUP (NO TERMINAL NEEDED)

### 1) Create a GitHub repo and add the files
1. Go to **github.com** → top-right **+** → **New repository**.
2. Name it (e.g., `timezone-app`) → leave settings as default → **Create repository**.
3. On the repo page click **Add file → Create new file**.
4. For each file listed in this README’s *file tree*, create it:
   - Paste the **exact file path** in the name box (e.g., `app/page.tsx`).
   - Paste the file’s content from our chat.
   - Click **Commit new file**.
5. Repeat until all files are added (keep paths and names exactly the same).

### 2) Deploy to Vercel
1. Go to **vercel.com** and log in (GitHub sign-in is easiest).
2. Click **Add New → Project**.
3. Choose **Import Git Repository**, pick your repo, and click **Import**.
4. Leave defaults; Vercel detects Next.js automatically → click **Deploy**.

### 3) Copy your live URL and test
1. After deploy finishes, click the generated URL (e.g., `https://your-app.vercel.app`).
2. Test the app:
   - Drag the global timeline → release to snap on whole hours.
   - Click **Add City** to insert more locations.
   - Toggle **12h / 24h**.
   - The **NOW** indicator stays visible and updates.

### 4) (Optional) Run locally
1. Install **Node.js 18+**.
2. In a terminal:
   - `git clone <your-repo-url>`
   - `cd timezone-app`
   - `npm install`
   - `npm run dev`
3. Open **http://localhost:3000** in your browser.

---

## File Tree
