import {
  APP_LOCALES,
  DEFAULT_ACTIVE_LOCALE,
  FALLBACK_LOCALE,
  getLocale as getSharedLocale,
  setLocale as setSharedLocale,
  type AppLocale,
} from "../shared/i18n";
import { readDesktopConfig, writeDesktopConfig } from "./config";

const DESKTOP_LOCALE_KEY = "locale";

function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && APP_LOCALES.includes(value as AppLocale);
}

function readSavedLocale(): AppLocale | undefined {
  const value = readDesktopConfig()[DESKTOP_LOCALE_KEY];
  return isAppLocale(value) ? value : undefined;
}

function writeSavedLocale(locale: AppLocale): void {
  const data = readDesktopConfig();
  data[DESKTOP_LOCALE_KEY] = locale;
  writeDesktopConfig(data);
}

const savedLocale = readSavedLocale();

// Always apply a locale: use saved preference first, then the system locale
// if it's a supported one, otherwise fall back to zh-CN (the new default).
if (savedLocale) {
  setSharedLocale(savedLocale);
} else {
  // Try to detect system locale for first launch
  const systemLang = (() => {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      if (locale === "zh-CN" || locale.startsWith("zh-Hans")) return "zh-CN";
      if (locale === "zh-TW" || locale.startsWith("zh-Hant")) return "zh-TW";
      return undefined;
    } catch {
      return undefined;
    }
  })();
  setSharedLocale(systemLang ?? DEFAULT_ACTIVE_LOCALE);
}

export function getAppLocale(): AppLocale {
  return getSharedLocale() || readSavedLocale() || DEFAULT_ACTIVE_LOCALE;
}

export function setAppLocale(locale: AppLocale): AppLocale {
  const nextLocale = setSharedLocale(locale);
  writeSavedLocale(nextLocale);
  return nextLocale;
}
