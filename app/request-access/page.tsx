import type { Metadata } from 'next';
import PageShell from '../PageShell';
import RequestAccessForm from '../RequestAccessForm';

export const metadata: Metadata = {
  title: 'Request Access — TrapLawPro',
  description: 'Request a demo or start a free 14-day trial of TrapLawPro for your firm.',
};

export default function RequestAccessPage() {
  return (
    <PageShell
      eyebrow="Join the waitlist"
      title={<>Request <span className="accent">Access</span></>}
      intro="Get a personalized demo or start a free 14-day trial for your firm. Onboarding within 24 hours."
    >
      <div className="reqcard">
        <RequestAccessForm />
      </div>
    </PageShell>
  );
}
