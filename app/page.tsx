"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PainelAprovacaoProfessor } from '@/components/MissoesProfessor';
import AdventureMap from "@/components/AdventureMap";
import AchievementsPanel from "@/components/AchievementsPanel";
import CondutaProfessor from "@/components/CondutaProfessor";
import TeacherSidebar from "@/components/TeacherSidebar";
import ManagerPanel from "@/components/ManagerPanel";
import { ACHIEVEMENTS } from "@/components/achievements";
import AvatarPreview from "@/components/Avatar/AvatarPreview";
import LojaGuilda from "@/components/Avatar/LojaGuilda";
import MeusEquipamentos from "@/components/Avatar/MeusEquipamentos";

/* ============================================================
   TIPOS
============================================================ */

type UserRole = "teacher" | "student" | "manager" | "developer";

type TeacherTab =
  | "overview"
  | "calendar"
  | "validation"
  | "grades"
  | "map"
  | "conduta"
  | "create_event"
  | "quests"
  | "enturmar";

type Grades = [string, string, string, string];

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

type QuestStatus = "Em andamento" | "Concluido" | "Encerrado";

type Quest = {
  id: string;
  title: string;
  icon: string;
  periodo: string;
  categoria: string;
  requirement: string;
  xpReward: number;
  coinReward: number;
  status: QuestStatus;
  progress: number;
  maxProgress: number;
  studentId?: string;
  studentName?: string;
};

type EventItem = {
  id: string;
  title: string;
  type: string;
  periodo: string;
  description: string;
  rewardXp: number;
  rewardCoins: number;
  active: boolean;
};

/* ============================================================
   COMPONENTES CURRICULARES
============================================================ */

