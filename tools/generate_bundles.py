"""Batch-generate the new-format bundles for TR-LW-004, TR-JC-002, TR-KW-006, TR-KF-003.
Reads TR-LD-001 templates as the master and substitutes per-case fields.
"""
import re, os, subprocess
PUB = '/traproyalties-new/packages/frontend/public/cases'
DATE = 'May 29, 2026'

CASES = {
  'TR-LW-004': dict(
    isrc='USAT22003620',
    recording='WHATS POPPIN (Remix)',
    primary='Jack Harlow ft. DaBaby, Tory Lanez &amp; Lil Wayne',
    primary_short='Jack Harlow',
    claimant='Lil Wayne',
    legal='Dwayne Michael Carter, Jr.',
    year='2020',
    ipi='00405845265',
    ipi_src='MusicBrainz',
    work_id='',
    cert='[RIAA certification pending verification]',
  ),
  'TR-JC-002': dict(
    isrc='USAT21903320',
    recording='The London',
    primary='Young Thug ft. J. Cole &amp; Travis Scott',
    primary_short='Young Thug',
    claimant='J. Cole',
    legal='Jermaine Lamarr Cole',
    year='2019',
    ipi='00590963315',
    ipi_src='BMI / Songview · Work ID 30662752',
    work_id='30662752',
    cert='3&times; Platinum (RIAA)',
  ),
  'TR-KW-005': dict(
    isrc='USUM71814031',
    recording='I Love It',
    primary='Kanye West &amp; Lil Pump ft. Adele Givens',
    primary_short='Kanye West &amp; Lil Pump',
    claimant='Kanye West',
    legal='Kanye Omari West',
    year='2018',
    ipi='00335677734 &middot; 00451108296',
    ipi_src='MusicBrainz (two IPIs on file)',
    work_id='',
    cert='2&times; Platinum (RIAA)',
  ),
  'TR-KF-003': dict(
    isrc='USA5W1800322',
    recording='Love Theory',
    primary='Kirk Franklin',
    primary_short='Kirk Franklin',
    claimant='Kirk Franklin',
    legal='Kirk Dewayne Franklin',
    year='2019',
    ipi='00180051602',
    ipi_src='BMI / Songview · Work ID 29018907',
    work_id='29018907',
    cert='Gold (RIAA)',
  ),
}

def read(fname):
  with open(os.path.join(PUB, fname)) as f: return f.read()

def write(fname, content):
  with open(os.path.join(PUB, fname), 'w') as f: f.write(content)

# Master templates from TR-LD-001
MASTER_COVER = read('TR-LD-001_COVER-LETTER.html')
MASTER_LOD = read('TR-LD-001_LOD-PART1.html')
MASTER_SCHED = read('TR-LD-001_SCHEDULE-1.html')
MASTER_REV = read('TR-LD-001_ROYALTY-STATUS-REVIEW.html')

LD = dict(
  isrc='USAT22007048',
  recording='Back in Blood',
  primary='Pooh Shiesty ft. Lil Durk',
  primary_short='Pooh Shiesty',
  claimant='Lil Durk',
  legal='Durk Derrick Banks',
  year='2021',
  ipi='00674059328',
  ipi_src='BMI / Songview',
)

def substitute(template, ref, c):
  s = template
  # Case ref
  s = s.replace('TR-LD-001', ref)
  # ISRC
  s = s.replace(LD['isrc'], c['isrc'])
  # Recording title (Back in Blood -> case recording)
  s = s.replace('Back in Blood', c['recording'])
  s = s.replace('&ldquo;Back in Blood&rdquo;', f'&ldquo;{c["recording"]}&rdquo;')
  # Primary artist credit
  s = s.replace('Pooh Shiesty ft. Lil Durk', c['primary'])
  # Schedule 1's Primary Artist field uses short form (without ft.)
  s = s.replace('<td>Pooh Shiesty</td>', f'<td>{c["primary_short"]}</td>')
  # Claimant (Lil Durk)
  s = s.replace('Lil Durk', c['claimant'])
  # Legal name
  s = s.replace('Durk Derrick Banks', c['legal'])
  # RIAA certification (in RSR Observations + Supporting Data)
  s = s.replace('certified 8&times; Platinum by RIAA with hundreds of millions of streams', f'certified {c["cert"]} with substantial streaming activity')
  s = s.replace('8&times; Platinum (RIAA) &mdash; Major commercial hit', f'{c["cert"]} &mdash; Major commercial hit')
  # Year
  s = s.replace('>2021<', f'>{c["year"]}<')
  # IPI line in LOD
  s = s.replace('00674059328 (BMI / Songview)', f'{c["ipi"]} ({c["ipi_src"]})')
  return s

for ref, c in CASES.items():
  # COVER LETTER - subject line, body, enclosures still reference the case data
  cover = substitute(MASTER_COVER, ref, c)
  # Cover subject explicitly references ISRC, title, claimant - substitute() handles those
  write(f'{ref}_COVER-LETTER.html', cover)

  # LOD
  lod = substitute(MASTER_LOD, ref, c)
  write(f'{ref}_LOD-PART1.html', lod)

  # SCHEDULE 1
  sched = substitute(MASTER_SCHED, ref, c)
  write(f'{ref}_SCHEDULE-1.html', sched)

  # ROYALTY STATUS REVIEW
  rev = substitute(MASTER_REV, ref, c)
  write(f'{ref}_ROYALTY-STATUS-REVIEW.html', rev)
  print(f'{ref}: 4 HTMLs written')

# Now render PDFs via chromium
for ref, c in CASES.items():
  for suffix in ['COVER-LETTER', 'LOD-PART1', 'SCHEDULE-1', 'ROYALTY-STATUS-REVIEW']:
    html = f'{ref}_{suffix}.html'
    pdf = f'{ref}_{suffix}.pdf'
    subprocess.run(['chromium-browser','--headless','--disable-gpu','--no-sandbox',
                    f'--print-to-pdf={os.path.join(PUB, pdf)}','--print-to-pdf-no-header',
                    f'file://{os.path.join(PUB, html)}'], capture_output=True)
    print(f'  rendered {pdf}')

print('DONE')
