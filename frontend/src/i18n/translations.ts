export type Language = "en-US" | "pt-BR";

export const LANGUAGES: Language[] = ["en-US", "pt-BR"];

export const translations = {
  "en-US": {
    header: {
      browse: "Browse",
      about: "About",
      journal: "Journal",
      upload: "Upload",
      languageLabel: "Language",
    },
    footer: {
      tag: "Cataloging the living world, one photo at a time.",
    },
    hero: {
      eyebrow: "A living compendium",
      titlePart1: "Wild",
      titleEm: "world",
      subtitle:
        "A field guide for the curious. Snap a photo of any plant, bird, or creature — we'll identify the species and record where you met it.",
      cta: "Catalog a species",
      exploreLink: "View journal",
      statSpecies: "Species cataloged",
      unlockKicker: "Start cataloging",
      featuredLabel: "Today's find",
      featuredNone: "Awaiting first entry",
    },
    field: {
      eyebrow: "The field journal",
      title: "Recent discoveries",
      description:
        "Every entry is identified from a single photograph, then tagged with the date and place it was spotted.",
    },
    compendium: {
      loading: "Loading entries…",
      loadError: "Failed to load entries: {message}",
      emptyTitle: "The journal is still blank",
      emptyText: "Upload a photo to start cataloging the living world.",
      emptyCta: "Add your first entry",
      previous: "← Previous",
      next: "Next →",
      pageInfo: "Page {page} of {total}",
    },
    detail: {
      loading: "Loading entry…",
      loadError: "Failed to load entry: {message}",
      notFound: "Entry not found.",
      back: "Back to browse",
      eyebrow: "Specimen entry",
      locationLabel: "Location",
      catalogedLabel: "Cataloged",
      delete: "Delete Entry",
      deleting: "Deleting...",
      deleteConfirm:
        "Are you sure you want to delete this entry? This action cannot be undone.",
      deleteError: "Failed to delete: {message}",
    },
    upload: {
      eyebrow: "New entry",
      headingPart1: "Add a",
      headingEm: "specimen",
      headingPart2: "to your journal.",
      subheading:
        "Upload a photo and we'll identify the species, then catalog it with today's date and the place you found it.",
      photoSection: "Photo",
      locationSection: "Location (optional)",
      locationHint: "Adding your location helps with species identification.",
      errorLabel: "Upload failed: {message}",
      submit: "Upload & Identify",
      identifying: "Identifying species...",
    },
    photoUploader: {
      dragText: "Drag & drop a photo here, or click to select",
      hint: "Accepts image files",
      remove: "Remove photo",
      ariaLabel: "Upload photo",
      previewAlt: "Preview",
    },
    locationPicker: {
      label: "Location: {lat}, {lon}",
      clear: "Clear location",
      use: "Use my location",
      loading: "Getting location...",
      unsupported: "Geolocation is not supported by your browser.",
      denied: "Location access was denied.",
      unavailable: "Location information is unavailable.",
      timeout: "Location request timed out.",
      unknown: "An unknown error occurred.",
    },
    auth: {
      login: "Log in",
      register: "Create account",
      logout: "Log out",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      loginSubmit: "Log in",
      registerSubmit: "Create account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      loginError: "Login failed: {message}",
      registerError: "Registration failed: {message}",
      passwordMismatch: "Passwords do not match",
      pendingApproval: "Your account is pending approval by an administrator.",
      pendingApprovalTitle: "Awaiting approval",
    },
    common: {
      loading: "Loading…",
      unknownError: "Unknown error",
    },
  },
  "pt-BR": {
    header: {
      browse: "Explorar",
      about: "Sobre",
      journal: "Diário",
      upload: "Enviar",
      languageLabel: "Idioma",
    },
    footer: {
      tag: "Catalogando o mundo vivo, uma foto por vez.",
    },
    hero: {
      eyebrow: "Um compêndio vivo",
      titlePart1: "Mundo",
      titleEm: "selvagem",
      subtitle:
        "Um guia de campo para os curiosos. Fotografe qualquer planta, ave ou criatura — identificamos a espécie e registramos onde você a encontrou.",
      cta: "Catalogar uma espécie",
      exploreLink: "Ver diário",
      statSpecies: "Espécies catalogadas",
      unlockKicker: "Comece a catalogar",
      featuredLabel: "Descoberta de hoje",
      featuredNone: "Aguardando primeiro registro",
    },
    field: {
      eyebrow: "O diário de campo",
      title: "Descobertas recentes",
      description:
        "Cada entrada é identificada a partir de uma única fotografia e marcada com a data e o local onde foi avistada.",
    },
    compendium: {
      loading: "Carregando entradas…",
      loadError: "Falha ao carregar entradas: {message}",
      emptyTitle: "O diário ainda está em branco",
      emptyText: "Envie uma foto para começar a catalogar o mundo vivo.",
      emptyCta: "Adicionar sua primeira entrada",
      previous: "← Anterior",
      next: "Próxima →",
      pageInfo: "Página {page} de {total}",
    },
    detail: {
      loading: "Carregando entrada…",
      loadError: "Falha ao carregar entrada: {message}",
      notFound: "Entrada não encontrada.",
      back: "Voltar para o diário",
      eyebrow: "Registro de espécime",
      locationLabel: "Localização",
      catalogedLabel: "Catalogado em",
      delete: "Excluir entrada",
      deleting: "Excluindo...",
      deleteConfirm:
        "Tem certeza de que deseja excluir esta entrada? Esta ação não pode ser desfeita.",
      deleteError: "Falha ao excluir: {message}",
    },
    upload: {
      eyebrow: "Nova entrada",
      headingPart1: "Adicione um",
      headingEm: "espécime",
      headingPart2: "ao seu diário.",
      subheading:
        "Envie uma foto e identificaremos a espécie, depois a catalogaremos com a data de hoje e o local onde você a encontrou.",
      photoSection: "Foto",
      locationSection: "Localização (opcional)",
      locationHint: "Adicionar sua localização ajuda na identificação da espécie.",
      errorLabel: "Falha no envio: {message}",
      submit: "Enviar e identificar",
      identifying: "Identificando espécie...",
    },
    photoUploader: {
      dragText: "Arraste e solte uma foto aqui, ou clique para selecionar",
      hint: "Aceita arquivos de imagem",
      remove: "Remover foto",
      ariaLabel: "Enviar foto",
      previewAlt: "Pré-visualização",
    },
    locationPicker: {
      label: "Localização: {lat}, {lon}",
      clear: "Limpar localização",
      use: "Usar minha localização",
      loading: "Obtendo localização...",
      unsupported: "A geolocalização não é suportada pelo seu navegador.",
      denied: "O acesso à localização foi negado.",
      unavailable: "As informações de localização não estão disponíveis.",
      timeout: "A solicitação de localização expirou.",
      unknown: "Ocorreu um erro desconhecido.",
    },
    auth: {
      login: "Entrar",
      register: "Criar conta",
      logout: "Sair",
      username: "Usuário",
      email: "E-mail",
      password: "Senha",
      confirmPassword: "Confirmar senha",
      loginSubmit: "Entrar",
      registerSubmit: "Criar conta",
      noAccount: "Não tem uma conta?",
      hasAccount: "Já tem uma conta?",
      loginError: "Falha no login: {message}",
      registerError: "Falha no registro: {message}",
      passwordMismatch: "As senhas não coincidem",
      pendingApproval: "Sua conta está aguardando aprovação de um administrador.",
      pendingApprovalTitle: "Aguardando aprovação",
    },
    common: {
      loading: "Carregando…",
      unknownError: "Erro desconhecido",
    },
  },
} as const;

type TranslationShape = (typeof translations)["en-US"];

type NestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends object
      ? NestedKeys<T[K], `${Prefix}${K}.`>
      : never;
}[keyof T & string];

export type TranslationKey = NestedKeys<TranslationShape>;

export function resolveKey(
  language: Language,
  key: TranslationKey,
): string {
  const parts = key.split(".");
  let node: unknown = translations[language];
  for (const part of parts) {
    if (node && typeof node === "object" && part in (node as object)) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof node === "string" ? node : key;
}

export function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    name in params ? String(params[name]) : `{${name}}`,
  );
}
