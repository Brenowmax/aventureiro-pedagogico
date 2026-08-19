"use client";

import { useEffect, useState } from "react";

export type PerfilUsuario = "aluno" | "professor";

type Props = {
onChange?: (perfil: PerfilUsuario) => void;
};

const STORAGE_PERFIL = "aventureiro-perfil";

export function PerfilSelector({ onChange }: Props) {
const [perfil, setPerfil] = useState<PerfilUsuario>("aluno");

useEffect(() => {
const perfilSalvo = localStorage.getItem(STORAGE_PERFIL);

if (perfilSalvo === "aluno" || perfilSalvo === "professor") {
  setPerfil(perfilSalvo);
  onChange?.(perfilSalvo);
}

}, [onChange]);

function alterarPerfil(novoPerfil: PerfilUsuario) {
setPerfil(novoPerfil);
localStorage.setItem(STORAGE_PERFIL, novoPerfil);
onChange?.(novoPerfil);
}

return ( <section className="rounded-2xl border border-slate-800 bg-[#11150f] p-5 shadow-xl"> <div className="mb-4"> <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
Perfil de acesso </div>

    <h2 className="mt-1 text-xl font-black">
      Quem está entrando no Reino?
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Selecione o perfil que será utilizado nesta sessão.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {/* ALUNO */}
    <button
      type="button"
      onClick={() => alterarPerfil("aluno")}
      className={`rounded-2xl border p-5 text-left transition-all ${
        perfil === "aluno"
          ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-950/20"
          : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-3xl ${
            perfil === "aluno"
              ? "bg-amber-500/15"
              : "bg-slate-800"
          }`}
        >
          🧭
        </div>

        <div>
          <div
            className={`font-black ${
              perfil === "aluno"
                ? "text-amber-400"
                : "text-white"
            }`}
          >
            Aventureiro
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Perfil do aluno
          </div>
        </div>
      </div>

      {perfil === "aluno" && (
        <div className="mt-4 text-[9px] font-bold uppercase tracking-wider text-green-500">
          ✓ Perfil selecionado
        </div>
      )}
    </button>

    {/* PROFESSOR */}
    <button
      type="button"
      onClick={() => alterarPerfil("professor")}
      className={`rounded-2xl border p-5 text-left transition-all ${
        perfil === "professor"
          ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-950/20"
          : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-3xl ${
            perfil === "professor"
              ? "bg-amber-500/15"
              : "bg-slate-800"
          }`}
        >
          🧑‍🏫
        </div>

        <div>
          <div
            className={`font-black ${
              perfil === "professor"
                ? "text-amber-400"
                : "text-white"
            }`}
          >
            Professor-Tutor
          </div>

          <div className="mt-1 text-xs text-slate-500">
            Área de acompanhamento
          </div>
        </div>
      </div>

      {perfil === "professor" && (
        <div className="mt-4 text-[9px] font-bold uppercase tracking-wider text-green-500">
          ✓ Perfil selecionado
        </div>
      )}
    </button>
  </div>

  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/30 p-3 text-center">
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
      Perfil atual:{" "}
    </span>

    <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
      {perfil === "aluno" ? "Aventureiro" : "Professor-Tutor"}
    </span>
  </div>
</section>

);
}
