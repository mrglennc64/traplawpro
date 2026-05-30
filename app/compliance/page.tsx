import type { Metadata } from 'next';
import PageShell from '../PageShell';
import CardGrid, { type Card } from '../CardGrid';

export const metadata: Metadata = {
  title: 'Compliance — TrapLawPro',
  description: 'Rule-based architecture: data security, audit trails, and state-bar-aligned workflows for music royalty attorneys.',
};

const CARDS: Card[] = [
  { icon: 'lock', title: 'Data security & retention', body: 'Client data encrypted at rest and in transit (AES-256, TLS 1.3). Automatic retention policies align with state bar recordkeeping rules (typically 5–7 years).' },
  { icon: 'document', title: 'Audit trails', body: 'Every action — case creation, document signature, disbursement — is logged with timestamp and user identity. Full exportable audit log for bar inspections.' },
  { icon: 'adjust', title: 'State bar alignment', body: 'Configurable workflows for Georgia, NY, CA, TX and other jurisdictions. Includes mandatory conflict checks and client intake waivers.' },
];

export default function CompliancePage() {
  return (
    <PageShell
      eyebrow="Rule-based architecture"
      title={<>Compliance <span className="accent">built for legal professionals</span></>}
      intro="TrapLawPro is engineered so that the software stays inside the rules — encryption, audit trails, and jurisdiction-aware workflows by default."
    >
      <CardGrid items={CARDS} />
    </PageShell>
  );
}
