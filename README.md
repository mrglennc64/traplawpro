# TrapLawPro

Standalone Next.js 14 SaaS for music-rights attorneys filing SoundExchange featured-performer claims. Spun out of the TrapRoyaltiesPro attorney portal.

## What's here

```
app/
  attorney-portal/page.tsx     The portal UI — Mission Control, War Room,
                               Digital Handshake, Reports & Documents,
                               Submission Bundle (inline JSZip download),
                               Split Verification, Secure Message.
  api/
    attorney-unlock/route.ts   Server-side passcode check. Returns role
                               and sets the unlock + cases-session cookies.
                               Reads ATTORNEY_PASSCODE / ADMIN_PASSCODE
                               from env — passcodes never reach the client.
    cases-file/[filename]/     Cookie-gated PDF stream from public/cases/.
    create-handshake/          Generates a verification ID + signing link
                               for the Digital Handshake form.
middleware.ts                  Gates /cases/*.html behind the cases-session
                               cookie. PDFs go through cases-file; raw HTMLs
                               are blocked unless the cookie is set.
public/cases/                  Generated bundle artifacts: 4 PDFs per case
                               (Cover Letter, LOD Part 1, Schedule 1,
                               Royalty Status Review) plus the master index
                               and SoundExchange filing instructions.
tools/                         The Python templater that regenerates every
                               case's 4 PDFs from the TR-LD-001 master HTMLs.
                               See tools/README.md.
```

## Setup

```bash
cp .env.example .env.local
# Edit .env.local — set ATTORNEY_PASSCODE and ADMIN_PASSCODE.

npm install
npm run dev
# Visit http://localhost:3000 → redirects to /attorney-portal.
```

## Roles

- **Locked (demo mode)** — mock matters, mock firm letterhead. No bundle downloads.
- **Attorney passcode** — Funderburg Law identity in header; 5 real cases; estimated SoundExchange recovery ranges; ZIP bundle downloads.
- **Admin passcode** — Operator identity in header; same real data; same downloads.

Cookies set on unlock (12h TTL):
- `trp_attorney_unlocked=1`
- `trp_attorney_role=attorney|admin`
- `trp_cases_session=TRP-ATT-2026` — what cases-file and middleware check.

## Regenerating bundles

When case data changes, edit `tools/generate_bundles.py` and re-run it. It rewrites every case's 4 HTML templates from the TR-LD-001 master, then renders them to PDF via headless Chromium.

```bash
python3 tools/generate_bundles.py
```

Output lands in `public/cases/`. Commit the regenerated PDFs.

## Heritage

Forked from `mrglennc64/trappro-app` at the point the attorney portal was being run as a section of TrapRoyaltiesPro. The portal page and its API routes were lifted as-is; the surrounding site (publisher portal, landing, free-audit, MLC search) was left behind.
