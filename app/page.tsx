"use client";

import { useState } from "react";

/* ============================================================
   TYPES / TIPAGENS
============================================================ */

type UserRole = "student" | "teacher";

type Subject = {
  name: string;
  icon: string;
  level: string;
  x: number;
  y: number;
  color: string;
  region: string;
};

type Grades = [string, string, string, string];

type PerformanceLevel =
  | "Abaixo do Básico"
  | "Básico"
  | "Adequado"
  | "Avançado"
  | "Sem avaliação";

type EventItem = {
  id: string;
  title: string;
  description: string;
  type: "Boss Raid" | "Maratona" | "Feira" | "Especial";
  icon: string;
  status: "active" | "upcoming" | "ended";
  timeLeft?: string;
  startDate?: string;
  rewardXp: number;
  rewardCoins: number;
  badgeReward?: string;
  color: string;
};

type Quest = {
  id: string;
  title: string;
  category: "Diária" | "Semanal" | "Jornada";
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
};

type StudentRecord = {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  badge: string;
  turma?: string;
  grades: Record<string, Grades>;
};

/* ============================================================
   DADOS INICIAIS DE EXEMPLO
============================================================ */

const subjects: Subject[] = [
  { name: "Língua Portuguesa", icon: "📖", level: "Especialista", x: 23, y: 27, color: "#d97706", region: "Terras da Linguagem" },
  { name: "Língua Inglesa", icon: "🇬🇧", level: "Explorador", x: 40, y: 19, color: "#2563eb", region: "Terras da Linguagem" },
  { name: "Matemática", icon: "📐", level: "Aventureiro", x: 66, y: 25, color: "#7c3aed", region: "Montanhas dos Números" },
  { name: "História", icon: "🏛️", level: "Explorador", x: 79, y: 39, color: "#b45309", region: "Vale das Eras" },
  { name: "Geografia", icon: "🌎", level: "Mestre", x: 61, y: 48, color: "#15803d", region: "Terras da Cartografia" },
  { name: "Educação Física", icon: "⚽", level: "Explorador", x: 29, y: 53, color: "#dc2626", region: "Campos da Energia" },
  { name: "Artes", icon: "🎨", level: "Aventureiro", x: 44, y: 66, color: "#db2777", region: "Floresta das Artes" },
  { name: "Ciências", icon: "🔬", level: "Especialista", x: 74, y: 62, color: "#0891b2", region: "Laboratórios do Saber" },
  { name: "Projeto de Vida", icon: "🧭", level: "Aprendiz", x: 16, y: 72, color: "#ca8a04", region: "Horizonte do Futuro" },
  { name: "Tecnologia", icon: "💻", level: "Aventureiro", x: 86, y: 72, color: "#4f46e5", region: "Distrito Tecnológico" },
  { name: "Educação Financeira", icon: "💰", level: "Aprendiz", x: 51, y: 82, color: "#16a34a", region: "Mercado do Conhecimento" },
  { name: "Robótica", icon: "🤖", level: "Explorador", x: 72, y: 84, color: "#64748b", region: "Distrito Tecnológico" },
  { name: "Orientação de Estudos de Português", icon: "📝", level: "Aprendiz", x: 30, y: 87, color: "#ea580c", region: "Terras da Linguagem" },
  { name: "Orientação de Estudos de Matemática", icon: "📊", level: "Aprendiz", x: 90, y: 51, color: "#9333ea", region: "Montanhas dos Números" },
];

const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "O Desafio do Guardião da Geometria",
    description: "Batalha especial contra o Boss das Montanhas dos Números! Complete os exercícios de Geometria para ajudar a classe a derrotar o chefão.",
    type: "Boss Raid",
    icon: "🐉",
    status: "active",
    timeLeft: "02d 14h restantes",
    rewardXp: 500,
    rewardCoins: 200,
    badgeReward: "Caçador de Polígonos",
    color: "#7c3aed",
  },
  {
    id: "2",
    title: "Maratona do Conhecimento Literário",
    description: "Leia o livro do mês e participe do quiz de revisão de Língua Portuguesa para desbloquear multiplicadores de XP em dobro.",
    type: "Maratona",
    icon: "📜",
    status: "active",
    timeLeft: "05d 08h restantes",
    rewardXp: 350,
    rewardCoins: 150,
    color: "#d97706",
  },
  {
    id: "3",
    title: "Feira de Inovação & Robótica 32-bits",
    description: "Apresente seu projeto na semana tecnológica e ganhe o selo exclusivo de Mestre Inventor.",
    type: "Feira",
    icon: "⚙️",
    status: "upcoming",
    startDate: "Em 12 dias",
    rewardXp: 800,
    rewardCoins: 400,
    badgeReward: "Gênio da Tecnologia",
    color: "#0891b2",
  },
];

const initialQuests: Quest[] = [
  {
    id: "q1",
    title: "Mestre da Frequência",
    category: "Diária",
    description: "Acesse a plataforma hoje para manter sua sequência de estudos.",
    xpReward: 50,
    coinReward: 20,
    progress: 1,
    maxProgress: 1,
    completed: true,
    claimed: false,
    icon: "☀️",
  },
  {
    id: "q2",
    title: "Explorador da Matemática",
    category: "Diária",
    description: "Obtenha uma nota superior a 7.0 em qualquer atividade das Montanhas dos Números.",
    xpReward: 100,
    coinReward: 40,
    progress: 1,
    maxProgress: 1,
    completed: true,
    claimed: false,
    icon: "📐",
  },
  {
    id: "q3",
    title: "Sábio Leitor",
    category: "Semanal",
    description: "Registre notas em pelo menos 3 disciplinas das Terras da Linguagem.",
    xpReward: 250,
    coinReward: 100,
    progress: 2,
    maxProgress: 3,
    completed: false,
    claimed: false,
    icon: "📚",
  },
  {
    id: "q4",
    title: "Conquistador do Reino",
    category: "Jornada",
    description: "Mantenha o status Avançado em 5 disciplinas ao longo do bimestre.",
    xpReward: 600,
    coinReward: 250,
    progress: 3,
    maxProgress: 5,
    completed: false,
    claimed: false,
    icon: "👑",
  },
];

