"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpenText, Check, CheckCheck, ChevronRight, FileText, Languages, Link2, ListChecks, ShieldCheck, Sparkles, CalendarDays, ClipboardList } from "lucide-react";
import { Header } from "@/components/shared/header";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/results/summary-card";
import { ui } from "@/lib/translations";
import { demoAnalyses } from "@/lib/demo-data";
import type { Language } from "@/lib/schema";

export function Landing() {
  const params = useSearchParams();
  const initialLanguage = params.get("lang");
  const [language, setLanguage] = useState<Language>(initialLanguage === "uz" || initialLanguage === "ru" ? initialLanguage : "en");
  const t = ui[language];
  const demo = demoAnalyses[language];
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const appUrl = `/app?lang=${language}`;
  const demoUrl = `${appUrl}&demo=true`;
  const features = [
    { icon: BookOpenText, title: t.featurePlainTitle, body: t.featurePlainBody },
    { icon: Link2, title: t.featureSourceTitle, body: t.featureSourceBody },
    { icon: Languages, title: t.featureLanguageTitle, body: t.featureLanguageBody },
    { icon: ListChecks, title: t.featureQuizTitle, body: t.featureQuizBody },
  ];

  return <div className={`landing language-${language}`}>
    <Header language={language} onLanguageChange={setLanguage}/>
    <main id="main-content">
      <section className="hero shell">
        <div className="hero-copy">
          <span className="hero-badge"><span className="status-dot"/>{t.heroBadge}</span>
          <h1>{t.heroLine1}<br/><span>{t.heroLine2}</span></h1>
          <p className="hero-description">{t.heroDescription}</p>
          <div className="hero-actions"><Button asChild><Link href={appUrl}>{t.primaryCta}<ArrowRight size={18}/></Link></Button><Button asChild variant="secondary"><Link href={demoUrl}>{t.exploreDemo}<ArrowUpRight size={17}/></Link></Button></div>
          <p className="hero-note"><ShieldCheck size={15}/>{t.heroNote}</p>
        </div>
        <div className="hero-visual" aria-label={t.demoDocument}>
          <div className="preview-document"><div className="paper-head"><FileText size={18}/><span>{t.previewDocument}</span></div><span className="paper-demo">FICTIONAL DEMO</span><div className="paper-line"/><div className="paper-line short"/><p>A follow-up appointment is scheduled for October 15, 2026, at 10:30 AM.</p><div className="paper-line"/><div className="paper-line medium"/></div>
          <div className="preview-app">
            <div className="preview-app-bar"><span className="preview-brand"><span className="mini-logo">+</span>CareMap</span><span className="preview-ready"><Check size={12}/>{t.previewResult}</span></div>
            <div className="preview-app-content"><div className="preview-heading"><span className="preview-greeting">{t.resultsTitle}</span><span className="preview-demo-label">{t.demoDocument}</span></div>
              <SummaryCard heading={t.summaryTitle} summary={demo.summary}/>
              <div className="preview-steps-head">{t.actionsTitle}<span><CheckCheck size={14}/></span></div>
              <div className="preview-step"><span className="preview-step-icon"><CalendarDays size={18}/></span><div><strong>{demo.actions[0].title}</strong><span>{demo.actions[0].when}</span></div><Check size={15} className="preview-check"/></div>
              <div className="preview-step secondary"><span className="preview-step-icon"><ClipboardList size={17}/></span><div><strong>{demo.actions[1].title}</strong><span>{t.categoryPreparation}</span></div></div>
              <Link href={demoUrl} className="preview-source-link"><Link2 size={14}/>{t.viewOriginal}<ChevronRight size={14}/></Link>
            </div>
          </div>
          <div className="source-float"><span className="source-float-icon"><Link2 size={17}/></span><div><strong>{t.previewSource}</strong><p>“October 15, 2026, at 10:30 AM.”</p></div><span className="source-float-check"><Check size={13}/></span></div>
          <span className="visual-transformation" aria-hidden="true"><Sparkles size={18}/></span>
        </div>
      </section>
      <div className="confidence-strip shell"><span><FileText size={18}/>{t.featureSourceTitle}</span><span><Languages size={18}/>{t.featureLanguageTitle}<small>English · O‘zbekcha · Русский</small></span><span><ShieldCheck size={18}/>{t.educationalNotice}</span></div>
      <section id="features" className="features-section shell"><div className="section-heading"><h2>{t.featuresTitle}</h2><p>{t.featuresDescription}</p></div><div className="features-grid">{features.map(({ icon: Icon, title, body }) => <article className="feature" key={title}><div className="feature-icon"><Icon size={23} strokeWidth={1.6}/></div><h3>{title}</h3><p>{body}</p></article>)}</div></section>
      <section id="how-it-works" className="how-section"><div className="shell how-inner"><div className="how-intro"><h2>{t.howTitle}</h2><Button asChild variant="secondary"><Link href={demoUrl}>{t.exploreDemo}<ArrowRight size={17}/></Link></Button></div><ol className="how-steps">{[1,2,3].map((step) => <li key={step}><span className="step-number">{step}</span><div><h3>{t[`step${step}Title` as "step1Title"]}</h3><p>{t[`step${step}Body` as "step1Body"]}</p></div></li>)}</ol></div></section>
      <section className="safety-section shell"><ShieldCheck size={23}/><p>{t.disclaimer}</p></section>
    </main>
    <footer className="site-footer"><div className="shell footer-inner"><div><Logo/><p>{t.footerDescription}</p></div><div className="footer-details"><details><summary>{t.privacy}</summary><p>{t.privacyDetails} {t.consentBody}</p></details><span>{t.educationalNotice}</span><span>© 2026 {t.copyright}</span></div></div></footer>
  </div>;
}
