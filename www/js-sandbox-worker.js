// Sandboxed execution environment for the JavaScript playground's Run
// button. This used to be built as a Blob URL at runtime instead of a real
// file - works fine in a normal browser, but Android's WebView (what the
// Capacitor-based Android app runs inside) blocks or silently fails Worker
// creation from blob: URLs in some configurations. A real static file like
// this one sidesteps that restriction entirely, and behaves identically
// everywhere else too.
const _logs = [];
const _fmt = (a) => {
  if (a === undefined) return "undefined";
  if (a === null) return "null";
  if (typeof a === "string") return a;
  if (a instanceof Error) return a.message;
  if (a instanceof Map) return JSON.stringify(Object.fromEntries(a), null, 2);
  if (a instanceof Set) return JSON.stringify([...a], null, 2);
  try { return JSON.stringify(a, null, 2); } catch (e) { return String(a); }
};
self.console = {
  log: (...args) => _logs.push(args.map(_fmt).join(" ")),
  error: (...args) => _logs.push(args.map(_fmt).join(" ")),
  warn: (...args) => _logs.push(args.map(_fmt).join(" ")),
  info: (...args) => _logs.push(args.map(_fmt).join(" ")),
};
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
self.onmessage = async (e) => {
  _logs.length = 0; // a worker file (unlike a fresh Blob each run) is reused across runs - clear state between them
  try {
    const run = new AsyncFunction(e.data);
    await run();
    self.postMessage({ output: _logs.join("\n"), error: null });
  } catch (err) {
    self.postMessage({ output: _logs.join("\n"), error: err.message });
  }
};
