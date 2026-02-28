import { getLanguage, setLanguage, type Language } from '$api/storage';
import en from '../locales/en.json';
import ja from '../locales/ja.json';
import es from '../locales/es.json';

const translations: Record<Language, Record<string, string>> = { en, ja, es };

let currentLang = $state<Language>('en');

/**
 * Translate a key, with optional interpolation.
 * Supports simple `{key}` replacement and basic plural:
 *   `{count, plural, one {group} other {groups}}`
 */
export function t(key: string, params?: Record<string, string | number>): string {
  let str = translations[currentLang][key] ?? translations['en'][key] ?? key;

  if (params) {
    // Handle {name, plural, one {x} other {y}} patterns first
    str = str.replace(
      /\{(\w+),\s*plural,\s*one\s*\{([^}]*)\}\s*other\s*\{([^}]*)\}\}/g,
      (_match, name, one, other) => {
        const val = Number(params[name]);
        return val === 1 ? one : other;
      },
    );

    // Then handle simple {key} replacements
    str = str.replace(/\{(\w+)\}/g, (_match, name) =>
      params[name] != null ? String(params[name]) : `{${name}}`,
    );
  }

  return str;
}

/** Load language from Chrome storage and set reactive state. */
export async function initI18n(): Promise<void> {
  currentLang = await getLanguage();
}

/** Update language reactively and persist to storage. */
export async function setUILanguage(lang: Language): Promise<void> {
  currentLang = lang;
  await setLanguage(lang);
}
