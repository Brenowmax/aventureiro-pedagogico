"use client";

import { useMemo, useState } from "react";
import CalendarioGuilda from "@/components/CalendarioGuilda";

type Student = {
  id: string;
  name: string;
  turma?: string;
  level?: number;
  xp?: number;
  coins?: number;
  badge?: string;
  avatar?: string;
  grades?: Record<string, [string, string, string, string]>;

  // DADOS DO ANO LETIVO
  anoLetivo?: number;

  // TUTOR ATUAL
  tutorId?: string;
  tutorNome?: string;
};

type Tutor = {
  id: string;
  nome: string;
  capacidadeMaxima: number;
  ativo: boolean;
};

type ManagerPanelProps = {
  students: Student[];
  tutors: Tutor[];
};

type ManagerTab =
  | "overview"
  | "students"
  | "teachers"
  | "classes"
  | "performance"
  | "map"
  | "events"
  | "objectives"
  | "calendar";

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
  {
    id: "calendar",
    icon: "📅",
    label: "Calendário da Guilda",
    group: "Acadêmico",
  },
];

const mockTeachers = [
  {
    id: "p1",
    name: "Professor(a) Arcano",
    email: "arcano@escola.edu.br",
    subjects: ["Língua Portuguesa"],
    studentIds: ["s1"],
    classes: ["9º Ano A"],
    status: "Ativo",
  },
  {
    id: "p2",
    name: "Mestre das Letras",
    email: "letras@escola.edu.br",
    subjects: ["Língua Inglesa"],
    studentIds: ["s2"],
    classes: ["9º Ano A"],
    status: "Ativo",
  },
  {
    id: "p3",
    name: "Guardião dos Números",
    email: "numeros@escola.edu.br",
    subjects: ["Matemática"],
    studentIds: ["s3"],
    classes: ["9º Ano A"],
    status: "Ativo",
  },
  {
    id: "p4",
    name: "Cartógrafo do Reino",
    email: "cartografo@escola.edu.br",
    subjects: ["Geografia", "História"],
    studentIds: ["s4"],
    classes: ["9º Ano A"],
    status: "Ativo",
  },
  {
    id: "p5",
    name: "Mestre das Ciências",
    email: "ciencias@escola.edu.br",
    subjects: ["Ciências"],
    studentIds: [],
    classes: [],
    status: "Ativo",
  },
  {
    id: "p6",
    name: "Mentor das Artes",
    email: "artes@escola.edu.br",
    subjects: ["Artes", "Educação Física"],
    studentIds: [],
    classes: [],
    status: "Ativo",
  },
];

const subjects = [
  "Língua Portuguesa",
  "Língua Inglesa",
  "Matemática",
  "História",
  "Geografia",
  "Educação Física",
  "Artes",
  "Ciências",
  "Projeto de Vida",
  "Tecnologia",
  "Educação Financeira",
  "Robótica",
  "Orientação de Estudos de Português",
  "Orientação de Estudos de Matemática",
];

function gradeToNumber(value: string) {
  const parsed = Number(
    String(value).replace(",", ".").trim()
  );

  return Number.isFinite(parsed) ? parsed : null;
}

function getStudentAverage(student: Student) {
  const values: number[] = [];

  Object.values(student.grades || {}).forEach(
    (grades) => {
      grades.forEach((grade) => {
        const value = gradeToNumber(grade);

        if (value !== null) {
          values.push(value);
        }
      });
    }
  );

  if (!values.length) return null;

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
}

function getPerformanceLabel(
  average: number | null
) {
  if (average === null) return "Sem dados";

  if (average >= 9) return "Avançado";
  if (average >= 7) return "Adequado";
  if (average >= 5) return "Básico";

  return "Abaixo do Básico";
}