const allCurricularSubjects = [
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

const subjects = [
  { name: "Língua Portuguesa", icon: "📜" },
  { name: "Língua Inglesa", icon: "🇬🇧" },
  { name: "Matemática", icon: "🔢" },
  { name: "História", icon: "ðŸ›ï¸" },
  { name: "Geografia", icon: "🗺️" },
  { name: "Educação Física", icon: "⚽" },
  { name: "Artes", icon: "🎨" },
  { name: "Ciências", icon: "🔬" },
  { name: "Projeto de Vida", icon: "🧭" },
  { name: "Tecnologia", icon: "💻" },
  { name: "Educação Financeira", icon: "🪙" },
  { name: "Robótica", icon: "🤖" },
  {
    name: "Orientação de Estudos de Português",
    icon: "📚",
  },
  {
    name: "Orientação de Estudos de Matemática",
    icon: "🧮",
  },
];

/* ============================================================
   FUNÇÕES AUXILIARES
============================================================ */

function createEmptyGrades(): Grades {
  return ["", "", "", ""];
}

function calculateAverage(grades: Grades): number {
  const validGrades = grades
    .filter((grade) => grade.trim() !== "")
    .map(Number)
    .filter(
      (value) =>
        !Number.isNaN(value) &&
        value >= 0
    );

  if (validGrades.length === 0) {
    return 0;
  }

  const sum = validGrades.reduce(
    (acc, value) => acc + value,
    0
  );

  return sum / validGrades.length;
}
function getPerformanceLevel(avg: number): string {
  if (avg >= 9) return "Avançado";
  if (avg >= 7) return "Adequado";
  if (avg >= 5) return "Básico";
  return "Abaixo do Básico";
}

function getPerformanceClass(perf: string): string {
  if (perf === "Avançado") {
    return "bg-purple-950/50 text-purple-300 border border-purple-800/50";
  }

  if (perf === "Adequado") {
    return "bg-emerald-950/50 text-emerald-300 border border-emerald-800/50";
  }

  if (perf === "Básico") {
    return "bg-orange-950/50 text-orange-300 border border-orange-800/50";
  }

  return "bg-red-950/50 text-red-300 border border-red-800/50";
}

function getPerformanceIcon(perf: string): string {
  if (perf === "Avançado") return "🟣";
  if (perf === "Adequado") return "🟢";
  if (perf === "Básico") return "ðŸŸ ";
  return "🔴";
}

/* ============================================================
   DADOS INICIAIS
============================================================ */

const mockClassStudents: StudentRecord[] = [
  {
    id: "s1",
    name: "Pedro Henrique",
    avatar: "🧙‍♂️",
    level: 5,
    xp: 1250,
    coins: 450,
    badge: "Mago das Letras",
    turma: "9º Ano A",
    grades: {},
  },
  {
    id: "s2",
    name: "Beatriz Oliveira",
    avatar: "🧠",
    level: 7,
    xp: 1850,
    coins: 620,
    badge: "Arquimaga das Letras",
    turma: "9º Ano A",
    grades: {},
  },
  {
    id: "s3",
    name: "Arthur Pendelton",
    avatar: "🛡️",
    level: 6,
    xp: 1600,
    coins: 530,
    badge: "Guardião do Conhecimento",
    turma: "9º Ano A",
    grades: {},
  },
  {
    id: "s4",
    name: "Gabriel Santos",
    avatar: "⚡",
    level: 4,
    xp: 980,
    coins: 340,
    badge: "Aventureiro",
    turma: "9º Ano A",
    grades: {},
  },
];

const initialQuests: Quest[] = [
  {
    id: "q1",
    title: "Mestre da Frequência",
    icon: "☀️",
    periodo: "Semanal",
    categoria: "Semanal",
    requirement: "Manter frequência e participação durante a semana.",
    xpReward: 100,
    coinReward: 50,
    status: "Em andamento",
    progress: 0,
    maxProgress: 1,
    studentId: "s3",
    studentName: "Arthur Pendelton",
  },
  {
    id: "q2",
    title: "Arquimaga das Letras",
    icon: "📜",
    periodo: "1º Bimestre",
    categoria: "Especial",
    requirement: "Obter desempenho destacado nas atividades de Língua Portuguesa.",
    xpReward: 150,
    coinReward: 75,
    status: "Em andamento",
    progress: 0,
    maxProgress: 1,
    studentId: "s2",
    studentName: "Beatriz Oliveira",
  },
  {
    id: "q3",
    title: "Explorador da Geometria",
    icon: "⚔️",
    periodo: "Mensal",
    categoria: "Mensal",
    requirement: "Completar as atividades de geometria propostas.",
    xpReward: 200,
    coinReward: 80,
    status: "Em andamento",
    progress: 0,
    maxProgress: 1,
    studentId: "s1",
    studentName: "Pedro Henrique",
  },
];

const mockEvents: EventItem[] = [
  {
    id: "event1",
    title: "Guardião dos Polígonos de Ouro",
    type: "🐉 Boss Raid",
    periodo: "1º Bimestre",
    description:
      "Desafio coletivo de Matemática para derrotar o Guardião dos Polígonos.",
    rewardXp: 500,
    rewardCoins: 200,
    active: true,
  },
];

/* ============================================================
   ABA DE OBJETIVOS DO ALUNO
============================================================ */

function ObjectivesTab({
  quests,
  student,
}: {
  quests: Quest[];
  student: StudentRecord;
}) {
  const studentQuests = quests.filter(
    (quest) =>
      quest.studentId === student.id ||
      quest.studentName === student.name
  );

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#1b1e17] via-[#11150f] to-[#0a0d0a] p-6 sm:p-8 shadow-2xl">
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">
          📜 Quadro do Aventureiro
        </div>

        <h2 className="mt-1 text-3xl font-black text-white">
          Meus Objetivos
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Complete os objetivos e aguarde a validação do Mestre.
        </p>
      </div>

      {studentQuests.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-10 text-center">
          <div className="text-5xl">📜</div>
          <h3 className="mt-3 text-lg font-black text-white">
            Nenhum objetivo disponível
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Novos objetivos aparecerão aqui quando forem atribuídos pelo
            professor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {studentQuests.map((quest) => (
            <div
              key={quest.id}
              className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-950/30 text-2xl">
                    {quest.icon}
                  </div>

                  <div>
                    <h3 className="font-black text-white">
                      {quest.title}
                    </h3>

                    <p className="text-[10px] text-slate-500">
                      {quest.categoria} • {quest.periodo}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-lg border px-2 py-1 text-[9px] font-black ${
                    quest.status === "Concluido"
                      ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                      : quest.status === "Encerrado"
                      ? "border-rose-500/40 bg-rose-950/40 text-rose-300"
                      : "border-amber-500/40 bg-amber-950/40 text-amber-300"
                  }`}
                >
                  {quest.status}
                </span>
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Requisito
                </div>

                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {quest.requirement}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-center">
                  <div className="text-[9px] font-black uppercase text-amber-500">
                    XP
                  </div>
                  <div className="mt-1 text-lg font-black text-amber-300">
                    +{quest.xpReward}
                  </div>
                </div>

                <div className="rounded-xl border border-yellow-500/20 bg-yellow-950/20 p-3 text-center">
                  <div className="text-[9px] font-black uppercase text-yellow-500">
                    Moedas
                  </div>
                  <div className="mt-1 text-lg font-black text-yellow-300">
                    +{quest.coinReward}
                  </div>
                </div>
              </div>

              {quest.status === "Em andamento" && (
                <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-950/20 p-3 text-center">
                  <span className="text-[10px] font-bold text-purple-300">
                    🧙 Aguarde a validação do Mestre
                  </span>
                </div>
              )}

              {quest.status === "Concluido" && (
                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-center">
                  <span className="text-[10px] font-bold text-emerald-300">
                    🎉 Objetivo validado pelo professor!
                  </span>
                </div>
              )}

              {quest.status === "Encerrado" && (
                <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-center">
                  <span className="text-[10px] font-bold text-rose-300">
                    🚫 Objetivo encerrado pelo professor.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ============================================================
   PAINEL DO PROFESSOR
============================================================ */

function TeacherPanel({
  onSwitchRole,
  students,
  setStudents,
  quests,
  setQuests,
  events,
  setEvents,
}: {
  onSwitchRole: () => void;
  students: StudentRecord[];
  setStudents: React.Dispatch<React.SetStateAction<StudentRecord[]>>;
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
}) {
  const [teacherTab, setTeacherTab] =
    useState<TeacherTab>("overview");

  const [toastMessage, setToastMessage] = useState("");

  const [selectedSubject, setSelectedSubject] =
    useState<string>("Língua Portuguesa");

  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentClass, setNewStudentClass] = useState("");

  const [editingStudentId, setEditingStudentId] =
    useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editClass, setEditClass] = useState("");

  /* ------------------------------------------------------------
     CAMPOS DE EVENTO
  ------------------------------------------------------------ */

  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] =
    useState("Boss Raid");
  const [eventPeriodo, setEventPeriodo] = useState("");
  const [eventDescription, setEventDescription] =
    useState("");
  const [eventXp, setEventXp] = useState("500");
  const [eventCoins, setEventCoins] = useState("200");

  /* ------------------------------------------------------------
     CAMPOS DE QUEST
  ------------------------------------------------------------ */

  const [questTitle, setQuestTitle] = useState("");
  const [questCategory, setQuestCategory] =
    useState("Diário");
  const [questPeriodo, setQuestPeriodo] = useState("");
  const [questRequirement, setQuestRequirement] =
    useState("");
  const [questXp, setQuestXp] = useState("150");
  const [questCoins, setQuestCoins] = useState("50");
  const [questStudentId, setQuestStudentId] =
    useState("all");

  function triggerToast(message: string) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 3500);
  }

  /* ============================================================
     REGRA DE NEGÓCIO:
     VALIDAÇÃO EXCLUSIVA DO PROFESSOR
  ============================================================ */

  function handleValidateQuest(
    questId: string,
    novoStatus: "Concluido" | "Encerrado"
  ) {
    const quest = quests.find((q) => q.id === questId);

    if (!quest) return;

    /*
      REGRA DE SEGURANÇA:

      Só uma missão "Em andamento" pode ser validada.
      Isso impede que o professor receba/reaplique
      recompensas em uma missão já encerrada ou concluída.
    */
    if (quest.status !== "Em andamento") {
      triggerToast(
        "âš ï¸ Esta missão já foi finalizada e não pode ser validada novamente."
      );

      return;
    }

    /* ----------------------------------------------------------
       ENCERRAMENTO SEM RECOMPENSA
    ---------------------------------------------------------- */

    if (novoStatus === "Encerrado") {
      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId
            ? {
                ...q,
                status: "Encerrado",
              }
            : q
        )
      );

      triggerToast(
        `🚫 Missão encerrada! ${
          quest.studentName || "O aluno"
        } não recebeu recompensas.`
      );

      return;
    }

    /* ----------------------------------------------------------
       CONCLUSÃO + RECOMPENSA
    ---------------------------------------------------------- */

    const activeEvent = events.find((event) => event.active);

    const bonusXp = activeEvent
      ? activeEvent.rewardXp
      : 0;

    const bonusCoins = activeEvent
      ? activeEvent.rewardCoins
      : 0;

    const totalXp = quest.xpReward + bonusXp;
    const totalCoins =
      quest.coinReward + bonusCoins;

    /*
      Atualiza a missão.
    */

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              status: "Concluido",
              progress: q.maxProgress,
            }
          : q
      )
    );

    /*
      Atualiza o aluno REALMENTE.

      Primeiro tentamos localizar pelo studentId.
      Como segurança, também usamos studentName.
    */

    setStudents((prev) =>
      prev.map((student) => {
        const belongsToQuest =
          (quest.studentId &&
            student.id === quest.studentId) ||
          (!quest.studentId &&
            quest.studentName &&
            student.name === quest.studentName);

        if (!belongsToQuest) {
          return student;
        }

        const newXp = student.xp + totalXp;
        const newCoins = student.coins + totalCoins;

        /*
          Regra simples de nível:
          cada 500 XP representa um nível.
        */
        const newLevel =
          Math.floor(newXp / 500) + 1;

        return {
          ...student,
          xp: newXp,
          coins: newCoins,
          level: Math.max(student.level, newLevel),
        };
      })
    );

    const bonusMessage = activeEvent
      ? ` + Bônus do evento: ${bonusXp} XP e ${bonusCoins} moedas.`
      : "";

    triggerToast(
      `🎉 Missão concluída! ${
        quest.studentName || "O aluno"
      } recebeu +${totalXp} XP e +${totalCoins} moedas.${bonusMessage}`
    );
  }

  /* ============================================================
     LANÇAMENTO DE NOTAS
  ============================================================ */

  function handleStudentGradeChange(
    studentId: string,
    bimIndex: number,
    val: string
  ) {
    let numeric = val;

    if (Number(val) > 10) numeric = "10";
    if (Number(val) < 0) numeric = "0";

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) {
          return student;
        }

        const currentGrades =
          student.grades[selectedSubject] ||
          createEmptyGrades();

        const updated: Grades = [
          ...currentGrades,
        ] as Grades;

        updated[bimIndex] = numeric;

        return {
          ...student,
          grades: {
            ...student.grades,
            [selectedSubject]: updated,
          },
        };
      })
    );
  }

  /* ============================================================
     BÔNUS MANUAL
  ============================================================ */

  function rewardStudent(studentId: string) {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) {
          return student;
        }

        const newXp = student.xp + 100;
        const newCoins = student.coins + 50;

        return {
          ...student,
          xp: newXp,
          coins: newCoins,
          level: Math.max(
            student.level,
            Math.floor(newXp / 500) + 1
          ),
        };
      })
    );

    const student = students.find(
      (student) => student.id === studentId
    );

    triggerToast(
      `✨ 100 XP e 50 Moedas concedidos a ${
        student?.name || "aventureiro"
      }!`
    );
  }

  /* ============================================================
     CADASTRAR ALUNO
  ============================================================ */

  function handleAddStudent(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !newStudentName.trim() ||
      !newStudentClass.trim()
    ) {
      triggerToast(
        "âš ï¸ Preencha o nome e a turma do aluno!"
      );

      return;
    }

    const avatars = [
      "🗡️",
      "🧠",
      "🛡️",
      "🔮",
      "⚡",
      "🧙‍♂️",
      "📜",
    ];

    const randomAvatar =
      avatars[
        Math.floor(Math.random() * avatars.length)
      ];

    const newStudent: StudentRecord = {
      id: `s-${Date.now()}`,
      name: newStudentName.trim(),
      avatar: randomAvatar,
      level: 1,
      xp: 0,
      coins: 0,
      badge: "Iniciante do Reino",
      turma: newStudentClass.trim(),
      grades: {},
    };

    setStudents((prev) => [
      newStudent,
      ...prev,
    ]);

    triggerToast(
      `🎉 Aluno ${newStudent.name} enturmado na turma ${newStudent.turma}!`
    );

    setNewStudentName("");
    setNewStudentClass("");
  }

  /* ============================================================
     EDITAR ALUNO
  ============================================================ */

  function handleStartEdit(
    student: StudentRecord
  ) {
    setEditingStudentId(student.id);
    setEditName(student.name);
    setEditClass(student.turma || "");
  }

  function handleCancelEdit() {
    setEditingStudentId(null);
    setEditName("");
    setEditClass("");
  }

  function handleSaveEdit(
    studentId: string
  ) {
    if (
      !editName.trim() ||
      !editClass.trim()
    ) {
      triggerToast(
        "âš ï¸ Nome e turma não podem ficar em branco!"
      );

      return;
    }

    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              name: editName.trim(),
              turma: editClass.trim(),
            }
          : student
      )
    );

    /*
      Também atualiza o nome nas missões existentes,
      para evitar referências antigas.
    */

    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.studentId !== studentId) {
          return quest;
        }

        return {
          ...quest,
          studentName: editName.trim(),
        };
      })
    );

    triggerToast(
      "✏️ Dados do aventureiro atualizados com sucesso!"
    );

    setEditingStudentId(null);
    setEditName("");
    setEditClass("");
  }

  /* ============================================================
     EXCLUIR ALUNO
  ============================================================ */

  function handleDeleteStudent(
    studentId: string,
    studentName: string
  ) {
    if (
      confirm(
        `Tem certeza que deseja remover ${studentName} do Reino?`
      )
    ) {
      setStudents((prev) =>
        prev.filter(
          (student) => student.id !== studentId
        )
      );

      triggerToast(
        `🗑️ ${studentName} foi removido da guilda.`
      );
    }
  }

  /* ============================================================
     CRIAR EVENTO
  ============================================================ */

  function handleCreateEvent(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !eventTitle.trim() ||
      !eventPeriodo.trim() ||
      !eventDescription.trim()
    ) {
      triggerToast(
        "âš ï¸ Preencha todos os campos obrigatórios do evento."
      );

      return;
    }

    /*
      Novo evento se torna o único evento ativo.
    */

    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title: eventTitle.trim(),
      type: eventType,
      periodo: eventPeriodo.trim(),
      description: eventDescription.trim(),
      rewardXp: Math.max(0, Number(eventXp) || 0),
      rewardCoins: Math.max(
        0,
        Number(eventCoins) || 0
      ),
      active: true,
    };

    setEvents((prev) => [
      ...prev.map((event) => ({
        ...event,
        active: false,
      })),
      newEvent,
    ]);

    triggerToast(
      "🐉 Evento / Boss Raid invocado com sucesso para toda a turma!"
    );

    setEventTitle("");
    setEventPeriodo("");
    setEventDescription("");
    setEventXp("500");
    setEventCoins("200");
  }

  /* ============================================================
     CRIAR QUEST
  ============================================================ */

  function handleCreateQuest(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !questTitle.trim() ||
      !questPeriodo.trim() ||
      !questRequirement.trim()
    ) {
      triggerToast(
        "âš ï¸ Preencha os campos obrigatórios da Quest."
      );

      return;
    }

    /*
      Se "todos" estiver selecionado, criamos uma missão
      para cada aluno cadastrado.

      Assim o professor consegue criar um objetivo
      coletivo sem quebrar a regra de recompensa individual.
    */

    const selectedStudent =
      questStudentId !== "all"
        ? students.find(
            (student) =>
              student.id === questStudentId
          )
        : null;

    if (
      questStudentId !== "all" &&
      !selectedStudent
    ) {
      triggerToast(
        "âš ï¸ Não foi possível localizar o aluno selecionado."
      );

      return;
    }

    const studentsToReceive =
      questStudentId === "all"
        ? students
        : selectedStudent
        ? [selectedStudent]
        : [];

    if (studentsToReceive.length === 0) {
      triggerToast(
        "âš ï¸ Cadastre pelo menos um aluno antes de criar uma Quest."
      );

      return;
    }

    const newQuests: Quest[] =
      studentsToReceive.map(
        (student, index) => ({
          id: `quest-${Date.now()}-${index}`,
          title: questTitle.trim(),
          icon: "🎯",
          periodo: questPeriodo.trim(),
          categoria: questCategory,
          requirement:
            questRequirement.trim(),
          xpReward: Math.max(
            0,
            Number(questXp) || 0
          ),
          coinReward: Math.max(
            0,
            Number(questCoins) || 0
          ),
          status: "Em andamento",
          progress: 0,
          maxProgress: 1,
          studentId: student.id,
          studentName: student.name,
        })
      );

    setQuests((prev) => [
      ...newQuests,
      ...prev,
    ]);

    triggerToast(
      `🎯 Quest publicada para ${newQuests.length} aventureiro(s)!`
    );

    setQuestTitle("");
    setQuestPeriodo("");
    setQuestRequirement("");
    setQuestXp("150");
    setQuestCoins("50");
    setQuestStudentId("all");
  }

  return (
    <section className="space-y-6">
      {/* ======================================================
          TOAST
      ====================================================== */}

      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-sm rounded-2xl border border-amber-500 bg-[#161c14] p-4 text-xs font-black text-amber-300 shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* ======================================================
          CABEÇALHO DO PROFESSOR
      ====================================================== */}

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
                ⚙️ Portal de Comando do Narrador
              </div>

              <h2 className="text-3xl font-black text-white">
                Professor(a) Arcano
              </h2>

              <p className="text-xs text-purple-300/80 mt-0.5">
                Turma:{" "}
                <strong className="text-white">
                  9º Ano A - Guilda dos
                  Exploradores
                </strong>
              </p>
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

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-purple-900/60 pt-6">
          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/30 p-3.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-purple-300">
              <span>Engajamento do Reino</span>
              <span>88% XP</span>
            </div>

            <div className="mt-2 text-xl font-black text-purple-200">
              Nível Coletivo 14
            </div>

            <div className="mt-2 h-2 w-full bg-purple-950 rounded-full overflow-hidden border border-purple-900">
              <div className="h-full bg-purple-500 rounded-full w-[88%]" />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/30 p-3.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-emerald-400">
              <span>Frequência / Mana da Sala</span>
              <span>94% Presença</span>
            </div>

            <div className="mt-2 text-xl font-black text-emerald-300">
              {students.length} Alunos Cadastrados
            </div>

            <div className="mt-2 h-2 w-full bg-emerald-950 rounded-full overflow-hidden border border-emerald-900">
              <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
            </div>
          </div>

          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/30 p-3.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-amber-400">
              <span>Desempenho Geral (HP)</span>
              <span>8.2 Média</span>
            </div>

            <div className="mt-2 text-xl font-black text-amber-300">
              Status Adequado
            </div>

            <div className="mt-2 h-2 w-full bg-amber-950 rounded-full overflow-hidden border border-amber-900">
              <div className="h-full bg-amber-500 rounded-full w-[82%]" />
            </div>
          </div>
        </div>
      </div>

            {/* ======================================================
          PAINEL DO PROFESSOR
      ====================================================== */}

      <div className="flex flex-col md:flex-row gap-5">

        <TeacherSidebar
          activeTab={teacherTab}
          onChange={setTeacherTab}
        />

        <div className="flex-1 min-w-0">
{/* ======================================================
          MAPA ACADÊMICO DO PROFESSOR
      ====================================================== */}

      {teacherTab === "map" && (
        <div className="space-y-5">

          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 to-slate-900 p-6 shadow-xl">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">
                  Ãrea exclusiva do professor
                </div>

                <h3 className="mt-1 text-2xl font-black text-white">
                  🗺️ Mapa da Reputação Acadêmica
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-400 max-w-2xl">
                  Selecione uma região do mapa para acompanhar o
                  desempenho acadêmico e editar as notas dos quatro
                  bimestres dos alunos.
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-emerald-500/30 bg-slate-950/60 px-5 py-3 text-center">

                <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Modo atual
                </div>

                <div className="mt-1 text-xs font-black text-emerald-400">
                  ✏️ PROFESSOR
                </div>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-2 sm:p-4 shadow-2xl">

  <AdventureMap
    mode="teacher"
    students={students.map((student) => ({
      id: student.id,
      name: student.name,
      grades: student.grades,
    }))}
  />

</div>

        </div>
      )}

      {/* ======================================================
          VISÃO GERAL
      ====================================================== */}

      {teacherTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-4">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <span>🛡️</span>
                Distribuição da Turma por Proficiência
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-purple-400">
                      🟣 Avançado (9.0 - 10.0)
                    </span>
                    <span className="text-slate-300">
                      12 alunos (40%)
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-purple-500 w-[40%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-green-400">
                      🟢 Adequado (7.0 - 8.9)
                    </span>
                    <span className="text-slate-300">
                      11 alunos (36%)
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-green-500 w-[36%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-orange-400">
                      ðŸŸ  Básico (5.0 - 6.9)
                    </span>
                    <span className="text-slate-300">
                      5 alunos (17%)
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-orange-500 w-[17%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-red-400">
                      🔴 Abaixo do Básico (0.0 - 4.9)
                    </span>
                    <span className="text-slate-300">
                      2 alunos (7%)
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-red-500 w-[7%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-4">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <span>⚡</span>
                Feitos Recentes do Reino
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      ðŸ†
                    </span>

                    <div>
                      <strong className="text-white block">
                        Beatriz Oliveira
                      </strong>

                      <span className="text-slate-400">
                        Conquistou a insígnia
                        &quot;Arquimaga das Letras&quot;
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    Há 15m
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      ⚔️
                    </span>

                    <div>
                      <strong className="text-white block">
                        Guilda dos Exploradores
                      </strong>

                      <span className="text-slate-400">
                        Derrotou 70% da barra de HP do
                        Boss de Geometria
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    Há 2h
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      ☀️
                    </span>

                    <div>
                      <strong className="text-white block">
                        Arthur Pendelton
                      </strong>

                      <span className="text-slate-400">
                        Completou a Missão Diária
                        &quot;Mestre da Frequência&quot;
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    Há 4h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

   {/* ======================================================
    MURAL DE VALIDAÇÃO
    EXCLUSIVO DO PROFESSOR
    ESTILO MURAL DE QUESTS DA TAVERNA
====================================================== */}

{teacherTab === "validation" && (
  <div className="space-y-6">

    {/* CABEÇALHO DO MURAL */}
    <div className="rounded-2xl border border-purple-500/20 bg-[#11150f] p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400">
            📜 Quadro de Missões do Mestre
          </div>

          <h3 className="text-2xl font-black text-white mt-1">
            Mural de Validação
          </h3>

          <p className="text-xs text-slate-500 mt-2 max-w-2xl">
            Revise as missões concluídas pelos aventureiros.
            O Mestre é responsável por confirmar a realização
            e conceder as recompensas de XP e Priantinas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-2 text-center">
            <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-black">
              Ativas
            </div>

            <div className="text-lg font-black text-white">
              {
                quests.filter(
                  (quest) =>
                    quest.status === "Em andamento"
                ).length
              }
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 px-4 py-2 text-center">
            <div className="text-[9px] uppercase tracking-wider text-amber-400 font-black">
              Finalizadas
            </div>

            <div className="text-lg font-black text-white">
              {
                quests.filter(
                  (quest) =>
                    quest.status === "Concluido"
                ).length
              }
            </div>
          </div>
        </div>

      </div>
    </div>


    {/* ==================================================
        LISTAGEM DAS QUESTS
    ================================================== */}

    {quests.length === 0 ? (

      <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-12 text-center">

        <div className="text-5xl mb-4">
          ðŸšï¸
        </div>

        <h3 className="text-lg font-black text-white">
          O mural está vazio
        </h3>

        <p className="text-xs text-slate-500 mt-2">
          Nenhuma missão foi publicada pelo Mestre ainda.
        </p>

      </div>

    ) : (

      <div className="space-y-7">

        {quests.map((quest) => {

          /*
            Identifica os alunos relacionados Ã  Quest.

            Se a Quest for destinada a "all", todos os alunos
            aparecem dentro da ficha.

            Caso contrário, somente o aluno destinatário
            aparece.
          */

          const questStudents =
            quest.studentId === "all"
              ? students
              : students.filter(
                  (student) =>
                    student.id === quest.studentId
                );

          return (

            <section
              key={quest.id}
              className="relative overflow-hidden rounded-3xl border border-amber-700/30 bg-gradient-to-br from-[#1b2118] via-[#11150f] to-[#0b0e0b] shadow-2xl"
            >

              {/* DETALHE DECORATIVO SUPERIOR */}

              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-700 via-purple-500 to-amber-700" />

              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />


              {/* ==================================================
                  CABEÇALHO DA QUEST
              ================================================== */}

              <div className="p-5 sm:p-7 border-b border-slate-800/80">

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  {/* TÃTULO */}

                  <div className="flex items-start gap-4">

                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-center text-3xl shadow-lg">
                      {quest.icon}
                    </div>

                    <div>

                      <div className="text-[9px] uppercase tracking-[0.25em] text-amber-500 font-black">
                        Quest do Reino
                      </div>

                      <h4 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                        {quest.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 mt-2">

                        <span className="rounded-md border border-purple-500/30 bg-purple-950/30 px-2 py-1 text-[10px] font-bold text-purple-300">
📜 {quest.categoria}
                        </span>

                        <span className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-[10px] font-bold text-slate-400">
                          📅 {quest.periodo}
                        </span>

                        <span
                          className={`rounded-md border px-2 py-1 text-[10px] font-bold ${
                            quest.status === "Concluido"
                              ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                              : quest.status === "Encerrado"
                              ? "border-rose-500/40 bg-rose-950/40 text-rose-400"
                              : "border-amber-500/40 bg-amber-950/40 text-amber-300"
                          }`}
                        >
                          {quest.status === "Concluido"
                            ? "✓ Concluída"
                            : quest.status === "Encerrado"
                            ? "🚫 Encerrada"
                            : "⚔️ Em andamento"}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* RECOMPENSAS */}

                  <div className="flex items-center gap-2 shrink-0">

                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-2 text-center min-w-[90px]">
                      <div className="text-[9px] uppercase tracking-wider text-amber-500 font-black">
                        Experiência
                      </div>

                      <div className="text-sm font-black text-amber-300 mt-0.5">
                        ✨ {quest.xpReward} XP
                      </div>
                    </div>

                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-950/20 px-4 py-2 text-center min-w-[90px]">
                      <div className="text-[9px] uppercase tracking-wider text-yellow-500 font-black">
                        Recompensa
                      </div>

                      <div className="text-sm font-black text-yellow-300 mt-0.5">
                        🪙 {quest.coinReward}
                      </div>
                    </div>

                  </div>

                </div>


                {/* REQUISITO DA QUEST */}

                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                  <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">
                    Objetivo da Missão
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {quest.requirement}
                  </p>

                </div>

              </div>


              {/* ==================================================
                  ÃREA DOS AVENTUREIROS
              ================================================== */}

              <div className="p-5 sm:p-7">

                <div className="flex items-center justify-between gap-3 mb-4">

                  <div>

                    <div className="text-[9px] uppercase tracking-[0.25em] text-purple-400 font-black">
                      Registro dos Aventureiros
                    </div>

                    <h5 className="text-sm font-black text-white mt-1">
                      Participantes da Quest
                    </h5>

                  </div>

                  <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                    👥 {questStudents.length}{" "}
                    {questStudents.length === 1
                      ? "aventureiro"
                      : "aventureiros"}
                  </span>

                </div>


                {questStudents.length === 0 ? (

                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center">

                    <div className="text-3xl">
                      ðŸšï¸
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      Nenhum aventureiro foi vinculado
                      a esta Quest.
                    </p>

                  </div>

                ) : (

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                    {questStudents.map((student) => (

                      <div
                        key={`${quest.id}-${student.id}`}
                        className="group relative rounded-2xl border border-slate-800 bg-[#0d120d] p-4 transition-all duration-200 hover:border-amber-500/30 hover:bg-[#11170f] hover:-translate-y-0.5"
                      >

                        {/* MINI CABEÇALHO DO ALUNO */}

                        <div className="flex items-center gap-3">

                          <div className="relative shrink-0">

                            <div className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center text-2xl shadow-lg">
                              {student.avatar}
                            </div>

                            <div className="absolute -bottom-1 -right-1 rounded-md border border-slate-800 bg-slate-950 px-1 text-[8px] font-black text-amber-400">
                              {student.level}
                            </div>

                          </div>

                          <div className="min-w-0">

                            <div className="font-black text-sm text-white truncate">
                              {student.name}
                            </div>

                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              {student.turma ||
                                "Sem Turma"}
                            </div>

                          </div>

                        </div>


                        {/* STATUS INDIVIDUAL */}

                        <div className="mt-4">

                          {quest.status === "Concluido" ? (

                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-2">

                              <div className="flex items-center justify-between">

                                <span className="text-[9px] uppercase tracking-wider font-black text-emerald-400">
                                  Missão Validada
                                </span>

                                <span className="text-sm">
                                  ✓
                                </span>

                              </div>

                              <div className="text-[10px] text-emerald-300/70 mt-1">
                                Recompensa concedida pelo Mestre.
                              </div>

                            </div>

                          ) : quest.status === "Encerrado" ? (

                            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 px-3 py-2">

                              <div className="flex items-center justify-between">

                                <span className="text-[9px] uppercase tracking-wider font-black text-rose-400">
                                  Quest Encerrada
                                </span>

                                <span className="text-sm">
                                  🚫
                                </span>

                              </div>

                              <div className="text-[10px] text-rose-300/70 mt-1">
                                Ciclo finalizado sem recompensa.
                              </div>

                            </div>

                          ) : (

                            <div className="space-y-2">

                              <div className="flex items-center justify-between">

                                <span className="text-[9px] uppercase tracking-wider font-black text-amber-500">
                                  Aguardando Validação
                                </span>

                                <span className="text-[9px] font-bold text-slate-500">
                                  {quest.status}
                                </span>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleValidateQuest(
                                    quest.id,
                                    "Concluido"
                                  )
                                }
                                className="w-full rounded-xl border border-emerald-500/30 bg-emerald-600/10 px-3 py-2.5 text-[10px] font-black text-emerald-300 hover:bg-emerald-600/20 hover:border-emerald-400/50 transition shadow-sm"
                              >
                                🎓 Conceder Recompensa
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleValidateQuest(
                                    quest.id,
                                    "Encerrado"
                                  )
                                }
                                className="w-full rounded-xl border border-rose-500/20 bg-rose-950/20 px-3 py-2 text-[10px] font-bold text-rose-400 hover:bg-rose-900/30 transition"
                              >
                                🚫 Encerrar Quest
                              </button>

                            </div>

                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>


              {/* ==================================================
                  RODAPÉ DA QUEST
              ================================================== */}

              <div className="border-t border-slate-800/80 bg-slate-950/20 px-5 sm:px-7 py-3">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                  <div className="text-[9px] text-slate-600 font-bold">
                    ⚔️ Registro oficial do Reino do Conhecimento
                  </div>

                  <div className="text-[9px] text-slate-500">
                    Recompensa individual:
                    <span className="text-amber-400 font-black ml-1">
                      ✨ {quest.xpReward} XP
                    </span>
                    <span className="text-yellow-400 font-black ml-2">
                      🪙 {quest.coinReward} Priantinas
                    </span>
                  </div>

                </div>

              </div>

            </section>

          );

        })}

      </div>

    )}

  </div>
)}
      {/* ======================================================
          GRIMÓRIO DE NOTAS
      ====================================================== */}

      {teacherTab === "grades" && (
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-[#11150f] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">
                Lançamento Rápido
              </div>

              <h3 className="text-xl font-black text-white">
                Grimório de Notas e HP dos
                Aventureiros
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-400">
                Disciplina:
              </label>

              <select
                value={selectedSubject}
                onChange={(e) =>
                  setSelectedSubject(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-purple-500"
              >
                {allCurricularSubjects.map(
                  (subjectName) => {
                    const subjectInfo =
                      subjects.find(
                        (subject) =>
                          subject.name ===
                          subjectName
                      );

                    return (
                      <option
                        key={subjectName}
                        value={subjectName}
                      >
                        {subjectInfo?.icon ||
                          "📚"}{" "}
                        {subjectName}
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">
                    Estudante / Título
                  </th>

                  <th className="p-3 text-center">
                    Turma
                  </th>

                  <th className="p-3 text-center">
                    1º Bim
                  </th>

                  <th className="p-3 text-center">
                    2º Bim
                  </th>

                  <th className="p-3 text-center">
                    3º Bim
                  </th>

                  <th className="p-3 text-center">
                    4º Bim
                  </th>

                  <th className="p-3 text-center">
                    Média / Status
                  </th>

                  <th className="p-3 text-center">
                    Ações de Mestre
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {students.map((student) => {
                  const studentGrades =
                    student.grades[
                      selectedSubject
                    ] ||
                    createEmptyGrades();

                  const avg =
                    calculateAverage(
                      studentGrades
                    );

                  const perf =
                    getPerformanceLevel(avg);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-900/30 transition"
                    >
                      <td className="p-3 font-bold text-white">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                            {student.avatar}
                          </span>

                          <div>
                            <div className="font-black text-sm">
                              {student.name}
                            </div>

                            <div className="text-[10px] text-purple-400 font-normal">
                              Nível{" "}
                              {student.level}{" "}
                              •{" "}
                              {student.badge}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-purple-300">
                          {student.turma ||
                            "Sem Turma"}
                        </span>
                      </td>

                      {[0, 1, 2, 3].map(
                        (bimIdx) => (
                          <td
                            key={bimIdx}
                            className="p-3 text-center"
                          >
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={
                                studentGrades[
                                  bimIdx
                                ]
                              }
                              onChange={(e) =>
                                handleStudentGradeChange(
                                  student.id,
                                  bimIdx,
                                  e.target.value
                                )
                              }
                              placeholder="--"
                              className="w-14 rounded-lg border border-slate-800 bg-slate-950 py-1.5 text-center font-black text-white outline-none focus:border-purple-500"
                            />
                          </td>
                        )
                      )}

                      <td className="p-3 text-center">
                        <div className="font-black text-sm text-white">
                          {avg > 0
                            ? avg.toFixed(1)
                            : "--"}
                        </div>

                        <div
                          className={`mt-0.5 inline-block px-2 py-0.5 rounded text-[9px] font-bold ${getPerformanceClass(
                            perf
                          )}`}
                        >
                          {getPerformanceIcon(
                            perf
                          )}{" "}
                          {perf}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            rewardStudent(
                              student.id
                            )
                          }
                          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black text-amber-300 hover:bg-amber-500/20 transition"
                        >
                          🎓 Bônus
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

      {/* ======================================================
          CRIAR EVENTO
      ====================================================== */}

      {teacherTab === "create_event" && (
        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">
              Invocação de Desafios
            </div>

            <h3 className="text-xl font-black text-white">
              Criar Evento ou Boss Raid da Semana
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Defina um desafio de tempo limitado
              com período para unir a turma.
            </p>
          </div>

          <form
            onSubmit={handleCreateEvent}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Título do Evento / Chefão
              </label>

              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) =>
                  setEventTitle(e.target.value)
                }
                placeholder="Ex: O Guardião dos Polígonos de Ouro"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Tipo de Evento
              </label>

              <select
                value={eventType}
                onChange={(e) =>
                  setEventType(e.target.value)
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              >
                <option value="Boss Raid">
                  🐉 Boss Raid (Batalha em
                  Equipe)
                </option>

                <option value="Maratona">
                  📜 Maratona do Conhecimento
                </option>

                <option value="Feira">
                  ⚙️ Feira / Exposição
                </option>

                <option value="Especial">
                  ✨ Evento Especial
                </option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-300">
                Período do Evento
              </label>

              <input
                type="text"
                required
                value={eventPeriodo}
                onChange={(e) =>
                  setEventPeriodo(
                    e.target.value
                  )
                }
                placeholder="Ex: 1º Bimestre, Até 25/10, Semanal..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Descrição do Desafio
              </label>

              <textarea
                rows={3}
                required
                value={eventDescription}
                onChange={(e) =>
                  setEventDescription(
                    e.target.value
                  )
                }
                placeholder="Descreva as tarefas que a turma precisa realizar para derrotar o chefão..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Recompensa de XP Coletivo
              </label>

              <input
                type="number"
                min="0"
                value={eventXp}
                onChange={(e) =>
                  setEventXp(e.target.value)
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Recompensa de Moedas
                (Priantinas)
              </label>

              <input
                type="number"
                min="0"
                value={eventCoins}
                onChange={(e) =>
                  setEventCoins(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-xs font-black text-white shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                🔥 Lançar Evento para a
                Turma
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================
          CRIAR QUEST
      ====================================================== */}

      {teacherTab === "quests" && (
        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">
              Quadro do Mestre
            </div>

            <h3 className="text-xl font-black text-white">
              Cadastrar Nova Missão (Quest)
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Adicione objetivos e configure o
              período de realização para os
              estudantes.
            </p>
          </div>

          <form
            onSubmit={handleCreateQuest}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Título da Quest
              </label>

              <input
                type="text"
                required
                value={questTitle}
                onChange={(e) =>
                  setQuestTitle(
                    e.target.value
                  )
                }
                placeholder="Ex: Leitor Compulsivo"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Categoria da Missão
              </label>

              <select
                value={questCategory}
                onChange={(e) =>
                  setQuestCategory(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              >
                <option value="Diário">
                  ☀️ Diário
                </option>

                <option value="Semanal">
                  📅 Semanal
                </option>

                <option value="Mensal">
                  🗓️ Mensal
                </option>

                <option value="Especial (Mensal)">
                  🌟 Especial (Mensal)
                </option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-300">
                Aventureiro / Destinatário
              </label>

              <select
                value={questStudentId}
                onChange={(e) =>
                  setQuestStudentId(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              >
                <option value="all">
                  👥 Todos os alunos
                </option>

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.avatar}{" "}
                    {student.name} —{" "}
                    {student.turma}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-300">
                Período da Atividade / Missão
              </label>

              <input
                type="text"
                required
                value={questPeriodo}
                onChange={(e) =>
                  setQuestPeriodo(
                    e.target.value
                  )
                }
                placeholder="Ex: 1º Bimestre, Até 20/05, Semanal..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Instruções / Requisitos
              </label>

              <input
                type="text"
                required
                value={questRequirement}
                onChange={(e) =>
                  setQuestRequirement(
                    e.target.value
                  )
                }
                placeholder="Ex: Tirar nota maior que 8.0 em pelo menos 2 avaliações no período."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Premiação em XP
              </label>

              <input
                type="number"
                min="0"
                value={questXp}
                onChange={(e) =>
                  setQuestXp(e.target.value)
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Premiação em Moedas
              </label>

              <input
                type="number"
                min="0"
                value={questCoins}
                onChange={(e) =>
                  setQuestCoins(
                    e.target.value
                  )
                }
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



{teacherTab === "conduta" && (
  <CondutaProfessor alunos={students} />
)}

      {/* ======================================================
          ENTURMAR ALUNOS
      ====================================================== */}

      {teacherTab === "enturmar" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">
                Invocação de Aventureiros
              </div>

              <h3 className="text-xl font-black text-white">
                Enturmar Novo Aluno
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Cadastre e atribua estudantes Ã s
                suas respectivas turmas para
                liberá-los no reino.
              </p>
            </div>

            <form
              onSubmit={handleAddStudent}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Nome Completo do Aluno
                </label>

                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) =>
                    setNewStudentName(
                      e.target.value
                    )
                  }
                  placeholder="Ex: Gabriel Santos"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Turma (Digitável)
                </label>

                <input
                  type="text"
                  required
                  value={newStudentClass}
                  onChange={(e) =>
                    setNewStudentClass(
                      e.target.value
                    )
                  }
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

          <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>👥</span>
              Alunos Cadastrados no Reino (
              {students.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">
                      Nome do Aluno
                    </th>

                    <th className="p-3 text-center">
                      Turma
                    </th>

                    <th className="p-3 text-center">
                      Nível
                    </th>

                    <th className="p-3 text-center">
                      Insígnia
                    </th>

                    <th className="p-3 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60">
                  {students.map((student) => {
                    const isEditing =
                      editingStudentId ===
                      student.id;

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-900/30 transition"
                      >
                        <td className="p-3 font-bold text-white">
                          <div className="flex items-center gap-3">
                            <span className="text-xl p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              {student.avatar}
                            </span>

                            {isEditing ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) =>
                                  setEditName(
                                    e.target
                                      .value
                                  )
                                }
                                className="rounded-lg border border-purple-500 bg-slate-950 px-2 py-1 text-xs text-white outline-none w-full"
                              />
                            ) : (
                              <span className="font-black">
                                {student.name}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3 text-center">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editClass}
                              onChange={(e) =>
                                setEditClass(
                                  e.target
                                    .value
                                )
                              }
                              className="rounded-lg border border-purple-500 bg-slate-950 px-2 py-1 text-xs text-white outline-none w-28 text-center"
                            />
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/50 text-[10px] font-bold text-purple-300">
                              {student.turma ||
                                "Sem Turma"}
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-center font-bold text-amber-400">
                          Lvl{" "}
                          {student.level}
                        </td>

                        <td className="p-3 text-center text-slate-400">
                          {student.badge}
                        </td>

                        <td className="p-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveEdit(
                                    student.id
                                  )
                                }
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-bold transition"
                              >
                                ✓ Salvar
                              </button>

                              <button
                                type="button"
                                onClick={
                                  handleCancelEdit
                                }
                                className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 text-[10px] font-bold transition"
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleStartEdit(
                                    student
                                  )
                                }
                                className="rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-2 py-1 text-[10px] font-bold transition"
                                title="Editar Nome e Turma"
                              >
                                ✏️ Editar
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteStudent(
                                    student.id,
                                    student.name
                                  )
                                }
                                className="rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-2 py-1 text-[10px] font-bold transition"
                                title="Remover Aluno"
                              >
                                🗑️
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
    
        </div>
      </div>    </section>
  );
}

/* ============================================================
   PÃGINA PRINCIPAL
============================================================ */

function DeveloperPanel() {
  const [escolas, setEscolas] = useState<
    {
      id: string;
      nome: string;
      codigo: string;
      ativa: boolean;
      criado_em: string;
    }[]
  >([]);

  const [carregandoEscolas, setCarregandoEscolas] =
    useState(true);

  const [mensagem, setMensagem] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [nomeEscola, setNomeEscola] =
    useState("");

  const [codigoEscola, setCodigoEscola] =
    useState("");

  const [salvando, setSalvando] =
    useState(false);

  async function carregarEscolas() {
    setCarregandoEscolas(true);
    setMensagem("");

    const { data, error } = await supabase
      .from("escolas")
      .select("id, nome, codigo, ativa, criado_em")
      .order("nome", { ascending: true });

    if (error) {
      console.error(
        "Erro ao carregar escolas:",
        error
      );

      setMensagem(
        "Não foi possível carregar as escolas."
      );

      setEscolas([]);
    } else {
      setEscolas(data || []);
    }

    setCarregandoEscolas(false);
  }

  useEffect(() => {
    carregarEscolas();
  }, []);

  async function adicionarEscola(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const nome = nomeEscola.trim();
    const codigo = codigoEscola.trim();

    if (!nome || !codigo) {
      setMensagem(
        "Preencha o nome e o código da escola."
      );
      return;
    }

    setSalvando(true);
    setMensagem("");

    const { error } = await supabase
      .from("escolas")
      .insert({
        nome,
        codigo,
        ativa: true,
      });

    if (error) {
      console.error(
        "Erro ao adicionar escola:",
        error
      );

      setMensagem(
        error.code === "23505"
          ? "Esse código de escola já está cadastrado."
          : "Não foi possível cadastrar a escola."
      );

      setSalvando(false);
      return;
    }

    setNomeEscola("");
    setCodigoEscola("");
    setMostrarFormulario(false);
    setMensagem("Escola cadastrada com sucesso!");

    setSalvando(false);

    await carregarEscolas();
  }

  async function alterarStatusEscola(
    escola: {
      id: string;
      nome: string;
      ativa: boolean;
    }
  ) {
    const novoStatus = !escola.ativa;

    const confirmar = window.confirm(
      novoStatus
        ? `Deseja ativar a escola "${escola.nome}"?`
        : `Deseja desativar a escola "${escola.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    setMensagem("");

    const { error } = await supabase
      .from("escolas")
      .update({
        ativa: novoStatus,
      })
      .eq("id", escola.id);

    if (error) {
      console.error(
        "Erro ao alterar status da escola:",
        error
      );

      setMensagem(
        "Não foi possível alterar o status da escola."
      );

      return;
    }

    setMensagem(
      novoStatus
        ? "Escola ativada com sucesso!"
        : "Escola desativada com sucesso!"
    );

    await carregarEscolas();
  }

  return (
    <section className="space-y-6">

      {/* ======================================================
          CABEÇALHO
      ====================================================== */}

      <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#1b1e17] via-[#11150f] to-[#0a0d0a] p-6 sm:p-8 shadow-2xl">

        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">
          👑 Administração da Plataforma
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="mt-2 text-3xl font-black text-white">
              Painel do Desenvolvedor
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Administração das escolas do Aventureiro Pedagógico.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMensagem("");
              setMostrarFormulario(
                (valor) => !valor
              );
            }}
            className="rounded-xl border border-amber-700/60 bg-amber-950/40 px-5 py-3 text-xs font-black uppercase tracking-wider text-amber-300 transition hover:bg-amber-900/50"
          >
            {mostrarFormulario
              ? "✕ Fechar"
              : "＋ Adicionar Escola"}
          </button>

        </div>
      </div>


      {/* ======================================================
          MENSAGEM
      ====================================================== */}

      {mensagem && (
        <div className="rounded-xl border border-slate-800 bg-[#11150f] px-4 py-3 text-sm font-bold text-slate-300">
          {mensagem}
        </div>
      )}


      {/* ======================================================
          FORMULÁRIO
      ====================================================== */}

      {mostrarFormulario && (
        <form
          onSubmit={adicionarEscola}
          className="rounded-3xl border border-amber-900/30 bg-[#11150f] p-6 shadow-xl"
        >

          <div className="mb-5">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
              Nova Escola
            </div>

            <h2 className="mt-1 text-xl font-black text-white">
              Cadastrar escola
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-400">
                Nome da escola
              </label>

              <input
                type="text"
                value={nomeEscola}
                onChange={(event) =>
                  setNomeEscola(
                    event.target.value
                  )
                }
                placeholder="Ex.: Escola José Maria Priante"
                className="w-full rounded-xl border border-slate-700 bg-[#0a0d0a] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-400">
                Código da escola
              </label>

              <input
                type="text"
                value={codigoEscola}
                onChange={(event) =>
                  setCodigoEscola(
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="Ex.: JMP-001"
                className="w-full rounded-xl border border-slate-700 bg-[#0a0d0a] px-4 py-3 text-sm uppercase text-white outline-none transition focus:border-amber-600"
              />
            </div>

          </div>

          <div className="mt-5 flex justify-end">

            <button
              type="submit"
              disabled={salvando}
              className="rounded-xl border border-emerald-700/60 bg-emerald-950/40 px-5 py-3 text-xs font-black uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-900/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando
                ? "Cadastrando..."
                : "✓ Cadastrar Escola"}
            </button>

          </div>

        </form>
      )}


      {/* ======================================================
          LISTA DE ESCOLAS
      ====================================================== */}

      <div className="rounded-3xl border border-slate-800 bg-[#11150f] p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between gap-4">

          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Cadastro da Plataforma
            </div>

            <h2 className="mt-1 text-2xl font-black text-white">
              Escolas
            </h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0a0d0a] px-4 py-2 text-xs font-black text-slate-400">
            {escolas.length}{" "}
            {escolas.length === 1
              ? "escola"
              : "escolas"}
          </div>

        </div>


        {carregandoEscolas ? (

          <div className="rounded-2xl border border-slate-800 bg-[#0a0d0a] p-8 text-center">

            <div className="text-3xl">
              ⚔️
            </div>

            <div className="mt-2 text-sm font-bold text-slate-400">
              Carregando escolas...
            </div>

          </div>

        ) : escolas.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-700 bg-[#0a0d0a] p-10 text-center">

            <div className="text-4xl">
              🏫
            </div>

            <h3 className="mt-3 font-black text-white">
              Nenhuma escola cadastrada
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Use o botão acima para cadastrar a primeira escola.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {escolas.map((escola) => (

              <div
                key={escola.id}
                className="rounded-2xl border border-slate-800 bg-[#0a0d0a] p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-[#11150f] text-2xl">
                      🏫
                    </div>

                    <div>
                      <h3 className="font-black text-white">
                        {escola.nome}
                      </h3>

                      <p className="mt-1 text-xs font-bold text-slate-500">
                        Código: {escola.codigo}
                      </p>
                    </div>

                  </div>

                  <div
                    className={
                      escola.ativa
                        ? "rounded-lg border border-emerald-800/60 bg-emerald-950/30 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-400"
                        : "rounded-lg border border-red-800/60 bg-red-950/30 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-red-400"
                    }
                  >
                    {escola.ativa
                      ? "Ativa"
                      : "Inativa"}
                  </div>

                </div>


                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800 pt-4">

                  <span className="text-[10px] text-slate-600">
                    Cadastrada em{" "}
                    {new Date(
                      escola.criado_em
                    ).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      alterarStatusEscola(
                        escola
                      )
                    }
                    className={
                      escola.ativa
                        ? "rounded-lg border border-red-800/50 bg-red-950/20 px-3 py-2 text-[10px] font-black uppercase text-red-400 transition hover:bg-red-900/30"
                        : "rounded-lg border border-emerald-800/50 bg-emerald-950/20 px-3 py-2 text-[10px] font-black uppercase text-emerald-400 transition hover:bg-emerald-900/30"
                    }
                  >
                    {escola.ativa
                      ? "Desativar"
                      : "Ativar"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default function Home() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authNome, setAuthNome] = useState("");

const [equipamentoHead, setEquipamentoHead] =
  useState<string | undefined>();

const [equipamentoSkin, setEquipamentoSkin] =
  useState<string | undefined>();

const [equipamentoBuddy, setEquipamentoBuddy] =
  useState<string | undefined>();

const [itensComprados, setItensComprados] =
  useState<string[]>([]);

  const [role, setRole] =
    useState<UserRole | null>(null);

  const [equippedAchievements, setEquippedAchievements] =
    useState<string[]>([]);

  const [activeTab, setActiveTab] =
    useState<string>("inicio");

  const [students, setStudents] =
    useState<StudentRecord[]>(
      mockClassStudents
    );

  const [selectedStudentId, setSelectedStudentId] =
    useState<string>("s1");

const [condutas, setCondutas] = useState<any[]>([]);

useEffect(() => {
  try {
    const salvo = localStorage.getItem("aventureiro-conduta");

    if (salvo) {
      setCondutas(JSON.parse(salvo));
    }
  } catch {
    setCondutas([]);
  }
}, []);

const [quests, setQuests] =
  useState<Quest[]>(initialQuests);

const [events, setEvents] =
  useState<EventItem[]>(mockEvents);

  function handleToggleEquip(id: string) {
    setEquippedAchievements((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, id];
    });
  }

function handleComprarItem(item: {
  id: string;
  preco: number;
}) {
  if (itensComprados.includes(item.id)) {
    return;
  }

  if (currentStudent.coins < item.preco) {
    return;
  }

  setItensComprados((prev) => [
    ...prev,
    item.id,
  ]);

  setStudents((prev) =>
    prev.map((student) =>
      student.id === currentStudent.id
        ? {
            ...student,
            coins: student.coins - item.preco,
          }
        : student
    )
  );
}

  /*
    Notas utilizadas pelo mapa.

    Mantemos o estado no Home para que o mapa
    continue funcionando como antes.
  */

  const [grades, setGrades] = useState<
    Record<string, number>
  >({
    "Língua Portuguesa": 92,
    "Língua Inglesa": 79,
    Matemática: 88,
    História: 95,
    Geografia: 97,
    "Educação Física": 86,
    Artes: 91,
    Ciências: 84,
    "Projeto de Vida": 90,
    Tecnologia: 94,
    "Educação Financeira": 87,
    Robótica: 89,
    "Orientação de Estudos de Português": 85,
    "Orientação de Estudos de Matemática": 83,
  });

  /*
    O aluno selecionado é derivado do estado.
    Assim o XP/moedas mostrados no perfil são
    os valores reais do StudentRecord.
  */

  const selectedStudent =
    useMemo(
      () =>
        students.find(
          (student) =>
            student.id ===
            selectedStudentId
        ) || students[0],
      [students, selectedStudentId]
    );

  /*
    Se um aluno for removido, garantimos que
    ainda exista um aluno válido selecionado.
  */

  const currentStudent =
    selectedStudent || {
      id: "temporary",
      name: "Aventureiro",
      avatar: "🧙‍♂️",
      level: 1,
      xp: 0,
      coins: 0,
      badge: "Iniciante",
      turma: "Sem Turma",
      grades: {},
    };

  useEffect(() => {
    async function carregarPerfil() {
      setAuthLoading(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

if (authError || !authData.user) {
  window.location.href = "/login";
  return;
}

      setAuthUserId(authData.user.id);

      const { data: perfil, error: perfilError } = await supabase
        .from("perfis")
        .select("id, nome, email, tipo")
        .eq("id", authData.user.id)
        .single();

      if (perfilError || !perfil) {
        console.error(
          "Não foi possível carregar o perfil:",
          perfilError
        );

        setAuthNome("");
        setAuthLoading(false);
        return;
      }

setAuthNome(perfil.nome);

if (perfil.tipo === "professor") {
  setRole("teacher");
} else if (perfil.tipo === "aluno") {
  setRole("student");
} else if (perfil.tipo === "gestor") {
  setRole("manager");
} else if (perfil.tipo === "desenvolvedor") {
  setRole("developer");
}

      setAuthLoading(false);
    }

    carregarPerfil();
  }, []);

if (authLoading) {
  return (
    <div className="min-h-screen bg-[#0d100d] text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">⚔️</div>
        <div className="text-sm font-bold text-amber-400">
          Carregando o Reino...
        </div>
      </div>
    </div>
  );
}

if (!authUserId || !role) {
  return null;
}

  return (
    <div className="min-h-screen bg-[#0d100d] text-slate-100 flex flex-col justify-between">
      {/* ======================================================
          CABEÇALHO
      ====================================================== */}

      <header className="border-b border-slate-800 bg-[#11150f] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
<div className="text-2xl">
  {role === "student"
    ? "🧙‍♂️"
    : "🎓"}
</div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-amber-500">
              {role === "student"
                ? "Aventureiro Pedagógico"
                : "Portal Educador"}
            </div>

            <h1 className="text-lg font-black">
              Reino do Conhecimento
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-200">
              {authNome || "Aventureiro"}
            </div>

            <div className="text-[9px] uppercase tracking-widest text-slate-500">
              {role === "teacher"
                ? "Professor"
                : role === "student"
                ? "Aluno"
                : "Gestor"}
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-900/40 transition"
          >
            🚪 Sair
          </button>
        </div>
      </header>

      {/* ======================================================
          CONTEÚDO
      ====================================================== */}

      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {role === "developer" ? (
          <DeveloperPanel />
        ) : role === "teacher" ? (
          <TeacherPanel
            onSwitchRole={() => {}}
            students={students}
            setStudents={setStudents}
            quests={quests}
            setQuests={setQuests}
            events={events}
            setEvents={setEvents}
          />
        ) : role === "manager" ? (
          <ManagerPanel
            students={students}
          />
        ) : (
          <>
{activeTab === "inicio" && (
  <section className="space-y-6">

    {/* ======================================================
        FICHA PRINCIPAL DO AVENTUREIRO
    ====================================================== */}
    <div className="relative overflow-hidden rounded-[2rem] border border-amber-700/40 bg-gradient-to-br from-[#241b0e] via-[#15130e] to-[#0b0d0a] shadow-2xl">

      {/* textura/decoracao superior */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative p-5 sm:p-7 lg:p-8">

        {/* titulo da ficha */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-amber-900/40 pb-4">

          <div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">
              <span>✦</span>
              <span>Guilda do Reino</span>
              <span>✦</span>
            </div>

            <h2 className="mt-1 text-xl sm:text-2xl font-black text-amber-100">
              Ficha do Aventureiro
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-amber-700/30 bg-black/20 px-3 py-2">
            <span className="text-lg">🛡️</span>

            <div>
              <div className="text-[8px] font-black uppercase tracking-wider text-slate-500">
                Patente
              </div>

              <div className="text-xs font-black text-amber-300">
                Aventureiro
              </div>
            </div>
          </div>

        </div>


        {/* corpo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-7 lg:gap-9">

          {/* ==================================================
              RETRATO
          ================================================== */}
          <div className="flex justify-center">

            <div className="relative w-full max-w-[230px]">

              {/* placa externa */}
              <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-b from-amber-500/40 via-amber-700/10 to-transparent blur-[1px]" />

              <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-amber-700/50 bg-[#080a08] shadow-xl">

                {/* topo da placa */}
                <div className="border-b border-amber-900/40 bg-amber-950/20 px-3 py-2 text-center">
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-500">
                    Aventureiro
                  </span>
                </div>

                {/* personagem */}
                <div className="flex h-52 sm:h-56 items-center justify-center bg-gradient-to-b from-[#11150f] to-[#070907]">
                  <AvatarPreview
  className="h-full w-full"
  headSrc={equipamentoHead}
  outfitSrc={equipamentoSkin}
  buddySrc={equipamentoBuddy}
/>
                </div>

                {/* nome da patente */}
                <div className="border-t border-slate-800 bg-black/40 px-3 py-3 text-center">
                  <div className="truncate text-sm font-black text-white">
                    {currentStudent.badge}
                  </div>

                  <div className="mt-1 text-[8px] font-bold uppercase tracking-widest text-slate-500">
                    Título atual
                  </div>
                </div>

              </div>

              {/* pequenos ornamentos */}
              <div className="absolute -left-2 top-10 text-amber-500/50">
                
              </div>

              <div className="absolute -right-2 bottom-10 text-amber-500/50">
                
            </div>

          </div>

 </div>

          {/* ==================================================
              INFORMACOES DO AVENTUREIRO
          ================================================== */}
          <div className="flex min-w-0 flex-col">
            {/* nome */}
            <div>

              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-600">
                Personagem Principal
              </div>

              <h3 className="mt-1 break-words text-3xl sm:text-4xl font-black tracking-tight text-white">
                {currentStudent.name}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-2">

                <span className="text-xs font-bold text-slate-400">
                  {currentStudent.turma}
                </span>

                <span className="text-slate-700">
                  •
                </span>

                <span className="text-xs font-bold text-emerald-400">
                  Jornada acadêmica ativa
                </span>

              </div>

            </div>


            {/* nivel */}
            <div className="mt-7 rounded-2xl border border-amber-800/30 bg-black/20 p-4">

              <div className="flex items-end justify-between gap-4">

                <div>

                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Nível do Aventureiro
                  </div>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400">
                      {currentStudent.level}
                    </span>

                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      nível
                    </span>
                  </div>

                </div>

                <div className="text-right">

                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Experiência
                  </div>

                  <div className="mt-1 text-sm font-black text-emerald-400">
                    {currentStudent.xp} XP
                  </div>

                </div>

              </div>


              {/* barra XP */}
              <div className="mt-4">

                <div className="h-4 overflow-hidden rounded-full border border-slate-700 bg-[#050705] p-[2px] shadow-inner">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 shadow-lg transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (currentStudent.xp % 500) / 5
                      )}%`,
                    }}
                  />

                </div>

                <div className="mt-2 flex justify-between text-[8px] font-bold uppercase tracking-wider text-slate-600">
                  <span>Experiência atual</span>
                  <span>Próximo nível</span>
                </div>

              </div>

            </div>


            {/* atributos */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* moedas */}
              <div className="rounded-2xl border border-amber-600/30 bg-amber-950/20 p-4">

                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-amber-600">
                    Tesouro
                  </span>

                  <span className="text-lg">
                    🪙
                  </span>
                </div>

                <div className="mt-2 text-2xl font-black text-amber-300">
                  {currentStudent.coins}
                </div>

                <div className="text-[9px] font-bold text-slate-500">
                  Priantinas
                </div>

              </div>


              {/* reputacao */}
              <div className="rounded-2xl border border-purple-600/30 bg-purple-950/20 p-4">

                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-purple-400">
                    Reputação
                  </span>

                  <span className="text-lg">
                    
                  </span>
                </div>

                <div className="mt-2 text-2xl font-black text-purple-300">
                  780
                </div>

                <div className="text-[9px] font-bold text-slate-500">
                  de 1000 pontos
                </div>

              </div>


              {/* patente */}
              <div className="rounded-2xl border border-blue-600/30 bg-blue-950/20 p-4">

                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">
                    Classe
                  </span>

                  <span className="text-lg">
                    ⚔️
                  </span>
                </div>

                <div className="mt-2 truncate text-lg font-black text-blue-300">
                  Aventureiro
                </div>

                <div className="text-[9px] font-bold text-slate-500">
                  Classe ativa
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>


    {/* ======================================================
        SELEÇÃO DE AVENTUREIRO — DEMONSTRAÇÃO
    ====================================================== */}
    {students.length > 1 && (
      <div className="rounded-2xl border border-slate-800 bg-[#10140f] p-4 shadow-lg">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
              Modo demonstração
            </div>

            <div className="mt-1 text-xs font-bold text-slate-300">
              Aventureiro conectado
            </div>
          </div>

          <select
            value={currentStudent.id}
            onChange={(e) =>
              setSelectedStudentId(e.target.value)
            }
            className="w-full sm:w-auto rounded-xl border border-slate-700 bg-[#080b08] px-4 py-2.5 text-xs font-bold text-white outline-none transition focus:border-amber-600"
          >
            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.name} — {student.turma}
              </option>
            ))}
          </select>

        </div>

      </div>
    )}


    {/* ======================================================
        PAINÉIS DA GUILDA
    ====================================================== */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">


      {/* ====================================================
          CONDUTA
      ==================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-[#101712] to-[#0a0d0a] p-5 shadow-xl">

        <div className="absolute right-3 top-3 text-emerald-500/10 text-5xl">
          🛡️
        </div>

        <div className="relative">

          <div className="flex items-center gap-2">
            <span className="text-xl">
              🛡️
            </span>

            <div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">
                Registro da Guilda
              </div>

              <h3 className="text-lg font-black text-white">
                Conduta Acadêmica
              </h3>
            </div>
          </div>


          {(() => {
            const condutasAluno = condutas.filter(
              (registro) =>
                registro.alunoId === currentStudent.id
            );

            const ultimoRegistro = condutasAluno[0];

            if (!ultimoRegistro) {
              return (
                <div className="mt-5 rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-700/30 bg-emerald-950/40 text-xl">
                      ✦
                    </div>

                    <div>
                      <div className="text-xs font-black text-emerald-400">
                        Registro limpo
                      </div>

                      <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                        Nenhuma ocorrência registrada pelo Conselho de Professores.
                      </p>
                    </div>

                  </div>

                </div>
              );
            }

            const configuracao = {
              positiva: {
                icone: "🟢",
                titulo: "Conduta positiva",
                classe:
                  "border-emerald-500/30 bg-emerald-950/20",
                texto: "text-emerald-400",
              },
              advertencia: {
                icone: "🟡",
                titulo: "Advertência",
                classe:
                  "border-amber-500/30 bg-amber-950/20",
                texto: "text-amber-400",
              },
              demerito: {
                icone: "🔴",
                titulo: "Demérito",
                classe:
                  "border-red-500/30 bg-red-950/20",
                texto: "text-red-400",
              },
            }[
              ultimoRegistro.tipo as
                | "positiva"
                | "advertencia"
                | "demerito"
            ];

            return (
              <div
                className={`mt-5 rounded-xl border p-4 ${
                  configuracao?.classe ||
                  "border-slate-700 bg-slate-900/40"
                }`}
              >

                <div className="flex items-start gap-3">

                  <div className="text-2xl">
                    {configuracao?.icone || "📋"}
                  </div>

                  <div className="min-w-0">

                    <div
                      className={`text-xs font-black ${
                        configuracao?.texto ||
                        "text-slate-300"
                      }`}
                    >
                      {configuracao?.titulo ||
                        ultimoRegistro.tipo}
                    </div>

                    <p className="mt-1 text-sm font-bold text-slate-200">
                      {ultimoRegistro.motivo}
                    </p>

                    {ultimoRegistro.descricao && (
                      <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
                        {ultimoRegistro.descricao}
                      </p>
                    )}

                    <p className="mt-2 text-[8px] font-bold uppercase tracking-wider text-slate-600">
                      {new Date(
                        ultimoRegistro.data
                      ).toLocaleDateString("pt-BR")}
                    </p>

                  </div>

                </div>

                {condutasAluno.length > 1 && (
                  <div className="mt-3 border-t border-slate-700/50 pt-3 text-[8px] font-bold uppercase tracking-wider text-slate-600">
                    {condutasAluno.length} registros no Conselho
                  </div>
                )}

              </div>
            );
          })()}

        </div>

      </div>


      {/* ====================================================
          CONQUISTAS
      ==================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-800/40 bg-gradient-to-br from-[#15111b] to-[#0a0d0a] p-5 shadow-xl">

        <div className="absolute right-3 top-3 text-purple-500/10 text-5xl">
          🏆
        </div>

        <div className="relative">

          <div className="flex items-center gap-2">

            <span className="text-xl">
              🏆
            </span>

            <div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] text-purple-500">
                Salão de Honra
              </div>

              <h3 className="text-lg font-black text-white">
                Conquistas Equipadas
              </h3>
            </div>

          </div>


          <div className="mt-5 grid grid-cols-3 gap-2">

            {[0, 1, 2].map((slot) => {

              const achievementId =
                equippedAchievements[slot];

              const achievement =
                achievementId
                  ? ACHIEVEMENTS.find(
                      (item) =>
                        item.id === achievementId
                    )
                  : null;

              return (
                <div
                  key={slot}
                  className={`flex min-h-[120px] flex-col items-center justify-center rounded-xl border p-2 text-center transition ${
                    achievement
                      ? "border-purple-500/40 bg-purple-950/30 shadow-lg"
                      : "border-slate-800 bg-black/20"
                  }`}
                >

                  {achievement ? (
                    <>
                      <div className="text-3xl">
                        {achievement.icon}
                      </div>

                      <div className="mt-2 line-clamp-2 text-[8px] font-black leading-tight text-purple-200">
                        {achievement.title}
                      </div>

                      <div className="mt-2 text-[7px] font-black uppercase tracking-wider text-purple-500">
                        Equipada
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xl text-slate-700">
                        ?
                      </div>

                      <div className="mt-2 text-[8px] font-bold text-slate-600">
                        Slot vazio
                      </div>

                      <div className="mt-1 text-[7px] uppercase tracking-wider text-slate-700">
                        Equipar
                      </div>
                    </>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </div>


      {/* ====================================================
          RANKING
      ==================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-800/40 bg-gradient-to-br from-[#19150d] to-[#0a0d0a] p-5 shadow-xl">

        <div className="absolute right-3 top-3 text-amber-500/10 text-5xl">
          ⚔️
        </div>

        <div className="relative">

          <div className="flex items-center gap-2">

            <span className="text-xl">
              ⚔️
            </span>

            <div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500">
                Conselho dos Aventureiros
              </div>

              <h3 className="text-lg font-black text-white">
                Ranking do Reino
              </h3>
            </div>

          </div>


          <div className="mt-5 space-y-2">

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-black/20 p-3">

              <div className="flex items-center gap-3">

                <div className="text-xl">
                  🥇
                </div>

                <div>
                  <div className="text-[9px] font-black text-amber-400">
                    1º Lugar
                  </div>

                  <div className="text-[8px] uppercase tracking-wider text-slate-600">
                    Campeão do Reino
                  </div>
                </div>

              </div>

              <div className="text-sm font-black text-white">
                2.850 XP
              </div>

            </div>


            <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 shadow-inner">

              <div className="flex items-center gap-3">

                <div className="text-xl">
                  🥈
                </div>

                <div>
                  <div className="text-[9px] font-black text-amber-300">
                    Você
                  </div>

                  <div className="text-[8px] uppercase tracking-wider text-slate-600">
                    Posição atual
                  </div>
                </div>

              </div>

              <div className="text-sm font-black text-amber-300">
                {currentStudent.xp} XP
              </div>

            </div>

          </div>


          <div className="mt-4 rounded-xl border border-slate-800/70 bg-black/20 px-3 py-2 text-center">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">
              Continue sua jornada para subir no ranking
            </span>
          </div>

        </div>

      </div>

    </div>

  </section>
)}

            {/* ==================================================
                MAPA
            ================================================== */}

            {activeTab === "mapa" && (
<AdventureMap />
            )}

            {/* ==================================================
                EVENTOS
            ================================================== */}

            {activeTab === "eventos" && (
              <section className="space-y-6">
                <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#1b1e17] via-[#11150f] to-[#0a0d0a] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <h2 className="text-3xl font-black text-white">
                    Eventos & Desafios
                    Especiais
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Participe dos desafios sazonais
                    ativos no reino.
                  </p>
                </div>

                {events.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-10 text-center">
                    <div className="text-5xl">
                      💤
                    </div>

                    <h3 className="mt-3 text-lg font-black text-white">
                      Nenhum evento ativo
                    </h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events
                      .filter(
                        (event) =>
                          event.active
                      )
                      .map((event) => (
                        <div
                          key={event.id}
                          className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-amber-400">
                              {event.type}
                            </span>

                            <span className="text-xs font-bold text-amber-300 border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                              📅{" "}
                              {event.periodo}
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-white">
                            {event.title}
                          </h3>

                          <p className="text-xs text-slate-400 mt-2">
                            {event.description}
                          </p>

                          <div className="mt-4 flex items-center gap-3 text-xs font-bold">
                            <span className="text-amber-400">
                              ✨ +
                              {
                                event.rewardXp
                              }{" "}
                              XP
                            </span>

                            <span className="text-amber-300">
                              🪙 +
                              {
                                event.rewardCoins
                              }{" "}
                              Moedas
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            )}

            {/* ==================================================
                OBJETIVOS
            ================================================== */}

            {activeTab === "objetivos" && (
              <ObjectivesTab
                quests={quests}
                student={currentStudent}
              />
            )}

            {/* ==================================================
                CONQUISTAS
            ================================================== */}

           {activeTab === "conquistas" && (
  <AchievementsPanel
    unlockedAchievements={[
      {
        id: "primeiro-passo",
        date: "22/08/2026",
      },
      {
        id: "reputacao-800",
        date: "22/08/2026",
      },
      {
        id: "honra-do-reino",
        date: "22/08/2026",
      },
    ]}
    equippedAchievements={equippedAchievements}
    onEquipAchievement={handleToggleEquip}
  />
)}

{/* ==================================================
    LOJA
================================================== */}

{activeTab === "loja" && (
  <div className="space-y-6">

    {/* ==================================================
        LOJA DA GUILDA
    ================================================== */}
    <LojaGuilda
      saldo={currentStudent.coins}
      itensComprados={itensComprados}
      onComprar={handleComprarItem}
    />

    {/* ==================================================
        MEUS EQUIPAMENTOS
    ================================================== */}
    <MeusEquipamentos
      equipamentoHead={equipamentoHead}
      equipamentoSkin={equipamentoSkin}
      equipamentoBuddy={equipamentoBuddy}
      itensComprados={itensComprados}
      onEquiparHead={setEquipamentoHead}
      onEquiparSkin={setEquipamentoSkin}
      onEquiparBuddy={setEquipamentoBuddy}
    />

  </div>
)}
            {/* ==================================================
                OUTRAS ABAS
            ================================================== */}

{activeTab !== "inicio" &&
  activeTab !== "mapa" &&
  activeTab !== "eventos" &&
  activeTab !== "objetivos" &&
  activeTab !== "conquistas" &&
  activeTab !== "desempenho" &&
  activeTab !== "loja" && (

                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/30">
                  <div className="text-4xl mb-2">
                    🚗§
                  </div>

                  <h3 className="text-lg font-bold">
                    Módulo em Desenvolvimento
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Esta seção estará disponível em breve.
                  </p>
                </div>
                         )}

          </>
        )}
      </main>

      {/* ======================================================
          NAVEGAÇÃO INFERIOR DO ALUNO
      ====================================================== */}

      {role === "student" && (
        <nav className="border-t border-slate-800 bg-[#11150f] p-2 sticky bottom-0 z-50">
          <div className="max-w-md mx-auto flex items-center justify-around">
            <button
              type="button"
              onClick={() =>
                setActiveTab("inicio")
              }
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                activeTab === "inicio"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-slate-500"
              }`}
            >
              <span className="text-lg">
                ðŸ 
              </span>

              <span className="text-[10px] font-bold">
                Início
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("mapa")
              }
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                activeTab === "mapa"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-slate-500"
              }`}
            >
              <span className="text-lg">
                🗺️
              </span>

              <span className="text-[10px] font-bold">
                Mapa
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("eventos")
              }
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                activeTab === "eventos"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-slate-500"
              }`}
            >
              <span className="text-lg">
                🔥
              </span>

              <span className="text-[10px] font-bold">
                Eventos
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("objetivos")
              }
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                activeTab === "objetivos"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-slate-500"
              }`}
            >
              <span className="text-lg">
                🎯
              </span>

              <span className="text-[10px] font-bold">
                Objetivos
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("conquistas")
              }
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                activeTab === "conquistas"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-slate-500"
              }`}
            >
              <span className="text-lg">
                ðŸ†
              </span>

              <span className="text-[10px] font-bold">
                Conquistas
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("desempenho")
              }
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                activeTab === "desempenho"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-slate-500"
              }`}
            >
              <span className="text-lg">
                📊
              </span>
              <span className="text-[10px] font-bold">
                Desempenho
              </span>
            </button>

            {/* ==================================================
                LOJA
            ================================================== */}
            <button
              type="button"
              onClick={() => setActiveTab("loja")}
              className={
                activeTab === "loja"
                  ? "flex flex-col items-center gap-1 p-2 rounded-xl transition bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "flex flex-col items-center gap-1 p-2 rounded-xl transition text-slate-500"
              }
            >
              <span className="text-lg">
                🏰
              </span>

              <span className="text-[10px] font-bold">
                Loja
              </span>
            </button>

          </div>
        </nav>
      )}
    </div>
  );
}