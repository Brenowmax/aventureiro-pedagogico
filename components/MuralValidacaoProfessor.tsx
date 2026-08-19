"use client";

import React, { useState } from "react";

export interface SolicitacaoAluno {
  id: string;
  alunoNome: string;
  alunoAvatar?: string;
  missaoTitulo: string;
  missaoCategoria: string;
  xpReward: number;
  coinReward: number;
  dataEnvio: string;
  comentarioAluno?: string;
}

interface MuralProps {
  solicitacoes: SolicitacaoAluno[];
  onAprovar: (solicitacao: SolicitacaoAluno) => void;
  onRecusar: (id: string, motivo?: string) => void;
}

export const MuralValidacaoProfessor: React.FC<MuralProps> = ({
  solicitacoes,
  onAprovar,
  onRecusar,
}) => {
  const [itemEmRecusa, setItemEmRecusa] = useState<string | null>(null);
  const [motivoRecusa, setMotivoRecusa] = useState<{ [key: string]: string }>({});

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl my-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛡️ Mural de Validação de Missões
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Valide as entregas dos alunos para liberar XP e Moedas no reino.
          </p>
        </div>

        <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs px-3 py-1 rounded-full">
          {solicitacoes.length} pendente(s)
        </span>
      </div>

      {solicitacoes.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs">
          Nenhuma entrega pendente para avaliação no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solicitacoes.map((item) => (
            <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2 pb-2 border-b border-slate-900">
                  <span className="text-2xl">{item.alunoAvatar || "🧙‍♂️"}</span>
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.alunoNome}</h4>
                    <span className="text-[10px] text-slate-500">Enviado recentemente</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-amber-400 uppercase">{item.missaoCategoria}</span>
                <h3 className="text-slate-200 font-bold text-sm mb-1">{item.missaoTitulo}</h3>
                {item.comentarioAluno && (
                  <p className="text-xs text-slate-400 italic bg-slate-900 p-2 rounded border border-slate-800 mb-2">
                    "{item.comentarioAluno}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-900">
                <div className="flex justify-between text-xs font-bold mb-3">
                  <span className="text-slate-400">Recompensa:</span>
                  <span className="text-amber-400">✨ +{item.xpReward} XP | 🪙 +{item.coinReward}</span>
                </div>

                {itemEmRecusa === item.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Motivo da recusa..."
                      value={motivoRecusa[item.id] || ""}
                      onChange={(e) => setMotivoRecusa({ ...motivoRecusa, [item.id]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-xs p-2 rounded text-white outline-none focus:border-rose-500"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setItemEmRecusa(null)} className="w-1/2 text-xs text-slate-400 hover:text-white">Cancelar</button>
                      <button onClick={() => { onRecusar(item.id, motivoRecusa[item.id]); setItemEmRecusa(null); }} className="w-1/2 bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold py-1.5 rounded transition-colors">Confirmar Recusa</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setItemEmRecusa(item.id)} className="py-1.5 text-xs font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 rounded transition-colors">✕ Recusar</button>
                    <button onClick={() => onAprovar(item)} className="py-1.5 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded transition-colors">✓ Aprovar</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};