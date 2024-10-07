// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://8a8fe7c1d41e4ca408bebcb7e1370314@o4508081010114560.ingest.us.sentry.io/4508081010376704",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.browserTracingIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});