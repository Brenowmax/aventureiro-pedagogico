"use client";

import { useState } from "react";

type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  rarity: "Comum" | "Rara" | "Épica" | "Lendária";
  unlocked: boolean;
  equipped: boolean;
  progress?: number;
  target?: number;
};

const initialAchievements: Achievement[] = [
  {
    id: "primeira-nota-10",
    icon: "📜",
    title: "Primeira Nota 10",
    description: "Alcance sua primeira nota máxima em um componente curricular.",
    category: "Acadêmica",
    rarity: "Comum",
    unlocked: true,
    equipped: true,
  },

  {
    id: "lorde-da-media",
    icon: "⚡",
    title: "Lorde da Média",
    description: "Alcance média geral igual ou superior a 9,0.",
    category: "Acadêmica",
    rarity: "Épica",
    unlocked: true,
    equipped: true,
  },

  {
    id: "explorador-do-conhecimento",
    icon: "🗺️",
    title: "Explorador do Conhecimento",
    description: "Registre desempenho em pelo menos 5 componentes curriculares.",
    category: "Exploração",
    rarity: "Comum",
    unlocked: true,
    equipped: false,
  },

  {
    id: "mestre-das-disciplinas",
    icon: "📚",
    title: "Mestre das Disciplinas",
    description: "Alcance proficiência Adequada ou superior em 10 componentes.",
    category: "Acadêmica",
    rarity: "Rara",
    unlocked: false,
    equipped: false,
    progress: 6,
    target: 10,
  },

  {
    id: "guardiao-da-jornada",
    icon: "🛡️",
    title: "Guardião da Jornada",
    description: "Conclua 10 objetivos acadêmicos.",
    category: "Objetivos",
    rarity: "Rara",
    unlocked: false,
    equipped: false,
    progress: 4,
    target: 10,
  },

  {
    id: "cacador-de-missoes",
    icon: "⚔️",
    title: "Caçador de Missões",
    description: "Conclua 10 missões.",
    category: "Missões",
    rarity: "Rara",
    unlocked: false,
    equipped: false,
    progress: 3,
    target: 10,
  },

  {
    id: "heroi-do-reino",
    icon: "👑",
    title: "Herói do Reino",
    description: "Alcance o nível 10.",
    category: "Progressão",
    rarity: "Épica",
    unlocked: false,
    equipped: false,
    progress: 5,
    target: 10,
  },

  {
    id: "lenda-do-conhecimento",
    icon: "🌟",
    title: "Lenda do Conhecimento",
    description: "Alcance reputação total de 900 ou mais.",
    category: "Reputação",
    rarity: "Lendária",
    unlocked: false,
    equipped: false,
    progress: 780,
    target: 900,
  },
];

function getRarityClass(rarity: Achievement["rarity"]) {
  switch (rarity) {
    case "Lendária":
      return "border-amber-400/60 bg-amber-950/30 text-amber-300";

    case "Épica":
      return "border-purple-500/50 bg-purple-950/30 text-purple-300";

    case "Rara":
      return "border-blue-500/50 bg-blue-950/30 text-blue-300";

    default:
      return "border-slate-700 bg-slate-900/60 text-slate-300";
  }
}

function getRarityGlow(rarity: Achievement["rarity"]) {
  switch (rarity) {
    case "Lendária":
      return "shadow-[0_0_30px_rgba(245,158,11,0.18)]";

    case "Épica":
      return "shadow-[0_0_25px_rgba(168,85,247,0.15)]";

    case "Rara":
      return "shadow-[0_0_20px_rgba(59,130,246,0.12)]";

    default:
      return "";
  }
}

