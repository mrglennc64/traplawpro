import type { Metadata } from 'next';
import PageShell from '../PageShell';
import CardGrid, { type Card } from '../CardGrid';

export const metadata: Metadata = {
  title: 'Privacy & Data Security — TrapLawPro',
  description: 'How TrapLawPro protects attorney and client data: encryption, US-based storage, your privacy rights, and cookie practices.',
};

const CARDS: Card[] = [
  { icon: 'lock', title: 'Security practices', body: 'Encryption at rest (AES-256) and in transit (TLS 1.3). Regular third-party penetration testing. SOC 2 Type I compliant infrastructure (audit available under NDA).' },
  { icon: 'folder', title: 'Client data', body: 'We never sell, rent, or share client data except as directed by the attorney or required by law. Data is stored on US-based servers.' },
  { icon: 'users', title: 'Your privacy rights', body: 'You may request data deletion, portability, or correction at any time. Retention defaults to 7 years post-last-activity, configurable shorter on request.' },
  { icon: 'globe', title: 'Cookies & tracking', body: 'Functional cookies only (session, authentication). No third-party analytics that track attorney case data. Full cookie opt-out via browser settings.' },
];

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Data protection"
      title={<>Privacy &amp; <span className="accent">Data Security</span></>}
      intro="Attorney work product and client information are protected by design — encrypted, US-hosted, and never sold."
    >
      <CardGrid items={CARDS} />
      <div className="legal-card">
        <p><strong>GDPR / CCPA notice:</strong> If you represent clients in California or the EU, we provide data processing addendums (DPAs) upon request. We act as a processor under your instruction.</p>
      </div>
    </PageShell>
  );
}
