"use client";

import { useState } from "react";

// Tipos atualizados com as opções estipuladas
export type CategoriaQuest = "Diária" | "Semanal" | "Mensal" | "Bimestral";

export type StudentQuest = {
  id: string;
  title: string;
  description: string;
  category: CategoriaQuest;
  xpReward: number;
  coinReward: number;
  progress: number;
  maxProgress: number;
  status: "em_andamento" | "concluida" | "expirada";
  questGiver: string;
  icon?: string;
};

interface MissoesProfessorProps {
  quests?: StudentQuest[];
  onCreateQuest?: (quest: StudentQuest) => void;
  onUpdateProgress?: (questId: string, newProgress: number) => void;
}

export default function MissoesProfessor({
  quests = [],
  onCreateQuest,
  onUpdateProgress,
}: MissoesProfessorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoriaQuest>("Diária");
  const [xpReward, setXpReward] = useState(150);
  const [coinReward, setCoinReward] = useState(50);
  const [maxProgress, setMaxProgress] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newQuest: StudentQuest = {
      id: `quest-${Date.now()}`,
      title,
      description,
      category,
      xpReward: Number(xpReward),
      coinReward: Number(coinReward),
      progress: 0,
      maxProgress: Number(maxProgress) || 1,
      status: "em_andamento",
      questGiver: "Professor",
    };

    if (onCreateQuest) {
      onCreateQuest(newQuest);
    }

    // Limpar campos
    setTitle("");
    setDescription("");
    setMaxProgress(1);
  }

  return (
    <div className="w-full space-y-8 p-4">
      {/* CADASTRO DE NOVA MISSÃO */}
      <div className="rounded-2xl border border-purple-900/40 bg-[#0b0c10] p-6 shadow-2xl">
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
            QUADRO DO MESTRE
          </span>
          <h2 className="text-2xl font-black text-white">
            Cadastrar Nova Missão (Quest)
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Adicione objetivos diários, semanais, mensais ou bimestrais para os estudantes cumprirem.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* TÍTULO */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Título da Quest
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Leitor Compulsivo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-[#12141d] px-4 py-3 text-xs font-medium text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* CATEGORIA / PERÍODO */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Categoria / Período
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoriaQuest)}
                className="w-full rounded-xl border border-slate-800 bg-[#12141d] px-4 py-3 text-xs font-bold text-amber-400 outline-none focus:border-purple-500"
              >
                <option value="Diária">☀️ Diária</option>
                <option value="Semanal">📅 Semanal</option>
                <option value="Mensal">🌙 Mensal</option>
                <option value="Bimestral">👑 Bimestral</option>
              </select>
            </div>
          </div>

          {/* INSTRUÇÕES / REQUISITOS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Instruções / Requisitos
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ex: Tirar nota maior que 8.0 em pelo menos 2 avaliações neste período."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#12141d] px-4 py-3 text-xs font-medium text-white outline-none focus:border-purple-500"
            />
          </div>

          {/* PREMIAÇÕES E META */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Premiação em XP
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-[#12141d] px-4 py-3 text-xs font-bold text-amber-400 outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Premiação em Moedas
              </label>
              <input
                type="number"
                value={coinReward}
                onChange={(e) => setCoinReward(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-[#12141d] px-4 py-3 text-xs font-bold text-amber-300 outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Meta do Objetivo (Qtd.)
              </label>
              <input
                type="number"
                min="1"
                value={maxProgress}
                onChange={(e) => setMaxProgress(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-[#12141d] px-4 py-3 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* BOTÃO SUBMIT */}
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-purple-900/30 transition hover:bg-purple-500 active:scale-95"
          >
            ✨ Publicar Quest no Mural
          </button>
        </form>
      </div>

      {/* PAINEL DE CONTROLE DE MISSÕES ATIVAS */}
      {quests.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0b0c10] p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-black text-white">
            🎯 Lançar Progresso/Conclusão nos Objetivos
          </h3>

          <div className="space-y-3">
            {quests.map((q) => (
              <div
                key={q.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#12141d] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="rounded bg-purple-950/80 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                    {q.category}
                  </span>
                  <h4 className="mt-1 text-sm font-black text-white">{q.title}</h4>
                  <p className="text-xs text-slate-400">
                    +{q.xpReward} XP / +{q.coinReward} Moedas
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Progresso:</span>
                    <input
                      type="number"
                      min="0"
                      max={q.maxProgress}
                      value={q.progress}
                      onChange={(e) => {
                        if (onUpdateProgress) {
                          onUpdateProgress(q.id, Number(e.target.value));
                        }
                      }}
                      className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-center text-xs font-bold text-amber-400"
                    />
                    <span className="text-xs font-bold text-slate-500">
                      / {q.maxProgress}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateProgress) {
                        onUpdateProgress(q.id, q.maxProgress);
                      }
                    }}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-500"
                  >
                    ✓ Concluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}