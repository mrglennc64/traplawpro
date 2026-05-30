import Link from 'next/link';

const BrandLogo = () => (
  <svg className="logo" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="19" y="8" width="2" height="26" fill="#0B2E33" />
    <rect x="12" y="33" width="16" height="2.5" rx="1" fill="#0B2E33" />
    <rect x="6" y="11" width="28" height="2" rx="1" fill="#0B2E33" />
    <path d="M6 13 L2 22 L14 22 Z" fill="#1C6E78" />
    <path d="M34 13 L30 22 L42 22 Z" fill="#1C6E78" transform="translate(-4 0)" />
    <circle cx="20" cy="12" r="2.5" fill="#0B2E33" />
  </svg>
);

export default function SiteHeader() {
  return (
    <header>
      <nav>
        <Link className="brand" href="/">
          <BrandLogo />
          <span className="name"><b>Trap</b><i>LawPro</i></span>
        </Link>
        <div className="nav-links">
          <Link href="/attorney-portal">Platform</Link>
        </div>
        <Link href="/request-access" className="nav-cta">Request Early Access</Link>
      </nav>
    </header>
  );
}
