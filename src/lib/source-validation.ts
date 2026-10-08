import { careMapAnalysisSchema, type CareMapAnalysis } from "./schema";

export class SourceValidationError extends Error {
  constructor() {
    super("The explanation could not be verified against your original document.");
    this.name = "SourceValidationError";
  }
}

export function isExactSourceQuote(document: string, quote: string): boolean {
  return quote.trim().length > 0 && document.includes(quote);
}

/** Fail closed: unsupported quotations never become confirmed patient instructions. */
export function validateSourceGrounding(document: string, value: unknown): CareMapAnalysis {
  const analysis = careMapAnalysisSchema.parse(value);
  const quotations = [
    ...analysis.actions.map((action) => action.sourceQuote),
    ...analysis.terms.map((term) => term.sourceQuote),
    ...analysis.quiz.map((question) => question.sourceQuote),
    ...analysis.uncertainties.flatMap((uncertainty) =>
      uncertainty.sourceQuote === null ? [] : [uncertainty.sourceQuote],
    ),
  ];

  if (quotations.some((quote) => !isExactSourceQuote(document, quote))) {
    throw new SourceValidationError();
  }

  return analysis;
}
