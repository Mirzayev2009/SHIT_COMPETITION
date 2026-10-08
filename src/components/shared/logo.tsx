import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="brand" aria-label="CareMap AI home">
    <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M16 5v22M5 16h22" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/><path d="m20 20 5 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="25" cy="25" r="3" fill="currentColor"/></svg></span>
    {!compact && <span>CareMap<span className="brand-ai">AI</span></span>}
  </Link>;
}
