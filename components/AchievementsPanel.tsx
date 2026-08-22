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
};

export default function AchievementsPanel({
unlockedAchievements = [],
showHidden = false,
}: AchievementsPanelProps) {
const unlockedMap = new Map<
string,
string | undefined

> ();

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

return ( <section className="space-y-8">
{/* CABEÇALHO */} <div> <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">
Grimório de Conquistas </div>


    <h2 className="mt-1 text-2xl font-black text-white">
      Conquistas do Aventureiro
    </h2>

    <p className="mt-2 max-w-3xl text-sm text-slate-400">
      Cada conquista representa uma marca importante
      na jornada do aventureiro pelo Reino do
      Conhecimento.
    </p>
  </div>

  {/* CATEGORIAS */}
  {categories.map((category) => {
    const achievements =
      ACHIEVEMENTS.filter(
        (achievement) =>
          achievement.category === category.id
      ).filter(
        (achievement) =>
          showHidden ||
          !achievement.hidden ||
          unlockedMap.has(achievement.id)
      );

    if (achievements.length === 0) {
      return null;
    }

    const unlockedCount =
      achievements.filter((achievement) =>
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
              unlockedMap.has(achievement.id);

            return (
              <Achievement
                key={achievement.id}
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
            );
          })}
        </div>
      </section>
    );
  })}
</section>


);
}
