import type { Metadata } from 'next';
import PageShell from '../PageShell';
import CardGrid, { type Card } from '../CardGrid';

export const metadata: Metadata = {
  title: 'IOLTA Reporting — TrapLawPro',
  description: 'Trust accounting ready: recovery ledger, IOLTA-compliant statements, and timed MOA reporting notifications.',
};

const CARDS: Card[] = [
  { icon: 'chart', title: 'Recovery ledger', body: 'Automatically track gross recoveries, consultant fees (e.g., 5% to TrapRoyaltiesPro), attorney fees, and net client distribution. Three-way reconciliation.' },
  { icon: 'list', title: 'IOLTA-compliant statements', body: 'Generate deposit confirmations, disbursement reports, and remaining balance summaries — directly matching state bar IOLTA recordkeeping rules.' },
  { icon: 'clock', title: 'Timed notifications', body: 'Built-in reminders for MOA Section 5 reporting: alert the attorney when funds are received, and when a consultant fee must be paid within the agreed window.' },
];

export default function IoltaPage() {
  return (
    <PageShell
      eyebrow="Trust accounting ready"
      title={<>IOLTA Reporting &amp; <span className="accent">Escrow Management</span></>}
      intro="Keep trust accounting clean: track every dollar from recovery to disbursement with reconciliation-ready reports for bar review."
    >
      <CardGrid items={CARDS} />
    </PageShell>
  );
}
