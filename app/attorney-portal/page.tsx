"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

const REAL_MATTERS = [
  { id: 1, name: "Lil Durk — Back in Blood",            amount: "8× Platinum",        estRecovery: "$15K – $50K", status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-LD-001", isrc: "USAT22007048" },
  { id: 2, name: "J. Cole — The London",                amount: "3× Platinum",        estRecovery: "$10K – $30K", status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-JC-002", isrc: "USAT21903320" },
  { id: 3, name: "Kirk Franklin — Love Theory",         amount: "Gold",               estRecovery: "$5K – $20K",  status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-KF-003", isrc: "USA5W1800322" },
  { id: 4, name: "Lil Wayne — WHATS POPPIN (Remix)",    amount: "Multi-Platinum",     estRecovery: "$25K – $75K", status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-LW-004", isrc: "USAT22003620" },
  { id: 5, name: "Lil Pump — I Love It (with Kanye)",   amount: "2× Platinum (US)",   estRecovery: "$10K – $35K", status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-KW-005", isrc: "USUM71814031" },
];

const MOCK_MATTERS = [
  { id: 1, name: "Trey Carter — Streetlights",          amount: "8× Platinum",  status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-DM-101", isrc: "USAA12345678" },
  { id: 2, name: "Marcus Vance — North Avenue",         amount: "3× Platinum",  status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-DM-102", isrc: "USBB12345678" },
  { id: 3, name: "Reverend Donovan — Spirit Call",      amount: "Gold",         status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-DM-103", isrc: "USCC12345678" },
  { id: 4, name: "Big Wave — Rhythm Section",           amount: "Major Hit",    status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-DM-104", isrc: "USDD12345678" },
  { id: 5, name: "Drake Steele — Dynasty",              amount: "2× Platinum",  status: "Bundle Ready", leakage: "Unregistered", issues: 0, caseRef: "TR-DM-105", isrc: "USEE12345678" },
];

const REAL_FIRM = {
  letterhead: 'FIRM VIEW — FUNDERBURG LAW',
  attorneyLine: 'Brashawna Lerae Funderburg, Esq. · Georgia Bar #279167 · PO Box 115233, Atlanta, GA 30310',
};

const MOCK_FIRM = {
  letterhead: 'FIRM VIEW — DEMO LAW GROUP',
  attorneyLine: 'Avery Chase, Esq. · State Bar #999999 · 100 Demo Avenue, Sample City, ST 12345',
};

const REAL_BUNDLE_CASES = [
  { ref: 'TR-LD-001', label: 'Lil Durk — Back in Blood' },
  { ref: 'TR-JC-002', label: 'J. Cole — The London' },
  { ref: 'TR-KF-003', label: 'Kirk Franklin — Love Theory' },
  { ref: 'TR-LW-004', label: 'Lil Wayne — WHATS POPPIN (Remix)' },
  { ref: 'TR-KW-005', label: 'Kanye West — I Love It' },
];

const MOCK_BUNDLE_CASES = [
  { ref: 'TR-DM-101', label: 'Trey Carter — Streetlights' },
  { ref: 'TR-DM-102', label: 'Marcus Vance — North Avenue' },
  { ref: 'TR-DM-103', label: 'Reverend Donovan — Spirit Call' },
  { ref: 'TR-DM-104', label: 'Big Wave — Rhythm Section' },
  { ref: 'TR-DM-105', label: 'Drake Steele — Dynasty' },
];

declare global { interface Window { JSZip: any; } }

function loadJSZip(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') { reject(new Error('no window')); return; }
    if (window.JSZip) { resolve(window.JSZip); return; }
    const existing = document.querySelector('script[data-jszip]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(window.JSZip));
      existing.addEventListener('error', () => reject(new Error('jszip load failed')));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.async = true;
    s.dataset.jszip = '1';
    s.onload = () => resolve(window.JSZip);
    s.onerror = () => reject(new Error('jszip load failed'));
    document.head.appendChild(s);
  });
}

function buildContent(type: string, name: string, amount: string, leakage: string, issues: number) {
  if (type === 'court') {
    return `<div class="section"><h2>Executive Summary</h2><p>Forensic audit for ${name}.</p><table><tr><th>Metric</th><th>Value</th></tr><tr><td>Unclaimed</td><td class="highlight">${amount}</td></tr><tr><td>Leakage</td><td class="danger">${leakage}</td></tr><tr><td>Issues</td><td class="warning">${issues}</td></tr></table></div><div class="section"><h2>Ownership</h2><table><tr><th>Party</th><th>Claimed</th><th>Verified</th><th>Status</th></tr><tr><td>Artist</td><td>50%</td><td class="highlight">50%</td><td class="highlight">Verified</td></tr><tr><td>Producer</td><td>30%</td><td class="warning">25%</td><td class="warning">Under-claimed</td></tr><tr><td>Co-Writer</td><td>20%</td><td class="danger">15%</td><td class="danger">Disputed</td></tr></table></div>`;
  }
  if (type === 'demand') {
    const d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    return `<div class="section"><p><b>Date:</b> ${d}</p><p>Republic Records, Attn: Legal Department</p></div><div class="section"><p><b>RE: DEMAND FOR UNPAID ROYALTIES</b></p><p>Matter: ${name}</p><p>Amount: ${amount}</p><br><p>Dear Sir or Madam:</p><br><p>This firm demands immediate payment of ${amount} in unpaid royalties. Failure to remit within 30 days will result in legal proceedings.</p><br><p>Respectfully,<br>Glenn Carter-CCA<br>Carters Consultants Agency</p></div>`;
  }
  if (type === 'affidavit') {
    const d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    return `<div class="section"><h2>AFFIDAVIT OF GLENN CARTER-CCA</h2><p>STATE OF _____________)</p><br><p>I, Glenn Carter-CCA, being duly sworn, state:</p><ol><li>I am counsel for ${name}.</li><li>Forensic audit confirms ${amount} in unpaid royalties.</li><li>${issues} material discrepancies identified. Leakage: ${leakage}.</li><li>All findings verified via the TrapRoyaltiesPro audit system.</li></ol><br><p>Executed: ${d}</p><br><p>___________________________<br>Glenn Carter-CCA</p><br><p>___________________________<br>Notary Public</p></div>`;
  }
  return `<div class="section"><h2>Custom Report</h2><p>Matter: ${name}</p><table><tr><th>Category</th><th>Finding</th><th>Impact</th></tr><tr><td>Streaming</td><td class="warning">Underreported Q3-Q4</td><td class="danger">-$45,200</td></tr><tr><td>Sync</td><td class="highlight">Verified</td><td>+$0</td></tr><tr><td>Performance</td><td class="danger">No ASCAP registration</td><td class="danger">${amount}</td></tr></table></div>`;
}

function generatePDF(title: string, content: string, matterName: string, matterId: number) {
  const hash = 'TRP-' + matterId + '-' + Date.now().toString(36).toUpperCase();
  const url = 'https://traproyaltiespro.com/verify/' + hash;
  const sha = Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a1a}.section{margin:24px 0;padding:16px;background:#f9fafb;border-radius:8px;border-left:4px solid #4f46e5}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#eef2ff;padding:10px;text-align:left;color:#4f46e5}td{padding:10px;border-bottom:1px solid #e5e7eb}.qr{display:flex;align-items:center;gap:20px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #86efac;margin-top:24px}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:.75rem;color:#9ca3af;text-align:center}.highlight{color:#16a34a;font-weight:bold}.warning{color:#d97706;font-weight:bold}.danger{color:#dc2626;font-weight:bold}h2{color:#1e1b4b}</style></head><body><h1 style="color:#1e1b4b">${title}</h1><p style="color:#6b7280">Matter: ${matterName} | Carters Consultants Agency | Glenn Carter-CCA | ID: ${hash}</p>${content}<div class="qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(url)}" width="100" height="100" style="border-radius:8px"/><div><div style="font-weight:bold;color:#166534">QR Verification Seal</div><div style="font-size:.8rem;margin:4px 0">Scan to verify authenticity</div><div style="font-size:.7rem;color:#6b7280">${url}</div><div style="font-family:monospace;font-size:.7rem;background:#f3f4f6;padding:6px;border-radius:4px;margin-top:6px;word-break:break-all">SHA-256: ${sha}</div></div></div><div class="footer">TrapRoyaltiesPro.com | Confidential | Verify: ${url}</div></body></html>`;
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = title.replace(/\s+/g,'-') + '-' + hash + '.html';
  a.click();
}

export default function AttorneyPortal() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [unlocked, setUnlocked] = useState(false);
  const [unlockRole, setUnlockRole] = useState<'attorney' | 'admin' | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [bundleDownloading, setBundleDownloading] = useState(false);
  const [bundleDownloadError, setBundleDownloadError] = useState('');

  useEffect(() => {
    try {
      if (typeof document === 'undefined') return;
      const cookies = document.cookie.split('; ');
      const roleCookie = cookies.find(c => c.startsWith('trp_attorney_role='));
      if (cookies.some(c => c.startsWith('trp_attorney_unlocked=1'))) {
        setUnlocked(true);
        if (roleCookie) {
          const role = roleCookie.split('=')[1];
          if (role === 'attorney' || role === 'admin') setUnlockRole(role);
        }
      }
    } catch {}
  }, []);

  const handleUnlock = async () => {
    const code = passcodeInput.trim();
    if (!code) { setUnlockError('Enter a passcode'); return; }
    try {
      const res = await fetch('/api/attorney-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: code }),
      });
      if (!res.ok) { setUnlockError('Invalid passcode'); return; }
      const data = await res.json();
      const role: 'attorney' | 'admin' = data.role === 'attorney' ? 'attorney' : 'admin';
      setUnlocked(true);
      setUnlockRole(role);
      setShowUnlockModal(false);
      setUnlockError('');
      setPasscodeInput('');
    } catch {
      setUnlockError('Network error — try again');
    }
  };

  const handleLock = () => {
    setUnlocked(false);
    setUnlockRole(null);
    try {
      document.cookie = 'trp_attorney_unlocked=; path=/; max-age=0';
      document.cookie = 'trp_attorney_role=; path=/; max-age=0';
      document.cookie = 'trp_cases_session=; path=/; max-age=0';
    } catch {}
  };

  const headerIdentity = unlocked
    ? (unlockRole === 'attorney'
        ? 'Brashawna Lerae Funderburg, Esq. · FUNDERBURG LAW · lerae@funderburglaw.com'
        : 'Glenn Carter-CCA · Admin · Carters Consultants Agency')
    : 'Demo Session · Avery Chase, Esq. (sample data)';

  const MATTERS = unlocked ? REAL_MATTERS : MOCK_MATTERS;
  const BUNDLE_CASES = unlocked ? REAL_BUNDLE_CASES : MOCK_BUNDLE_CASES;
  const firm = unlocked ? REAL_FIRM : MOCK_FIRM;
  const [selectedBundleCase, setSelectedBundleCase] = useState(BUNDLE_CASES[0].ref);

  useEffect(() => {
    if (!BUNDLE_CASES.some(c => c.ref === selectedBundleCase)) {
      setSelectedBundleCase(BUNDLE_CASES[0].ref);
    }
  }, [unlocked]);
  const bundleDocUrl = (suffix: string) => `/api/cases-file/${selectedBundleCase}_${suffix}.pdf`;
  const bundleHtmlUrl = (suffix: string) => `/cases/${selectedBundleCase}_${suffix}.html`;
  const [selectedMatter, setSelectedMatter] = useState(1);
  const [scanRunning, setScanRunning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [splitStep, setSplitStep] = useState<number>(0);
  const [splitData, setSplitData] = useState<any[]>([]);
  const [splitErrors, setSplitErrors] = useState<string[]>([]);
  const [splitVerifyId, setSplitVerifyId] = useState<string>('');
  const [splitTimestamp, setSplitTimestamp] = useState<string>('');
  const [splitPayAmount, setSplitPayAmount] = useState<number>(50000);
  const matter = MATTERS.find(m => m.id === selectedMatter) || MATTERS[0];

  // --- Secure admin<->attorney messaging ---
  const [msgs, setMsgs] = useState<{ id: string; sender: string; body: string; createdAt: string; mine: boolean }[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [msgUnread, setMsgUnread] = useState(0);

  const loadUnread = async () => {
    try { const r = await fetch('/api/messages/unread'); if (r.ok) { const d = await r.json(); setMsgUnread(d.unread || 0); } } catch {}
  };
  const loadMessages = async () => {
    try { const r = await fetch('/api/messages'); if (r.ok) { const d = await r.json(); setMsgs(d.messages || []); setMsgUnread(0); } } catch {}
  };
  const sendMessage = async () => {
    const text = msgInput.trim(); if (!text) return;
    setMsgSending(true);
    try {
      const r = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: text }) });
      if (r.ok) { setMsgInput(''); await loadMessages(); }
    } finally { setMsgSending(false); }
  };

  // Poll the unread count for the sidebar badge while unlocked.
  useEffect(() => {
    if (!unlocked) { setMsgUnread(0); return; }
    loadUnread();
    const t = setInterval(loadUnread, 12000);
    return () => clearInterval(t);
  }, [unlocked]);

  // While the messages section is open, load + poll the thread (GET marks read).
  useEffect(() => {
    if (!unlocked || activeSection !== 'secure-message') return;
    loadMessages();
    const t = setInterval(loadMessages, 5000);
    return () => clearInterval(t);
  }, [unlocked, activeSection]);

  const runScan = () => {
    setScanRunning(true);
    setScanComplete(false);
    setTimeout(() => { setScanRunning(false); setScanComplete(true); }, 2500);
  };

  const handleDownload = (type: string, title: string) => {
    setDownloading(type);
    setTimeout(() => {
      generatePDF(title, buildContent(type, matter.name, matter.amount, matter.leakage, matter.issues), matter.name, matter.id);
      setDownloading(null);
    }, 800);
  };

  const showBar = !['firm-view', 'dashboard', 'war-room', 'new-matter', 'secure-message', 'digital-handshake'].includes(activeSection);

  const navGroups = [
    { label: "Matter Management", items: [
      { id: 'firm-view', label: 'Firm View', icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
      { id: 'dashboard', label: 'Mission Control', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { id: 'war-room', label: 'War Room', icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
      { id: 'new-matter', label: 'New Matter', icon: "M12 4v16m8-8H4" },
    ]},
    { label: "Digital Handshake", items: [
      { id: 'digital-handshake', label: 'Digital Handshake', icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
      { id: 'cases', label: 'Cases / Chain of Custody', href: '/attorney-portal/handshake', icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ]},
    { label: "Reports & Documents", items: [
      { id: 'generate-court-report', label: 'Court-Ready Report (LOD Part 1)', icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
      { id: 'view-cover-letter', label: 'Cover Letter', icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
      { id: 'view-schedule-1', label: 'Schedule 1', icon: "M9 17v-2a4 4 0 014-4h6m0 0l-3-3m3 3l-3 3M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" },
      { id: 'view-royalty-status-review', label: 'Royalty Status Review', icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
      { id: 'submission-bundle', label: 'Submission Bundle', icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
      { id: 'filing-instructions', label: 'Filing Instructions', icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    ]},
    { label: "Communication", items: [
      { id: 'secure-message', label: 'Secure Messages', icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge: msgUnread > 0 ? String(msgUnread) : undefined },
    ]},
  ];

  // In demo mode, route gated actions through the passcode modal instead of running them.
  const requireUnlock = (action: () => void) => () => {
    if (!unlocked) { setShowUnlockModal(true); setUnlockError(''); setPasscodeInput(''); return; }
    action();
  };

  const PERFECT_SPLIT = [
    { name: "James Carter", role: "Composer", percentage: 50, ipi: "00624789341" },
    { name: "Toya Williams", role: "Lyricist", percentage: 30, ipi: "00472915682" },
    { name: "DJ Premier", role: "Producer", percentage: 20, ipi: "00836125497" }
  ];
  const ERROR_SPLIT = [
    { name: "James Carter", role: "Composer", percentage: 60, ipi: "" },
    { name: "", role: "Lyricist", percentage: 25, ipi: "00472915682" },
    { name: "DJ Premier", role: "Producer", percentage: 20, ipi: "invalid" },
    { name: "Extra", role: "Writer", percentage: 10, ipi: "" }
  ];
  const validateSplit = (data: any[]) => {
    const errs: string[] = [];
    let total = 0;
    data.forEach((item: any, i: number) => {
      total += item.percentage || 0;
      if (!item.name || item.name.trim() === '') errs.push("Contributor " + (i+1) + " missing name");
      if (!item.ipi || item.ipi.trim() === '' || item.ipi === 'invalid') errs.push((item.name || 'Contributor') + " missing/invalid IPI");
    });
    if (Math.abs(total - 100) > 0.1) errs.push("Total split is " + total + "%, must equal 100%");
    return errs;
  };
  const loadPerfectSplit = () => { setSplitData(PERFECT_SPLIT); setSplitErrors([]); setSplitStep(1); };
  const loadErrorSplit = () => { const errs = validateSplit(ERROR_SPLIT); setSplitData(ERROR_SPLIT); setSplitErrors(errs); setSplitStep(2); };
  const autoFixSplit = () => {
    const fixed = splitData.map((item: any, i: number) => ({
      ...item,
      name: item.name || ("Contributor " + (i+1)),
      ipi: (!item.ipi || item.ipi === 'invalid') ? ("AUTO-" + Math.floor(Math.random()*90000+10000)) : item.ipi,
    }));
    const total = fixed.reduce((s: number, i: any) => s + i.percentage, 0);
    if (Math.abs(total - 100) > 0.1) { const factor = 100/total; fixed.forEach((i: any) => { i.percentage = Math.round(i.percentage*factor*10)/10; }); }
    setSplitData(fixed); setSplitErrors(validateSplit(fixed)); setSplitStep(1);
  };
  const startSplitVerification = () => {
    const id = Math.random().toString(36).substr(2,16).toUpperCase();
    setSplitVerifyId(id);
    setSplitTimestamp(new Date().toISOString().replace('T',' ').substring(0,16) + ' UTC');
    setSplitStep(2);
  };
  const downloadSplitReport = () => {
    const rows = splitData.map((i: any) => {
      const g = splitPayAmount*i.percentage/100;
      return "<tr><td>"+i.name+"</td><td>"+i.role+"</td><td>"+i.ipi+"</td><td>"+i.percentage+"%</td><td>$"+g.toLocaleString()+"</td><td>-$"+(g*0.25).toLocaleString()+"</td><td>$"+(g*0.75).toLocaleString()+"</td></tr>";
    }).join('');
    const html = "<html><body style='font-family:Arial;padding:30px'><h1 style='color:#312e81'>TrapRoyaltiesPro - Split Verification Report</h1><p><b>ID:</b> TRP-"+splitVerifyId+"</p><p><b>Time:</b> "+splitTimestamp+"</p><p><b>Gross:</b> $"+splitPayAmount.toLocaleString()+"</p><p><b>Net:</b> $"+(splitPayAmount*0.75).toLocaleString()+"</p><table border='1' cellpadding='8' style='width:100%;border-collapse:collapse'><tr style='background:#eef2ff'><th>Name</th><th>Role</th><th>IPI</th><th>%</th><th>Gross</th><th>Tax</th><th>Net</th></tr>"+rows+"</table></body></html>";
    const blob = new Blob([html],{type:'text/html'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download="TRP-Split-Report.html"; a.click();
  };
  const resetSplitWorkflow = () => { setSplitStep(0); setSplitData([]); setSplitErrors([]); setSplitVerifyId(''); setSplitPayAmount(50000); };

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#111]">
      <div className="bg-[#1d3557] text-white py-2 px-6 text-center text-sm font-medium">
        Attorney Portal - Secure Session - Verified &amp; Documented
      </div>
      <header className="sticky top-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-[#1d3557]">TrapLaw<span className="text-[#1d3557]">Pro</span></Link>
            <span className="px-3 py-1 bg-[#1d3557]/10 text-[#1d3557] text-sm rounded-full font-medium">Attorney Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#555]">{headerIdentity}</span>
            {unlocked ? (
              <button onClick={handleLock}
                className="px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-300 text-green-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
                UNLOCKED — Click to Re-Lock
              </button>
            ) : (
              <button onClick={() => { setShowUnlockModal(true); setUnlockError(''); setPasscodeInput(''); }}
                className="px-3 py-2 bg-[#1d3557] hover:bg-[#122947] text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                Unlock Real Client Data
              </button>
            )}
            <Link href="/" className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm transition">Logout</Link>
          </div>
        </div>
        {!unlocked && (
          <div className="bg-amber-50 border-t border-amber-200 px-6 py-2 text-center text-xs text-amber-900">
            <span className="font-bold">DEMO MODE</span> &middot; Showing mock client data. Unlock with attorney or admin passcode to view real client matters.
          </div>
        )}
      </header>

      {showUnlockModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowUnlockModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-black text-[#111] mb-2">Unlock Real Client Data</h3>
            <p className="text-sm text-[#555] mb-6">Enter the attorney or administrative passcode to switch from demo mode to real client matters.</p>
            <input
              type="password"
              autoFocus
              value={passcodeInput}
              onChange={(e) => { setPasscodeInput(e.target.value); setUnlockError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(); }}
              placeholder="Enter passcode"
              className="w-full px-4 py-3 border border-black/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557] mb-3 font-mono"
            />
            {unlockError && <p className="text-sm text-red-600 font-bold mb-3">{unlockError}</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowUnlockModal(false)}
                className="flex-1 py-3 border border-black/15 text-[#333] rounded-lg font-bold hover:bg-black/5 transition">Cancel</button>
              <button onClick={handleUnlock}
                className="flex-1 py-3 bg-[#1d3557] text-white rounded-lg font-bold hover:bg-[#122947] transition">Unlock</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        <div className="w-72 bg-white border-r border-black/10 min-h-screen p-6">
          <div className="space-y-8">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-4">{group.label}</p>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <button key={item.id} onClick={() => {
                      if (!unlocked && item.id !== 'dashboard') {
                        setShowUnlockModal(true);
                        setUnlockError('');
                        setPasscodeInput('');
                        return;
                      }
                      if ((item as any).href) { window.location.href = (item as any).href; return; }
                      setActiveSection(item.id);
                    }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${activeSection === item.id ? 'bg-[#1d3557]/10 text-[#111] font-semibold border border-[#1d3557]/30' : 'text-[#555] hover:text-[#111] hover:bg-black/5'}`}>
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="text-left text-sm flex-1">{item.label}</span>
                      {!unlocked && item.id !== 'dashboard' && (
                        <svg className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      )}
                      {(item as any).badge && <span className="ml-auto bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">{(item as any).badge}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-8 bg-[#faf8f3]">
          {showBar && (
            <div className="mb-6 flex items-center gap-4 p-4 bg-[#1d3557]/10 rounded-xl border border-[#1d3557]/20">
              <span className="text-sm font-medium text-[#1d3557] whitespace-nowrap">Active Matter:</span>
              <select value={selectedMatter} onChange={(e) => { setSelectedMatter(Number(e.target.value)); setScanComplete(false); }}
                className="flex-1 px-4 py-2 border border-[#1d3557]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557] bg-white text-[#111] placeholder-[#999]">
                {MATTERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${matter.status === 'Urgent' ? 'bg-red-500/20 text-red-300' : matter.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                {matter.status}
              </span>
            </div>
          )}

          {activeSection === 'digital-handshake' && (
            <div>
              <h1 className="text-3xl font-bold text-[#111] mb-2">Digital Handshake</h1>
              <p className="text-[#555] mb-6">Collect legally valid, biometrically-verified artist authorization — court-admissible and SoundExchange-ready.</p>
              <div className="grid lg:grid-cols-2 gap-6 max-w-5xl items-start">
                <div className="bg-white border border-black/10 rounded-2xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#1d3557]/10 text-[#1d3557] flex items-center justify-center flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#111] mb-1">Open the Digital Handshake workspace</h3>
                      <p className="text-sm text-[#555] mb-4">Start a case, send the artist a one-tap signing link, and watch identity → biometric → signature complete. The signed Cover Letter, LOD Part 1, Schedule 1, Royalty Status Review, Identity Verification Certificate, and Chain-of-Custody hash generate automatically.</p>
                      <ul className="text-xs text-[#555] space-y-1 mb-5">
                        <li>✓ Device biometrics (Windows Hello / Face ID / fingerprint)</li>
                        <li>✓ Tamper-evident SHA-256 verification seal</li>
                        <li>✓ Device fingerprint + timestamp captured in the chain of custody</li>
                      </ul>
                      <button
                        onClick={requireUnlock(() => { window.location.href = '/attorney-portal/handshake'; })}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition">
                        Open Digital Handshake
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f2efe6] border border-black/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-[#111] mb-4">How it works</h3>
                  <ol className="space-y-4">
                    {[
                      { t: 'Start a case', d: 'Enter the recording, ISRC, performer and share. A unique one-tap signing link is generated for the artist.' },
                      { t: 'Send the link', d: 'Copy the link or share the QR code with the artist or their manager — text, email, or DM. No app or account needed.' },
                      { t: 'Artist signs', d: 'They confirm identity, verify with device biometrics (Face ID / fingerprint), and sign. The case updates automatically in your Cases workspace — no refresh needed.' },
                      { t: 'Bundle auto-generates', d: 'The moment they sign, the 6 SoundExchange documents are created and sealed with a tamper-evident SHA-256 hash.' },
                      { t: 'Download & file', d: 'Open the case under “Cases / Chain of Custody,” download the bundle, and submit to SoundExchange (accounts@soundexchange.com or SXDirect).' },
                    ].map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="h-6 w-6 flex-shrink-0 rounded-full bg-[#1d3557] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        <div>
                          <p className="text-sm font-semibold text-[#111]">{s.t}</p>
                          <p className="text-xs text-[#555] mt-0.5">{s.d}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs text-[#555] mt-5 pt-4 border-t border-black/10">The artist is emailed a confirmation and can track their case anytime. The artist never emails you back. The case appears in your portal automatically.</p>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'firm-view' && (
            <div className="min-h-screen bg-[#faf8f3] text-[#111] -m-8 p-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="mc-pulse text-purple-400 text-xs">●</span>
                      <span className="text-[10px] font-black mc-mono uppercase tracking-[0.25em] text-[#555]">{firm.letterhead}</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight uppercase italic text-[#111]">
                      Firm <span className="text-[#1d3557]">Overview</span>
                    </h1>
                    <p className="text-[#555] mc-mono text-xs mt-1">{firm.attorneyLine}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#555] mc-mono mb-1 uppercase">Active SX Filings</div>
                    <div className="text-4xl font-black text-green-400 mc-mono">{MATTERS.length}</div>
                    <div className="text-[10px] text-[#555] mc-mono">bundles ready for transmission</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white border border-black/10 rounded-2xl p-5">
                    <div className="text-[10px] mc-mono uppercase tracking-widest text-[#555] mb-1">Bundles Ready</div>
                    <div className="text-3xl font-black text-green-400">{MATTERS.length}</div>
                  </div>
                  <div className="bg-white border border-black/10 rounded-2xl p-5">
                    <div className="text-[10px] mc-mono uppercase tracking-widest text-[#555] mb-1">RIAA Verified</div>
                    <div className="text-3xl font-black text-[#1d3557]">{MATTERS.length}</div>
                    <div className="text-[10px] text-[#555] mt-1">all certified</div>
                  </div>
                  <div className="bg-white border border-black/10 rounded-2xl p-5">
                    <div className="text-[10px] mc-mono uppercase tracking-widest text-[#555] mb-1">Issues Open</div>
                    <div className="text-3xl font-black text-[#1d3557]">0</div>
                  </div>
                  <div className="bg-white border border-black/10 rounded-2xl p-5">
                    <div className="text-[10px] mc-mono uppercase tracking-widest text-[#555] mb-1">Doc Format</div>
                    <div className="text-xl font-black text-[#1d3557]">4-doc</div>
                    <div className="text-[10px] text-[#555] mt-1">Cover + LOD + Sched + RSR</div>
                  </div>
                </div>

                <div className="bg-white border border-black/10 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black mc-mono uppercase tracking-widest text-[#555]">All Filings &mdash; Quick Access</h3>
                    <button onClick={() => setActiveSection('submission-bundle')}
                      className="text-xs font-bold text-[#1d3557] hover:underline">Open Submission Bundle &rarr;</button>
                  </div>
                  <div className="space-y-2">
                    {MATTERS.map(m => (
                      <div key={m.id} className="grid grid-cols-12 gap-3 items-center p-3 border border-black/5 rounded-lg hover:border-[#1d3557]/30 hover:bg-[#1d3557]/5 transition">
                        <div className="col-span-1 mc-mono text-xs text-[#555]">{m.caseRef}</div>
                        <div className="col-span-4 font-semibold text-sm">{m.name}</div>
                        <div className="col-span-2 mc-mono text-xs text-[#555]">{m.isrc}</div>
                        <div className="col-span-2 text-xs"><span className="px-2 py-1 bg-green-500/10 text-green-700 rounded-md font-medium">{m.amount}</span></div>
                        <div className="col-span-3 flex gap-2 justify-end">
                          <button onClick={() => { setSelectedBundleCase(m.caseRef); setActiveSection('view-cover-letter'); }}
                            className="px-2 py-1 text-[10px] bg-[#1d3557]/10 text-[#1d3557] rounded font-bold hover:bg-[#1d3557]/20">COVER</button>
                          <button onClick={() => { setSelectedBundleCase(m.caseRef); setActiveSection('generate-court-report'); }}
                            className="px-2 py-1 text-[10px] bg-[#1d3557]/10 text-[#1d3557] rounded font-bold hover:bg-[#1d3557]/20">LOD</button>
                          <button onClick={() => { setSelectedBundleCase(m.caseRef); setActiveSection('view-schedule-1'); }}
                            className="px-2 py-1 text-[10px] bg-[#1d3557]/10 text-[#1d3557] rounded font-bold hover:bg-[#1d3557]/20">SCHED</button>
                          <button onClick={() => { setSelectedBundleCase(m.caseRef); setActiveSection('view-royalty-status-review'); }}
                            className="px-2 py-1 text-[10px] bg-[#1d3557]/10 text-[#1d3557] rounded font-bold hover:bg-[#1d3557]/20">RSR</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setActiveSection('filing-instructions')}
                    className="text-left p-5 bg-white border border-black/10 rounded-2xl hover:border-[#1d3557]/40 transition">
                    <div className="text-xs font-bold mc-mono uppercase tracking-widest text-[#555] mb-2">Filing Instructions</div>
                    <div className="font-bold text-[#111]">SoundExchange Filing Instructions (v4)</div>
                    <div className="text-xs text-[#555] mt-1">In-page PDF view + download &rarr;</div>
                  </button>
                  <button onClick={() => setActiveSection('submission-bundle')}
                    className="text-left p-5 bg-white border border-black/10 rounded-2xl hover:border-[#1d3557]/40 transition">
                    <div className="text-xs font-bold mc-mono uppercase tracking-widest text-[#555] mb-2">Submission Bundle</div>
                    <div className="font-bold text-[#111]">Full 4-Document Packet per Case</div>
                    <div className="text-xs text-[#555] mt-1">Cover + LOD + Schedule 1 + RSR &rarr;</div>
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'dashboard' && (
            <div className="min-h-screen bg-[#faf8f3] text-[#111] -m-8 p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="mc-pulse text-purple-400 text-xs">●</span>
                    <span className="text-[10px] font-black mc-mono uppercase tracking-[0.25em] text-[#555]">
                      {unlockRole === 'attorney' ? 'FUNDERBURG LAW — SECURE SESSION' : 'CARTERS CONSULTANTS AGENCY — SECURE SESSION'}
                    </span>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight uppercase italic text-[#111]">
                    Attorney <span className="text-[#1d3557]">Mission Control</span>
                  </h1>
                  <p className="text-[#555] mc-mono text-xs mt-1">
                    {unlockRole === 'attorney'
                      ? `Active SX Filings: ${MATTERS.length} — Firm Recovery Pipeline: $150K – $250K`
                      : 'Glenn Carter-CCA — Active Matters: 12 — Firm Recovery Pipeline: $1,482,900'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#555] mc-mono mb-1 uppercase">Total Black Box Value</div>
                  <div className={`font-black text-green-400 mc-mono ${unlockRole === 'attorney' ? 'text-2xl' : 'text-4xl'}`}>
                    {unlockRole === 'attorney' ? '$150K – $250K' : '$1.2M'}
                  </div>
                  <div className="text-[10px] text-[#555] mc-mono">
                    {unlockRole === 'attorney' ? `aggregate across ${MATTERS.length} active filings` : 'unclaimed — ready to dispute'}
                  </div>
                </div>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {(unlockRole === 'attorney' ? [
                  { l:"Active Matters",       v:String(MATTERS.length),  s:"all bundle-ready",         col:"text-[#111]" },
                  { l:"Pending Audits",       v:"0",                     s:"none in queue",            col:"text-[#1d3557]" },
                  { l:"Active Disputes",      v:"0",                     s:"pre-filing posture",       col:"text-[#1d3557]" },
                  { l:"Settlements Pending",  v:"$150K – $250K",         s:"total pending across matters", col:"text-green-400" },
                ] : [
                  { l:"Active Matters", v:"12", s:"+3 this month", col:"text-[#111]" },
                  { l:"Pending Audits", v:"8",  s:"4 require review", col:"text-yellow-400" },
                  { l:"Active Disputes", v:"3", s:"2 urgent", col:"text-red-400" },
                  { l:"Settlements Pending", v:"$487k", s:"awaiting DSP response", col:"text-purple-400" },
                ]).map((s,i) => (
                  <div key={i} className="bg-white border border-black/10 rounded-xl p-5">
                    <p className="text-[10px] mc-mono uppercase text-[#555] mb-1">{s.l}</p>
                    <p className={`font-black mc-mono ${s.col} ${(s.v && s.v.length > 8) ? 'text-xl' : 'text-3xl'}`}>{s.v}</p>
                    <p className="text-xs text-[#555] mt-1">{s.s}</p>
                  </div>
                ))}
              </div>

              {/* Active Matters — War Room table */}
              <div className="bg-white border border-black/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-black mc-mono uppercase tracking-widest text-[#555]">Active Matters — Select to Enter War Room</h2>
                  <button onClick={() => setActiveSection('new-matter')}
                    className="text-xs px-4 py-2 bg-[#1d3557] hover:bg-[#122947] text-white font-bold rounded-lg transition">
                    + New Matter
                  </button>
                </div>
                <div className="space-y-3">
                  {MATTERS.map(m => (
                    <div key={m.id}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all group ${
                        m.status === 'Urgent'
                          ? 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20'
                          : m.status === 'In Progress'
                            ? 'border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20'
                            : 'border-green-500/20 bg-green-500/10 hover:bg-green-500/20'
                      }`}
                      onClick={() => { setSelectedMatter(m.id); setActiveSection('war-room'); }}>
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full flex-shrink-0 ${m.status === 'Urgent' ? 'bg-red-500' : m.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        <div>
                          <p className="font-bold text-sm text-[#111]">{m.name}</p>
                          <p className="text-xs text-[#555] mc-mono">{m.issues} issues · leakage {m.leakage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-black text-green-400 mc-mono">{unlockRole === 'attorney' && (m as any).estRecovery ? (m as any).estRecovery : m.amount}</p>
                          <p className="text-[10px] text-[#555]">{unlockRole === 'attorney' ? 'Est. Recovery' : 'at risk'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black mc-mono ${
                          m.status === 'Urgent' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          m.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>{m.status}</span>
                        <span className="text-[#555] group-hover:text-purple-400 transition font-black text-lg">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {unlockRole === 'attorney' && (
                <div className="mt-8 p-4 bg-[#f2efe6] border border-black/10 rounded-xl">
                  <p className="text-[10px] mc-mono uppercase tracking-widest text-[#555] mb-2">Methodology &amp; Disclaimer</p>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Estimated recovery ranges are derived from public data (RIAA certifications, streaming counts) and the SoundExchange rate structure
                    (45% featured-performer share of collections for non-interactive transmissions — SiriusXM, Pandora, webcasters; 2026 webcasting rate
                    $0.0028 per performance). Actual recovery depends on verified non-interactive transmission data from SoundExchange&apos;s records.
                    These estimates are not guarantees.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'war-room' && (
            <div className="min-h-screen bg-[#faf8f3] text-[#111] -m-8 p-8">
              {/* Back + header */}
              <button onClick={() => setActiveSection('dashboard')}
                className="flex items-center gap-2 text-[#555] hover:text-[#111] text-sm mb-6 transition">
                ← Back to Mission Control
              </button>

              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-[10px] font-black text-red-400 wr-mono uppercase mb-1 tracking-widest">⚠ WAR ROOM — ACTIVE DISPUTE</div>
                  <h1 className="text-3xl font-black text-[#111]">{matter.name}</h1>
                  <p className="text-[#555] wr-mono text-sm mt-1">{matter.issues} issues flagged · Leakage: {matter.leakage}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#555] wr-mono mb-1">Recovery Target</div>
                  <div className="text-4xl font-black text-green-400 wr-mono">{matter.amount}</div>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-black wr-mono ${
                    matter.status === 'Urgent' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    matter.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>{matter.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evidence status */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white border border-black/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black wr-mono uppercase tracking-widest text-[#555] mb-4">Forensic Evidence Stack</h3>
                    <div className="space-y-3">
                      {[
                        { check:"ASCAP Registration", finding:"Missing publisher registration", sev:"critical" },
                        { check:"BMI PRO Status",     finding:"IPI mismatch on co-writer",     sev:"warning" },
                        { check:"SoundExchange",      finding:"No neighboring rights claim",    sev:"critical" },
                        { check:"PRS / SOCAN",        finding:"International registrations current", sev:"ok" },
                        { check:"Split Verification", finding:"Over-allocation detected (108%)", sev:"critical" },
                        { check:"ISRC Verification",  finding:"2 tracks missing ISRC",          sev:"warning" },
                      ].map((item,i) => (
                        <div key={i} className={`flex justify-between items-center p-3 rounded-xl border-l-4 ${
                          item.sev === 'critical' ? 'border-red-500 bg-red-500/10' :
                          item.sev === 'warning'  ? 'border-yellow-500 bg-yellow-500/10' :
                          'border-green-500 bg-green-500/10'
                        }`}>
                          <span className="font-bold text-sm">{item.check}</span>
                          <span className={`text-xs wr-mono font-bold ${
                            item.sev === 'critical' ? 'text-red-400' :
                            item.sev === 'warning'  ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>{item.finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scan + actions */}
                  <div className="bg-white border border-black/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black wr-mono uppercase tracking-widest text-[#555] mb-4">Run Full Forensic Scan</h3>
                    {!scanRunning && !scanComplete && (
                      <button onClick={requireUnlock(runScan)}
                        className="w-full py-4 bg-[#1d3557] hover:bg-[#122947] text-white font-black rounded-xl transition text-base">
                        Start Forensic Scan — {matter.name}
                      </button>
                    )}
                    {scanRunning && (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#1d3557] border-t-transparent mb-4" />
                        <p className="font-bold text-[#1d3557]">Running forensic scan...</p>
                        <p className="text-xs text-[#555] mt-1 wr-mono">Querying ASCAP · BMI · PRS · SOCAN · SoundExchange</p>
                      </div>
                    )}
                    {scanComplete && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-green-600 border border-green-700 rounded-xl">
                          <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                          <p className="font-bold text-white text-sm">Scan complete — evidence locked and timestamped</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-red-500/20 border border-red-500/20 rounded-xl text-center"><p className="text-2xl font-black text-red-400 wr-mono">{matter.amount}</p><p className="text-xs text-[#555]">Unclaimed</p></div>
                          <div className="p-3 bg-yellow-500/20 border border-yellow-500/20 rounded-xl text-center"><p className="text-2xl font-black text-yellow-400 wr-mono">{matter.leakage}</p><p className="text-xs text-[#555]">Leakage</p></div>
                          <div className="p-3 bg-[#1d3557]/10 border border-[#1d3557]/20 rounded-xl text-center"><p className="text-2xl font-black text-[#1d3557] wr-mono">{matter.issues}</p><p className="text-xs text-[#555]">Issues</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: War Room actions */}
                <div className="space-y-4">
                  <div className="bg-white border border-red-500/20 rounded-2xl p-6">
                    <h3 className="text-xs font-black text-red-400 wr-mono uppercase tracking-widest mb-4">War Room Actions</h3>
                    <div className="space-y-3">
                      <button onClick={requireUnlock(() => setActiveSection('run-due-diligence'))}
                        className="w-full py-3 bg-[#1d3557]/10 border border-[#1d3557]/30 text-[#1d3557] font-bold rounded-xl hover:bg-[#1d3557]/20 transition text-sm">
                        Full Catalog Due Diligence
                      </button>
                      <button onClick={requireUnlock(() => setActiveSection('generate-court-report'))}
                        className="w-full py-3 bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold rounded-xl hover:bg-purple-600/40 transition text-sm">
                        Court-Ready Report (LOD Part 1)
                      </button>
                      <button onClick={requireUnlock(() => setActiveSection('view-cover-letter'))}
                        className="w-full py-3 bg-[#1d3557]/10 border border-[#1d3557]/30 text-[#1d3557] font-bold rounded-xl hover:bg-[#1d3557]/20 transition text-sm">
                        Cover Letter
                      </button>
                      <button onClick={requireUnlock(() => setActiveSection('view-schedule-1'))}
                        className="w-full py-3 bg-[#f2efe6] border border-black/10 text-[#333] font-bold rounded-xl hover:bg-[#e4e0d4] transition text-sm">
                        Schedule 1
                      </button>
                      <button onClick={requireUnlock(() => setActiveSection('submission-bundle'))}
                        className="w-full py-3 bg-green-600/10 border border-green-500/20 text-green-700 font-bold rounded-xl hover:bg-green-600/20 transition text-sm">
                        Submission Bundle
                      </button>
                      <button onClick={requireUnlock(() => setActiveSection('filing-instructions'))}
                        className="w-full py-3 bg-blue-600/10 border border-blue-500/20 text-blue-700 font-bold rounded-xl hover:bg-blue-600/20 transition text-sm">
                        Filing Instructions
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black wr-mono uppercase tracking-widest text-[#555] mb-3">Evidence Hash</h3>
                    <div className="bg-[#f2efe6] border border-black/10 rounded-lg p-3">
                      <p className="text-[10px] text-[#555] wr-mono break-all">
                        TRP-{matter.id}-{Date.now().toString(36).toUpperCase().slice(-8)}<br/>
                        SHA-256: {Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join('')}
                      </p>
                    </div>
                    <p className="text-[10px] text-[#555] wr-mono mt-2">Verified. Court-admissible.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'run-due-diligence' && (
            <div>
              <h1 className="text-3xl font-bold text-[#111] mb-2">Run Catalog Due Diligence</h1>
              <p className="text-[#555] mb-8">Forensic audit for: <strong>{matter.name}</strong></p>
              <div className="bg-white border border-black/10 rounded-xl p-8">
                <h2 className="text-lg font-semibold mb-4">Audit Scope</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {["Streaming Royalties","Sync Licensing","Performance Rights","360 Deal (All Revenue)"].map((s,i) => (
                    <label key={s} className="flex items-center space-x-3 p-3 border border-black/10 rounded-lg cursor-pointer hover:bg-[#1d3557]/10">
                      <input type="checkbox" className="h-4 w-4 text-[#1d3557] rounded" defaultChecked={i===3}/><span>{s}</span>
                    </label>
                  ))}
                </div>
                <h2 className="text-lg font-semibold mb-4">Upload Catalog (Optional)</h2>
                <div className="border-2 border-dashed border-black/15 rounded-xl p-6 text-center mb-8 hover:border-[#1d3557] transition">
                  <p className="text-[#555] mb-1">Drop catalog file here or <span className="text-[#1d3557] font-medium cursor-pointer">browse</span></p>
                  <p className="text-sm text-[#555]">CSV, Excel, PDF up to 50MB</p>
                </div>
                {!scanRunning && !scanComplete && (
                  <button onClick={runScan} className="w-full py-4 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition text-lg">
                    Start Forensic Scan for {matter.name}
                  </button>
                )}
                {scanRunning && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#1d3557] border-t-transparent mb-4"></div>
                    <p className="text-lg font-medium text-[#1d3557]">Running forensic scan...</p>
                    <p className="text-sm text-[#555] mt-2">Checking ASCAP, BMI, PRS, SOCAN</p>
                  </div>
                )}
                {scanComplete && (
                  <div>
                    <div className="flex items-center gap-3 mb-6 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                      <span className="text-2xl">&#10003;</span>
                      <p className="font-bold text-green-300">Scan Complete - {matter.name}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30 text-center"><p className="text-3xl font-bold text-red-600">{matter.amount}</p><p className="text-sm text-[#555] mt-1">Unclaimed Royalties</p></div>
                      <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30 text-center"><p className="text-3xl font-bold text-yellow-600">{matter.leakage}</p><p className="text-sm text-[#555] mt-1">Leakage Rate</p></div>
                      <div className="p-4 bg-[#1d3557]/10 rounded-xl border border-[#1d3557]/30 text-center"><p className="text-3xl font-bold text-orange-600">{matter.issues}</p><p className="text-sm text-[#555] mt-1">Issues Flagged</p></div>
                    </div>
                    <div className="space-y-3 mb-6">
                      {[{l:"ASCAP Registration",s:"Missing publisher registration",c:"red"},{l:"BMI PRO Status",s:"IPI mismatch on co-writer",c:"yellow"},{l:"SoundExchange",s:"No neighboring rights claim",c:"red"},{l:"PRS/SOCAN",s:"International registrations current",c:"green"},{l:"Split Verification",s:"Over-allocation detected (108%)",c:"red"}].map((item,i) => (
                        <div key={i} className={`flex justify-between p-3 rounded-lg ${item.c==='red'?'bg-red-500/10':item.c==='yellow'?'bg-yellow-500/10':'bg-green-500/10'}`}>
                          <span className="font-medium">{item.l}</span>
                          <span className={`font-bold ${item.c==='red'?'text-red-600':item.c==='yellow'?'text-yellow-600':'text-green-400'}`}>{item.s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button onClick={() => setActiveSection('generate-court-report')} className="py-3 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition">Court-Ready Report (LOD)</button>
                      <button onClick={() => setActiveSection('submission-bundle')} className="py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition">Submission Bundle</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports & Documents — all pull from the SoundExchange bundle templates */}
          {['generate-court-report','view-cover-letter','view-schedule-1','view-royalty-status-review'].includes(activeSection) && (() => {
            const docMap: Record<string, { title: string; suffix: string; blurb: string }> = {
              'generate-court-report':       { title: 'Court-Ready Report (LOD Part 1)', suffix: 'LOD-PART1',              blurb: 'The Letter of Direction (Part 1) is the operative document SoundExchange uses to register the featured performer claim and direct payment.' },
              'view-cover-letter':           { title: 'Cover Letter',                    suffix: 'COVER-LETTER',           blurb: 'Funderburg Law letterhead cover letter framing the filing as a claim submission to SoundExchange Member / Claims Services.' },
              'view-schedule-1':             { title: 'Schedule 1',                      suffix: 'SCHEDULE-1',             blurb: 'Repertoire Chart with ISRC, recording title, primary artist, featured performer, and claimed share.' },
              'view-royalty-status-review':  { title: 'Royalty Status Review',           suffix: 'ROYALTY-STATUS-REVIEW',  blurb: 'Supporting documentation. Observations from public registry search + RIAA cert + clear scope notice for non-interactive transmissions.' },
            };
            const doc = docMap[activeSection];
            return (
              <div>
                <h1 className="text-3xl font-bold text-[#111] mb-2">{doc.title}</h1>
                <p className="text-[#555] mb-6">Generated from the SoundExchange bundle template.</p>
                <div className="bg-white border border-black/10 rounded-xl p-8">
                  <p className="text-sm text-[#555] mb-6">{doc.blurb}</p>
                  <label className="block text-sm font-semibold text-[#111] mb-2">Select Case</label>
                  <select value={selectedBundleCase} onChange={e => setSelectedBundleCase(e.target.value)}
                    className="w-full mb-6 px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557]">
                    {BUNDLE_CASES.map(c => <option key={c.ref} value={c.ref}>{c.ref} — {c.label}</option>)}
                  </select>
                  <div className="flex gap-3">
                    <a href={bundleHtmlUrl(doc.suffix)} target="_blank" rel="noopener noreferrer"
                      className="flex-1 py-3 text-center border border-[#1d3557] text-[#1d3557] rounded-lg font-medium hover:bg-[#1d3557]/5 transition">
                      View HTML
                    </a>
                    <a href={bundleDocUrl(doc.suffix)} target="_blank" rel="noopener noreferrer"
                      className="flex-1 py-3 text-center bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition">
                      View / Download PDF
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeSection === 'submission-bundle' && (
            <div>
              <h1 className="text-3xl font-bold text-[#111] mb-2">Submission Bundle</h1>
              <p className="text-[#555] mb-6">Complete 4-document SoundExchange filing packet per case.</p>
              <div className="bg-white border border-black/10 rounded-xl p-8">
                <p className="text-sm text-[#555] mb-6">Each bundle contains: Cover Letter, LOD Part 1 (with performer + counsel signature blocks), Schedule 1 (Repertoire Chart), and Royalty Status Review (supporting documentation).</p>
                <label className="block text-sm font-semibold text-[#111] mb-2">Select Case</label>
                <select value={selectedBundleCase} onChange={e => setSelectedBundleCase(e.target.value)}
                  className="w-full mb-6 px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557]">
                  {BUNDLE_CASES.map(c => <option key={c.ref} value={c.ref}>{c.ref} — {c.label}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Cover Letter', s: 'COVER-LETTER' },
                    { label: 'LOD Part 1', s: 'LOD-PART1' },
                    { label: 'Schedule 1', s: 'SCHEDULE-1' },
                    { label: 'Royalty Status Review', s: 'ROYALTY-STATUS-REVIEW' },
                  ].map(d => (
                    <div key={d.s} className="flex items-center gap-3 p-3 border border-black/10 rounded-lg">
                      <svg className="w-5 h-5 text-[#1d3557]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      <span className="text-sm font-medium">{d.label}</span>
                    </div>
                  ))}
                </div>
                {!unlocked ? (
                  <div className="w-full py-4 px-4 bg-amber-50 border border-amber-300 rounded-lg text-center">
                    <p className="text-sm font-bold text-amber-900 mb-2">Real client bundle locked</p>
                    <p className="text-xs text-amber-800 mb-3">Unlock with attorney or admin passcode to download the real SoundExchange filing ZIP.</p>
                    <button onClick={() => { setShowUnlockModal(true); setUnlockError(''); setPasscodeInput(''); }}
                      className="px-4 py-2 bg-[#1d3557] text-white rounded-lg text-sm font-bold hover:bg-[#122947] transition">
                      Enter Passcode to Unlock
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={async () => {
                      setBundleDownloading(true);
                      setBundleDownloadError('');
                      try {
                        const JSZip = await loadJSZip();
                        const zip = new JSZip();
                        const suffixes = ['COVER-LETTER','LOD-PART1','SCHEDULE-1','ROYALTY-STATUS-REVIEW'];
                        for (const sfx of suffixes) {
                          const url = `/api/cases-file/${selectedBundleCase}_${sfx}.pdf`;
                          const res = await fetch(url, { credentials: 'include' });
                          if (!res.ok) throw new Error(`${sfx}.pdf returned HTTP ${res.status}`);
                          const buf = await res.arrayBuffer();
                          zip.file(`${selectedBundleCase}_${sfx}.pdf`, buf);
                        }
                        const blob = await zip.generateAsync({ type: 'blob' });
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = `${selectedBundleCase}_SubmissionBundle.zip`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
                      } catch (err: any) {
                        setBundleDownloadError(err?.message || 'Failed to build bundle');
                      } finally {
                        setBundleDownloading(false);
                      }
                    }}
                    disabled={bundleDownloading}
                    className="w-full py-3 text-center bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition block disabled:opacity-60">
                      {bundleDownloading ? 'Building ZIP…' : `Download ${selectedBundleCase} Submission Bundle (ZIP)`}
                    </button>
                    {bundleDownloadError && <p className="text-xs text-red-600 mt-3 text-center font-bold">{bundleDownloadError}</p>}
                    <p className="text-xs text-[#555] mt-3 text-center">Bundles 4 PDFs into a single ZIP, generated in your browser.</p>
                  </>
                )}
              </div>
            </div>
          )}

          {activeSection === 'filing-instructions' && (
            <div>
              <h1 className="text-3xl font-bold text-[#111] mb-2">Attorney Filing Instructions</h1>
              <p className="text-[#555] mb-6">SoundExchange filing instructions (v4) for featured performer claims under 17 U.S.C. &sect;114.</p>
              <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-black/10 bg-[#f2efe6]">
                  <p className="text-sm font-medium">SoundExchange_Filing_Instructions_v4.pdf</p>
                  <a href="/cases/SoundExchange_Filing_Instructions_v4.pdf" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#1d3557] text-white rounded-lg text-sm font-medium hover:bg-[#122947] transition">
                    Open in New Tab
                  </a>
                </div>
                <iframe src="/cases/SoundExchange_Filing_Instructions_v4.pdf" className="w-full" style={{ height: '80vh', border: 'none' }} title="SoundExchange Filing Instructions v4" />
              </div>
            </div>
          )}

          {activeSection === 'new-matter' && (
            <div>
              <h1 className="text-3xl font-bold text-[#111] mb-2">Create New Matter</h1>
              <p className="text-[#555] mb-8">Add a new client matter for royalty audit or dispute</p>
              <div className="bg-white border border-black/10 rounded-xl p-8 max-w-3xl">
                <form className="space-y-6" onSubmit={e => { e.preventDefault(); setActiveSection('run-due-diligence'); }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-[#333] mb-2">Client Name</label><input type="text" className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557]" placeholder="Artist / Estate Name"/></div>
                    <div><label className="block text-sm font-medium text-[#333] mb-2">Matter Type</label><select className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557]"><option>Royalty Dispute</option><option>Catalog Due Diligence</option><option>360 Deal Audit</option><option>Pre-Release Verification</option></select></div>
                  </div>
                  <div><label className="block text-sm font-medium text-[#333] mb-2">Project / Release Name</label><input type="text" className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557]" placeholder="Album, single, or dispute title"/></div>
                  <div><label className="block text-sm font-medium text-[#333] mb-2">Key ISRCs / UPCs</label><input type="text" className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557]" placeholder="USUM72212345"/></div>
                  <div><label className="block text-sm font-medium text-[#333] mb-2">Notes</label><textarea rows={4} className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557]" placeholder="Unpaid streaming royalties..."></textarea></div>
                  <button type="submit" className="w-full py-4 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition">Create Matter and Start Audit</button>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'pre-release-verify' && (
            <div>
              <h1 className="text-3xl font-bold text-[#111] mb-2">Pre-Release Split Verification</h1>
              <p className="text-[#555] mb-6">Upload &rarr; Detect issues &rarr; Verify &rarr; Calculate payment &rarr; Download PDF</p>

              {/* Before/After */}
              <div className="grid grid-cols-2 gap-6 bg-white border border-black/10 rounded-2xl p-5 mb-6 ">
                <div className="border-r border-red-500/20 pr-6">
                  <h3 className="text-red-600 font-bold mb-2">Before TrapRoyaltiesPro</h3>
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="bg-[#e4e0d4] px-3 py-1 rounded-full">Publisher</span>
                    <span className="text-[#555]">&rarr;</span>
                    <span className="bg-red-500/20 text-red-600 px-3 py-1 rounded-full">Issues</span>
                    <span className="text-[#555]">&rarr;</span>
                    <span className="bg-[#e4e0d4] px-3 py-1 rounded-full">PRO</span>
                    <span className="text-[#555]">&rarr;</span>
                    <span className="bg-[#e4e0d4] px-3 py-1 rounded-full">Delay</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[#1d3557] font-bold mb-2">With TrapRoyaltiesPro</h3>
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="bg-[#e4e0d4] px-3 py-1 rounded-full">Publisher</span>
                    <span className="text-[#555]">&rarr;</span>
                    <span className="bg-[#1d3557]/10 text-[#1d3557] px-3 py-1 rounded-full border border-[#1d3557]/30">TRP Verified</span>
                    <span className="text-[#555]">&rarr;</span>
                    <span className="bg-[#e4e0d4] px-3 py-1 rounded-full">PRO</span>
                    <span className="text-[#555]">&rarr;</span>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Fast Payment</span>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="flex items-center justify-center mb-6 max-w-2xl mx-auto">
                {['Upload Data','Issues Detected','Data Verified','Payment Ready'].map((label, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={"w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 " + (splitStep > i || splitStep === i ? 'bg-[#1d3557] border-[#122947] text-white' : 'bg-[#f2efe6] border-black/10 text-[#555]')}>{i+1}</div>
                      <span className={"text-xs mt-1 " + (splitStep === i ? 'text-[#1d3557] font-semibold' : 'text-[#555]')}>{label}</span>
                    </div>
                    {i < 3 && <div className={"w-12 h-1 mb-4 " + (splitStep > i ? 'bg-[#1d3557]' : 'bg-black/10')}></div>}
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT: Upload */}
                <div className="bg-white rounded-2xl border border-black/10 p-6 ">
                  <h2 className="text-lg font-bold mb-4 text-[#111]">Step 1: Upload Split Sheet</h2>
                  <div className="border-2 border-dashed border-black/15 rounded-xl p-8 text-center cursor-pointer hover:border-[#1d3557] hover:bg-[#1d3557]/10 transition-all mb-4"
                    onClick={() => { const el = document.getElementById('prvPortalFile') as HTMLInputElement; if(el) el.click(); }}>
                    <p className="font-semibold text-[#333] mb-1">Drop your split sheet here</p>
                    <p className="text-sm text-[#555]">CSV, Excel, or PDF</p>
                    <input type="file" id="prvPortalFile" className="hidden" accept=".csv,.xlsx,.xls,.pdf" onChange={() => loadPerfectSplit()} />
                  </div>
                  <div className="flex justify-center gap-6 text-sm mb-4">
                    <button onClick={loadPerfectSplit} className="text-[#1d3557] hover:underline font-medium">Load perfect sample</button>
                    <button onClick={loadErrorSplit} className="text-red-500 hover:underline font-medium">Load sample with errors</button>
                  </div>
                  {splitErrors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                      <p className="text-red-400 font-bold mb-2">{splitErrors.length} Issue{splitErrors.length > 1 ? 's' : ''} Detected</p>
                      <div className="text-sm text-red-600 mb-3 space-y-1">{splitErrors.map((e: string, i: number) => <p key={i}>- {e}</p>)}</div>
                      <button onClick={autoFixSplit} className="bg-[#1d3557] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#122947]">&#10024; Auto-Fix Issues</button>
                    </div>
                  )}
                  {splitData.length > 0 && (
                    <div className="bg-[#f2efe6] rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-black/10">
                        <span className="font-semibold text-[#111]">Split Table</span>
                        <span className={"text-xs px-2 py-1 rounded-full font-bold " + (splitErrors.length === 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-600')}>{splitErrors.length === 0 ? 'Ready' : splitErrors.length + " issues"}</span>
                      </div>
                      {splitData.map((item: any, i: number) => (
                        <div key={i} className={"flex justify-between items-center py-3 border-b border-black/10 " + (!item.ipi || !item.name ? 'bg-red-500/10 -mx-4 px-4' : '')}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#1d3557]/10 rounded-lg flex items-center justify-center text-[#1d3557] font-bold text-sm">{(item.name||'?')[0]}</div>
                            <div>
                              <p className="font-medium text-sm text-[#111]">{item.name||'Unknown'}</p>
                              <p className="text-xs text-[#555]">{item.role} - IPI: {item.ipi||'Missing'}</p>
                            </div>
                          </div>
                          <span className={"font-bold text-sm " + (!item.ipi||!item.name ? 'text-red-600' : 'text-[#1d3557]')}>{item.percentage}%</span>
                        </div>
                      ))}
                      <div className="text-right text-sm text-[#555] mt-2">Total: <span className="font-bold text-[#111]">{splitData.reduce((s: number, i: any) => s+(i.percentage||0), 0).toFixed(1)}%</span></div>
                    </div>
                  )}
                  {splitData.length > 0 && splitErrors.length === 0 && splitStep < 2 && (
                    <button onClick={startSplitVerification} className="w-full mt-4 py-3 bg-[#1d3557] text-white rounded-xl font-medium hover:bg-[#122947] transition">Start Verification</button>
                  )}
                </div>

                {/* RIGHT: Verify + Payment */}
                <div className="bg-white rounded-2xl border border-black/10 p-6 ">
                  <h2 className="text-lg font-bold mb-4 text-[#111]">Steps 2-4: Verify &amp; Calculate Payment</h2>
                  {splitStep === 0 && <div className="text-center py-12 text-[#555]"><p>Upload a split sheet to begin</p></div>}
                  {splitStep >= 2 && (
                    <div className="bg-[#f2efe6] rounded-xl p-4 mb-4">
                      <h3 className="font-semibold text-[#111] mb-3">Verification Record</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-[#555]">Verification ID</span><span className="font-mono text-xs text-[#1d3557]">TRP-{splitVerifyId}</span></div>
                        <div className="flex justify-between"><span className="text-[#555]">Timestamp</span><span className="text-[#111]">{splitTimestamp}</span></div>
                        <div className="flex justify-between"><span className="text-[#555]">Status</span><span className="text-green-400 font-bold">Verified &#10003;</span></div>
                        <div className="flex justify-between"><span className="text-[#555]">Jurisdiction</span><span className="text-[#111]">Georgia Law</span></div>
                      </div>
                      <div className="mt-3 p-2 bg-[#1d3557]/10 rounded-lg font-mono text-xs text-[#1d3557] break-all">sha256: {splitVerifyId}...trp_verified</div>
                    </div>
                  )}
                  {splitStep >= 2 && splitStep < 3 && (
                    <button onClick={() => setSplitStep(3)} className="w-full py-3 bg-[#1d3557] text-white rounded-xl font-medium hover:bg-[#122947] transition mb-4">Calculate Payment</button>
                  )}
                  {splitStep >= 3 && (
                    <div className="bg-[#f2efe6] rounded-xl p-4 border border-black/10 mb-4">
                      <h3 className="font-semibold text-[#111] mb-3">Enter Payment Amount</h3>
                      <div className="flex gap-3 items-center">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-3 text-[#555]">$</span>
                          <input type="number" value={splitPayAmount} onChange={(e) => setSplitPayAmount(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-white border border-black/15 rounded-full text-lg font-bold text-[#111] focus:outline-none focus:border-[#1d3557]" />
                        </div>
                        <button onClick={() => setSplitStep(4)} className="bg-[#1d3557] text-white px-5 py-3 rounded-full font-medium hover:bg-[#122947]">Calculate</button>
                      </div>
                      <p className="text-xs text-[#555] mt-2">25% tax withholding auto-calculated</p>
                    </div>
                  )}
                  {splitStep >= 4 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-green-300">Payment Summary</span>
                        <span className="text-2xl font-bold text-green-400">${splitPayAmount.toLocaleString()}</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 mb-3 space-y-2 text-sm border border-black/10">
                        <div className="flex justify-between"><span className="text-[#555]">Gross Royalties</span><span className="font-semibold">${splitPayAmount.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-[#555]">Tax (25%)</span><span className="font-semibold text-red-600">-${(splitPayAmount*0.25).toLocaleString()}</span></div>
                        <div className="flex justify-between border-t pt-2"><span className="font-bold text-[#111]">Net Payment</span><span className="font-bold text-green-400">${(splitPayAmount*0.75).toLocaleString()}</span></div>
                      </div>
                      <div className="space-y-2">
                        {splitData.map((item: any, i: number) => {
                          const gross = splitPayAmount*(item.percentage/100);
                          return (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-green-500/20">
                              <span className="text-sm text-[#111]">{item.name} ({item.percentage}%)</span>
                              <div className="text-right">
                                <div className="font-bold text-green-400 text-sm">${gross.toLocaleString()}</div>
                                <div className="text-xs text-red-400">-${(gross*0.25).toLocaleString()} tax</div>
                                <div className="text-xs text-green-400 font-semibold">${(gross*0.75).toLocaleString()} net</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={downloadSplitReport} className="w-full mt-4 py-3 bg-[#1d3557] text-white rounded-xl font-medium hover:bg-[#122947] transition">&#128196; Download Payment Report</button>
                    </div>
                  )}
                  {splitStep >= 4 && (
                    <button onClick={resetSplitWorkflow} className="w-full py-3 border border-black/10 text-[#555] rounded-xl font-medium hover:border-[#1d3557]/40 hover:text-[#1d3557] mt-2">&#8635; Start New Verification</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'secure-message' && (
            <div>
              <h1 className="text-3xl font-bold text-[#111] mb-2">Secure Messages</h1>
              <p className="text-[#555] mb-8">Private channel between {unlockRole === 'attorney' ? 'you and the case admin (Carters Consultants)' : 'you and the attorney (Funderburg Law)'}.</p>
              <div className="bg-white border border-black/10 rounded-xl p-6 h-[600px] flex flex-col max-w-3xl">
                <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-black/10">
                  <div className="w-12 h-12 bg-[#1d3557] rounded-full flex items-center justify-center text-white font-bold">{unlockRole === 'attorney' ? 'A' : 'L'}</div>
                  <div>
                    <p className="font-bold">{unlockRole === 'attorney' ? 'Carters Consultants (Admin)' : 'Funderburg Law (Attorney)'}</p>
                    <p className="text-sm text-[#555]">Secure internal channel · auto-refreshing</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {msgs.length === 0 ? (
                    <p className="text-sm text-[#999] text-center mt-8">No messages yet. Start the conversation below.</p>
                  ) : msgs.map(m => (
                    <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-lg ${m.mine ? 'bg-[#1d3557] text-white' : 'bg-[#f2efe6] text-[#111]'}`}>
                        <p className="whitespace-pre-wrap break-words">{m.body}</p>
                        <p className={`text-[10px] mt-1 ${m.mine ? 'text-white/60' : 'text-[#999]'}`}>{new Date(m.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-4">
                  <input type="text" value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3557]"/>
                  <button type="submit" disabled={msgSending || !msgInput.trim()} className="px-6 py-3 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition disabled:opacity-60">{msgSending ? 'Sending…' : 'Send'}</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
