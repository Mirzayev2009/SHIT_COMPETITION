import { z } from "zod";

export const MAX_DOCUMENT_LENGTH = 12_000;
export const languageSchema = z.enum(["en", "uz", "ru"]);
export type Language = z.infer<typeof languageSchema>;

export const analysisInputSchema = z
  .object({
    // Preserve the original string so quotations match what the patient pasted.
    text: z
      .string()
      .max(MAX_DOCUMENT_LENGTH)
      .refine((value) => value.trim().length > 0, "Paste your document first."),
    language: languageSchema,
    consent: z.literal(true),
  })
  .strict();

const nonemptyText = (max: number) =>
  z.string().min(1).max(max).refine((value) => value.trim().length > 0);

const sourceQuoteSchema = nonemptyText(3_000);

// This base schema is also used by the official SDK's Structured Outputs helper.
// Cross-field checks are applied locally after the model responds.
export const structuredAnalysisSchema = z
  .object({
    summary: nonemptyText(3_000),
    actions: z
      .array(
        z
          .object({
            id: nonemptyText(80),
            title: nonemptyText(200),
            description: nonemptyText(1_000),
            category: z.enum(["appointment", "preparation", "administrative", "other"]),
            when: nonemptyText(200).nullable(),
            sourceQuote: sourceQuoteSchema,
            needsConfirmation: z.boolean(),
          })
          .strict(),
      )
      .max(12),
    terms: z
      .array(
        z
          .object({
            term: nonemptyText(160),
            explanation: nonemptyText(1_000),
            sourceQuote: sourceQuoteSchema,
          })
          .strict(),
      )
      .max(12),
    questionsForDoctor: z.array(nonemptyText(500)).max(8),
    uncertainties: z
      .array(
        z
          .object({
            explanation: nonemptyText(1_000),
            sourceQuote: sourceQuoteSchema.nullable(),
          })
          .strict(),
      )
      .max(8),
    quiz: z
      .array(
        z
          .object({
            question: nonemptyText(500),
            options: z.array(nonemptyText(300)).min(2).max(4),
            correctAnswerIndex: z.number().int().min(0).max(3),
            explanation: nonemptyText(1_000),
            sourceQuote: sourceQuoteSchema,
          })
          .strict(),
      )
      .max(3),
  })
  .strict();

export const careMapAnalysisSchema = structuredAnalysisSchema.superRefine((analysis, ctx) => {
  const actionIds = new Set<string>();
  analysis.actions.forEach((action, index) => {
    if (actionIds.has(action.id)) {
      ctx.addIssue({
        code: "custom",
        path: ["actions", index, "id"],
        message: "Action IDs must be unique.",
      });
    }
    actionIds.add(action.id);
  });

  analysis.quiz.forEach((question, index) => {
    if (question.correctAnswerIndex >= question.options.length) {
      ctx.addIssue({
        code: "custom",
        path: ["quiz", index, "correctAnswerIndex"],
        message: "The answer must refer to an available option.",
      });
    }
    if (new Set(question.options).size !== question.options.length) {
      ctx.addIssue({
        code: "custom",
        path: ["quiz", index, "options"],
        message: "Quiz options must be distinct.",
      });
    }
  });
});

export type CareMapAnalysis = z.infer<typeof careMapAnalysisSchema>;
