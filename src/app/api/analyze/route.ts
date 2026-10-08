import OpenAI from "openai";
import { ZodError } from "zod";
import {
  analyzeDocument,
  AnalysisOutputError,
  AnalysisUnavailableError,
  liveAnalysisAvailable,
} from "@/lib/ai";
import { analysisInputSchema, MAX_DOCUMENT_LENGTH } from "@/lib/schema";
import { SourceValidationError } from "@/lib/source-validation";

export const maxDuration = 60;

const MAX_REQUEST_BYTES = 128 * 1_024;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_CONCURRENT_REQUESTS = 4;

// Small instance-scoped burst guard for the hackathon. No document or client identity is stored.
// Production needs a durable shared limiter at the gateway; serverless instances don't share counters.
let windowStartedAt = Date.now();
let requestsInWindow = 0;
let pendingRequests = 0;

const responseHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

function errorResponse(error: string, code: string, status: number, retryAfter?: string) {
  return Response.json(
    { error, code },
    {
      status,
      headers: { ...responseHeaders, ...(retryAfter ? { "Retry-After": retryAfter } : {}) },
    },
  );
}

class RequestTooLargeError extends Error {}

async function readLimitedJson(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_REQUEST_BYTES) throw new RequestTooLargeError();
  if (!request.body) throw new SyntaxError();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new RequestTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

export async function GET() {
  return Response.json({ liveAvailable: liveAnalysisAvailable() }, { headers: responseHeaders });
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return errorResponse("Send the document as JSON.", "INVALID_CONTENT_TYPE", 415);
  }

  let body: unknown;
  try {
    body = await readLimitedJson(request);
  } catch (error) {
    if (error instanceof RequestTooLargeError) {
      return errorResponse(`Use a document of ${MAX_DOCUMENT_LENGTH.toLocaleString("en-US")} characters or fewer.`, "INPUT_TOO_LARGE", 413);
    }
    return errorResponse("The request could not be read. Please try again.", "INVALID_JSON", 400);
  }

  const parsedInput = analysisInputSchema.safeParse(body);
  if (!parsedInput.success) {
    const consentIssue = parsedInput.error.issues.some((issue) => issue.path[0] === "consent");
    if (consentIssue) {
      return errorResponse("Your consent is required before sending a document to the AI provider.", "CONSENT_REQUIRED", 400);
    }
    const tooLong = parsedInput.error.issues.some((issue) => issue.code === "too_big" && issue.path[0] === "text");
    return errorResponse(
      tooLong ? `Use ${MAX_DOCUMENT_LENGTH.toLocaleString("en-US")} characters or fewer.` : "Paste a nonempty document and select English, Uzbek, or Russian.",
      tooLong ? "INPUT_TOO_LARGE" : "INVALID_INPUT",
      tooLong ? 413 : 400,
    );
  }

  if (!liveAnalysisAvailable()) {
    return errorResponse("Live analysis is not configured. You can still explore the fictional demo.", "NOT_CONFIGURED", 503);
  }

  const now = Date.now();
  if (now - windowStartedAt >= WINDOW_MS) {
    windowStartedAt = now;
    requestsInWindow = 0;
  }
  if (requestsInWindow >= MAX_REQUESTS_PER_WINDOW || pendingRequests >= MAX_CONCURRENT_REQUESTS) {
    return errorResponse("Too many requests are in progress. Please wait a minute and try again.", "RATE_LIMITED", 429, "60");
  }
  requestsInWindow += 1;
  pendingRequests += 1;

  try {
    const { text, language } = parsedInput.data;
    const analysis = await analyzeDocument(text, language, request.signal);
    return Response.json({ analysis, mode: "live" }, { headers: responseHeaders });
  } catch (error) {
    // Never log documents, parsed model output, API keys, or provider error bodies.
    if (error instanceof AnalysisUnavailableError) {
      return errorResponse(error.message, "NOT_CONFIGURED", 503);
    }
    if (error instanceof OpenAI.APIConnectionTimeoutError) {
      return errorResponse("The AI provider took too long to respond. Please try again.", "TIMEOUT", 504);
    }
    if (error instanceof OpenAI.APIUserAbortError) {
      return errorResponse("The analysis was cancelled. You can try again.", "CANCELLED", 499);
    }
    if (error instanceof OpenAI.APIError && error.status === 429) {
      return errorResponse("The AI provider is busy or its usage limit has been reached. Please try again later.", "RATE_LIMITED", 429, "60");
    }
    if (error instanceof OpenAI.APIError && (error.status === 401 || error.status === 403 || error.status === 404)) {
      return errorResponse("The live AI configuration needs attention. The fictional demo is available.", "PROVIDER_CONFIGURATION", 503);
    }
    if (error instanceof SourceValidationError) {
      return errorResponse("We could not verify every source quotation. No explanation has been shown; please try again or review your original document with your clinician.", "SOURCE_VALIDATION_FAILED", 502);
    }
    if (error instanceof ZodError || error instanceof SyntaxError || error instanceof AnalysisOutputError) {
      return errorResponse("The AI did not return a complete, verifiable explanation. Please try again.", "INVALID_OUTPUT", 502);
    }
    return errorResponse("Live analysis could not be completed. Please try again later.", "PROVIDER_ERROR", 502);
  } finally {
    pendingRequests -= 1;
  }
}
