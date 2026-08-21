"use client";

import { useState } from "react";

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

const subjects: Subject[] = [
  {
    name: "Língua Portuguesa",
    icon: "📖",
    level: "Especialista",
    x: 23,
    y: 27,
    color: "#d97706",
    region: "Terras da Linguagem",
  },
  {
    name: "Língua Inglesa",
    icon: "🇬🇧",
    level: "Explorador",
    x: 40,
    y: 19,
    color: "#2563eb",
    region: "Terras da Linguagem",
  },
  {
    name: "Matemática",
    icon: "📐",
    level: "Aventureiro",
    x: 66,
    y: 25,
    color: "#7c3aed",
    region: "Montanhas dos Números",
  },
  {
    name: "História",
    icon: "🏛️",
    level: "Explorador",
    x: 79,
    y: 39,
    color: "#b45309",
    region: "Vale das Eras",
  },
  {
    name: "Geografia",
    icon: "🌎",
    level: "Mestre",
    x: 61,
    y: 48,
    color: "#15803d",
    region: "Terras da Cartografia",
  },
  {
    name: "Educação Física",
    icon: "⚽",
    level: "Explorador",
    x: 29,
    y: 53,
    color: "#dc2626",
    region: "Campos da Energia",
  },
  {
    name: "Artes",
    icon: "🎨",
    level: "Aventureiro",
    x: 44,
    y: 66,
    color: "#db2777",
    region: "Floresta das Artes",
  },
  {
    name: "Ciências",
    icon: "🔬",
    level: "Especialista",
    x: 74,
    y: 62,
    color: "#0891b2",
    region: "Laboratórios do Saber",
  },
  {
    name: "Projeto de Vida",
    icon: "🧭",
    level: "Aprendiz",
    x: 16,
    y: 72,
    color: "#ca8a04",
    region: "Horizonte do Futuro",
  },
  {
    name: "Tecnologia",
    icon: "💻",
    level: "Aventureiro",
    x: 86,
    y: 72,
    color: "#4f46e5",
    region: "Distrito Tecnológico",
  },
  {
    name: "Educação Financeira",
    icon: "💰",
    level: "Aprendiz",
    x: 51,
    y: 82,
    color: "#16a34a",
    region: "Mercado do Conhecimento",
  },
  {
    name: "Robótica",
    icon: "🤖",
    level: "Explorador",
    x: 72,
    y: 84,
    color: "#64748b",
    region: "Distrito Tecnológico",
  },
  {
    name: "Orientação de Estudos de Português",
    icon: "📝",
    level: "Aprendiz",
    x: 30,
    y: 87,
    color: "#ea580c",
    region: "Terras da Linguagem",
  },
  {
    name: "Orientação de Estudos de Matemática",
    icon: "📊",
    level: "Aprendiz",
    x: 90,
    y: 51,
    color: "#9333ea",
    region: "Montanhas dos Números",
  },
];

/* ============================================================
   CLASSIFICAÇÃO / PROFICIÊNCIA
============================================================ */
function getPerformanceLevel(grade: number): PerformanceLevel {
  if (Number.isNaN(grade) || grade <= 0) {
    return "Sem avaliação";
  }

  if (grade < 5) {
    return "Abaixo do Básico";
  }

  if (grade < 7) {
    return "Básico";
  }

  if (grade < 9) {
    return "Adequado";
  }

  return "Avançado";
}

/* ============================================================
   ÍCONE DA PROFICIÊNCIA
============================================================ */

function getPerformanceIcon(level: PerformanceLevel) {
  switch (level) {
    case "Abaixo do Básico":
      return "🔴";

    case "Básico":
      return "🟠";

    case "Adequado":
      return "🟢";

    case "Avançado":
      return "🟣";

    default:
      return "⚪";
  }
}

/* ============================================================
   CLASSE VISUAL DA PROFICIÊNCIA
============================================================ */

function getPerformanceClass(level: PerformanceLevel) {
  switch (level) {
    case "Abaixo do Básico":
      return "border-red-900/50 bg-red-950/20 text-red-400";

    case "Básico":
      return "border-orange-900/50 bg-orange-950/20 text-orange-400";

    case "Adequado":
      return "border-green-900/50 bg-green-950/20 text-green-400";

    case "Avançado":
      return "border-purple-900/50 bg-purple-950/20 text-purple-400";

    default:
      return "border-slate-800 bg-slate-900 text-slate-500";
  }
}

