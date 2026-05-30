import type { Metadata } from 'next';
import PageShell from '../PageShell';

export const metadata: Metadata = {
  title: 'Terms of Service — TrapLawPro',
  description: 'TrapLawPro terms of service: SaaS platform only, attorney responsibility, fixed fees, data ownership, and termination.',
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal agreement"
      title={<>Terms of <span className="accent">Service</span></>}
      intro="The plain-language terms that govern your use of the TrapLawPro platform."
    >
      <div className="legal-card">
        <p><strong>1. SaaS Platform Only.</strong> TrapLawPro provides software for case management, document generation, and compliance reporting. We are not a law firm, do not practice law, and do not provide legal advice.</p>
        <p><strong>2. Attorney Responsibility.</strong> You retain full responsibility for all legal work, ethical obligations, and client relationships. TrapLawPro is not a party to any attorney-client agreement.</p>
        <p><strong>3. Subscription Fees.</strong> Fees are fixed monthly amounts per active attorney seat. No success fees or contingency charges.</p>
        <p><strong>4. Data Ownership.</strong> You and your clients own all case data. TrapLawPro does not claim any intellectual property rights over your filings or client information.</p>
        <p><strong>5. Termination.</strong> Either party may terminate with 30 days notice. Upon termination, you may export all case data in standard formats (CSV, PDF).</p>
        <p><strong>6. No Warranty.</strong> The platform is provided &ldquo;as is,&rdquo; but we commit to 99.5% uptime and security patches within 48 hours of disclosure.</p>
        <p className="meta">Last updated: May 30, 2026. For full legal terms contact legal@traplawpro.com.</p>
      </div>
    </PageShell>
  );
}
