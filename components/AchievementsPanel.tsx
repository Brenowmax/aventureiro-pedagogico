"use client";

import {
  ACHIEVEMENTS,
  AchievementCategory,
} from "./achievements";

import Achievement from "./Achievement";

type UnlockedAchievement = {
  id: string;
  date?: string;
};

type AchievementsPanelProps = {
  unlockedAchievements?: UnlockedAchievement[];
  showHidden?: boolean;

  equippedAchievements?: string[];

  onEquipAchievement?: (
    id: string
  ) => void;
};

export default function AchievementsPanel({
  unlockedAchievements = [],
  showHidden = false,
  equippedAchievements = [],
  onEquipAchievement,
}: AchievementsPanelProps) {
  const unlockedMap = new Map<
    string,
    string | undefined
  >();

  unlockedAchievements.forEach((item) => {
    unlockedMap.set(item.id, item.date);
  });

  const categories: {
    id: AchievementCategory;
    title: string;
    description: string;
  }[] = [
    {
      id: "common",
      title: "Conquistas Comuns",
      description:
        "Conquistas obtidas naturalmente durante a jornada acadêmica.",
    },
    {
      id: "rare",
      title: "Conquistas Raras",
      description:
        "Conquistas relacionadas a eventos, desafios e experiências especiais.",
    },
    {
      id: "legendary",
      title: "Conquistas Lendárias",
      description:
        "Honrarias especiais concedidas por professores ou gestores.",
    },
    {
      id: "demerit",
      title: "Deméritos",
      description:
        "Registros especiais relacionados a condutas inadequadas.",
    },
  ];

  function handleToggleEquip(id: string) {
    if (!unlockedMap.has(id)) {
      return;
    }

    if (!onEquipAchievement) {
      return;
    }

    onEquipAchievement(id);
  }

  const equippedAchievementData =
    equippedAchievements
      .map((id) =>
        ACHIEVEMENTS.find(
          (achievement) =>
            achievement.id === id
        )
      )
      .filter(Boolean);

  return (
    <section className="space-y-8">

      {/* CABEÇALHO */}
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">
          Grimório de Conquistas
        </div>

        <h2 className="mt-1 text-2xl font-black text-white">
          Conquistas do Aventureiro
        </h2>

        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Cada conquista representa uma marca importante
          na jornada do aventureiro pelo Reino do
          Conhecimento.
        </p>

        {/* SLOTS EQUIPADOS */}
        <div className="mt-4">

          <div className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-2">
            Insígnias Equipadas
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

            {[0, 1, 2].map((slot) => {
              const achievement =
                equippedAchievementData[slot];

              return (
                <div
                  key={slot}
                  className={`rounded-xl border p-3 text-center min-h-[90px] flex flex-col justify-center ${
                    achievement
                      ? "border-purple-500/30 bg-purple-950/20"
                      : "border-slate-800 bg-slate-900/50 opacity-60"
                  }`}
                >

                  {achievement ? (
                    <>
                      <div className="text-2xl">
                        {achievement.icon}
                      </div>

                      <div className="text-[10px] font-black text-purple-300 mt-1">
                        {achievement.title}
                      </div>

                      <div className="text-[8px] font-bold uppercase tracking-wider text-purple-500 mt-1">
                        Slot {slot + 1}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xl">
                        🛡️
                      </div>

                      <div className="text-[9px] font-bold text-slate-500 mt-1">
                        Slot vazio
                      </div>

                      <div className="text-[8px] font-bold uppercase tracking-wider text-slate-600 mt-1">
                        Slot {slot + 1}
                      </div>
                    </>
                  )}

                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* CATEGORIAS */}
      {categories.map((category) => {
        const achievements =
          ACHIEVEMENTS
            .filter(
              (achievement) =>
                achievement.category === category.id
            )
            .filter(
              (achievement) =>
                showHidden ||
                !achievement.hidden ||
                unlockedMap.has(achievement.id)
            );

        if (achievements.length === 0) {
          return null;
        }

        const unlockedCount =
          achievements.filter(
            (achievement) =>
              unlockedMap.has(achievement.id)
          ).length;

        return (
          <section
            key={category.id}
            className="space-y-3"
          >

            {/* TÍTULO DA CATEGORIA */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {category.title}
                </h3>

                <p className="text-xs text-slate-500">
                  {category.description}
                </p>
              </div>

              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {unlockedCount} / {achievements.length}{" "}
                desbloqueadas
              </div>
            </div>

            {/* LISTA DE CONQUISTAS */}
            <div className="grid grid-cols-1 gap-3">

              {achievements.map((achievement) => {

                const unlocked =
                  unlockedMap.has(
                    achievement.id
                  );

                const equipped =
                  equippedAchievements.includes(
                    achievement.id
                  );

                return (
                  <div
                    key={achievement.id}
                    className="space-y-2"
                  >

                    <Achievement
                      icon={achievement.icon}
                      title={achievement.title}
                      text={achievement.description}
                      category={achievement.category}
                      unlocked={unlocked}
                      hidden={achievement.hidden}
                      date={unlockedMap.get(
                        achievement.id
                      )}
                    />

                    {unlocked && (
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleEquip(
                            achievement.id
                          )
                        }
                        className={`w-full rounded-xl border px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition ${
                          equipped
                            ? "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                        }`}
                      >
                        {equipped
                          ? "🛡️ Desequipar Conquista"
                          : equippedAchievements.length >= 3
                            ? "🔒 Slots completos"
                            : "🏆 Equipar Conquista"}
                      </button>
                    )}

                  </div>
                );
              })}

            </div>

          </section>
        );
      })}

    </section>
  );
}