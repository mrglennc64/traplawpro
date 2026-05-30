import type { ReactNode } from 'react';
import './landing.css';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

// Shared chrome for all marketing sub-pages: header, a titled section, footer.
// `title` may contain an <span className="accent"> via the `titleNode` prop.
export default function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="tlp">
      <SiteHeader />
      <section className="block">
        <div className="wrap">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="page-title">{title}</h1>
          {intro ? <p className="sub">{intro}</p> : null}
          {children}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
