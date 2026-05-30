import type { Metadata } from 'next';
import './landing.css';
import RevealObserver from './RevealObserver';
import AccessForm from './AccessForm';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export const metadata: Metadata = {
  title: 'TrapLawPro — Legal Operations for Music Royalty Claims',
  description:
    'A portal-first platform for music attorneys to manage SoundExchange claims, client authorizations, and recovery reporting — flat-rate and ethics-first.',
};

export default function HomePage() {
  return (
    <div className="tlp">
      <RevealObserver />
      <SiteHeader />

      {/* HERO */}
      <section className="hero" id="top">
        <div className="wrap">
          <div>
            <span className="eyebrow">Built for Music Attorneys</span>
            <h1>Royalty case management <span className="accent">without the compliance</span> headaches.</h1>
            <p className="lead">A portal-first platform to manage SoundExchange claims, client authorizations, and recovery reporting — fully separated from referral fees, fully aligned with bar ethics rules.</p>
            <div className="hero-actions">
              <a href="#cta" className="btn btn-primary">Request Early Access <span className="arr">→</span></a>
              <a href="#features" className="btn btn-ghost">See How It Works</a>
            </div>
            <div className="hero-trust">
              <span>No fee splitting</span>
              <span>No UPL exposure</span>
              <span>IOLTA-compatible</span>
            </div>
          </div>

          {/* CASE PANEL */}
          <div className="case-card">
            <div className="case-head">
              <span className="lbl">Active Matters</span>
              <span className="case-status">Live</span>
            </div>
            <h3>Brennan &amp; Associates, PLLC</h3>
            <div className="sub">CASE FILE TR-LD-001 · 4 ACTIVE</div>

            <div className="matter ready">
              <div className="l">
                <div className="t">Lil Durk — Back in Blood</div>
                <div className="d">EST. RECOVERY $15K–$50K · LOD READY</div>
              </div>
              <span className="tag ok">Signed</span>
            </div>
            <div className="matter pend">
              <div className="l">
                <div className="t">Lil Wayne — WHATS POPPIN</div>
                <div className="d">ISRC VERIFIED · SCHEDULE 1 ATTACHED</div>
              </div>
              <span className="tag pend">Filing</span>
            </div>
            <div className="matter review">
              <div className="l">
                <div className="t">42 Dugg — Free Me</div>
                <div className="d">CLIENT AUTH PENDING · LOD PART 1</div>
              </div>
              <span className="tag warn">Awaiting</span>
            </div>
            <div className="matter ready">
              <div className="l">
                <div className="t">Pooh Shiesty — Back in Blood</div>
                <div className="d">DISBURSEMENT LOGGED · IOLTA RECORDED</div>
              </div>
              <span className="tag ok">Closed</span>
            </div>
          </div>
        </div>
      </section>

      {/* STRIP */}
      <div className="strip">
        <div className="wrap">
          <span className="lbl">Built For</span>
          <span className="tag-pill">Solo Practitioners</span>
          <span className="tag-pill">Music Law Firms</span>
          <span className="tag-pill">Entertainment Counsel</span>
          <span className="tag-pill">Royalty Recovery Specialists</span>
        </div>
      </div>

      {/* FEATURES */}
      <section className="block" id="features">
        <div className="wrap reveal">
          <span className="eyebrow">01 — Platform</span>
          <h2>Everything a royalty attorney needs, <span className="accent">flat-rate</span> and ethics-first.</h2>
          <p className="sub">No percentage fees. No UPL exposure. Pure software that keeps your firm in control of the legal work — and out of fee-splitting territory.</p>

          <div className="features">
            <div className="feat">
              <span className="num">/ 01</span>
              <div className="ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></svg>
              </div>
              <h3>Auto-Generated Bundles</h3>
              <p>Cover letter, LOD Part 1, Schedule 1 — pre-filled with ISRC metadata, ready for client signature.</p>
            </div>
            <div className="feat">
              <span className="num">/ 02</span>
              <div className="ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3>Ethics-First Architecture</h3>
              <p>TrapLawPro is neutral software. Legal services stay with your firm. No unauthorized practice of law.</p>
            </div>
            <div className="feat">
              <span className="num">/ 03</span>
              <div className="ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              </div>
              <h3>Recovery Tracker &amp; MOA</h3>
              <p>Automated alerts for consultant reporting (5% rule) and complete client disbursement audit trail.</p>
            </div>
            <div className="feat">
              <span className="num">/ 04</span>
              <div className="ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <h3>Client Portal &amp; E-Sign</h3>
              <p>Engagement letters, LODs, and authorization forms signed online — fully SoundExchange-compliant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ETHICS */}
      <section className="block alt ethics" id="ethics">
        <div className="wrap reveal">
          <div>
            <span className="eyebrow">02 — Ethics Architecture</span>
            <h2>Designed for lawyers, <span className="accent">by legal operators.</span></h2>
            <p className="sub">Every line of code, every billing flow, every contract reviewed against ABA Model Rules and state-bar fee-splitting prohibitions. TrapLawPro is software — not a partner in your practice.</p>

            <div className="ethics-list">
              <div className="ethics-row">
                <span className="check">✓</span>
                <div>
                  <h4>No Fee Splitting</h4>
                  <p>Flat SaaS subscription. Your firm keeps 100% of legal fees. We never take a percentage of recovery.</p>
                </div>
              </div>
              <div className="ethics-row">
                <span className="check">✓</span>
                <div>
                  <h4>No Non-Lawyer Ownership of Practice</h4>
                  <p>You own the matters. You own the client relationship. We provide the tool, not the representation.</p>
                </div>
              </div>
              <div className="ethics-row">
                <span className="check">✓</span>
                <div>
                  <h4>Full IOLTA-Compatible Reporting</h4>
                  <p>Disbursement audit trail, trust accounting exports, and reconciliation-ready reports for every matter.</p>
                </div>
              </div>
              <div className="ethics-row">
                <span className="check">✓</span>
                <div>
                  <h4>Optional Consultant Integration</h4>
                  <p>If you choose TrapRoyaltiesPro lead-vetting, the 5% consultant fee is governed by a separate agreement — never blended with legal fees.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ethics-card">
            <span className="badge">The TrapLawPro Promise</span>
            <h3>Pure software. Not a referral fee arrangement.</h3>
            <p><strong>Your firm keeps 100% of legal fees.</strong> We charge a flat SaaS subscription — no percentage of recovery, no contingency creep, no entanglement with the legal work.</p>
            <div className="div"></div>
            <div className="sep"><b>NEUTRAL SOFTWARE</b> · NOT A LAW FIRM · NOT A REFERRAL SERVICE</div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="block" id="how">
        <div className="wrap reveal">
          <span className="eyebrow">03 — How It Works</span>
          <h2>From ISRC ingestion to <span className="accent">signed LOD</span> in minutes.</h2>
          <div className="steps">
            <div className="step">
              <span className="sn">01</span>
              <h4>Ingest ISRCs</h4>
              <p>Upload a catalog spreadsheet or paste ISRCs directly. TrapLawPro pulls verified metadata automatically.</p>
            </div>
            <div className="step">
              <span className="sn">02</span>
              <h4>Generate Claim Bundle</h4>
              <p>Cover letter, LOD Part 1, and Schedule 1 are pre-filled and ready to send — formatted for SoundExchange.</p>
            </div>
            <div className="step">
              <span className="sn">03</span>
              <h4>Client E-Signs in Portal</h4>
              <p>Engagement letter and authorization forms signed online. Audit trail logged automatically.</p>
            </div>
            <div className="step">
              <span className="sn">04</span>
              <h4>File &amp; Track</h4>
              <p>Submit to SoundExchange, monitor status, and log every communication in the matter timeline.</p>
            </div>
            <div className="step">
              <span className="sn">05</span>
              <h4>Disburse with IOLTA Compliance</h4>
              <p>Recovery received, fees allocated, trust accounting reports generated — ready for reconciliation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="block alt" id="pricing">
        <div className="wrap reveal">
          <span className="eyebrow">04 — Pricing</span>
          <h2>Attorney-first pricing. <span className="accent">No surprises.</span></h2>
          <p className="sub">One predictable monthly fee per attorney seat. Flat rate. No hidden costs. No contingency creep.</p>

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
                <li>Secure client portal with e-sign</li>
                <li>Auto-generated LODs &amp; Schedule 1</li>
                <li>ISRC ingestion and verification</li>
                <li>Recovery tracker &amp; MOA alerts</li>
                <li>IOLTA-compatible audit log</li>
                <li>Compliance reports &amp; disbursement records</li>
              </ul>
              <a href="#cta" className="btn btn-primary">Start 14-Day Free Trial <span className="arr">→</span></a>
              <div className="fine">NO CREDIT CARD REQUIRED · CANCEL ANYTIME</div>
            </div>

            <div className="pricing-side">
              <div>
                <span className="badge">Optional Add-On</span>
                <h3>Need <span className="accent">pre-vetted</span> leads?</h3>
                <p>Turn on TrapRoyaltiesPro lead integration for pre-audited cases — under a separate agreement with a separate 5% consultant fee.</p>
                <div className="feat-mini">
                  <span>Pre-audited claim leads</span>
                  <span>Separate consultant agreement</span>
                  <span>Never blended with legal fees</span>
                  <span>Opt in or out at any time</span>
                </div>
              </div>
              <a href="https://traproyaltiespro.com/how-it-works" target="_blank" rel="noopener noreferrer" className="btn btn-sage">Learn More <span className="arr">→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="cta">
        <div className="wrap reveal">
          <span className="eyebrow">Get Started</span>
          <h2>Replace spreadsheets with a <span className="accent">dedicated</span> ops platform.</h2>
          <p>Join attorneys who manage royalty recovery without the compliance overhead. Early access — onboarding within 24 hours.</p>
          <AccessForm />
          <div className="fine">No spam. No commitment. Reply within 24 hours.</div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div className="disclaimer">
        <div className="wrap">
          <div className="ic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <p><b>Important legal notice:</b> TrapLawPro is a software platform and does not provide legal services, legal advice, or represent clients. All legal representation is provided solely by licensed attorneys who use this platform as an administrative tool. TrapLawPro does not split legal fees; the optional 5% consultant fee (if any) is governed by a separate agreement with TrapRoyaltiesPro and is strictly for royalty recovery identification services.</p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
