"use client";

import { useRef } from "react";
import { ArrowRight, ClipboardPaste, FileText, FlaskConical, Info, Link2, ShieldCheck, Trash2 } from "lucide-react";
import type { Language } from "@/lib/schema";
import { MAX_DOCUMENT_LENGTH } from "@/lib/schema";
import { ui } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/shared/language-selector";

type Props = { text: string; onTextChange: (value: string) => void; language: Language; onLanguageChange: (l: Language) => void; onDemo: () => void; onAnalyze: () => void; demo: boolean; consent: boolean; onConsent: (v: boolean) => void; liveAvailable: boolean | null; error: string; onError: (message: string) => void };

export function DocumentInput({ text, onTextChange, language, onLanguageChange, onDemo, onAnalyze, demo, consent, onConsent, liveAvailable, error, onError }: Props) {
  const t = ui[language];
  const inputRef = useRef<HTMLTextAreaElement>(null);
  async function pasteText() { try { onTextChange(await navigator.clipboard.readText()); inputRef.current?.focus(); } catch { onError(t.clipboardError); inputRef.current?.focus(); } }
  const tooLong = text.length > MAX_DOCUMENT_LENGTH;
  return <div className="input-layout"><div className="input-main"><div className="input-title"><h1>{t.workspaceTitle}</h1><p>{t.workspaceSubtitle}</p></div>
    <form className="document-input-card" onSubmit={e => { e.preventDefault(); onAnalyze(); }}>
      <div className="document-card-header"><div><span className="document-icon"><FileText size={20}/></span><h2>{t.documentTitle}</h2></div><span className="text-format">TXT</span></div>
      <div className="textarea-tools"><label htmlFor="document-text">{t.documentLabel}</label><div><button type="button" onClick={pasteText}><ClipboardPaste size={14}/>{t.paste}</button>{text && <button type="button" onClick={() => { onTextChange(""); inputRef.current?.focus(); }}><Trash2 size={14}/>{t.clear}</button>}</div></div>
      <textarea ref={inputRef} id="document-text" placeholder={t.documentPlaceholder} value={text} onChange={e => onTextChange(e.target.value)} aria-invalid={tooLong || !!error} aria-describedby="input-note input-error" spellCheck={false}/>
      <div className="textarea-foot"><span id="input-note">{demo ? <><FlaskConical size={14}/>{t.demoDocument}</> : t.documentDescription}</span><span className={tooLong ? "count-error" : ""}>{text.length.toLocaleString(language)} / 12,000</span></div>
      <div className="input-config"><div><label htmlFor="output-language">{t.outputLanguage}</label><LanguageSelector language={language} onChange={onLanguageChange} id="output-language"/></div><Button type="button" variant="ghost" size="sm" onClick={onDemo}><FlaskConical size={16}/>{t.sampleButton}</Button></div>
      {demo && <div className="input-demo-notice"><Info size={16}/><p>{t.demoNote}</p></div>}
      {!!text && !demo && <div className="consent-block"><h3><ShieldCheck size={16}/>{t.consentTitle}</h3><p>{t.consentBody} {t.providerTerms} <a href="https://platform.openai.com/docs/guides/your-data" target="_blank" rel="noopener noreferrer">OpenAI</a></p>{liveAvailable === false ? <p className="config-note">{t.unconfiguredError}</p> : <label className="consent-label"><input type="checkbox" checked={consent} onChange={e => onConsent(e.target.checked)}/><span>{t.consentLabel}</span></label>}</div>}
      {error && <div className="input-error" id="input-error" role="alert"><Info size={17}/><span>{error}</span></div>}
      <div className="input-submit"><span><ShieldCheck size={14}/>{t.educationalNotice}</span><Button type="submit">{t.analyze}<ArrowRight size={18}/></Button></div>
    </form>
    <p className="workspace-disclaimer"><ShieldCheck size={16}/>{t.disclaimer}</p>
  </div><aside className="input-aside"><div className="aside-path"><span><FileText size={23}/></span><i/><span><Link2 size={23}/></span></div><h2>{t.featuresTitle}</h2><p>{t.featuresDescription}</p><div className="aside-benefits"><div><Link2 size={19}/><div><h3>{t.featureSourceTitle}</h3><p>{t.featureSourceBody}</p></div></div><div><FlaskConical size={19}/><div><h3>{t.demoDocument}</h3><p>{t.demoNote}</p></div></div><div><ShieldCheck size={19}/><div><h3>{t.privacy}</h3><p>{t.privacyDetails}</p></div></div></div></aside></div>;
}
