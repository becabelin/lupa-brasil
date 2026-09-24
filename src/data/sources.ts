/**
 * Fontes oficiais do TSE: fonte primária de verdade do Lupa do Brasil.
 * Sempre preferir TSE a assessoria, imprensa ou redes.
 */

export const TSE_CANDIDATURAS_URL =
  "https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/eleicoes-2026-tem-12-candidaturas-na-disputa-pela-presidencia-da-republica";

export const TSE_CANDIDATURAS_TITLE =
  "Eleições 2026 têm 12 candidaturas na disputa pela Presidência da República (TSE, 11/09/2026)";

export const TSE_PLANS_URL =
  "https://dadosabertos.tse.jus.br/dataset/candidatos-2026/resource/433ac1f4-07dc-44a2-bcbe-c87a2073721a";

export const TSE_PLANS_TITLE =
  "Dados Abertos TSE · propostas de governo dos candidatos 2026";

/** Princípio editorial: tratar todas as chapas igualmente, sem endosso. */
export const EDITORIAL_PRINCIPLES = [
  "Imparcialidade: não endossar, ranquear, criticar ou recomendar candidatos.",
  "Fonte primária: lista de candidaturas e documentos oficiais do TSE.",
  "Transparência: a lista completa de fontes fica em /fontes. Nas demais páginas, um atalho. Sem inventar o que não está no documento.",
  "Análises por IA são extratos factuais dos planos oficiais, sem opinião, sem inventar o que não está no PDF.",
  "Cobertura na ficha do candidato: cards com extrato factual da manchete; o veículo aparece no card. No corpo dos casos e do glossário, narrar o fato; fontes na lista da página e em /fontes.",
  "Narrativa independente: contar o que aconteceu. Não repetir “segundo a imprensa/podcast” a cada frase. Citar origem no texto só quando for necessário.",
  "Fotos: bancos públicos com licença ou crédito claros (Commons, Agências Senado/Câmara/Brasil, Planalto, Flickr Commons, órgãos). Lista em /fontes#fotos.",
  "Casos e Glossário: quando o tema precisa de contexto, abrimos a página. Leitura simples ou completa (preferência do leitor). Links originais em Fontes. Sem veredicto. Sem stub ralo.",
  "Ficha da pessoa (bio, trajetória): fatos públicos com origem em Fontes; separada do extrato do plano. Sem juízo de valor.",
] as const;

/**
 * Quando abrir uma página nova.
 * Casos → /noticias. Conceitos e planos → /glossario.
 * Se passar no critério: criar. Não deixar o leitor só com hover ou link seco.
 */
export const NEWS_PAGE_CRITERIA = [
  "Se o tema aparece nos planos, no debate público ou em caso com várias frentes, e não se explica sozinho: abrir página. Criar quando for necessário.",
  "Aparece em plano oficial do TSE (texto do PDF) em mais de uma chapa deferida, ou é conceito institucional com fonte primária (Constituição, lei, PEC, órgão oficial) já nomeado no debate, ou é caso público com vários ângulos documentados.",
  "Dá para escrever com fontes rastreáveis (lei, Congresso, gov.br, imprensa listada). Sem fonte, não abre.",
  "Uma página por conceito ou caso durável. Slogan de um candidato não basta.",
  "Não ranqueia chapas. Não diz se a proposta é boa ou ruim. Não instaura culpa.",
  "Caso e conceito não misturam: caso é relato imersivo; conceito/plano vai para o glossário.",
] as const;

/**
 * O que a página precisa entregar.
 * Abrir e sair sem entender o essencial = página incompleta.
 */
export const NEWS_PAGE_DEPTH = [
  "O que é: definição clara, sem jargão solto.",
  "Por que aparece agora: planos TSE, Congresso, caso na imprensa, o que for o caso.",
  "O essencial destrinchado: números, regras, frentes do caso, linha do tempo ou seções que cubram o que importa. Não um teaser.",
  "Como ler com cuidado: o que a página não decide (sem veredicto, sem panfleto).",
  "Origem rastreável: a lista completa com link fica em /fontes. A página aponta para lá.",
  "Casos (/noticias): várias frentes + linha do tempo + quem aparece + o que cada lado diz, quando houver nota pública. Dá pra seguir o fio.",
  "Conceitos e planos (/glossario): o bastante para entender o trecho do plano sem sair perdido.",
] as const;

/**
 * Onde puxamos fotos (capas, retratos, ambientação).
 * Preferir banco público com licença clara; converter para P&B no Lupa.
 * Sempre creditá-las em /fontes e na própria página.
 */
