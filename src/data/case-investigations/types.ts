/**
 * Mesa de investigação: dados cruzáveis para casos imersivos.
 * Tudo factual, com fonte. Sem veredicto.
 */

export type InvestigationEntityKind =
  | "person"
  | "place"
  | "event"
  | "chat"
  | "evidence";

/** Foto no perfil: a pessoa do dossiê aparece na imagem (sozinha ou com alguém do caso). */
export type InvestigationGalleryPhoto = {
  src: string;
  alt: string;
  credit?: string;
  /** Legenda curta sob a foto (cena, data, contexto). */
  caption?: string;
  /**
   * Outras pessoas do caso visíveis no quadro.
   * Clique em “com …” abre o perfil delas. Não use para empurrar retrato alheio.
   */
  withPersonIds?: string[];
  /** Lugar do caso ligado à cena (opcional). */
  placeId?: string;
};

export type InvestigationPerson = {
  id: string;
  name: string;
  role: string;
  /** Retrato principal do perfil (hero). */
  photo?: {
    src: string;
    alt: string;
    credit?: string;
  };
  /** Tags curtas para o board (ex.: STF, Master, defesa). */
  tags?: string[];
  placeIds?: string[];
  eventIds?: string[];
  chatIds?: string[];
  evidenceIds?: string[];
  /** Nota pública / resposta, se houver. */
  response?: string;
  /** Por que esta pessoa entra no dossiê (frases curtas, na frente). */
  whyHere?: string[];
  /** Ficha rápida: o essencial visível sem rolar. */
  keyFacts?: { label: string; value: string }[];
  /**
   * Fotos em que ESTA pessoa aparece no caso (com alguém do dossiê, em cena,
   * registro policial etc.). Banco em /public/noticias/casos/{caso}/…
   * Sem foto dela no quadro → não entra. Sem fallback de rostos de terceiros.
   */
  gallery?: InvestigationGalleryPhoto[];
};

export type InvestigationPlace = {
  id: string;
  name: string;
  kind: "tribunal" | "hotel" | "cidade" | "empresa" | "fundo" | "outro";
  blurb: string;
  personIds?: string[];
  eventIds?: string[];
};

export type InvestigationEvent = {
  id: string;
  when: string;
  /** Título curto no ponto da linha do tempo. */
  title: string;
  text: string;
  /** Destaque visual (ponto “chave”). */
  key?: boolean;
  personIds?: string[];
  placeIds?: string[];
  chatIds?: string[];
  evidenceIds?: string[];
  angleId?: string;
};

export type InvestigationChatMessage = {
  /** id de pessoa ou rótulo (“Operador”, “Sistema”). */
  from: string;
  text: string;
  when?: string;
  /** out = bolha à direita (emissor principal do fio). */
  side?: "in" | "out";
};

export type InvestigationChat = {
  id: string;
  title: string;
  subtitle?: string;
  /** Quem “manda” as bolhas à direita. */
  focusPersonId: string;
  participantIds: string[];
  /** Ex.: “Reprodução a partir de trechos publicados pelo g1.” */
  sourceNote: string;
  sourceUrl?: string;
  messages: InvestigationChatMessage[];
  eventIds?: string[];
  placeIds?: string[];
};

export type InvestigationEvidence = {
  id: string;
  title: string;
  kind: "contrato" | "mensagem" | "relatorio" | "nota" | "outro";
  blurb: string;
  value?: string;
  personIds?: string[];
  eventIds?: string[];
  sourceLabel?: string;
};

export type CaseInvestigation = {
  /** Título curto na barra do overlay. */
  title: string;
  disclaimer: string;
  people: InvestigationPerson[];
  places: InvestigationPlace[];
  events: InvestigationEvent[];
  chats: InvestigationChat[];
  evidence: InvestigationEvidence[];
};
