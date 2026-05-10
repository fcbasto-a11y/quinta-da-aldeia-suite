# Quinta da Aldeia — Business Suite
## Setup Guide

---

## What's included

| File | Description |
|---|---|
| `index.html` | Booking calendar (home page) |
| `payments.html` | Payment tracker |
| `checklist.html` | Per-event task checklists |
| `revenue.html` | Revenue dashboard |
| `messages.html` | Auto-reply message builder |
| `quote.html` | Public-facing quote request form |
| `style.css` | Shared design styles |
| `nav.js` | Shared navigation bar |
| `shared.js` | Shared API/database logic |
| `config.js` | Your configuration (edit this) |
| `appsscript.gs` | Google Apps Script backend |

---

## Step 1 — Create the Google Sheet

1. Go to https://sheets.google.com and sign in
2. Create a new spreadsheet named **Quinta da Aldeia Bookings**
3. In Row 1, add these headers (A to H):
   `id | name | type | date | guests | contact | status | notes`

---

## Step 2 — Add the Apps Script

1. In the Sheet: click **Extensions → Apps Script**
2. Delete all existing code
3. Open `appsscript.gs`, copy all the code, paste it in
4. Click **Save** (Ctrl+S)

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. Set: Execute as = **Me** | Who has access = **Anyone**
4. Click **Deploy** → authorise when prompted
5. Copy the Web app URL (looks like `https://script.google.com/macros/s/XXX/exec`)

---

## Step 4 — Update config.js

Open `config.js` and replace `YOUR_APPS_SCRIPT_URL_HERE` with your URL:

```js
window.SCRIPT_URL = 'https://script.google.com/macros/s/XXX/exec';
```

---

## Step 5 — Deploy to Netlify

1. Go to https://github.com and sign up with Google (free)
2. On the dashboard, upload your files to a repository and enable GitHub Pages the entire **quinta-da-aldeia-suite** folder
3. Your suite is live in seconds with a shareable URL like `https://fcbasto-a11y.github.io/quinta-da-aldeia-suite`
4. Share the link with all 5 team members — everyone bookmarks it

---

## Sharing with your team

All 5 owners use the same URL. No accounts or passwords required by default.

To add password protection: Netlify dashboard → Site settings → Access control → Password protection (free).

---

## Updating later

Made a change to a file? Just go to github.com → your site → Deploys → upload your files to a repository and enable GitHub Pages the folder again.

---

## Troubleshooting

- **"Demo mode" shown** → Check your Apps Script URL in config.js has no extra spaces
- **Bookings not saving** → Re-deploy the Apps Script after any code changes (must create a new deployment)
- **Column headers error** → Check your Google Sheet has all 8 headers in row 1 exactly as written above

---

## Latest update — PIN protection, exports, block dates & confirmation emails

### New files added
- `login.html` — PIN entry screen (shown on every page load)
- `auth.js` — authentication logic
- `export.js` — CSV export utility

### Setting your PINs
Open `auth.js` and change the PIN values at the top:
```js
var AUTH_PINS = {
  owner: '1234',   // Change to your owner PIN
  staff: '5678',   // Change to your staff PIN
};
```
**Important:** Change these before deploying. The default PINs above are just examples.

### New features
- **PIN screen** on every page — owner gets full access, staff cannot see Finance
- **Block dates** on the calendar — click "Block date" to mark dates as unavailable
- **Export CSV** buttons on Calendar, Payments and Finance pages
- **Booking confirmation emails** — automatically sent when a confirmed booking is added

### Apps Script update required
Replace your existing Apps Script with the new `appsscript.gs` and redeploy as a new deployment.
