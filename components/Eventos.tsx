import React from "react";

export interface EventoProps {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  dataInicio: string; // Ex: "2026-08-18T20:00:00"
  dataFim: string;    // Ex: "2026-08-20T23:59:59"
  alunoFez: boolean;
  recompensaXp?: number;
}

export const CardEventoAluno: React.FC<{ evento: EventoProps }> = ({ evento }) => {
  const agora = new Date();
  const inicio = new Date(evento.dataInicio);
  const fim = new Date(evento.dataFim);

  // Lógica de cálculo do status
  let status: "CONCLUIDO" | "EM_ANDAMENTO" | "AGUARDANDO" | "ENCERRADO";

  if (evento.alunoFez) {
    status = "CONCLUIDO";
  } else if (agora < inicio) {
    status = "AGUARDANDO";
  } else if (agora <= fim) {
    status = "EM_ANDAMENTO";
  } else {
    status = "ENCERRADO";
  }

  // Função auxiliar para formatar o tempo restante/status
  const renderizarTagTempo = () => {
    if (status === "CONCLUIDO") {
      return (
        <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-full font-semibold">
          ✓ Feito / Concluído
        </span>
      );
    }

    if (status === "EM_ANDAMENTO") {
      // Exemplo de cálculo simples de dias/horas restantes
      const diffMs = fim.getTime() - agora.getTime();
      const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

      return (
        <span className="text-emerald-400 text-xs font-bold font-mono">
          {dias > 0 ? `${String(dias).padStart(2, "0")}d ` : ""}
          {String(horas).padStart(2, "0")}h restantes
        </span>
      );
    }

    if (status === "AGUARDANDO") {
      return (
        <span className="text-amber-400 text-xs font-semibold">
          Em breve
        </span>
      );
    }

    // Status ENCERRADO
    return (
      <span className="text-rose-500 bg-rose-950/60 border border-rose-500/40 text-xs px-2.5 py-1 rounded-full font-semibold">
        ✕ Encerrado (Não realizado)
      </span>
    );
  };

  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        status === "CONCLUIDO"
          ? "bg-slate-900/80 border-emerald-500/40 shadow-emerald-950/20 shadow-lg"
          : status === "EM_ANDAMENTO"
          ? "bg-slate-900/90 border-slate-700/80 hover:border-amber-500/50"
          : status === "AGUARDANDO"
          ? "bg-slate-900/40 border-slate-800 opacity-75"
          : "bg-slate-950/90 border-rose-900/40 opacity-70" // Encerrado
      }`}
    >
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-amber-500 font-bold text-sm tracking-wide">
            {evento.categoria}
          </span>
          {renderizarTagTempo()}
        </div>

        {/* Título do Evento */}
        <h3 className="text-xl font-bold text-white mb-2 leading-snug">
          {evento.titulo}
        </h3>

        {/* Descrição */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          {evento.descricao}
        </p>
      </div>

      {/* Rodapé com Ação/Status do Aluno */}
      {status === "EM_ANDAMENTO" && (
        <button className="w-full mt-2 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-colors">
          Realizar Missão
        </button>
      )}
    </div>
  );
};