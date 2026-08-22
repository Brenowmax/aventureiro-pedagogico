export type AchievementCategory =
  | "common"
  | "rare"
  | "legendary"
  | "demerit";

export type AchievementRequirementType =
  | "automatic"
  | "event"
  | "manual";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirementType: AchievementRequirementType;
  requirement?: string;
  xp?: number;
  coins?: number;
  hidden?: boolean;
};

/* ============================================================
   CONQUISTAS DO SISTEMA
============================================================ */

export const ACHIEVEMENTS: Achievement[] = [
  /* ==========================================================
     CONQUISTAS COMUNS
  ========================================================== */

  {
    id: "primeiro-passo",
    title: "Primeiro Passo",
    description:
      "Registre sua primeira atividade acadêmica no Reino.",
    icon: "👣",
    category: "common",
    requirementType: "automatic",
    requirement:
      "Realizar a primeira atividade acadêmica.",
  },

  {
    id: "primeira-conquista",
    title: "Primeira Conquista",
    description:
      "Desbloqueie sua primeira conquista.",
    icon: "🏅",
    category: "common",
    requirementType: "automatic",
    requirement:
      "Desbloquear outra conquista.",
  },

  {
    id: "estudioso",
    title: "Estudioso",
    description:
      "Mantenha desempenho adequado ou superior em seus estudos.",
    icon: "📚",
    category: "common",
    requirementType: "automatic",
    requirement:
      "Alcançar proficiência Adequada.",
  },

  {
    id: "mestre-do-conhecimento",
    title: "Mestre do Conhecimento",
    description:
      "Alcance proficiência Avançada em um componente curricular.",
    icon: "🧠",
    category: "common",
    requirementType: "automatic",
    requirement:
      "Alcançar média igual ou superior a 9,0.",
  },

  {
    id: "explorador-academico",
    title: "Explorador Acadêmico",
    description:
      "Explore diferentes territórios do Reino do Conhecimento.",
    icon: "🗺️",
    category: "common",
    requirementType: "automatic",
    requirement:
      "Registrar progresso em diferentes componentes.",
  },

  {
    id: "reputacao-500",
    title: "Nome Reconhecido",
    description:
      "Alcance 500 pontos de reputação acadêmica.",
    icon: "⭐",
    category: "common",
    requirementType: "automatic",
    requirement:
      "Alcançar 500 pontos de reputação.",
  },

  {
    id: "reputacao-800",
    title: "Herói do Reino",
    description:
      "Alcance 800 pontos de reputação acadêmica.",
    icon: "🌟",
    category: "common",
    requirementType: "automatic",
    requirement:
      "Alcançar 800 pontos de reputação.",
  },

  /* ==========================================================
     CONQUISTAS RARAS
  ========================================================== */

  {
    id: "participante-evento",
    title: "Chamado da Aventura",
    description:
      "Participe de um evento especial organizado pela guilda.",
    icon: "⚔️",
    category: "rare",
    requirementType: "event",
    requirement:
      "Participar de um evento especial.",
  },

  {
    id: "desafio-concluido",
    title: "Desafiante",
    description:
      "Conclua um desafio especial proposto pela guilda.",
    icon: "🏆",
    category: "rare",
    requirementType: "event",
    requirement:
      "Concluir um desafio especial.",
  },

  {
    id: "boss-raid",
    title: "Caçador de Boss",
    description:
      "Participe de uma Boss Raid e ajude a guilda a superar o desafio.",
    icon: "🐉",
    category: "rare",
    requirementType: "event",
    requirement:
      "Participar de uma Boss Raid.",
  },

  /* ==========================================================
     CONQUISTAS LENDÁRIAS
  ========================================================== */

  {
    id: "honra-do-reino",
    title: "Honra do Reino",
    description:
      "Uma distinção concedida por um professor ou gestor por uma atitude excepcional.",
    icon: "👑",
    category: "legendary",
    requirementType: "manual",
    requirement:
      "Concessão manual por professor ou gestor.",
  },

  {
    id: "guardiao-do-conhecimento",
    title: "Guardião do Conhecimento",
    description:
      "Reconhecimento especial por contribuição extraordinária à comunidade escolar.",
    icon: "🛡️",
    category: "legendary",
    requirementType: "manual",
    requirement:
      "Concessão manual por professor ou gestor.",
  },

  {
    id: "lenda-da-guilda",
    title: "Lenda da Guilda",
    description:
      "Uma das maiores honrarias que um aventureiro pode receber.",
    icon: "⚜️",
    category: "legendary",
    requirementType: "manual",
    requirement:
      "Concessão extraordinária por professor ou gestor.",
  },

  /* ==========================================================
     DEMÉRITOS
  ========================================================== */

  {
    id: "olhos-do-beholder",
    title: "Olhos do Beholder",
    description:
      "Concedido quando uma tentativa de obter vantagem indevida em uma avaliação é registrada pelo professor.",
    icon: "👁️",
    category: "demerit",
    requirementType: "manual",
    requirement:
      "Registro manual por professor ou gestor.",
    hidden: true,
  },

  {
    id: "cheater",
    title: "Cheater",
    description:
      "Concedido quando uma tentativa de manipular, explorar ou violar o sistema é registrada.",
    icon: "💀",
    category: "demerit",
    requirementType: "manual",
    requirement:
      "Registro manual por professor ou gestor.",
    hidden: true,
  },

  {
    id: "quebra-de-conduta",
    title: "Quebra de Conduta",
    description:
      "Registro de uma conduta inadequada dentro das atividades acadêmicas.",
    icon: "⚠️",
    category: "demerit",
    requirementType: "manual",
    requirement:
      "Registro manual por professor ou gestor.",
    hidden: true,
  },
];

/* ============================================================
   FUNÇÕES AUXILIARES
============================================================ */

export function getAchievementById(
  id: string
): Achievement | undefined {
  return ACHIEVEMENTS.find(
    (achievement) => achievement.id === id
  );
}

export function getAchievementsByCategory(
  category: AchievementCategory
): Achievement[] {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      achievement.category === category
  );
}