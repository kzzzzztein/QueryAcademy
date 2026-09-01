// =========================================================================
// query.academy — plain HTML/CSS/JS build (no bundler, no npm required)
// =========================================================================


const COLORS = {
  cyan: "#0b8a82",
  amber: "#a15a06",
  magenta: "#a5135c",
  green: "#157f3c",
  red: "#c22b2b",
  sub: "#57678a",
  white: "#ffffff",
  dkText: "#e7ecf7",
  dkSub: "#93a3c4",
  dkCyan: "#3fe0d0",
  dkAmber: "#ffb84d",
  dkGreen: "#5be38b",
  dkMagenta: "#ff6fa5",
  dkLine: "#263455",
  dkPanel2: "#131c31",
  blue: "#2563a8",
};

const state = {
  view: "catalog", // catalog | course
  courseId: "sql",
  level: "entry", // entry | professional | master
  track: "basic", // basic | intermediate | advanced
  lessonIdx: 0,
  checkin: { mode: "ask", question: "", answer: "", loading: false },
  // Deep-dive module (sub-course) state. moduleId is null when browsing the normal flat
  // lesson list. moduleLessonIdx: -1 = intro screen, 0..N-1 = a lesson, N = complete screen.
  moduleId: null,
  moduleLessonIdx: -1,
};

// ---------- Accounts (registration/login against the PHP backend in /api/) ----------
const authState = {
  user: null,          // { id, name, email, role, created_at } | null
  loaded: false,        // becomes true once the initial /api/me.php check resolves
  modalView: null,      // null | "login" | "register"
  error: null,
  submitting: false,
};

// When running as the actual website, relative "api/..." calls work fine
// (same origin). When running as the Android app, the app's pages are
// bundled locally and served from their own origin, not this domain - so
// API calls need the real, full URL instead. Edit REMOTE_API_BASE below to
// your actual deployed domain before building the Android app; the website
// itself ignores this constant entirely.
const REMOTE_API_BASE = "https://yourdomain.com/sql-academy/api/";

function isNativeApp() {
  return typeof Capacitor !== "undefined" && Capacitor.isNativePlatform && Capacitor.isNativePlatform();
}

async function apiCall(path, options = {}) {
  const base = isNativeApp() ? REMOTE_API_BASE : "api/";
  const res = await fetch(`${base}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = {};
  try { data = await res.json(); } catch (e) { /* non-JSON error page, fall through */ }
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function fetchCurrentUser() {
  apiCall("me.php")
    .then((data) => { authState.user = data.user; })
    .catch(() => { authState.user = null; })
    .finally(() => { authState.loaded = true; render(); });
}

function resetModule() {
  state.moduleId = null;
  state.moduleLessonIdx = -1;
}

function moduleLessonKey(moduleId, idx) {
  return `module_${moduleId}_${idx}`;
}

// ---------- Theme (light/dark) ----------
// The actual html[data-theme] attribute is set by a tiny inline script in <head> before first
// paint (to avoid a flash of the wrong theme). This just reads/writes it after that point.
function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("qa-theme", theme); } catch (e) {}
}

let themeTransitionActive = false;

// Toggle with a circular "reveal" wipe expanding from the button, using the View Transitions
// API (this is the version that was smooth on desktop). Duration is shortened on coarse-pointer
// (touch) devices: the API works by rasterizing a full-page snapshot of the old and new state
// and animating between those images, and that raster cost scales with device pixel ratio,
// which runs 2-3x higher on phones than on a laptop screen. A shorter animation gives the
// compositor less time to fall behind on that heavier workload, so the same effect holds up
// better on phones without changing what it looks like. Falls back to an instant switch when
// the browser lacks View Transitions support or the user asked for reduced motion.
function toggleTheme(e) {
  if (themeTransitionActive) return;
  const next = getTheme() === "dark" ? "light" : "dark";
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const apply = () => { applyTheme(next); render(); };

  if (prefersReduced || !document.startViewTransition) {
    apply();
    return;
  }

  const rect = e.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const duration = isCoarsePointer ? 420 : 650;

  const isGoingDark = next === "dark";
  themeTransitionActive = true;
  const transition = document.startViewTransition(apply);

  transition.ready.then(() => {
    const clipFrom = `circle(0px at ${x}px ${y}px)`;
    const clipTo = `circle(${endRadius}px at ${x}px ${y}px)`;
    document.documentElement.animate(
      { clipPath: isGoingDark ? [clipFrom, clipTo] : [clipTo, clipFrom] },
      {
        duration,
        easing: "cubic-bezier(0.76, 0, 0.24, 1)",
        pseudoElement: isGoingDark ? "::view-transition-new(root)" : "::view-transition-old(root)",
      }
    );
  });

  transition.finished.finally(() => { themeTransitionActive = false; });
}

// ---------- Color helpers for the course-card glow (see .course-card .edge-light in style.css) ----------
function hexToHsl(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Builds a one-color glow ramp from a course's own accent (lightened slightly for a nicer
// glow) instead of the generic purple/pink/blue mesh the original component defaults to.
function glowVarsForAccent(hex) {
  const { h, s, l } = hexToHsl(hex);
  const base = `${h}deg ${Math.min(s + 8, 100)}% ${Math.min(l + 8, 78)}%`;
  return [
    ["", 100], ["-60", 60], ["-40", 40], ["-20", 20], ["-10", 10],
  ].map(([suffix, op]) => `--glow-color${suffix}:hsl(${base} / ${op}%)`).join(";");
}

// Per-card pointer tracking for the edge glow: computes how close the cursor is to the card's
// edge and which direction it's coming from, purely with CSS custom properties (no React state).
function handleCardGlowMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  let kx = Infinity, ky = Infinity;
  if (dx !== 0) kx = cx / Math.abs(dx);
  if (dy !== 0) ky = cy / Math.abs(dy);
  const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  let angle = 0;
  if (dx !== 0 || dy !== 0) {
    const degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    angle = degrees < 0 ? degrees + 360 : degrees;
  }
  card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
  card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
}

let dbInstance = null;
let dbReady = false;
let liveCharts = {};

// per-lesson mini playground state, keyed by "track_idx"
const miniPlaygrounds = {};
// per-lesson challenge reveal state, keyed by "track_idx"
const challengeState = {};

// ---------- Data Analytics widget state & helpers (no SQL involved) ----------
const kpiState = {};
const statsCalcData = {};
const pivotState = {};
const trendState = {};
const insightState = {};
const percentCalcState = {};
const weightedAvgData = {};
const comparisonState = {};
const forecastData = {};
const funnelData = {};
const clvState = {};
const csharpPlaygrounds = {};
const pythonPlaygrounds = {};
const excelGrids = {};
const cliSims = {};
const cloudCostState = {};
const costCompareState = {};
const daxCalcState = {};
const jsPlaygrounds = {};

// ---------- Simplified DAX practice engine ----------
// This is deliberately NOT a full DAX parser - it supports a small, clearly-scoped
// set of common patterns (SUM, AVERAGE, COUNTROWS, CALCULATE with a filter, DIVIDE,
// SUMX) against one small demo table, purely for practicing DAX's syntax and logic.
const POWERBI_SALES = [
  { Product: "Widget A", Region: "North", Amount: 1200, Quantity: 5 },
  { Product: "Widget B", Region: "South", Amount: 800, Quantity: 3 },
  { Product: "Widget A", Region: "South", Amount: 1500, Quantity: 6 },
  { Product: "Widget C", Region: "North", Amount: 600, Quantity: 2 },
  { Product: "Widget B", Region: "North", Amount: 900, Quantity: 4 },
];

function daxSplitArgs(s) {
  const args = [];
  let depth = 0, current = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      args.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function daxParseCall(expr) {
  const m = expr.match(/^([A-Za-z]+)\((.*)\)$/s);
  return m ? { fn: m[1].toUpperCase(), argsStr: m[2] } : null;
}

function daxColumnRef(token) {
  const m = token.trim().match(/^(\w+)\[(\w+)\]$/);
  return m ? { table: m[1], col: m[2] } : null;
}

function daxApplyFilter(rows, filterExpr) {
  const m = filterExpr.match(/^\w+\[(\w+)\]\s*(=|<>|>=|<=|>|<)\s*(.+)$/);
  if (!m) throw new Error(`Couldn't understand filter: ${filterExpr}`);
  const [, col, op, rawVal] = m;
  let val = rawVal.trim();
  val = val.startsWith('"') && val.endsWith('"') ? val.slice(1, -1) : Number(val);
  return rows.filter((r) => {
    const cell = r[col];
    if (op === "=") return cell == val;
    if (op === "<>") return cell != val;
    if (op === ">") return cell > val;
    if (op === "<") return cell < val;
    if (op === ">=") return cell >= val;
    return cell <= val;
  });
}

function daxEval(expr, rows) {
  expr = expr.trim();
  const num = Number(expr);
  if (!isNaN(num) && expr !== "") return num;

  const call = daxParseCall(expr);
  if (!call) throw new Error(`Couldn't parse: ${expr}`);
  const args = daxSplitArgs(call.argsStr);

  switch (call.fn) {
    case "SUM": {
      const ref = daxColumnRef(args[0]);
      if (!ref) throw new Error("SUM expects a Table[Column] argument");
      return rows.reduce((s, r) => s + (Number(r[ref.col]) || 0), 0);
    }
    case "AVERAGE": {
      const ref = daxColumnRef(args[0]);
      if (!rows.length) return 0;
      return rows.reduce((s, r) => s + (Number(r[ref.col]) || 0), 0) / rows.length;
    }
    case "COUNTROWS":
      return rows.length;
    case "COUNT": {
      const ref = daxColumnRef(args[0]);
      return rows.filter((r) => r[ref.col] !== undefined && r[ref.col] !== "").length;
    }
    case "MIN": {
      const ref = daxColumnRef(args[0]);
      return rows.length ? Math.min(...rows.map((r) => Number(r[ref.col]) || 0)) : 0;
    }
    case "MAX": {
      const ref = daxColumnRef(args[0]);
      return rows.length ? Math.max(...rows.map((r) => Number(r[ref.col]) || 0)) : 0;
    }
    case "CALCULATE": {
      let filtered = rows;
      for (let i = 1; i < args.length; i++) filtered = daxApplyFilter(filtered, args[i]);
      return daxEval(args[0], filtered);
    }
    case "DIVIDE": {
      const numerator = daxEval(args[0], rows);
      const denominator = daxEval(args[1], rows);
      return denominator === 0 ? 0 : numerator / denominator;
    }
    case "SUMX": {
      const rowExpr = args[1];
      let total = 0;
      for (const r of rows) {
        const substituted = rowExpr.replace(/\w+\[(\w+)\]/g, (m, col) => String(Number(r[col]) || 0));
        if (!/^[\d\s+\-*/().]+$/.test(substituted)) throw new Error("Unsupported expression inside SUMX for this practice tool.");
        total += Function(`"use strict"; return (${substituted});`)();
      }
      return total;
    }
    default:
      throw new Error(`"${call.fn}" isn't supported in this simplified practice tool.`);
  }
}

function runDax(formula) {
  try {
    const result = daxEval(formula, POWERBI_SALES);
    return { result: Math.round(result * 100) / 100 };
  } catch (e) {
    return { error: e.message };
  }
}

// ---------- Excel spreadsheet engine via HyperFormula (real Excel-compatible formulas,
// runs entirely in the browser - no third-party service needed, like Pyodide). ----------
function colLetter(col) {
  return String.fromCharCode(65 + col);
}

function formatCellValue(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    if ("value" in v) return String(v.value);
    if ("message" in v) return String(v.message);
    return String(v);
  }
  if (typeof v === "number") {
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 10000) / 10000);
  }
  return String(v);
}

function computeGrid(raw) {
  try {
    const hf = HyperFormula.buildFromArray(raw, { licenseKey: "gpl-v3" });
    const rows = raw.length, cols = raw[0] ? raw[0].length : 0;
    const results = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push(formatCellValue(hf.getCellValue({ sheet: 0, row: r, col: c })));
      }
      results.push(row);
    }
    hf.destroy();
    return results;
  } catch (e) {
    return null;
  }
}

// ---------- Python execution via Pyodide (real Python, compiled to WebAssembly, runs
// entirely in the browser - no third-party service needed, unlike the C# playground). ----------
let pyodideInstance = null;
let pyodideLoadPromise = null;
function getPyodide() {
  if (pyodideLoadPromise) return pyodideLoadPromise;
  pyodideLoadPromise = window.loadPyodide().then((py) => {
    pyodideInstance = py;
    return py;
  });
  return pyodideLoadPromise;
}

async function runPython(code, stdin) {
  try {
    const py = await getPyodide();
    const stdinLines = (stdin || "").split("\n");
    py.globals.set("_user_code", code);
    py.globals.set("_stdin_lines", stdinLines);

    const wrapped = `
import sys, io, builtins, traceback

_stdin_iter = iter(_stdin_lines)
def _fake_input(prompt=""):
    try:
        return next(_stdin_iter)
    except StopIteration:
        return ""
builtins.input = _fake_input

_stdout = io.StringIO()
_old_stdout = sys.stdout
sys.stdout = _stdout
_capture_error = None
try:
    exec(_user_code, {})
except Exception:
    _capture_error = traceback.format_exc()
finally:
    sys.stdout = _old_stdout
_capture_output = _stdout.getvalue()
`;
    await py.runPythonAsync(wrapped);
    const output = py.globals.get("_capture_output");
    const error = py.globals.get("_capture_error");
    return { output: output || "", error: error || null };
  } catch (e) {
    return { error: "Couldn't start the Python engine right now: " + e.message };
  }
}

// ---------- C# execution via Wandbox's free public online compiler ----------
// No API key required, and the service documents CORS support (Access-Control-Allow-Origin: *),
// so this can be called directly from the browser. This is a third-party free service, not
// something we control - if it's ever unreachable, the playground shows a clear error instead
// of pretending to succeed.
let wandboxCompilerPromise = null;
function getWandboxCompiler() {
  if (wandboxCompilerPromise) return wandboxCompilerPromise;
  wandboxCompilerPromise = fetch("https://wandbox.org/api/list.json")
    .then((r) => r.json())
    .then((list) => {
      const csharpCompilers = list.filter((c) => c.language === "C#");
      const preferred = csharpCompilers.find((c) => c.name.startsWith("mcs")) || csharpCompilers[0];
      return preferred ? preferred.name : null;
    })
    .catch(() => null);
  return wandboxCompilerPromise;
}

async function runCSharp(code, stdin) {
  const compilerName = await getWandboxCompiler();
  if (!compilerName) {
    return { error: "Couldn't reach the online C# compiler service right now. Check your connection and try again in a moment." };
  }
  try {
    const res = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compiler: compilerName, code, stdin: stdin || "", save: false }),
    });
    if (!res.ok) throw new Error("request failed");
    const data = await res.json();
    const compileFailed = data.status !== "0" && data.status !== 0 && !data.program_output;
    return {
      output: data.program_output || "",
      runtimeError: data.program_error || "",
      compileError: compileFailed ? data.compiler_error || data.compiler_message || "Compilation failed." : "",
    };
  } catch (e) {
    return { error: "Couldn't reach the online C# compiler service right now. Check your connection and try again in a moment." };
  }
}

