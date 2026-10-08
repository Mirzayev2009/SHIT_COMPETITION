"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, Copy, FileText, Link2, MessageCircleQuestion, Printer, ShieldCheck } from "lucide-react";
import type { CareMapAnalysis, Language } from "@/lib/schema";
import { ui } from "@/lib/translations";
import { SummaryCard } from "./summary-card";
import { ActionsTimeline } from "./actions-timeline";
import { SourceInspector } from "./source-inspector";
import { UnderstandingQuiz } from "./understanding-quiz";
import "./results.css";

type ResultsDashboardProps = {
  analysis: CareMapAnalysis;
  document: string;
  language: Language;
  mode: "demo" | "live";
  onReset: () => void;
};

export function ResultsDashboard({ analysis, document, language, mode, onReset }: ResultsDashboardProps) {
  const t = ui[language];
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  function inspectSource(quote?: string) {
    setSelectedQuote(quote ?? null);
    if (window.matchMedia("(max-width: 1023px)").matches) dialogRef.current?.showModal();
  }

  function toggleAction(id: string) {
    setChecked((previous) => { const next = new Set(previous); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  async function copyQuestions() {
    try {
      await navigator.clipboard.writeText(analysis.questionsForDoctor.map((question, index) => `${index + 1}. ${question}`).join("\n"));
      setCopyStatus("success");
    } catch { setCopyStatus("error"); }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyStatus("idle"), 4000);
  }

  return (
    <div className="care-results">
      <div className="care-results-top">
        <div className="care-results-intro"><h1>{t.resultsTitle}</h1><p>{t.resultsSubtitle}</p><span className={`care-mode-pill${mode === "demo" ? " is-demo" : ""}`}><span aria-hidden="true" />{mode === "demo" ? t.demoBadge : t.liveBadge}</span></div>
        <div className="care-results-tools"><button type="button" className="button button-secondary" onClick={() => window.print()}><Printer size={16} aria-hidden="true" />{t.print}</button><button type="button" className="button button-secondary" onClick={copyQuestions} disabled={!analysis.questionsForDoctor.length}>{copyStatus === "success" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copyStatus === "success" ? t.copied : t.copyQuestions}</button><button type="button" className="care-new-document" onClick={onReset}><ArrowLeft size={14} aria-hidden="true" />{t.newDocument}</button></div>
      </div>
      {mode === "demo" && <p className="care-demo-note">{t.demoNote}</p>}
      <div className="care-mobile-source"><button type="button" className="button button-secondary" onClick={() => inspectSource()}><FileText size={16} aria-hidden="true" />{t.sourceOriginal}<ArrowLeft size={15} className="care-mobile-source-arrow" aria-hidden="true" /></button></div>
      <p className={`care-copy-status${copyStatus === "error" ? " is-error" : ""}`} aria-live="polite" role="status">{copyStatus === "error" ? t.copyFailed : copyStatus === "success" ? t.copied : ""}</p>
      <div className="care-results-grid">
        <div className="care-results-main">
          <SummaryCard summary={analysis.summary} heading={t.summaryTitle} />
          <ActionsTimeline actions={analysis.actions} language={language} checked={checked} onToggle={toggleAction} onInspect={inspectSource} document={document} />
          {analysis.uncertainties.length > 0 && <section className="care-uncertainties" aria-labelledby="care-uncertainties-heading"><div className="care-uncertainty-heading"><MessageCircleQuestion size={20} strokeWidth={1.7} aria-hidden="true" /><h2 id="care-uncertainties-heading">{t.uncertaintiesTitle}</h2></div><p className="care-uncertainty-intro">{t.uncertaintiesDescription}</p><ul>{analysis.uncertainties.map((item, index) => <li key={index}><p>{item.explanation}</p>{item.sourceQuote && document.includes(item.sourceQuote) && <button type="button" className="care-source-link" onClick={() => inspectSource(item.sourceQuote!)}><Link2 size={14} aria-hidden="true" />{t.viewOriginal}</button>}</li>)}</ul></section>}
          <section className="care-panel care-terms" aria-labelledby="care-terms-heading"><div className="care-section-heading"><div><h2 id="care-terms-heading">{t.termsTitle}</h2><p>{t.termsDescription}</p></div></div>{analysis.terms.length === 0 ? <p className="care-empty">{t.noTerms}</p> : <div className="care-term-list">{analysis.terms.map((term, index) => <details className="care-term" key={index}><summary><span>{term.term}</span><ChevronDown size={18} aria-hidden="true" /></summary><div className="care-term-content"><p>{term.explanation}</p><blockquote>{term.sourceQuote}</blockquote><button type="button" className="care-source-link" disabled={!document.includes(term.sourceQuote)} onClick={() => inspectSource(term.sourceQuote)}><Link2 size={14} aria-hidden="true" />{t.viewOriginal}</button></div></details>)}</div>}</section>
          <section className="care-panel care-questions" aria-labelledby="care-questions-heading"><div className="care-section-heading"><div><h2 id="care-questions-heading">{t.questionsTitle}</h2><p>{t.questionsDescription}</p></div><MessageCircleQuestion size={22} className="care-heading-icon" aria-hidden="true" /></div>{analysis.questionsForDoctor.length === 0 ? <p className="care-empty">{t.noQuestions}</p> : <ol className="care-question-list">{analysis.questionsForDoctor.map((question, index) => <li key={index}><span aria-hidden="true">{index + 1}</span><p>{question}</p></li>)}</ol>}<button type="button" className="care-source-link care-question-copy" disabled={!analysis.questionsForDoctor.length} onClick={copyQuestions}>{copyStatus === "success" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copyStatus === "success" ? t.copied : t.copyQuestions}</button></section>
          <UnderstandingQuiz key={language} quiz={analysis.quiz} language={language} onInspect={inspectSource} />
        </div>
        <SourceInspector document={document} quote={selectedQuote} language={language} mode={mode} onClear={() => setSelectedQuote(null)} dialogRef={dialogRef} />
      </div>
      <p className="care-results-disclaimer"><ShieldCheck size={17} aria-hidden="true" />{t.disclaimer}</p>
    </div>
  );
}

export default ResultsDashboard;
