"use client";

import { useEffect, useState } from "react";
import { ARTIST_TIMELINE, statusStepIndex, DOC_LABELS } from "@/lib/artist-status";

type CaseView = {
  caseRef: string;
  recordingTitle: string;
  isrc: string;
  performerName: string;
  performerRole: string;
  share: number;
  status: string;
  attorney: { name: string; firm: string } | null;
  signed: boolean;
  hashAnchor: string | null;
  documents: { type: string; downloadUrl: string }[];
  notifications: { message: string; createdAt: string }[];
};

export default function ArtistCasePage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<CaseView | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/artist/cases/${params.token}`);
      if (!res.ok) { setNotFound(true); return; }
      setData(await res.json());
    })();
  }, [params.token]);

  if (notFound) {
    return (
      <Frame>
        <div className="text-center py-12">
          <p className="text-xl font-bold text-[#111] mb-2">Case not found</p>
          <p className="text-[#555] text-sm">This link is invalid, expired, or the case is no longer shared.</p>
        </div>
      </Frame>
    );
  }
  if (!data) return <Frame><p className="text-center text-[#555] py-12">Loading your case…</p></Frame>;

  const step = statusStepIndex(data.status);

  return (
    <Frame>
      {/* Summary */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#555] mb-1">{data.caseRef}</p>
        <h1 className="text-2xl font-bold text-[#111]">{data.recordingTitle}</h1>
        {data.attorney && <p className="text-sm text-[#555] mt-1">Represented by {data.attorney.name} · {data.attorney.firm}</p>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Stat label="ISRC" value={data.isrc} mono />
        <Stat label="Role" value={data.performerRole} />
        <Stat label="Your share" value={`${data.share}%`} />
        <Stat label="Status" value={ARTIST_TIMELINE[step].label} />
      </div>

      {/* Timeline */}
      <Section title="Progress">
        <ol className="relative border-l-2 border-black/10 ml-2 space-y-4">
          {ARTIST_TIMELINE.map((s, i) => {
            const done = i <= step;
            const current = i === step;
            return (
              <li key={s.key} className="ml-4">
                <span className={`absolute -left-[9px] h-4 w-4 rounded-full border-2 ${done ? "bg-green-500 border-green-500" : "bg-white border-black/20"}`} />
                <span className={`text-sm ${current ? "font-bold text-[#1d3557]" : done ? "text-[#111]" : "text-[#999]"}`}>{s.label}</span>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* Documents */}
      {data.documents.length > 0 && (
        <Section title="Your documents">
          <div className="space-y-2">
            {data.documents.map((d) => (
              <a key={d.type} href={d.downloadUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-between px-4 py-3 bg-[#f2efe6] border border-black/10 rounded-lg hover:bg-[#ebe7da] transition">
                <span className="text-sm text-[#111]">{DOC_LABELS[d.type] ?? d.type}</span>
                <span className="text-xs text-[#1d3557] font-semibold">Open PDF →</span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Verification seal */}
      {data.hashAnchor && (
        <Section title="Verification seal">
          <div className="p-3 bg-[#f2efe6] border border-black/10 rounded-lg">
            <p className="text-xs text-[#555] mb-1">Your authorization is sealed with a tamper-evident SHA-256 hash:</p>
            <code className="text-[10px] text-[#333] break-all">{data.hashAnchor}</code>
          </div>
        </Section>
      )}

      {/* Notifications */}
      {data.notifications.length > 0 && (
        <Section title="Updates">
          <ul className="space-y-2">
            {data.notifications.map((n, i) => (
              <li key={i} className="text-sm text-[#333] flex gap-2">
                <span className="text-[#1d3557]">•</span>{n.message}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </Frame>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1">{label}</p>
      <p className={`text-sm font-semibold text-[#111] ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-[#111] uppercase tracking-wide mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#111]">
      <header className="bg-white border-b border-black/10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-xl font-bold text-[#1d3557]">TrapLawPro</span>
          <span className="px-3 py-1 bg-[#1d3557]/10 text-[#1d3557] text-xs rounded-full font-medium">Artist Dashboard</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 shadow-sm">{children}</div>
        <p className="text-center text-xs text-[#999] mt-4">Your case, your royalties — tracked end to end.</p>
      </main>
    </div>
  );
}