function pearson(xs, ys) {
  const n = xs.length;
  const mx = mean(xs), my = mean(ys);
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my;
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
function sumOf(arr) { return arr.reduce((a, b) => a + b, 0); }
function minOf(arr) { return arr.length ? Math.min(...arr) : 0; }
function maxOf(arr) { return arr.length ? Math.max(...arr) : 0; }

function stdev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = mean(arr.map((x) => (x - m) ** 2));
  return Math.sqrt(variance);
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function linearRegression(xs, ys) {
  const n = xs.length;
  const mx = mean(xs), my = mean(ys);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = my - slope * mx;
  return { slope, intercept };
}

function groupByAgg(data, groupField, metricField, agg) {
  const groups = {};
  data.forEach((row) => {
    const g = row[groupField];
    if (!groups[g]) groups[g] = [];
    groups[g].push(row[metricField]);
  });
  return Object.entries(groups).map(([g, vals]) => {
    let value;
    if (agg === "sum") value = sumOf(vals);
    else if (agg === "avg") value = mean(vals);
    else if (agg === "count") value = vals.length;
    else if (agg === "min") value = minOf(vals);
    else value = maxOf(vals);
    return { group: g, value: Math.round(value * 100) / 100 };
  });
}

const PIVOT_CONFIG = {
  employees: { data: DA_EMPLOYEES, groupField: "department", metricField: "salary", label: "Employees — grouped by department" },
  orders: { data: DA_ORDERS, groupField: "status", metricField: "amount", label: "Orders — grouped by status" },
  cohort: {
    data: DA_EMPLOYEES.map((e) => ({ ...e, hireYear: e.hireDate.slice(0, 4) })),
    groupField: "hireYear",
    metricField: "salary",
    label: "Employees — grouped by hire-year cohort",
  },
};

// ---------- Tiny inline icon set (no icon library needed) ----------
function icon(name, color, size) {
  size = size || 18;
  const stroke = `stroke="${color}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const paths = {
    terminal: `<polyline points="4 17 10 11 4 5" ${stroke}/><line x1="12" y1="19" x2="20" y2="19" ${stroke}/>`,
    database: `<ellipse cx="12" cy="5" rx="8" ry="3" ${stroke}/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" ${stroke}/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" ${stroke}/>`,
    sparkles: `<path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" ${stroke}/>`,
    book: `<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 0-3 3z" ${stroke}/><path d="M4 4v16" ${stroke}/>`,
    lock: `<rect x="5" y="11" width="14" height="9" rx="2" ${stroke}/><path d="M8 11V7a4 4 0 0 1 8 0v4" ${stroke}/>`,
    chevron: `<polyline points="9 6 15 12 9 18" ${stroke}/>`,
    play: `<polygon points="6 4 20 12 6 20" fill="${color}" stroke="none"/>`,
    message: `<path d="M4 4h16v12H8l-4 4z" ${stroke}/>`,
    close: `<line x1="5" y1="5" x2="19" y2="19" ${stroke}/><line x1="19" y1="5" x2="5" y2="19" ${stroke}/>`,
    check: `<polyline points="4 12 9 17 20 6" ${stroke}/>`,
    x: `<circle cx="12" cy="12" r="9" ${stroke}/><line x1="9" y1="9" x2="15" y2="15" ${stroke}/><line x1="15" y1="9" x2="9" y2="15" ${stroke}/>`,
    bulb: `<path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2.2h5A3 3 0 0 1 15.6 12.8 6 6 0 0 0 12 2z" ${stroke}/>`,
    warn: `<path d="M12 3l10 18H2z" ${stroke}/><line x1="12" y1="10" x2="12" y2="14" ${stroke}/><circle cx="12" cy="17" r="0.6" fill="${color}" stroke="none"/>`,
    target: `<circle cx="12" cy="12" r="8" ${stroke}/><circle cx="12" cy="12" r="4" ${stroke}/><circle cx="12" cy="12" r="0.7" fill="${color}" stroke="none"/>`,
    cloud: `<path d="M7 18a4 4 0 0 1-1-7.9A5 5 0 0 1 15 8a4.5 4.5 0 0 1 1 8.9" ${stroke}/><path d="M7 18h9" ${stroke}/>`,
    moon: `<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" ${stroke}/>`,
    layers: `<path d="M12 3 3 8l9 5 9-5-9-5z" ${stroke}/><path d="M3 12l9 5 9-5" ${stroke}/><path d="M3 16l9 5 9-5" ${stroke}/>`,
    link: `<circle cx="8" cy="12" r="5" ${stroke}/><circle cx="16" cy="12" r="5" ${stroke}/>`,
    blocks: `<rect x="4" y="4" width="10" height="10" rx="2" ${stroke}/><rect x="10" y="10" width="10" height="10" rx="2" ${stroke}/>`,
    repeat: `<polyline points="17 1 21 5 17 9" ${stroke}/><path d="M3 11V9a4 4 0 0 1 4-4h14" ${stroke}/><polyline points="7 23 3 19 7 15" ${stroke}/><path d="M21 13v2a4 4 0 0 1-4 4H3" ${stroke}/>`,
    plug: `<path d="M9 2v6M15 2v6" ${stroke}/><path d="M7 8h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8z" ${stroke}/><path d="M12 17v5" ${stroke}/>`,
    mail: `<rect x="3" y="5" width="18" height="14" rx="2" ${stroke}/><path d="M3 7l9 6 9-6" ${stroke}/>`,
    eye: `<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" ${stroke}/><circle cx="12" cy="12" r="3" ${stroke}/>`,
    eyeOff: `<path d="M3 3l18 18" ${stroke}/><path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a15.6 15.6 0 0 1-3.4 4.3M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7c1.4 0 2.6-.3 3.7-.8" ${stroke}/><path d="M9.9 10a3 3 0 0 0 4.2 4.2" ${stroke}/>`,
    spinner: `<circle cx="12" cy="12" r="9" stroke="${color}" stroke-width="2.2" fill="none" opacity="0.25"/><path d="M21 12a9 9 0 0 0-9-9" stroke="${color}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  };
  return `<svg class="icon-svg" width="${size}" height="${size}" viewBox="0 0 24 24">${paths[name] || ""}</svg>`;
}

// ---------- sql.js engine setup ----------
function getDb() {
  if (dbInstance) return Promise.resolve(dbInstance);
  return window
    .initSqlJs({ locateFile: (f) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${f}` })
    .then((SQL) => {
      dbInstance = new SQL.Database();
      dbInstance.run(SEED_SQL);
      dbReady = true;
      return dbInstance;
    });
}

function runSQL(sql) {
  if (!dbReady) return { error: "Engine still loading, try again in a second." };
  try {
    const res = dbInstance.exec(sql);
    if (res.length === 0) return { columns: [], rows: [] };
    const { columns, values } = res[res.length - 1];
    const rows = values.map((row) => {
      const o = {};
      columns.forEach((c, i) => (o[c] = row[i]));
      return o;
    });
    return { columns, rows };
  } catch (e) {
    return { error: e.message };
  }
}

// ---------- AI tutor client (calls PHP backend, falls back locally) ----------
const FALLBACK_QA = [
  { keys: ["select"], a: "SELECT tells the database which columns you want. SELECT name, salary FROM employees returns just those two columns." },
  { keys: ["where"], a: "WHERE filters rows before they're returned. SELECT * FROM employees WHERE department = 'Sales' only shows Sales employees." },
  { keys: ["order by", "sort"], a: "ORDER BY sorts your results. Add DESC for highest-to-lowest, or leave it (or add ASC) for lowest-to-highest." },
  { keys: ["join"], a: "JOIN combines rows from two tables that share a related column, e.g. matching orders.employee_id to employees.id." },
  { keys: ["group by"], a: "GROUP BY bundles rows that share a value so you can summarize them, like counting orders per employee." },
  { keys: ["window"], a: "A window function calculates something across related rows without collapsing them into one row, unlike GROUP BY." },
  { keys: ["index"], a: "An index helps the database find matching rows fast without scanning the whole table, like a book's index." },
  { keys: ["transaction"], a: "A transaction bundles statements so they all succeed or all fail together, keeping your data consistent." },
  { keys: ["cte", "with"], a: "A CTE (WITH ... AS) names a temporary result set you can reference later in the same query, like a helper query." },
  { keys: ["primary key"], a: "A primary key is a column (like id) that uniquely identifies each row — no two rows share the same value." },
  { keys: ["kpi"], a: "A KPI is a specific, trackable number tied to a business goal, like revenue or average order value — good KPIs are simple, hard to game, and clearly tied to an outcome." },
  { keys: ["median"], a: "The median is the middle value when data is sorted — it resists being skewed by outliers, unlike the mean (average)." },
  { keys: ["mean", "average"], a: "The mean is the sum of all values divided by how many there are. If one value is much larger than the rest, it can pull the mean away from what's 'typical.'" },
  { keys: ["segment"], a: "Segmentation means breaking a metric down by category (like department or region) instead of looking at one overall number — that's often where the real insight is hiding." },
  { keys: ["correlation", "causation"], a: "Correlation means two things move together; causation means one actually causes the other. Correlation alone never proves causation — there could be a shared underlying cause." },
];

function fallbackReply(msg) {
  const lower = msg.toLowerCase();
  const hit = FALLBACK_QA.find((qa) => qa.keys.some((k) => lower.includes(k)));
  return hit ? hit.a : "Good question. I can help most with SELECT, WHERE, JOIN, GROUP BY, window functions, indexes, transactions, and CTEs — try rephrasing around one of those.";
}

async function askTutor(message, lessonContext) {
  try {
    const res = await fetch("api/tutor.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lesson: lessonContext || "" }),
    });
    if (!res.ok) throw new Error("backend unavailable");
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.reply;
  } catch (e) {
    return fallbackReply(message);
  }
}

// ---------- Data lookups ----------
function getLessons(courseId, level, track) {
  const course = COURSE_CONTENT[courseId];
  if (!course || !course[level]) return [];
  return course[level][track] || [];
}

function getQuizItems(courseId, level, track) {
  const course = COURSE_CONTENT[courseId];
  if (!course || !course[level]) return [];
  return course[level].quiz[track] || course[level].quiz.basic || [];
}

function lessonKey(courseId, level, track, idx) {
  return `${courseId}_${level}_${track}_${idx}`;
}

// ---------- Rendering ----------
function render() {
  const app = document.getElementById("app");
  app.innerHTML = state.view === "catalog" ? renderCatalog() : (state.moduleId ? renderModule() : renderCourse());
  renderTutorWidget();
  renderAuthModalRoot();
  attachHandlers();
  renderLiveCharts();
  upgradeCodeEditors();
}

function renderAuthModalRoot() {
  let el = document.getElementById("authModalRoot");
  if (!el) {
    el = document.createElement("div");
    el.id = "authModalRoot";
    document.body.appendChild(el);
  }
  // Only play the entrance animation on the actual open transition (closed
  // -> open), not on every re-render while it stays open - switching tabs,
  // showing an error, etc. all call render() too, and without this check
  // the whole card would replay its fade-in every time, reading as a flash/blink.
  const isFreshOpen = !!authState.modalView && authModalPrevView === null;
  el.innerHTML = renderAuthModal(isFreshOpen);
  authModalPrevView = authState.modalView;
}
let authModalPrevView = null;

// ---------- CodeMirror upgrade for the four code editors (SQL/Python/C#/JS) ----------
// render() rebuilds #app's innerHTML on every call, which tears down any
// previous CodeMirror instances along with their now-detached textareas -
// so every render() re-upgrades whichever plain <textarea data-cm-mode="...">
// elements are currently in the DOM into fresh CodeMirror editors, wiring
// their content straight back into the same state objects the old plain
// oninput handlers used to update.
const CM_MODES = {
  python: "python",
  csharp: "text/x-csharp",
  javascript: "javascript",
  sql: "text/x-sql",
};
function upgradeCodeEditors() {
  if (typeof CodeMirror === "undefined") return; // CDN not loaded yet/failed - plain textarea still works
  document.querySelectorAll("textarea[data-cm-mode]").forEach((textarea) => {
    const modeKey = textarea.dataset.cmMode;
    const key = textarea.dataset.key;
    const cm = CodeMirror.fromTextArea(textarea, {
      mode: CM_MODES[modeKey] || "text/plain",
      theme: getTheme() === "dark" ? "material-darker" : "default",
      lineNumbers: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      matchBrackets: true,
      autoCloseBrackets: true,
      viewportMargin: Infinity,
      extraKeys: { "Shift-Tab": "indentLess" },
    });
    cm.on("change", (instance) => {
      const value = instance.getValue();
      if (modeKey === "python" && pythonPlaygrounds[key]) pythonPlaygrounds[key].code = value;
      else if (modeKey === "csharp" && csharpPlaygrounds[key]) csharpPlaygrounds[key].code = value;
      else if (modeKey === "javascript" && jsPlaygrounds[key]) jsPlaygrounds[key].code = value;
      else if (modeKey === "sql") {
        if (textarea.id === "playgroundInput") playgroundQuery = value;
        else if (miniPlaygrounds[key]) miniPlaygrounds[key].query = value;
      }
    });
  });
}

function renderTopNav() {
  const isDark = getTheme() === "dark";
  return `
    <div class="flex items-center justify-between topnav">
      <div class="flex items-center gap-2 brand" data-action="go-catalog">
        ${icon("terminal", COLORS.cyan, 20)}
        <span class="brand-text">query<span style="color:${COLORS.cyan}">.academy</span></span>
      </div>
      <div class="flex items-center gap-3">
        <button class="theme-toggle" data-action="toggle-theme" aria-label="${isDark ? "Switch to light mode" : "Switch to dark mode"}" title="${isDark ? "Switch to light mode" : "Switch to dark mode"}">
          ${isDark ? icon("moon", COLORS.dkCyan, 16) : icon("bulb", COLORS.amber, 17)}
        </button>
        <span class="pill" style="color:${COLORS.amber};border-color:${COLORS.amber}55;background:${COLORS.amber}14">beta</span>
        ${renderAuthNav()}
      </div>
    </div>`;
}

function renderAuthNav() {
  if (!authState.loaded) return "";
  if (!authState.user) {
    return `<button class="auth-cta" data-action="open-auth-login">${icon("terminal", "#ffffff", 14)}<span>Sign in</span></button>`;
  }
  const u = authState.user;
  const initial = escapeHtml(u.name.trim().charAt(0).toUpperCase() || "?");
  return `
    <div class="account-menu">
      <div class="account-chip">
        <span class="account-avatar">${initial}</span>
        <span class="account-name">${escapeHtml(u.name)}</span>
        ${u.role === "admin" ? `<span class="admin-badge">${icon("sparkles", "#ffffff", 10)}admin</span>` : ""}
      </div>
      <button class="account-logout" data-action="do-logout" title="Log out">${icon("close", COLORS.sub, 13)}</button>
    </div>`;
}

