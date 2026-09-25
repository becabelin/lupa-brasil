import { BrandButton, PageHero } from "@/components/brand-ui";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Página não encontrada"
      title={<>Não achamos esta página</>}
      lede="Esse endereço não existe ou mudou de lugar. Use a busca no topo ou volte ao início."
      actions={
        <BrandButton href="/" variant="solid">
          Voltar ao início
        </BrandButton>
      }
    />
  );
}
