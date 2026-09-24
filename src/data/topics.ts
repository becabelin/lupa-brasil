export const TOPICS = [
  {
    id: "economia",
    label: "Economia e emprego",
    description: "Crescimento, emprego, indústria, empreendedorismo e contas públicas.",
  },
  {
    id: "saude",
    label: "Saúde",
    description: "SUS, prevenção, hospitais, medicamentos e atenção básica.",
  },
  {
    id: "educacao",
    label: "Educação",
    description: "Escolas, universidades, alfabetização e formação profissional.",
  },
  {
    id: "seguranca",
    label: "Segurança pública",
    description: "Polícias, crime organizado, violência e sistema prisional.",
  },
  {
    id: "meio-ambiente",
    label: "Meio ambiente e clima",
    description: "Amazônia, desmatamento, transição energética e clima.",
  },
  {
    id: "assistencia-social",
    label: "Assistência social",
    description: "Programas de renda, pobreza, moradia e proteção social.",
  },
  {
    id: "infraestrutura",
    label: "Infraestrutura e cidades",
    description: "Transportes, saneamento, energia e desenvolvimento urbano.",
  },
  {
    id: "agricultura",
    label: "Agricultura e agronegócio",
    description: "Produção rural, agricultura familiar e exportações.",
  },
  {
    id: "direitos",
    label: "Direitos e democracia",
    description: "Direitos humanos, igualdade, instituições e cidadania.",
  },
  {
    id: "relacoes-exteriores",
    label: "Relações exteriores",
    description: "Política externa, comércio internacional e diplomacia.",
  },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];

export function getTopic(id: string) {
  return TOPICS.find((t) => t.id === id);
}
