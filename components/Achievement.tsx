"use client";

type AchievementCategory =
| "common"
| "rare"
| "legendary"
| "demerit";

type AchievementProps = {
icon: string;
title: string;
text: string;
category?: AchievementCategory;
unlocked?: boolean;
hidden?: boolean;
date?: string;
};

export default function Achievement({
icon,
title,
text,
category = "common",
unlocked = true,
hidden = false,
date,
}: AchievementProps) {
const categoryLabel = {
common: "Comum",
rare: "Rara",
legendary: "Lendária",
demerit: "Demérito",
};

const categoryStyle = {
common:
"border-slate-700 bg-slate-900/70",
rare:
"border-blue-800/60 bg-blue-950/30",
legendary:
"border-amber-700/60 bg-amber-950/30",
demerit:
"border-red-800/60 bg-red-950/30",
};

return (
<div
className={`relative flex items-center gap-4 rounded-2xl border p-4 transition ${
        unlocked
          ? categoryStyle[category]
          : "border-slate-800 bg-slate-950/50 opacity-70"
      }`}
>
<div
className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border text-3xl ${
          unlocked
            ? "border-slate-700 bg-slate-950"
            : "border-slate-800 bg-slate-950 grayscale"
        }`}
>
{hidden && !unlocked ? "?" : icon} </div>


  <div className="min-w-0 flex-1">
    <div className="flex flex-wrap items-center gap-2">
      <strong
        className={`font-black ${
          unlocked
            ? "text-white"
            : "text-slate-500"
        }`}
      >
        {hidden && !unlocked
          ? "Conquista Oculta"
          : title}
      </strong>

      <span className="rounded-md border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-slate-500">
        {categoryLabel[category]}
      </span>
    </div>

    <p
      className={`mt-1 text-xs leading-relaxed ${
        unlocked
          ? "text-slate-400"
          : "text-slate-600"
      }`}
    >
      {hidden && !unlocked
        ? "Esta conquista ainda não foi revelada."
        : text}
    </p>

    {unlocked && date && (
      <div className="mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">
        Desbloqueada em {date}
      </div>
    )}
  </div>

  {unlocked && (
    <div className="shrink-0 rounded-full border border-emerald-800/50 bg-emerald-950/40 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-400">
      Desbloqueada
    </div>
  )}
</div>


);
}
