/**
 * Voz do Lupa do Brasil (só comunicação do site com o usuário).
 * Não muda o conteúdo factual de planos, casos ou fontes.
 *
 * Tom: direto, brasileiro, sem jargão de produto.
 * Mostra o país como ele é. Sem partido. Sem melodrama.
 * Frases curtas. Preferir concreto a abstrato.
 * Evitar: "linguagem clara", "sem favoritos", "dossiê factual",
 * "extrato factual", "imparcial" em loop, travessão.
 */

export const VOICE = {
  tagline: "O Brasil de perto",
  disclaimer: "Informação · Não é propaganda eleitoral",

  home: {
    eyebrow: "O Brasil de perto",
    spotlight: "Agora · Eleições 2026",
    lede: "O que está acontecendo no país, sem maquiagem e sem partido. A gente aproxima os fatos. Você decide o que fazer com eles.",
    ctaEleicoes: "Ver a disputa",
    ctaNoticias: "Ler os casos",
    ctaComparar: "Comparar planos",
  },

  marquee: [
    "O Brasil de perto",
    "Sem maquiagem",
    "Sem partido",
    "Fonte na mão",
  ],

  footer: {
    blurb:
      "O Lupa mostra o Brasil como ele é: o que está acontecendo, o que está no papel e de onde veio cada informação. Você decide.",
    sources:
      "Origem listada em Fontes. TSE, documentos e reportagens quando cabem. O texto conta o fato.",
  },

  cookies: {
    eyebrow: "Privacidade",
    body: "Só o essencial no seu aparelho: leitura, tema e este aviso.",
    link: "Detalhes",
    cta: "Entendi",
  },

  privacidade: {
    eyebrow: "O que fica no seu aparelho",
    lede: "Preferências de leitura e o aviso de cookies. Sem anúncio. Sem venda de dado. Sem guardar IP pra lembrar quem você é.",
    sections: [
      {
        title: "O que salvamos",
        body: "No seu navegador (cookie e armazenamento local): tom de leitura (mais simples ou mais completo), tema claro/escuro, tamanho do texto, contraste e se você já viu o aviso de cookies. Serve pra não perguntar de novo no mesmo aparelho.",
      },
      {
        title: "O que não fazemos",
        body: "Não usamos IP pra identificar visita. Não vendemos lista. Não temos banner de anúncio de terceiros. Preferências ficam no aparelho; se você limpar os cookies do site, o Lupa pergunta de novo.",
      },
      {
        title: "Como mudar",
        body: "Leitura, tema, texto e contraste: botão Aa no rodapé. Detalhes desta página: link Privacidade no rodapé.",
      },
    ],
  },

  eleicoes: {
    eyebrow: "Presidência · TSE",
    lede: "Doze chapas na urna. Os planos oficiais, lado a lado. Você lê o que está escrito, não o que a campanha quer que você sinta.",
    marquee: [
      "Chapas deferidas",
      "Planos do TSE",
      "Mesma lente pra todo mundo",
      "Você lê o PDF",
    ],
  },

  comparar: {
    eyebrow: "Eleições 2026 · Dois a dois",
    lede: "Escolha duas chapas e busque a pauta. Em destaque ou outras. O que cada plano diz (ou não diz) fica na sua frente.",
  },

  buscar: {
    eyebrow: "Eleições 2026 · Por tema",
    lede: "Economia, saúde, segurança, clima. Veja o que cada chapa colocou no documento oficial.",
  },

  pesquisa: {
    eyebrow: "No site inteiro",
    lede: "Digite um nome ou conceito, ou faça uma pergunta. A resposta sai do que está no Lupa: planos, casos e glossário.",
    marquee: ["Pergunte", "Planos TSE", "Casos", "Glossário"],
    askCta: "Perguntar",
    askLoading: "Montando a resposta…",
    askHint:
      "A IA só usa o que já está no site. Se o plano não fala do tema, a gente diz isso.",
    askSources: "De onde veio",
  },

  noticias: {
    eyebrow: "Grandes casos",
    lede: "Não é blog do dia. São dossiês pra seguir o fio: o que aconteceu, quem aparece, o essencial destruído.",
    marquee: [
      "Entre no caso",
      "Seguir a linha",
      "Termo no hover",
      "Sem veredicto nosso",
    ],
  },

  mesa: {
    cta: "Abrir mesa de investigação",
    ctaBack: "Voltar ao dossiê",
    disclaimer:
      "Síntese do que está documentado. Não é o arquivo da PF. Não é veredicto.",
    how: "Comece pelo menu. Escolha uma aba. Depois troque pela barra embaixo.",
    stepPick: "1 · Explore a tela",
    stepRead: "2 · Abra alguém ou algo",
    stepLinks: "3 · Siga as ligações",
    lookingAt: "Olhando agora",
    clearFocus: "Fechar",
    closePerson: "Voltar à galeria",
    personLinks: "No mapa desta pessoa",
    personWhy: "Ligação com o caso",
    personFacts: "Informações",
    personWho: "Quem é",
    personVersion: "Versão",
    personGallery: "Onde aparece",
    personGalleryHint: "Fotos desta pessoa no caso. Só entra se ela estiver no quadro.",
    personThread: "No fio desta pessoa",
    personThreadHint: "Só datas em que ela entra de fato. Sem evento de terceiro.",
    linksTitle: "Ligado a isto",
    linksEmpty:
      "Clique em alguém ou algo na tela. Aqui aparece o que se conecta.",
    listHint: "Toque para abrir",
    startTitle: "Por onde começar",
    startBody:
      "Cada aba é uma tela cheia. Quem abre a galeria de pessoas. As outras abrem a lista daquele tipo.",
    startPeople: "Começar por quem aparece",
    startChat: "Ver uma mensagem",
    startTime: "Ver a linha do tempo",
    hubEyebrow: "Mesa · escolha uma aba",
    hubTitle: "Por onde entrar",
    hubBody:
      "Seis portas pro mesmo caso. Clique numa. Embaixo fica a barra pra trocar quando quiser.",
    hubOpen: "Menu",
    hubNow: "Você está em",
    hubSwitch: "Trocar de aba",
    crossHow:
      "Escolha duas pessoas (ou uma pessoa e um lugar). A mesa mostra o que os dois têm em comum.",
    tabTempo: "Datas",
    tabPessoas: "Quem",
    tabLugares: "Onde",
    tabChats: "Msgs",
    tabProvas: "Provas",
    tabCruzar: "A × B",
    tutEyebrow: "Tutorial da mesa",
    tutHelp: "Como usar",
    tutSkip: "Pular",
    tutBack: "Voltar",
    tutNext: "Próximo",
    tutDone: "Entendi · ver menu",
    tutWelcomeTitle: "O que é esta mesa",
    tutWelcomeBody:
      "É um mapa do caso em tela cheia: pessoas, datas, lugares, mensagens e provas. Você explora, clica e segue as ligações. Sem veredicto nosso.",
    tutTabsTitle: "Menu na entrada",
    tutTabsBody:
      "Na abertura você vê só as abas. Escolhe uma porta. Depois a barra embaixo troca Datas, Quem, Onde, Msgs, Provas e A×B.",
    tutListTitle: "Explore a tela",
    tutListBody:
      "Arraste a galeria, role a linha do tempo ou escolha na lista. Toque pra focar.",
    tutDetailTitle: "Painel: leia",
    tutDetailBody:
      "Ao clicar, abre o detalhe: quem é, o que aconteceu, o chat, a prova. Um item por vez.",
    tutLinksTitle: "No painel: siga o fio",
    tutLinksBody:
      "Debaixo do detalhe estão as ligações. Clique de novo e salte. É assim que se monta o mapa.",
  },

  glossario: {
    eyebrow: "Conceitos · Planos · Políticas",
    lede: "O que é cada termo. Curto o bastante pra consultar, completo o bastante pra não ficar no escuro.",
    marquee: [
      "Ordem A a Z",
      "Fonte na mão",
      "Pra ler o plano",
      "Sem jargão solto",
    ],
  },

    fontes: {
    eyebrow: "De onde vem cada coisa",
    lede: "Lista completa aqui. TSE primeiro. Links originais. Fotos com banco e crédito. Nas outras páginas, o fato no texto e o atalho pra cá.",
  },

  leitura: {
    eyebrow: "Antes de começar",
    title: "Como você prefere ler?",
    lede: "Escolhe o tom. Tema e texto dá pra ajustar aqui ou depois no Aa.",
    simplesTag: "Se parece difícil",
    simplesTitle: "Mais simples",
    simplesBlurb: "Frases curtas. Menos jargão.",
    completoTag: "Se já acompanha",
    completoTitle: "Mais completo",
    completoBlurb: "Mais detalhe e nomes técnicos.",
    a11yTitle: "Acessibilidade",
    a11yLede: "Tema, tamanho do texto e contraste. Vale pra o site inteiro.",
    cta: "Entrar no Lupa",
    footnote: "Dá pra mudar depois no Aa do rodapé.",
  },

  homeSections: {
    eleicoesEyebrow: "O que está em jogo agora",
    eleicoesTitle: "Eleições 2026",
    eleicoesBlurb:
      "As chapas, os PDFs do TSE e a comparação por área.",
    eleicoesCandidatos: "As 12 chapas deferidas pelo TSE.",
    eleicoesComparar: "Dois planos lado a lado, na mesma pauta.",
    eleicoesAreas: "Saúde, segurança, educação e o resto do PDF.",
    noticiasEyebrow: "Fora da urna também",
    noticiasTitle: "Casos",
  },
} as const;
