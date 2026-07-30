// ─────────────────────────────────────────────────────────────────────────────
// DROP THIS FILE INTO: oms/frontend/src/utils/errorReporter.js
// Then import and call initErrorReporter() once in your main.jsx
// ─────────────────────────────────────────────────────────────────────────────

const MONITOR_URL  = import.meta.env.VITE_MONITOR_URL;
const OMS_SECRET   = import.meta.env.VITE_OMS_REPORT_SECRET;
const ENABLED      = !!MONITOR_URL && !!OMS_SECRET;

function report(payload) {
  if (!ENABLED) return;
  try {
    navigator.sendBeacon(
      `${MONITOR_URL}/api/monitor/ingest/frontend-error`,
      new Blob(
        [JSON.stringify({ ...payload, userAgent: navigator.userAgent })],
        { type: 'application/json' }
      )
    );
  } catch {
    // never throw from error reporter
  }
}

export function initErrorReporter() {
  if (!ENABLED) return;

  // Uncaught JS errors (null reference, type errors, etc.)
  window.addEventListener('error', (event) => {
    report({
      type:    'JS_ERROR',
      message: event.message || 'Unknown error',
      stack:   event.error?.stack || null,
      url:     window.location.href,
    });
  });

  // Unhandled promise rejections (failed fetch, async crashes)
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    report({
      type:    'UNHANDLED_PROMISE',
      message: reason?.message || String(reason) || 'Unhandled promise rejection',
      stack:   reason?.stack || null,
      url:     window.location.href,
    });
  });
}

// Call this anywhere to manually report a caught error
// e.g. in a catch block you want to track
export function reportError(message, stack = null) {
  report({
    type: 'CAUGHT_ERROR',
    message,
    stack,
    url: window.location.href,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// WHAT TO ADD TO YOUR OMS frontend/src/main.jsx:
// ─────────────────────────────────────────────────────────────────────────────
//
// import { initErrorReporter } from './utils/errorReporter';
// initErrorReporter(); // call this before ReactDOM.createRoot
//
// WHAT TO ADD TO YOUR OMS frontend/.env:
//
//   VITE_MONITOR_URL=https://your-monitor-server.com
//   VITE_OMS_REPORT_SECRET=same_secret_as_in_monitor_.env
// ─────────────────────────────────────────────────────────────────────────────
