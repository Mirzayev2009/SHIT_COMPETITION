import assert from "node:assert/strict";
import test from "node:test";
import { zodTextFormat } from "openai/helpers/zod";
import { GET, POST } from "../src/app/api/analyze/route";
import {
  analysisInputSchema,
  careMapAnalysisSchema,
  MAX_DOCUMENT_LENGTH,
  structuredAnalysisSchema,
  type CareMapAnalysis,
} from "../src/lib/schema";
import { isExactSourceQuote, SourceValidationError, validateSourceGrounding } from "../src/lib/source-validation";
import { DEMO_DOCUMENT, demoAnalyses } from "../src/lib/demo-data";

const document = "FICTIONAL DEMO\nA follow-up appointment is scheduled for October 15, 2026, at 10:30 AM.\nPlease bring your current medication list.\nLaboratory test scheduling is not specified.";
const appointment = "A follow-up appointment is scheduled for October 15, 2026, at 10:30 AM.";

function fixture(): CareMapAnalysis {
  return {
    summary: "Your fictional document lists a follow-up appointment and asks you to bring your medication list.",
    actions: [{ id: "follow-up", title: "Follow-up appointment", description: "The document lists your next appointment.", category: "appointment", when: "October 15, 2026, at 10:30 AM", sourceQuote: appointment, needsConfirmation: false }],
    terms: [{ term: "Laboratory test", explanation: "A test that examines a sample.", sourceQuote: "Laboratory test scheduling is not specified." }],
    questionsForDoctor: ["When should I arrange the laboratory test?"],
    uncertainties: [{ explanation: "Ask the clinic to clarify test scheduling.", sourceQuote: "Laboratory test scheduling is not specified." }],
    quiz: [{ question: "What should you bring?", options: ["Your current medication list", "A new prescription"], correctAnswerIndex: 0, explanation: "The document asks for your existing list.", sourceQuote: "Please bring your current medication list." }],
  };
}

test("accepts grounded analysis and preserves source text verbatim", () => {
  const analysis = fixture();
  assert.deepEqual(validateSourceGrounding(document, analysis), analysis);
  assert.equal(analysis.actions[0].sourceQuote, appointment);
});

test("all three fictional demo translations have valid exact sources and quiz indices", () => {
  for (const language of ["en", "uz", "ru"] as const) {
    assert.doesNotThrow(() => validateSourceGrounding(DEMO_DOCUMENT, demoAnalyses[language]));
    assert.equal(demoAnalyses[language].quiz.length, 3);
  }
  assert.notEqual(demoAnalyses.en.summary, demoAnalyses.uz.summary);
  assert.notEqual(demoAnalyses.en.summary, demoAnalyses.ru.summary);
});

test("does not normalize whitespace, punctuation, case, or translated quotations", () => {
  assert.equal(isExactSourceQuote(document, appointment), true);
  assert.equal(isExactSourceQuote(document, appointment.toLowerCase()), false);
  assert.equal(isExactSourceQuote(document, appointment.replace("10:30", "10.30")), false);
  assert.equal(isExactSourceQuote("Bring\nyour list.", "Bring your list."), false);
  assert.equal(isExactSourceQuote(document, "Joriy dorilar ro'yxatini olib keling."), false);
  assert.equal(isExactSourceQuote(" \n\t", " \n"), false);
});

test("matches Unicode sources without translating them", () => {
  const original = "Qayta tashrif: 15-oktabr. Принесите список лекарств.";
  assert.equal(isExactSourceQuote(original, "Qayta tashrif: 15-oktabr."), true);
  assert.equal(isExactSourceQuote(original, "Принесите список лекарств."), true);
  assert.equal(isExactSourceQuote(original, "Bring your medication list."), false);
});

test("rejects fabricated action sources even when marked as needing confirmation", () => {
  const analysis = fixture();
  analysis.actions[0].sourceQuote = "Take a new medication tomorrow.";
  analysis.actions[0].needsConfirmation = true;
  assert.throws(() => validateSourceGrounding(document, analysis), SourceValidationError);
});

