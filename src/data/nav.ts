/** Navegação pública do Lupa do Brasil. */

/** Links do header (logo = início; Fontes e Aa ficam no rodapé). */
export const HEADER_LINKS = [
  { href: "/eleicoes", label: "Eleições 2026" },
  { href: "/noticias", label: "Casos" },
  { href: "/glossario", label: "Glossário" },
] as const;

/** Links do rodapé (lista completa + Fontes + Privacidade + Buscar). */
export const FOOTER_LINKS = [
  { href: "/", label: "Início" },
  { href: "/eleicoes", label: "Eleições 2026" },
  { href: "/noticias", label: "Casos" },
  { href: "/glossario", label: "Glossário" },
  { href: "/fontes", label: "Fontes" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/pesquisa", label: "Buscar" },
] as const;

/** @deprecated Prefer HEADER_LINKS / FOOTER_LINKS. */
export const NAV_LINKS = FOOTER_LINKS;

/** Ferramentas da seção de Presidência (hub /eleicoes). */
export const ELEICOES_LINKS = [
  { href: "/eleicoes", label: "Candidatos" },
  { href: "/comparar", label: "Comparar" },
  { href: "/buscar", label: "Áreas" },
] as const;
