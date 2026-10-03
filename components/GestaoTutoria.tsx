"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
  id: string;
  name: string;
  turma?: string;
  anoLetivo?: number;
  tutorId?: string;
  tutorNome?: string;
  preferenciasTutor?: string[];
};

type Tutor = {
  id: string;
  nome: string;
  capacidadeMaxima: number;
  ativo: boolean;
};

type ElectionStatus = "aberta" | "encerrada";

type ElectionConfig = {
  anoLetivo: number;
  status: ElectionStatus;
  periodoInicio: string;
  periodoFim: string;
  maxPreferencias: number;
};

type PreferenceMap = Record<string, string[]>;

type DistributionStatus = "proposta" | "confirmado";

type Distribution = {
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorNome: string;
  preferencia: number;
  status: DistributionStatus;
  origem: "eleicao" | "manual";
};

type Props = {
  students: Student[];
  tutors: Tutor[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
};

const ANO_LETIVO_ATUAL = 2026;
const MAX_PREFERENCIAS = 4;
const MAX_TUTORADOS_PADRAO = 20;

const ELECTION_KEY = `aventureiro-eleicao-tutoria-${ANO_LETIVO_ATUAL}`;
const PREFS_KEY = `aventureiro-preferencias-tutoria-${ANO_LETIVO_ATUAL}`;
const DISTRIBUTION_KEY = `aventureiro-distribuicao-tutoria-${ANO_LETIVO_ATUAL}`;

const DEFAULT_ELECTION: ElectionConfig = {
  anoLetivo: ANO_LETIVO_ATUAL,
  status: "aberta",
  periodoInicio: "2026-01-15",
  periodoFim: "2026-02-15",
  maxPreferencias: MAX_PREFERENCIAS,
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function GestaoTutoria({
  students,
  tutors,
  setStudents,
}: Props) {
  const [config, setConfig] = useState<ElectionConfig>(
    DEFAULT_ELECTION
  );

  const [preferences, setPreferences] =
    useState<PreferenceMap>({});

  const [distributions, setDistributions] =
    useState<Distribution[]>([]);

  const [activeTab, setActiveTab] = useState<
    "configuracao" | "preferencias" | "distribuicao" | "resultado"
  >("configuracao");

  const [manualStudentId, setManualStudentId] =
    useState("");

  const [manualTutorId, setManualTutorId] =
    useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    setConfig(readStorage(ELECTION_KEY, DEFAULT_ELECTION));
    setPreferences(readStorage(PREFS_KEY, {}));
    setDistributions(readStorage(DISTRIBUTION_KEY, []));
  }, []);

  useEffect(() => {
    saveStorage(ELECTION_KEY, config);
  }, [config]);

  useEffect(() => {
    saveStorage(PREFS_KEY, preferences);
  }, [preferences]);

  useEffect(() => {
    saveStorage(DISTRIBUTION_KEY, distributions);
  }, [distributions]);

  const eligibleStudents = useMemo(
    () =>
      students.filter(
        (student) => student.anoLetivo === ANO_LETIVO_ATUAL
      ),
    [students]
  );

  const activeTutors = useMemo(
    () =>
      tutors.filter(
        (tutor) =>
          tutor.ativo &&
          tutor.capacidadeMaxima > 0
      ),
    [tutors]
  );

  const electionStudents = useMemo(
    () =>
      eligibleStudents.filter(
        (student) =>
          (preferences[student.id] || []).length > 0
      ),
    [eligibleStudents, preferences]
  );

  const confirmedDistributions = useMemo(
    () =>
      distributions.filter(
        (item) => item.status === "confirmado"
      ),
    [distributions]
  );

  const tutorCount = (tutorId: string) =>
    students.filter(
      (student) =>
        student.anoLetivo === ANO_LETIVO_ATUAL &&
        student.tutorId === tutorId
    ).length;

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 4000);
  }

  function updateConfig(
    field: "periodoInicio" | "periodoFim",
    value: string
  ) {
    setConfig((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function closeElection() {
    if (config.status === "encerrada") return;

    const totalRespondentes = electionStudents.length;

    const confirmed = window.confirm(
      `Encerrar a eleição de Professor-Tutor para ${ANO_LETIVO_ATUAL}?\\n\\n${totalRespondentes} aluno(s) já registraram preferências. Depois do encerramento, os alunos não poderão mais alterar suas escolhas.`
    );

    if (!confirmed) return;

    setConfig((current) => ({
      ...current,
      status: "encerrada",
    }));

    setActiveTab("distribuicao");
    notify(
      "🔒 Eleição encerrada. As preferências dos alunos estão bloqueadas."
    );
  }

  function openElection() {
    if (config.status === "aberta") return;

    const confirmed = window.confirm(
      "Reabrir a eleição permitirá novamente que os alunos alterem suas preferências. Essa ação deve ser usada somente antes da confirmação da distribuição."
    );

    if (!confirmed) return;

    setConfig((current) => ({
      ...current,
      status: "aberta",
    }));

    notify("🗳️ Eleição reaberta pelo Gestor.");
  }

  function calculateDistribution() {
    if (config.status !== "encerrada") {
      notify(
        "⚠️ Primeiro encerre a eleição para processar a distribuição."
      );
      return;
    }

    const occupied = new Map<string, number>();

    activeTutors.forEach((tutor) => {
      occupied.set(tutor.id, tutorCount(tutor.id));
    });

    const proposals: Distribution[] = [];

    const orderedStudents = [...eligibleStudents].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    orderedStudents.forEach((student) => {
      const prefs = preferences[student.id] || [];

      if (student.tutorId) return;

      for (let index = 0; index < prefs.length; index += 1) {
        const tutorId = prefs[index];
        const tutor = activeTutors.find(
          (item) => item.id === tutorId
        );

        if (!tutor) continue;

        const current = occupied.get(tutor.id) || 0;
        const capacity =
          tutor.capacidadeMaxima || MAX_TUTORADOS_PADRAO;

        if (current >= capacity) continue;

        occupied.set(tutor.id, current + 1);

        proposals.push({
          studentId: student.id,
          studentName: student.name,
          tutorId: tutor.id,
          tutorNome: tutor.nome,
          preferencia: index + 1,
          status: "proposta",
          origem: "eleicao",
        });

        break;
      }
    });

    setDistributions(proposals);
    setActiveTab("distribuicao");

    notify(
      `⚖️ Distribuição calculada: ${proposals.length} proposta(s).`
    );
  }

  function confirmDistribution() {
    if (config.status !== "encerrada") {
      notify("⚠️ A eleição precisa estar encerrada.");
      return;
    }

    const pending = distributions.filter(
      (item) => item.status === "proposta"
    );

    if (!pending.length) {
      notify("⚠️ Não há propostas pendentes para confirmar.");
      return;
    }

    const confirmed = window.confirm(
      `Confirmar ${pending.length} atribuição(ões) de Professor-Tutor? Depois da confirmação, elas passam a ser o vínculo oficial do aluno.`
    );

    if (!confirmed) return;

    setStudents((current) =>
      current.map((student) => {
        const distribution = pending.find(
          (item) => item.studentId === student.id
        );

        if (!distribution) return student;

        return {
          ...student,
          tutorId: distribution.tutorId,
          tutorNome: distribution.tutorNome,
        };
      })
    );

    setDistributions((current) =>
      current.map((item) =>
        item.status === "proposta"
          ? {
              ...item,
              status: "confirmado",
            }
          : item
      )
    );

    setActiveTab("resultado");
    notify(
      "🏆 Distribuição confirmada. Os vínculos de tutoria foram atualizados."
    );
  }

  function assignManualTutor() {
    const student = students.find(
      (item) => item.id === manualStudentId
    );

    const tutor = activeTutors.find(
      (item) => item.id === manualTutorId
    );

    if (!student || !tutor) {
      notify("⚠️ Selecione o aluno e o Professor-Tutor.");
      return;
    }

    if (student.tutorId) {
      notify(
        "⚠️ Este aluno já possui um Professor-Tutor."
      );
      return;
    }

    const current = tutorCount(tutor.id);
    const capacity =
      tutor.capacidadeMaxima || MAX_TUTORADOS_PADRAO;

    if (current >= capacity) {
      notify(
        `⚠️ ${tutor.nome} já atingiu o limite de ${capacity} tutorados.`
      );
      return;
    }

    setStudents((currentStudents) =>
      currentStudents.map((item) =>
        item.id === student.id
          ? {
              ...item,
              tutorId: tutor.id,
              tutorNome: tutor.nome,
            }
          : item
      )
    );

    setDistributions((current) => [
      ...current,
      {
        studentId: student.id,
        studentName: student.name,
        tutorId: tutor.id,
        tutorNome: tutor.nome,
        preferencia: 0,
        status: "confirmado",
        origem: "manual",
      },
    ]);

    setManualStudentId("");
    setManualTutorId("");

    notify(
      `➕ ${student.name} foi adicionado manualmente a ${tutor.nome}.`
    );
  }

  function removeProposal(studentId: string) {
    setDistributions((current) =>
      current.filter(
        (item) =>
          !(
            item.studentId === studentId &&
            item.status === "proposta"
          )
      )
    );

    notify("✏️ Proposta removida para ajuste manual.");
  }

  return (
    <section className="space-y-6">
      {message && (
        <div className="fixed right-5 top-5 z-50 max-w-sm rounded-2xl border border-amber-500/40 bg-[#161c14] p-4 text-xs font-black text-amber-300 shadow-2xl">
          {message}
        </div>
      )}

      <div className="rounded-3xl border border-indigo-800/50 bg-gradient-to-br from-[#1a1830] via-[#11150f] to-[#0a0d0a] p-6 shadow-2xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
              🏰 Conselho da Guilda
            </div>
            <h2 className="mt-1 text-3xl font-black text-white">
              Gestão de Tutoria
            </h2>
            <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-400">
              Organize a eleição anual, processe as quatro preferências dos
              alunos e confirme os vínculos oficiais de Professor-Tutor.
            </p>
          </div>

          <div
            className={
              config.status === "aberta"
                ? "rounded-2xl border border-emerald-500/30 bg-emerald-950/30 px-5 py-4 text-center"
                : "rounded-2xl border border-slate-600/40 bg-slate-950/50 px-5 py-4 text-center"
            }
          >
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
              Eleição {ANO_LETIVO_ATUAL}
            </div>
            <div
              className={
                config.status === "aberta"
                  ? "mt-1 text-lg font-black text-emerald-300"
                  : "mt-1 text-lg font-black text-slate-300"
              }
            >
              {config.status === "aberta"
                ? "🟢 Aberta"
                : "🔒 Encerrada"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["configuracao", "⚙️ Configuração"],
          ["preferencias", "🗳️ Preferências"],
          ["distribuicao", "⚖️ Distribuição"],
          ["resultado", "🏆 Resultado"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() =>
              setActiveTab(
                id as
                  | "configuracao"
                  | "preferencias"
                  | "distribuicao"
                  | "resultado"
              )
            }
            className={
              activeTab === id
                ? "rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-4 py-2.5 text-[10px] font-black text-indigo-300"
                : "rounded-xl border border-slate-800 bg-[#11150f] px-4 py-2.5 text-[10px] font-black text-slate-500 transition hover:text-slate-300"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "configuracao" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Início
              </div>
              <input
                type="date"
                value={config.periodoInicio}
                onChange={(event) =>
                  updateConfig("periodoInicio", event.target.value)
                }
                disabled={config.status === "encerrada"}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white outline-none"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Encerramento previsto
              </div>
              <input
                type="date"
                value={config.periodoFim}
                onChange={(event) =>
                  updateConfig("periodoFim", event.target.value)
                }
                disabled={config.status === "encerrada"}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-bold text-white outline-none"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Preferências por aluno
              </div>
              <div className="mt-2 text-3xl font-black text-indigo-300">
                {config.maxPreferencias}
              </div>
              <div className="text-[10px] text-slate-500">
                máximo permitido
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-800/40 bg-indigo-950/15 p-5">
            <div className="text-sm font-black text-white">
              🗳️ Regra anual
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              A eleição ocorre uma única vez no ano letivo. O aluno escolhe
              até quatro professores durante o período definido. O Gestor
              encerra a eleição e, depois disso, as escolhas ficam bloqueadas.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {config.status === "aberta" ? (
                <button
                  type="button"
                  onClick={closeElection}
                  className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-5 py-3 text-xs font-black text-rose-300 transition hover:bg-rose-900/30"
                >
                  🔒 Encerrar eleição
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openElection}
                  disabled={distributions.some(
                    (item) => item.status === "confirmado"
                  )}
                  className="rounded-xl border border-amber-500/40 bg-amber-950/30 px-5 py-3 text-xs font-black text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  🗳️ Reabrir antes da confirmação
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
              <div className="text-[9px] uppercase tracking-wider text-slate-500">
                Alunos elegíveis
              </div>
              <div className="mt-1 text-3xl font-black text-white">
                {eligibleStudents.length}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
              <div className="text-[9px] uppercase tracking-wider text-slate-500">
                Responderam
              </div>
              <div className="mt-1 text-3xl font-black text-indigo-300">
                {electionStudents.length}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
              <div className="text-[9px] uppercase tracking-wider text-slate-500">
                Professores ativos
              </div>
              <div className="mt-1 text-3xl font-black text-emerald-300">
                {activeTutors.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "preferencias" && (
        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
          <div className="mb-5">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
              Respostas registradas
            </div>
            <h3 className="mt-1 text-xl font-black text-white">
              Preferências dos Aventureiros
            </h3>
          </div>

          <div className="space-y-3">
            {eligibleStudents.map((student) => {
              const prefs = preferences[student.id] || [];

              return (
                <div
                  key={student.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="font-black text-white">
                        {student.name}
                      </div>
                      <div className="mt-1 text-[9px] text-slate-500">
                        {student.turma || "Sem turma"}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Array.from({
                        length: MAX_PREFERENCIAS,
                      }).map((_, index) => {
                        const tutorId = prefs[index];
                        const tutor = tutors.find(
                          (item) => item.id === tutorId
                        );

                        return (
                          <span
                            key={index}
                            className="rounded-lg border border-indigo-800/40 bg-indigo-950/30 px-3 py-2 text-[9px] font-bold text-indigo-300"
                          >
                            {index + 1}ª{" "}
                            {tutor?.nome || "Não escolhida"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {!eligibleStudents.length && (
              <div className="p-8 text-center text-xs text-slate-500">
                Nenhum aluno elegível.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "distribuicao" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/10 p-5">
            <div className="text-sm font-black text-white">
              ⚖️ Distribuição por ordem de preferência
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              O sistema tenta a 1ª, depois a 2ª, 3ª e 4ª preferência,
              respeitando a capacidade de 20 tutorados por Professor-Tutor.
              O Gestor pode remover uma proposta e fazer o vínculo manual.
            </p>

            <button
              type="button"
              onClick={calculateDistribution}
              className="mt-4 rounded-xl border border-amber-500/40 bg-amber-950/30 px-5 py-3 text-xs font-black text-amber-300 transition hover:bg-amber-900/30"
            >
              ⚖️ Calcular distribuição
            </button>
          </div>

          <div className="space-y-3">
            {distributions
              .filter((item) => item.status === "proposta")
              .map((item) => (
                <div
                  key={`${item.studentId}-${item.tutorId}`}
                  className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#11150f] p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <div className="font-black text-white">
                      {item.studentName}
                    </div>
                    <div className="mt-1 text-[10px] text-emerald-300">
                      → {item.tutorNome}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-indigo-800/40 bg-indigo-950/30 px-3 py-1.5 text-[9px] font-black text-indigo-300">
                      {item.preferencia}ª preferência
                    </span>
                    <button
                      type="button"
                      onClick={() => removeProposal(item.studentId)}
                      className="rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-1.5 text-[9px] font-black text-rose-300"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}

            {!distributions.some(
              (item) => item.status === "proposta"
            ) && (
              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-xs text-slate-500">
                Nenhuma proposta pendente. Calcule a distribuição após encerrar
                a eleição.
              </div>
            )}
          </div>

          {distributions.some(
            (item) => item.status === "proposta"
          ) && (
            <button
              type="button"
              onClick={confirmDistribution}
              className="w-full rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-5 py-3 text-xs font-black text-emerald-300 transition hover:bg-emerald-900/30"
            >
              ✅ Confirmar distribuição
            </button>
          )}

          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
            <div className="text-sm font-black text-white">
              ➕ Inclusão manual durante o ano
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Para novos alunos matriculados depois da eleição, não reabra a
              eleição. Faça a atribuição diretamente e respeite a capacidade
              máxima do Professor-Tutor.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <select
                value={manualStudentId}
                onChange={(event) =>
                  setManualStudentId(event.target.value)
                }
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs font-bold text-white outline-none"
              >
                <option value="">Selecionar novo aluno</option>
                {eligibleStudents
                  .filter((student) => !student.tutorId)
                  .map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
              </select>

              <select
                value={manualTutorId}
                onChange={(event) =>
                  setManualTutorId(event.target.value)
                }
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs font-bold text-white outline-none"
              >
                <option value="">Selecionar Professor-Tutor</option>
                {activeTutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.nome} ({tutorCount(tutor.id)}/
                    {tutor.capacidadeMaxima})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={assignManualTutor}
                className="rounded-xl border border-purple-500/40 bg-purple-950/30 px-4 py-3 text-xs font-black text-purple-300 transition hover:bg-purple-900/30"
              >
                ➕ Adicionar tutorado
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "resultado" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
              <div className="text-[9px] uppercase tracking-wider text-slate-500">
                Vínculos confirmados
              </div>
              <div className="mt-1 text-3xl font-black text-emerald-300">
                {confirmedDistributions.length}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-800/40 bg-indigo-950/20 p-5">
              <div className="text-[9px] uppercase tracking-wider text-slate-500">
                Sem tutor
              </div>
              <div className="mt-1 text-3xl font-black text-indigo-300">
                {
                  eligibleStudents.filter(
                    (student) => !student.tutorId
                  ).length
                }
              </div>
            </div>

            <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
              <div className="text-[9px] uppercase tracking-wider text-slate-500">
                Professores ativos
              </div>
              <div className="mt-1 text-3xl font-black text-amber-300">
                {activeTutors.length}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
            <h3 className="text-xl font-black text-white">
              🏆 Tutoria oficial
            </h3>

            <div className="mt-5 space-y-2">
              {eligibleStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-black text-white">
                      {student.name}
                    </div>
                    <div className="text-[9px] text-slate-500">
                      {student.turma || "Sem turma"}
                    </div>
                  </div>

                  <div
                    className={
                      student.tutorNome
                        ? "rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-[10px] font-black text-emerald-300"
                        : "rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[10px] font-black text-slate-500"
                    }
                  >
                    {student.tutorNome ||
                      "Aguardando atribuição"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
