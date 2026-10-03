"use client";

import { useMemo, useState } from "react";

/* ============================================================
   TIPOS
============================================================ */

type Student = {
  id: string;
  name: string;
  turma?: string;
  anoLetivo?: number;
  tutorId?: string;
  tutorNome?: string;
};

type Tutor = {
  id: string;
  nome: string;
  capacidadeMaxima: number;
  ativo: boolean;
};

type Preference = {
  studentId: string;
  first?: string;
  second?: string;
  third?: string;
  fourth?: string;
};

type Distribution = {
  studentId: string;
  tutorId: string;
  status: "proposta" | "confirmado";
};

type GestaoTutoriaProps = {
  students: Student[];
  tutors: Tutor[];
};

/* ============================================================
   CONSTANTES
============================================================ */

const ANO_LETIVO_ATUAL = 2026;
const CAPACIDADE_PADRAO_TUTOR = 20;

type Tab =
  | "configuracao"
  | "preferencias"
  | "distribuicao"
  | "resultado";

/* ============================================================
   COMPONENTE
============================================================ */

export default function GestaoTutoria({
  students,
  tutors,
}: GestaoTutoriaProps) {
  const [activeTab, setActiveTab] =
    useState<Tab>("configuracao");

  /* ==========================================================
     CONFIGURAÇÃO
  ========================================================== */

  const [tutoriaAberta, setTutoriaAberta] =
    useState(true);

  const [maxPreferencias, setMaxPreferencias] =
    useState(4);

  const [periodoInicio, setPeriodoInicio] =
    useState("2026-01-15");

  const [periodoFim, setPeriodoFim] =
    useState("2026-02-15");

  const [configSaved, setConfigSaved] =
    useState(false);

  /* ==========================================================
     PREFERÊNCIAS
  ========================================================== */

  const [preferences, setPreferences] =
    useState<Preference[]>([]);

  const [preferenceSearch, setPreferenceSearch] =
    useState("");

  const [preferenceClassFilter, setPreferenceClassFilter] =
    useState("Todas");

  /* ==========================================================
     DISTRIBUIÇÃO
  ========================================================== */

  const [distributions, setDistributions] =
    useState<Distribution[]>([]);

  const [distributionGenerated, setDistributionGenerated] =
    useState(false);

  const [distributionConfirmed, setDistributionConfirmed] =
    useState(false);

  const [
    selectedStudentForDistribution,
    setSelectedStudentForDistribution,
  ] = useState<string | null>(null);

  /* ==========================================================
     ALUNOS E TUTORES ATUAIS
  ========================================================== */

  const eligibleStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.anoLetivo === ANO_LETIVO_ATUAL
    );
  }, [students]);

  const activeTutors = useMemo(() => {
    return tutors.filter(
      (tutor) => tutor.ativo
    );
  }, [tutors]);

  const classes = useMemo(() => {
    const unique = Array.from(
      new Set(
        eligibleStudents.map(
          (student) =>
            student.turma || "Sem Turma"
        )
      )
    );

    return unique.sort((a, b) =>
      a.localeCompare(b)
    );
  }, [eligibleStudents]);

  /* ==========================================================
     ALUNOS FILTRADOS
  ========================================================== */

  const filteredPreferenceStudents =
    useMemo(() => {
      const normalizedSearch =
        preferenceSearch
          .trim()
          .toLowerCase();

      return eligibleStudents.filter(
        (student) => {
          const matchesSearch =
            !normalizedSearch ||
            student.name
              .toLowerCase()
              .includes(normalizedSearch);

          const matchesClass =
            preferenceClassFilter ===
              "Todas" ||
            (student.turma ||
              "Sem Turma") ===
              preferenceClassFilter;

          return (
            matchesSearch &&
            matchesClass
          );
        }
      );
    }, [
      eligibleStudents,
      preferenceSearch,
      preferenceClassFilter,
    ]);

  /* ==========================================================
     FUNÇÕES DE PREFERÊNCIA
  ========================================================== */

  function getPreference(
    studentId: string
  ): Preference {
    return (
      preferences.find(
        (preference) =>
          preference.studentId ===
          studentId
      ) || {
        studentId,
      }
    );
  }

  function updatePreference(
    studentId: string,
    position:
      | "first"
      | "second"
      | "third"
      | "fourth",
    tutorId: string
  ) {
    setPreferences((current) => {
      const existing =
        current.find(
          (preference) =>
            preference.studentId ===
            studentId
        );

      if (!existing) {
        return [
          ...current,
          {
            studentId,
            [position]:
              tutorId || undefined,
          },
        ];
      }

      return current.map(
        (preference) =>
          preference.studentId ===
          studentId
            ? {
                ...preference,
                [position]:
                  tutorId || undefined,
              }
            : preference
      );
    });

    setDistributionGenerated(false);
    setDistributionConfirmed(false);
  }

  /* ==========================================================
     ESTATÍSTICAS DAS PREFERÊNCIAS
  ========================================================== */

  const studentsWithPreferences =
    useMemo(() => {
      return eligibleStudents.filter(
        (student) => {
          const preference =
            getPreference(student.id);

          return Boolean(
            preference.first ||
              preference.second ||
              preference.third ||
              preference.fourth
          );
        }
      ).length;
    }, [
      eligibleStudents,
      preferences,
    ]);

  const studentsWithoutPreferences =
    eligibleStudents.length -
    studentsWithPreferences;

  /* ==========================================================
     CONTAGEM DE PREFERÊNCIAS POR TUTOR
  ========================================================== */

  const preferenceCounts = useMemo(() => {
    const counts: Record<
      string,
      {
        first: number;
        total: number;
      }
    > = {};

    activeTutors.forEach((tutor) => {
      counts[tutor.id] = {
        first: 0,
        total: 0,
      };
    });

    preferences.forEach((preference) => {
      if (
        preference.first &&
        counts[preference.first]
      ) {
        counts[preference.first].first++;
        counts[preference.first].total++;
      }

      if (
        preference.second &&
        counts[preference.second]
      ) {
        counts[preference.second].total++;
      }

      if (
        preference.third &&
        counts[preference.third]
      ) {
        counts[preference.third].total++;
      }

      if (
        preference.fourth &&
        counts[preference.fourth]
      ) {
        counts[preference.fourth].total++;
      }
    });

    return counts;
  }, [
    preferences,
    activeTutors,
  ]);

  /* ==========================================================
     DISTRIBUIÇÃO
     
     Regra:
     1ª preferência primeiro.
     Depois 2ª.
     Depois 3ª.
     Depois 4ª.

     A distribuição respeita a capacidade máxima
     definida para cada Professor-Tutor.
  ========================================================== */

  function generateDistribution() {
    const newDistribution: Distribution[] = [];

    const occupied: Record<
      string,
      number
    > = {};

    activeTutors.forEach((tutor) => {
      occupied[tutor.id] =
        tutor.capacidadeMaxima ||
        CAPACIDADE_PADRAO_TUTOR;
    });

    const currentOccupied: Record<
      string,
      number
    > = {};

    activeTutors.forEach((tutor) => {
      currentOccupied[tutor.id] = 0;
    });

    const orderedStudents = [
      ...eligibleStudents,
    ];

    orderedStudents.forEach((student) => {
      const preference =
        getPreference(student.id);

      const options = [
        preference.first,
        preference.second,
        preference.third,
        preference.fourth,
      ].filter(
        (value): value is string =>
          Boolean(value)
      );

      let assignedTutor:
        | string
        | undefined;

      for (const tutorId of options) {
        const tutor =
          activeTutors.find(
            (item) =>
              item.id === tutorId
          );

        if (!tutor) continue;

        const capacidade =
          tutor.capacidadeMaxima ||
          CAPACIDADE_PADRAO_TUTOR;

        if (
          currentOccupied[tutorId] <
          capacidade
        ) {
          assignedTutor = tutorId;
          break;
        }
      }

      if (assignedTutor) {
        currentOccupied[assignedTutor]++;

        newDistribution.push({
          studentId:
            student.id,
          tutorId:
            assignedTutor,
          status: "proposta",
        });
      }
    });

    setDistributions(
      newDistribution
    );

    setDistributionGenerated(true);
    setDistributionConfirmed(false);
  }

  /* ==========================================================
     DISTRIBUIÇÃO ATUAL DO ALUNO
  ========================================================== */

  function getDistribution(
    studentId: string
  ) {
    return distributions.find(
      (distribution) =>
        distribution.studentId ===
        studentId
    );
  }

  /* ==========================================================
     ALTERAÇÃO MANUAL PELO GESTOR
  ========================================================== */

  function manuallyAssignTutor(
    studentId: string,
    tutorId: string
  ) {
    const tutor =
      activeTutors.find(
        (item) =>
          item.id === tutorId
      );

    if (!tutor) return;

    const capacidade =
      tutor.capacidadeMaxima ||
      CAPACIDADE_PADRAO_TUTOR;

    const currentCount =
      distributions.filter(
        (distribution) =>
          distribution.tutorId ===
            tutorId &&
          distribution.studentId !==
            studentId
      ).length;

    if (
      currentCount >= capacidade
    ) {
      return;
    }

    setDistributions((current) => {
      const exists =
        current.some(
          (distribution) =>
            distribution.studentId ===
            studentId
        );

      if (exists) {
        return current.map(
          (distribution) =>
            distribution.studentId ===
            studentId
              ? {
                  ...distribution,
                  tutorId,
                  status:
                    "proposta",
                }
              : distribution
        );
      }

      return [
        ...current,
        {
          studentId,
          tutorId,
          status:
            "proposta",
        },
      ];
    });

    setDistributionConfirmed(false);
  }

  /* ==========================================================
     CONFIRMAR DISTRIBUIÇÃO
  ========================================================== */

  function confirmDistribution() {
    if (
      !distributionGenerated ||
      distributions.length === 0
    ) {
      return;
    }

    setDistributions((current) =>
      current.map(
        (distribution) => ({
          ...distribution,
          status:
            "confirmado",
        })
      )
    );

    setDistributionConfirmed(true);
  }

  /* ==========================================================
     SALVAR CONFIGURAÇÃO
  ========================================================== */

  function saveConfiguration() {
    setConfigSaved(true);

    setTimeout(() => {
      setConfigSaved(false);
    }, 3000);
  }

  /* ==========================================================
     CONTAGEM DE TUTORADOS
  ========================================================== */

  function getAssignedCount(
    tutorId: string
  ) {
    return distributions.filter(
      (distribution) =>
        distribution.tutorId ===
        tutorId
    ).length;
  }

  /* ==========================================================
     ALUNOS SEM DISTRIBUIÇÃO
  ========================================================== */

  const studentsWithoutDistribution =
    eligibleStudents.filter(
      (student) =>
        !getDistribution(student.id)
    );

  /* ==========================================================
     RENDER — CONFIGURAÇÃO
  ========================================================== */

  function renderConfiguracao() {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">
            🏰 Conselho da Guilda
          </div>

          <h2 className="mt-1 text-2xl font-black text-white">
            Configuração da Tutoria
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Defina as regras da escolha de
            Professores-Tutores para o ano
            letivo.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-black text-white">
                Período de escolha
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                Os alunos poderão registrar suas
                preferências durante o período
                definido.
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setTutoriaAberta(
                  (value) => !value
                )
              }
              className={`rounded-xl border px-4 py-2 text-[10px] font-black ${
                tutoriaAberta
                  ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                  : "border-rose-500/40 bg-rose-950/40 text-rose-300"
              }`}
            >
              {tutoriaAberta
                ? "● ABERTA"
                : "● FECHADA"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Ano letivo
            </label>

            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-black text-white">
              {ANO_LETIVO_ATUAL}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Máximo de preferências
            </label>

            <select
              value={maxPreferencias}
              onChange={(event) =>
                setMaxPreferencias(
                  Number(
                    event.target.value
                  )
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none"
            >
              <option value={1}>
                1 preferência
              </option>

              <option value={2}>
                2 preferências
              </option>

              <option value={3}>
                3 preferências
              </option>

              <option value={4}>
                4 preferências
              </option>
            </select>

            <div className="mt-2 text-[9px] text-slate-600">
              Padrão atual: 4 preferências.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-800/30 bg-amber-950/10 p-5">
          <div className="text-[10px] font-black uppercase tracking-wider text-amber-500">
            Capacidade dos Professores-Tutores
          </div>

          <div className="mt-2 text-xs text-slate-500">
            O limite recomendado para cada
            Professor-Tutor é de até{" "}
            <span className="font-black text-amber-300">
              {CAPACIDADE_PADRAO_TUTOR}
            </span>{" "}
            tutorandos.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Período de escolha
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500">
                Início
              </label>

              <input
                type="date"
                value={periodoInicio}
                onChange={(event) =>
                  setPeriodoInicio(
                    event.target.value
                  )
                }
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500">
                Encerramento
              </label>

              <input
                type="date"
                value={periodoFim}
                onChange={(event) =>
                  setPeriodoFim(
                    event.target.value
                  )
                }
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Professores-Tutores participantes
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tutors.map((tutor) => {
              const assigned =
                getAssignedCount(
                  tutor.id
                );

              const capacidade =
                tutor.capacidadeMaxima ||
                CAPACIDADE_PADRAO_TUTOR;

              return (
                <div
                  key={tutor.id}
                  className="rounded-2xl border border-slate-800 bg-[#11150f] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-white">
                        {tutor.nome}
                      </div>

                      <div className="mt-1 text-[10px] text-slate-500">
                        Capacidade:{" "}
                        {capacidade}
                      </div>
                    </div>

                    <span
                      className={`rounded-lg border px-2 py-1 text-[9px] font-black ${
                        tutor.ativo
                          ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-300"
                          : "border-rose-500/30 bg-rose-950/30 text-rose-300"
                      }`}
                    >
                      {tutor.ativo
                        ? "ATIVO"
                        : "INATIVO"}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${Math.min(
                          100,
                          capacidade
                            ? (assigned /
                                capacidade) *
                                100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500">
                    {assigned} /{" "}
                    {capacidade} vagas ocupadas
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={saveConfiguration}
          className="rounded-xl border border-amber-500/40 bg-amber-600/20 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-amber-300 transition hover:bg-amber-600/30"
        >
          💾 Salvar configuração
        </button>

        {configSaved && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-[10px] font-bold text-emerald-300">
            ✓ Configuração salva no protótipo.
          </div>
        )}
      </div>
    );
  }

  /* ==========================================================
     RENDER — PREFERÊNCIAS
  ========================================================== */

  function renderPreferencias() {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">
            📜 Livro das Preferências
          </div>

          <h2 className="mt-1 text-2xl font-black text-white">
            Preferências dos Alunos
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Visualização administrativa das
            escolhas de Professor-Tutor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Responderam
            </div>

            <div className="mt-2 text-3xl font-black text-emerald-300">
              {studentsWithPreferences}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Sem preferência
            </div>

            <div className="mt-2 text-3xl font-black text-amber-300">
              {studentsWithoutPreferences}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Total de alunos
            </div>

            <div className="mt-2 text-3xl font-black text-purple-300">
              {eligibleStudents.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="🔎 Procurar aluno..."
            value={preferenceSearch}
            onChange={(event) =>
              setPreferenceSearch(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-800 bg-[#11150f] px-4 py-3 text-xs text-white outline-none placeholder:text-slate-600"
          />

          <select
            value={preferenceClassFilter}
            onChange={(event) =>
              setPreferenceClassFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-800 bg-[#11150f] px-4 py-3 text-xs text-white outline-none"
          >
            <option value="Todas">
              Todas as turmas
            </option>

            {classes.map((turma) => (
              <option
                key={turma}
                value={turma}
              >
                {turma}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#11150f]">
          <table className="w-full min-w-[1150px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Aluno
                </th>

                <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Turma
                </th>

                <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-wider text-slate-500">
                  1ª preferência
                </th>

                <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-wider text-slate-500">
                  2ª preferência
                </th>

                <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-wider text-slate-500">
                  3ª preferência
                </th>

                <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-wider text-slate-500">
                  4ª preferência
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPreferenceStudents.map(
                (student) => {
                  const preference =
                    getPreference(
                      student.id
                    );

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-slate-900"
                    >
                      <td className="px-4 py-4">
                        <div className="font-bold text-white">
                          {student.name}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-400">
                        {student.turma ||
                          "Sem Turma"}
                      </td>

                      {(
                        [
                          "first",
                          "second",
                          "third",
                          "fourth",
                        ] as const
                      ).map(
                        (position) => {
                          const preferenceNumber =
                            position ===
                            "first"
                              ? 1
                              : position ===
                                "second"
                              ? 2
                              : position ===
                                "third"
                              ? 3
                              : 4;

                          return (
                            <td
                              key={position}
                              className="px-4 py-4"
                            >
                              <select
                                value={
                                  preference[
                                    position
                                  ] || ""
                                }
                                onChange={(
                                  event
                                ) =>
                                  updatePreference(
                                    student.id,
                                    position,
                                    event
                                      .target
                                      .value
                                  )
                                }
                                disabled={
                                  preferenceNumber >
                                  maxPreferencias
                                }
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] text-white outline-none disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <option value="">
                                  Não escolhida
                                </option>

                                {activeTutors.map(
                                  (
                                    tutor
                                  ) => (
                                    <option
                                      key={
                                        tutor.id
                                      }
                                      value={
                                        tutor.id
                                      }
                                    >
                                      {
                                        tutor.nome
                                      }
                                    </option>
                                  )
                                )}
                              </select>
                            </td>
                          );
                        }
                      )}
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-[10px] text-slate-500">
          ℹ️ Cada aluno poderá registrar até{" "}
          <span className="font-black text-amber-300">
            {maxPreferencias}
          </span>{" "}
          preferências de Professor-Tutor.
          A distribuição definitiva depende da
          capacidade dos tutores e da confirmação
          da gestão.
        </div>
      </div>
    );
  }

  /* ==========================================================
     RENDER — DISTRIBUIÇÃO
  ========================================================== */

  function renderDistribuicao() {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">
            ⚔️ Câmara de Distribuição
          </div>

          <h2 className="mt-1 text-2xl font-black text-white">
            Distribuição dos Tutorandos
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Gere uma proposta de distribuição
            a partir das preferências registradas.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-black text-white">
                Proposta de distribuição
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                O sistema tenta atender a 1ª,
                depois a 2ª, 3ª e 4ª preferência
                dentro das vagas disponíveis.
              </div>
            </div>

            <button
              type="button"
              onClick={
                generateDistribution
              }
              className="rounded-xl border border-amber-500/40 bg-amber-600/20 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-amber-300 hover:bg-amber-600/30"
            >
              ⚔️ Gerar distribuição
            </button>
          </div>
        </div>

        {!distributionGenerated ? (
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-10 text-center">
            <div className="text-5xl">
              🗺️
            </div>

            <h3 className="mt-3 font-black text-white">
              Nenhuma distribuição gerada
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Registre as preferências e
              gere uma proposta.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeTutors.map(
                (tutor) => {
                  const assigned =
                    distributions.filter(
                      (
                        distribution
                      ) =>
                        distribution.tutorId ===
                        tutor.id
                    );

                  const firstChoices =
                    preferenceCounts[
                      tutor.id
                    ]?.first || 0;

                  const capacidade =
                    tutor.capacidadeMaxima ||
                    CAPACIDADE_PADRAO_TUTOR;

                  return (
                    <div
                      key={tutor.id}
                      className="rounded-2xl border border-slate-800 bg-[#11150f] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-black text-white">
                            {tutor.nome}
                          </div>

                          <div className="mt-1 text-[10px] text-slate-500">
                            {firstChoices}{" "}
                            primeira(s)
                            preferência(s)
                          </div>
                        </div>

                        <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-2 py-1 text-[9px] font-black text-amber-300">
                          {
                            assigned.length
                          }{" "}
                          /{" "}
                          {capacidade}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {assigned.length ===
                        0 ? (
                          <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-3 text-[10px] text-slate-600">
                            Nenhum tutorando
                            atribuído.
                          </div>
                        ) : (
                          assigned.map(
                            (
                              distribution
                            ) => {
                              const student =
                                eligibleStudents.find(
                                  (
                                    item
                                  ) =>
                                    item.id ===
                                    distribution.studentId
                                );

                              if (!student)
                                return null;

                              return (
                                <div
                                  key={
                                    distribution.studentId
                                  }
                                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
                                >
                                  <div>
                                    <div className="text-[10px] font-bold text-white">
                                      {
                                        student.name
                                      }
                                    </div>

                                    <div className="text-[9px] text-slate-600">
                                      {
                                        student.turma
                                      }
                                    </div>
                                  </div>

                                  <span className="text-[9px] text-emerald-400">
                                    {distribution.status ===
                                    "confirmado"
                                      ? "✓"
                                      : "Proposta"}
                                  </span>
                                </div>
                              );
                            }
                          )
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {studentsWithoutDistribution.length >
              0 && (
              <div className="rounded-2xl border border-rose-800/40 bg-rose-950/20 p-5">
                <div className="font-black text-rose-300">
                  ⚠️ Alunos sem distribuição
                </div>

                <div className="mt-3 space-y-2">
                  {studentsWithoutDistribution.map(
                    (student) => (
                      <div
                        key={student.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-rose-900/30 bg-slate-950/30 p-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">
                            {student.name}
                          </div>

                          <div className="text-[9px] text-slate-500">
                            {student.turma ||
                              "Sem Turma"}
                          </div>
                        </div>

                        <select
                          value={
                            selectedStudentForDistribution ===
                            student.id
                              ? getDistribution(
                                  student.id
                                )
                                  ?.tutorId ||
                                ""
                              : ""
                          }
                          onChange={(event) => {
                            setSelectedStudentForDistribution(
                              student.id
                            );

                            if (
                              event.target
                                .value
                            ) {
                              manuallyAssignTutor(
                                student.id,
                                event
                                  .target
                                  .value
                              );
                            }
                          }}
                          className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] text-white"
                        >
                          <option value="">
                            Escolher tutor
                          </option>

                          {activeTutors.map(
                            (tutor) => {
                              const count =
                                getAssignedCount(
                                  tutor.id
                                );

                              const capacidade =
                                tutor.capacidadeMaxima ||
                                CAPACIDADE_PADRAO_TUTOR;

                              return (
                                <option
                                  key={
                                    tutor.id
                                  }
                                  value={
                                    tutor.id
                                  }
                                  disabled={
                                    count >=
                                    capacidade
                                  }
                                >
                                  {
                                    tutor.nome
                                  }{" "}
                                  ({count}/
                                  {
                                    capacidade
                                  })
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-black text-white">
                    Confirmar distribuição
                  </div>

                  <div className="mt-1 text-[10px] text-slate-500">
                    Depois de confirmada, a
                    distribuição passa a ser
                    considerada definitiva.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    confirmDistribution
                  }
                  disabled={
                    distributionConfirmed
                  }
                  className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {distributionConfirmed
                    ? "✓ Distribuição confirmada"
                    : "👑 Confirmar distribuição"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ==========================================================
     RENDER — RESULTADO
  ========================================================== */

  function renderResultado() {
    const confirmed =
      distributions.filter(
        (distribution) =>
          distribution.status ===
          "confirmado"
      );

    return (
      <div className="space-y-6">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">
            👑 Registro Real
          </div>

          <h2 className="mt-1 text-2xl font-black text-white">
            Resultado da Tutoria
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Relação definitiva entre
            Professores-Tutores e seus
            tutorandos.
          </p>
        </div>

        {!distributionConfirmed ? (
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-10 text-center">
            <div className="text-5xl">
              📜
            </div>

            <h3 className="mt-3 font-black text-white">
              Distribuição ainda não
              confirmada
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Confirme a distribuição na aba
              correspondente para gerar o
              resultado definitivo.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                ✓ Tutoria confirmada
              </div>

              <div className="mt-1 text-sm font-black text-white">
                Ano letivo {ANO_LETIVO_ATUAL}
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                {confirmed.length} aluno(s)
                distribuído(s).
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeTutors.map(
                (tutor) => {
                  const tutorStudents =
                    confirmed.filter(
                      (
                        distribution
                      ) =>
                        distribution.tutorId ===
                        tutor.id
                    );

                  return (
                    <div
                      key={tutor.id}
                      className="rounded-2xl border border-slate-800 bg-[#11150f] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-black text-white">
                            {tutor.nome}
                          </div>

                          <div className="mt-1 text-[10px] text-slate-500">
                            Professor-Tutor
                          </div>
                        </div>

                        <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-2 py-1 text-[9px] font-black text-amber-300">
                          {
                            tutorStudents.length
                          }{" "}
                          tutorando(s)
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {tutorStudents.map(
                          (
                            distribution
                          ) => {
                            const student =
                              eligibleStudents.find(
                                (
                                  item
                                ) =>
                                  item.id ===
                                  distribution.studentId
                              );

                            if (!student)
                              return null;

                            return (
                              <div
                                key={
                                  student.id
                                }
                                className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                              >
                                <div className="font-bold text-white">
                                  {
                                    student.name
                                  }
                                </div>

                                <div className="mt-1 text-[9px] text-slate-500">
                                  {student.turma ||
                                    "Sem Turma"}
                                </div>
                              </div>
                            );
                          }
                        )}

                        {tutorStudents.length ===
                          0 && (
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-center text-[10px] text-slate-600">
                            Nenhum tutorando
                            atribuído.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  /* ==========================================================
     RENDER PRINCIPAL
  ========================================================== */

  return (
    <section className="space-y-6">
      {/* CABEÇALHO */}

      <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#1b1e17] via-[#11150f] to-[#0a0d0a] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">
              🏰 Administração do Reino
            </div>

            <h1 className="mt-1 text-3xl font-black text-white">
              Gestão de Tutoria
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Organize as preferências dos
              alunos, distribua os tutorandos
              entre os Professores-Tutores e
              confirme a composição da tutoria.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 px-5 py-4">
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
              Ano letivo
            </div>

            <div className="mt-1 text-2xl font-black text-amber-300">
              {ANO_LETIVO_ATUAL}
            </div>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "configuracao"
            )
          }
          className={`rounded-xl border px-3 py-3 text-[10px] font-black transition ${
            activeTab ===
            "configuracao"
              ? "border-amber-500/40 bg-amber-950/40 text-amber-300"
              : "border-slate-800 bg-[#11150f] text-slate-500 hover:text-white"
          }`}
        >
          ⚙️ Configuração
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "preferencias"
            )
          }
          className={`rounded-xl border px-3 py-3 text-[10px] font-black transition ${
            activeTab ===
            "preferencias"
              ? "border-amber-500/40 bg-amber-950/40 text-amber-300"
              : "border-slate-800 bg-[#11150f] text-slate-500 hover:text-white"
          }`}
        >
          📜 Preferências
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "distribuicao"
            )
          }
          className={`rounded-xl border px-3 py-3 text-[10px] font-black transition ${
            activeTab ===
            "distribuicao"
              ? "border-amber-500/40 bg-amber-950/40 text-amber-300"
              : "border-slate-800 bg-[#11150f] text-slate-500 hover:text-white"
          }`}
        >
          ⚔️ Distribuição
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "resultado"
            )
          }
          className={`rounded-xl border px-3 py-3 text-[10px] font-black transition ${
            activeTab ===
            "resultado"
              ? "border-amber-500/40 bg-amber-950/40 text-amber-300"
              : "border-slate-800 bg-[#11150f] text-slate-500 hover:text-white"
          }`}
        >
          👑 Resultado
        </button>
      </div>

      {/* CONTEÚDO */}

      {activeTab ===
        "configuracao" &&
        renderConfiguracao()}

      {activeTab ===
        "preferencias" &&
        renderPreferencias()}

      {activeTab ===
        "distribuicao" &&
        renderDistribuicao()}

      {activeTab ===
        "resultado" &&
        renderResultado()}
    </section>
  );
}