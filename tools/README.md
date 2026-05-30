# Attorney Bundle Generator

System used to generate the 5-case SoundExchange filing bundles for Funderburg Law.
Saved May 29, 2026.

## What's in this folder

```
bundle template/
├── README.md                          (this file)
├── generate_bundles.py                (the templater / engine)
├── templates/                         (the 4 master HTML templates)
│   ├── TR-LD-001_COVER-LETTER.html
│   ├── TR-LD-001_LOD-PART1.html
│   ├── TR-LD-001_SCHEDULE-1.html
│   └── TR-LD-001_ROYALTY-STATUS-REVIEW.html
└── example-output/                    (the 20 PDFs already shipped to /cases)
    ├── TR-LD-001_*.pdf  (4 files)
    ├── TR-LW-004_*.pdf  (4 files)
    ├── TR-JC-002_*.pdf  (4 files)
    ├── TR-KW-006_*.pdf  (4 files)
    └── TR-KF-003_*.pdf  (4 files)
```

## The 4-document bundle structure

Every case ships these 4 PDFs (no Identity Cert, no Chain-of-Custody, no Forensic Audit):

| Document | Purpose |
|---|---|
| `*_COVER-LETTER.pdf` | Funderburg Law letterhead. Frames the filing as a claim submission to SoundExchange. |
| `*_LOD-PART1.pdf` | Letter of Direction. **Direct-to-artist deposit** (NOT routed through attorney IOLTA). **No "irrevocable" language.** Performer + Authorized Rep signature blocks. |
| `*_SCHEDULE-1.pdf` | Repertoire Chart. ISRC + track metadata. "Matching purposes only" disclaimer. |
| `*_ROYALTY-STATUS-REVIEW.pdf` | Supporting documentation. **No dollar-amount claims.** Explicit notice that SoundExchange covers only non-interactive transmissions (SiriusXM, internet radio, webcasters) — NOT Spotify/Apple Music. |

## What changed vs. the old "forensic audit" package

The OLD bundle (`FILE1` through `FILE5`) had these problems for SoundExchange filings:
1. **Wrong rate math** — applied $0.0015–$0.0031/stream CRB rates to Spotify/Apple streams. Those streams are NOT collected by SoundExchange. The actual SX-eligible subset is much smaller.
2. **IOLTA routing** in LOD — committed every future royalty payment to flow through attorney escrow. Aggressive and unnecessary for a featured-performer claim.
3. **"Irrevocable" LOD language** — preserved no flexibility for the artist.
4. **SMPT chain-of-custody / SHA-256 anchors / MONAD-anchored protocol** — visual theater with no evidentiary value at SoundExchange.
5. **Specific dollar claims** ($98K, $204K, etc.) — asserted recovery amounts we had no way to verify.

The NEW bundle in this folder is what an entertainment attorney would actually file. Inquiry-then-claim posture, no false rate math, no IOLTA, no theater.

## How to regenerate (engine usage)

`generate_bundles.py` runs on the VPS (where headless `chromium-browser` is installed for PDF rendering). To add or modify a case:

1. **Edit `generate_bundles.py`** — add or change the entry in the `CASES` dict at the top:
   ```python
   'TR-XX-NNN': dict(
       isrc='USXXNNNNNNNN',
       recording='Track Title',
       primary='Primary Artist ft. Claimant',
       primary_short='Primary Artist',         # for Schedule 1 (no ft.)
       claimant='Stage Name',
       legal='Legal Name',
       year='YYYY',
       ipi='00NNNNNNNNN',                       # 11-digit IPI from BMI Songview or MusicBrainz
       ipi_src='BMI / Songview',                # or 'MusicBrainz', etc.
       work_id='NNNNNNNN',                      # BMI Work ID if known, else ''
   ),
   ```

2. **Upload to VPS**:
   ```
   scp -O -i ~/.ssh/traproyalties_vps generate_bundles.py root@srv1406833.hstgr.cloud:/tmp/template.py
   ```

3. **Run it**:
   ```
   ssh -i ~/.ssh/traproyalties_vps root@srv1406833.hstgr.cloud "python3 /tmp/template.py"
   ```
   Output: 4 HTMLs + 4 PDFs per case dropped into `/traproyalties-new/packages/frontend/public/cases/`.

4. **Wire it into the bundle**: Edit `/traproyalties-new/packages/frontend/app/cases/page.tsx` — add a new entry to the `CASES` array with `files: [{ COVER }, { LOD }, { SCHEDULE }, { REVIEW }]` pointing at the new filenames.

5. **Rebuild Next.js**:
   ```
   ssh -i ~/.ssh/traproyalties_vps root@srv1406833.hstgr.cloud "cd /traproyalties-new/packages/frontend && npm run build && pm2 restart frontend"
   ```

## Lerae's contact info (hardcoded in cover letter master)

If Lerae's info changes, edit `templates/TR-LD-001_COVER-LETTER.html`:
- **Letterhead block** (around line 33–40):
  - `FUNDERBURG LAW`
  - `PO Box 115233, Atlanta, GA 30310`
  - `lerae@funderburglaw.com · (678) 814-6300`
  - `firm.funderburglaw.com`
- **Signature block** (around line 81):
  - `Brashawna Lerae Funderburg, Esq. · Georgia Bar #279167`

After editing the master, re-run `generate_bundles.py` to propagate to every case's cover letter.

## Where this lives in production

- **Code/templates in git**: `mrglennc64/trappro-app` → `packages/frontend/public/cases/`
- **Render targets on VPS**: `/traproyalties-new/packages/frontend/public/cases/`
- **Bundle download UI**: https://traproyaltiespro.com/cases (passcode `TRP-ATT-2026`)
- **Master index page**: https://traproyaltiespro.com/cases/_ATTORNEY-REVIEW-INDEX.html

## Case data captured (as of May 29, 2026)

| Case | Claimant | ISRC | IPI | Source |
|---|---|---|---|---|
| TR-LD-001 | Lil Durk (Durk Derrick Banks) — Back in Blood | USAT22007048 | 00674059328 | BMI Songview |
| TR-LW-004 | Lil Wayne (Dwayne Michael Carter, Jr.) — WHATS POPPIN (Remix) | USAT22003620 | 00405845265 | MusicBrainz |
| TR-JC-002 | J. Cole (Jermaine Lamarr Cole) — The London | USAT21903320 | 00590963315 | BMI Songview · Work 30662752 |
| TR-KW-006 | Kanye West (Kanye Omari West) — I Love It | USUM71814031 | 00335677734 · 00451108296 | MusicBrainz (two IPIs on file) |
| TR-KF-003 | Kirk Franklin (Kirk Dewayne Franklin) — Love Theory | USA5W1800322 | 00180051602 | BMI Songview · Work 29018907 |