const mockClassStudents: StudentRecord[] = [
  { id: "s1", name: "Arthur Pendelton", avatar: "🗡️", level: 6, xp: 1850, badge: "Guardião da Luz", turma: "9º Ano A", grades: { "Matemática": ["8.5", "9.0", "8.0", ""] } },
  { id: "s2", name: "Beatriz Oliveira", avatar: "🏹", level: 5, xp: 1420, badge: "Arquimaga das Letras", turma: "9º Ano A", grades: { "Matemática": ["9.5", "10", "9.0", ""] } },
  { id: "s3", name: "Carlos Eduardo", avatar: "🛡️", level: 4, xp: 980, badge: "Defensor das Eras", turma: "9º Ano A", grades: { "Matemática": ["6.0", "5.5", "6.5", ""] } },
  { id: "s4", name: "Diana Prince", avatar: "🔮", level: 7, xp: 2100, badge: "Sábia do Conhecimento", turma: "9º Ano B", grades: { "Matemática": ["10", "9.8", "9.5", ""] } },
  { id: "s5", name: "Enzo Gabriel", avatar: "⚡", level: 3, xp: 620, badge: "Iniciante Veloz", turma: "9º Ano B", grades: { "Matemática": ["4.0", "5.0", "3.5", ""] } },
];

/* ============================================================
   FUNÇÕES AUXILIARES DE CÁLCULO
============================================================ */

function getPerformanceLevel(grade: number): PerformanceLevel {
  if (Number.isNaN(grade) || grade === 0) return "Sem avaliação";
  if (grade >= 1 && grade <= 4) return "Abaixo do Básico";
  if (grade >= 5 && grade <= 6) return "Básico";
  if (grade >= 7 && grade <= 8) return "Adequado";
  if (grade >= 9 && grade <= 10) return "Avançado";
  return "Sem avaliação";
}

function getPerformanceIcon(level: PerformanceLevel) {
  switch (level) {
    case "Abaixo do Básico": return "🔴";
    case "Básico": return "🟠";
    case "Adequado": return "🟢";
    case "Avançado": return "🟣";
    default: return "⚪";
  }
}

function getPerformanceClass(level: PerformanceLevel) {
  switch (level) {
    case "Abaixo do Básico": return "border-red-900/50 bg-red-950/20 text-red-400";
    case "Básico": return "border-orange-900/50 bg-orange-950/20 text-orange-400";
    case "Adequado": return "border-green-900/50 bg-green-950/20 text-green-400";
    case "Avançado": return "border-purple-900/50 bg-purple-950/20 text-purple-400";
    default: return "border-slate-800 bg-slate-900 text-slate-500";
  }
}

function calculateAverage(grades: Grades) {
  const validGrades = grades
    .map(Number)
    .filter((grade) => !Number.isNaN(grade) && grade >= 0);

  if (validGrades.length === 0) return 0;
  const total = validGrades.reduce((sum, grade) => sum + grade, 0);
  return total / validGrades.length;
}

function calculateXP(average: number) {
  return Math.round(average * 100);
}

function calculateReputation(average: number) {
  return Math.round(average * 100);
}

/* ============================================================
   COMPONENTE DE HP / CORAÇÕES ESTILO ZELDA
============================================================ */

function ZeldaHeartBar({ reputation }: { reputation: number }) {
  const totalHearts = 10;
  const heartValue = 100;

  return (
    <div className="flex items-center gap-0.5 text-xs select-none">
      {Array.from({ length: totalHearts }).map((_, index) => {
        const threshold = (index + 1) * heartValue;
        const halfThreshold = threshold - heartValue / 2;

        if (reputation >= threshold) {
          return <span key={index} className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]">❤️</span>;
        } else if (reputation >= halfThreshold) {
          return <span key={index} className="text-red-400 opacity-90">💔</span>;
        } else {
          return <span key={index} className="opacity-20 grayscale filter">🖤</span>;
        }
      })}
    </div>
  );
}

/* ============================================================
   MAPA INTERATIVO DO ALUNO
============================================================ */

