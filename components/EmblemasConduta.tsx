"use client";

type Emblema = {
  nome: string;
  descricao: string;
  icon: string;
  conquistado: boolean;
};

const emblemas: Emblema[] = [
  {
    nome: "Guardião da Jornada",
    descricao: "Demonstra responsabilidade e respeito aos combinados.",
    icon: "🛡️",
    conquistado: true,
  },
  {
    nome: "Companheiro de Equipe",
    descricao: "Contribui positivamente para a convivência.",
    icon: "🤝",
    conquistado: true,
  },
  {
    nome: "Compromisso Cumprido",
    descricao: "Cumpre os compromissos assumidos durante sua jornada.",
    icon: "🧭",
    conquistado: false,
  },
  {
    nome: "Em Evolução",
    descricao: "Demonstra evolução positiva em sua conduta.",
    icon: "🌱",
    conquistado: true,
  },
  {
    nome: "Mediador",
    descricao: "Demonstra capacidade de resolver conflitos de maneira construtiva.",
    icon: "🕊️",
    conquistado: false,
  },
  {
    nome: "Determinação",
    descricao: "Mantém o esforço mesmo diante das dificuldades.",
    icon: "🔥",
    conquistado: false,
  },
  {
    nome: "Referência de Conduta",
    descricao: "Apresenta histórico consistente de boa conduta.",
    icon: "⭐",
    conquistado: false,
  },
  {
    nome: "Mudança de Rota",
    descricao: "Demonstrou evolução significativa após um período de acompanhamento.",
    icon: "🌟",
    conquistado: false,
  },
];

export function EmblemasConduta() {
  const conquistados = emblemas.filter(
    (emblema) => emblema.conquistado
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#11150f] p-5 shadow-xl">

      {/* CABEÇALHO */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
            Desenvolvimento pessoal
          </div>

          <h2 className="mt-1 text-xl font-black">
            🛡️ Conduta do Aventureiro
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Emblemas conquistados ao longo da jornada.
          </p>

        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">

          <div className="text-[9px] uppercase tracking-wider text-slate-600">
            Emblemas
          </div>

          <div className="mt-1 text-lg font-black text-amber-400">
            {conquistados.length}/{emblemas.length}
          </div>

        </div>

      </div>


      {/* EMBLEMAS */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

        {emblemas.map((emblema) => (

          <div
            key={emblema.nome}
            title={emblema.descricao}
            className={`
              group rounded-2xl border p-4 text-center
              transition-all duration-200
              ${
                emblema.conquistado
                  ? "border-amber-900/40 bg-amber-950/10 hover:border-amber-500/50 hover:bg-amber-950/20"
                  : "border-slate-800 bg-slate-900/30 opacity-45 grayscale"
              }
            `}
          >

            {/* ÍCONE */}

            <div
              className={`
                mx-auto flex h-16 w-16 items-center justify-center
                rounded-full border text-3xl
                ${
                  emblema.conquistado
                    ? "border-amber-500/40 bg-amber-500/10"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >
              {emblema.conquistado
                ? emblema.icon
                : "🔒"}
            </div>


            {/* NOME */}

            <div
              className={`
                mt-3 text-xs font-black
                ${
                  emblema.conquistado
                    ? "text-amber-400"
                    : "text-slate-600"
                }
              `}
            >
              {emblema.nome}
            </div>


            {/* DESCRIÇÃO */}

            <div className="mt-1 text-[9px] leading-4 text-slate-600">
              {emblema.descricao}
            </div>

          </div>

        ))}

      </div>


      {/* RODAPÉ */}

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-center">

        <p className="text-[10px] text-slate-600">
          🌱 A jornada de desenvolvimento continua.
        </p>

      </div>

    </section>
  );
}