export const IMAGE_SOURCE_BANKS = [
  {
    id: "wikimedia",
    label: "Wikimedia Commons",
    url: "https://commons.wikimedia.org",
    note: "Arquivos com licença CC ou domínio público. Conferir ficha do arquivo antes de usar.",
  },
  {
    id: "agencia-senado",
    label: "Agência Senado · Flickr / banco de fotos",
    url: "https://www.flickr.com/photos/agenciasenado/",
    note: "Cobertura legislativa em alta resolução. Crédito no formato Nome/Agência Senado.",
  },
  {
    id: "agencia-camara",
    label: "Agência Câmara · banco de imagens",
    url: "https://www.camara.leg.br/banco-de-imagens/",
    note: "Fotos oficiais de deputados e sessões. Uso com crédito da Casa.",
  },
  {
    id: "agencia-brasil",
    label: "Agência Brasil (EBC)",
    url: "https://agenciabrasil.ebc.com.br",
    note: "Fotos jornalísticas do governo federal; muitas espelhadas no Commons.",
  },
  {
    id: "planalto",
    label: "Presidência / Planalto",
    url: "https://www.gov.br/planalto",
    note: "Fotos oficiais de atos e viagens (ex.: Marcos Corrêa / PR).",
  },
  {
    id: "flickr-commons",
    label: "Flickr Commons",
    url: "https://www.flickr.com/commons",
    note: "Acervos históricos (ex.: Senado The Commons). Conferir restrições de cada foto.",
  },
  {
    id: "stf",
    label: "STF · galeria institucional",
    url: "https://portal.stf.jus.br",
    note: "Retratos e atos públicos do Supremo, quando publicados pela Corte.",
  },
  {
    id: "tribunais",
    label: "Tribunais e órgãos públicos",
    url: "https://www.gov.br",
    note: "TRF, TCU, PF, Coaf etc.: só material institucional público, com crédito.",
  },
] as const;

/** Critério interno para aceitar uma foto no site. */
export const IMAGE_SOURCE_RULES = [
  "Licença ou autorização rastreável (CC, domínio público, banco oficial com crédito, divulgação institucional).",
  "Preferir arquivo nativo em alta resolução. Não upscale de thumbnail.",
  "Converter para preto e branco no Lupa. Manter crédito na página e em /fontes.",
  "Retrato de pessoa: priorizar foto oficial ou Commons estável. Se a licença for contestada no Commons, marcar e buscar substituta.",
  "Galeria do perfil (mesa/caso): só fotos em que A PRÓPRIA pessoa aparece. Preferir cena com alguém do dossiê. Guardar em /public/noticias/casos/{caso}/. Sem inventar; sem retrato de terceiro como “relacionada”.",
  "Não usar print de rede social como capa sem origem clara.",
] as const;

/**
 * Créditos das fotos de candidatos (convertidas para P&B no site).
 * Preferir Wikimedia Commons / órgãos públicos quando possível.
 */
export const PHOTO_CREDITS: {
  candidateId: string;
  credit: string;
  url: string;
}[] = [
  {
    candidateId: "lula",
    credit: "Ricardo Stuckert / PR · Wikimedia Commons (foto oficial)",
    url: "https://commons.wikimedia.org/wiki/File:Foto_oficial_de_Luiz_Inácio_Lula_da_Silva_(estreita).jpg",
  },
  {
    candidateId: "flavio-bolsonaro",
    credit: "Wikimedia Commons · Foto oficial do senador Flávio Bolsonaro (Agência Senado)",
    url: "https://commons.wikimedia.org/wiki/File:Foto_oficial_do_senador_Flávio_Bolsonaro_(v._AgSen).jpg",
  },
  {
    candidateId: "ronaldo-caiado",
    credit: "Wikimedia Commons · Ronaldo Caiado (cropped)",
    url: "https://commons.wikimedia.org/wiki/File:Ronaldo_Caiado_(cropped).jpg",
  },
  {
    candidateId: "rui-costa-pimenta",
    credit: "Wikimedia Commons · Rui Costa Pimenta Close (CC BY-SA 4.0)",
    url: "https://commons.wikimedia.org/wiki/File:Rui_Costa_Pimenta_Close.jpg",
  },
  {
    candidateId: "samara-martins",
    credit: "Wikimedia Commons · Samara Martins UP",
    url: "https://commons.wikimedia.org/wiki/File:Samara_Martins_UP.jpg",
  },
  {
    candidateId: "romeu-zema",
    credit: "Wikimedia Commons · Romeu Zema 2025",
    url: "https://commons.wikimedia.org/wiki/File:Romeu_Zema_2025.jpg",
  },
  {
    candidateId: "hertz-dias",
    credit: "Wikimedia Commons · Hertz Dias PSTU",
    url: "https://commons.wikimedia.org/wiki/File:Hertz_Dias_PSTU.jpg",
  },
  {
    candidateId: "edmilson-costa",
    credit: "Folha de S.Paulo · divulgação (uso editorial no site)",
    url: "https://www1.folha.uol.com.br/poder/2026/08/critico-do-pt-candidato-do-pcb-defende-estatizar-sistema-financeiro-e-extinguir-senado.shtml",
  },
  {
    candidateId: "renan-santos",
    credit: "Divulgação / campanha · uso editorial no site",
    url: "https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/eleicoes-2026-tem-12-candidaturas-na-disputa-pela-presidencia-da-republica",
  },
  {
    candidateId: "wilson-grassi",
    credit: "CNN Brasil · material de assessoria/campanha (uso editorial no site)",
    url: "https://www.cnnbrasil.com.br/eleicoes/grassi-e-o-candidato-que-mais-investiu-o-proprio-dinheiro-com-a-campanha/",
  },
  {
    candidateId: "clariana-barao",
    credit: "Divulgação / campanha · uso editorial no site",
    url: "https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/eleicoes-2026-tem-12-candidaturas-na-disputa-pela-presidencia-da-republica",
  },
  {
    candidateId: "augusto-cury",
    credit: "Wikimedia Commons · Augusto Cury, escritor / Lima Andruška (CC BY-SA 2.0)",
    url: "https://commons.wikimedia.org/wiki/File:Augusto_Cury,_escritor_(28339139296)_(cropped).jpg",
  },
];