function AdventureMap({
  grades,
  setGrades,
}: {
  grades: Record<string, Grades>;
  setGrades: React.Dispatch<React.SetStateAction<Record<string, Grades>>>;
}) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  function updateGrade(subjectName: string, bimestre: number, value: string) {
    let numericValue = value;
    if (Number(value) > 10) numericValue = "10";
    if (Number(value) < 0) numericValue = "0";

    setGrades((current) => {
      const previous = current[subjectName] || ["", "", "", ""];
      const updated: Grades = [...previous] as Grades;
      updated[bimestre] = numericValue;
      return { ...current, [subjectName]: updated };
    });
  }

  function getSubjectData(subject: Subject) {
    const subjectGrades = grades[subject.name] || ["", "", "", ""];
    const average = calculateAverage(subjectGrades);
    const xp = calculateXP(average);
    const reputation = calculateReputation(average);
    const performance = getPerformanceLevel(average);

    return { grades: subjectGrades, average, xp, reputation, performance };
  }

  if (selectedSubject) {
    const data = getSubjectData(selectedSubject);

    return (
      <section className="rounded-2xl border border-slate-800 bg-[#11150f] p-4 shadow-2xl sm:p-6">
        <button
          type="button"
          onClick={() => setSelectedSubject(null)}
          className="mb-5 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-amber-600 hover:text-amber-400"
        >
          ← Voltar ao mapa
        </button>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
                style={{
                  backgroundColor: `${selectedSubject.color}22`,
                  border: `1px solid ${selectedSubject.color}66`,
                }}
              >
                {selectedSubject.icon}
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-500">
                  {selectedSubject.region}
                </div>
                <h2 className="mt-1 text-2xl font-black">{selectedSubject.name}</h2>
              </div>
            </div>

            <div className={`rounded-xl border px-5 py-3 ${getPerformanceClass(data.performance)}`}>
              <div className="text-[9px] font-bold uppercase tracking-wider opacity-60">Proficiência</div>
              <div className="mt-1 font-black">{getPerformanceIcon(data.performance)} {data.performance}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Média do Componente</div>
            <div className="mt-2 text-2xl font-black text-white">{data.average > 0 ? data.average.toFixed(1) : "--"}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Proficiência</div>
            <div className="mt-2 text-sm font-black">{getPerformanceIcon(data.performance)} {data.performance}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">XP OBTIDO</div>
            <div className="mt-2 text-2xl font-black text-amber-400">✨ {data.xp}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">HP de Reputação</div>
            <div className="mt-3">
              <ZeldaHeartBar reputation={data.reputation} />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-[#11150f] p-5">
          <div className="mb-5">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-500">Desempenho acadêmico</div>
            <h3 className="mt-1 text-xl font-black">Notas Bimestrais</h3>
            <p className="mt-1 text-sm text-slate-500">Digite as notas de 0 a 10 para preencher a barra de HP/Reputação.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"].map((label, index) => {
              const grade = Number(data.grades[index]);
              const classification = getPerformanceLevel(grade);

              return (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                  <label className="mb-2 block text-xs font-bold text-slate-400">{label}</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={data.grades[index]}
                    onChange={(e) => updateGrade(selectedSubject.name, index, e.target.value)}
                    placeholder="0,0"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-center text-lg font-black text-white outline-none focus:border-amber-500"
                  />
                  <div className={`mt-2 rounded-lg border px-2 py-2 text-center text-[10px] font-bold ${getPerformanceClass(classification)}`}>
                    {getPerformanceIcon(classification)} {classification}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#11150f] shadow-2xl">
        <div className="border-b border-slate-800 p-5">
          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">Cartografia Acadêmica</div>
          <h2 className="mt-1 text-2xl font-black">Reino do Conhecimento</h2>
          <p className="mt-1 text-sm text-slate-500">Clique nos pontos do mapa ou nos cards abaixo para registrar notas e coletar HP.</p>
        </div>

        <div className="p-3 sm:p-5">
          <div
            className="relative overflow-hidden rounded-2xl border border-amber-900/40"
            style={{
              aspectRatio: "16 / 10",
              background: "radial-gradient(circle at 50% 45%, #27351f 0%, #172017 35%, #0d120d 75%, #080b08 100%)",
            }}
          >
            {subjects.map((subject) => {
              const data = getSubjectData(subject);

              return (
                <button
                  key={subject.name}
                  type="button"
                  onClick={() => setSelectedSubject(subject)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${subject.x}%`, top: `${subject.y}%` }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 text-xl shadow-xl transition-all group-hover:scale-125 sm:h-14 sm:w-14"
                    style={{
                      backgroundColor: `${subject.color}22`,
                      borderColor: `${subject.color}99`,
                      boxShadow: `0 0 25px ${subject.color}25`,
                    }}
                  >
                    {subject.icon}
                  </div>

                  {data.average > 0 && (
                    <div className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#11150f] px-1 text-[8px] font-black text-black ${
                      data.performance === "Abaixo do Básico" ? "bg-red-400" :
                      data.performance === "Básico" ? "bg-orange-400" :
                      data.performance === "Adequado" ? "bg-green-400" : "bg-purple-400"
                    }`}>
                      {data.average.toFixed(1)}
                    </div>
                  )}

                  <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-700 bg-[#090c09]/95 px-2 py-1 text-[8px] font-bold text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 sm:text-[9px]">
                    {subject.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white">Disciplinas e HP de Reputação</h3>
          <span className="text-xs text-slate-500">{subjects.length} Disciplinas no Reino</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const data = getSubjectData(subject);

            return (
              <div
                key={subject.name}
                onClick={() => setSelectedSubject(subject)}
                className="rounded-2xl border border-slate-800 bg-[#11150f] p-5 hover:border-amber-500/50 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                        style={{
                          backgroundColor: `${subject.color}22`,
                          border: `1px solid ${subject.color}55`,
                        }}
                      >
                        {subject.icon}
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-amber-500">
                          {subject.region}
                        </div>
                        <h4 className="font-black text-white group-hover:text-amber-400 transition">
                          {subject.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400">Vida / Reputação</span>
                      <span className="text-amber-400">{data.reputation} / 1000 HP</span>
                    </div>
                    <ZeldaHeartBar reputation={data.reputation} />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800/40">
                  <span className="text-slate-500">Média: <strong className="text-white">{data.average > 0 ? data.average.toFixed(1) : "--"}</strong></span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getPerformanceClass(data.performance)}`}>
                    {data.performance}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ABA DE OBJETIVOS (QUESTS DO ALUNO)
============================================================ */

function ObjectivesTab({
  quests,
  onClaimReward,
}: {
  quests: Quest[];
  onClaimReward: (questId: string) => void;
}) {
  const [filter, setFilter] = useState<"Todas" | "Diária" | "Semanal" | "Jornada">("Todas");

  const filteredQuests = quests.filter((q) => filter === "Todas" || q.category === filter);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#1b1e17] via-[#11150f] to-[#0a0d0a] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-400 mb-3">
            🎯 Quadro de Missões
          </div>
          <h2 className="text-3xl font-black text-white">Objetivos & Metas</h2>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Cumpra os objetivos diários e semanais para conquistar recompensas em moedas e subir de nível no reino.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["Todas", "Diária", "Semanal", "Jornada"] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              filter === cat
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700"
            }`}
          >
            {cat === "Todas" ? "Todas as Missões" : `Missões ${cat}s`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuests.map((q) => {
          const isFinished = q.progress >= q.maxProgress;
          const percent = Math.min(100, Math.round((q.progress / q.maxProgress) * 100));

          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition ${
                q.claimed
                  ? "border-slate-800/40 bg-slate-950/20 opacity-50"
                  : isFinished
                  ? "border-amber-500/40 bg-slate-900/90 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                  : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md border border-slate-800 bg-slate-950 text-slate-400">
                    {q.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="text-amber-400">✨ +{q.xpReward} XP</span>
                    <span className="text-amber-300">🪙 +{q.coinReward}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-3xl p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 shrink-0">
                    {q.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">{q.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{q.description}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Progresso</span>
                    <span className="text-amber-400">{q.progress} / {q.maxProgress} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex justify-end">
                {q.claimed ? (
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    ✓ Recompensa Resgatada
                  </span>
                ) : isFinished ? (
                  <button
                    type="button"
                    onClick={() => onClaimReward(q.id)}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-black text-black shadow-lg hover:brightness-110 active:scale-95 transition"
                  >
                    🎁 Resgatar Recompensa
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-500 italic">Em andamento...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   PAINEL GAMIFICADO DO PROFESSOR (MODO MESTRE NARRADOR)
============================================================ */

function TeacherPanel({ onSwitchRole }: { onSwitchRole: () => void }) {
  const [teacherTab, setTeacherTab] = useState<"overview" | "grades" | "create_event" | "quests" | "enturmar">("overview");
  const [selectedSubject, setSelectedSubject] = useState<string>("Matemática");
  const [students, setStudents] = useState<StudentRecord[]>(mockClassStudents);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados do Form de Adicionar Aluno
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentClass, setNewStudentClass] = useState("");

  // ESTADOS DE EDIÇÃO DE NOME E TURMA DO ALUNO
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editClass, setEditClass] = useState("");

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  function handleStudentGradeChange(studentId: string, bimIndex: number, val: string) {
    let numeric = val;
    if (Number(val) > 10) numeric = "10";
    if (Number(val) < 0) numeric = "0";

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const currentGrades = s.grades[selectedSubject] || ["", "", "", ""];
          const updated: Grades = [...currentGrades] as Grades;
          updated[bimIndex] = numeric;
          return {
            ...s,
            grades: { ...s.grades, [selectedSubject]: updated },
          };
        }
        return s;
      })
    );
  }

  function rewardStudent(studentName: string) {
    triggerToast(`✨ 100 XP e 50 Moedas concedidos a ${studentName}!`);
  }

  function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();

    if (!newStudentName.trim() || !newStudentClass.trim()) {
      triggerToast("⚠️ Preencha o nome e a turma do aluno!");
      return;
    }

    const avatars = ["🗡️", "🏹", "🛡️", "🔮", "⚡", "🧙‍♂️", "📜"];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newStudent: StudentRecord = {
      id: `s-${Date.now()}`,
      name: newStudentName,
      avatar: randomAvatar,
      level: 1,
      xp: 0,
      badge: "Iniciante do Reino",
      turma: newStudentClass,
      grades: { "Matemática": ["", "", "", ""] },
    };

    setStudents([newStudent, ...students]);
    triggerToast(`🎉 Aluno ${newStudentName} enturmado na turma ${newStudentClass}!`);

    setNewStudentName("");
    setNewStudentClass("");
  }

  // INICIAR MODO DE EDIÇÃO DO ALUNO
  function handleStartEdit(student: StudentRecord) {
    setEditingStudentId(student.id);
    setEditName(student.name);
    setEditClass(student.turma || "");
  }

  // CANCELAR EDIÇÃO
  function handleCancelEdit() {
    setEditingStudentId(null);
    setEditName("");
    setEditClass("");
  }

  // SALVAR ALTERAÇÃO DE NOME E TURMA
  function handleSaveEdit(studentId: string) {
    if (!editName.trim() || !editClass.trim()) {
      triggerToast("⚠️ Nome e turma não podem ficar em branco!");
      return;
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, name: editName, turma: editClass } : s
      )
    );

    triggerToast("✏️ Dados do aventureiro atualizados com sucesso!");
    setEditingStudentId(null);
  }

  // EXCLUIR ALUNO
  function handleDeleteStudent(studentId: string, studentName: string) {
    if (confirm(`Tem certeza que deseja remover ${studentName} do Reino?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      triggerToast(`🗑️ ${studentName} foi removido da guilda.`);
    }
  }

  return (
    <section className="space-y-6">
      {/* NOTIFICAÇÃO GAMIFICADA (TOAST) */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl border border-amber-500 bg-[#161c14] p-4 text-xs font-black text-amber-300 shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* CABEÇALHO DO MESTRE DO JOGO */}
      <div className="rounded-3xl border border-purple-800/50 bg-gradient-to-br from-[#231538] via-[#150f24] to-[#0a0812] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-purple-500/60 bg-purple-950/50 text-5xl shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                🧙‍♂️
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-purple-500 bg-purple-900 px-2 py-0.5 text-[8px] font-black uppercase text-purple-200">
                Lvl 99 Mestre
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-purple-300 mb-1">
                ⚙️ Portal de Comando do Narrador
              </div>
              <h2 className="text-3xl font-black text-white">Professor(a) Arcano</h2>
              <p className="text-xs text-purple-300/80 mt-0.5">Turma: <strong className="text-white">9º Ano A - Guilda dos Exploradores</strong></p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onSwitchRole}
              className="rounded-xl border border-purple-500/50 bg-purple-950/40 px-4 py-2 text-xs font-bold text-purple-200 hover:bg-purple-900/60 transition"
            >
              🔄 Visão do Aluno
            </button>
          </div>
        </div>

        {/* MEDIDORES ATRIBUTOS DA TURMA */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-purple-900/60 pt-6">
          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/30 p-3.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-purple-300">
              <span>Engajamento do Reino</span>
              <span>88% XP</span>
            </div>
            <div className="mt-2 text-xl font-black text-purple-200">Nível Coletivo 14</div>
            <div className="mt-2 h-2 w-full bg-purple-950 rounded-full overflow-hidden border border-purple-900">
              <div className="h-full bg-purple-500 rounded-full w-[88%]" />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/30 p-3.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-emerald-400">
              <span>Frequência / Mana da Sala</span>
              <span>94% Presença</span>
            </div>
            <div className="mt-2 text-xl font-black text-emerald-300">{students.length} Alunos Cadastrados</div>
            <div className="mt-2 h-2 w-full bg-emerald-950 rounded-full overflow-hidden border border-emerald-900">
              <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
            </div>
          </div>

          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/30 p-3.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-amber-400">
              <span>Desempenho Geral (HP)</span>
              <span>8.2 Média</span>
            </div>
            <div className="mt-2 text-xl font-black text-amber-300">Status Adequado</div>
            <div className="mt-2 h-2 w-full bg-amber-950 rounded-full overflow-hidden border border-amber-900">
              <div className="h-full bg-amber-500 rounded-full w-[82%]" />
            </div>
          </div>
        </div>
      </div>

      {/* MENU DE ABAS DO PROFESSOR */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setTeacherTab("overview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
            teacherTab === "overview"
              ? "border-purple-500 bg-purple-900/30 text-purple-300 shadow-lg"
              : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
          }`}
        >
          <span>📊</span>
          <span>Visão Geral da Classe</span>
        </button>

        <button
          type="button"
          onClick={() => setTeacherTab("grades")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
            teacherTab === "grades"
              ? "border-purple-500 bg-purple-900/30 text-purple-300 shadow-lg"
              : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
          }`}
        >
          <span>📜</span>
          <span>Grimório de Notas (Diário)</span>
        </button>

        <button
          type="button"
          onClick={() => setTeacherTab("create_event")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
            teacherTab === "create_event"
              ? "border-purple-500 bg-purple-900/30 text-purple-300 shadow-lg"
              : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
          }`}
        >
          <span>🐉</span>
          <span>Invocar Boss / Evento</span>
        </button>

        <button
          type="button"
          onClick={() => setTeacherTab("quests")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
            teacherTab === "quests"
              ? "border-purple-500 bg-purple-900/30 text-purple-300 shadow-lg"
              : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
          }`}
        >
          <span>🎯</span>
          <span>Criar Missões (Quests)</span>
        </button>

        {/* ABA: ENTURMAR ALUNO */}
        <button
          type="button"
          onClick={() => setTeacherTab("enturmar")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
            teacherTab === "enturmar"
              ? "border-purple-500 bg-purple-900/30 text-purple-300 shadow-lg"
              : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
          }`}
        >
          <span>➕</span>
          <span>Enturmar Aluno</span>
        </button>
      </div>

      {/* CONTEÚDO DAS ABAS DO PROFESSOR */}

      {/* ABA 1: VISÃO GERAL */}
      {teacherTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-4">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <span>🛡️</span> Distribuição da Turma por Proficiência
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-purple-400">🟣 Avançado (9.0 - 10.0)</span>
                    <span className="text-slate-300">12 alunos (40%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-purple-500 w-[40%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-green-400">🟢 Adequado (7.0 - 8.9)</span>
                    <span className="text-slate-300">11 alunos (36%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-green-500 w-[36%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-orange-400">🟠 Básico (5.0 - 6.9)</span>
                    <span className="text-slate-300">5 alunos (17%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-orange-500 w-[17%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-red-400">🔴 Abaixo do Básico (0.0 - 4.9)</span>
                    <span className="text-slate-300">2 alunos (7%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-red-500 w-[7%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-4">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <span>⚡</span> Feitos Recentes do Reino
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏆</span>
                    <div>
                      <strong className="text-white block">Beatriz Oliveira</strong>
                      <span className="text-slate-400">Conquistou a insígnia &quot;Arquimaga das Letras&quot;</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">Há 15m</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚔️</span>
                    <div>
                      <strong className="text-white block">Guilda dos Exploradores</strong>
                      <span className="text-slate-400">Derrotou 70% da barra de HP do Boss de Geometria</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">Há 2h</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">☀️</span>
                    <div>
                      <strong className="text-white block">Arthur Pendelton</strong>
                      <span className="text-slate-400">Completou a Missão Diária &quot;Mestre da Frequência&quot;</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">Há 4h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: GRIMÓRIO DE NOTAS / DIÁRIO */}
      {teacherTab === "grades" && (
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-[#11150f] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">Lançamento Rápido</div>
              <h3 className="text-xl font-black text-white">Grimório de Notas e HP dos Aventureiros</h3>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-400">Disciplina:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-purple-500"
              >
                {subjects.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Estudante / Titulo</th>
                  <th className="p-3 text-center">Turma</th>
                  <th className="p-3 text-center">1º Bim</th>
                  <th className="p-3 text-center">2º Bim</th>
                  <th className="p-3 text-center">3º Bim</th>
                  <th className="p-3 text-center">4º Bim</th>
                  <th className="p-3 text-center">Média / Status</th>
                  <th className="p-3 text-center">Ações de Mestre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((st) => {
                  const stGrades = st.grades[selectedSubject] || ["", "", "", ""];
                  const avg = calculateAverage(stGrades);
                  const perf = getPerformanceLevel(avg);

                  return (
                    <tr key={st.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-3 font-bold text-white">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-1.5 rounded-lg bg-slate-900 border border-slate-800">{st.avatar}</span>
                          <div>
                            <div className="font-black text-sm">{st.name}</div>
                            <div className="text-[10px] text-purple-400 font-normal">Nível {st.level} • {st.badge}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-purple-300">
                          {st.turma || "Sem Turma"}
                        </span>
                      </td>

                      {[0, 1, 2, 3].map((bimIdx) => (
                        <td key={bimIdx} className="p-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={stGrades[bimIdx]}
                            onChange={(e) => handleStudentGradeChange(st.id, bimIdx, e.target.value)}
                            placeholder="--"
                            className="w-14 rounded-lg border border-slate-800 bg-slate-950 py-1.5 text-center font-black text-white outline-none focus:border-purple-500"
                          />
                        </td>
                      ))}

                      <td className="p-3 text-center">
                        <div className="font-black text-sm text-white">{avg > 0 ? avg.toFixed(1) : "--"}</div>
                        <div className={`mt-0.5 inline-block px-2 py-0.5 rounded text-[9px] font-bold ${getPerformanceClass(perf)}`}>
                          {getPerformanceIcon(perf)} {perf}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => rewardStudent(st.name)}
                          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black text-amber-300 hover:bg-amber-500/20 transition"
                        >
                          🎁 Bônus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: CRIAR BOSS / EVENTO */}
      {teacherTab === "create_event" && (
        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">Invocação de Desafios</div>
            <h3 className="text-xl font-black text-white">Criar Evento ou Boss Raid da Semana</h3>
            <p className="text-xs text-slate-500 mt-1">Defina um desafio de tempo limitado para unir a turma em prol de um objetivo comum.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerToast("🐉 Evento / Boss Raid invocado com sucesso para toda a turma!");
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Título do Evento / Chefão</label>
              <input
                type="text"
                required
                placeholder="Ex: O Guardião dos Polígonos de Ouro"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Tipo de Evento</label>
              <select className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500">
                <option value="Boss Raid">🐉 Boss Raid (Batalha em Equipe)</option>
                <option value="Maratona">📜 Maratona do Conhecimento</option>
                <option value="Feira">⚙️ Feira / Exposição</option>
                <option value="Especial">✨ Evento Especial</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-300">Descrição do Desafio</label>
              <textarea
                rows={3}
                required
                placeholder="Descreva as tarefas que a turma precisa realizar para derrotar o chefão..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Recompensa de XP Coletivo</label>
              <input
                type="number"
                defaultValue={500}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Recompensa de Moedas (Priantinas)</label>
              <input
                type="number"
                defaultValue={200}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-xs font-black text-white shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                🔥 Lançar Evento para a Turma
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 4: GERENCIAR QUESTS */}
      {teacherTab === "quests" && (
        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">Quadro do Mestre</div>
            <h3 className="text-xl font-black text-white">Cadastrar Nova Missão (Quest)</h3>
            <p className="text-xs text-slate-500 mt-1">Adicione objetivos diários, semanais ou de jornada para os estudantes cumprirem.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerToast("🎯 Nova Quest enviada ao Mural do Estudante!");
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Título da Quest</label>
              <input
                type="text"
                required
                placeholder="Ex: Leitor Compulsivo"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Categoria</label>
              <select className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500">
                <option value="Diária">☀️ Diária</option>
                <option value="Semanal">📅 Semanal</option>
                <option value="Jornada">👑 Jornada</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-300">Instruções / Requisitos</label>
              <input
                type="text"
                required
                placeholder="Ex: Tirar nota maior que 8.0 em pelo menos 2 avaliações nesta semana."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Premiação em XP</label>
              <input
                type="number"
                defaultValue={150}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Premiação em Moedas</label>
              <input
                type="number"
                defaultValue={50}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-xs font-black text-white shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                ✨ Publicar Quest no Mural
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 5: FORMULÁRIO DE ENTURMAÇÃO DE ALUNOS COM EDIÇÃO E REMOÇÃO */}
      {teacherTab === "enturmar" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">Invocação de Aventureiros</div>
              <h3 className="text-xl font-black text-white">Enturmar Novo Aluno</h3>
              <p className="text-xs text-slate-500 mt-1">Cadastre e atribua estudantes às suas respectivas turmas para liberá-los no reino.</p>
            </div>

            <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nome Completo do Aluno</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ex: Gabriel Santos"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Turma (Digitável)</label>
                <input
                  type="text"
                  required
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  placeholder="Ex: 9º Ano A, 3001, Turma B..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-xs font-black text-white shadow-lg hover:brightness-110 active:scale-95 transition"
                >
                  ⚡ Enturmar Aluno
                </button>
              </div>
            </form>
          </div>

          {/* LISTA DOS ALUNOS ENTURMADOS (COM MODO DE EDIÇÃO EM LINHA) */}
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>👥</span> Alunos Cadastrados no Reino ({students.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Nome do Aluno</th>
                    <th className="p-3 text-center">Turma</th>
                    <th className="p-3 text-center">Nível</th>
                    <th className="p-3 text-center">Insígnia</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map((st) => {
                    const isEditing = editingStudentId === st.id;

                    return (
                      <tr key={st.id} className="hover:bg-slate-900/30 transition">
                        {/* COLUNA DO NOME */}
                        <td className="p-3 font-bold text-white">
                          <div className="flex items-center gap-3">
                            <span className="text-xl p-1.5 rounded-lg bg-slate-900 border border-slate-800">{st.avatar}</span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="rounded-lg border border-purple-500 bg-slate-950 px-2 py-1 text-xs text-white outline-none w-full"
                              />
                            ) : (
                              <span className="font-black">{st.name}</span>
                            )}
                          </div>
                        </td>

                        {/* COLUNA DA TURMA */}
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editClass}
                              onChange={(e) => setEditClass(e.target.value)}
                              className="rounded-lg border border-purple-500 bg-slate-950 px-2 py-1 text-xs text-white outline-none w-28 text-center"
                            />
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/50 text-[10px] font-bold text-purple-300">
                              {st.turma || "Sem Turma"}
                            </span>
                          )}
                        </td>

                        {/* COLUNA DE NÍVEL E INSÍGNIA */}
                        <td className="p-3 text-center font-bold text-amber-400">Lvl {st.level}</td>
                        <td className="p-3 text-center text-slate-400">{st.badge}</td>

                        {/* COLUNA DE AÇÕES DE EDIÇÃO E EXCLUSÃO */}
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(st.id)}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-bold transition"
                              >
                                ✓ Salvar
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 text-[10px] font-bold transition"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(st)}
                                className="rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-2 py-1 text-[10px] font-bold transition"
                                title="Editar Nome e Turma"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(st.id, st.name)}
                                className="rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-2 py-1 text-[10px] font-bold transition"
                                title="Remover Aluno"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   PÁGINA PRINCIPAL
============================================================ */

export default function Home() {
  const [role, setRole] = useState<UserRole>("teacher");
  const [activeTab, setActiveTab] = useState<string>("inicio");
  const [grades, setGrades] = useState<Record<string, Grades>>({});
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  
  // Status Globais do Jogador
  const [userCoins, setUserCoins] = useState(450);
  const [userXp, setUserXp] = useState(1250);

  function handleClaimReward(questId: string) {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.claimed) {
          setUserCoins((c) => c + q.coinReward);
          setUserXp((x) => x + q.xpReward);
          return { ...q, claimed: true };
        }
        return q;
      })
    );
  }

  return (
    <div className="min-h-screen bg-[#0d100d] text-slate-100 flex flex-col justify-between">
      {/* CABEÇALHO COM CONTROLE DE PERFIL */}
      <header className="border-b border-slate-800 bg-[#11150f] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{role === "student" ? "🧙‍♂️" : "🎓"}</div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-amber-500">
              {role === "student" ? "Aventureiro Pedagógico" : "Portal Educador"}
            </div>
            <h1 className="text-lg font-black">Reino do Conhecimento</h1>
          </div>
        </div>

        {/* BOTÃO DE TROCA DE PERFIL / SAIR */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRole(role === "student" ? "teacher" : "student")}
            className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
          >
            <span>🔄</span>
            <span>{role === "student" ? "Modo Professor" : "Modo Aluno"}</span>
          </button>

          <button
            type="button"
            onClick={() => setRole(role === "student" ? "teacher" : "student")}
            className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-900/40 transition"
          >
            🚪 Sair
          </button>
        </div>
      </header>

      {/* CONTEÚDO CONFORME O PERFIL */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {role === "teacher" ? (
          <TeacherPanel onSwitchRole={() => setRole("student")} />
        ) : (
          <>
            {/* ABA: INÍCIO */}
            {activeTab === "inicio" && (
              <section className="space-y-6">
                <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-b from-[#161c14] to-[#0f140e] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8">
                    {/* AVATAR 32-BIT */}
                    <div className="flex flex-col items-center">
                      <div className="relative group cursor-pointer">
                        <div className="w-48 h-56 sm:w-56 sm:h-64 rounded-2xl bg-[#090d08] border-4 border-amber-600/60 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden p-2">
                          <div className="text-7xl sm:text-8xl relative z-10 select-none">🧙‍♂️</div>
                          <div className="absolute bottom-2 inset-x-2 bg-slate-900/90 border border-slate-700/80 rounded-lg py-1 text-center backdrop-blur-sm z-20">
                            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Mago das Letras</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STATUS DE PROGRESSO */}
                    <div className="flex-1 flex flex-col justify-between space-y-6 w-full">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">Personagem Principal</div>
                            <h2 className="text-3xl font-black text-white mt-0.5">Aventureiro(a)</h2>
                          </div>
                        </div>

                        <div className="mt-5 space-y-2">
                          <div className="flex justify-between items-end">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Progresso Geral</span>
                              <div className="text-xl font-black text-amber-400">Nível 5</div>
                            </div>
                            <span className="text-xs font-black text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/50">
                              {userXp} / 2.000 XP
                            </span>
                          </div>

                          <div className="w-full bg-slate-900 h-5 rounded-xl p-1 border border-slate-800 shadow-inner overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-400 h-full rounded-lg transition-all duration-500"
                              style={{ width: `${Math.min(100, (userXp / 2000) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-center">
                          <div className="text-[9px] font-black uppercase text-amber-500 tracking-wider">Moeda Escolar</div>
                          <div className="text-2xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
                            🪙 {userCoins}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400">Priantinas</div>
                        </div>

                        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3.5 text-center">
                          <div className="text-[9px] font-black uppercase text-purple-400 tracking-wider">Reputação Total</div>
                          <div className="text-2xl font-black text-purple-300 mt-1 flex items-center justify-center gap-1">
                            ⭐ 780
                          </div>
                          <div className="text-[10px] font-bold text-slate-400">/ 1000 Média</div>
                        </div>

                        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-blue-500/30 bg-blue-950/20 p-3.5 text-center">
                          <div className="text-[9px] font-black uppercase text-blue-400 tracking-wider">Patente de Reino</div>
                          <div className="text-lg font-black text-blue-300 mt-1.5 truncate">Aventureiro</div>
                          <div className="text-[10px] font-bold text-slate-400">Classe Ativa</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARDS DE STATUS DO INÍCIO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Status de Perfil</div>
                    <h3 className="text-lg font-black text-slate-200 mt-1">Conduta Acadêmica</h3>
                    <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center gap-3">
                      <div className="text-3xl">🌟</div>
                      <div>
                        <div className="text-xs font-bold text-emerald-400">Exemplar</div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Atribuído pelo Conselho de Professores</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Insígnias de Honra</div>
                    <h3 className="text-lg font-black text-slate-200 mt-1">Conquistas Equipadas</h3>
                    <div className="mt-4 flex gap-2 justify-between">
                      <div className="flex-1 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-center">
                        <div className="text-2xl">📜</div>
                        <div className="text-[10px] font-bold text-amber-300 mt-1">Primeira Nota 10</div>
                      </div>
                      <div className="flex-1 rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-center">
                        <div className="text-2xl">⚡</div>
                        <div className="text-[10px] font-bold text-purple-300 mt-1">Lorde da Média</div>
                      </div>
                      <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-center opacity-40">
                        <div className="text-2xl">🔒</div>
                        <div className="text-[10px] font-bold text-slate-500 mt-1">Bloqueado</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Classificação Geral</div>
                    <h3 className="text-lg font-black text-slate-200 mt-1">Ranking do Reino</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-lg bg-slate-900/60 p-2 text-xs">
                        <span className="font-bold text-amber-400">🥇 1º Lugar</span>
                        <span className="font-black text-white">2.850 XP</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/30 p-2 text-xs">
                        <span className="font-bold text-amber-300">🥉 Você (3º)</span>
                        <span className="font-black text-amber-300">{userXp} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ABA: MAPA INTERATIVO */}
            {activeTab === "mapa" && <AdventureMap grades={grades} setGrades={setGrades} />}

            {/* ABA: EVENTOS */}
            {activeTab === "eventos" && (
              <section className="space-y-6">
                <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#1b1e17] via-[#11150f] to-[#0a0d0a] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <h2 className="text-3xl font-black text-white">Eventos & Desafios Especiais</h2>
                  <p className="mt-2 text-sm text-slate-400">Participe dos desafios sazonais ativos no reino.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockEvents.map((evt) => (
                    <div key={evt.id} className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-amber-400">{evt.type}</span>
                        <span className="text-xs font-bold text-emerald-400">{evt.timeLeft || evt.startDate}</span>
                      </div>
                      <h3 className="text-xl font-black text-white">{evt.title}</h3>
                      <p className="text-xs text-slate-400 mt-2">{evt.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ABA: OBJETIVOS */}
            {activeTab === "objetivos" && (
              <ObjectivesTab quests={quests} onClaimReward={handleClaimReward} />
            )}

            {/* OUTRAS ABAS */}
            {activeTab !== "inicio" && activeTab !== "mapa" && activeTab !== "eventos" && activeTab !== "objetivos" && (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/30">
                <div className="text-4xl mb-2">🚧</div>
                <h3 className="text-lg font-bold">Módulo em Desenvolvimento</h3>
                <p className="text-xs text-slate-500 mt-1">Esta seção estará disponível em breve.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* NAVEGAÇÃO INFERIOR DO ALUNO */}
      {role === "student" && (
        <nav className="border-t border-slate-800 bg-[#11150f] p-2 sticky bottom-0 z-50">
          <div className="max-w-md mx-auto flex items-center justify-around">
            <button
              type="button"
              onClick={() => setActiveTab("inicio")}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === "inicio" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-500"}`}
            >
              <span className="text-lg">🏠</span>
              <span className="text-[10px] font-bold">Início</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("mapa")}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === "mapa" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-500"}`}
            >
              <span className="text-lg">🗺️</span>
              <span className="text-[10px] font-bold">Mapa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("eventos")}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === "eventos" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-500"}`}
            >
              <span className="text-lg">🔥</span>
              <span className="text-[10px] font-bold">Eventos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("objetivos")}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === "objetivos" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-500"}`}
            >
              <span className="text-lg">🎯</span>
              <span className="text-[10px] font-bold">Objetivos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("conquistas")}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === "conquistas" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-500"}`}
            >
              <span className="text-lg">🏆</span>
              <span className="text-[10px] font-bold">Conquistas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("desempenho")}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === "desempenho" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "text-slate-500"}`}
            >
              <span className="text-lg">📊</span>
              <span className="text-[10px] font-bold">Desempenho</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}