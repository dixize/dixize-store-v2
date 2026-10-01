"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { translations, translate, type Lang } from "@/lib/translations";

const I18N_STORAGE_KEY = "dixize_lang";

interface LanguageContextValue {
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ru",
  t: (key) => key,
  setLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

function patchDom(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.title = translate("meta.title", lang);

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", translate("meta.description", lang));

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", translate("meta.title", lang));
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute("content", translate("meta.description", lang));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = translate(el.getAttribute("data-i18n") || "", lang);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", translate(el.getAttribute("data-i18n-placeholder") || "", lang));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", translate(el.getAttribute("data-i18n-aria") || "", lang));
  });

  document.querySelectorAll(".lang-switch-indicator").forEach((el) => {
    el.setAttribute("data-active-lang", lang);
  });

  document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  // Restore stored language after mount (server-rendered HTML is always RU).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(I18N_STORAGE_KEY);
      if (stored === "ru" || stored === "en") {
        setLangState(stored);
        patchDom(stored);
      }
    } catch {
      /* localStorage недоступен — остаёмся на RU */
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    patchDom(next);
    try {
      localStorage.setItem(I18N_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>{children}</LanguageContext.Provider>
  );
}