function renderAuthModal(animate) {
  if (!authState.modalView) return "";
  const isLogin = authState.modalView === "login";
  const errorHtml = authState.error
    ? `<div class="auth-error">${icon("warn", COLORS.red, 15)}<span>${escapeHtml(authState.error)}</span></div>`
    : "";
  return `
    <div class="modal-backdrop ${animate ? "auth-anim" : ""}" data-action="close-auth-modal">
      <div class="auth-card ${animate ? "auth-anim" : ""}">
        <div class="auth-card-glow"></div>
        <div class="auth-card-inner">
          <div class="auth-termbar">
            <span class="auth-dot" style="background:${COLORS.red}"></span>
            <span class="auth-dot" style="background:${COLORS.amber}"></span>
            <span class="auth-dot" style="background:${COLORS.green}"></span>
            <span class="auth-termbar-label">~/query.academy/auth<span class="auth-caret">_</span></span>
            <button class="account-logout" data-action="dismiss-auth-modal" style="margin-left:auto">${icon("close", COLORS.sub, 14)}</button>
          </div>

          <div class="auth-body">
            <div class="auth-tabs">
              <button type="button" class="auth-tab ${isLogin ? "active" : ""}" data-action="switch-auth-view" data-view="login">Sign in</button>
              <button type="button" class="auth-tab ${!isLogin ? "active" : ""}" data-action="switch-auth-view" data-view="register">Register</button>
              <span class="auth-tab-indicator" style="transform:translateX(${isLogin ? "0" : "100%"})"></span>
            </div>

            <h2 class="auth-heading">${isLogin ? "Welcome back" : "Create your account"}</h2>
            <p class="auth-subheading">${isLogin ? "Sign in to pick up where you left off." : "Join query.academy and start building."}</p>

            ${errorHtml}

            <form data-action="submit-auth-form" novalidate>
              ${isLogin ? "" : `
              <div class="auth-field">
                <label class="auth-label" for="auth-name">Name</label>
                <div class="auth-input-wrap">
                  ${icon("terminal", "var(--sub)", 15)}
                  <input class="auth-input" id="auth-name" type="text" name="name" placeholder="Ada Lovelace" autocomplete="name" required maxlength="100" />
                </div>
              </div>`}
              <div class="auth-field">
                <label class="auth-label" for="auth-email">Email</label>
                <div class="auth-input-wrap">
                  ${icon("mail", "var(--sub)", 15)}
                  <input class="auth-input" id="auth-email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required maxlength="190" />
                </div>
              </div>
              <div class="auth-field">
                <label class="auth-label" for="auth-password">Password</label>
                <div class="auth-input-wrap">
                  ${icon("lock", "var(--sub)", 15)}
                  <input class="auth-input" id="auth-password" type="password" name="password" placeholder="${isLogin ? "••••••••" : "At least 8 characters"}" autocomplete="${isLogin ? "current-password" : "new-password"}" required minlength="${isLogin ? "1" : "8"}" />
                  <button type="button" class="auth-eye" data-action="toggle-password-visibility" tabindex="-1" aria-label="Show password">${icon("eye", "var(--sub)", 16)}</button>
                </div>
              </div>
              <button class="auth-submit" type="submit" ${authState.submitting ? "disabled" : ""}>
                ${authState.submitting ? `${icon("spinner", "#ffffff", 15)}<span class="auth-spin">Please wait</span>` : `<span>${isLogin ? "Sign in" : "Create account"}</span>${icon("chevron", "#ffffff", 15)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>`;
}

function renderCatalog() {
  const cards = COURSES.map((c) => {
    const active = c.status === "active";
    const glowVars = active ? glowVarsForAccent(c.accent) : "";
    return `
      <div class="course-card ${active ? "active" : "locked"}" style="${active ? `border-color:${c.accent}40;--card-accent:${c.accent};${glowVars}` : ""}" ${active ? `data-action="go-course" data-course="${c.id}"` : ""}>
        ${active ? `<span class="edge-light"></span>` : ""}
        <div class="flex items-center justify-between course-card-top">
          <div class="course-icon" style="background:${c.accent}1A">${icon(c.icon, c.accent, 18)}</div>
          ${!active ? icon("lock", COLORS.sub, 14) : c.id === "sql" ? `<span class="badge-recommended">Start here</span>` : ""}
        </div>
        <div class="course-title">${c.title}</div>
        <div class="course-tagline">${c.tagline}</div>
        ${active ? `<div class="course-start" style="color:${c.accent}">Start course ${icon("chevron", c.accent, 13)}</div>` : ""}
      </div>`;
  }).join("");

  return `
    ${renderTopNav()}
    <div class="page-wrap">
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="pill" style="color:${COLORS.cyan};border-color:${COLORS.cyan}55;background:${COLORS.cyan}14">learn by running real queries</span>
          <h1 class="hero-title">Skills that show up in <span style="color:${COLORS.cyan}">your terminal</span>, not just your notes.</h1>
          <p class="hero-sub">Eight hands-on tracks. Every lesson has its own working playground, a real takeaway, a common mistake to avoid, and a challenge to try yourself. A tutor checks in after every lesson so nothing gets skipped.</p>
        </div>
        <div class="hero-demo-wrap">
          <div class="hero-demo-tag"><span class="live-dot"></span>Live in your browser, runs on a real SQLite engine</div>
          ${renderMiniPlayground("hero-demo", "SELECT name, department, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 5;")}
        </div>
      </div>
      <div class="catalog-heading-row">
        <h2 class="catalog-heading">Pick a track to start</h2>
        <p class="catalog-subheading">Each one runs Entry, Professional, and Master levels back to back.</p>
      </div>
      <div class="grid grid-sm-2 grid-md-3">${cards}</div>
    </div>`;
}

function renderLessonContent(lesson, key) {
  let visual = "";
  if (lesson.visual === "diagram") {
    visual = `<div class="visual-panel">${erDiagramSvg()}</div>`;
  } else if (lesson.visual === "diagram-analytics-flow") {
    visual = `<div class="visual-panel">${analyticsFlowDiagramSvg()}</div>`;
  } else if (lesson.visual === "diagram-oop-inheritance") {
    visual = `<div class="visual-panel">${oopInheritanceDiagramSvg()}</div>`;
  } else if (lesson.visual === "chart") {
    visual = `<div class="chart-panel"><canvas id="staticSalaryChart"></canvas></div>`;
  } else if (lesson.visual === "chart-live") {
    visual = `<div class="chart-panel"><canvas id="liveChart"></canvas></div>`;
  } else if (lesson.visual === "code") {
    visual = `<div class="code-panel">${escapeHtml(lesson.query || "")}</div>`;
  }

  return `
    <h2 class="lesson-title">${lesson.title}</h2>
    <p class="lesson-body">${lesson.body}</p>
    ${visual}
    ${lesson.isCheatsheet ? renderCheatsheet(lesson.refTable) : ""}
    ${lesson.query ? renderMiniPlayground(key, lesson.query) : ""}
    ${lesson.code ? renderCSharpPlayground(key, lesson.code) : ""}
    ${lesson.pycode ? renderPythonPlayground(key, lesson.pycode) : ""}
    ${lesson.jscode ? renderJSPlayground(key, lesson.jscode) : ""}
    ${lesson.sheet ? renderExcelGrid(key, lesson.sheet) : ""}
    ${lesson.cli ? renderCliSim(key, lesson.cli) : ""}
    ${lesson.widget === "cloud-cost-calc" ? renderCloudCostCalc(key) : ""}
    ${lesson.widget === "cost-compare-calc" ? renderCostCompareCalc(key) : ""}
    ${lesson.dax ? renderDaxCalc(key, lesson.dax) : ""}
    ${lesson.widget === "kpi-cards" ? renderKpiCards(key) : ""}
    ${lesson.widget === "stats-calc" ? renderStatsCalc(key) : ""}
    ${lesson.widget === "trend-builder" ? renderTrendBuilder(key) : ""}
    ${lesson.widget === "pivot-builder" ? renderPivotBuilder(key) : ""}
    ${lesson.widget === "pivot-builder-cohort" ? renderPivotBuilder(key, "cohort") : ""}
    ${lesson.widget === "insight-check" ? renderInsightCheck(key, lesson.insightCheck) : ""}
    ${lesson.widget === "percent-calc" ? renderPercentCalc(key) : ""}
    ${lesson.widget === "weighted-avg-calc" ? renderWeightedAvgCalc(key) : ""}
    ${lesson.widget === "comparison-cards" ? renderComparisonCards(key) : ""}
    ${lesson.widget === "correlation-calc" ? renderCorrelationCalc(key) : ""}
    ${lesson.widget === "forecast-calc" ? renderForecastCalc(key) : ""}
    ${lesson.widget === "percentile-calc" ? renderPercentileCalc() : ""}
    ${lesson.widget === "regression-calc" ? renderRegressionCalc(key) : ""}
    ${lesson.widget === "outlier-detector" ? renderOutlierDetector() : ""}
    ${lesson.widget === "funnel-calc" ? renderFunnelCalc(key) : ""}
    ${lesson.widget === "clv-calc" ? renderClvCalc(key) : ""}
    ${lesson.refBox ? renderRefBox(lesson.refBox) : ""}
    ${lesson.keyTakeaway ? renderCallout("takeaway", "bulb", "Key takeaway", lesson.keyTakeaway) : ""}
    ${lesson.commonMistake ? renderCallout("mistake", "warn", "Common mistake", lesson.commonMistake) : ""}
    ${lesson.challenge ? renderChallenge(key, lesson.challenge, Boolean(lesson.query || lesson.code || lesson.pycode || lesson.jscode)) : ""}
    ${renderTutorCheckin(lesson)}
  `;
}

function renderCourse() {
  const course = COURSES.find((c) => c.id === state.courseId) || COURSES[0];
  const lessons = getLessons(state.courseId, state.level, state.track);
  const atPractice = state.lessonIdx >= lessons.length;
  const lesson = lessons[state.lessonIdx];

  const tabs = ["basic", "intermediate", "advanced"]
    .map((t) => `<button class="track-tab ${state.track === t ? "active" : ""}" data-action="set-track" data-track="${t}">${t}</button>`)
    .join("");

  let body;
  if (lessons.length === 0) {
    body = `
      <div class="locked-panel">
        ${icon("lock", COLORS.sub, 22)}
        <div class="locked-title">Coming soon</div>
        <div class="locked-sub">This track isn't ready yet.</div>
      </div>`;
  } else {
    const nav = lessons
      .map((l, i) => {
        if (l.isModuleStub) {
          const mod = MODULES[l.moduleId];
          if (!mod) return "";
          return `<button class="lesson-nav-item module-stub-item ${i === state.lessonIdx ? "active" : ""}" data-action="enter-module" data-idx="${i}" data-module="${l.moduleId}">
            ${icon(mod.icon || "layers", mod.accent, 14)}
            <span class="module-stub-text">${String(i + 1).padStart(2, "0")} &middot; ${mod.title}</span>
            <span class="module-stub-count">${mod.lessons.length} lessons</span>
          </button>`;
        }
        return `<button class="lesson-nav-item ${i === state.lessonIdx ? "active" : ""}" data-action="go-lesson" data-idx="${i}">${String(i + 1).padStart(2, "0")} &middot; ${l.title}</button>`;
      })
      .join("") + `<button class="lesson-nav-item practice ${atPractice ? "active" : ""}" data-action="go-practice">&#10003; Quiz + Playground</button>`;

    let content;
    if (!atPractice) {
      const key = lessonKey(state.courseId, state.level, state.track, state.lessonIdx);
      const lessonBody = lesson.isModuleStub
        ? (() => {
            const mod = MODULES[lesson.moduleId];
            if (!mod) return `<p class="lesson-body">This module isn't available right now.</p>`;
            return `
              <div class="module-intro" style="--module-accent:${mod.accent}">
                <div class="module-intro-icon">${icon(mod.icon || "layers", mod.accent, 22)}</div>
                <div class="mono-label">Module &middot; ${mod.lessons.length} lessons</div>
                <h2 class="module-title">${mod.title}</h2>
                <p class="module-tagline">${mod.tagline}</p>
                <div class="module-learn-box">
                  <div class="module-learn-heading">What you'll learn</div>
                  <ul class="module-learn-list">${mod.whatYouLearn.map((w) => `<li>${icon("check", mod.accent, 14)}<span>${w}</span></li>`).join("")}</ul>
                </div>
                <button class="run-btn" style="background:${mod.accent}" data-action="enter-module" data-idx="${state.lessonIdx}" data-module="${lesson.moduleId}">Open module ${icon("chevron", "#ffffff", 14)}</button>
              </div>`;
          })()
        : renderLessonContent(lesson, key);
      content = `
        <div class="section-label"><span class="mono-label">${String(state.lessonIdx + 1).padStart(2, "0")}</span><span class="rule"></span><span class="mono-label">lesson</span></div>
        ${lessonBody}
      `;
    } else {
      content = `
        <div class="flex flex-col gap-6">
          <div class="section-label"><span class="mono-label">${String(lessons.length + 1).padStart(2, "0")}</span><span class="rule"></span><span class="mono-label">practice</span></div>
          ${renderQuiz(state.courseId, state.level, state.track)}
          ${state.courseId === "sql" ? renderPlayground() : ""}
          ${state.courseId === "csharp" ? renderCSharpPlayground(`practice_${state.level}_${state.track}`, DEFAULT_CSHARP_STARTER) : ""}
          ${state.courseId === "python" ? renderPythonPlayground(`practice_${state.level}_${state.track}`, DEFAULT_PYTHON_STARTER) : ""}
          ${state.courseId === "javascript" ? renderJSPlayground(`practice_${state.level}_${state.track}`, DEFAULT_JS_STARTER) : ""}
          ${state.courseId === "excel" ? renderExcelGrid(`practice_${state.level}_${state.track}`, DEFAULT_EXCEL_SEED) : ""}
        </div>`;
    }

    body = `<div class="grid grid-md-sidebar"><div class="lesson-nav">${nav}</div><div>${content}</div></div>`;
  }

  return `
    ${renderTopNav()}
    <div class="page-wrap">
      <div class="back-link" data-action="go-catalog">&larr; all courses</div>
      <h1 class="course-page-title">${course.title}</h1>
      ${renderLevelSelector()}
      <div class="flex gap-2 track-tabs">${tabs}</div>
      ${body}
    </div>`;
}

function renderLevelSelector() {
  const tabs = LEVELS.map((lvl) => `<button class="level-tab ${state.level === lvl.id ? "active" : ""}" data-action="set-level" data-level="${lvl.id}">${lvl.label}</button>`).join("");
  return `<div class="flex gap-2 level-tabs">${tabs}</div>`;
}

// A deep-dive module (sub-course) is its own self-contained screen: an intro, its own
// mini progress bar stepping through the module's lessons, and a completion screen -
// reusing renderLessonContent() so every widget/challenge/tutor-checkin type still works.
function renderModule() {
  const mod = MODULES[state.moduleId];
  if (!mod) { resetModule(); return renderCourse(); }

  const course = COURSES.find((c) => c.id === state.courseId) || COURSES[0];
  const total = mod.lessons.length;
  const idx = state.moduleLessonIdx;

  const crumb = `
    <div class="module-crumb">
      <span class="module-crumb-link" data-action="exit-module">${course.title}</span>
      <span class="module-crumb-sep">${icon("chevron", COLORS.sub, 11)}</span>
      <span class="module-crumb-current">${mod.title}</span>
    </div>`;

  let body;
  if (idx === -1) {
    body = `
      <div class="module-intro" style="--module-accent:${mod.accent}">
        <div class="module-intro-icon">${icon(mod.icon || "layers", mod.accent, 22)}</div>
        <div class="mono-label">Module &middot; ${total} lessons</div>
        <h2 class="module-title">${mod.title}</h2>
        <p class="module-tagline">${mod.tagline}</p>
        <div class="module-learn-box">
          <div class="module-learn-heading">What you'll learn</div>
          <ul class="module-learn-list">${mod.whatYouLearn.map((w) => `<li>${icon("check", mod.accent, 14)}<span>${w}</span></li>`).join("")}</ul>
        </div>
        <button class="run-btn" style="background:${mod.accent}" data-action="module-start">Start module ${icon("chevron", "#ffffff", 14)}</button>
      </div>`;
  } else if (idx < total) {
    const lesson = mod.lessons[idx];
    const key = moduleLessonKey(mod.id, idx);
    const segs = mod.lessons.map((_, i) => `<span class="module-progress-seg ${i <= idx ? "filled" : ""}" style="${i <= idx ? `background:${mod.accent}` : ""}"></span>`).join("");
    body = `
      <div class="module-progress">
        <div class="module-progress-label"><span>Lesson ${idx + 1} of ${total}</span><span class="module-progress-title">${lesson.title}</span></div>
        <div class="module-progress-track">${segs}</div>
      </div>
      ${renderLessonContent(lesson, key)}
    `;
  } else {
    body = `
      <div class="module-outro" style="--module-accent:${mod.accent}">
        <div class="module-intro-icon">${icon("check", mod.accent, 22)}</div>
        <h2 class="module-title">Module complete</h2>
        <p class="module-tagline">You've been through all ${total} lessons on ${mod.title.toLowerCase()}. Ready to keep going with the rest of this track?</p>
        <div class="flex gap-2" style="margin-top:16px;justify-content:center">
          <button class="run-btn" style="background:${mod.accent}" data-action="exit-module-continue">Continue to next lesson ${icon("chevron", "#ffffff", 14)}</button>
          <button class="tutor-btn" data-action="module-lesson-nav" data-idx="0">Review from the start</button>
        </div>
      </div>`;
  }

  return `
    ${renderTopNav()}
    <div class="page-wrap">
      <div class="back-link" data-action="go-catalog">&larr; all courses</div>
      ${crumb}
      ${body}
    </div>`;
}

function renderCallout(kind, iconName, title, body) {
  const color = kind === "takeaway" ? COLORS.cyan : COLORS.amber;
  return `
    <div class="callout callout-${kind}">
      <div class="flex items-center gap-2 callout-title">${icon(iconName, color, 14)} ${title}</div>
      <div class="callout-body">${escapeHtml(body)}</div>
    </div>`;
}

// ---------- Syntax reference: inline "quick reference" call-outs + per-track cheatsheet lessons ----------
function renderRefBox(refBox) {
  return `
    <div class="callout callout-blue">
      <div class="flex items-center gap-2 callout-title">${icon("book", COLORS.blue, 14)} Quick reference</div>
      <div class="ref-syntax">${escapeHtml(refBox.syntax)}</div>
      <div class="callout-body">${escapeHtml(refBox.desc)}</div>
      ${refBox.example ? `<div class="ref-example">${escapeHtml(refBox.example)}</div>` : ""}
    </div>`;
}

function renderCheatsheet(refTable) {
  const rows = (refTable || [])
    .map(
      (r) => `
    <div class="cheatsheet-row">
      <div class="cheatsheet-syntax">${escapeHtml(r.syntax)}</div>
      <div class="cheatsheet-desc">${escapeHtml(r.desc)}</div>
      ${r.example ? `<div class="cheatsheet-example">${escapeHtml(r.example)}</div>` : ""}
    </div>`
    )
    .join("");
  return `<div class="cheatsheet-panel">${rows}</div>`;
}

function renderChallenge(key, challenge, hasPlayground) {
  const cs = challengeState[key] || { hint: false, solution: false };
  challengeState[key] = cs;
  return `
    <div class="challenge-panel">
      <div class="flex items-center gap-2 challenge-title">${icon("target", COLORS.magenta, 16)} Try it yourself</div>
      <div class="challenge-prompt">${escapeHtml(challenge.prompt)}</div>
      <div class="flex gap-2 challenge-actions">
        <button class="text-btn" data-action="toggle-hint" data-key="${key}">${cs.hint ? "Hide hint" : "Show hint"}</button>
        <button class="text-btn" data-action="toggle-solution" data-key="${key}">${cs.solution ? "Hide solution" : "Show solution"}</button>
        ${cs.solution && hasPlayground ? `<button class="text-btn" data-action="load-solution" data-key="${key}">Load into playground above</button>` : ""}
      </div>
      ${cs.hint ? `<div class="challenge-reveal hint">${escapeHtml(challenge.hint)}</div>` : ""}
      ${cs.solution ? `<div class="challenge-reveal solution">${escapeHtml(challenge.solution)}</div>` : ""}
    </div>`;
}

