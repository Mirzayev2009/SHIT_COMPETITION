"use client";

import { Globe2, ChevronDown } from "lucide-react";
import type { Language } from "@/lib/schema";
import { languageNames, ui } from "@/lib/translations";

export function LanguageSelector({ language, onChange, disabled = false, id = "language" }: { language: Language; onChange: (language: Language) => void; disabled?: boolean; id?: string }) {
  return <div className="language-select"><Globe2 size={16} aria-hidden="true"/><label className="sr-only" htmlFor={id}>{ui[language].language}</label><select id={id} value={language} onChange={e => onChange(e.target.value as Language)} disabled={disabled}>{Object.entries(languageNames).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select><ChevronDown size={13} aria-hidden="true"/></div>;
}
