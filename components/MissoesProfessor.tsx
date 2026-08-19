import React from "react";

export interface SolicitacaoEntrega {
  id: string;
  nomeAluno: string;
  avatarAluno?: string;
  tituloMissao: string;
  xpReward: number;
  coinReward: number;
  dataEnvio: string;
}

interface PainelAprovacaoProps {
  solicitacoes: SolicitacaoEntrega[];
  onAprovar: (solicitacaoId: string) => void;
  onRecusar: (solicitacaoId: string) => void;
}

export const PainelAprovacaoProfessor: React.FC<PainelAprovacaoProps> = ({
  solicitacoes,
  onAprovar,
  onRecusar,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
        <span>⚔️</span> Validação de Missões de Alunos
      </h3>
      <p className="text-slate-400 text-xs mb-6">
        Revise as entregas solicitadas pelos alunos para liberar as recompensas em XP e Moedas.
      </p>

      {solicitacoes.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Nenhuma entrega pendente para avaliação no momento.
        </div>
      ) : (
        <div className="space-y-3">
          {solicitacoes.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center text-lg font-bold text-amber-400">
                  {item.avatarAluno || "🧙‍♂️"}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{item.nomeAluno}</h4>
                  <p className="text-slate-400 text-xs">
                    Entregou: <strong className="text-slate-200">{item.tituloMissao}</strong>
                  </p>
                  <div className="flex gap-2 text-[11px] font-bold mt-1">
                    <span className="text-amber-400">⚡ +{item.xpReward} XP</span>
                    <span className="text-yellow-500">🪙 +{item.coinReward} Moedas</span>
                  </div>
                </div>
              </div>

              {/* Botões do Professor */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => onRecusar(item.id)}
                  className="px-3 py-1.5 text-xs font-bold bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition-all"
                >
                  Recusar
                </button>
                <button
                  onClick={() => onAprovar(item.id)}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow transition-all"
                >
                  ✓ Aprovar & Recompensar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};