"use client";

import { useState, useEffect } from "react";
import { FileText, Link2, LoaderCircle } from "lucide-react";
import type { Language } from "@/lib/schema";
import { ui } from "@/lib/translations";

export function AnalysisLoading({ language, demo }: { language: Language; demo: boolean }) {
  const [index, setIndex] = useState(0);
  const t = ui[language];
  useEffect(() => { const timer = setInterval(() => setIndex(i => (i+1)%4), 6500); return () => clearInterval(timer); }, []);
  const messages = [t.loadingPrepare, t.loadingOrganize, t.loadingSources, t.loadingExplanation];
  return <div className="analysis-loading" role="status" aria-live="polite"><div className="loading-graphic" aria-hidden="true"><span><FileText size={28}/></span><div className="loading-path"><i/><i/><i/></div><span><Link2 size={27}/></span></div><span className="pill">{demo ? t.demoBadge : t.liveBadge}</span><h1>{t.loadingTitle}</h1><p>{demo ? t.demoNote : t.loadingDescription}</p><div className="loading-status"><LoaderCircle size={17} className="spinner"/>{demo ? t.processing : messages[index]}</div><div className="loading-indeterminate" aria-hidden="true"><span/></div></div>;
}