function renderTutorCheckin(lesson) {
  const ci = state.checkin;
  let inner = "";
  if (ci.mode === "ask") {
    inner = `
      <p class="tutor-line">That's <strong>${lesson.title}</strong>. Does this make sense so far? Let me know if you'd like me to explain it a different way, or ask me anything before we move on.</p>
      <div class="flex gap-2 tutor-actions">
        <button class="tutor-btn tutor-btn-primary" data-action="checkin-next">Got it, I understand ${icon("chevron", COLORS.cyan, 14)}</button>
        <button class="tutor-btn" data-action="checkin-explain">Explain it again</button>
        <button class="tutor-btn" data-action="checkin-ask">I have a question</button>
      </div>`;
  } else if (ci.mode === "explained") {
    inner = `
      <p class="tutor-line tutor-line-alt">${lesson.altExplain}</p>
      <p class="tutor-line">Does that clear it up?</p>
      <div class="flex gap-2 tutor-actions">
        <button class="tutor-btn tutor-btn-primary" data-action="checkin-next">Yes, continue ${icon("chevron", COLORS.cyan, 14)}</button>
        <button class="tutor-btn" data-action="checkin-ask">Still have a question</button>
      </div>`;
  } else if (ci.mode === "asking") {
    inner = `
      <p class="tutor-line">What's your question about "${lesson.title}"?</p>
      <div class="flex gap-2" style="margin-top:8px">
        <input class="tutor-input" id="checkinQuestionInput" placeholder="Type your question…" value="${escapeAttr(ci.question)}" />
        <button class="tutor-btn tutor-btn-primary" data-action="checkin-submit" ${ci.loading ? "disabled" : ""}>${ci.loading ? "…" : "Ask"}</button>
      </div>`;
  } else if (ci.mode === "answered") {
    inner = `
      <p class="tutor-line tutor-line-alt">${ci.answer}</p>
      <p class="tutor-line">Good to move on?</p>
      <div class="flex gap-2 tutor-actions">
        <button class="tutor-btn tutor-btn-primary" data-action="checkin-next">Yes, continue ${icon("chevron", COLORS.cyan, 14)}</button>
        <button class="tutor-btn" data-action="checkin-ask">One more question</button>
      </div>`;
  }
  return `<div class="tutor-checkin"><div class="flex items-center gap-2 tutor-checkin-header"><div class="tutor-avatar">${icon("message", COLORS.white, 15)}</div><span class="mono-label">Tutor</span></div>${inner}</div>`;
}

const quizAnswers = {};
let quizSubmitted = false;

function renderQuiz(courseId, level, track) {
  const items = getQuizItems(courseId, level, track);
  const score = items.reduce((s, q, i) => s + (quizAnswers[i] === q.correct ? 1 : 0), 0);

  const questions = items
    .map((item, qi) => {
      const opts = item.options
        .map((opt, oi) => {
          const chosen = quizAnswers[qi] === oi;
          const isCorrect = quizSubmitted && oi === item.correct;
          const isWrong = quizSubmitted && chosen && oi !== item.correct;
          let cls = "quiz-option";
          if (chosen) cls += " chosen";
          if (isCorrect) cls += " correct";
          if (isWrong) cls += " wrong";
          return `<button class="${cls}" data-action="quiz-pick" data-qi="${qi}" data-oi="${oi}">${opt}</button>`;
        })
        .join("");
      return `<div style="margin-bottom:18px"><div class="quiz-question">${qi + 1}. ${item.q}</div><div class="flex flex-col gap-2">${opts}</div></div>`;
    })
    .join("");

  const footer = !quizSubmitted
    ? `<button class="run-btn" data-action="quiz-submit">Check answers</button>`
    : `<div class="flex items-center gap-2 quiz-result ${score === items.length ? "good" : "ok"}">${icon(score === items.length ? "check" : "x", score === items.length ? COLORS.green : COLORS.amber, 16)} You scored ${score} / ${items.length}</div>`;

  return `<div class="quiz-panel"><div class="flex items-center gap-2" style="margin-bottom:16px">${icon("sparkles", COLORS.amber, 16)}<span class="quiz-title">Quick check</span></div>${questions}${footer}</div>`;
}

