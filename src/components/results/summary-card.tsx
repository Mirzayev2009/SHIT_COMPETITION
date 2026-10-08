import { FileHeart } from "lucide-react";
import "./results.css";

type SummaryCardProps = {
  summary: string;
  heading: string;
};

export function SummaryCard({ summary, heading }: SummaryCardProps) {
  return (
    <section className="care-summary" aria-label={heading}>
      <div className="care-summary-heading">
        <span className="care-summary-symbol" aria-hidden="true"><FileHeart size={23} strokeWidth={1.7} /></span>
        <h2>{heading}</h2>
      </div>
      <p>{summary}</p>
    </section>
  );
}