/* ============================================================
   MÉDIA
============================================================ */

/* ============================================================
   MÉDIA
   ------------------------------------------------------------
   Considera SOMENTE os bimestres que já possuem nota.
   Bimestres futuros/vazios não entram como nota zero.
============================================================ */

function calculateAverage(grades: Grades) {
  const validGrades = grades
    .filter((grade) => grade.trim() !== "")
    .map(Number)
    .filter(
      (grade) =>
        !Number.isNaN(grade) &&
        grade >= 0
    );

  if (validGrades.length === 0) {
    return 0;
  }

  const total = validGrades.reduce(
    (sum, grade) => sum + grade,
    0
  );

  return total / validGrades.length;
}
/* ============================================================
   XP
============================================================ */

function calculateXP(average: number) {
  return Math.round(average * 100);
}

/* ============================================================
   REPUTAÇÃO
   MÉDIA 0–10 → REPUTAÇÃO 0–1000
============================================================ */

function calculateReputation(average: number) {
  return Math.round(average * 100);
}

/* ============================================================
   NÍVEL BASEADO NA REPUTAÇÃO
============================================================ */

function calculateLevel(reputation: number) {
  if (reputation >= 900) {
    return "Mestre Supremo";
  }

  if (reputation >= 800) {
    return "Mestre";
  }

  if (reputation >= 700) {
    return "Especialista";
  }

  if (reputation >= 500) {
    return "Aventureiro";
  }

  if (reputation >= 300) {
    return "Explorador";
  }

  return "Aprendiz";
}

/* ============================================================
   BARRA DE CORAÇÕES — HP DE REPUTAÇÃO
============================================================ */