export default function ManagerPanel({
  students,
  tutors = [],
}: ManagerPanelProps) {

  const [activeTab, setActiveTab] =
    useState<ManagerTab>("overview");

  const [studentSearch, setStudentSearch] = useState("");
  const [studentClassFilter, setStudentClassFilter] =
    useState("Todas");

  const [selectedStudentId, setSelectedStudentId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [classFilter, setClassFilter] =
    useState("Todas");

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

  /*
   ============================================================
   CONFIGURAÇÃO DOS TUTORES
   ============================================================
  */

  const [tutorConfigs, setTutorConfigs] =
    useState<Tutor[]>(tutors);

  function getTutorConfig(
    teacherId: string
  ): Tutor | undefined {
    return tutorConfigs.find(
      (tutor) => tutor.id === teacherId
    );
  }

  function updateTutorCapacity(
    teacherId: string,
    value: number
  ) {
    const capacity = Math.max(
      0,
      Math.floor(value)
    );

    setTutorConfigs((current) =>
      current.map((tutor) =>
        tutor.id === teacherId
          ? {
              ...tutor,
              capacidadeMaxima: capacity,
            }
          : tutor
      )
    );
  }

  function toggleTutor(
    teacherId: string
  ) {
    setTutorConfigs((current) =>
      current.map((tutor) =>
        tutor.id === teacherId
          ? {
              ...tutor,
              ativo: !tutor.ativo,
            }
          : tutor
      )
    );
  }

  /*
   ============================================================
   TURMAS
   ============================================================
  */

  const classes = useMemo(() => {
    const grouped = new Map<string, number>();

    students.forEach((student) => {
      const turma = student.turma || "Sem Turma";

      grouped.set(
        turma,
        (grouped.get(turma) || 0) + 1
      );
    });

    return Array.from(grouped.entries())
      .map(([name, total]) => ({
        name,
        total,
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [students]);

  /*
   ============================================================
   ALUNOS FILTRADOS
   ============================================================
  */

  const filteredStudents = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !normalizedSearch ||
        student.name
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesClass =
        classFilter === "Todas" ||
        (student.turma || "Sem Turma") ===
          classFilter;

      return matchesSearch && matchesClass;
    });
  }, [students, search, classFilter]);

  /*
   ============================================================
   TUTORADOS DO ANO LETIVO
   ============================================================
  */

  function getTutorStudents(
    tutorId: string
  ): Student[] {
    return students.filter(
      (student) =>
        student.anoLetivo === 2026 &&
        student.tutorId === tutorId
    );
  }

  /*
   ============================================================
   ALUNO SELECIONADO
   ============================================================
  */

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;

    return (
      students.find(
        (student) =>
          student.id === selectedStudentId
      ) || null
    );
  }, [students, selectedStudentId]);

  /*
   ============================================================
   ESTATÍSTICAS
   ============================================================
  */

  const averageLevel = useMemo(() => {
    if (!students.length) return 0;

    const total = students.reduce(
      (sum, student) =>
        sum + (Number(student.level) || 0),
      0
    );

    return Math.round(
      (total / students.length) * 10
    ) / 10;
  }, [students]);

  const totalXP = useMemo(() => {
    return students.reduce(
      (sum, student) =>
        sum + (Number(student.xp) || 0),
      0
    );
  }, [students]);

  const totalCoins = useMemo(() => {
    return students.reduce(
      (sum, student) =>
        sum + (Number(student.coins) || 0),
      0
    );
  }, [students]);

  const studentsWithGrades = useMemo(() => {
    return students.filter(
      (student) =>
        getStudentAverage(student) !== null
    );
  }, [students]);

  const schoolAverage = useMemo(() => {
    const averages = students
      .map(getStudentAverage)
      .filter(
        (value): value is number =>
          value !== null
      );

    if (!averages.length) return null;

    return (
      averages.reduce(
        (sum, value) => sum + value,
        0
      ) / averages.length
    );
  }, [students]);

  const advancedStudents = useMemo(() => {
    return students.filter((student) => {
      const average = getStudentAverage(student);

      return average !== null && average >= 9;
    }).length;
  }, [students]);

  const adequateStudents = useMemo(() => {
    return students.filter((student) => {
      const average = getStudentAverage(student);

      return (
        average !== null &&
        average >= 7 &&
        average < 9
      );
    }).length;
  }, [students]);

  const basicStudents = useMemo(() => {
    return students.filter((student) => {
      const average = getStudentAverage(student);

      return (
        average !== null &&
        average >= 5 &&
        average < 7
      );
    }).length;
  }, [students]);

  const belowBasicStudents = useMemo(() => {
    return students.filter((student) => {
      const average = getStudentAverage(student);

      return (
        average !== null &&
        average < 5
      );
    }).length;
  }, [students]);

  /*
   ============================================================
   EVENTOS
   ============================================================
  */

  function createEvent() {
    if (!eventTitle.trim()) return;

    setEventCreated(true);

    setEventTitle("");
    setEventDescription("");
    setEventReward("100");
  }

  /*
   ============================================================
   OBJETIVOS
   ============================================================
  */

  function createObjective() {
    if (!objectiveTitle.trim()) return;

    setObjectiveCreated(true);

    setObjectiveTitle("");
    setObjectiveDescription("");
  }

  /*
   ============================================================
   VISÃO GERAL
   ============================================================
  */

  function renderOverview() {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
            Conselho da Guilda
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            Visão Geral da Escola
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Painel administrativo com visão global
            dos dados atualmente disponíveis.
          </p>
        </div>

        <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-[10px] text-amber-300">
          ⚠️ Modo de demonstração — os dados
          apresentados atualmente são provenientes
          dos alunos de teste do aplicativo.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
            <div className="text-2xl">👥</div>

            <div className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Alunos
            </div>

            <div className="mt-1 text-3xl font-black text-white">
              {students.length}
            </div>

            <div className="mt-1 text-[10px] text-purple-300">
              cadastrados no protótipo
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
            <div className="text-2xl">⭐</div>

            <div className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Nível Médio
            </div>

            <div className="mt-1 text-3xl font-black text-white">
              {averageLevel}
            </div>

            <div className="mt-1 text-[10px] text-emerald-300">
              média dos aventureiros
            </div>
          </div>

          <div className="rounded-2xl border border-blue-800/40 bg-blue-950/20 p-5">
            <div className="text-2xl">⚡</div>

            <div className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              XP Coletivo
            </div>

            <div className="mt-1 text-3xl font-black text-white">
              {totalXP.toLocaleString("pt-BR")}
            </div>

            <div className="mt-1 text-[10px] text-blue-300">
              experiência acumulada
            </div>
          </div>

          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
            <div className="text-2xl">🪙</div>

            <div className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Moedas
            </div>

            <div className="mt-1 text-3xl font-black text-white">
              {totalCoins.toLocaleString("pt-BR")}
            </div>

            <div className="mt-1 text-[10px] text-amber-300">
              riqueza coletiva
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
                Desempenho coletivo
              </div>

              <h4 className="mt-1 text-lg font-black text-white">
                Distribuição por Proficiência
              </h4>
            </div>

            <span className="rounded-lg border border-purple-800/50 bg-purple-950/40 px-3 py-1 text-[10px] font-black text-purple-300">
              {studentsWithGrades.length} com notas
            </span>
          </div>

          {studentsWithGrades.length === 0 ? (
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center">
              <div className="text-2xl">📚</div>

              <p className="mt-2 text-xs font-bold text-slate-300">
                Ainda não existem notas
                cadastradas.
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                A distribuição aparecerá aqui quando
                os alunos possuírem avaliações.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {[
                {
                  label: "🟣 Avançado",
                  value: advancedStudents,
                  className: "bg-purple-500",
                },
                {
                  label: "🟢 Adequado",
                  value: adequateStudents,
                  className: "bg-emerald-500",
                },
                {
                  label: "🟡 Básico",
                  value: basicStudents,
                  className: "bg-yellow-500",
                },
                {
                  label: "🔴 Abaixo do Básico",
                  value: belowBasicStudents,
                  className: "bg-red-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">
                      {item.label}
                    </span>

                    <span className="font-black text-white">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className={`h-full rounded-full ${item.className}`}
                      style={{
                        width: `${
                          studentsWithGrades.length
                            ? (item.value /
                                studentsWithGrades.length) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">
              Estrutura Escolar
            </div>

            <h4 className="mt-1 text-lg font-black text-white">
              Turmas cadastradas
            </h4>

            <div className="mt-5 space-y-2">
              {classes.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                >
                  <span className="text-xs font-bold text-slate-300">
                    🏫 {item.name}
                  </span>

                  <span className="text-[10px] font-black text-blue-300">
                    {item.total} alunos
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-800/40 bg-indigo-950/10 p-6">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
              Poder do Gestor
            </div>

            <h4 className="mt-1 text-lg font-black text-white">
              Alcance Institucional
            </h4>

            <p className="mt-3 text-xs leading-6 text-slate-400">
              O Gestor possui visão global da escola
              e poderá futuramente administrar
              informações institucionais, eventos,
              objetivos e indicadores acadêmicos.
            </p>

            <button
              type="button"
              onClick={() =>
                setActiveTab("students")
              }
              className="mt-5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-xs font-black text-indigo-300 transition hover:bg-indigo-500/20"
            >
              👥 Ver alunos
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   ============================================================
   ALUNOS
   ============================================================
  */

  function renderStudents() {
    const classOptions = Array.from(
      new Set(
        students.map(
          (student) => student.turma || "Sem Turma"
        )
      )
    ).sort();

    const filteredStudents = students.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(studentSearch.toLowerCase());

      const matchesClass =
        studentClassFilter === "Todas" ||
        (student.turma || "Sem Turma") ===
          studentClassFilter;

      return matchesSearch && matchesClass;
    });

    const selectedStudent = students.find(
      (student) => student.id === selectedStudentId
    );

    if (selectedStudent) {
      return (
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => setSelectedStudentId(null)}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-black text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-950/30 hover:text-indigo-300"
          >
            ← Voltar para Alunos
          </button>

          <div className="rounded-2xl border border-indigo-800/50 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-indigo-500/50 bg-indigo-950/60 text-5xl">
                {selectedStudent.avatar || "🧙"}
              </div>

              <div className="min-w-0">
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
                  Registro do Aventureiro
                </div>

                <h3 className="mt-1 text-2xl font-black text-white">
                  {selectedStudent.name}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-purple-800/50 bg-purple-950/40 px-3 py-1 text-[10px] font-bold text-purple-300">
                    {selectedStudent.turma || "Sem Turma"}
                  </span>

                  <span className="rounded-lg border border-amber-800/50 bg-amber-950/40 px-3 py-1 text-[10px] font-bold text-amber-300">
                    Lvl {selectedStudent.level || 1}
                  </span>

                  <span className="rounded-lg border border-emerald-800/50 bg-emerald-950/40 px-3 py-1 text-[10px] font-bold text-emerald-300">
                    {selectedStudent.badge || "Aprendiz"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Nível
              </div>

              <div className="mt-2 text-3xl font-black text-purple-300">
                {selectedStudent.level || 1}
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                nível atual do aventureiro
              </div>
            </div>

            <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Experiência
              </div>

              <div className="mt-2 text-3xl font-black text-amber-300">
                {selectedStudent.xp || 0} XP
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                experiência acumulada
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Tesouro
              </div>

              <div className="mt-2 text-3xl font-black text-emerald-300">
                {selectedStudent.coins || 0}
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                moedas disponíveis
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">
                Conselho Acadêmico
              </div>

              <h4 className="mt-1 text-lg font-black text-white">
                Desempenho por Componente
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Notas registradas para este aventureiro.
              </p>
            </div>

            {Object.keys(selectedStudent.grades || {}).length > 0 ? (
              <div className="mt-5 space-y-4">
                {Object.entries(selectedStudent.grades || {}).map(
                  ([subject, grades]) => (
                    <div
                      key={subject}
                      className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">
                          {subject}
                        </span>

                        <span className="text-[10px] font-bold text-slate-500">
                          4 bimestres
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {grades.map((grade, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-center"
                          >
                            <div className="text-[8px] uppercase text-slate-500">
                              {index + 1}º bim.
                            </div>

                            <div className="mt-1 text-sm font-black text-emerald-300">
                              {grade || "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
                <div className="text-3xl">📚</div>

                <div className="mt-3 text-xs font-black text-slate-300">
                  Nenhuma nota registrada
                </div>

                <p className="mt-1 text-[10px] text-slate-500">
                  O desempenho acadêmico deste aluno aparecerá
                  aqui quando houver registros.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-indigo-800/40 bg-indigo-950/10 p-5">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
              Identificação
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-950/50 p-3">
                <div className="text-[9px] uppercase text-slate-500">
                  ID do registro
                </div>

                <div className="mt-1 break-all text-xs font-bold text-slate-300">
                  {selectedStudent.id}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/50 p-3">
                <div className="text-[9px] uppercase text-slate-500">
                  Insígnia
                </div>

                <div className="mt-1 text-xs font-black text-amber-300">
                  {selectedStudent.badge || "Aprendiz"}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

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
            Registro dos aventureiros cadastrados na escola.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
          <div>
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">
              Pesquisar aluno
            </label>

            <input
              value={studentSearch}
              onChange={(e) =>
                setStudentSearch(e.target.value)
              }
              placeholder="Digite o nome do aluno..."
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none transition focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">
              Turma
            </label>

            <select
              value={studentClassFilter}
              onChange={(e) =>
                setStudentClassFilter(e.target.value)
              }
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-indigo-500"
            >
              <option value="Todas">
                Todas as turmas
              </option>

              {classOptions.map((className) => (
                <option
                  key={className}
                  value={className}
                >
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-indigo-800/30 bg-indigo-950/10 px-4 py-3">
          <span className="text-[10px] font-bold text-slate-400">
            Aventureiros encontrados
          </span>

          <span className="text-sm font-black text-indigo-300">
            {filteredStudents.length}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#11150f]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4">Aluno</th>
                  <th className="p-4 text-center">Turma</th>
                  <th className="p-4 text-center">Nível</th>
                  <th className="p-4 text-center">Insígnia</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="transition hover:bg-slate-900/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-lg">
                          {student.avatar || "🧙"}
                        </span>

                        <span className="font-black text-white">
                          {student.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className="rounded-lg border border-purple-800/50 bg-purple-950/40 px-2.5 py-1 text-[10px] font-bold text-purple-300">
                        {student.turma || "Sem Turma"}
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

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStudentId(student.id)
                        }
                        className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-black text-indigo-300 transition hover:bg-indigo-500/20"
                      >
                        Ver ficha
                      </button>
                    </td>
                  </tr>
                ))}

                {!filteredStudents.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center"
                    >
                      <div className="text-3xl">🔎</div>

                      <div className="mt-3 text-xs font-black text-slate-300">
                        Nenhum aluno encontrado
                      </div>

                      <div className="mt-1 text-[10px] text-slate-500">
                        Tente alterar o nome pesquisado ou
                        selecionar outra turma.
                      </div>
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

  /*
   ============================================================
   PROFESSORES
   ============================================================
  */

  function renderTeachers() {
    const filteredTeachers =
      mockTeachers.filter((teacher) => {
        const query = search
          .trim()
          .toLowerCase();

        if (!query) return true;

        return (
          teacher.name
            .toLowerCase()
            .includes(query) ||
          teacher.email
            .toLowerCase()
            .includes(query) ||
          teacher.subjects.some((subject) =>
            subject
              .toLowerCase()
              .includes(query)
          )
        );
      });

    const selectedTeacher =
      search.startsWith("teacher:");

    if (selectedTeacher) {
      const teacherId =
        search.replace("teacher:", "");

      const teacher = mockTeachers.find(
        (item) => item.id === teacherId
      );

      if (teacher) {
const teacherStudents =
  getTutorStudents(teacher.id);

        const tutorConfig =
          getTutorConfig(teacher.id);

        const tutorCapacity =
          tutorConfig?.capacidadeMaxima ?? 0;

        const tutorActive =
          tutorConfig?.ativo ?? false;

        const availableSlots =
          Math.max(
            0,
            tutorCapacity -
              teacherStudents.length
          );

        return (
          <div className="space-y-5">
            <div>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mb-4 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-[10px] font-black text-slate-300 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-300"
              >
                ← Voltar para Professores
              </button>

              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
                Conselho da Guilda
              </div>

              <h3 className="mt-1 text-2xl font-black text-white">
                🧙 {teacher.name}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Perfil institucional do professor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Tutorados
                </div>

                <div className="mt-2 text-3xl font-black text-purple-300">
                  {teacherStudents.length}
                </div>

                <div className="mt-1 text-[10px] text-slate-500">
                  aventureiros acompanhados
                </div>
              </div>

              <div className="rounded-2xl border border-blue-800/40 bg-blue-950/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Componentes
                </div>

                <div className="mt-2 text-3xl font-black text-blue-300">
                  {teacher.subjects.length}
                </div>

                <div className="mt-1 text-[10px] text-slate-500">
                  áreas de atuação
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Turmas
                </div>

                <div className="mt-2 text-3xl font-black text-emerald-300">
                  {teacher.classes.length}
                </div>

                <div className="mt-1 text-[10px] text-slate-500">
                  grupos atendidos
                </div>
              </div>

              <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Capacidade
                </div>

                <div className="mt-2 text-3xl font-black text-amber-300">
                  {tutorCapacity}
                </div>

                <div className="mt-1 text-[10px] text-slate-500">
                  tutorados máximos
                </div>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  tutorActive
                    ? "border-emerald-800/40 bg-emerald-950/20"
                    : "border-red-800/40 bg-red-950/20"
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Tutoria
                </div>

                <div
                  className={`mt-2 text-2xl font-black ${
                    tutorActive
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {tutorActive
                    ? "Disponível"
                    : "Inativo"}
                </div>

                <div className="mt-1 text-[10px] text-slate-500">
                  {availableSlots} vagas restantes
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-800/40 bg-indigo-950/10 p-6">
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">
                Configuração de Tutoria
              </div>

              <h4 className="mt-1 text-lg font-black text-white">
                Capacidade do Tutor
              </h4>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Defina quantos aventureiros este professor
                poderá acompanhar no ano letivo.
              </p>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Ocupação atual
                      </div>

                      <div className="mt-1 text-sm font-black text-white">
                        {teacherStudents.length} de{" "}
                        {tutorCapacity} tutorados
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] uppercase text-slate-500">
                        Vagas
                      </div>

                      <div className="mt-1 text-xl font-black text-emerald-300">
                        {availableSlots}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${
                          tutorCapacity > 0
                            ? Math.min(
                                100,
                                (teacherStudents.length /
                                  tutorCapacity) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Capacidade máxima
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={tutorCapacity}
                    onChange={(e) =>
                      updateTutorCapacity(
                        teacher.id,
                        Number(e.target.value)
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-black text-white outline-none transition focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div>
                  <div className="text-xs font-black text-white">
                    Participação na distribuição anual
                  </div>

                  <div className="mt-1 text-[10px] leading-5 text-slate-500">
                    Professores inativos não serão considerados
                    pelo Conselho da Guilda.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleTutor(teacher.id)
                  }
                  className={`rounded-xl border px-4 py-2.5 text-[10px] font-black transition ${
                    tutorActive
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                      : "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                  }`}
                >
                  {tutorActive
                    ? "🟢 Tutor disponível"
                    : "🔴 Tutor inativo"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
                  Identificação
                </div>

                <h4 className="mt-1 text-lg font-black text-white">
                  Dados do Professor
                </h4>

                <div className="mt-5 space-y-3">
                  <div className="rounded-xl bg-slate-900/50 p-4">
                    <div className="text-[9px] uppercase text-slate-500">
                      Nome
                    </div>

                    <div className="mt-1 text-sm font-black text-white">
                      {teacher.name}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-900/50 p-4">
                    <div className="text-[9px] uppercase text-slate-500">
                      E-mail
                    </div>

                    <div className="mt-1 text-sm font-black text-blue-300">
                      {teacher.email}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-900/50 p-4">
                    <div className="text-[9px] uppercase text-slate-500">
                      ID do registro
                    </div>

                    <div className="mt-1 font-mono text-xs font-bold text-slate-300">
                      {teacher.id}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">
                  Atuação Acadêmica
                </div>

                <h4 className="mt-1 text-lg font-black text-white">
                  Componentes e Turmas
                </h4>

                <div className="mt-5">
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Componentes
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {teacher.subjects.map(
                      (subject) => (
                        <span
                          key={subject}
                          className="rounded-lg border border-blue-800/50 bg-blue-950/30 px-3 py-1.5 text-[10px] font-bold text-blue-300"
                        >
                          {subject}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Turmas
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {teacher.classes.map(
                      (className) => (
                        <span
                          key={className}
                          className="rounded-lg border border-emerald-800/50 bg-emerald-950/30 px-3 py-1.5 text-[10px] font-bold text-emerald-300"
                        >
                          {className}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
                    Tutoria
                  </div>

                  <h4 className="mt-1 text-lg font-black text-white">
                    Aventureiros Tutorados
                  </h4>
                </div>

                <span className="rounded-lg border border-purple-800/50 bg-purple-950/30 px-3 py-1.5 text-[10px] font-black text-purple-300">
                  {teacherStudents.length} alunos
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {teacherStudents.map(
                  (student) => (
                    <div
                      key={student.id}
                      className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-2xl">
                          {student.avatar ||
                            "🧙"}
                        </div>

                        <div>
                          <div className="font-black text-white">
                            {student.name}
                          </div>

                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="rounded-md border border-blue-800/40 bg-blue-950/30 px-2 py-1 text-[9px] font-black text-blue-300">
                              {student.turma ||
                                "Sem Turma"}
                            </span>

                            <span className="rounded-md border border-amber-800/40 bg-amber-950/30 px-2 py-1 text-[9px] font-black text-amber-300">
                              Lvl{" "}
                              {student.level ||
                                1}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudentId(
                            student.id
                          );
                          setActiveTab(
                            "students"
                          );
                        }}
                        className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-[10px] font-black text-purple-300 transition hover:bg-purple-500/20"
                      >
                        Ver ficha
                      </button>
                    </div>
                  )
                )}

                {!teacherStudents.length && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center">
                    <div className="text-3xl">
                      📜
                    </div>

                    <div className="mt-3 text-sm font-black text-white">
                      Nenhum tutorado
                    </div>

                    <div className="mt-1 text-[10px] leading-5 text-slate-500">
                      Este professor ainda
                      não possui
                      aventureiros
                      vinculados.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    }

    const totalTeachers =
      mockTeachers.length;

    const activeTeachers =
      mockTeachers.filter(
        (teacher) => teacher.status === "Ativo"
      ).length;

const totalTutorados =
  students.filter(
    (student) =>
      student.anoLetivo === 2026 &&
      !!student.tutorId
  ).length;

    const activeTutors =
      tutorConfigs.filter(
        (tutor) => tutor.ativo
      ).length;

    const totalTutorCapacity =
      tutorConfigs.reduce(
        (total, tutor) =>
          total + tutor.capacidadeMaxima,
        0
      );

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
            Gestão da equipe pedagógica e dos
            professores tutores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Professores
            </div>

            <div className="mt-2 text-3xl font-black text-purple-300">
              {totalTeachers}
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              membros da equipe
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Professores ativos
            </div>

            <div className="mt-2 text-3xl font-black text-emerald-300">
              {activeTeachers}
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              atualmente ativos
            </div>
          </div>

          <div className="rounded-2xl border border-blue-800/40 bg-blue-950/20 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Tutorados
            </div>

            <div className="mt-2 text-3xl font-black text-blue-300">
              {totalTutorados}
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              vínculos de tutoria
            </div>
          </div>

          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Capacidade
            </div>

            <div className="mt-2 text-3xl font-black text-amber-300">
              {totalTutorCapacity}
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              vagas configuradas
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-800/40 bg-indigo-950/20 p-5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Tutores disponíveis
            </div>

            <div className="mt-2 text-3xl font-black text-indigo-300">
              {activeTutors}
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              aptos à distribuição
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 px-4 py-3 text-[10px] leading-5 text-amber-300">
          ⚠️ Os professores ainda são registros
          de protótipo. A configuração de tutoria
          nesta etapa funciona somente durante a
          sessão atual.
        </div>

        <div>
          <input
            value={
              search.startsWith("teacher:")
                ? ""
                : search
            }
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Pesquisar por nome, e-mail ou componente..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none transition focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTeachers.map(
            (teacher) => {
              const tutorConfig =
                getTutorConfig(teacher.id);

              const capacity =
                tutorConfig?.capacidadeMaxima ?? 0;

              const active =
                tutorConfig?.ativo ?? false;

const current =
  getTutorStudents(teacher.id).length;

              const available =
                Math.max(
                  0,
                  capacity - current
                );

              return (
                <div
                  key={teacher.id}
                  className="rounded-2xl border border-slate-800 bg-[#11150f] p-5 transition hover:border-purple-800/60 hover:bg-purple-950/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-800/50 bg-purple-950/30 text-2xl">
                      🧙
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-black text-white">
                        {teacher.name}
                      </div>

                      <div className="mt-1 truncate text-[10px] text-slate-500">
                        {teacher.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {teacher.subjects.map(
                      (subject) => (
                        <span
                          key={subject}
                          className="rounded-md border border-blue-800/40 bg-blue-950/30 px-2 py-1 text-[9px] font-bold text-blue-300"
                        >
                          {subject}
                        </span>
                      )
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-900/60 p-3">
                      <div className="text-[9px] uppercase text-slate-500">
                        Tutorados
                      </div>

                      <div className="mt-1 text-lg font-black text-white">
                        {current}
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900/60 p-3">
                      <div className="text-[9px] uppercase text-slate-500">
                        Capacidade
                      </div>

                      <div className="mt-1 text-lg font-black text-amber-300">
                        {capacity}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div
                      className={`rounded-lg p-3 ${
                        active
                          ? "bg-emerald-950/30"
                          : "bg-red-950/30"
                      }`}
                    >
                      <div className="text-[9px] uppercase text-slate-500">
                        Tutoria
                      </div>

                      <div
                        className={`mt-1 text-xs font-black ${
                          active
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {active
                          ? "Disponível"
                          : "Inativo"}
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900/60 p-3">
                      <div className="text-[9px] uppercase text-slate-500">
                        Vagas
                      </div>

                      <div className="mt-1 text-xs font-black text-indigo-300">
                        {available}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSearch(
                        `teacher:${teacher.id}`
                      )
                    }
                    className="mt-4 w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-[10px] font-black text-purple-300 transition hover:bg-purple-500/20"
                  >
                    🧙 Gerenciar professor
                  </button>
                </div>
              );
            }
          )}

          {!filteredTeachers.length && (
            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-8 text-center text-xs text-slate-500 md:col-span-2 xl:col-span-3">
              Nenhum professor encontrado.
            </div>
          )}
        </div>
      </div>
    );
  }

  /*
   ============================================================
   TURMAS
   ============================================================
  */

  function renderClasses() {
    const selectedClass =
      classFilter !== "Todas"
        ? classes.find(
            (item) => item.name === classFilter
          )
        : null;

    if (selectedClass) {
      const classStudents =
        students.filter(
          (student) =>
            (student.turma || "Sem Turma") ===
            selectedClass.name
        );

      const classAverageLevel =
        classStudents.length
          ? (
              classStudents.reduce(
                (sum, student) =>
                  sum +
                  (Number(student.level) || 0),
                0
              ) / classStudents.length
            ).toFixed(1)
          : "0";

      return (
        <div className="space-y-5">
          <div>
            <button
              type="button"
              onClick={() =>
                setClassFilter("Todas")
              }
              className="mb-4 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-[10px] font-black text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
            >
              ← Voltar para Turmas
            </button>

            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">
              Organização Escolar
            </div>

            <h3 className="mt-1 text-2xl font-black text-white">
              🏫 {selectedClass.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Visão dos aventureiros pertencentes
              a esta turma.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-blue-800/40 bg-blue-950/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Alunos
              </div>

              <div className="mt-2 text-3xl font-black text-blue-300">
                {classStudents.length}
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                aventureiros na turma
              </div>
            </div>

            <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Nível médio
              </div>

              <div className="mt-2 text-3xl font-black text-amber-300">
                {classAverageLevel}
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                nível coletivo
              </div>
            </div>

            <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Organização
              </div>

              <div className="mt-2 text-lg font-black text-purple-300">
                Ativa
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                turma cadastrada
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">
                  Registro da Turma
                </div>

                <h4 className="mt-1 text-lg font-black text-white">
                  Aventureiros
                </h4>
              </div>

              <span className="rounded-lg border border-blue-800/50 bg-blue-950/30 px-3 py-1.5 text-[10px] font-black text-blue-300">
                {classStudents.length} alunos
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {classStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-blue-800/50 hover:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-2xl">
                      {student.avatar || "🧙"}
                    </div>

                    <div>
                      <div className="font-black text-white">
                        {student.name}
                      </div>

                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="rounded-md border border-amber-800/40 bg-amber-950/30 px-2 py-1 text-[9px] font-black text-amber-300">
                          Lvl {student.level || 1}
                        </span>

                        <span className="rounded-md border border-purple-800/40 bg-purple-950/30 px-2 py-1 text-[9px] font-black text-purple-300">
                          {student.badge || "Aprendiz"}
                        </span>

                        <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[9px] font-bold text-slate-400">
                          {student.xp || 0} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentId(
                        student.id
                      );
                      setActiveTab("students");
                    }}
                    className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-[10px] font-black text-blue-300 transition hover:bg-blue-500/20"
                  >
                    Ver ficha
                  </button>
                </div>
              ))}

              {!classStudents.length && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center text-xs text-slate-500">
                  Nenhum aluno cadastrado nesta
                  turma.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

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
            Turmas calculadas automaticamente a
            partir dos alunos atualmente cadastrados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {classes.map((item) => {
            const classStudents =
              students.filter(
                (student) =>
                  (student.turma || "Sem Turma") ===
                  item.name
              );

            const classAverageLevel =
              classStudents.length
                ? (
                    classStudents.reduce(
                      (sum, student) =>
                        sum +
                        (Number(student.level) || 0),
                      0
                    ) / classStudents.length
                  ).toFixed(1)
                : "0";

            return (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-800 bg-[#11150f] p-5 transition hover:border-blue-800/60 hover:bg-blue-950/10"
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

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-900/60 p-3">
                    <div className="text-[9px] uppercase text-slate-500">
                      Nível médio
                    </div>

                    <div className="mt-1 text-lg font-black text-amber-400">
                      {classAverageLevel}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-900/60 p-3">
                    <div className="text-[9px] uppercase text-slate-500">
                      Alunos
                    </div>

                    <div className="mt-1 text-lg font-black text-blue-300">
                      {item.total}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setClassFilter(item.name)
                  }
                  className="mt-4 w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-[10px] font-black text-blue-300 transition hover:bg-blue-500/20"
                >
                  🏫 Abrir turma
                </button>
              </div>
            );
          })}

          {!classes.length && (
            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-8 text-center text-xs text-slate-500 md:col-span-2 xl:col-span-3">
              Nenhuma turma cadastrada.
            </div>
          )}
        </div>
      </div>
    );
  }

  /*
   ============================================================
   DESEMPENHO
   ============================================================
  */

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
            Indicadores calculados a partir das
            avaliações disponíveis.
          </p>
        </div>

        {studentsWithGrades.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-10 text-center">
            <div className="text-5xl">📚</div>

            <h4 className="mt-4 text-lg font-black text-white">
              Ainda não há dados de desempenho
            </h4>

            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
              Os alunos de demonstração ainda não
              possuem notas cadastradas. Quando as
              notas forem adicionadas, esta área
              calculará automaticamente as médias.
            </p>

            <div className="mt-5 rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 text-left text-[10px] leading-5 text-amber-300">
              ℹ️ Nenhuma média fictícia está sendo
              apresentada aqui para evitar que o
              protótipo pareça estar usando dados
              escolares reais.
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
                <div className="text-[10px] font-black uppercase text-slate-500">
                  Média Geral
                </div>

                <div className="mt-2 text-4xl font-black text-emerald-300">
                  {schoolAverage?.toFixed(1)}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-800/40 bg-blue-950/20 p-5">
                <div className="text-[10px] font-black uppercase text-slate-500">
                  Alunos avaliados
                </div>

                <div className="mt-2 text-4xl font-black text-blue-300">
                  {studentsWithGrades.length}
                </div>
              </div>

              <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 p-5">
                <div className="text-[10px] font-black uppercase text-slate-500">
                  Situação
                </div>

                <div className="mt-2 text-2xl font-black text-purple-300">
                  {getPerformanceLabel(
                    schoolAverage
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6">
              <h4 className="text-lg font-black text-white">
                Alunos por desempenho
              </h4>

              <div className="mt-5 space-y-3">
                {students
                  .map((student) => ({
                    student,
                    average:
                      getStudentAverage(
                        student
                      ),
                  }))
                  .filter(
                    (item) =>
                      item.average !== null
                  )
                  .map(
                    ({
                      student,
                      average,
                    }) => (
                      <div
                        key={student.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                      >
                        <div className="flex justify-between gap-4">
                          <span className="text-xs font-bold text-white">
                            {student.name}
                          </span>

                          <span className="text-xs font-black text-emerald-300">
                            {average!.toFixed(
                              1
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /*
   ============================================================
   MAPA
   ============================================================
  */

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
            Área reservada para a visão institucional
            do Mapa da Reputação Acadêmica.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#11150f] p-6 min-h-[420px]">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/30 via-slate-950 to-purple-950/20">
            <div className="text-center px-5">
              <div className="text-7xl">
                🗺️
              </div>

              <h4 className="mt-4 text-2xl font-black text-white">
                Reino do Conhecimento
              </h4>

              <p className="mt-2 max-w-md text-xs leading-6 text-slate-500">
                O mapa institucional será conectado
                aos dados reais de reputação dos
                alunos, turmas e componentes
                curriculares em uma etapa posterior.
              </p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {subjects.slice(0, 4).map(
                  (subject) => (
                    <div
                      key={subject}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                    >
                      <div className="text-[9px] text-slate-500">
                        {subject}
                      </div>

                      <div className="mt-1 text-xs font-black text-slate-400">
                        Em preparação
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   ============================================================
   EVENTOS
   ============================================================
  */

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
            Crie eventos de demonstração destinados
            a todos os alunos.
          </p>
        </div>

        <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 text-[10px] leading-5 text-amber-300">
          ⚠️ O evento ainda é armazenado somente
          durante a sessão atual. A persistência no
          Supabase será implementada posteriormente.
        </div>

        <div className="rounded-2xl border border-red-800/40 bg-red-950/10 p-6">
          {eventCreated && (
            <div className="mb-5 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4 text-xs font-bold text-emerald-300">
              ✅ Evento criado em modo de
              demonstração.
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

  /*
   ============================================================
   OBJETIVOS
   ============================================================
  */

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
            Crie objetivos institucionais de
            demonstração.
          </p>
        </div>

        <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 text-[10px] leading-5 text-amber-300">
          ⚠️ O objetivo ainda não é persistido no
          banco. Estamos desenvolvendo primeiro o
          comportamento do painel.
        </div>

        <div className="rounded-2xl border border-purple-800/40 bg-purple-950/10 p-6">
          {objectiveCreated && (
            <div className="mb-5 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4 text-xs font-bold text-emerald-300">
              ✅ Objetivo criado em modo de
              demonstração.
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
                  setObjectiveTitle(
                    e.target.value
                  )
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
                🏫 Todos os alunos da escola
              </div>

              <div className="mt-1 text-[10px] text-slate-500">
                O objetivo será independente do
                professor tutor.
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

  /*
   ============================================================
   CONTEÚDO
   ============================================================
  */

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

      case "calendar":
        return <CalendarioGuilda />;

      case "overview":
      default:
        return renderOverview();
    }
  }

  /*
   ============================================================
   PAINEL PRINCIPAL
   ============================================================
  */

  return (
    <section className="space-y-5">
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
                  institucionais da escola.
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