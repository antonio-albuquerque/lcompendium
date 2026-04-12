import { useLanguage } from "./LanguageProvider";

type LocalizedField<F extends string> = `${F}_en` | `${F}_pt`;

export function useLocalized() {
  const { language } = useLanguage();
  const suffix = language === "pt-BR" ? "pt" : "en";

  return function localized<
    F extends string,
    T extends Record<LocalizedField<F>, string>,
  >(obj: T, field: F): string {
    const key = `${field}_${suffix}` as LocalizedField<F>;
    const fallback = `${field}_en` as LocalizedField<F>;
    return obj[key] || obj[fallback] || "";
  };
}