function ZeldaHeartBar({ reputation }: { reputation: number }) {
  const totalHearts = 10;
  const heartValue = 100;

  return (
    <div className="flex items-center gap-0.5 text-sm select-none">
      {Array.from({ length: totalHearts }).map((_, index) => {
        const threshold = (index + 1) * heartValue;
        const halfThreshold = threshold - heartValue / 2;

        if (reputation >= threshold) {
          return (
            <span
              key={index}
              className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]"
              title="Coração completo"
            >
              ❤️
            </span>
          );
        }

        if (reputation >= halfThreshold) {
          return (
            <span
              key={index}
              className="text-red-400 opacity-90"
              title="Meio coração"
            >
              💔
            </span>
          );
        }

        return (
          <span
            key={index}
            className="opacity-20 grayscale"
            title="Coração vazio"
          >
            🖤
          </span>
        );
      })}
    </div>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */

type StudentRecord = {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  badge: string;
  turma: string;
  grades: Record<string, Grades>;
};

type AdventureMapStudent = {
  id: string;
  name: string;
  grades: Record<string, Grades>;
};

type AdventureMapProps = {
  mode?: "student" | "teacher";
  students?: AdventureMapStudent[];
};

export default function AdventureMap({
  mode = "student",
  students = [],
}: AdventureMapProps) {
  console.log("ADVENTURE MAP CARREGADO - modo:", mode);
  const [selectedSubject, setSelectedSubject] =
    useState<Subject | null>(null);

  const [grades, setGrades] =
    useState<Record<string, Grades>>({});

  /* ==========================================================
     ALTERAR NOTA
  ========================================================== */

  function updateGrade(
    subjectName: string,
    bimestre: number,
    value: string
  ) {
    let numericValue = value;

    if (Number(value) > 10) {
      numericValue = "10";
    }

    if (Number(value) < 0) {
      numericValue = "0";
    }

    setGrades((current) => {
      const previous =
        current[subjectName] || ["", "", "", ""];

      const updated: Grades = [
        previous[0],
        previous[1],
        previous[2],
        previous[3],
      ];

      updated[bimestre] = numericValue;

      return {
        ...current,
        [subjectName]: updated,
      };
    });
  }

  /* ==========================================================
     DADOS DO TERRITÓRIO
  ========================================================== */

   /* ==========================================================
     DADOS DO TERRITÓRIO
  ========================================================== */

  function getSubjectData(subject: Subject) {
    /*
      MODO PROFESSOR
      ----------------------------------------------------------
      O mapa calcula a reputação utilizando as notas dos alunos
      enviados pelo page.tsx.
    */

    if (mode === "teacher" && students.length > 0) {
      const allGrades: number[] = [];

      students.forEach((student) => {
        const studentGrades =
          student.grades?.[subject.name];

        if (!studentGrades) {
          return;
        }

        studentGrades.forEach((grade) => {
          const numericGrade = Number(grade);

          if (
            grade !== "" &&
            !Number.isNaN(numericGrade)
          ) {
            allGrades.push(numericGrade);
          }
        });
      });

      /*
        Se houver notas cadastradas, calculamos a média geral
        de todos os alunos para esta disciplina.
      */

      if (allGrades.length > 0) {
        const total = allGrades.reduce(
          (sum, grade) => sum + grade,
          0
        );

        const average =
          total / allGrades.length;

        const xp = calculateXP(average);

        const reputation =
          calculateReputation(average);

        const level =
          calculateLevel(reputation);

        const performance =
          getPerformanceLevel(average);

        return {
          grades: [
            "",
            "",
            "",
            "",
          ] as Grades,
          average,
          xp,
          reputation,
          level,
          performance,
        };
      }
    }

    /*
      MODO ALUNO
      ----------------------------------------------------------
      Mantém o comportamento anterior do mapa.
    */

    const subjectGrades =
      grades[subject.name] ||
      ["", "", "", ""];

    const average =
      calculateAverage(subjectGrades);

    const xp =
      calculateXP(average);

    const reputation =
      calculateReputation(average);

    const level =
      calculateLevel(reputation);

    const performance =
      getPerformanceLevel(average);

    return {
      grades: subjectGrades,
      average,
      xp,
      reputation,
      level,
      performance,
    };
  }
  /* ==========================================================
     TERRITÓRIO SELECIONADO
  ========================================================== */

  if (selectedSubject) {
    const data = getSubjectData(selectedSubject);

    return (
      <section className="rounded-2xl border border-slate-800 bg-[#11150f] p-4 shadow-2xl sm:p-6">
        {/* VOLTAR AO MAPA */}

        <button
          type="button"
          onClick={() => setSelectedSubject(null)}
          className="mb-5 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-amber-600 hover:text-amber-400"
        >
          ← Voltar ao mapa
        </button>

        {/* CABEÇALHO */}

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

                <h2 className="mt-1 text-2xl font-black">
                  {selectedSubject.name}
                </h2>
              </div>
            </div>

            {/* PROFICIÊNCIA */}

            <div
              className={`rounded-xl border px-5 py-3 ${getPerformanceClass(
                data.performance
              )}`}
            >
              <div className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                Proficiência
              </div>

              <div className="mt-1 font-black">
                {getPerformanceIcon(data.performance)}{" "}
                {data.performance}
              </div>
            </div>
          </div>
        </div>

        {/* ESTATÍSTICAS */}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Média do Componente
            </div>

            <div className="mt-2 text-2xl font-black text-white">
              {data.average > 0
                ? data.average.toFixed(1)
                : "--"}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Proficiência
            </div>

            <div className="mt-2 text-sm font-black">
              {getPerformanceIcon(data.performance)}{" "}
              {data.performance}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              XP
            </div>

            <div className="mt-2 text-2xl font-black text-amber-400">
              ✨ {data.xp}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Reputação
            </div>

            <div className="mt-2 text-2xl font-black text-amber-400">
              ⭐ {data.reputation} / 1000
            </div>
          </div>
        </div>

        {/* ==================================================
            HP DE REPUTAÇÃO
        ================================================== */}

        <div className="mt-5 rounded-2xl border border-red-950/40 bg-slate-900/60 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                HP de Reputação
              </div>

              <div className="mt-1 text-sm font-bold text-white">
                Domínio do território
              </div>
            </div>

            <div className="text-sm font-black text-amber-400">
              {data.reputation} / 1000 HP
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center rounded-xl border border-slate-800 bg-black/20 p-4">
            <ZeldaHeartBar reputation={data.reputation} />
          </div>

          <div className="mt-3 text-center text-[10px] text-slate-500">
            Cada coração representa 100 pontos de reputação.
          </div>
        </div>

        {/* ==================================================
            NOTAS
        ================================================== */}

        <div className="mt-5 rounded-2xl border border-slate-800 bg-[#11150f] p-5">
          <div className="mb-5">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-500">
              Desempenho acadêmico
            </div>

            <h3 className="mt-1 text-xl font-black">
              Notas Bimestrais
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Registre as quatro notas para calcular a
              Reputação.
            </p>
          </div>

          {/* QUATRO BIMESTRES */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "1º Bimestre",
              "2º Bimestre",
              "3º Bimestre",
              "4º Bimestre",
            ].map((label, index) => {
              const grade = Number(data.grades[index]);

              const classification =
                getPerformanceLevel(grade);

              return (
                <div
                  key={label}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-3"
                >
                  <label className="mb-2 block text-xs font-bold text-slate-400">
                    {label}
                  </label>

                  {mode === "teacher" ? (
  <input
    type="number"
    min="0"
    max="10"
    step="0.1"
    value={data.grades[index]}
    onChange={(event) =>
      updateGrade(
        selectedSubject.name,
        index,
        event.target.value
      )
    }
    placeholder="0,0"
    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-center text-lg font-black text-white outline-none transition placeholder:text-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
  />
) : (
  <div className="flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center text-lg font-black text-slate-200">
    {data.grades[index] || "—"}
  </div>
)}

                  <div
                    className={`mt-2 rounded-lg border px-2 py-2 text-center text-[10px] font-bold ${getPerformanceClass(
                      classification
                    )}`}
                  >
                    {getPerformanceIcon(
                      classification
                    )}{" "}
                    {classification}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RESULTADO */}

          <div className="mt-5 rounded-xl border border-amber-900/30 bg-amber-950/10 p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-500">
                  Resultado do acompanhamento
                </div>

                <div className="mt-1 text-sm text-slate-400">
                  A reputação é calculada automaticamente
                  através da média das avaliações.
                </div>
              </div>

              <div className="text-center">
                <div className="text-[9px] uppercase tracking-wider text-slate-600">
                  Proficiência final
                </div>

                <div
                  className={`mt-2 rounded-xl border px-5 py-2 text-sm font-black ${getPerformanceClass(
                    data.performance
                  )}`}
                >
                  {getPerformanceIcon(
                    data.performance
                  )}{" "}
                  {data.performance}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            NÍVEL / PROGRESSÃO DE REPUTAÇÃO
        ================================================== */}

        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                Gamificação
              </div>

              <div className="mt-1 text-sm font-bold">
                Nível do território
              </div>
            </div>

            <div className="text-sm font-black text-amber-400">
              ⚔️ {data.level}
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-[9px] text-slate-500">
              <span>Reputação do território</span>

              <span>{data.reputation} / 1000</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (data.reputation / 1000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <ZeldaHeartBar reputation={data.reputation} />
          </div>
        </div>
      </section>
    );
  }

  /* ============================================================
     MAPA PRINCIPAL
  ============================================================ */

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#11150f] shadow-2xl">
      {/* CABEÇALHO */}

      <div className="border-b border-slate-800 p-5">
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
              Cartografia Acadêmica
            </div>

            <h2 className="mt-1 text-2xl font-black">
              Reino do Conhecimento
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Jornada acadêmica e reputação nos componentes.
            </p>
          </div>
        </div>
      </div>

      {/* MAPA */}

      <div className="p-3 sm:p-5">
        <div
          className="relative overflow-hidden rounded-2xl border border-amber-900/40"
          style={{
            aspectRatio: "16 / 10",
            background:
              "radial-gradient(circle at 50% 45%, #27351f 0%, #172017 35%, #0d120d 75%, #080b08 100%)",
          }}
        >
          {/* GRID */}

          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute left-[8%] right-[8%] top-[20%] border-t border-amber-700/50" />
            <div className="absolute left-[5%] right-[5%] top-[40%] border-t border-amber-700/50" />
            <div className="absolute left-[8%] right-[8%] top-[60%] border-t border-amber-700/50" />
            <div className="absolute left-[5%] right-[5%] top-[80%] border-t border-amber-700/50" />

            <div className="absolute bottom-[5%] left-[25%] top-[5%] border-l border-amber-700/50" />
            <div className="absolute bottom-[5%] left-[50%] top-[5%] border-l border-amber-700/50" />
            <div className="absolute bottom-[5%] left-[75%] top-[5%] border-l border-amber-700/50" />
          </div>

          {/* ROSA DOS VENTOS */}

          <div className="pointer-events-none absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-700/30 text-xs text-amber-600/70">
            <div className="absolute -translate-y-6 text-[9px]">
              N
            </div>

            <div className="absolute translate-y-6 text-[9px]">
              S
            </div>

            <div className="absolute -translate-x-6 text-[9px]">
              O
            </div>

            <div className="absolute translate-x-6 text-[9px]">
              L
            </div>

            <div className="text-lg">✦</div>
          </div>

          {/* TÍTULO */}

          <div className="pointer-events-none absolute left-4 top-4">
            <div className="text-[8px] font-bold uppercase tracking-[0.25em] text-amber-600/70">
              MAPA OFICIAL
            </div>

            <div className="mt-1 text-xs font-black text-amber-700/70">
              TERRAE COGNITIONIS
            </div>
          </div>

          {/* TERRITÓRIOS */}

          {subjects.map((subject) => {
            const data = getSubjectData(subject);

            return (
              <button
                key={subject.name}
                type="button"
                onClick={() =>
                  setSelectedSubject(subject)
                }
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${subject.x}%`,
                  top: `${subject.y}%`,
                }}
                title={`Explorar ${subject.name}`}
              >
                {/* ÍCONE */}

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 text-xl shadow-xl transition-all duration-200 group-hover:scale-125 sm:h-14 sm:w-14"
                  style={{
                    backgroundColor: `${subject.color}22`,
                    borderColor: `${subject.color}99`,
                    boxShadow: `0 0 25px ${subject.color}25`,
                  }}
                >
                  {subject.icon}
                </div>

                {/* NOTA / REPUTAÇÃO */}

                {data.average > 0 && (
                  <div
                    className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#11150f] px-1 text-[8px] font-black text-black ${
                      data.performance ===
                      "Abaixo do Básico"
                        ? "bg-red-400"
                        : data.performance ===
                          "Básico"
                        ? "bg-orange-400"
                        : data.performance ===
                          "Adequado"
                        ? "bg-green-400"
                        : "bg-purple-400"
                    }`}
                  >
                    {data.average.toFixed(1)}
                  </div>
                )}

                {/* MINI CORAÇÕES */}

                {data.average > 0 && (
                  <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded-md border border-slate-800 bg-[#090c09]/95 px-2 py-1 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                    <ZeldaHeartBar
                      reputation={data.reputation}
                    />
                  </div>
                )}

                {/* NOME */}

                <div className="pointer-events-none absolute left-1/2 top-full mt-8 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-700 bg-[#090c09]/95 px-2 py-1 text-[8px] font-bold text-slate-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 sm:text-[9px]">
                  {subject.name}
                </div>
              </button>
            );
          })}

          {/* LEGENDA */}

          <div className="absolute bottom-3 left-3 rounded-xl border border-slate-800 bg-[#090c09]/90 p-3 backdrop-blur">
            <div className="mb-2 text-[8px] font-bold uppercase tracking-[0.2em] text-amber-500">
              Proficiência
            </div>

            <div className="space-y-1 text-[8px]">
              <div>🔴 Abaixo do Básico</div>
              <div>🟠 Básico</div>
              <div>🟢 Adequado</div>
              <div>🟣 Avançado</div>
            </div>
          </div>

          {/* ESCALA */}

          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[8px] text-amber-700/70">
            <div className="w-12 border-t border-amber-700/60" />
            100 km
          </div>
        </div>
      </div>

      {/* ======================================================
          LISTA DE TERRITÓRIOS E REPUTAÇÃO
      ====================================================== */}

      <div className="border-t border-slate-800 p-5">
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-500">
            Territórios do Conhecimento
          </div>

          <h3 className="mt-1 text-lg font-black">
            Reputação por Componente
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subject) => {
            const data = getSubjectData(subject);

            return (
              <button
                key={subject.name}
                type="button"
                onClick={() =>
                  setSelectedSubject(subject)
                }
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-left transition hover:border-amber-700/50 hover:bg-slate-900"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                  style={{
                    backgroundColor: `${subject.color}22`,
                  }}
                >
                  {subject.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold">
                    {subject.name}
                  </div>

                  {/* REPUTAÇÃO */}

                  <div className="mt-2">
                    <ZeldaHeartBar
                      reputation={data.reputation}
                    />
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px]">
                    <span className="font-bold text-amber-500">
                      ⭐ {data.reputation}/1000
                    </span>

                    <span className="font-bold text-slate-500">
                      {data.level}
                    </span>

                    {data.average > 0 && (
                      <span
                        className={
                          data.performance ===
                          "Abaixo do Básico"
                            ? "text-red-400"
                            : data.performance ===
                              "Básico"
                            ? "text-orange-400"
                            : data.performance ===
                              "Adequado"
                            ? "text-green-400"
                            : "text-purple-400"
                        }
                      >
                        {getPerformanceIcon(
                          data.performance
                        )}{" "}
                        {data.performance}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-slate-600">
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}