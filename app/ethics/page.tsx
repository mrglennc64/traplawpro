import type { Metadata } from 'next';
import PageShell from '../PageShell';
import CardGrid, { type Card } from '../CardGrid';

export const metadata: Metadata = {
  title: 'Ethics Architecture — TrapLawPro',
  description: 'Legal ethics by design: no UPL exposure, enforced client-lawyer relationships, and confidentiality firewalls.',
};

const CARDS: Card[] = [
  { icon: 'scale', title: 'No UPL exposure', body: 'TrapLawPro is pure software — it never gives legal advice, never selects claims, and never communicates with clients on behalf of an attorney unless directed. Every action requires attorney review and signature.' },
  { icon: 'users', title: 'Client-lawyer relationship', body: 'The platform enforces that engagement letters are signed before any LOD or filing is generated. No legal work starts without informed client consent.' },
  { icon: 'lock', title: 'Confidentiality firewalls', body: 'Role-based access: support staff see only metadata, attorneys control case strategy. No third-party data sharing without explicit client authorization.' },
];

export default function EthicsPage() {
  return (
    <PageShell
      eyebrow="Legal ethics by design"
      title={<>Ethics <span className="accent">Architecture</span></>}
      intro="Every workflow is reviewed against ABA Model Rules and state-bar fee-splitting prohibitions. The software supports your practice — it never replaces your judgment."
    >
      <CardGrid items={CARDS} />
    </PageShell>
  );
}
