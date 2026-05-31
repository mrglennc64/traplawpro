"use client";

import { useEffect, useState } from "react";
import { ARTIST_TIMELINE, statusStepIndex } from "@/lib/artist-status";

type CaseRow = { token: string | null; caseRef: string; recordingTitle: string; status: string; share: number };

export default function ArtistCasesPage() {
  const [rows, setRows] = useState<CaseRow[] | null>(null);
  const [unauth, setUnauth] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/artist/cases");
      if (res.status === 401) { setUnauth(true); return; }
      const data = await res.json();
      setRows(data.cases || []);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#111]">
      <header className="bg-white border-b border-black/10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-xl font-bold text-[#1d3557]">TrapLawPro</span>
          <span className="px-3 py-1 bg-[#1d3557]/10 text-[#1d3557] text-xs rounded-full font-medium">Artist Dashboard</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Your cases</h1>
        <p className="text-[#555] text-sm mb-6">Track every royalty claim filed on your behalf.</p>

        {unauth ? (
          <div className="bg-white border border-black/10 rounded-xl p-8 text-center">
            <p className="text-[#555] text-sm mb-4">Please sign in to view your cases.</p>
            <a href="/artist/login" className="inline-block px-5 py-3 bg-[#1d3557] text-white rounded-lg font-medium hover:bg-[#122947] transition">Sign in</a>
          </div>
        ) : !rows ? (
          <p className="text-[#555] text-sm">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="bg-white border border-black/10 rounded-xl p-8 text-center text-[#555] text-sm">No cases yet. Your attorney will share a signing link when a claim is started.</div>
        ) : (
          <div className="space-y-3">
            {rows.map((c) => {
              const step = statusStepIndex(c.status);
              return (
                <a key={c.caseRef} href={c.token ? `/artist/cases/${c.token}` : "#"}
                  className="block bg-white border border-black/10 rounded-xl p-5 hover:border-[#1d3557]/40 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#555]">{c.caseRef}</p>
                      <p className="font-bold text-[#111]">{c.recordingTitle}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1d3557]/10 text-[#1d3557]">{ARTIST_TIMELINE[step].label}</span>
                  </div>
                  <div className="mt-3 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${((step + 1) / ARTIST_TIMELINE.length) * 100}%` }} />
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
