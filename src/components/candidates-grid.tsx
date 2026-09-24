"use client";

import { useMemo, useState } from "react";
import type { Candidate } from "@/data/candidates";
import { CandidateCard } from "@/components/candidate-card";
import { FilterInput, FilterSelect } from "@/components/ui/fields";

type Props = {
  candidates: Candidate[];
};

function compareNames(a: Candidate, b: Candidate) {
  return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
}

export function CandidatesGrid({ candidates }: Props) {
  const parties = useMemo(
    () =>
      [...new Set(candidates.map((c) => c.party))].sort((a, b) =>
        a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
      ),
    [candidates],
  );

  const [query, setQuery] = useState("");
  const [party, setParty] = useState("todos");
  const [order, setOrder] = useState<"az" | "za">("az");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = candidates.filter((c) => {
      if (party !== "todos" && c.party !== party) return false;
      if (!q) return true;
      const hay = [c.name, c.party, c.partyFull, c.vice, c.viceParty]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    list.sort(compareNames);
    if (order === "za") list.reverse();
    return list;
  }, [candidates, query, party, order]);

  return (
    <div>
      <div className="mb-8 grid gap-3 border-2 border-black bg-[#f5f5f5] p-4 sm:grid-cols-[1.4fr_1fr_1fr]">
        <FilterInput
          label="Pesquisar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome, partido, vice…"
        />
        <FilterSelect
          label="Partido"
          value={party}
          onChange={(e) => setParty(e.target.value)}
          options={[
            { value: "todos", label: "Todos" },
            ...parties.map((p) => ({ value: p, label: p })),
          ]}
        />
        <FilterSelect
          label="Ordem"
          value={order}
          onChange={(e) => setOrder(e.target.value as "az" | "za")}
          options={[
            { value: "az", label: "A → Z" },
            { value: "za", label: "Z → A" },
          ]}
        />
      </div>

      <p className="mb-4 text-sm font-bold uppercase tracking-widest text-[#555]">
        {filtered.length} de {candidates.length} chapas
      </p>

      {filtered.length === 0 ? (
        <p className="border-2 border-dashed border-black p-10 text-center text-lg font-bold uppercase">
          Nenhum candidato encontrado
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </div>
      )}
    </div>
  );
}
