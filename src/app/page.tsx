import { Suspense } from "react";
import { Landing } from "@/components/landing/landing";

export default function Home() {
  return <Suspense fallback={<div className="page-fallback">CareMap AI</div>}><Landing/></Suspense>;
}
