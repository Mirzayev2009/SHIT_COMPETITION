import { Suspense } from "react";
import type { Metadata } from "next";
import { Workspace } from "@/components/workspace/workspace";

export const metadata: Metadata = { title: "Your care workspace" };

export default function AppPage() {
  return <Suspense fallback={<div className="page-fallback">CareMap AI</div>}><Workspace/></Suspense>;
}
