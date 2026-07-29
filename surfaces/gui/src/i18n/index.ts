/** Lightweight UI i18n — English source strings as keys, zh-CN by default. */

import zhCN from "./zh-CN";

export type Locale = "zh-CN" | "en";

const STORAGE_KEY = "openworker.locale";

const catalogs: Record<Locale, Record<string, string>> = {
  "zh-CN": zhCN,
  en: {}, // identity: missing entry → return the English source key
};

let current: Locale = "zh-CN";

function detectInitial(): Locale {
  try {
    const fromEnv = (import.meta as any).env?.VITE_LOCALE as string | undefined;
    if (fromEnv === "en" || fromEnv === "zh-CN") return fromEnv;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh-CN") return stored;
  } catch {
    /* SSR / non-browser */
  }
  return "zh-CN";
}

export function initLocale(force?: Locale): Locale {
  current = force || detectInitial();
  try {
    document.documentElement.lang = current === "zh-CN" ? "zh-CN" : "en";
  } catch {
    /* ignore */
  }
  return current;
}

export function getLocale(): Locale {
  return current;
}

export function setLocale(locale: Locale): void {
  current = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === "zh-CN" ? "zh-CN" : "en";
  } catch {
    /* ignore */
  }
  // Soft reload so every mounted string re-reads; avoids threading locale through React context.
  window.location.reload();
}

/** Translate a UI string. Unknown keys pass through (English source). Supports `{name}` slots. */
export function t(key: string, vars?: Record<string, string | number>): string {
  const table = catalogs[current] || catalogs.en;
  let out = table[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.split(`{${k}}`).join(String(v));
    }
  }
  return out;
}

/** Plural-ish helper: picks one / other by count (Chinese usually ignores). */
export function tn(one: string, other: string, n: number, vars?: Record<string, string | number>): string {
  return t(n === 1 ? one : other, { ...vars, n });
}
