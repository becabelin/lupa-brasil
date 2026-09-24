"use client";

import { useState } from "react";
import type { Candidate } from "@/data/candidates";
import { FilterInput } from "@/components/ui/fields";

type Row = {
  candidate: Candidate;
  hasDocument: boolean;
  hasAnalysis: boolean;
  fileName?: string;
  analyzedAt?: string;
};

export function AdminPanel({
  rows,
  initiallyAuthed = false,
}: {
  rows: Row[];
  initiallyAuthed?: boolean;
}) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(initiallyAuthed);
  const [message, setMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [localRows, setLocalRows] = useState(rows);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setMessage("Senha incorreta.");
      return;
    }
    setAuthed(true);
    setMessage("Login ok.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  async function upload(candidateId: string, file: File) {
    setBusyId(candidateId);
    setMessage(null);
    const form = new FormData();
    form.set("candidateId", candidateId);
    form.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setMessage(data.error || "Falha no upload.");
      return;
    }
    setLocalRows((prev) =>
      prev.map((r) =>
        r.candidate.id === candidateId
          ? { ...r, hasDocument: true, fileName: file.name }
          : r,
      ),
    );
    setMessage(`Upload ok (${data.textLength} caracteres extraídos).`);
  }

  async function analyze(candidateId: string) {
    setBusyId(candidateId);
    setMessage(null);
    const res = await fetch("/api/admin/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId }),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setMessage(data.error || "Falha na análise.");
      return;
    }
    setLocalRows((prev) =>
      prev.map((r) =>
        r.candidate.id === candidateId
          ? {
              ...r,
              hasAnalysis: true,
              analyzedAt: data.analysis?.analyzedAt,
            }
          : r,
      ),
    );
    setMessage("Análise concluída.");
  }

  if (!authed) {
    return (
      <form
        onSubmit={login}
        className="mx-auto mt-8 max-w-md border-2 border-black bg-white p-6"
      >
        <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-tight">
          Entrar no admin
        </h2>
        <p className="mt-2 text-sm font-medium text-[#555]">
          Só quem tem a senha pode enviar planos e disparar a análise.
        </p>
        <div className="mt-4">
          <FilterInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full border-2 border-black bg-black px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
        >
          Entrar
        </button>
        {message ? (
          <p className="mt-3 text-sm font-medium text-[#555]">{message}</p>
        ) : null}
      </form>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#555]">
          Envie PDF/TXT e depois clique em Analisar.
        </p>
        <button
          type="button"
          onClick={logout}
          className="text-sm font-bold uppercase tracking-wide underline"
        >
          Sair
        </button>
      </div>
      {message ? (
        <p className="border-2 border-black bg-[#f5f5f5] px-3 py-2 text-sm font-medium">
          {message}
        </p>
      ) : null}
      <div className="space-y-3">
        {localRows.map((row) => (
          <div
            key={row.candidate.id}
            className="border-2 border-black bg-white p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight">
                  {row.candidate.name}{" "}
                  <span className="text-sm tracking-normal">
                    ({row.candidate.party})
                  </span>
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#555]">
                  {row.hasDocument
                    ? `Documento: ${row.fileName || "enviado"}`
                    : "Sem documento"}
                  {row.hasAnalysis
                    ? ` · Análise: ${row.analyzedAt ? new Date(row.analyzedAt).toLocaleString("pt-BR") : "ok"}`
                    : " · Sem análise"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer border-2 border-black px-3 py-1.5 text-sm font-bold uppercase tracking-wide transition hover:bg-black hover:text-white">
                  Upload
                  <input
                    type="file"
                    accept=".pdf,.txt,application/pdf,text/plain"
                    className="hidden"
                    disabled={busyId === row.candidate.id}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void upload(row.candidate.id, f);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={!row.hasDocument || busyId === row.candidate.id}
                  onClick={() => void analyze(row.candidate.id)}
                  className="border-2 border-black bg-black px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-40 hover:bg-white hover:text-black"
                >
                  {busyId === row.candidate.id ? "Processando…" : "Analisar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
