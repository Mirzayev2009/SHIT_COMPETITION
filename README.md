# CareMap AI

**Your health instructions, finally clear.** CareMap is a healthcare hackathon prototype that turns an existing visit summary into plain-language explanations, source-linked follow-up steps, clarification questions, and an understanding quiz. It does not diagnose, prescribe, or replace a clinician.

## Run locally

Use Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Select **Explore Demo** or **Try With Sample Document** to load the fictional example, then create its CareMap. No API key is needed for the demonstration.

## What works

- Landing page and connected document workspace.
- Pasted plain text, input validation, character limits, and explicit consent for live analysis.
- Prepared English, Uzbek, and Russian fictional demo explanations; language switching keeps source quotations unchanged.
- Summary, appointment and preparation cards, temporary checklist, uncertainty notes, educational terminology, clinician questions, and a source-linked quiz.
- Original-document inspection with exact quotation highlighting, copying questions, print layout, and resetting the current session.
- Optional server-side OpenAI analysis with structured output, schema checks, exact quotation verification, bounded requests, and safe errors.

Demo output is deterministic and visibly labeled. It applies only to the original fictional sample. Editing the sample creates a custom document that requires genuine live analysis; arbitrary documents never receive canned demo results.

## Configure live analysis

Copy `.env.example` to `.env.local` in the project root:

```dotenv
OPENAI_API_KEY=your-own-openai-api-key
OPENAI_MODEL=gpt-4.1-mini
```

Restart the development server after changes. Keep the key server-side and never use a `NEXT_PUBLIC_` prefix. The default `gpt-4.1-mini` supports the Responses API and Structured Outputs; another model must support both. See the official [model documentation](https://developers.openai.com/api/docs/models/gpt-4.1-mini) and [Structured Outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs).

Live availability means a key is configured; it does not verify the key, account access, billing, or model availability. A real request requires the consent checkbox. Switching a live result to another language makes another consented provider request; demo language changes are local. A failed live request shows an error and does not switch to demo results.

## API and safeguards

`GET /api/analyze` returns only `{ "liveAvailable": boolean }`.

`POST /api/analyze` accepts JSON:

```json
{ "text": "Your original document", "language": "en", "consent": true }
```

Languages are `en`, `uz`, and `ru`. Document text is limited to 12,000 characters, with an additional 128 KiB request-body limit. Successful responses contain `{ "analysis": { ... }, "mode": "live" }`; errors contain `{ "error": "Safe user-facing message", "code": "ERROR_CODE" }`.

The server uses the official OpenAI SDK's `responses.parse` and `zodTextFormat`, a 40-second request timeout, no automatic retries, and `store: false`. The system instructions treat document text as untrusted data and prohibit diagnoses, prescriptions, invented dates, and new medication plans. Every action, terminology card, quiz question, and non-null uncertainty quotation must match an exact substring of the submitted text. A failed check rejects the complete response. Quiz indices, unique action IDs, types, and array limits are checked separately.

Missing configuration, invalid input, missing consent, timeouts, malformed output, unsupported quotations, provider errors, and upstream rate limits have explicit errors. A small instance-scoped guard allows at most 12 live requests per minute and four concurrent requests. This is useful for a hackathon but is **not a durable production rate limiter**: serverless instances do not share counters, and a cold start resets them. Before opening live analysis to public traffic, add a shared gateway limit and provider spend limits.

## Privacy and limitations

The app has no authentication or database. It keeps the current document, results, checklist, and quiz in browser memory, does not add analytics, and does not log submitted text or provider output. Reset clears the current application state. Refresh also discards the session. Copies and printed documents are under the user's control.

After explicit consent, live document text is sent to OpenAI. `store: false` disables Responses application-state storage; provider data handling still depends on the provider's terms and account configuration. Reset does not erase material already sent to the provider. Use fictional documents for demonstrations and avoid unnecessary identifiers. See OpenAI's [data controls documentation](https://developers.openai.com/api/docs/guides/your-data).

This prototype has no claim of HIPAA compliance, medical certification, or clinical validation. Exact source matching proves quotation presence, not medical correctness or completeness of an AI interpretation. Summaries, educational definitions, and questions can still be wrong. Keep the original instructions and confirm uncertainty with the healthcare team. The input supports pasted text only; PDF/image uploads, booking, prescriptions, persistent records, and hospital integrations are outside this MVP.

## Verification

```bash
npm test
npm run lint
npm run build
npm start
```

The Node tests cover quotation verification, Unicode and whitespace preservation, malformed response rejection, answer-index bounds, explicit consent, body limits, and missing API configuration. They use no paid live AI calls. Build and lint should be run before deployment; a configured provider's live response must be tested separately with fictional data.

For a demonstration, load the sample, create the map, inspect an appointment source, switch languages, review the scheduling uncertainty, complete the quiz, copy questions, print, and reset. Check narrow mobile layouts and keyboard interaction as well as desktop.

## Deploy to Vercel

1. Push the project to a Git repository and import it into Vercel as a Next.js project.
2. Use `npm run build` as the build command and the framework's default output settings.
3. For optional live analysis, add `OPENAI_API_KEY` and `OPENAI_MODEL` to the desired deployment environments; keep them private.
4. Deploy and test the complete fictional flow before your presentation. The demo works when live credentials are absent.
5. If enabling live requests, verify the deployment allows the route's requested 60-second execution duration. The provider request stops after 40 seconds; platform limits can be shorter and must be checked for your plan/configuration.

No deployment credentials or automatic publishing are required to run this project locally.