test("rejects unsupported term, quiz, and uncertainty sources", () => {
  const term = fixture();
  term.terms[0].sourceQuote = "A term that was never supplied.";
  assert.throws(() => validateSourceGrounding(document, term), SourceValidationError);
  const quiz = fixture();
  quiz.quiz[0].sourceQuote = "An invented instruction.";
  assert.throws(() => validateSourceGrounding(document, quiz), SourceValidationError);
  const uncertainty = fixture();
  uncertainty.uncertainties[0].sourceQuote = "An invented scheduling statement.";
  assert.throws(() => validateSourceGrounding(document, uncertainty), SourceValidationError);
});

test("allows a null uncertainty source for information absent from a document", () => {
  const analysis = fixture();
  analysis.uncertainties[0].sourceQuote = null;
  assert.doesNotThrow(() => validateSourceGrounding(document, analysis));
});

test("rejects quiz answer indices outside available options", () => {
  for (const answer of [-1, 2, 4, 0.5]) {
    const analysis = fixture();
    analysis.quiz[0].correctAnswerIndex = answer;
    assert.equal(careMapAnalysisSchema.safeParse(analysis).success, false);
  }
});

test("rejects malformed shape, blank quotations, duplicate IDs, and oversized arrays", () => {
  assert.equal(careMapAnalysisSchema.safeParse({ summary: "Missing fields" }).success, false);
  const blank = fixture();
  blank.actions[0].sourceQuote = "   ";
  assert.equal(careMapAnalysisSchema.safeParse(blank).success, false);
  const duplicates = fixture();
  duplicates.actions.push({ ...duplicates.actions[0] });
  assert.equal(careMapAnalysisSchema.safeParse(duplicates).success, false);
  const oversized = fixture();
  oversized.terms = Array.from({ length: 13 }, () => ({ ...oversized.terms[0] }));
  assert.equal(careMapAnalysisSchema.safeParse(oversized).success, false);
  const options = fixture();
  options.quiz[0].options = ["Same answer", "Same answer"];
  assert.equal(careMapAnalysisSchema.safeParse(options).success, false);
});

test("input requires explicit consent, supported language, and bounded nonempty text", () => {
  assert.equal(analysisInputSchema.safeParse({ text: document, language: "en", consent: true }).success, true);
  for (const input of [
    { text: " \n", language: "en", consent: true },
    { text: document, language: "fr", consent: true },
    { text: document, language: "en", consent: false },
    { text: document, language: "en" },
    { text: "a".repeat(MAX_DOCUMENT_LENGTH + 1), language: "uz", consent: true },
  ]) {
    assert.equal(analysisInputSchema.safeParse(input).success, false);
  }
  const original = `  ${document}\n`;
  assert.equal(analysisInputSchema.parse({ text: original, language: "ru", consent: true }).text, original);
});

test("official SDK can construct a strict Structured Outputs format from the schema", () => {
  const format = zodTextFormat(structuredAnalysisSchema, "caremap_analysis");
  assert.equal(format.type, "json_schema");
  assert.equal(format.strict, true);
  assert.equal(format.schema.type, "object");
  assert.equal(format.schema.additionalProperties, false);
});

