"use client";

import React, { useState } from "react";

export type TipoValidacao = "missao" | "evento";

export interface SolicitacaoValidacao {
  id: string;

  tipo: TipoValidacao;

  alunoId: string;
  alunoNome: string;
  alunoAvatar?: string;
  alunoTurma?: string;

  titulo: string;
  categoria: string;
  descricao?: string;

  xpReward: number;
  coinReward: number;
  badgeReward?: string;

  dataEnvio: string;
  comentarioAluno?: string;
}

interface MuralProps {
  solicitacoes: SolicitacaoValidacao[];

  onAprovar: (
    solicitacao: SolicitacaoValidacao
  ) => void;

  onRecusar: (
    solicitacao: SolicitacaoValidacao,
    motivo?: string
  ) => void;
}

type FiltroMural = "todos" | TipoValidacao;

export const MuralValidacaoProfessor: React.FC<
  MuralProps
> = ({
  solicitacoes,
  onAprovar,
  onRecusar,
}) => {
  const [filtro, setFiltro] =
    useState<FiltroMural>("todos");

  const [itemEmRecusa, setItemEmRecusa] =
    useState<string | null>(null);

  const [motivosRecusa, setMotivosRecusa] =
    useState<Record<string, string>>({});

  const solicitacoesFiltradas =
    solicitacoes.filter((item) => {
      if (filtro === "todos") {
        return true;
      }

      return item.tipo === filtro;
    });

  const totalMissoes = solicitacoes.filter(
    (item) => item.tipo === "missao"
  ).length;

  const totalEventos = solicitacoes.filter(
    (item) => item.tipo === "evento"
  ).length;

  function iniciarRecusa(id: string) {
    setItemEmRecusa(id);
  }

  function cancelarRecusa() {
    setItemEmRecusa(null);
  }

  function atualizarMotivo(
    id: string,
    valor: string
  ) {
    setMotivosRecusa((atual) => ({
      ...atual,
      [id]: valor,
    }));
  }

  function confirmarRecusa(
    item: SolicitacaoValidacao
  ) {
    const motivo =
      motivosRecusa[item.id]?.trim();

    onRecusar(
      item,
      motivo || undefined
    );

    setItemEmRecusa(null);

    setMotivosRecusa((atual) => {
      const novo = { ...atual };

      delete novo[item.id];

      return novo;
    });
  }

  return (
    <section className="my-6 rounded-2xl border border-slate-800 bg-[#11150f] p-4 shadow-xl sm:p-6">
      {/* CABEÇALHO */}
      <div className="mb-5 flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">
            Área exclusiva do professor
          </div>

          <h2 className="mt-1 flex items-center gap-2 text-xl font-black text-white">
            <span>🛡️</span>
            Mural de Validação
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Valide as conclusões de missões e
            eventos antes de liberar as recompensas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
          <span className="text-xs">
            ⚔️
          </span>

          <span className="text-xs font-black text-amber-400">
            {solicitacoes.length} pendente
            {solicitacoes.length === 1
              ? ""
              : "s"}
          </span>
        </div>
      </div>

      {/* FILTROS */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setFiltro("todos")
          }
          className={`rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition ${
            filtro === "todos"
              ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
              : "border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700 hover:text-slate-300"
          }`}
        >
          Todos ({solicitacoes.length})
        </button>

        <button
          type="button"
          onClick={() =>
            setFiltro("missao")
          }
          className={`rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition ${
            filtro === "missao"
              ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
              : "border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700 hover:text-slate-300"
          }`}
        >
          📜 Missões ({totalMissoes})
        </button>

        <button
          type="button"
          onClick={() =>
            setFiltro("evento")
          }
          className={`rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition ${
            filtro === "evento"
              ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
              : "border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700 hover:text-slate-300"
          }`}
        >
          🐉 Eventos ({totalEventos})
        </button>
      </div>

      {/* LISTAGEM */}
      {solicitacoesFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 py-10 text-center">
          <div className="text-3xl opacity-50">
            🛡️
          </div>

          <p className="mt-3 text-sm font-bold text-slate-400">
            Nenhuma validação pendente.
          </p>

          <p className="mt-1 text-[10px] text-slate-600">
            Quando um aluno concluir uma missão
            ou evento, a solicitação aparecerá
            aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {solicitacoesFiltradas.map(
            (item) => {
              const recusando =
                itemEmRecusa === item.id;

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition hover:border-slate-700"
                >
                  {/* TIPO */}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-md border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                        item.tipo === "evento"
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                          : "border-blue-500/30 bg-blue-500/10 text-blue-300"
                      }`}
                    >
                      {item.tipo === "evento"
                        ? "🐉 Evento"
                        : "📜 Missão"}
                    </span>

                    <span className="text-[9px] font-bold text-slate-600">
                      {item.dataEnvio}
                    </span>
                  </div>

                  {/* ALUNO */}
                  <div className="mb-4 flex items-center gap-3 border-b border-slate-900 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xl">
                      {item.alunoAvatar ||
                        "🧙‍♂️"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-white">
                        {item.alunoNome}
                      </h3>

                      <div className="mt-0.5 flex flex-wrap gap-x-2 text-[10px] font-bold text-slate-500">
                        {item.alunoTurma && (
                          <span>
                            🎓{" "}
                            {item.alunoTurma}
                          </span>
                        )}

                        {item.alunoTurma && (
                          <span>•</span>
                        )}

                        <span>
                          {item.categoria}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ATIVIDADE */}
                  <div className="mb-4">
                    <h4 className="text-base font-black leading-tight text-slate-100">
                      {item.titulo}
                    </h4>

                    {item.descricao && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">
                        {item.descricao}
                      </p>
                    )}

                    {item.comentarioAluno && (
                      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                        <div className="mb-1 text-[9px] font-black uppercase tracking-wider text-slate-600">
                          Registro do aluno
                        </div>

                        <p className="text-xs italic leading-relaxed text-slate-400">
                          "{item.comentarioAluno}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RECOMPENSA */}
                  <div className="mb-4 rounded-xl border border-amber-500/10 bg-amber-500/5 p-3">
                    <div className="mb-2 text-[9px] font-black uppercase tracking-wider text-slate-600">
                      Recompensa
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-black">
                      <span className="text-amber-400">
                        ✨ +{item.xpReward} XP
                      </span>

                      <span className="text-yellow-300">
                        🪙 +{item.coinReward}
                      </span>

                      {item.badgeReward && (
                        <span className="text-purple-300">
                          🏅{" "}
                          {item.badgeReward}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AÇÕES DO PROFESSOR */}
                  {recusando ? (
                    <div className="space-y-2 border-t border-slate-900 pt-3">
                      <input
                        type="text"
                        value={
                          motivosRecusa[
                            item.id
                          ] || ""
                        }
                        onChange={(e) =>
                          atualizarMotivo(
                            item.id,
                            e.target.value
                          )
                        }
                        placeholder="Motivo da recusa (opcional)..."
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none transition focus:border-rose-500"
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={
                            cancelarRecusa
                          }
                          className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-[10px] font-black text-slate-400 transition hover:border-slate-700 hover:text-white"
                        >
                          CANCELAR
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            confirmarRecusa(
                              item
                            )
                          }
                          className="flex-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[10px] font-black text-rose-400 transition hover:bg-rose-500/20"
                        >
                          CONFIRMAR RECUSA
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          iniciarRecusa(
                            item.id
                          )
                        }
                        title="Recusar validação"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-sm text-rose-400 transition hover:border-rose-500/50 hover:bg-rose-500/10"
                      >
                        ✕
                      </button>

                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                        Ação do professor
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onAprovar(item)
                        }
                        title="Validar e liberar recompensa"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-sm font-black text-emerald-400 transition hover:border-emerald-500/60 hover:bg-emerald-500/20"
                      >
                        ✓
                      </button>
                    </div>
                  )}
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
};

export default MuralValidacaoProfessor;