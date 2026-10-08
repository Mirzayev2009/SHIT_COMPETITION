"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { DocumentInput } from "./document-input";
import { AnalysisLoading } from "./analysis-loading";
import { ResultsDashboard } from "@/components/results/results-dashboard";
import { DEMO_DOCUMENT, demoAnalyses, isDemoDocument } from "@/lib/demo-data";
import { ui } from "@/lib/translations";
import { MAX_DOCUMENT_LENGTH, careMapAnalysisSchema, type CareMapAnalysis, type Language } from "@/lib/schema";

export function Workspace() {
  const params = useSearchParams();
  const initialLanguage = params.get("lang");
  const [language, setLanguage] = useState<Language>(initialLanguage === "uz" || initialLanguage === "ru" ? initialLanguage : "en");
  const [text, setText] = useState(params.get("demo") === "true" ? DEMO_DOCUMENT : "");
  const [analysis, setAnalysis] = useState<CareMapAnalysis | null>(null);
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null);
  const [error, setError] = useState("");
  const [liveAvailable, setLiveAvailable] = useState<boolean | null>(null);
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const processing = useRef(false);
  const demo = isDemoDocument(text);
  const t = ui[language];
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => { const check = new AbortController(); fetch("/api/analyze", { signal: check.signal }).then(res => res.json()).then(data => setLiveAvailable(data.liveAvailable === true)).catch(() => {}); return () => { check.abort(); controller.current?.abort(); }; }, []);

  function updateText(value: string) { setText(value); setConsent(false); setError(""); }
  function reset() { requestId.current++; controller.current?.abort(); processing.current = false; setBusy(false); setPendingLanguage(null); setAnalysis(null); setText(""); setConsent(false); setError(""); window.scrollTo({ top: 0 }); }
  async function analyze(nextLanguage: Language = language) {
    if (processing.current) return;
    const copy = ui[nextLanguage];
    if (!text.trim()) { setError(copy.inputEmpty); return; }
    if (text.length > MAX_DOCUMENT_LENGTH) { setError(copy.inputTooLong); return; }
    if (!demo && liveAvailable === false) { setError(copy.unconfiguredError); return; }
    if (!demo && !consent) { setError(copy.consentRequired); return; }
    setError(""); setBusy(true); setPendingLanguage(nextLanguage); processing.current = true;
    const id = ++requestId.current;
    const abort = new AbortController(); controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 50_000);
    try {
      let result: CareMapAnalysis;
      if (demo) { await new Promise(resolve => setTimeout(resolve, 650)); result = demoAnalyses[nextLanguage]; }
      else {
        const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, language: nextLanguage, consent: true }), signal: abort.signal });
        const data = await response.json();
        if (!response.ok) { if (data.code === "NOT_CONFIGURED") { setLiveAvailable(false); throw new Error(copy.unconfiguredError); } throw new Error(typeof data.error === "string" ? data.error : copy.genericError); }
        result = careMapAnalysisSchema.parse(data.analysis);
      }
      if (id !== requestId.current) return;
      setAnalysis(result); setMode(demo ? "demo" : "live"); setLanguage(nextLanguage); window.scrollTo({ top: 0 });
    } catch (e) { if (id === requestId.current) setError(e instanceof Error && e.name !== "AbortError" ? e.message : copy.genericError); }
    finally { clearTimeout(timeout); if (id === requestId.current) { processing.current = false; setBusy(false); setPendingLanguage(null); } }
  }
  function changeLanguage(next: Language) { if (busy || next === language) return; setError(""); if (analysis && mode === "live") { void analyze(next); } else { setLanguage(next); if (analysis) setAnalysis(demoAnalyses[next]); } }

  return <div className="workspace-page"><Header workspace language={language} onLanguageChange={changeLanguage} disabled={busy}/><main id="main-content" className="workspace-shell">
    {busy ? <><Button variant="ghost" size="sm" onClick={reset}><ArrowLeft size={16}/>{t.reset}</Button><AnalysisLoading language={pendingLanguage ?? language} demo={demo}/></> : analysis ? <>{error && <div role="alert" className="input-error results-error"><Info size={18}/>{error}</div>}<ResultsDashboard analysis={analysis} document={text} language={language} mode={mode} onReset={reset}/></> : <DocumentInput text={text} onTextChange={updateText} language={language} onLanguageChange={changeLanguage} onDemo={() => updateText(DEMO_DOCUMENT)} onAnalyze={() => void analyze()} demo={demo} consent={consent} onConsent={setConsent} liveAvailable={liveAvailable} error={error} onError={setError}/>}
  </main></div>;
}
