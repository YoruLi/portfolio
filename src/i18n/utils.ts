import translate from "@/i18n/translate.json";
import { routes } from ".";

const i18n = translate;

type TranslationKey<T> = keyof T;
const defaultLang: Languages = "es";
export function useTranslation<T extends Languages>(lang: T) {
  return function translate<K extends TranslationKey<(typeof i18n)[typeof defaultLang]>>(key: K): (typeof i18n)[T][K] {
    return i18n[lang][key] || i18n[defaultLang][key];
  };
}

export const translatePath = (path: string, lang: Languages) => {
  const pathname = path.replaceAll("/#", "");
  type Translation = (typeof routes)[typeof lang];
  const hasTranslation = defaultLang !== lang ? routes[lang][pathname as keyof Translation] : undefined;
  const translatePath = hasTranslation ? "/#" + routes[lang][pathname as keyof Translation] : path;

  return defaultLang === lang ? translatePath : `/${lang}${translatePath}`;
};

export const getLangFromUrl = (url: URL) => {
  const [_, lang] = url.pathname.split("/");
  if (lang in translate) {
    return lang as Languages;
  }
  return "es";
};

export const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
  return obj[value];
};
