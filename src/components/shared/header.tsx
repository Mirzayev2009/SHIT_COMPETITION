"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, ArrowLeft } from "lucide-react";
import { Logo } from "./logo";
import { LanguageSelector } from "./language-selector";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/schema";
import { ui } from "@/lib/translations";

export function Header({ language, onLanguageChange, workspace = false, disabled = false }: { language: Language; onLanguageChange: (l: Language) => void; workspace?: boolean; disabled?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = ui[language];
  return <header className={`site-header ${workspace ? "workspace-header" : ""}`}>
    <div className="header-inner"><Logo/>
      {!workspace && <nav className="desktop-nav" aria-label="Main"><a href="#how-it-works">{t.howItWorks}</a><a href="#features">{t.features}</a></nav>}
      <div className="header-actions"><LanguageSelector language={language} onChange={onLanguageChange} disabled={disabled} id="header-language"/>
        {workspace ? <Link className="home-link" href={`/?lang=${language}`}><ArrowLeft size={15}/><span>{t.backHome}</span></Link> : <Button asChild size="sm" className="header-app"><Link href={`/app?lang=${language}`}>{t.openApp}<ArrowRight size={15}/></Link></Button>}
        {!workspace && <button className="mobile-menu icon-button" aria-label={menuOpen ? t.close : t.navMenu} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>}
      </div>
    </div>
    {!workspace && menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Main"><a href="#how-it-works" onClick={() => setMenuOpen(false)}>{t.howItWorks}</a><a href="#features" onClick={() => setMenuOpen(false)}>{t.features}</a><Link href={`/app?lang=${language}`}>{t.openApp}<ArrowRight size={17}/></Link></nav>}
  </header>;
}
