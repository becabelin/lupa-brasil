import Link from "next/link";
import { BrandButton, PageHero } from "@/components/brand-ui";
import { VOICE } from "@/data/voice";

export default function NotFound() {
  return (
    <div>
      <PageHero
        eyebrow="Página não encontrada"
        title={<>404</>}
        lede="Esse endereço não existe ou mudou de lugar. Volte pelo menu ou pelos atalhos abaixo."
        meta={[
          { k: "404", v: "Não achamos" },
        ]}
      />
      <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 py-10 sm:px-6">
        <BrandButton href="/" variant="solid">
          Início
        </BrandButton>
        <BrandButton href="/eleicoes" variant="outline">
          Eleições 2026
        </BrandButton>
        <BrandButton href="/noticias" variant="outline">
          Casos
        </BrandButton>
        <BrandButton href="/glossario" variant="outline">
          Glossário
        </BrandButton>
        <Link
          href="/fontes"
          className="lupa-nav-link inline-flex items-center text-sm tracking-wider"
        >
          Fontes
        </Link>
      </div>
    </div>
  );
}
