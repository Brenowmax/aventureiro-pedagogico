"use client";

import { useState } from "react";

export type QuestPeriod = "Diário" | "Semanal" | "Mensal" | "Bimestral";
export type QuestStatus = "em_andamento" | "concluida" | "expirada";

export type StudentQuest = {
  id: string;
  title: string;
  description: string;
  period: QuestPeriod;
  xpReward: number;
  coinReward: number;
  progress: number;
  maxProgress: number;
  status: QuestStatus;
  questGiver: string;
  icon: string;
};

interface MissaoTutorandoProps {
  quests: StudentQuest[];
}

export default function MissaoTutorando({ quests }: MissaoTutorandoProps) {
  const [filterPeriod, setFilterPeriod] = useState<"Todos" | QuestPeriod>("Todos");
  const [filterStatus, setFilterStatus] = useState<"Todas" | QuestStatus>("Todas");

  const filteredQuests = quests.filter((q) => {
    const matchPeriod = filterPeriod === "Todos" || q.period === filterPeriod;
    const matchStatus = filterStatus === "Todas" || q.status === filterStatus;
    return matchPeriod && matchStatus;
  });

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      {/* MURAL DE MADEIRA (QUEST BOARD) */}
      <div className="rounded-3xl border-8 border-[#3e2723] bg-[#2a1a15] p-6 shadow-2xl shadow-black/80 ring-4 ring-[#1b0e0b]">
        
        {/* TOPO DO MURAL */}
        <div className="relative -mt-10 mb-8 mx-auto w-max rounded-xl border-4 border-[#5d4037] bg-[#3e2723] px-8 py-2 text-center shadow-lg">
          <span className="text-[#f5e6c8] text-[10px] font-black uppercase tracking-[0.3em] block">
            Guilda do Conhecimento
          </span>
          <h2 className="text-2xl font-black text-[#ffcc80] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            📜 MURAL DE OBJETIVOS
          </h2>
        </div>

        {/* FILTROS POR PERÍODO */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {(["Todos", "Diário", "Semanal", "Mensal", "Bimestral"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFilterPeriod(p)}
              className={`rounded-lg border-2 px-3 py-1 text-xs font-bold transition ${
                filterPeriod === p
                  ? "border-[#ffcc80] bg-[#5d4037] text-[#ffcc80]"
                  : "border-[#3e2723] bg-[#1b0e0b]/60 text-[#a1887f] hover:border-[#5d4037]"
              }`}
            >
              {p === "Todos" ? "Todos os Períodos" : p}
            </button>
          ))}
        </div>

        {/* GRID DE CARDS / PERGAMINHOS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuests.map((q) => {
            const isCompleted = q.status === "concluida";
            const isExpired = q.status === "expirada";

            return (
              <div
                key={q.id}
                className={`relative flex flex-col justify-between rounded-md p-5 shadow-2xl transition-transform hover:-translate-y-1 ${
                  isCompleted
                    ? "bg-[#e2d5b5] text-[#2c1d11] opacity-90"
                    : isExpired
                    ? "bg-[#c7b299] text-[#4a3b32] grayscale-[40%]"
                    : "bg-[#f4e4bc] text-[#2c1d11]"
                }`}
                style={{
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5), inset 0 0 40px rgba(139,69,19,0.15)",
                }}
              >
                {/* TACHINHA DO PERGAMINHO */}
                <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-[#2b1d0c] bg-amber-800 shadow-md" />

                <div>
                  {/* BADGE DE PERÍODO E TÍTULO */}
                  <div className="mb-3 flex items-start gap-3 border-b border-[#8d6e63]/30 pb-3">
                    <span className="text-3xl">{q.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-[#3e2723]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#5d4037]">
                          ⏳ {q.period}
                        </span>
                      </div>
                      <h3 className="mt-1 font-black text-sm uppercase leading-tight tracking-wide text-[#3e2723]">
                        {q.title}
                      </h3>
                    </div>
                  </div>

                  {/* DESCRIÇÃO */}
                  <p className="text-xs font-medium leading-relaxed text-[#4e342e]">
                    {q.description}
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {/* RECOMPENSAS */}
                  <div className="rounded-lg bg-[#3e2723]/10 p-2 text-center">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-[#5d4037]">
                      Recompensas
                    </span>
                    <div className="mt-0.5 flex items-center justify-center gap-4 text-xs font-black text-[#2c1d11]">
                      {q.xpReward > 0 && <span>✨ +{q.xpReward} XP</span>}
                      {q.coinReward > 0 && <span>🪙 +{q.coinReward} G</span>}
                    </div>
                  </div>

                  {/* BARRA DE PROGRESSO */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-[#5d4037]">
                      <span>Progresso:</span>
                      <span>
                        {q.progress} / {q.maxProgress}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full border border-[#8d6e63]/40 bg-[#3e2723]/20">
                      <div
                        className={`h-full rounded-full ${
                          isCompleted
                            ? "bg-emerald-600"
                            : isExpired
                            ? "bg-red-700"
                            : "bg-[#d7263d]"
                        }`}
                        style={{
                          width: `${Math.min(100, (q.progress / q.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* CARIMBO DE STATUS */}
                  <div className="flex items-center justify-between border-t border-[#8d6e63]/30 pt-2 text-[10px]">
                    <span className="font-bold italic text-[#6d4c41]">
                      Prof: {q.questGiver}
                    </span>

                    {isCompleted && (
                      <span className="rounded border-2 border-emerald-800 bg-emerald-100 px-2 py-0.5 font-black uppercase text-emerald-900">
                        ✓ Concluído
                      </span>
                    )}
                    {isExpired && (
                      <span className="rounded border-2 border-red-800 bg-red-100 px-2 py-0.5 font-black uppercase text-red-900">
                        ✕ Encerrado
                      </span>
                    )}
                    {!isCompleted && !isExpired && (
                      <span className="rounded border-2 border-amber-800 bg-amber-100 px-2 py-0.5 font-black uppercase text-amber-900">
                        ⏳ Em Andamento
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}