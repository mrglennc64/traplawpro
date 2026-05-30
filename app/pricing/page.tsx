import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '../PageShell';

export const metadata: Metadata = {
  title: 'Pricing — TrapLawPro',
  description: 'Predictable, transparent pricing: $149 per attorney per month. Firm plans at $129 per seat for 5+ attorneys.',
};

export default function PricingPage() {
  return (
    <PageShell
      eyebrow="Predictable & transparent"
      title={<>Pricing</>}
      intro="One fixed monthly fee per attorney seat. No percentage of recovery, no contingency creep, no hidden costs."
    >
      <div className="pricing-wrap">
        <div className="pricing-card">
          <div className="tier">
            <span className="tier-tag">Attorney Seat</span>
            <span className="tname">Solo &amp; Small Firm</span>
          </div>
          <div className="price">
            <b>$149</b><span className="per">/ month per attorney</span>
          </div>
          <div className="seat">Unlimited active cases · 14-day free trial</div>
          <ul>
            <li>Unlimited active cases</li>
            <li>E-sign LOD &amp; engagement letters</li>
            <li>IOLTA &amp; recovery reports</li>
            <li>Audit trails &amp; compliance exports</li>
            <li>Priority support</li>
          </ul>
          <Link href="/request-access" className="btn btn-primary">Start 14-Day Free Trial <span className="arr">→</span></Link>
          <div className="fine">NO CREDIT CARD REQUIRED · CANCEL ANYTIME</div>
        </div>

        <div className="pricing-side">
          <div>
            <span className="badge">Firm Plan</span>
            <h3>$129 <span className="accent">/ seat</span></h3>
            <p>For practices with 5+ attorneys — custom onboarding and a dedicated ethics review.</p>
            <div className="feat-mini">
              <span>Volume pricing per attorney seat</span>
              <span>Custom onboarding</span>
              <span>Dedicated ethics review</span>
              <span>Priority support SLA</span>
            </div>
          </div>
          <Link href="/request-access" className="btn btn-sage">Contact Sales <span className="arr">→</span></Link>
        </div>
      </div>
      <p className="price-note">All plans separate software fees from legal fees — see Fee Separation.</p>
    </PageShell>
  );
}
