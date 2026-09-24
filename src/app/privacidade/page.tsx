import { PageHero } from "@/components/brand-ui";
import { VOICE } from "@/data/voice";

export const metadata = {
  title: "Privacidade",
  description:
    "O que o Lupa do Brasil guarda no seu aparelho: leitura, tema e aviso de cookies. Sem rastrear IP.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  const V = VOICE.privacidade;

  return (
    <div>
      <PageHero
        eyebrow={V.eyebrow}
        title="Privacidade"
        lede={V.lede}
        marquee={[
          "No seu aparelho",
          "Sem IP pra lembrar",
          "Sem anúncio",
          "Aa no rodapé",
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {V.sections.map((s) => (
            <section
              key={s.title}
              className="lupa-soft border-2 border-black p-6 sm:p-7"
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase leading-none tracking-tight">
                {s.title}
              </h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-[#333]">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
