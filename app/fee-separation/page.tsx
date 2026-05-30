import type { Metadata } from 'next';
import PageShell from '../PageShell';
import CardGrid, { type Card } from '../CardGrid';

export const metadata: Metadata = {
  title: 'Fee Separation — TrapLawPro',
  description: 'Zero fee-splitting: flat SaaS subscription, optional consultant referral under a separate MOA, and required client authorization.',
};

const CARDS: Card[] = [
  { icon: 'tag', title: 'Flat SaaS subscription', body: 'TrapLawPro charges a fixed monthly fee per attorney seat — never a percentage of client recoveries or legal fees. Clear separation from any contingency arrangement.' },
  { icon: 'link', title: 'Optional consultant referral', body: 'The 5% consultant fee (TrapRoyaltiesPro) is governed by a separate MOA and is only activated if the attorney chooses to accept pre-vetted case leads. The platform can disable consultant features entirely.' },
  { icon: 'pen', title: 'Client authorization required', body: 'Before any consultant fee is deducted, the platform requires a signed Client Authorization Form disclosing the fee — satisfying ABA Model Rule 1.5(c) and state analogues.' },
];

export default function FeeSeparationPage() {
  return (
    <PageShell
      eyebrow="Zero fee-splitting"
      title={<>Fee Separation <span className="accent">Framework</span></>}
      intro="Software fees and legal fees never mix. The platform keeps your SaaS subscription cleanly separate from any recovery or referral arrangement."
    >
      <CardGrid items={CARDS} />
    </PageShell>
  );
}
