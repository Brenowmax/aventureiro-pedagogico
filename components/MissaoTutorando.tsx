import React from "react";

export interface Quest {
  id: string;
  category: "Diário" | "Semanal" | "Mensal" | "Especial (Mensal)";
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  currentProgress: number; 
  totalProgress: number;   
  startDate?: string;       
  endDate?: string;         
  statusAluno?: "PENDENTE" | "AGUARDANDO_APROVACAO" | "APROVADO" | "RECUSADO";
  icon?: string;
}

interface MissaoTutorandoProps {
  quests: Quest[];
  onSolicitarConclusao: (questId: string) => void;
}

export const MissaoTutorando: React.FC<MissaoTutorandoProps> = ({ quests, onSolicitarConclusao }) => {
  const now = new Date();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quests.map((quest) => {
        const isExpired = quest.endDate ? new Date(quest.endDate) < now : false;
        const status = quest.statusAluno || "PENDENTE";

        const percentage = Math.min(
          100,
          Math.round((quest.currentProgress / quest.totalProgress) * 100)
        );

        let statusTag = null;
        let actionArea = null;

        // 1. PROFESSOR JÁ APROVOU (CONCLUÍDO)
        if (status === "APROVADO") {
          statusTag = (
            <span className="text-emerald-400 text-xs font-bold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
              ✓ Concluído
            </span>
          );
          actionArea = (
            <div className="text-right text-xs text-emerald-400 font-semibold py-1">
              ✨ Recompensa concedida pelo professor!
            </div>
          );
        } 
        // 2. ALUNO JÁ ENVIOU E AGUARDA O PROFESSOR
        else if (status === "AGUARDANDO_APROVACAO") {
          statusTag = (
            <span className="text-amber-400 text-xs font-bold bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/30 animate-pulse">
              ⏳ Em Análise pelo Professor
            </span>
          );
          actionArea = (
            <div className="text-right text-xs text-amber-400/80 italic py-1">
              Aguardando o Mestre validar sua missão...
            </div>
          );
        }
        // 3. PRAZO ENCERRADO E NÃO FOI APROVADO
        else if (isExpired) {
          statusTag = (
            <span className="text-rose-400 text-xs font-bold bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-500/30">
              ✕ Encerrado
            </span>
          );
          actionArea = (
            <div className="text-right text-xs text-rose-400/80 font-semibold py-1">
              Prazo esgotado (Não realizado)
            </div>
          );
        } 
        // 4. EM ANDAMENTO / PRONTO PARA ENVIAR
        else {
          actionArea = (
            <button
              onClick={() => onSolicitarConclusao(quest.id)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-2 px-4 rounded-lg shadow-md transition-all active:scale-95"
            >
              🚀 Entregar / Solicitar Avaliação
            </button>
          );
        }

        return (
          <div
            key={quest.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              status === "APROVADO"
                ? "bg-slate-900/60 border-emerald-500/30 opacity-90"
                : status === "AGUARDANDO_APROVACAO"
                ? "bg-slate-900 border-amber-500/30"
                : isExpired
                ? "bg-slate-950/80 border-rose-900/40 opacity-60"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            <div>
              {/* Topo com Categoria e Recompensas */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                    {quest.category}
                  </span>
                  {statusTag}
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-400">✨ +{quest.xpReward} XP</span>
                  <span className="text-yellow-500">🪙 +{quest.coinReward}</span>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 bg-slate-800 rounded-xl text-xl">
                  {quest.icon || "📜"}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-snug">
                    {quest.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {quest.description}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                  <span>Progresso</span>
                  <span>{percentage}%</span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      status === "APROVADO"
                        ? "bg-emerald-500"
                        : status === "AGUARDANDO_APROVACAO"
                        ? "bg-amber-400"
                        : isExpired
                        ? "bg-rose-600"
                        : "bg-amber-500/80"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Ação do Aluno */}
            <div>{actionArea}</div>
          </div>
        );
      })}
    </div>
  );
};