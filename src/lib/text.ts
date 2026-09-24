/** Remove aspas envolventes duplicadas vindas da IA (", “ ”, ' ', « »). */
export function unwrapQuotes(text: string): string {
  let s = text.trim();
  // Repete para casos ""texto""
  for (let i = 0; i < 3; i++) {
    const next = s
      .replace(/^["“”„«]+/, "")
      .replace(/["“”„»]+$/, "")
      .replace(/^['‘’]+/, "")
      .replace(/['‘’]+$/, "")
      .trim();
    if (next === s) break;
    s = next;
  }
  return polishPdfJoin(s);
}

/**
 * PDFs às vezes colam título/frase seguinte sem ponto
 * ("…feminicídio Medida protetiva…"). Recoloca pontuação óbvia.
 */
function polishPdfJoin(text: string): string {
  // minúscula/ç + espaço + palavra que claramente inicia frase
  return text.replace(
    /([a-záàâãéêíóôõúç])\s+(Medida|Quando|Este|Esta|Isso|Os|As|Uma|Um|Não|Vamos|Criar|Reduzir|Implementar|Tolerância|Quem|Porque|Assim|Ainda|Também)\b/g,
    "$1. $2",
  );
}

export function unwrapQuoteList(quotes: string[]): string[] {
  return quotes.map(unwrapQuotes).filter(Boolean);
}