export default function Conquistas() {
  const [achievements, setAchievements] =
    useState<Achievement[]>(initialAchievements);

  const [filter, setFilter] =
    useState<"Todas" | "Desbloqueadas" | "Bloqueadas">("Todas");

  function toggleEquip(id: string) {
    setAchievements((current) =>
      current.map((achievement) => {
        if (achievement.id !== id) {
          return achievement;
        }

        if (!achievement.unlocked) {
          return achievement;
        }

        return {
          ...achievement,
          equipped: !achievement.equipped,
        };
      })
    );
  }

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === "Desbloqueadas") {
      return achievement.unlocked;
    }

    if (filter === "Bloqueadas") {
      return !achievement.unlocked;
    }

    return true;
  });

  const unlockedCount =
    achievements.filter((achievement) => achievement.unlocked).length;

  const equippedCount =
    achievements.filter((achievement) => achievement.equipped).length;

  return (
    <section className="space-y-6">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-b from-[#161c14] to-[#0f140e] p-6 shadow-2xl">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">
              Salão das Honras
            </div>

            <h2 className="mt-1 text-3xl font-black text-white">
              Conquistas
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Registre seus feitos, desbloqueie insígnias e equipe suas
              conquistas para representar sua jornada pelo Reino do Conhecimento.
            </p>
          </div>

          <div className="flex gap-3">

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-3 text-center">
              <div className="text-[9px] font-black uppercase tracking-wider text-emerald-500">
                Desbloqueadas
              </div>

              <div className="mt-1 text-2xl font-black text-emerald-300">
                {unlockedCount}
              </div>
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 px-4 py-3 text-center">
              <div className="text-[9px] font-black uppercase tracking-wider text-purple-400">
                Equipadas
              </div>

              <div className="mt-1 text-2xl font-black text-purple-300">
                {equippedCount}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          FILTROS
      ===================================================== */}

      <div className="flex flex-wrap gap-2">

        {(
          [
            "Todas",
            "Desbloqueadas",
            "Bloqueadas",
          ] as const
        ).map((item) => (

          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
              filter === item
                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                : "border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700 hover:text-slate-300"
            }`}
          >
            {item}
          </button>

        ))}

      </div>

      {/* =====================================================
          MURAL DE CONQUISTAS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {filteredAchievements.map((achievement) => (

          <div
            key={achievement.id}
            className={`relative overflow-hidden rounded-2xl border p-5 transition ${
              achievement.unlocked
                ? `${getRarityClass(achievement.rarity)} ${getRarityGlow(
                    achievement.rarity
                  )}`
                : "border-slate-800 bg-slate-950/70 opacity-55"
            }`}
          >

            {/* MARCAÇÃO DE EQUIPADA */}

            {achievement.equipped && achievement.unlocked && (
              <div className="absolute right-3 top-3 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-400">
                Equipada
              </div>
            )}

            {/* ÍCONE */}

            <div
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border text-5xl ${
                achievement.unlocked
                  ? getRarityClass(achievement.rarity)
                  : "border-slate-800 bg-slate-900 text-slate-700 grayscale"
              }`}
            >
              {achievement.unlocked ? achievement.icon : "🔒"}
            </div>

            {/* INFORMAÇÕES */}

            <div className="mt-5 text-center">

              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                {achievement.category}
              </div>

              <h3
                className={`mt-1 text-lg font-black ${
                  achievement.unlocked
                    ? "text-white"
                    : "text-slate-600"
                }`}
              >
                {achievement.title}
              </h3>

              <div
                className={`mt-2 text-[9px] font-black uppercase tracking-wider ${
                  achievement.unlocked
                    ? ""
                    : "text-slate-700"
                }`}
              >
                {achievement.rarity}
              </div>

              <p className="mt-3 min-h-[48px] text-xs leading-relaxed text-slate-500">
                {achievement.description}
              </p>

            </div>

            {/* PROGRESSO */}

            {!achievement.unlocked &&
              achievement.progress !== undefined &&
              achievement.target !== undefined && (

                <div className="mt-4">

                  <div className="mb-1 flex justify-between text-[9px] font-bold text-slate-600">

                    <span>
                      Progresso
                    </span>

                    <span>
                      {achievement.progress} / {achievement.target}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-900">

                    <div
                      className="h-full rounded-full bg-slate-700 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (achievement.progress /
                            achievement.target) *
                            100
                        )}%`,
                      }}
                    />

                  </div>

                </div>
              )}

            {/* BOTÃO */}

            {achievement.unlocked ? (

              <button
                type="button"
                onClick={() =>
                  toggleEquip(achievement.id)
                }
                className={`mt-5 w-full rounded-xl border px-3 py-2 text-xs font-black transition ${
                  achievement.equipped
                    ? "border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/40"
                    : "border-amber-500/30 bg-amber-950/20 text-amber-400 hover:bg-amber-950/40"
                }`}
              >
                {achievement.equipped
                  ? "Desequipar conquista"
                  : "Equipar conquista"}
              </button>

            ) : (

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-center text-[10px] font-bold text-slate-600">
                🔒 Conquista bloqueada
              </div>

            )}

          </div>

        ))}

      </div>

      {/* =====================================================
          RODAPÉ
      ===================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">
              Insígnias de Honra
            </div>

            <div className="mt-1 text-sm font-bold text-slate-300">
              Suas conquistas representam sua jornada acadêmica.
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500">
            {equippedCount} conquista(s) equipada(s)
          </div>

        </div>

      </div>

    </section>
  );
}