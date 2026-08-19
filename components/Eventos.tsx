"use client";

import React from "react";

export type StatusAtividade =
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "ENCERRADO";

export interface EventoProps {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;

  // Status da participação deste aluno no evento.
  status: StatusAtividade;

  // Indica que o aluno informou que cumpriu os requisitos
  // e enviou a atividade para o professor validar.
  enviadoParaValidacao?: boolean;

  recompensaXp?: number;
  recompensaMoedas?: number;
  emblema?: string;
}

interface CardEventoAlunoProps {
  evento: EventoProps;

  // O aluno não valida a atividade.
  // Esta função apenas envia a conclusão para análise do professor.
  onEnviarConclusao?: (evento: EventoProps) => void;
}

export const CardEventoAluno: React.FC<CardEventoAlunoProps> = ({
  evento,
  onEnviarConclusao,
}) => {
  const agora = new Date();
  const inicio = new Date(evento.dataInicio);
  const fim = new Date(evento.dataFim);

  /*
   * A regra oficial do projeto possui somente 3 status:
   *
   * 🟡 Em Andamento
   * 🟢 Concluído
   * 🔴 Encerrado
   *
   * O estado "aguardando validação" não aparece como status
   * para o aluno. Internamente usamos enviadoParaValidacao.
   */

  let status: StatusAtividade = evento.status;

  /*
   * Se o evento ainda não começou, ele continua sendo tratado
   * como Em Andamento na interface do aluno.
   *
   * Dessa maneira não criamos um quarto status como "Aguardando".
   */
  if (status === "EM_ANDAMENTO" && agora > fim) {
    status = "ENCERRADO";
  }

  if (status === "EM_ANDAMENTO" && agora < inicio) {
    status = "EM_ANDAMENTO";
  }

  const formatarTempoRestante = () => {
    if (status !== "EM_ANDAMENTO") {
      return null;
    }

    const diffMs = fim.getTime() - agora.getTime();

    if (diffMs <= 0) {
      return (
        <span className="rounded-full border border-rose-500/40 bg-rose-950/60 px-2.5 py-1 text-xs font-semibold text-rose-400">
          ✕ Encerrado
        </span>
      );
    }

    const dias = Math.floor(
      diffMs / (1000 * 60 * 60 * 24)
    );

    const horas = Math.floor(
      (diffMs / (1000 * 60 * 60)) % 24
    );

    if (dias > 0) {
      return (
        <span className="font-mono text-xs font-bold text-emerald-400">
          {String(dias).padStart(2, "0")}d{" "}
          {String(horas).padStart(2, "0")}h restantes
        </span>
      );
    }

    return (
      <span className="font-mono text-xs font-bold text-amber-400">
        {String(horas).padStart(2, "0")}h restantes
      </span>
    );
  };

  const renderizarStatus = () => {
    if (status === "CONCLUIDO") {
      return (
        <span className="rounded-full border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          ✓ Concluído
        </span>
      );
    }

    if (status === "ENCERRADO") {
      return (
        <span className="rounded-full border border-rose-500/40 bg-rose-950/60 px-2.5 py-1 text-xs font-semibold text-rose-400">
          ✕ Encerrado
        </span>
      );
    }

    return (
      <span className="rounded-full border border-amber-500/30 bg-amber-950/30 px-2.5 py-1 text-xs font-semibold text-amber-400">
        🟡 Em Andamento
      </span>
    );
  };

  const podeEnviar =
    status === "EM_ANDAMENTO" &&
    !evento.enviadoParaValidacao;

  const aguardandoProfessor =
    status === "EM_ANDAMENTO" &&
    evento.enviadoParaValidacao;

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
        status === "CONCLUIDO"
          ? "border-emerald-500/40 bg-slate-900/80 shadow-lg shadow-emerald-950/20"
          : status === "EM_ANDAMENTO"
          ? "border-slate-700/80 bg-slate-900/90 hover:border-amber-500/50"
          : "border-rose-900/40 bg-slate-950/90 opacity-75"
      }`}
    >
      <div>
        {/* CABEÇALHO */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-bold tracking-wide text-amber-500">
            {evento.categoria}
          </span>

          {renderizarStatus()}
        </div>

        {/* TÍTULO */}
        <h3 className="mb-2 text-xl font-bold leading-snug text-white">
          {evento.titulo}
        </h3>

        {/* DESCRIÇÃO */}
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          {evento.descricao}
        </p>

        {/* PRAZO */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {formatarTempoRestante()}

          <span className="text-[10px] font-bold text-slate-600">
            📅 Até{" "}
            {fim.toLocaleDateString("pt-BR")}
          </span>
        </div>

        {/* RECOMPENSAS */}
        {(evento.recompensaXp ||
          evento.recompensaMoedas ||
          evento.emblema) && (
          <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            {evento.recompensaXp !== undefined && (
              <span className="text-xs font-black text-amber-400">
                ✨ +{evento.recompensaXp} XP
              </span>
            )}

            {evento.recompensaMoedas !== undefined && (
              <span className="text-xs font-black text-yellow-300">
                🪙 +{evento.recompensaMoedas}
              </span>
            )}

            {evento.emblema && (
              <span className="text-xs font-black text-purple-300">
                🏅 {evento.emblema}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ÁREA DE AÇÃO DO ALUNO */}
      <div className="mt-2">
        {status === "CONCLUIDO" && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-4 py-2 text-center text-xs font-bold text-emerald-400">
            ✓ Evento concluído e recompensa recebida
          </div>
        )}

        {status === "ENCERRADO" && (
          <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 px-4 py-2 text-center text-xs font-bold text-rose-400">
            ✕ Evento encerrado sem conclusão
          </div>
        )}

        {aguardandoProfessor && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-4 py-2 text-center text-xs font-bold text-amber-400">
            ⏳ Conclusão enviada ao professor
          </div>
        )}

        {podeEnviar && (
          <button
            type="button"
            onClick={() => onEnviarConclusao?.(evento)}
            className="w-full rounded-lg border border-amber-500/40 bg-amber-500 px-4 py-2.5 text-sm font-black text-slate-950 transition-colors hover:bg-amber-400"
          >
            ✓ Enviar conclusão
          </button>
        )}
      </div>
    </div>
  );
};

export default CardEventoAluno;