function request(body: unknown) {
  return new Request("http://localhost/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

test("API refuses documents without consent before checking provider configuration", async () => {
  const response = await POST(request({ text: document, language: "en", consent: false }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, "CONSENT_REQUIRED");
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("API handles invalid JSON, unsupported content type, and oversized bodies", async () => {
  const malformed = await POST(new Request("http://localhost/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }));
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).code, "INVALID_JSON");
  const unsupported = await POST(new Request("http://localhost/api/analyze", { method: "POST", body: document }));
  assert.equal(unsupported.status, 415);
  const tooLong = await POST(request({ text: "a".repeat(MAX_DOCUMENT_LENGTH + 1), language: "en", consent: true }));
  assert.equal(tooLong.status, 413);
  const tooLarge = await POST(request({ text: "a".repeat(130 * 1_024), language: "en", consent: true }));
  assert.equal(tooLarge.status, 413);
});

test("missing credentials return a safe configuration error and GET exposes only availability", async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const status = await GET();
    assert.deepEqual(await status.json(), { liveAvailable: false });
    const response = await POST(request({ text: document, language: "en", consent: true }));
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "NOT_CONFIGURED");
  } finally {
    if (originalKey !== undefined) process.env.OPENAI_API_KEY = originalKey;
  }
});

async function withMockProvider(
  provider: typeof fetch,
  run: () => Promise<void>,
) {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  globalThis.fetch = provider;
  process.env.OPENAI_API_KEY = "fictional-test-key-never-transmitted";
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  }
}

function providerResponse(value: unknown) {
  return Response.json({
    id: "resp_fictional_test",
    object: "response",
    created_at: 1,
    status: "completed",
    output: [{
      id: "msg_fictional_test",
      type: "message",
      status: "completed",
      role: "assistant",
      content: [{ type: "output_text", text: JSON.stringify(value), annotations: [] }],
    }],
  });
}

test("API parses the SDK response, verifies it, and sends the selected language without storing output", async () => {
  let calls = 0;
  await withMockProvider(async (_input, init) => {
    calls += 1;
    const payload = JSON.parse(String(init?.body));
    assert.equal(payload.store, false);
    assert.equal(payload.text.format.type, "json_schema");
    assert.equal(payload.text.format.strict, true);
    assert.match(payload.input[0].content, /Russian/);
    assert.deepEqual(JSON.parse(payload.input[1].content), { untrustedMedicalDocument: document });
    return providerResponse(fixture());
  }, async () => {
    const result = await POST(request({ text: document, language: "ru", consent: true }));
    assert.equal(result.status, 200);
    assert.deepEqual(await result.json(), { analysis: fixture(), mode: "live" });
    assert.equal(calls, 1);
  });
});

test("API rejects fabricated provider sources without exposing unsupported content", async () => {
  const analysis = fixture();
  analysis.actions[0].sourceQuote = "Unsupported clinical detail.";
  await withMockProvider(async () => providerResponse(analysis), async () => {
    const result = await POST(request({ text: document, language: "en", consent: true }));
    assert.equal(result.status, 502);
    const body = await result.json();
    assert.equal(body.code, "SOURCE_VALIDATION_FAILED");
    assert.equal("analysis" in body, false);
    assert.equal(JSON.stringify(body).includes("Unsupported clinical detail"), false);
  });
});

test("API safely rejects malformed provider output and an explicit model refusal", async () => {
  await withMockProvider(async () => providerResponse({ summary: "Missing everything else" }), async () => {
    const result = await POST(request({ text: document, language: "en", consent: true }));
    assert.equal(result.status, 502);
    assert.equal((await result.json()).code, "INVALID_OUTPUT");
  });
  await withMockProvider(async () => Response.json({
    status: "completed",
    output: [{ type: "message", content: [{ type: "refusal", refusal: "Cannot analyze this input." }] }],
  }), async () => {
    const result = await POST(request({ text: document, language: "en", consent: true }));
    assert.equal(result.status, 502);
    assert.equal((await result.json()).code, "INVALID_OUTPUT");
  });
});

test("API handles upstream rate limits and authentication failures without retrying or leaking provider details", async () => {
  for (const status of [429, 401]) {
    let calls = 0;
    await withMockProvider(async () => {
      calls += 1;
      return Response.json({ error: { message: "Sensitive provider detail", type: "provider_error" } }, { status });
    }, async () => {
      const result = await POST(request({ text: document, language: "en", consent: true }));
      assert.equal(result.status, status === 429 ? 429 : 503);
      const body = await result.json();
      assert.equal(body.code, status === 429 ? "RATE_LIMITED" : "PROVIDER_CONFIGURATION");
      assert.equal(JSON.stringify(body).includes("Sensitive provider detail"), false);
      assert.equal(calls, 1);
    });
  }
});

test("API turns a provider timeout into a clear retryable failure", async () => {
  await withMockProvider(async () => { throw new TypeError("request timed out"); }, async () => {
    const result = await POST(request({ text: document, language: "en", consent: true }));
    assert.equal(result.status, 504);
    assert.equal((await result.json()).code, "TIMEOUT");
  });
});

test("instance request guard blocks excess requests before transmission", async () => {
  let calls = 0;
  await withMockProvider(async () => { calls += 1; return providerResponse(fixture()); }, async () => {
    let blocked = false;
    for (let index = 0; index < 13; index += 1) {
      const result = await POST(request({ text: document, language: "en", consent: true }));
      if (result.status === 429) {
        assert.equal((await result.json()).code, "RATE_LIMITED");
        blocked = true;
        break;
      }
      assert.equal(result.status, 200);
    }
    assert.equal(blocked, true);
    assert.ok(calls < 13);
  });
});
