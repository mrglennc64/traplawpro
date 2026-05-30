import type { Metadata } from 'next';
import PageShell from '../PageShell';
import CardGrid, { type Card } from '../CardGrid';

export const metadata: Metadata = {
  title: 'Company — TrapLawPro',
  description: 'TrapLawPro is a dedicated legal SaaS for SoundExchange claims — a division of TrapRoyaltiesPro, based in Atlanta, GA.',
};

const CARDS: Card[] = [
  {
    icon: 'building',
    title: 'TrapLawPro (a division of TrapRoyaltiesPro)',
    body: 'Founded by music royalty analysts and legal technologists. We saw that attorneys handling SoundExchange claims struggled with manual bundles, ethics boundaries, and missing IOLTA workflows. TrapLawPro solves that with a dedicated legal SaaS — separate from our consulting arm.',
    list: [
      'No law firm ownership restrictions',
      'Designed for solo and boutique entertainment firms',
      'Based in Atlanta, GA',
    ],
  },
  { icon: 'link', title: 'Partner ecosystem', body: 'We integrate with TrapRoyaltiesPro (optional referral) but remain fully functional as a standalone case-management platform. Our mission: clean royalties, clean ethics.' },
];

export default function CompanyPage() {
  return (
    <PageShell
      eyebrow="Who we are"
      title={<>Company</>}
      intro="A legal-operations platform built specifically for the attorneys who recover featured-performer royalties."
    >
      <CardGrid items={CARDS} />
    </PageShell>
  );
}
