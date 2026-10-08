import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import "./responsive.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F7FAF9" };

export const metadata: Metadata = {
  title: { default: "CareMap AI — Your health instructions, finally clear", template: "%s | CareMap AI" },
  description: "Understand your care. Know your next step. Clear, source-linked explanations of your medical visit instructions in English, Uzbek, and Russian.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={GeistSans.variable} data-scroll-behavior="smooth"><body><div hidden dangerouslySetInnerHTML={{ __html: "<!-- THESIS: Original words become understandable care steps. OWN-WORLD: Geist, mist-white canvas, deep ink, clinical teal, amber uncertainty, document-centered panels. STORY: Paste, understand, trace, clarify, review. FIRST VIEWPORT: Clear two-line offer left; fictional document transforms into the actual summary component right; primary action immediately visible. FORM: User-pinned premium healthcare interface; seed d1c4c1cd constrained by the explicit brief. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->" }}/><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}
