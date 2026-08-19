"use client";

import { useEffect, useState } from "react";

type EmblemaConduta = {
  id: string;
  nome: string;
  descricao: string;
  icon: string;
};

type Props = {
  tutorandoId: number;
};

const emblemasConduta: EmblemaConduta[] = [
  {
    id: "guardiao",
    nome: "Guardião da Jornada",
    descricao:
      "Demonstra responsabilidade, respeito e compromisso durante sua trajetória.",
    icon: "🛡️",
  },
  {
    id: "companheiro",
    nome: "Companheiro de Expedição",
    descricao:
      "Mantém uma postura colaborativa e contribui positivamente com os colegas.",
    icon: "🤝",
  },
  {
    id: "disciplinado",
    nome: "Aventureiro Disciplinado",
    descricao:
      "Demonstra organização, responsabilidade e comprometimento com as atividades.",
    icon: "⚔️",
  },
  {
    id: "lideranca",
    nome: "Líder da Expedição",
    descricao:
      "Apresenta iniciativa, liderança e influência positiva sobre o grupo.",
    icon: "👑",
  },
  {
    id: "respeito",
    nome: "Cavaleiro do Respeito",
    descricao:
      "Demonstra respeito pelos colegas, professores e pelo ambiente escolar.",
    icon: "🏅",
  },
  {
    id: "observacao",
    nome: "Em Observação",
    descricao:
      "Necessita melhorar aspectos relacionados à convivência e à conduta escolar.",
    icon: "⚠️",
  },
  {
    id: "atencao",
    nome: "Emblema de Atenção",
    descricao:
      "Apresenta recorrência de comportamentos que precisam de acompanhamento pedagógico.",
    icon: "🔎",
  },
  {
    id: "reconstrucao",
    nome: "Jornada de Reconstrução",
    descricao:
      "Está em processo de desenvolvimento e aprimoramento de sua conduta.",
    icon: "🔨",
  },
];

function criarChave(tutorandoId: number) {
  return `aventureiro-conduta-${tutorandoId}`;
}

export function CondutaTutorando({
  tutorandoId,
}: Props) {
  const [emblemaAtual, setEmblemaAtual] =
    useState<string | null>(null);

  const [salvando, setSalvando] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    setCarregando(true);

    try {
      const chave = criarChave(tutorandoId);
      const salvo = localStorage.getItem(chave);

      if (salvo) {
        setEmblemaAtual(salvo);
      } else {
        setEmblemaAtual(null);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar conduta:",
        error
      );

      setEmblemaAtual(null);
    }

    setCarregando(false);
  }, [tutorandoId]);

  function selecionarEmblema(id: string) {
    setSalvando(true);

    try {
      const chave = criarChave(tutorandoId);

      localStorage.setItem(chave, id);

      setEmblemaAtual(id);
    } catch (error) {
      console.error(
        "Erro ao salvar conduta:",
        error
      );
    }

    setTimeout(() => {
      setSalvando(false);
    }, 300);
  }

  function removerEmblema() {
    try {
      const chave = criarChave(tutorandoId);

      localStorage.removeItem(chave);

      setEmblemaAtual(null);
    } catch (error) {
      console.error(
        "Erro ao remover conduta:",
        error
      );
    }
  }

  const emblemaSelecionado =
    emblemasConduta.find(
      (emblema) =>
        emblema.id === emblemaAtual
    );

  if (carregando) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 text-center shadow-xl">
        <div className="text-3xl">🛡️</div>

        <p className="mt-2 text-sm font-bold text-slate-500">
          Carregando conduta...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#11150f] p-5 shadow-xl">

      {/* CABEÇALHO */}

      <div className="mb-5">

        <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
          Acompanhamento comportamental
        </div>

        <h3 className="mt-1 text-xl font-black">
          🛡️ Conduta do Tutorando
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Defina o emblema de conduta que representa
          o momento atual do tutorando.
        </p>

      </div>


      {/* EMBLEMA ATUAL */}

      {emblemaSelecionado ? (

        <div className="mb-6 rounded-2xl border border-amber-900/40 bg-amber-950/10 p-5">

          <div className="mb-3 text-[9px] font-bold uppercase tracking-[0.25em] text-amber-500">
            Emblema atual
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-5xl">
              {emblemaSelecionado.icon}
            </div>

            <div className="flex-1">

              <h4 className="text-xl font-black text-amber-400">
                {emblemaSelecionado.nome}
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {emblemaSelecionado.descricao}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={removerEmblema}
            className="mt-4 text-xs font-bold text-slate-600 transition hover:text-red-400"
          >
            Remover emblema atual
          </button>

        </div>

      ) : (

        <div className="mb-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-6 text-center">

          <div className="text-4xl">
            🛡️
          </div>

          <p className="mt-3 text-sm font-bold text-slate-400">
            Nenhum emblema de conduta definido
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Escolha abaixo o emblema que representa
            a conduta atual do tutorando.
          </p>

        </div>

      )}


      {/* LISTA DE EMBLEMAS */}

      <div>

        <div className="mb-3 flex items-center justify-between">

          <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
            Emblemas disponíveis
          </div>

          {salvando && (
            <div className="text-[9px] font-bold uppercase tracking-wider text-green-500">
              ✓ Salvo
            </div>
          )}

        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          {emblemasConduta.map(
            (emblema) => {

              const selecionado =
                emblemaAtual ===
                emblema.id;

              return (
                <button
                  key={emblema.id}
                  type="button"
                  onClick={() =>
                    selecionarEmblema(
                      emblema.id
                    )
                  }
                  className={`group rounded-xl border p-4 text-left transition-all ${
                    selecionado
                      ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-950/20"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >

                  <div className="flex items-start gap-3">

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                        selecionado
                          ? "bg-amber-500/15"
                          : "bg-slate-800/70"
                      }`}
                    >
                      {emblema.icon}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div
                        className={`text-sm font-black ${
                          selecionado
                            ? "text-amber-400"
                            : "text-white"
                        }`}
                      >
                        {emblema.nome}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {emblema.descricao}
                      </p>

                    </div>

                    {selecionado && (
                      <div className="shrink-0 text-green-400">
                        ✓
                      </div>
                    )}

                  </div>

                </button>
              );
            }
          )}

        </div>

      </div>


      {/* AVISO */}

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/30 p-4">

        <div className="flex gap-3">

          <div className="text-lg">
            👨‍🏫
          </div>

          <div>

            <div className="text-xs font-black text-slate-300">
              Controle do Professor-Tutor
            </div>

            <p className="mt-1 text-[11px] leading-5 text-slate-600">
              O emblema de conduta é definido pelo
              professor-tutor e é independente das
              conquistas do aluno.
            </p>

          </div>

        </div>

      </div>


      {/* INDICADOR */}

      <div className="mt-4 text-center">

        <span className="inline-flex items-center gap-2 rounded-full border border-green-900/30 bg-green-950/10 px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-green-500">

          <span className="h-2 w-2 rounded-full bg-green-500" />

          Conduta salva automaticamente

        </span>

      </div>

    </section>
  );
}