/**
 * Créditos de capas e ambientação editorial (casos, glossário, home).
 */
export const EDITORIAL_IMAGE_CREDITS: {
  id: string;
  path: string;
  credit: string;
  url: string;
}[] = [
  {
    id: "congresso-fachada",
    path: "/noticias/congresso.jpg",
    credit:
      "Mario Roberto Duran Ortiz / Wikimedia Commons (CC BY-SA 4.0) · P&B no Lupa",
    url: "https://commons.wikimedia.org/wiki/File:Fachada_do_Congresso_Nacional_(48079560916).jpg",
  },
  {
    id: "congresso-senado",
    path: "/noticias/congresso-senado.jpg",
    credit: "Pillar Pedreira / Agência Senado · Wikimedia Commons (CC BY 2.0) · P&B no Lupa",
    url: "https://commons.wikimedia.org/wiki/File:Fotos_produzidas_pelo_Senado_(30554309793).jpg",
  },
  {
    id: "daniel-vorcaro",
    path: "/noticias/pessoas/daniel-vorcaro.jpg",
    credit:
      "Márcio Gustavo Vasconcelos / Flickr · Wikimedia Commons · P&B no Lupa",
    url: "https://commons.wikimedia.org/wiki/File:Daniel_Vorcaro_-_2024.jpg",
  },
  {
    id: "banco-master",
    path: "/noticias/pessoas/banco-master.jpg",
    credit: "Lobby Banco Master · material institucional · P&B no Lupa",
    url: "/noticias/caso-vorcaro-master-turma-kn",
  },
  {
    id: "banco-master-sede",
    path: "/noticias/casos/vorcaro/banco-master-sede.jpg",
    credit: "Lobby Banco Master · material institucional · P&B no Lupa",
    url: "/noticias/caso-vorcaro-master-turma-kn",
  },
  {
    id: "banco-master-cpmi",
    path: "/noticias/casos/vorcaro/banco-master-cpmi.jpg",
    credit:
      "Jefferson Rudy / Agência Senado · Wikimedia Commons (CC BY-SA 4.0) · P&B no Lupa",
    url: "https://commons.wikimedia.org/wiki/File:Abertura_da_CPMI_do_Banco_Master_-_55076882744.jpg",
  },
  {
    id: "daniel-vorcaro-prisao",
    path: "/noticias/pessoas/daniel-vorcaro-prisao.jpg",
    credit:
      "Registro policial de Daniel Vorcaro após a prisão (nov/2025) · circulação pública · P&B no Lupa",
    url: "/noticias/caso-vorcaro-master-turma-kn",
  },
  {
    id: "vorcaro-hangar-pf",
    path: "/noticias/casos/vorcaro/vorcaro-hangar-pf.jpg",
    credit: "Rafa Neddermeyer / Agência Brasil · P&B no Lupa",
    url: "https://agenciabrasil.ebc.com.br/foto/2026-03/daniel-vorcaro-chegando-em-brasilia-1772825389-3",
  },
  {
    id: "nicolas-ferreira",
    path: "/noticias/pessoas/nicolas-ferreira.jpg",
    credit:
      "Wikimedia Commons · Nikolas Ferreira, vereador (cropped) · P&B no Lupa",
    url: "https://commons.wikimedia.org/wiki/File:Nikolas_Ferreira,_vereador_(cropped).jpg",
  },
  {
    id: "cezinha-de-madureira",
    path: "/noticias/pessoas/cezinha-de-madureira.jpg",
    credit: "Agência PH7 · Wikimedia Commons · P&B no Lupa",
    url: "https://commons.wikimedia.org/wiki/File:Cezinha.deputado.fed.sp.jpg",
  },
];
