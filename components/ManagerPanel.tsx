"use client";

import { useMemo, useState } from "react";

type Student = {
  id: string;
  name: string;
  turma?: string;
  level?: number;
  badge?: string;
  avatar?: string;
};

type ManagerPanelProps = {
  students: Student[];
};

type ManagerTab =
  | "overview"
  | "students"
  | "teachers"
  | "classes"
  | "performance"
  | "map"
  | "events"
  | "objectives";

const tabs: {
  id: ManagerTab;
  icon: string;
  label: string;
  group: string;
}[] = [
  {
    id: "overview",
    icon: "📊",
    label: "Visão Geral",
    group: "Escola",
  },
  {
    id: "students",
    icon: "👥",
    label: "Alunos",
    group: "Escola",
  },
  {
    id: "teachers",
    icon: "🧙",
    label: "Professores",
    group: "Escola",
  },
  {
    id: "classes",
    icon: "🏫",
    label: "Turmas",
    group: "Escola",
  },
  {
    id: "performance",
    icon: "📈",
    label: "Desempenho",
    group: "Acadêmico",
  },
  {
    id: "map",
    icon: "🗺️",
    label: "Mapa Acadêmico",
    group: "Acadêmico",
  },
  {
    id: "events",
    icon: "🐉",
    label: "Eventos Coletivos",
    group: "Gestão",
  },
  {
    id: "objectives",
    icon: "🎯",
    label: "Objetivos Coletivos",
    group: "Gestão",
  },
];

