import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "CareMap AI — Your health instructions, finally clear", template: "%s | CareMap AI" },
  description: "Understand your care. Know your next step. Clear, source-linked explanations of your medical visit instructions in English, Uzbek, and Russian.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={geist.variable}><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}