// ---------- KPI Cards widget ----------
function renderKpiCards(key) {
  kpiState[key] = kpiState[key] || { status: "paid" };
  const cs = kpiState[key];
  const filtered = cs.status === "all" ? DA_ORDERS : DA_ORDERS.filter((o) => o.status === cs.status);
  const total = sumOf(filtered.map((o) => o.amount));
  const avg = filtered.length ? Math.round((total / filtered.length) * 100) / 100 : 0;
  const count = filtered.length;

  return `
    <div class="widget-panel">
      <div class="flex items-center gap-2" style="margin-bottom:14px">
        <span class="mono-label">Filter orders by status:</span>
        <select class="select-input" data-role="kpi-filter" data-key="${key}">
          ${["all", "paid", "pending", "cancelled"].map((s) => `<option value="${s}" ${cs.status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
      <div class="grid grid-sm-2 grid-md-3">
        <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value">${total.toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Avg Order Value</div><div class="stat-value">${avg.toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Order Count</div><div class="stat-value">${count}</div></div>
      </div>
    </div>`;
}

// ---------- Stats Calculator widget (editable spreadsheet-style) ----------
function renderStatsCalc(key) {
  if (!statsCalcData[key]) {
    statsCalcData[key] = DA_EMPLOYEES.map((e) => ({ name: e.name, salary: e.salary }));
  }
  const rows = statsCalcData[key];
  const salaries = rows.map((r) => Number(r.salary) || 0);

  const tableRows = rows
    .map(
      (r, i) => `
      <tr>
        <td>${escapeHtml(r.name)}</td>
        <td><input type="number" class="cell-input" data-role="stats-cell" data-key="${key}" data-idx="${i}" value="${r.salary}" /></td>
      </tr>`
    )
    .join("");

  return `
    <div class="widget-panel">
      <div class="table-wrap-light" style="margin-bottom:16px">
        <table class="data-table-light">
          <thead><tr><th>Employee</th><th>Salary (editable)</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <div class="grid grid-sm-2 grid-md-3">
        <div class="stat-card"><div class="stat-label">Mean</div><div class="stat-value">${Math.round(mean(salaries)).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Median</div><div class="stat-value">${Math.round(median(salaries)).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Min</div><div class="stat-value">${minOf(salaries).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Max</div><div class="stat-value">${maxOf(salaries).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Std Dev</div><div class="stat-value">${Math.round(stdev(salaries)).toLocaleString()}</div></div>
      </div>
    </div>`;
}

// ---------- Trend Builder widget ----------
function renderTrendBuilder(key) {
  trendState[key] = trendState[key] || { metric: "count" };
  const ts = trendState[key];

  const byYear = {};
  DA_EMPLOYEES.forEach((e) => {
    const year = e.hireDate.slice(0, 4);
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(e.salary);
  });
  const years = Object.keys(byYear).sort();
  const values = years.map((y) => (ts.metric === "count" ? byYear[y].length : Math.round(mean(byYear[y]))));

  return `
    <div class="widget-panel">
      <div class="flex items-center gap-2" style="margin-bottom:14px">
        <span class="mono-label">Show by year:</span>
        <select class="select-input" data-role="trend-metric" data-key="${key}">
          <option value="count" ${ts.metric === "count" ? "selected" : ""}>Number of hires</option>
          <option value="avgSalary" ${ts.metric === "avgSalary" ? "selected" : ""}>Average salary of hires</option>
        </select>
      </div>
      <div class="chart-panel"><canvas id="trendChart_${key}" class="trend-chart" data-key="${key}"></canvas></div>
    </div>`;
}

// ---------- Pivot Builder widget ----------
function renderPivotBuilder(key, defaultDataset) {
  pivotState[key] = pivotState[key] || { dataset: defaultDataset || "employees", agg: "avg" };
  const ps = pivotState[key];
  const cfg = PIVOT_CONFIG[ps.dataset];
  const results = groupByAgg(cfg.data, cfg.groupField, cfg.metricField, ps.agg);

  const rows = results.map((r) => `<tr><td>${escapeHtml(r.group)}</td><td>${r.value.toLocaleString()}</td></tr>`).join("");

  return `
    <div class="widget-panel">
      <div class="flex gap-2" style="margin-bottom:14px;flex-wrap:wrap">
        <div class="flex items-center gap-2">
          <span class="mono-label">Dataset:</span>
          <select class="select-input" data-role="pivot-dataset" data-key="${key}">
            <option value="employees" ${ps.dataset === "employees" ? "selected" : ""}>Employees (by department)</option>
            <option value="orders" ${ps.dataset === "orders" ? "selected" : ""}>Orders (by status)</option>
            <option value="cohort" ${ps.dataset === "cohort" ? "selected" : ""}>Employees (by hire-year cohort)</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <span class="mono-label">Aggregation:</span>
          <select class="select-input" data-role="pivot-agg" data-key="${key}">
            ${["sum", "avg", "count", "min", "max"].map((a) => `<option value="${a}" ${ps.agg === a ? "selected" : ""}>${a}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="mono-label" style="margin-bottom:10px">${cfg.label} — ${ps.agg}(${cfg.metricField})</div>
      <div class="grid grid-sm-2" style="align-items:start">
        <div class="table-wrap-light">
          <table class="data-table-light">
            <thead><tr><th>${cfg.groupField}</th><th>${ps.agg}(${cfg.metricField})</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="chart-panel"><canvas id="pivotChart_${key}" class="pivot-chart" data-key="${key}"></canvas></div>
      </div>
    </div>`;
}

// ---------- Insight Check widget (chart/scenario interpretation, multiple choice) ----------
function renderInsightCheck(key, ic) {
  insightState[key] = insightState[key] || { selected: null };
  const is = insightState[key];

  const options = ic.options
    .map((opt, i) => {
      let cls = "quiz-option";
      if (is.selected === i) cls += is.selected === ic.correct ? " correct" : " wrong";
      if (is.selected !== null && i === ic.correct) cls += " correct";
      return `<button class="${cls}" data-action="insight-pick" data-key="${key}" data-idx="${i}" ${is.selected !== null ? "disabled" : ""}>${escapeHtml(opt)}</button>`;
    })
    .join("");

  return `
    <div class="widget-panel">
      <div class="quiz-question" style="margin-bottom:10px">${escapeHtml(ic.question)}</div>
      <div class="flex flex-col gap-2">${options}</div>
      ${is.selected !== null ? `<div class="callout callout-takeaway" style="margin-top:14px"><div class="callout-title">Why</div><div class="callout-body">${escapeHtml(ic.explanation)}</div></div>` : ""}
    </div>`;
}

// ---------- Percent Change Calculator ----------
function renderPercentCalc(key) {
  percentCalcState[key] = percentCalcState[key] || { before: 20000, after: 26000 };
  const s = percentCalcState[key];
  const pct = s.before === 0 ? null : ((s.after - s.before) / s.before) * 100;
  const pctText = pct === null ? "Can't divide by zero" : `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;

  return `
    <div class="widget-panel">
      <div class="flex gap-4" style="flex-wrap:wrap;margin-bottom:16px">
        <div>
          <div class="stat-label" style="margin-bottom:6px">Before</div>
          <input type="number" class="cell-input calc-input" data-role="percent-input" data-field="before" data-key="${key}" value="${s.before}" style="width:140px" />
        </div>
        <div>
          <div class="stat-label" style="margin-bottom:6px">After</div>
          <input type="number" class="cell-input calc-input" data-role="percent-input" data-field="after" data-key="${key}" value="${s.after}" style="width:140px" />
        </div>
      </div>
      <div class="stat-card" style="max-width:220px">
        <div class="stat-label">Percent change</div>
        <div class="stat-value calc-result" style="color:${pct === null ? "var(--red)" : pct >= 0 ? "var(--green)" : "var(--red)"}">${pctText}</div>
      </div>
    </div>`;
}

// ---------- Weighted Average Calculator ----------
function renderWeightedAvgCalc(key) {
  if (!weightedAvgData[key]) {
    const grouped = groupByAgg(DA_EMPLOYEES, "department", "salary", "avg");
    const counts = groupByAgg(DA_EMPLOYEES, "department", "salary", "count");
    weightedAvgData[key] = grouped.map((g, i) => ({ group: g.group, value: g.value, weight: counts[i].value }));
  }
  const rows = weightedAvgData[key];
  const simpleAvg = mean(rows.map((r) => Number(r.value) || 0));
  const totalWeight = sumOf(rows.map((r) => Number(r.weight) || 0));
  const weightedAvg = totalWeight === 0 ? 0 : sumOf(rows.map((r) => (Number(r.value) || 0) * (Number(r.weight) || 0))) / totalWeight;

  const tableRows = rows
    .map(
      (r, i) => `
      <tr>
        <td>${escapeHtml(r.group)}</td>
        <td><input type="number" class="cell-input" data-role="weighted-value" data-key="${key}" data-idx="${i}" value="${r.value}" /></td>
        <td><input type="number" class="cell-input" data-role="weighted-weight" data-key="${key}" data-idx="${i}" value="${r.weight}" /></td>
      </tr>`
    )
    .join("");

  return `
    <div class="widget-panel">
      <div class="table-wrap-light" style="margin-bottom:16px">
        <table class="data-table-light">
          <thead><tr><th>Department</th><th>Avg salary (value)</th><th>Headcount (weight)</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <div class="grid grid-sm-2">
        <div class="stat-card"><div class="stat-label">Simple average</div><div class="stat-value wavg-simple">${Math.round(simpleAvg).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Weighted average</div><div class="stat-value wavg-weighted">${Math.round(weightedAvg).toLocaleString()}</div></div>
      </div>
    </div>`;
}

// ---------- Comparison Cards ----------
function renderComparisonCards(key) {
  const departments = [...new Set(DA_EMPLOYEES.map((e) => e.department))];
  comparisonState[key] = comparisonState[key] || { a: departments[0], b: departments[1] || departments[0] };
  const cs = comparisonState[key];

  function statsFor(dept) {
    const rows = DA_EMPLOYEES.filter((e) => e.department === dept);
    const salaries = rows.map((r) => r.salary);
    return { count: rows.length, avg: Math.round(mean(salaries)), min: minOf(salaries), max: maxOf(salaries) };
  }
  const a = statsFor(cs.a);
  const b = statsFor(cs.b);

  const options = departments.map((d) => `<option value="${d}">${d}</option>`).join("");

  function cardSet(label, stats, dept) {
    return `
      <div class="widget-panel" style="flex:1;min-width:200px">
        <div class="mono-label" style="margin-bottom:10px">${label}: ${escapeHtml(dept)}</div>
        <div class="flex flex-col gap-2">
          <div class="stat-card"><div class="stat-label">Headcount</div><div class="stat-value">${stats.count}</div></div>
          <div class="stat-card"><div class="stat-label">Avg salary</div><div class="stat-value">${stats.avg.toLocaleString()}</div></div>
          <div class="stat-card"><div class="stat-label">Range</div><div class="stat-value" style="font-size:16px">${stats.min.toLocaleString()} – ${stats.max.toLocaleString()}</div></div>
        </div>
      </div>`;
  }

  return `
    <div>
      <div class="flex gap-4" style="flex-wrap:wrap;margin-bottom:14px">
        <div class="flex items-center gap-2">
          <span class="mono-label">Group A:</span>
          <select class="select-input" data-role="compare-a" data-key="${key}">${departments.map((d) => `<option value="${d}" ${cs.a === d ? "selected" : ""}>${d}</option>`).join("")}</select>
        </div>
        <div class="flex items-center gap-2">
          <span class="mono-label">Group B:</span>
          <select class="select-input" data-role="compare-b" data-key="${key}">${departments.map((d) => `<option value="${d}" ${cs.b === d ? "selected" : ""}>${d}</option>`).join("")}</select>
        </div>
      </div>
      <div class="flex gap-4" style="flex-wrap:wrap">
        ${cardSet("Group A", a, cs.a)}
        ${cardSet("Group B", b, cs.b)}
      </div>
    </div>`;
}

// ---------- Correlation Calculator ----------
function renderCorrelationCalc(key) {
  const rows = DA_EMPLOYEES.map((e) => ({
    name: e.name,
    salary: e.salary,
    tenureYears: 2026 - Number(e.hireDate.slice(0, 4)),
  }));
  const r = pearson(rows.map((x) => x.tenureYears), rows.map((x) => x.salary));

  let interpretation;
  const abs = Math.abs(r);
  if (abs > 0.7) interpretation = `a strong ${r > 0 ? "positive" : "negative"} relationship`;
  else if (abs > 0.3) interpretation = `a moderate ${r > 0 ? "positive" : "negative"} relationship`;
  else interpretation = "little to no relationship";

  const tableRows = rows.map((r2) => `<tr><td>${escapeHtml(r2.name)}</td><td>${r2.tenureYears}</td><td>${r2.salary.toLocaleString()}</td></tr>`).join("");

  return `
    <div class="widget-panel">
      <div class="table-wrap-light" style="margin-bottom:16px">
        <table class="data-table-light">
          <thead><tr><th>Employee</th><th>Tenure (years)</th><th>Salary</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <div class="stat-card" style="max-width:320px">
        <div class="stat-label">Correlation (tenure vs. salary)</div>
        <div class="stat-value">${r.toFixed(2)}</div>
      </div>
      <div class="callout callout-takeaway" style="margin-top:14px">
        <div class="callout-title">Reading this number</div>
        <div class="callout-body">r = ${r.toFixed(2)} suggests ${interpretation} between tenure and salary in this (very small, 6-person) sample.</div>
      </div>
    </div>`;
}

// ---------- Forecast Calculator ----------
function renderForecastCalc(key) {
  forecastData[key] = forecastData[key] || [10, 14, 17];
  const vals = forecastData[key];
  const deltas = [];
  for (let i = 1; i < vals.length; i++) deltas.push(vals[i] - vals[i - 1]);
  const avgDelta = deltas.length ? mean(deltas) : 0;
  const forecast = Math.round((vals[vals.length - 1] + avgDelta) * 10) / 10;

  const inputs = vals
    .map((v, i) => `<input type="number" class="cell-input" data-role="forecast-input" data-key="${key}" data-idx="${i}" value="${v}" style="width:90px" />`)
    .join("");

  return `
    <div class="widget-panel">
      <div class="mono-label" style="margin-bottom:8px">Last 3 periods (edit any value):</div>
      <div class="flex gap-2" style="margin-bottom:16px">${inputs}</div>
      <div class="stat-card" style="max-width:260px">
        <div class="stat-label">Naive forecast (next period)</div>
        <div class="stat-value forecast-result">${forecast}</div>
      </div>
      <div class="hint-text" style="color:var(--sub);margin-top:10px">Based on the average change between your 3 periods, carried forward one more step.</div>
    </div>`;
}

// ---------- Percentile / Quartile Calculator ----------
function renderPercentileCalc() {
  const salaries = DA_EMPLOYEES.map((e) => e.salary);
  const q1 = percentile(salaries, 25);
  const q2 = percentile(salaries, 50);
  const q3 = percentile(salaries, 75);
  const iqr = q3 - q1;

  return `
    <div class="widget-panel">
      <div class="table-wrap-light" style="margin-bottom:16px">
        <table class="data-table-light">
          <thead><tr><th>Employee</th><th>Salary</th></tr></thead>
          <tbody>${DA_EMPLOYEES.map((e) => `<tr><td>${escapeHtml(e.name)}</td><td>${e.salary.toLocaleString()}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <div class="grid grid-sm-2 grid-md-3">
        <div class="stat-card"><div class="stat-label">Q1 (25th pct)</div><div class="stat-value">${Math.round(q1).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Q2 / Median</div><div class="stat-value">${Math.round(q2).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Q3 (75th pct)</div><div class="stat-value">${Math.round(q3).toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">IQR (Q3 - Q1)</div><div class="stat-value">${Math.round(iqr).toLocaleString()}</div></div>
      </div>
    </div>`;
}

// ---------- Simple Linear Regression Calculator ----------
function renderRegressionCalc(key) {
  percentCalcState[key] = percentCalcState[key] || { input: 3 };
  const rows = DA_EMPLOYEES.map((e) => ({ tenure: 2026 - Number(e.hireDate.slice(0, 4)), salary: e.salary }));
  const { slope, intercept } = linearRegression(rows.map((r) => r.tenure), rows.map((r) => r.salary));
  const inputYears = percentCalcState[key].input;
  const predicted = Math.round(slope * inputYears + intercept);

  return `
    <div class="widget-panel">
      <div class="table-wrap-light" style="margin-bottom:16px">
        <table class="data-table-light">
          <thead><tr><th>Tenure (years)</th><th>Salary</th></tr></thead>
          <tbody>${rows.map((r) => `<tr><td>${r.tenure}</td><td>${r.salary.toLocaleString()}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <div class="mono-label" style="margin-bottom:10px">Best-fit line: salary = ${slope.toFixed(0)} x tenure + ${intercept.toFixed(0)}</div>
      <div class="flex items-center gap-2" style="margin-bottom:14px">
        <span class="mono-label">Predict salary for tenure:</span>
        <input type="number" class="cell-input" data-role="regression-input" data-key="${key}" value="${inputYears}" style="width:80px" /> <span class="mono-label">years</span>
      </div>
      <div class="stat-card" style="max-width:240px">
        <div class="stat-label">Predicted salary</div>
        <div class="stat-value regression-result">${predicted.toLocaleString()}</div>
      </div>
    </div>`;
}

// ---------- Outlier Detector (IQR method) ----------
function renderOutlierDetector() {
  const salaries = DA_EMPLOYEES.map((e) => e.salary);
  const q1 = percentile(salaries, 25);
  const q3 = percentile(salaries, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const rows = DA_EMPLOYEES.map((e) => ({
    ...e,
    isOutlier: e.salary < lowerBound || e.salary > upperBound,
  }));

  return `
    <div class="widget-panel">
      <div class="mono-label" style="margin-bottom:10px">Normal range (IQR method): ${Math.round(lowerBound).toLocaleString()} to ${Math.round(upperBound).toLocaleString()}</div>
      <div class="table-wrap-light">
        <table class="data-table-light">
          <thead><tr><th>Employee</th><th>Salary</th><th>Status</th></tr></thead>
          <tbody>${rows.map((r) => `<tr><td>${escapeHtml(r.name)}</td><td>${r.salary.toLocaleString()}</td><td style="color:${r.isOutlier ? "var(--red)" : "var(--green)"}">${r.isOutlier ? "Outlier" : "Normal"}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </div>`;
}

// ---------- Funnel Calculator ----------
function renderFunnelCalc(key) {
  funnelData[key] = funnelData[key] || [1000, 400, 150, 60];
  const stages = ["Visitors", "Signed up", "Added to cart", "Purchased"];
  const vals = funnelData[key];

  const rows = vals
    .map((v, i) => {
      const pct = i === 0 ? 100 : Math.round((v / vals[0]) * 1000) / 10;
      return `
      <tr>
        <td>${stages[i]}</td>
        <td><input type="number" class="cell-input" data-role="funnel-input" data-key="${key}" data-idx="${i}" value="${v}" /></td>
        <td class="funnel-pct">${pct}%</td>
      </tr>`;
    })
    .join("");

  return `
    <div class="widget-panel">
      <div class="table-wrap-light">
        <table class="data-table-light">
          <thead><tr><th>Stage</th><th>Count (editable)</th><th>% of top</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

// ---------- Customer Lifetime Value Calculator ----------
function renderClvCalc(key) {
  clvState[key] = clvState[key] || { avgOrderValue: 1500, purchasesPerYear: 4, lifespanYears: 3 };
  const s = clvState[key];
  const clv = Math.round(s.avgOrderValue * s.purchasesPerYear * s.lifespanYears);

  function field(label, field, value) {
    return `
      <div>
        <div class="stat-label" style="margin-bottom:6px">${label}</div>
        <input type="number" class="cell-input" data-role="clv-input" data-field="${field}" data-key="${key}" value="${value}" style="width:140px" />
      </div>`;
  }

  return `
    <div class="widget-panel">
      <div class="flex gap-4" style="flex-wrap:wrap;margin-bottom:16px">
        ${field("Avg order value", "avgOrderValue", s.avgOrderValue)}
        ${field("Purchases per year", "purchasesPerYear", s.purchasesPerYear)}
        ${field("Customer lifespan (years)", "lifespanYears", s.lifespanYears)}
      </div>
      <div class="stat-card" style="max-width:260px">
        <div class="stat-label">Customer Lifetime Value</div>
        <div class="stat-value clv-result">${clv.toLocaleString()}</div>
      </div>
      <div class="hint-text" style="color:var(--sub);margin-top:10px">CLV = avg order value x purchases per year x customer lifespan.</div>
    </div>`;
}



function renderMiniPlayground(key, defaultQuery) {
  if (!miniPlaygrounds[key]) {
    miniPlaygrounds[key] = { query: defaultQuery, result: null, error: null, ranOnce: false };
  }
  const mp = miniPlaygrounds[key];
  let resultHtml = "";
  if (mp.error) resultHtml = `<div class="error-text">⚠ ${escapeHtml(mp.error)}</div>`;
  else if (mp.result) resultHtml = dataTableHtml(mp.result.columns, mp.result.rows);
  else resultHtml = `<div class="empty-rows">Click "Run query" to see the result.</div>`;

  return `
    <div class="playground-panel">
      <div class="flex items-center gap-2 playground-header">${icon("terminal", COLORS.dkCyan, 15)}<span class="mono-label">Try it — edit and run</span></div>
      <div style="padding:16px">
        <textarea class="sql-input mini-sql-input" data-key="${key}" data-cm-mode="sql" rows="3" spellcheck="false">${escapeHtml(mp.query)}</textarea>
        <button class="run-btn flex items-center gap-2" data-action="run-mini" data-key="${key}" ${dbReady ? "" : "disabled"}>${icon("play", COLORS.white, 14)} ${dbReady ? "Run query" : "Loading engine…"}</button>
        <div style="margin-top:16px">${resultHtml}</div>
      </div>
    </div>`;
}

// ---------- C# code playground (embedded per lesson, and full at end of track) ----------
const DEFAULT_CSHARP_STARTER = `using System;

class Program {
  static void Main() {
    Console.WriteLine("Hello, world!");
  }
}`;

function renderCSharpPlayground(key, starterCode) {
  if (!csharpPlaygrounds[key]) {
    csharpPlaygrounds[key] = { code: starterCode || DEFAULT_CSHARP_STARTER, stdin: "", output: null, error: null, compileError: null, running: false };
  }
  const cp = csharpPlaygrounds[key];

  let resultHtml;
  if (cp.running) resultHtml = `<div class="mono-label">Compiling &amp; running…</div>`;
  else if (cp.error) resultHtml = `<div class="error-text">⚠ ${escapeHtml(cp.error)}</div>`;
  else if (cp.compileError) resultHtml = `<div class="error-text">Compile error:\n${escapeHtml(cp.compileError)}</div>`;
  else if (cp.output !== null) resultHtml = `<pre class="csharp-output">${escapeHtml(cp.output) || "(no output)"}</pre>`;
  else resultHtml = `<div class="empty-rows">Click "Run" to compile and execute this code.</div>`;

  return `
    <div class="playground-panel">
      <div class="flex items-center gap-2 playground-header">${icon("terminal", COLORS.dkCyan, 15)}<span class="mono-label">C# Playground — real online compiler</span></div>
      <div style="padding:16px">
        <textarea class="sql-input csharp-input" data-key="${key}" data-cm-mode="csharp" rows="11" spellcheck="false">${escapeHtml(cp.code)}</textarea>
        <div class="mono-label" style="margin:10px 0 6px">stdin (optional — used by Console.ReadLine)</div>
        <textarea class="sql-input csharp-stdin" data-key="${key}" rows="2" spellcheck="false">${escapeHtml(cp.stdin)}</textarea>
        <button class="run-btn flex items-center gap-2" data-action="run-csharp" data-key="${key}" ${cp.running ? "disabled" : ""}>${icon("play", COLORS.white, 14)} ${cp.running ? "Running…" : "Run"}</button>
        <div style="margin-top:16px">${resultHtml}</div>
      </div>
    </div>`;
}

const DEFAULT_PYTHON_STARTER = `print("Hello, world!")`;

function renderPythonPlayground(key, starterCode) {
  if (!pythonPlaygrounds[key]) {
    pythonPlaygrounds[key] = { code: starterCode || DEFAULT_PYTHON_STARTER, stdin: "", output: null, error: null, running: false };
  }
  const pp = pythonPlaygrounds[key];

  let resultHtml;
  if (pp.running) resultHtml = `<div class="mono-label">Starting Python &amp; running…</div>`;
  else if (pp.error) resultHtml = `<div class="error-text">${escapeHtml(pp.error)}</div>`;
  else if (pp.output !== null) resultHtml = `<pre class="csharp-output">${escapeHtml(pp.output) || "(no output)"}</pre>`;
  else resultHtml = `<div class="empty-rows">Click "Run" to execute this code. (First run loads the Python engine — takes a few seconds.)</div>`;

  return `
    <div class="playground-panel">
      <div class="flex items-center gap-2 playground-header">${icon("terminal", COLORS.dkCyan, 15)}<span class="mono-label">Python Playground — real Python, runs in your browser</span></div>
      <div style="padding:16px">
        <textarea class="sql-input python-input" data-key="${key}" data-cm-mode="python" rows="11" spellcheck="false">${escapeHtml(pp.code)}</textarea>
        <div class="mono-label" style="margin:10px 0 6px">stdin (optional — used by input())</div>
        <textarea class="sql-input python-stdin" data-key="${key}" rows="2" spellcheck="false">${escapeHtml(pp.stdin)}</textarea>
        <button class="run-btn flex items-center gap-2" data-action="run-python" data-key="${key}" ${pp.running ? "disabled" : ""}>${icon("play", COLORS.white, 14)} ${pp.running ? "Running…" : "Run"}</button>
        <div style="margin-top:16px">${resultHtml}</div>
      </div>
    </div>`;
}

// ---------- JavaScript execution via a sandboxed Web Worker (real JS, runs natively in
// the browser - no external service or WASM engine needed at all, unlike C#/Python). A
// worker keeps a runaway loop from freezing the page, and gets terminated after a timeout
// instead of pretending nothing went wrong. Loaded from a real file (js-sandbox-worker.js),
// not a Blob URL - Android's WebView (what the native Android app runs inside) blocks or
// silently fails Worker creation from blob: URLs in some configurations; a real static
// file sidesteps that entirely and behaves identically everywhere else too. ----------
function runJS(code) {
  return new Promise((resolve) => {
    let settled = false;
    let worker;
    try {
      worker = new Worker("js-sandbox-worker.js");
    } catch (e) {
      resolve({ output: "", error: "Couldn't start the JavaScript engine in this browser: " + e.message });
      return;
    }

    const cleanup = () => {
      worker.terminate();
    };

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ output: "", error: "Took too long to run (possible infinite loop) — execution stopped after 3 seconds." });
    }, 3000);

    worker.onmessage = (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      cleanup();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      cleanup();
      resolve({ output: "", error: e.message || "Script error" });
    };

    worker.postMessage(code);
  });
}

const DEFAULT_JS_STARTER = `console.log("Hello, world!");`;

function renderJSPlayground(key, starterCode) {
  if (!jsPlaygrounds[key]) {
    jsPlaygrounds[key] = { code: starterCode || DEFAULT_JS_STARTER, output: null, error: null, running: false };
  }
  const jp = jsPlaygrounds[key];

  let resultHtml;
  if (jp.running) resultHtml = `<div class="mono-label">Running…</div>`;
  else if (jp.error) resultHtml = `<div class="error-text">${escapeHtml(jp.error)}</div>`;
  else if (jp.output !== null) resultHtml = `<pre class="csharp-output">${escapeHtml(jp.output) || "(no output)"}</pre>`;
  else resultHtml = `<div class="empty-rows">Click "Run" to execute this code.</div>`;

  return `
    <div class="playground-panel">
      <div class="flex items-center gap-2 playground-header">${icon("terminal", COLORS.dkCyan, 15)}<span class="mono-label">JavaScript Playground — real JS, runs natively in your browser</span></div>
      <div style="padding:16px">
        <textarea class="sql-input js-input" data-key="${key}" data-cm-mode="javascript" rows="11" spellcheck="false">${escapeHtml(jp.code)}</textarea>
        <button class="run-btn flex items-center gap-2" data-action="run-js" data-key="${key}" ${jp.running ? "disabled" : ""}>${icon("play", COLORS.white, 14)} ${jp.running ? "Running…" : "Run"}</button>
        <div style="margin-top:16px">${resultHtml}</div>
      </div>
    </div>`;
}

// ---------- Excel spreadsheet grid widget ----------
const DEFAULT_EXCEL_SEED = [
  ["10", "20", "=A1+B1"],
  ["5", "15", "=A2+B2"],
  ["=SUM(A1:A2)", "=SUM(B1:B2)", "=SUM(C1:C2)"],
];

function renderExcelGrid(key, seedData) {
  if (!excelGrids[key]) {
    excelGrids[key] = { raw: seedData.map((row) => [...row]) };
  }
  const raw = excelGrids[key].raw;
  const rows = raw.length;
  const cols = raw[0].length;
  const results = computeGrid(raw) || raw;

  const headerRow = `<tr><th></th>${Array.from({ length: cols }, (_, c) => `<th>${colLetter(c)}</th>`).join("")}</tr>`;

  const inputRows = raw
    .map(
      (row, r) => `
      <tr>
        <th>${r + 1}</th>
        ${row.map((val, c) => `<td><input type="text" class="excel-cell" data-key="${key}" data-row="${r}" data-col="${c}" value="${escapeAttr(val)}" /></td>`).join("")}
      </tr>`
    )
    .join("");

  const resultRows = results
    .map(
      (row, r) => `
      <tr>
        <th>${r + 1}</th>
        ${row.map((val) => `<td>${escapeHtml(val)}</td>`).join("")}
      </tr>`
    )
    .join("");

  return `
    <div class="widget-panel">
      <div class="mono-label" style="margin-bottom:8px">Enter values or formulas below (start a formula with =):</div>
      <div class="table-wrap-light excel-grid" style="margin-bottom:16px">
        <table class="data-table-light excel-table">
          <thead>${headerRow}</thead>
          <tbody>${inputRows}</tbody>
        </table>
      </div>
      <div class="mono-label" style="margin-bottom:8px">Computed result:</div>
      <div class="table-wrap-light excel-grid">
        <table class="data-table-light excel-table">
          <thead>${headerRow}</thead>
          <tbody>${resultRows}</tbody>
        </table>
      </div>
    </div>`;
}

// ---------- Cloud CLI simulator (practice syntax — NOT connected to a real cloud account) ----------
function renderCliSim(key, cliSpec) {
  if (!cliSims[key]) {
    cliSims[key] = { history: [], input: "" };
  }
  const sim = cliSims[key];

  const historyHtml = sim.history
    .map(
      (entry) => `
      <div class="cli-line"><span class="cli-prompt">$</span> ${escapeHtml(entry.cmd)}</div>
      <pre class="cli-output">${escapeHtml(entry.output)}</pre>`
    )
    .join("");

  return `
    <div class="playground-panel">
      <div class="flex items-center gap-2 playground-header">${icon("terminal", COLORS.dkAmber, 15)}<span class="mono-label">Simulated terminal — practice syntax, not a real cloud account</span></div>
      <div style="padding:16px">
        <div class="cli-history" data-key="${key}">${historyHtml}</div>
        <div class="flex items-center gap-2" style="margin-top:10px">
          <span class="cli-prompt">$</span>
          <input type="text" class="cli-input" data-key="${key}" value="${escapeAttr(sim.input)}" placeholder="${escapeAttr(cliSpec.hint || "Type a command...")}" spellcheck="false" />
          <button class="run-btn" data-action="run-cli" data-key="${key}" style="margin-top:0">Run</button>
        </div>
        <div class="hint-text" style="color:var(--sub);margin-top:10px">Try: <code>${escapeHtml(cliSpec.hint || "")}</code></div>
      </div>
    </div>`;
}

function runCliCommand(cliSpec, cmd) {
  const trimmed = cmd.trim();
  if (cliSpec.commands[trimmed]) return cliSpec.commands[trimmed];
  const caseInsensitiveMatch = Object.keys(cliSpec.commands).find((k) => k.toLowerCase() === trimmed.toLowerCase());
  if (caseInsensitiveMatch) return cliSpec.commands[caseInsensitiveMatch];
  return `command not recognized in this simulation.\nThis sandbox only understands a few specific commands for this lesson — try: ${cliSpec.hint || "the example command above"}`;
}

// ---------- Cloud cost calculator ----------
function renderCloudCostCalc(key) {
  cloudCostState[key] = cloudCostState[key] || { instances: 3, hourlyRate: 0.096, hoursPerMonth: 730 };
  const s = cloudCostState[key];
  const monthly = Math.round(s.instances * s.hourlyRate * s.hoursPerMonth * 100) / 100;

  function field(label, fieldKey, value, step) {
    return `
      <div>
        <div class="stat-label" style="margin-bottom:6px">${label}</div>
        <input type="number" step="${step || 1}" class="cell-input" data-role="cloud-cost-input" data-field="${fieldKey}" data-key="${key}" value="${value}" style="width:140px" />
      </div>`;
  }

  return `
    <div class="widget-panel">
      <div class="flex gap-4" style="flex-wrap:wrap;margin-bottom:16px">
        ${field("Number of instances", "instances", s.instances, 1)}
        ${field("Hourly rate ($)", "hourlyRate", s.hourlyRate, 0.001)}
        ${field("Hours per month", "hoursPerMonth", s.hoursPerMonth, 1)}
      </div>
      <div class="stat-card" style="max-width:260px">
        <div class="stat-label">Estimated monthly cost</div>
        <div class="stat-value cloud-cost-result">$${monthly.toLocaleString()}</div>
      </div>
      <div class="hint-text" style="color:var(--sub);margin-top:10px">Monthly cost = instances x hourly rate x hours running per month.</div>
    </div>`;
}

// ---------- On-demand vs reserved/spot cost comparison ----------
function renderCostCompareCalc(key) {
  costCompareState[key] = costCompareState[key] || { instances: 5, onDemandRate: 0.096, reservedRate: 0.058, hoursPerMonth: 730 };
  const s = costCompareState[key];
  const onDemandTotal = Math.round(s.instances * s.onDemandRate * s.hoursPerMonth * 100) / 100;
  const reservedTotal = Math.round(s.instances * s.reservedRate * s.hoursPerMonth * 100) / 100;
  const savingsPct = onDemandTotal === 0 ? 0 : Math.round(((onDemandTotal - reservedTotal) / onDemandTotal) * 1000) / 10;

  function field(label, fieldKey, value, step) {
    return `
      <div>
        <div class="stat-label" style="margin-bottom:6px">${label}</div>
        <input type="number" step="${step || 1}" class="cell-input" data-role="cost-compare-input" data-field="${fieldKey}" data-key="${key}" value="${value}" style="width:140px" />
      </div>`;
  }

  return `
    <div class="widget-panel">
      <div class="flex gap-4" style="flex-wrap:wrap;margin-bottom:16px">
        ${field("Number of instances", "instances", s.instances, 1)}
        ${field("On-demand rate ($/hr)", "onDemandRate", s.onDemandRate, 0.001)}
        ${field("Reserved/spot rate ($/hr)", "reservedRate", s.reservedRate, 0.001)}
        ${field("Hours per month", "hoursPerMonth", s.hoursPerMonth, 1)}
      </div>
      <div class="grid grid-sm-2 grid-md-3">
        <div class="stat-card"><div class="stat-label">On-demand total</div><div class="stat-value cost-compare-ondemand">$${onDemandTotal.toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Reserved/spot total</div><div class="stat-value cost-compare-reserved">$${reservedTotal.toLocaleString()}</div></div>
        <div class="stat-card"><div class="stat-label">Savings</div><div class="stat-value cost-compare-savings">${savingsPct}%</div></div>
      </div>
    </div>`;
}

// ---------- DAX practice widget ----------
function renderDaxCalc(key, defaultFormula) {
  if (!daxCalcState[key]) {
    daxCalcState[key] = { formula: defaultFormula, result: null, error: null };
  }
  const s = daxCalcState[key];

  const tableRows = POWERBI_SALES.map((r) => `<tr><td>${escapeHtml(r.Product)}</td><td>${escapeHtml(r.Region)}</td><td>${r.Amount}</td><td>${r.Quantity}</td></tr>`).join("");

  let resultHtml = `<div class="empty-rows">Click "Calculate" to evaluate this DAX expression.</div>`;
  if (s.error) resultHtml = `<div class="error-text">⚠ ${escapeHtml(s.error)}</div>`;
  else if (s.result !== null) resultHtml = `<div class="stat-card" style="max-width:220px"><div class="stat-label">Result</div><div class="stat-value dax-result">${s.result.toLocaleString()}</div></div>`;

  return `
    <div class="widget-panel">
      <div class="mono-label" style="margin-bottom:8px">Simplified DAX practice — Sales table (supports SUM, AVERAGE, COUNTROWS, CALCULATE, DIVIDE, SUMX)</div>
      <div class="table-wrap-light" style="margin-bottom:16px">
        <table class="data-table-light">
          <thead><tr><th>Product</th><th>Region</th><th>Amount</th><th>Quantity</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <input type="text" class="cell-input dax-input" data-key="${key}" value="${escapeAttr(s.formula)}" style="width:100%;font-family:var(--font-mono)" spellcheck="false" />
      <button class="run-btn" data-action="run-dax" data-key="${key}">Calculate</button>
      <div style="margin-top:16px">${resultHtml}</div>
    </div>`;
}

// ---------- End-of-track full playground ----------
let playgroundQuery = "SELECT name, department, salary FROM employees ORDER BY salary DESC;";
let playgroundResult = null;
let playgroundError = null;

function renderPlayground() {
  let resultHtml = "";
  if (playgroundError) resultHtml = `<div class="error-text">⚠ ${escapeHtml(playgroundError)}</div>`;
  else if (playgroundResult) resultHtml = dataTableHtml(playgroundResult.columns, playgroundResult.rows);

  return `
    <div class="playground-panel">
      <div class="flex items-center gap-2 playground-header">${icon("terminal", COLORS.dkCyan, 15)}<span class="mono-label">playground.sql — real SQLite, tables: employees, orders</span></div>
      <div style="padding:16px">
        <textarea class="sql-input" id="playgroundInput" data-cm-mode="sql" rows="3" spellcheck="false">${escapeHtml(playgroundQuery)}</textarea>
        <button class="run-btn flex items-center gap-2" data-action="run-playground" ${dbReady ? "" : "disabled"}>${icon("play", COLORS.white, 14)} ${dbReady ? "Run query" : "Loading engine…"}</button>
        <div style="margin-top:16px">${resultHtml}</div>
        <div class="hint-text">Try: <code>SELECT employees.name, orders.amount FROM orders JOIN employees ON orders.employee_id = employees.id;</code></div>
      </div>
    </div>`;
}

function dataTableHtml(columns, rows) {
  if (!rows || rows.length === 0) return `<div class="empty-rows">No rows returned.</div>`;
  const head = columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
  const body = rows.map((r) => `<tr>${columns.map((c) => `<td>${escapeHtml(String(r[c]))}</td>`).join("")}</tr>`).join("");
  return `<div class="table-wrap"><table class="data-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function erDiagramSvg() {
  const t = COLORS.dkText, s = COLORS.dkSub, cy = COLORS.dkCyan, mg = COLORS.dkMagenta, ln = COLORS.dkLine, p2 = COLORS.dkPanel2;
  return `<svg viewBox="0 0 520 220" style="width:100%;height:auto">
    <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${cy}"/></marker></defs>
    <rect x="20" y="30" width="190" height="140" rx="8" fill="${p2}" stroke="${ln}"/>
    <rect x="20" y="30" width="190" height="30" rx="8" fill="${cy}" opacity="0.15"/>
    <text x="115" y="50" text-anchor="middle" fill="${cy}" font-family="JetBrains Mono, monospace" font-size="13">employees</text>
    <text x="35" y="80" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">id (PK)</text>
    <text x="35" y="102" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">name</text>
    <text x="35" y="124" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">department</text>
    <text x="35" y="146" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">salary</text>
    <rect x="310" y="30" width="190" height="140" rx="8" fill="${p2}" stroke="${ln}"/>
    <rect x="310" y="30" width="190" height="30" rx="8" fill="${mg}" opacity="0.15"/>
    <text x="405" y="50" text-anchor="middle" fill="${mg}" font-family="JetBrains Mono, monospace" font-size="13">orders</text>
    <text x="325" y="80" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">id (PK)</text>
    <text x="325" y="102" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">employee_id (FK)</text>
    <text x="325" y="124" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">amount</text>
    <text x="325" y="146" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">status</text>
    <line x1="210" y1="102" x2="308" y2="80" stroke="${cy}" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="255" y="88" fill="${s}" font-family="JetBrains Mono, monospace" font-size="10">1 → many</text>
  </svg>`;
}

// A separate, small diagram for Data Analytics' intro lesson - contrasting
// data retrieval (SQL, a query) with analytics (turning that same data into
// a decision). Distinct from erDiagramSvg() above, which is specific to the
// SQL course's own employees/orders schema and shouldn't show up elsewhere.
function analyticsFlowDiagramSvg() {
  const t = COLORS.dkText, s = COLORS.dkSub, cy = COLORS.dkCyan, mg = COLORS.dkMagenta, ln = COLORS.dkLine, p2 = COLORS.dkPanel2;
  const box = (x, label, sub, color) => `
    <rect x="${x}" y="60" width="140" height="80" rx="8" fill="${p2}" stroke="${ln}"/>
    <text x="${x + 70}" y="92" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="13">${label}</text>
    <text x="${x + 70}" y="114" text-anchor="middle" fill="${s}" font-family="JetBrains Mono, monospace" font-size="10">${sub}</text>`;
  return `<svg viewBox="0 0 520 200" style="width:100%;height:auto">
    <defs><marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${cy}"/></marker></defs>
    ${box(10, "Raw numbers", "what a query returns", cy)}
    ${box(190, "Analytics", "good? changing? why?", mg)}
    ${box(370, "A decision", "what to do about it", cy)}
    <line x1="150" y1="100" x2="188" y2="100" stroke="${cy}" stroke-width="1.5" marker-end="url(#arrow2)"/>
    <line x1="330" y1="100" x2="368" y2="100" stroke="${cy}" stroke-width="1.5" marker-end="url(#arrow2)"/>
    <text x="260" y="30" text-anchor="middle" fill="${t}" font-family="JetBrains Mono, monospace" font-size="12">retrieval gets you here; analytics takes you further</text>
  </svg>`;
}

// A separate, small diagram for C#'s "Why OOP builds on classes" lesson -
// a base class with two derived classes, illustrating inheritance rather
// than reusing the unrelated SQL employees/orders schema diagram.
function oopInheritanceDiagramSvg() {
  const t = COLORS.dkText, s = COLORS.dkSub, cy = COLORS.dkCyan, mg = COLORS.dkMagenta, gr = COLORS.dkGreen, ln = COLORS.dkLine, p2 = COLORS.dkPanel2;
  return `<svg viewBox="0 0 520 220" style="width:100%;height:auto">
    <defs><marker id="arrow3" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="none" stroke="${s}" stroke-width="1.3"/></marker></defs>
    <rect x="165" y="15" width="190" height="60" rx="8" fill="${p2}" stroke="${ln}"/>
    <text x="260" y="38" text-anchor="middle" fill="${cy}" font-family="JetBrains Mono, monospace" font-size="13">Animal</text>
    <text x="260" y="58" text-anchor="middle" fill="${s}" font-family="JetBrains Mono, monospace" font-size="10">Name, Speak()</text>
    <rect x="30" y="140" width="180" height="60" rx="8" fill="${p2}" stroke="${ln}"/>
    <text x="120" y="163" text-anchor="middle" fill="${mg}" font-family="JetBrains Mono, monospace" font-size="13">Dog : Animal</text>
    <text x="120" y="183" text-anchor="middle" fill="${s}" font-family="JetBrains Mono, monospace" font-size="10">overrides Speak()</text>
    <rect x="310" y="140" width="180" height="60" rx="8" fill="${p2}" stroke="${ln}"/>
    <text x="400" y="163" text-anchor="middle" fill="${gr}" font-family="JetBrains Mono, monospace" font-size="13">Cat : Animal</text>
    <text x="400" y="183" text-anchor="middle" fill="${s}" font-family="JetBrains Mono, monospace" font-size="10">overrides Speak()</text>
    <line x1="200" y1="75" x2="130" y2="138" stroke="${s}" stroke-width="1.3" marker-end="url(#arrow3)"/>
    <line x1="320" y1="75" x2="390" y2="138" stroke="${s}" stroke-width="1.3" marker-end="url(#arrow3)"/>
    <text x="260" y="205" text-anchor="middle" fill="${t}" font-family="JetBrains Mono, monospace" font-size="10">Dog and Cat each inherit from, and extend, Animal</text>
  </svg>`;
}

// ---------- Tutor floating widget ----------
const tutorWidget = { open: false, msgs: [{ from: "tutor", text: "Hi! Ask me about SELECT, WHERE, JOIN, GROUP BY — anything from the course." }], input: "", loading: false };

function renderTutorWidget() {
  let el = document.getElementById("tutorWidgetRoot");
  if (!el) {
    el = document.createElement("div");
    el.id = "tutorWidgetRoot";
    document.body.appendChild(el);
  }
  const panel = tutorWidget.open
    ? `<div class="tutor-widget-panel">
        <div class="flex items-center justify-between tutor-widget-header"><span class="mono-label">AI Tutor</span><span data-action="tutor-close" style="cursor:pointer">${icon("close", COLORS.sub, 15)}</span></div>
        <div class="tutor-widget-body" id="tutorWidgetBody">
          ${tutorWidget.msgs.map((m) => `<div class="tutor-msg ${m.from}">${escapeHtml(m.text)}</div>`).join("")}
          ${tutorWidget.loading ? `<div class="tutor-msg tutor">thinking…</div>` : ""}
        </div>
        <div class="flex tutor-widget-input-row">
          <input id="tutorWidgetInput" placeholder="Ask about WHERE, JOIN…" value="${escapeAttr(tutorWidget.input)}" />
          <button data-action="tutor-send">Send</button>
        </div>
      </div>`
    : "";
  el.innerHTML = `${panel}<button class="tutor-fab" data-action="tutor-toggle" aria-label="Open AI tutor">${icon("message", COLORS.white, 22)}</button>`;
  el.style.position = "fixed";
  el.style.bottom = "24px";
  el.style.right = "24px";
  el.style.zIndex = "50";

  const body = document.getElementById("tutorWidgetBody");
  if (body) body.scrollTop = body.scrollHeight;
}

// ---------- Live charts (Chart.js) ----------
function renderLiveCharts() {
  Object.values(liveCharts).forEach((c) => c.destroy());
  liveCharts = {};

  const staticCanvas = document.getElementById("staticSalaryChart");
  if (staticCanvas) {
    liveCharts.staticSalary = new Chart(staticCanvas, {
      type: "bar",
      data: {
        labels: TABLES_EMPLOYEES.map((e) => e.name.split(" ")[0]),
        datasets: [{ label: "Salary", data: TABLES_EMPLOYEES.map((e) => e.salary), backgroundColor: COLORS.dkCyan, borderRadius: 4 }],
      },
      options: chartOptions(),
    });
  }

  const liveCanvas = document.getElementById("liveChart");
  if (liveCanvas) {
    const lessons = getLessons(state.courseId, state.level, state.track);
    const lesson = lessons[state.lessonIdx];
    const result = runSQL(lesson.query);
    if (!result.error) {
      const labelCol = result.columns[0];
      const valueCol = result.columns[1];
      liveCharts.live = new Chart(liveCanvas, {
        type: "bar",
        data: {
          labels: result.rows.map((r) => r[labelCol]),
          datasets: [{ label: valueCol, data: result.rows.map((r) => r[valueCol]), backgroundColor: COLORS.dkMagenta, borderRadius: 4 }],
        },
        options: chartOptions(),
      });
    }
  }

  // Run any visible mini-playgrounds that haven't been run yet, so results show immediately once the engine is ready
  document.querySelectorAll(".mini-sql-input").forEach((textarea) => {
    const key = textarea.dataset.key;
    const mp = miniPlaygrounds[key];
    if (mp && !mp.ranOnce && dbReady) {
      const res = runSQL(mp.query);
      mp.ranOnce = true;
      if (res.error) mp.error = res.error;
      else { mp.result = res; mp.error = null; }
      const resultEl = textarea.parentElement.querySelector(".empty-rows, .table-wrap, .error-text");
      if (resultEl) {
        resultEl.outerHTML = mp.error ? `<div class="error-text">⚠ ${escapeHtml(mp.error)}</div>` : dataTableHtml(mp.result.columns, mp.result.rows);
      }
    }
  });

  // Data Analytics: trend chart (no SQL, plain JS aggregation)
  document.querySelectorAll(".trend-chart").forEach((canvas) => {
    const key = canvas.dataset.key;
    const ts = trendState[key] || { metric: "count" };
    const byYear = {};
    DA_EMPLOYEES.forEach((e) => {
      const year = e.hireDate.slice(0, 4);
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(e.salary);
    });
    const years = Object.keys(byYear).sort();
    const values = years.map((y) => (ts.metric === "count" ? byYear[y].length : Math.round(mean(byYear[y]))));
    liveCharts[canvas.id] = new Chart(canvas, {
      type: "line",
      data: {
        labels: years,
        datasets: [{
          label: ts.metric === "count" ? "Hires" : "Avg salary",
          data: values,
          borderColor: COLORS.dkMagenta,
          backgroundColor: COLORS.dkMagenta + "33",
          tension: 0.3,
          fill: true,
        }],
      },
      options: chartOptions(),
    });
  });

  // Data Analytics: pivot builder chart (no SQL, plain JS aggregation)
  document.querySelectorAll(".pivot-chart").forEach((canvas) => {
    const key = canvas.dataset.key;
    const ps = pivotState[key] || { dataset: "employees", agg: "avg" };
    const cfg = PIVOT_CONFIG[ps.dataset];
    const results = groupByAgg(cfg.data, cfg.groupField, cfg.metricField, ps.agg);
    liveCharts[canvas.id] = new Chart(canvas, {
      type: "bar",
      data: {
        labels: results.map((r) => r.group),
        datasets: [{ label: `${ps.agg}(${cfg.metricField})`, data: results.map((r) => r.value), backgroundColor: COLORS.dkCyan, borderRadius: 4 }],
      },
      options: chartOptions(),
    });
  });
}

function chartOptions() {
  return {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: COLORS.dkSub, font: { family: "JetBrains Mono" } }, grid: { color: COLORS.dkLine } },
      y: { ticks: { color: COLORS.dkSub, font: { family: "JetBrains Mono" } }, grid: { color: COLORS.dkLine } },
    },
  };
}

const TABLES_EMPLOYEES = [
  { name: "Ana Reyes", salary: 32000 },
  { name: "Marco Cruz", salary: 45000 },
  { name: "Liza Santos", salary: 29000 },
  { name: "Jed Ramos", salary: 51000 },
  { name: "Pia Torres", salary: 34000 },
  { name: "Noel Dizon", salary: 30000 },
];

// ---------- Event handling (delegated) ----------
function attachHandlers() {
  document.querySelectorAll("[data-action]").forEach((elm) => {
    elm.addEventListener("click", onAction);
  });

  const authForm = document.querySelector('form[data-action="submit-auth-form"]');
  if (authForm) authForm.addEventListener("submit", onAuthFormSubmit);

  document.querySelectorAll(".course-card.active").forEach((card) => {
    card.addEventListener("pointermove", handleCardGlowMove);
  });

  const pgInput = document.getElementById("playgroundInput");
  if (pgInput) pgInput.addEventListener("input", (e) => (playgroundQuery = e.target.value));

  document.querySelectorAll(".mini-sql-input").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      if (miniPlaygrounds[key]) miniPlaygrounds[key].query = e.target.value;
    });
  });

  document.querySelectorAll(".csharp-input").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      if (csharpPlaygrounds[key]) csharpPlaygrounds[key].code = e.target.value;
    });
  });
  document.querySelectorAll(".csharp-stdin").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      if (csharpPlaygrounds[key]) csharpPlaygrounds[key].stdin = e.target.value;
    });
  });

  document.querySelectorAll(".python-input").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      if (pythonPlaygrounds[key]) pythonPlaygrounds[key].code = e.target.value;
    });
  });
  document.querySelectorAll(".python-stdin").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      if (pythonPlaygrounds[key]) pythonPlaygrounds[key].stdin = e.target.value;
    });
  });

  document.querySelectorAll(".js-input").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      if (jsPlaygrounds[key]) jsPlaygrounds[key].code = e.target.value;
    });
  });

  // Code editors are plain <textarea>s, which by default treat Tab as
  // "move focus to the next field" rather than "indent" - the browser's
  // normal (and correct, for a form) behavior, but not what anyone
  // writing indented code expects. This makes Tab insert two spaces at
  // the cursor instead, like every real code editor, and Shift+Tab
  // remove up to two leading spaces from the current line for outdenting.
  document.querySelectorAll(".python-input, .csharp-input, .js-input, .mini-sql-input, #playgroundInput").forEach((elm) => {
    elm.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (e.shiftKey) {
        const lineStart = el.value.lastIndexOf("\n", start - 1) + 1;
        const removable = el.value.slice(lineStart, start).match(/^ {1,2}/);
        if (removable) {
          el.value = el.value.slice(0, lineStart) + el.value.slice(lineStart + removable[0].length);
          const shrink = removable[0].length;
          el.selectionStart = start - shrink;
          el.selectionEnd = end - shrink;
        }
      } else {
        el.value = el.value.slice(0, start) + "  " + el.value.slice(end);
        el.selectionStart = el.selectionEnd = start + 2;
      }
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  document.querySelectorAll(".excel-cell").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const row = Number(e.target.dataset.row);
      const col = Number(e.target.dataset.col);
      if (!excelGrids[key]) return;
      excelGrids[key].raw[row][col] = e.target.value;
      const results = computeGrid(excelGrids[key].raw);
      if (!results) return;
      const widget = e.target.closest(".widget-panel");
      if (!widget) return;
      const resultTable = widget.querySelectorAll(".excel-grid")[1];
      if (!resultTable) return;
      const cells = resultTable.querySelectorAll("tbody td");
      let i = 0;
      for (let r = 0; r < results.length; r++) {
        for (let c = 0; c < results[r].length; c++) {
          if (cells[i]) cells[i].textContent = results[r][c];
          i++;
        }
      }
    });
  });

  document.querySelectorAll(".cli-input").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      if (cliSims[key]) cliSims[key].input = e.target.value;
    });
    elm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const btn = document.querySelector(`[data-action="run-cli"][data-key="${e.target.dataset.key}"]`);
        if (btn) btn.click();
      }
    });
  });

  document.querySelectorAll(".dax-input").forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      if (daxCalcState[key]) daxCalcState[key].formula = e.target.value;
    });
    elm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const btn = document.querySelector(`[data-action="run-dax"][data-key="${e.target.dataset.key}"]`);
        if (btn) btn.click();
      }
    });
  });

  document.querySelectorAll('[data-role="cloud-cost-input"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const field = e.target.dataset.field;
      cloudCostState[key] = cloudCostState[key] || {};
      cloudCostState[key][field] = Number(e.target.value) || 0;
      const widget = e.target.closest(".widget-panel");
      if (widget) {
        const s = cloudCostState[key];
        const monthly = Math.round((s.instances || 0) * (s.hourlyRate || 0) * (s.hoursPerMonth || 0) * 100) / 100;
        const resultEl = widget.querySelector(".cloud-cost-result");
        if (resultEl) resultEl.textContent = `$${monthly.toLocaleString()}`;
      }
    });
  });

  document.querySelectorAll('[data-role="cost-compare-input"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const field = e.target.dataset.field;
      costCompareState[key] = costCompareState[key] || {};
      costCompareState[key][field] = Number(e.target.value) || 0;
      const widget = e.target.closest(".widget-panel");
      if (widget) {
        const s = costCompareState[key];
        const onDemandTotal = Math.round((s.instances || 0) * (s.onDemandRate || 0) * (s.hoursPerMonth || 0) * 100) / 100;
        const reservedTotal = Math.round((s.instances || 0) * (s.reservedRate || 0) * (s.hoursPerMonth || 0) * 100) / 100;
        const savingsPct = onDemandTotal === 0 ? 0 : Math.round(((onDemandTotal - reservedTotal) / onDemandTotal) * 1000) / 10;
        const odEl = widget.querySelector(".cost-compare-ondemand");
        const rsEl = widget.querySelector(".cost-compare-reserved");
        const svEl = widget.querySelector(".cost-compare-savings");
        if (odEl) odEl.textContent = `$${onDemandTotal.toLocaleString()}`;
        if (rsEl) rsEl.textContent = `$${reservedTotal.toLocaleString()}`;
        if (svEl) svEl.textContent = `${savingsPct}%`;
      }
    });
  });

  const kpiFilter = document.querySelector('[data-role="kpi-filter"]');
  if (kpiFilter) kpiFilter.addEventListener("change", (e) => {
    kpiState[e.target.dataset.key] = { status: e.target.value };
    render();
  });

  document.querySelectorAll('[data-role="stats-cell"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const idx = Number(e.target.dataset.idx);
      const val = Number(e.target.value) || 0;
      if (statsCalcData[key] && statsCalcData[key][idx]) {
        statsCalcData[key][idx].salary = val;
        // Update just the stat cards without a full re-render, so the input keeps focus while typing.
        const widget = e.target.closest(".widget-panel");
        if (widget) {
          const salaries = statsCalcData[key].map((r) => Number(r.salary) || 0);
          const cards = widget.querySelectorAll(".stat-value");
          if (cards.length >= 4) {
            cards[0].textContent = Math.round(mean(salaries)).toLocaleString();
            cards[1].textContent = Math.round(median(salaries)).toLocaleString();
            cards[2].textContent = minOf(salaries).toLocaleString();
            cards[3].textContent = maxOf(salaries).toLocaleString();
            if (cards[4]) cards[4].textContent = Math.round(stdev(salaries)).toLocaleString();
          }
        }
      }
    });
  });

  const trendMetric = document.querySelector('[data-role="trend-metric"]');
  if (trendMetric) trendMetric.addEventListener("change", (e) => {
    trendState[e.target.dataset.key] = { metric: e.target.value };
    render();
  });

  const pivotDataset = document.querySelector('[data-role="pivot-dataset"]');
  if (pivotDataset) pivotDataset.addEventListener("change", (e) => {
    const key = e.target.dataset.key;
    pivotState[key] = { ...pivotState[key], dataset: e.target.value };
    render();
  });
  const pivotAgg = document.querySelector('[data-role="pivot-agg"]');
  if (pivotAgg) pivotAgg.addEventListener("change", (e) => {
    const key = e.target.dataset.key;
    pivotState[key] = { ...pivotState[key], agg: e.target.value };
    render();
  });

  document.querySelectorAll('[data-role="percent-input"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const field = e.target.dataset.field;
      percentCalcState[key] = percentCalcState[key] || { before: 0, after: 0 };
      percentCalcState[key][field] = Number(e.target.value) || 0;
      const widget = e.target.closest(".widget-panel");
      if (widget) {
        const s = percentCalcState[key];
        const pct = s.before === 0 ? null : ((s.after - s.before) / s.before) * 100;
        const resultEl = widget.querySelector(".calc-result");
        if (resultEl) {
          resultEl.textContent = pct === null ? "Can't divide by zero" : `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
          resultEl.style.color = pct === null ? "var(--red)" : pct >= 0 ? "var(--green)" : "var(--red)";
        }
      }
    });
  });

  document.querySelectorAll('[data-role="weighted-value"], [data-role="weighted-weight"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const idx = Number(e.target.dataset.idx);
      const field = e.target.dataset.role === "weighted-value" ? "value" : "weight";
      if (weightedAvgData[key] && weightedAvgData[key][idx]) {
        weightedAvgData[key][idx][field] = Number(e.target.value) || 0;
        const widget = e.target.closest(".widget-panel");
        if (widget) {
          const rows = weightedAvgData[key];
          const simpleAvg = mean(rows.map((r) => Number(r.value) || 0));
          const totalWeight = sumOf(rows.map((r) => Number(r.weight) || 0));
          const weightedAvg = totalWeight === 0 ? 0 : sumOf(rows.map((r) => (Number(r.value) || 0) * (Number(r.weight) || 0))) / totalWeight;
          const simpleEl = widget.querySelector(".wavg-simple");
          const weightedEl = widget.querySelector(".wavg-weighted");
          if (simpleEl) simpleEl.textContent = Math.round(simpleAvg).toLocaleString();
          if (weightedEl) weightedEl.textContent = Math.round(weightedAvg).toLocaleString();
        }
      }
    });
  });

  const compareA = document.querySelector('[data-role="compare-a"]');
  if (compareA) compareA.addEventListener("change", (e) => {
    const key = e.target.dataset.key;
    comparisonState[key] = { ...comparisonState[key], a: e.target.value };
    render();
  });
  const compareB = document.querySelector('[data-role="compare-b"]');
  if (compareB) compareB.addEventListener("change", (e) => {
    const key = e.target.dataset.key;
    comparisonState[key] = { ...comparisonState[key], b: e.target.value };
    render();
  });

  document.querySelectorAll('[data-role="forecast-input"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const idx = Number(e.target.dataset.idx);
      if (forecastData[key]) {
        forecastData[key][idx] = Number(e.target.value) || 0;
        const widget = e.target.closest(".widget-panel");
        if (widget) {
          const vals = forecastData[key];
          const deltas = [];
          for (let i = 1; i < vals.length; i++) deltas.push(vals[i] - vals[i - 1]);
          const avgDelta = deltas.length ? mean(deltas) : 0;
          const forecast = Math.round((vals[vals.length - 1] + avgDelta) * 10) / 10;
          const resultEl = widget.querySelector(".forecast-result");
          if (resultEl) resultEl.textContent = forecast;
        }
      }
    });
  });

  document.querySelectorAll('[data-role="regression-input"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      percentCalcState[key] = percentCalcState[key] || {};
      percentCalcState[key].input = Number(e.target.value) || 0;
      const widget = e.target.closest(".widget-panel");
      if (widget) {
        const rows = DA_EMPLOYEES.map((emp) => ({ tenure: 2026 - Number(emp.hireDate.slice(0, 4)), salary: emp.salary }));
        const { slope, intercept } = linearRegression(rows.map((r) => r.tenure), rows.map((r) => r.salary));
        const predicted = Math.round(slope * percentCalcState[key].input + intercept);
        const resultEl = widget.querySelector(".regression-result");
        if (resultEl) resultEl.textContent = predicted.toLocaleString();
      }
    });
  });

  document.querySelectorAll('[data-role="funnel-input"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const idx = Number(e.target.dataset.idx);
      if (funnelData[key]) {
        funnelData[key][idx] = Number(e.target.value) || 0;
        const widget = e.target.closest(".widget-panel");
        if (widget) {
          const vals = funnelData[key];
          const pctCells = widget.querySelectorAll(".funnel-pct");
          pctCells.forEach((cell, i) => {
            const pct = i === 0 ? 100 : Math.round((vals[i] / (vals[0] || 1)) * 1000) / 10;
            cell.textContent = `${pct}%`;
          });
        }
      }
    });
  });

  document.querySelectorAll('[data-role="clv-input"]').forEach((elm) => {
    elm.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      const field = e.target.dataset.field;
      clvState[key] = clvState[key] || {};
      clvState[key][field] = Number(e.target.value) || 0;
      const widget = e.target.closest(".widget-panel");
      if (widget) {
        const s = clvState[key];
        const clv = Math.round((s.avgOrderValue || 0) * (s.purchasesPerYear || 0) * (s.lifespanYears || 0));
        const resultEl = widget.querySelector(".clv-result");
        if (resultEl) resultEl.textContent = clv.toLocaleString();
      }
    });
  });

  const tutorInput = document.getElementById("tutorWidgetInput");
  if (tutorInput) {
    tutorInput.addEventListener("input", (e) => (tutorWidget.input = e.target.value));
    tutorInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendTutorMessage();
    });
  }

  const checkinInput = document.getElementById("checkinQuestionInput");
  if (checkinInput) {
    checkinInput.addEventListener("input", (e) => (state.checkin.question = e.target.value));
    checkinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitCheckinQuestion();
    });
  }
}

function onAuthFormSubmit(e) {
  e.preventDefault();
  if (authState.submitting) return;
  const form = e.currentTarget;
  const isLogin = authState.modalView === "login";
  // form.elements.namedItem(...), not form.email/form.name directly - "name"
  // collides with HTMLFormElement's own built-in .name property (a form can
  // have its own name="" attribute), so form.name would silently return that
  // instead of the "name" input field rather than throwing - .elements is
  // the reliable way to look up a control regardless of what it's called.
  const email = form.elements.namedItem("email").value.trim();
  const password = form.elements.namedItem("password").value;
  const name = isLogin ? undefined : form.elements.namedItem("name").value.trim();

  authState.error = null;
  authState.submitting = true;
  render();

  const endpoint = isLogin ? "login.php" : "register.php";
  const body = isLogin ? { email, password } : { name, email, password };

  apiCall(endpoint, { method: "POST", body: JSON.stringify(body) })
    .then((data) => {
      authState.user = data.user;
      authState.modalView = null;
    })
    .catch((err) => { authState.error = err.message; })
    .finally(() => { authState.submitting = false; render(); });
}

// Reads the *live* value of a code editor. Once upgradeCodeEditors() has
// upgraded a <textarea data-cm-mode="..."> into CodeMirror, the original
// textarea is hidden and stops tracking what's actually typed (CodeMirror
// only writes back to it via .save(), which nothing here calls) - so a
// plain el.value read after that point returns stale, pre-upgrade content.
// CodeMirror's own editor lives on the wrapper it inserts right after the
// original textarea, so that's where the real current value comes from.
function getEditorValue(textareaEl) {
  if (!textareaEl) return "";
  const wrapper = textareaEl.nextElementSibling;
  if (wrapper && wrapper.CodeMirror) return wrapper.CodeMirror.getValue();
  return textareaEl.value;
}

function onAction(e) {
  const el = e.currentTarget;
  const action = el.dataset.action;

  if (action === "go-catalog") { state.view = "catalog"; render(); }
  else if (action === "toggle-theme") { toggleTheme(e); }
  else if (action === "go-course") { state.view = "course"; state.courseId = el.dataset.course; state.level = "entry"; state.track = "basic"; state.lessonIdx = 0; resetCheckin(); resetQuiz(); resetModule(); render(); }
  else if (action === "set-level") { state.level = el.dataset.level; state.track = "basic"; state.lessonIdx = 0; resetCheckin(); resetQuiz(); resetModule(); render(); }
  else if (action === "set-track") { state.track = el.dataset.track; state.lessonIdx = 0; resetCheckin(); resetQuiz(); resetModule(); render(); }
  else if (action === "go-lesson") { state.lessonIdx = Number(el.dataset.idx); resetCheckin(); resetModule(); render(); }
  else if (action === "go-practice") { state.lessonIdx = getLessons(state.courseId, state.level, state.track).length; resetModule(); render(); }
  else if (action === "open-auth-login") { authState.modalView = "login"; authState.error = null; render(); }
  else if (action === "open-auth-register") { authState.modalView = "register"; authState.error = null; render(); }
  else if (action === "switch-auth-view") { authState.modalView = el.dataset.view; authState.error = null; render(); }
  else if (action === "close-auth-modal") {
    if (e.target !== e.currentTarget) return; // click was on a child (the form etc.) that bubbled up - don't close
    authState.modalView = null; authState.error = null; render();
  }
  else if (action === "dismiss-auth-modal") {
    // The X button - always closes, no target check needed (unlike the
    // backdrop above, a click anywhere on this button, including its icon,
    // should close it - that's what an X button is for).
    authState.modalView = null; authState.error = null; render();
  }
  else if (action === "toggle-password-visibility") {
    // Direct DOM toggle (no render()) so the input keeps focus and its typed value -
    // a full re-render would rebuild the form and lose both.
    const wrap = el.closest(".auth-input-wrap");
    const input = wrap.querySelector(".auth-input");
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    el.innerHTML = icon(showing ? "eye" : "eyeOff", "var(--sub)", 16);
    el.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  }
  else if (action === "do-logout") {
    apiCall("logout.php", { method: "POST" }).catch(() => {}).finally(() => { authState.user = null; render(); });
  }
  else if (action === "enter-module") { state.lessonIdx = Number(el.dataset.idx); state.moduleId = el.dataset.module; state.moduleLessonIdx = -1; resetCheckin(); render(); }
  else if (action === "module-start") { state.moduleLessonIdx = 0; resetCheckin(); render(); }
  else if (action === "module-lesson-nav") { state.moduleLessonIdx = Number(el.dataset.idx); resetCheckin(); render(); }
  else if (action === "exit-module") { resetModule(); resetCheckin(); render(); }
  else if (action === "exit-module-continue") { state.lessonIdx += 1; resetModule(); resetCheckin(); render(); }
  else if (action === "checkin-next") {
    if (state.moduleId) { state.moduleLessonIdx += 1; }
    else { state.lessonIdx += 1; }
    resetCheckin();
    render();
  } else if (action === "checkin-explain") { state.checkin.mode = "explained"; render(); }
  else if (action === "checkin-ask") { state.checkin.mode = "asking"; state.checkin.question = ""; render(); }
  else if (action === "checkin-submit") { submitCheckinQuestion(); }
  else if (action === "quiz-pick") {
    if (!quizSubmitted) quizAnswers[Number(el.dataset.qi)] = Number(el.dataset.oi);
    render();
  } else if (action === "quiz-submit") { quizSubmitted = true; render(); }
  else if (action === "run-playground") {
    const val = getEditorValue(document.getElementById("playgroundInput"));
    playgroundQuery = val;
    const res = runSQL(val);
    if (res.error) { playgroundError = res.error; playgroundResult = null; }
    else { playgroundError = null; playgroundResult = res; }
    render();
  } else if (action === "run-csharp") {
    const key = el.dataset.key;
    const codeEl = document.querySelector(`.csharp-input[data-key="${key}"]`);
    const stdinEl = document.querySelector(`.csharp-stdin[data-key="${key}"]`);
    const cp = csharpPlaygrounds[key];
    if (cp) {
      cp.code = getEditorValue(codeEl);
      cp.stdin = stdinEl ? stdinEl.value : cp.stdin;
      cp.running = true;
      cp.output = null;
      cp.error = null;
      cp.compileError = null;
      render();
      runCSharp(cp.code, cp.stdin).then((res) => {
        cp.running = false;
        if (res.error) cp.error = res.error;
        else if (res.compileError) cp.compileError = res.compileError;
        else cp.output = res.output + (res.runtimeError ? "\n" + res.runtimeError : "");
        render();
      });
    }
  } else if (action === "run-python") {
    const key = el.dataset.key;
    const codeEl = document.querySelector(`.python-input[data-key="${key}"]`);
    const stdinEl = document.querySelector(`.python-stdin[data-key="${key}"]`);
    const pp = pythonPlaygrounds[key];
    if (pp) {
      pp.code = getEditorValue(codeEl);
      pp.stdin = stdinEl ? stdinEl.value : pp.stdin;
      pp.running = true;
      pp.output = null;
      pp.error = null;
      render();
      runPython(pp.code, pp.stdin).then((res) => {
        pp.running = false;
        if (res.error) pp.error = res.error;
        else pp.output = res.output;
        render();
      });
    }
  } else if (action === "run-js") {
    const key = el.dataset.key;
    const codeEl = document.querySelector(`.js-input[data-key="${key}"]`);
    const jp = jsPlaygrounds[key];
    if (jp) {
      jp.code = getEditorValue(codeEl);
      jp.running = true;
      jp.output = null;
      jp.error = null;
      render();
      runJS(jp.code).then((res) => {
        jp.running = false;
        if (res.error) jp.error = res.output ? `${res.output}\n⚠ ${res.error}` : res.error;
        else jp.output = res.output;
        render();
      });
    }
  } else if (action === "run-cli") {
    const key = el.dataset.key;
    const inputEl = document.querySelector(`.cli-input[data-key="${key}"]`);
    const sim = cliSims[key];
    if (sim && inputEl) {
      const cmd = inputEl.value;
      if (!cmd.trim()) return;
      const lessons = getLessons(state.courseId, state.level, state.track);
      const lesson = lessons[state.lessonIdx];
      const cliSpec = lesson && lesson.cli;
      const output = cliSpec ? runCliCommand(cliSpec, cmd) : "No command set for this simulation.";
      sim.history.push({ cmd, output });
      sim.input = "";
      render();
    }
  } else if (action === "run-dax") {
    const key = el.dataset.key;
    const inputEl = document.querySelector(`.dax-input[data-key="${key}"]`);
    const s = daxCalcState[key];
    if (s && inputEl) {
      s.formula = inputEl.value;
      const res = runDax(s.formula);
      if (res.error) { s.error = res.error; s.result = null; }
      else { s.error = null; s.result = res.result; }
      render();
    }
  } else if (action === "run-mini") {
    const key = el.dataset.key;
    const textarea = document.querySelector(`.mini-sql-input[data-key="${key}"]`);
    const val = getEditorValue(textarea);
    const res = runSQL(val);
    miniPlaygrounds[key] = { query: val, ranOnce: true, result: res.error ? null : res, error: res.error || null };
    render();
  } else if (action === "toggle-hint") {
    const key = el.dataset.key;
    challengeState[key] = challengeState[key] || { hint: false, solution: false };
    challengeState[key].hint = !challengeState[key].hint;
    render();
  } else if (action === "toggle-solution") {
    const key = el.dataset.key;
    challengeState[key] = challengeState[key] || { hint: false, solution: false };
    challengeState[key].solution = !challengeState[key].solution;
    render();
  } else if (action === "load-solution") {
    const key = el.dataset.key;
    const lessons = getLessons(state.courseId, state.level, state.track);
    const lesson = lessons[state.lessonIdx];
    if (lesson.challenge && lesson.query) {
      const res = runSQL(lesson.challenge.solution);
      miniPlaygrounds[key] = { query: lesson.challenge.solution, ranOnce: true, result: res.error ? null : res, error: res.error || null };
      render();
    } else if (lesson.challenge && lesson.code) {
      csharpPlaygrounds[key] = { code: lesson.challenge.solution, stdin: csharpPlaygrounds[key] ? csharpPlaygrounds[key].stdin : "", output: null, error: null, compileError: null, running: false };
      render();
    } else if (lesson.challenge && lesson.pycode) {
      pythonPlaygrounds[key] = { code: lesson.challenge.solution, stdin: pythonPlaygrounds[key] ? pythonPlaygrounds[key].stdin : "", output: null, error: null, running: false };
      render();
    } else if (lesson.challenge && lesson.jscode) {
      jsPlaygrounds[key] = { code: lesson.challenge.solution, output: null, error: null, running: false };
      render();
    }
  } else if (action === "insight-pick") {
    const key = el.dataset.key;
    insightState[key] = { selected: Number(el.dataset.idx) };
    render();
  } else if (action === "tutor-toggle") { tutorWidget.open = !tutorWidget.open; render(); }
  else if (action === "tutor-close") { tutorWidget.open = false; render(); }
  else if (action === "tutor-send") { sendTutorMessage(); }
}

async function submitCheckinQuestion() {
  if (!state.checkin.question.trim()) return;
  state.checkin.loading = true;
  render();
  const lessons = getLessons(state.courseId, state.level, state.track);
  const lesson = lessons[state.lessonIdx];
  const reply = await askTutor(state.checkin.question, lesson.title);
  state.checkin.answer = reply;
  state.checkin.mode = "answered";
  state.checkin.loading = false;
  render();
}

async function sendTutorMessage() {
  if (!tutorWidget.input.trim()) return;
  const msg = tutorWidget.input;
  tutorWidget.msgs.push({ from: "user", text: msg });
  tutorWidget.input = "";
  tutorWidget.loading = true;
  renderTutorWidget();
  const lessons = getLessons(state.courseId, state.level, state.track);
  const lesson = lessons[state.lessonIdx];
  const reply = await askTutor(msg, lesson ? lesson.title : "the course");
  tutorWidget.msgs.push({ from: "tutor", text: reply });
  tutorWidget.loading = false;
  renderTutorWidget();
  attachHandlers();
}

function resetCheckin() {
  state.checkin = { mode: "ask", question: "", answer: "", loading: false };
}

function resetQuiz() {
  Object.keys(quizAnswers).forEach((k) => delete quizAnswers[k]);
  quizSubmitted = false;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(str) {
  return escapeHtml(str);
}

// ---------- Boot ----------
if (isNativeApp()) document.documentElement.classList.add("native-app");
render();
getDb().then(() => render());
fetchCurrentUser();

// Service worker registration (PWA installability + offline app shell).
// Guarded: service workers require HTTPS (or localhost) and aren't
// supported everywhere, so this quietly does nothing rather than error
// when either isn't true.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // Most likely running over plain HTTP during local testing - fine,
      // the app works the same either way, it just won't be installable.
    });
  });
}

// Android hardware/gesture back button: without this, Android's default is
// to just close the whole app on every back press, which feels wrong for a
// single-page app like this one - back should step through lesson/module
// navigation first, the way a real native app's back stack would, and only
// actually exit once there's nowhere further back to go.
if (isNativeApp() && typeof Capacitor !== "undefined" && Capacitor.Plugins && Capacitor.Plugins.App) {
  Capacitor.Plugins.App.addListener("backButton", () => {
    if (authState.modalView) { authState.modalView = null; authState.error = null; render(); return; }
    if (state.moduleId) {
      if (state.moduleLessonIdx > -1) { state.moduleLessonIdx--; resetCheckin(); render(); }
      else { resetModule(); render(); }
      return;
    }
    if (state.view === "course" && state.lessonIdx > 0) { state.lessonIdx--; resetCheckin(); render(); return; }
    if (state.view === "course") { state.view = "catalog"; render(); return; }
    Capacitor.Plugins.App.exitApp();
  });
}