export default function ManagerPanel({
  students,
}: ManagerPanelProps) {
  const [activeTab, setActiveTab] =
    useState<ManagerTab>("overview");

  const [eventTitle, setEventTitle] =
    useState("");

  const [eventDescription, setEventDescription] =
    useState("");

  const [eventReward, setEventReward] =
    useState("100");

  const [eventCreated, setEventCreated] =
    useState(false);

  const [objectiveTitle, setObjectiveTitle] =
    useState("");

  const [objectiveDescription, setObjectiveDescription] =
    useState("");

  const [objectiveCreated, setObjectiveCreated] =
    useState(false);

  const classes = useMemo(() => {
    const grouped = new Map<string, number>();

    students.forEach((student) => {
      const turma = student.turma || "Sem Turma";

      grouped.set(
        turma,
        (grouped.get(turma) || 0) + 1
      );
    });

    return Array.from(grouped.entries()).map(
      ([name, total]) => ({
        name,
        total,
      })
    );
  }, [students]);

  const averageLevel = useMemo(() => {
    if (!students.length) return 0;

    const total = students.reduce(
      (sum, student) =>
        sum + (Number(student.level) || 0),
      0
    );

    return Math.round(total / students.length);
  }, [students]);

  const advancedStudents = Math.round(
    students.length * 0.4
  );

  const adequateStudents = Math.round(
    students.length * 0.36
  );

  const basicStudents = Math.round(
    students.length * 0.17
  );

  const belowBasicStudents = Math.max(
    0,
    students.length -
      advancedStudents -
      adequateStudents -
      basicStudents
  );

  function createEvent() {
    if (!eventTitle.trim()) return;

    setEventCreated(true);

    setEventTitle("");
    setEventDescription("");
    setEventReward("100");
  }

  function createObjective() {
    if (!objectiveTitle.trim()) return;

    setObjectiveCreated(true);

    setObjectiveTitle("");
    setObjectiveDescription("");
  }

  function renderOverview() {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
            Conselho da Guilda
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            Visão Geral da Escola
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Painel administrativo com visão global
            do Reino do Conhecimento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
            <div className="text-2xl">
              👥
            </div>

            <div className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Alunos
            </div>

            <div className="mt-1 text-3xl font-black text-white">
              {students.length}
            </div>

            <div className="mt-1 text-[10px] text-purple-300">
              cadastrados no Reino
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
            <div className="text-2xl">
              🧙
            </div>

            <div className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Professores
            </div>

            <div className="mt-1 text-3xl font-black text-white">
              12
            </div>

            <div className="mt-1 text-[10px] text-emerald-300">
              membros da Guilda
            </div>
          </div>

          <div className="rounded-2xl border border-blue-800/40 bg-blue-950/20 p-5">
            <div className="text-2xl">
              🏫
            </div>

            <div className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Turmas
            </div>

            <div className="mt-1 text-3xl font-black text-white">
              {classes.length}
            </div>

            <div className="mt-1 text-[10px] text-blue-300">
              grupos acadêmicos
            </div>
          </div>

          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
            <div className="text-2xl">
              ⚔️
            </div>

            <div className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Nível Médio
            </div>

            <div className="mt-1 text-3xl font-black text-white">
              {averageLevel}
            </div>

            <div className="mt-1 text-[10px] text-amber-300">
              nível coletivo
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
                Desempenho coletivo
              </div>

              <h4 className="mt-1 text-lg font-black text-white">
                Distribuição por Proficiência
              </h4>
            </div>

            <span className="rounded-lg border border-purple-800/50 bg-purple-950/40 px-3 py-1 text-[10px] font-black text-purple-300">
              Escola
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-purple-300">
                  🟣 Avançado
                </span>

                <span className="font-black text-white">
                  {advancedStudents}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{
                    width: `${
                      students.length
                        ? (advancedStudents /
                            students.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-emerald-300">
                  🟢 Adequado
                </span>

                <span className="font-black text-white">
                  {adequateStudents}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      students.length
                        ? (adequateStudents /
                            students.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-yellow-300">
                  🟡 Básico
                </span>

                <span className="font-black text-white">
                  {basicStudents}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-yellow-500"
                  style={{
                    width: `${
                      students.length
                        ? (basicStudents /
                            students.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-red-300">
                  🔴 Abaixo do Básico
                </span>

                <span className="font-black text-white">
                  {belowBasicStudents}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${
                      students.length
                        ? (belowBasicStudents /
                            students.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Atividade do Reino
            </div>

            <h4 className="mt-1 text-lg font-black text-white">
              Feitos Recentes
            </h4>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <div className="flex gap-3">
                  <span className="text-xl">
                    🏆
                  </span>

                  <div>
                    <div className="text-xs font-black text-white">
                      Conquista coletiva
                    </div>

                    <div className="mt-1 text-[10px] text-slate-500">
                      A Guilda avançou em seu
                      desempenho acadêmico.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <div className="flex gap-3">
                  <span className="text-xl">
                    ⚔️
                  </span>

                  <div>
                    <div className="text-xs font-black text-white">
                      Novo desafio disponível
                    </div>

                    <div className="mt-1 text-[10px] text-slate-500">
                      O Conselho pode convocar
                      toda a escola.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/10 p-6">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
              Poder do Gestor
            </div>

            <h4 className="mt-1 text-lg font-black text-white">
              Alcance Institucional
            </h4>

            <p className="mt-3 text-xs leading-6 text-slate-400">
              O Gestor possui visão global da escola
              e poderá criar experiências destinadas
              a todos os alunos, independentemente
              do professor tutor.
            </p>

            <button
              type="button"
              onClick={() =>
                setActiveTab("events")
              }
              className="mt-5 rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-xs font-black text-purple-300 transition hover:bg-purple-500/20"
            >
              🐉 Criar Evento Escolar
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderStudents() {
    return (
      <div className="space-y-5">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
            Banco Escolar
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            Todos os Alunos
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Visão administrativa de todos os
            aventureiros cadastrados.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#11150f]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4">
                    Aluno
                  </th>

                  <th className="p-4 text-center">
                    Turma
                  </th>

                  <th className="p-4 text-center">
                    Nível
                  </th>

                  <th className="p-4 text-center">
                    Insígnia
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="transition hover:bg-slate-900/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-lg">
                          {student.avatar || "🧑‍🎓"}
                        </span>

                        <span className="font-black text-white">
                          {student.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className="rounded-lg border border-purple-800/50 bg-purple-950/40 px-2.5 py-1 text-[10px] font-bold text-purple-300">
                        {student.turma ||
                          "Sem Turma"}
                      </span>
                    </td>

                    <td className="p-4 text-center font-black text-amber-400">
                      Lvl {student.level || 1}
                    </td>

                    <td className="p-4 text-center text-slate-400">
                      {student.badge || "Aprendiz"}
                    </td>

                    <td className="p-4 text-center">
                      <span className="rounded-lg border border-emerald-800/50 bg-emerald-950/30 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}

                {!students.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-xs text-slate-500"
                    >
                      Nenhum aluno cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function renderTeachers() {
    return (
      <div className="space-y-5">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
            Conselho da Guilda
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            Professores
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Professores que fazem parte da equipe
            pedagógica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            "Professor(a) Arcano",
            "Mestre das Letras",
            "Guardião dos Números",
            "Cartógrafo do Reino",
            "Mestre das Ciências",
            "Mentor das Artes",
          ].map((teacher, index) => (
            <div
              key={teacher}
              className="rounded-2xl border border-slate-800 bg-[#11150f] p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-800/50 bg-purple-950/30 text-2xl">
                  🧙
                </div>

                <div>
                  <div className="font-black text-white">
                    {teacher}
                  </div>

                  <div className="mt-1 text-[10px] text-slate-500">
                    Professor #{index + 1}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-900/60 p-3">
                  <div className="text-[9px] uppercase text-slate-500">
                    Tutorados
                  </div>

                  <div className="mt-1 text-lg font-black text-white">
                    {Math.max(
                      1,
                      Math.round(
                        students.length / 6
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-900/60 p-3">
                  <div className="text-[9px] uppercase text-slate-500">
                    Status
                  </div>

                  <div className="mt-1 text-xs font-black text-emerald-400">
                    Ativo
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderClasses() {
    return (
      <div className="space-y-5">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">
            Organização Escolar
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            Turmas
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Distribuição dos alunos por turma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {classes.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-800 bg-[#11150f] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">
                  🏫
                </span>

                <span className="rounded-lg border border-blue-800/50 bg-blue-950/30 px-2.5 py-1 text-[10px] font-black text-blue-300">
                  {item.total} alunos
                </span>
              </div>

              <h4 className="mt-4 text-lg font-black text-white">
                {item.name}
              </h4>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${Math.min(
                      100,
                      item.total * 10
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}

          {!classes.length && (
            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-8 text-center text-xs text-slate-500 md:col-span-2 xl:col-span-3">
              Nenhuma turma cadastrada.
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderPerformance() {
    return (
      <div className="space-y-5">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">
            Conselho Acadêmico
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            Desempenho Geral
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Indicadores globais da escola.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
            <div className="text-[10px] font-black uppercase text-slate-500">
              Média Geral
            </div>

            <div className="mt-2 text-4xl font-black text-emerald-300">
              8.2
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              Status adequado
            </div>
          </div>

          <div className="rounded-2xl border border-blue-800/40 bg-blue-950/20 p-5">
            <div className="text-[10px] font-black uppercase text-slate-500">
              Frequência
            </div>

            <div className="mt-2 text-4xl font-black text-blue-300">
              94%
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              presença escolar
            </div>
          </div>

          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
            <div className="text-[10px] font-black uppercase text-slate-500">
              Engajamento
            </div>

            <div className="mt-2 text-4xl font-black text-purple-300">
              88%
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              participação no Reino
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
          <h4 className="text-lg font-black text-white">
            Componentes Curriculares
          </h4>

          <div className="mt-5 space-y-4">
            {[
              ["Língua Portuguesa", 8.7],
              ["Matemática", 8.4],
              ["História", 8.9],
              ["Geografia", 9.1],
              ["Ciências", 8.3],
              ["Língua Inglesa", 8.0],
            ].map(([subject, grade]) => (
              <div key={String(subject)}>
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">
                    {subject}
                  </span>

                  <span className="font-black text-white">
                    {Number(grade).toFixed(1)}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${
                        Number(grade) * 10
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderMap() {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-emerald-800/40 bg-gradient-to-r from-emerald-950/40 to-slate-900 p-6">
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">
            Visão Institucional
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            🗺️ Mapa Acadêmico da Escola
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Panorama geral da reputação acadêmica
            do Reino.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#11150f] p-6 min-h-[420px]">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 via-slate-950 to-purple-950/20">
            <div className="text-center">
              <div className="text-7xl">
                🗺️
              </div>

              <h4 className="mt-4 text-2xl font-black text-white">
                Reino do Conhecimento
              </h4>

              <p className="mt-2 max-w-md text-xs leading-6 text-slate-500">
                O mapa institucional reunirá as
                reputações acadêmicas de todos os
                alunos, turmas e componentes
                curriculares.
              </p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["Português", "92%"],
                  ["Matemática", "88%"],
                  ["História", "91%"],
                  ["Geografia", "94%"],
                ].map(([name, value]) => (
                  <div
                    key={name}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                  >
                    <div className="text-[9px] text-slate-500">
                      {name}
                    </div>

                    <div className="mt-1 text-lg font-black text-emerald-300">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderEvents() {
    return (
      <div className="space-y-5">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-red-400">
            Poder Institucional
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            🐉 Eventos Coletivos
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Eventos criados pelo Gestor podem
            alcançar todos os alunos da escola.
          </p>
        </div>

        <div className="rounded-2xl border border-red-800/40 bg-red-950/10 p-6">
          <div className="mb-5 rounded-xl border border-amber-800/40 bg-amber-950/20 p-4">
            <div className="text-xs font-black text-amber-300">
              ⚠️ Alcance: Escola inteira
            </div>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              Este evento será independente dos
              professores tutores e poderá aparecer
              para todos os alunos.
            </p>
          </div>

          {eventCreated && (
            <div className="mb-5 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4 text-xs font-bold text-emerald-300">
              ✅ Evento criado em modo de teste.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300">
                Nome do Evento
              </label>

              <input
                value={eventTitle}
                onChange={(e) =>
                  setEventTitle(e.target.value)
                }
                placeholder="Ex: Semana da Grande Guilda"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">
                Descrição
              </label>

              <textarea
                value={eventDescription}
                onChange={(e) =>
                  setEventDescription(
                    e.target.value
                  )
                }
                placeholder="Descreva o desafio coletivo..."
                rows={4}
                className="mt-1 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">
                Recompensa Base
              </label>

              <input
                type="number"
                min="0"
                value={eventReward}
                onChange={(e) =>
                  setEventReward(e.target.value)
                }
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-red-500"
              />
            </div>

            <button
              type="button"
              onClick={createEvent}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-purple-600 px-6 py-3 text-xs font-black text-white shadow-lg transition hover:brightness-110"
            >
              🐉 Invocar Evento para Toda a Escola
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderObjectives() {
    return (
      <div className="space-y-5">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
            Conselho da Guilda
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            🎯 Objetivos Coletivos
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Objetivos institucionais destinados a
            todos os alunos.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-800/40 bg-purple-950/10 p-6">
          {objectiveCreated && (
            <div className="mb-5 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4 text-xs font-bold text-emerald-300">
              ✅ Objetivo criado em modo de teste.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300">
                Título do Objetivo
              </label>

              <input
                value={objectiveTitle}
                onChange={(e) =>
                  setObjectiveTitle(e.target.value)
                }
                placeholder="Ex: Todos pela Leitura"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">
                Descrição
              </label>

              <textarea
                value={objectiveDescription}
                onChange={(e) =>
                  setObjectiveDescription(
                    e.target.value
                  )
                }
                placeholder="Descreva o objetivo..."
                rows={4}
                className="mt-1 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="rounded-xl border border-purple-800/40 bg-purple-950/20 p-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                Destinatários
              </div>

              <div className="mt-2 text-sm font-black text-white">
                🏰 Todos os alunos da escola
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                O objetivo não depende do professor
                tutor.
              </div>
            </div>

            <button
              type="button"
              onClick={createObjective}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-xs font-black text-white shadow-lg transition hover:brightness-110"
            >
              🎯 Publicar Objetivo Escolar
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderContent() {
    switch (activeTab) {
      case "students":
        return renderStudents();

      case "teachers":
        return renderTeachers();

      case "classes":
        return renderClasses();

      case "performance":
        return renderPerformance();

      case "map":
        return renderMap();

      case "events":
        return renderEvents();

      case "objectives":
        return renderObjectives();

      case "overview":
      default:
        return renderOverview();
    }
  }

  return (
    <section className="space-y-5">
      {/* CABEÇALHO DO GESTOR */}

      <div className="rounded-3xl border border-indigo-800/50 bg-gradient-to-br from-[#171a3d] via-[#101329] to-[#080a14] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-indigo-500/60 bg-indigo-950/50 text-5xl shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                👑
              </div>

              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-indigo-500 bg-indigo-900 px-2 py-0.5 text-[8px] font-black uppercase text-indigo-200">
                Lvl 99 Gestor
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-300">
                🏰 Conselho da Guilda
              </div>

              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">
                Portal de Gestão Escolar
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Visão institucional do Reino do
                Conhecimento
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="text-[9px] font-black uppercase text-slate-500">
                Alcance
              </div>

              <div className="mt-1 text-sm font-black text-indigo-300">
                Escola inteira
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="text-[9px] font-black uppercase text-slate-500">
                Alunos
              </div>

              <div className="mt-1 text-sm font-black text-white">
                {students.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO */}

      <div className="flex flex-col lg:flex-row gap-5">
        <aside className="w-full lg:w-60 shrink-0">
          <div className="rounded-2xl border border-slate-800 bg-[#0d110c] p-3">
            <div className="px-3 pb-3 text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
              Painel do Gestor
            </div>

            <div className="space-y-1">
              {tabs.map((tab) => {
                const active =
                  activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition border ${
                      active
                        ? "border-indigo-500 bg-indigo-900/30 text-indigo-300 shadow-lg"
                        : "border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/50 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-base">
                      {tab.icon}
                    </span>

                    <span>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 border-t border-slate-800 pt-4">
              <div className="rounded-xl border border-indigo-800/40 bg-indigo-950/20 p-3">
                <div className="text-[9px] font-black uppercase tracking-wider text-indigo-400">
                  Permissão
                </div>

                <div className="mt-1 text-xs font-black text-white">
                  Administrador Escolar
                </div>

                <div className="mt-1 text-[10px] leading-5 text-slate-500">
                  Acesso global aos dados
                  institucionais.
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-slate-800 bg-[#0d110c] p-5 sm:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
}
