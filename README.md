# Lupa do Brasil

Site para visualizar candidatos à Presidência e comparar análises dos planos de governo, geradas por IA.

## O que tem

- Lista de candidatos 2026
- Página de cada candidato com análise por área
- Comparativo lado a lado
- Busca por tema / palavra-chave
- Painel admin (só quem tem senha sobe PDF e dispara análise)

## Como rodar

```bash
cd planos-governo-2026
cp .env.example .env.local
# edite .env.local: ADMIN_PASSWORD e OPENAI_API_KEY
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Fluxo

1. Entre no admin com a senha
2. Faça upload do plano (PDF ou TXT) de um candidato
3. Clique em **Analisar**
4. A análise aparece no site público

## Observações

- PDFs escaneados (só imagem) não têm texto extraível — use PDF com texto ou TXT.
- Análises e uploads ficam em `data/` localmente.
