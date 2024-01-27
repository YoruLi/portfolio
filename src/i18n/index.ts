import English from "@/components/icons/English.astro";
import Spanish from "@/components/icons/Spanish.astro";
import { LANG } from "@/contants";
import i18n from "@/i18n/translate.json";

export const LANGUAGES: Record<string, { code: Languages; name: string; flag: typeof Spanish }> = {
  en: {
    code: "en",
    name: "English",
    flag: English,
  },
  es: {
    code: "es",
    name: "Español",
    flag: Spanish,
  },
};

export const getI18n = ({ currentLocale = "es" }: { currentLocale: string | undefined }) => {
  if (currentLocale == LANG.ENGLISH) return { ...i18n.es, ...i18n.en };

  return i18n.es;
};

export const routes = {
  es: {
    proyectos: "proyectos",
    "sobre-mi": "sobre-mi",
    contacto: "contacto",
  },
  en: {
    proyectos: "projects",
    "sobre-mi": "about",
    contacto: "contact",
  },
};
