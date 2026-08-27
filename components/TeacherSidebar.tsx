"use client";

type TeacherTab =
  | "overview"
  | "validation"
  | "grades"
  | "map"
  | "conduta"
  | "create_event"
  | "quests"
  | "enturmar"
  | "calendar";

type TeacherSidebarProps = {
  activeTab: TeacherTab;
  onChange: (tab: TeacherTab) => void;
};

const sections = [
  {
    title: "Guilda",
    items: [
      {
        id: "overview" as TeacherTab,
        icon: "📊",
        label: "Visão Geral",
      },
      {
        id: "calendar" as TeacherTab,
        icon: "📅",
        label: "Calendário da Guilda",
      },
    ],
  },
  {
    title: "Acadêmico",
    items: [
      {
        id: "grades" as TeacherTab,
        icon: "📖",
        label: "Grimório de Notas",
      },
      {
        id: "map" as TeacherTab,
        icon: "🗺️",
        label: "Mapa Acadêmico",
      },
    ],
  },
  {
    title: "Missões",
    items: [
      {
        id: "validation" as TeacherTab,
        icon: "📜",
        label: "Mural de Validação",
      },
      {
        id: "quests" as TeacherTab,
        icon: "🎯",
        label: "Criar Missões",
      },
      {
        id: "create_event" as TeacherTab,
        icon: "👑",
        label: "Boss / Eventos",
      },
    ],
  },
  {
    title: "Alunos",
    items: [
      {
        id: "enturmar" as TeacherTab,
        icon: "➕",
        label: "Enturmar Aluno",
      },
      {
        id: "conduta" as TeacherTab,
        icon: "⚖️",
        label: "Conduta",
      },
    ],
  },
];

export default function TeacherSidebar({
  activeTab,
  onChange,
}: TeacherSidebarProps) {
  return (
    <aside className="w-full md:w-64 shrink-0 rounded-2xl border border-slate-800 bg-[#0d120d] shadow-xl">
      <div className="border-b border-slate-800 p-4">
        <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
          Conselho da Guilda
        </div>

        <div className="mt-1 text-lg font-black text-white">
          Painel do Professor
        </div>
      </div>

      <nav className="p-3 space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-2 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
              {section.title}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChange(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold transition ${
                      active
                        ? "border border-purple-500/50 bg-purple-900/30 text-purple-300 shadow-lg"
                        : "border border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900/60 hover:text-slate-200"
                    }`}
                  >
                    <span className="w-6 text-center text-base">
                      {item.icon}
                    </span>

                    <span>{item.label}</span>

                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}