import Image from "next/image";
import Link from "next/link";
import type { Candidate } from "@/data/candidates";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <Link
      href={`/candidatos/${candidate.slug}`}
      className="group lupa-soft flex flex-col overflow-hidden border-2 border-black bg-white transition duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b-2 border-black bg-[#ddd]">
        {candidate.photo ? (
          <Image
            src={candidate.photo}
            alt={candidate.name}
            fill
            quality={90}
            className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-black font-[family-name:var(--font-display)] text-5xl text-white">
            {candidate.party.slice(0, 3)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#666] group-hover:text-white/80">
          {candidate.party}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-[1.02] uppercase tracking-tight sm:text-[1.75rem]">
          {candidate.name}
        </h3>
        {candidate.vice ? (
          <p className="mt-3 text-sm font-medium text-[#444] group-hover:text-white/85">
            Vice: {candidate.vice}
            {candidate.viceParty ? ` (${candidate.viceParty})` : ""}
          </p>
        ) : null}
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] underline underline-offset-2">
          Ver plano →
        </p>
      </div>
    </Link>
  );
}
