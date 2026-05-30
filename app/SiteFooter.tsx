import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="fbrand">
          <Link className="brand" href="/">
            <svg className="logo" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="19" y="8" width="2" height="26" fill="#0B2E33" />
              <rect x="12" y="33" width="16" height="2.5" rx="1" fill="#0B2E33" />
              <rect x="6" y="11" width="28" height="2" rx="1" fill="#0B2E33" />
              <path d="M6 13 L2 22 L14 22 Z" fill="#1C6E78" />
              <path d="M30 13 L26 22 L38 22 Z" fill="#1C6E78" />
              <circle cx="20" cy="12" r="2.5" fill="#0B2E33" />
            </svg>
            <span className="name"><b>Trap</b><i>LawPro</i></span>
          </Link>
          <p>Legal operations software for music royalty claims. Built for attorneys. Built around the rules.</p>
        </div>
        <div>
          <h5>Compliance</h5>
          <ul>
            <li><Link href="/compliance">Compliance</Link></li>
            <li><Link href="/ethics">Ethics Architecture</Link></li>
            <li><Link href="/iolta">IOLTA Reporting</Link></li>
            <li><Link href="/fee-separation">Fee Separation</Link></li>
          </ul>
        </div>
        <div>
          <h5>Resources</h5>
          <ul>
            <li><Link href="/how-it-works">How It Works</Link></li>
            <li><Link href="/company">Company</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/request-access">Request Access</Link></li>
          </ul>
        </div>
        <div>
          <h5>Legal</h5>
          <ul>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy &amp; Data Security</Link></li>
            <li><Link href="/attorney-portal">Attorney Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="fbottom">
        <span>© 2026 TrapLawPro — a Division of Northern Star Systems Holding</span>
        <span>SOFTWARE PLATFORM · NOT A LAW FIRM</span>
      </div>
    </footer>
  );
}
