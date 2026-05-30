import type { Metadata } from 'next';
import PageShell from '../PageShell';
import CardGrid, { type Card } from '../CardGrid';

export const metadata: Metadata = {
  title: 'How It Works — TrapLawPro',
  description: 'The attorney workflow: onboard the client, import ISRC evidence, capture the LOD signature, then file and track.',
};

const CARDS: Card[] = [
  { icon: 'users', title: '1. Onboard client', body: 'Send the engagement letter and client authorization (fee disclosure) via embedded e-sign. The client signs in the portal — documents saved to a secure case folder.' },
  { icon: 'upload', title: '2. Import ISRC / evidence', body: 'Upload a CSV or connect to the TrapRoyaltiesPro case feed. Auto-fill LOD Part 1, Schedule 1, and the cover letter — prefilled with metadata.' },
  { icon: 'pen', title: '3. Client signature (LOD)', body: 'The artist signs the Letter of Direction directly inside the portal. The signed PDF is stored and ready for SoundExchange.' },
  { icon: 'send', title: '4. File & track', body: 'Download the final submission bundle (Cover Letter + LOD + Schedule 1). Submit to SoundExchange, then log recovery milestones and reporting.' },
];

export default function HowItWorksPage() {
  return (
    <PageShell
      eyebrow="Attorney workflow"
      title={<>How It <span className="accent">Works</span></>}
      intro="From client onboarding to a filed claim — a guided workflow that keeps every step documented and ethics-compliant."
    >
      <CardGrid items={CARDS} />
    </PageShell>
  );
}
