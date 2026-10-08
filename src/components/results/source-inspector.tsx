"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { ArrowLeft, FileText, Link2, X } from "lucide-react";
import type { Language } from "@/lib/schema";
import { languageNames, ui } from "@/lib/translations";

type SourceInspectorProps = {
  document: string;
  quote: string | null;
  language: Language;
  mode: "demo" | "live";
  onClear: () => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
};

export function SourceDocument({ document, quote }: { document: string; quote: string | null }) {
  const start = quote ? document.indexOf(quote) : -1;
  return (
    <div className="care-source-document">
      {start >= 0 && quote ? <>{document.slice(0, start)}<mark className="care-source-highlight">{quote}</mark>{document.slice(start + quote.length)}</> : document}
    </div>
  );
}

export function SourceInspector({ document, quote, language, mode, onClear, dialogRef }: SourceInspectorProps) {
  const t = ui[language];
  const sourceRef = useRef<HTMLDivElement>(null);
  const dialogSourceRef = useRef<HTMLDivElement>(null);
  const matched = !!quote && document.includes(quote);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";

    function scrollToSource() {
      for (const container of [sourceRef.current, dialogSourceRef.current]) {
        if (!container?.clientHeight) continue;
        const mark = container.querySelector<HTMLElement>("mark");
        const top = mark ? mark.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop : 0;
        container.scrollTo({ top: Math.max(0, top - 24), behavior });
      }
    }

    let frame = window.requestAnimationFrame(scrollToSource);
    function updateLayout() {
      if (desktop.matches) dialogRef.current?.close();
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(scrollToSource);
    }

    desktop.addEventListener("change", updateLayout);
    return () => {
      window.cancelAnimationFrame(frame);
      desktop.removeEventListener("change", updateLayout);
    };
  }, [quote, document, dialogRef]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  const matchContent = matched ? (
    <div className="care-source-match">
      <div className="care-source-match-title"><Link2 size={14} aria-hidden="true" /><span>{t.sourceMatched}</span><button type="button" className="care-mini-close" onClick={onClear} aria-label={t.close}><X size={15} /></button></div>
      <blockquote>{quote}</blockquote>
    </div>
  ) : <p className="care-source-hint">{quote ? t.sourceEmpty : t.sourceSelect}</p>;

  return (
    <>
      <aside className="care-source-sidebar" aria-labelledby="care-source-heading">
        <section className={`care-source-panel${matched ? " has-selection" : ""}`}>
          <div className="care-source-heading"><span className="care-source-symbol" aria-hidden="true"><FileText size={20} strokeWidth={1.7} /></span><div><h2 id="care-source-heading">{t.sourceTitle}</h2><p>{t.sourceDescription}</p></div></div>
          {matchContent}
          <div className="care-source-scroll" ref={sourceRef}><SourceDocument document={document} quote={quote} /></div>
          <div className="care-source-bottom"><Link2 size={14} aria-hidden="true" />{t.sourceOriginal}</div>
        </section>
        <div className="care-document-info">
          <h3>{t.documentInfo}</h3>
          <dl><div><dt>{t.documentLength}</dt><dd>{document.length.toLocaleString(language)} {t.characters}</dd></div><div><dt>{t.documentLanguage}</dt><dd>{languageNames[language]}</dd></div></dl>
          <p className="care-original-note">{t.originalLanguage}</p>
          <span className={`care-document-mode${mode === "demo" ? " is-demo" : ""}`}><span aria-hidden="true" />{mode === "demo" ? t.demoDocument : t.liveDocument}</span>
        </div>
      </aside>
      <dialog ref={dialogRef} className="care-source-dialog" aria-labelledby="care-source-dialog-title" onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <div className="care-dialog-inner">
          <div className="care-dialog-header">
            <div className="care-dialog-grip" aria-hidden="true" />
            <div className="care-dialog-heading"><h2 id="care-source-dialog-title">{t.sourceTitle}</h2><button type="button" className="icon-button" aria-label={t.close} onClick={closeDialog}><X size={20} /></button></div>
            <p className="care-dialog-description">{t.sourceDescription}</p>
          </div>
          <div className="care-dialog-scroll" ref={dialogSourceRef} tabIndex={0} role="region" aria-label={t.sourceOriginal}>
            {matched && <div className="care-source-match"><div className="care-source-match-title"><Link2 size={14} aria-hidden="true" /><span>{t.sourceMatched}</span></div><blockquote>{quote}</blockquote></div>}
            <SourceDocument document={document} quote={quote} />
          </div>
          <button type="button" className="button button-secondary care-dialog-back" onClick={closeDialog}><ArrowLeft size={16} aria-hidden="true" />{t.sourceBack}</button>
        </div>
      </dialog>
    </>
  );
}
