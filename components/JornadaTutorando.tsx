"use client";

import { useEffect, useMemo, useState } from "react";
import { CondutaTutorando } from "@/components/CondutaTutorando";
import { MissaoTutorando } from "@/components/MissaoTutorando";

type Tutorando = {
  id: number | string;
  nome: string;
  ano?: string;
  turma?: string;
  professorId?: string;
};

type Componente = {
  nome: string;
  icon: string;
  nota: number | null;
};

type Registro = {
  id: number;
  data: string;
  texto: string;
};

type DadosJornada = {
  componentes: Componente[];
  registros: Registro[];
  metaAtiva: string;
};

type Props = {
  tutorando: Tutorando | null;
  onVoltar: () => void;
};

const componentesIniciais: Componente[] = [
  {
    nome: "Língua Portuguesa",
    icon: "📖",
    nota: null,
  },
  {
    nome: "Língua Inglesa",
    icon: "🌎",
    nota: null,
  },
  {
    nome: "Matemática",
    icon: "📐",
    nota: null,
  },
  {
    nome: "História",
    icon: "🏛️",
    nota: null,
  },
  {
    nome: "Geografia",
    icon: "🌍",
    nota: null,
  },
  {
    nome: "Educação Física",
    icon: "⚽",
    nota: null,
  },
  {
    nome: "Artes",
    icon: "🎨",
    nota: null,
  },
  {
    nome: "Ciências",
    icon: "🔬",
    nota: null,
  },
  {
    nome: "Projeto de Vida",
    icon: "🧭",
    nota: null,
  },
  {
    nome: "Tecnologia",
    icon: "💻",
    nota: null,
  },
  {
    nome: "Educação Financeira",
    icon: "💰",
    nota: null,
  },
  {
    nome: "Robótica",
    icon: "🤖",
    nota: null,
  },
  {
    nome: "Orientação de Estudos de Português",
    icon: "📚",
    nota: null,
  },
  {
    nome: "Orientação de Estudos de Matemática",
    icon: "📊",
    nota: null,
  },
];

function criarComponentesIniciais() {
  return componentesIniciais.map((componente) => ({
    ...componente,
  }));
}

function classificacao(nota: number | null) {
  if (nota === null) {
    return {
      nome: "Sem registro",
      cor: "text-slate-500",
      fundo: "bg-slate-800/50",
    };
  }

  if (nota <= 4) {
    return {
      nome: "Abaixo do Básico",
      cor: "text-red-400",
      fundo: "bg-red-950/30",
    };
  }

  if (nota <= 6) {
    return {
      nome: "Básico",
      cor: "text-orange-400",
      fundo: "bg-orange-950/30",
    };
  }

  if (nota <= 8) {
    return {
      nome: "Adequado",
      cor: "text-green-400",
      fundo: "bg-green-950/30",
    };
  }

  return {
    nome: "Avançado",
    cor: "text-amber-400",
    fundo: "bg-amber-950/30",
  };
}

export function JornadaTutorando({
  tutorando,
  onVoltar,
}: Props) {
  const [componentes, setComponentes] =
    useState<Componente[]>(
      criarComponentesIniciais()
    );

  const [registros, setRegistros] =
    useState<Registro[]>([]);

  const [metaAtiva, setMetaAtiva] =
    useState("");

  const [meta, setMeta] =
    useState("");

  const [observacao, setObservacao] =
    useState("");

  const [carregandoDados, setCarregandoDados] =
    useState(true);

  const chaveStorage = tutorando
    ? `aventureiro-jornada-${tutorando.id}`
    : null;

  useEffect(() => {
    if (!chaveStorage) {
      setCarregandoDados(false);
      return;
    }

    setCarregandoDados(true);

    try {
      const dadosSalvos =
        localStorage.getItem(chaveStorage);

      if (dadosSalvos) {
        const dados: DadosJornada =
          JSON.parse(dadosSalvos);

        setComponentes(
          Array.isArray(dados.componentes)
            ? dados.componentes
            : criarComponentesIniciais()
        );

        setRegistros(
          Array.isArray(dados.registros)
            ? dados.registros
            : []
        );

        setMetaAtiva(
          typeof dados.metaAtiva === "string"
            ? dados.metaAtiva
            : ""
        );
      } else {
        setComponentes(
          criarComponentesIniciais()
        );
        setRegistros([]);
        setMetaAtiva("");
      }
    } catch (error) {
      console.error(
        "Erro ao carregar dados da jornada:",
        error
      );

      setComponentes(
        criarComponentesIniciais()
      );

      setRegistros([]);
      setMetaAtiva("");
    }

    setCarregandoDados(false);
  }, [chaveStorage]);

  useEffect(() => {
    if (
      !chaveStorage ||
      carregandoDados
    ) {
      return;
    }

    const dados: DadosJornada = {
      componentes,
      registros,
      metaAtiva,
    };

    try {
      localStorage.setItem(
        chaveStorage,
        JSON.stringify(dados)
      );
    } catch (error) {
      console.error(
        "Erro ao salvar dados da jornada:",
        error
      );
    }
  }, [
    componentes,
    registros,
    metaAtiva,
    chaveStorage,
    carregandoDados,
  ]);

  if (!tutorando) {
    return (
      <section className="rounded-2xl border border-red-900/40 bg-[#11150f] p-8 text-center shadow-xl">
        <div className="text-5xl">
          ⚠️
        </div>

        <h2 className="mt-4 text-xl font-black">
          Tutorando não encontrado
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Não foi possível carregar os dados
          deste tutorando.
        </p>

        <button
          type="button"
          onClick={onVoltar}
          className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-sm font-black text-amber-400 transition hover:bg-amber-500/20"
        >
          ← Voltar para Meus Tutorados
        </button>
      </section>
    );
  }

  function alterarNota(
    index: number,
    valor: string
  ) {
    if (valor === "") {
      setComponentes((atual) =>
        atual.map(
          (componente, i) =>
            i === index
              ? {
                  ...componente,
                  nota: null,
                }
              : componente
        )
      );

      return;
    }

    const numero = Number(valor);

    if (Number.isNaN(numero)) {
      return;
    }

    const nota = Math.max(
      1,
      Math.min(10, numero)
    );

    setComponentes((atual) =>
      atual.map(
        (componente, i) =>
          i === index
            ? {
                ...componente,
                nota,
              }
            : componente
      )
    );
  }

  function adicionarRegistro() {
    if (!observacao.trim()) {
      return;
    }

    const novoRegistro: Registro = {
      id: Date.now(),
      data: new Date().toLocaleDateString(
        "pt-BR"
      ),
      texto: observacao.trim(),
    };

    setRegistros((atual) => [
      novoRegistro,
      ...atual,
    ]);

    setObservacao("");
  }

  function removerRegistro(id: number) {
    setRegistros((atual) =>
      atual.filter(
        (registro) =>
          registro.id !== id
      )
    );
  }

  function salvarMeta() {
    if (!meta.trim()) {
      return;
    }

    setMetaAtiva(meta.trim());
    setMeta("");
  }

  const estatisticas = useMemo(() => {
    const registradas =
      componentes.filter(
        (componente) =>
          componente.nota !== null
      );

    if (registradas.length === 0) {
      return {
        media: "—",
        adequados: 0,
        atencao: 0,
        avancados: 0,
      };
    }

    const soma =
      registradas.reduce(
        (total, componente) =>
          total +
          (componente.nota ?? 0),
        0
      );

    return {
      media: (
        soma / registradas.length
      ).toFixed(1),

      adequados:
        registradas.filter(
          (componente) =>
            componente.nota !== null &&
            componente.nota >= 7 &&
            componente.nota <= 8
        ).length,

      atencao:
        registradas.filter(
          (componente) =>
            componente.nota !== null &&
            componente.nota <= 6
        ).length,

      avancados:
        registradas.filter(
          (componente) =>
            componente.nota !== null &&
            componente.nota >= 9
        ).length,
    };
  }, [componentes]);

  const pontosAtencao =
    componentes.filter(
      (componente) =>
        componente.nota !== null &&
        componente.nota <= 6
    );

  const quantidadeRegistrada =
    componentes.filter(
      (componente) =>
        componente.nota !== null
    ).length;

  if (carregandoDados) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#11150f] p-10 text-center shadow-xl">
        <div className="text-4xl">
          🧭
        </div>

        <h2 className="mt-4 text-lg font-black">
          Carregando Jornada...
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Recuperando os registros do
          tutorando.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">

      {/* CABEÇALHO */}

      <div className="rounded-2xl border border-amber-900/40 bg-[#11150f] p-5 shadow-xl">

        <button
          type="button"
          onClick={onVoltar}
          className="mb-5 text-xs font-bold text-slate-500 transition hover:text-amber-400"
        >
          ← Voltar para Meus Tutorados
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-3xl">
              🧙‍♂️📚
            </div>

            <div>

              <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
                Jornada do Tutorando
              </div>

              <h2 className="mt-1 text-2xl font-black">
                {tutorando.nome}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {tutorando.ano} • Turma{" "}
                {tutorando.turma}
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">
              <div className="text-[9px] uppercase text-slate-600">
                Média
              </div>

              <div className="mt-1 text-xl font-black text-amber-400">
                {estatisticas.media}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">
              <div className="text-[9px] uppercase text-slate-600">
                Adequado
              </div>

              <div className="mt-1 text-xl font-black text-green-400">
                {estatisticas.adequados}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">
              <div className="text-[9px] uppercase text-slate-600">
                Atenção
              </div>

              <div className="mt-1 text-xl font-black text-red-400">
                {estatisticas.atencao}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">
              <div className="text-[9px] uppercase text-slate-600">
                Avançado
              </div>

              <div className="mt-1 text-xl font-black text-amber-400">
                {estatisticas.avancados}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* CONDUTA */}

            <CondutaTutorando
        tutorandoId={Number(tutorando.id)}
      />

      {/* MISSÕES */}

      <MissaoTutorando
  quests={[]}
  onSolicitarConclusao={() => {}}
/>

      {/* DESEMPENHO */}

      <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
              Acompanhamento acadêmico
            </div>

            <h3 className="mt-1 text-xl font-black">
              Desempenho por Componente
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Registre a nota de acompanhamento
              de cada componente curricular.
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">

            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
              Componentes registrados
            </div>

            <div className="mt-1 text-lg font-black text-amber-400">
              {quantidadeRegistrada}/14
            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          {componentes.map(
            (componente, index) => {

              const status =
                classificacao(
                  componente.nota
                );

              return (
                <div
                  key={componente.nome}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-700"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xl">
                      {componente.icon}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="text-sm font-bold">
                        {componente.nome}
                      </div>

                      <div
                        className={`mt-1 inline-flex rounded-md px-2 py-1 text-[9px] font-black uppercase ${status.fundo} ${status.cor}`}
                      >
                        {status.nome}
                      </div>

                    </div>

                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={
                        componente.nota ?? ""
                      }
                      onChange={(event) =>
                        alterarNota(
                          index,
                          event.target.value
                        )
                      }
                      placeholder="—"
                      className="h-12 w-16 rounded-xl border border-slate-700 bg-slate-950 text-center text-lg font-black text-white outline-none placeholder:text-slate-700 focus:border-amber-500"
                    />

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* LEGENDA */}

      <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">

        <div className="mb-4">

          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
            Sistema de acompanhamento
          </div>

          <h3 className="mt-1 text-lg font-black">
            Escala de Desenvolvimento
          </h3>

        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

          <div className="rounded-xl border border-red-900/30 bg-red-950/20 p-3">
            <div className="text-sm font-black text-red-400">
              1–4
            </div>

            <div className="mt-1 text-xs font-bold text-red-300">
              Abaixo do Básico
            </div>
          </div>

          <div className="rounded-xl border border-orange-900/30 bg-orange-950/20 p-3">
            <div className="text-sm font-black text-orange-400">
              5–6
            </div>

            <div className="mt-1 text-xs font-bold text-orange-300">
              Básico
            </div>
          </div>

          <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-3">
            <div className="text-sm font-black text-green-400">
              7–8
            </div>

            <div className="mt-1 text-xs font-bold text-green-300">
              Adequado
            </div>
          </div>

          <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 p-3">
            <div className="text-sm font-black text-amber-400">
              9–10
            </div>

            <div className="mt-1 text-xs font-bold text-amber-300">
              Avançado
            </div>
          </div>

        </div>

      </div>

      {/* PONTOS DE ATENÇÃO */}

      <div className="rounded-2xl border border-red-900/30 bg-[#11150f] p-5">

        <div className="mb-5">

          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-red-400">
            Intervenção pedagógica
          </div>

          <h3 className="mt-1 text-xl font-black">
            ⚠️ Pontos de Atenção
          </h3>

        </div>

        {pontosAtencao.length === 0 ? (

          <div className="rounded-xl border border-green-900/30 bg-green-950/10 p-5 text-center">

            <div className="text-3xl">
              🟢
            </div>

            <p className="mt-2 text-sm font-bold text-green-400">
              Nenhum ponto de atenção identificado.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Registre as notas para identificar
              possíveis necessidades de intervenção.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {pontosAtencao.map(
              (componente) => {

                const status =
                  classificacao(
                    componente.nota
                  );

                return (
                  <div
                    key={componente.nome}
                    className="rounded-xl border border-red-900/30 bg-red-950/10 p-4"
                  >

                    <div className="flex items-center gap-3">

                      <span className="text-xl">
                        {componente.icon}
                      </span>

                      <div className="flex-1">

                        <div className="text-sm font-bold">
                          {componente.nome}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          Nota registrada:{" "}
                          <span
                            className={
                              status.cor
                            }
                          >
                            {componente.nota}
                          </span>
                        </div>

                      </div>

                      <span className="text-lg">
                        ⚠️
                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

      {/* META */}

      <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">

        <div className="mb-5">

          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
            Desenvolvimento
          </div>

          <h3 className="mt-1 text-xl font-black">
            🎯 Meta do Tutorando
          </h3>

        </div>

        {metaAtiva && (

          <div className="mb-4 rounded-xl border border-amber-900/40 bg-amber-950/10 p-4">

            <div className="text-[9px] font-bold uppercase tracking-wider text-amber-500">
              Meta atual
            </div>

            <div className="mt-2 font-bold">
              {metaAtiva}
            </div>

          </div>

        )}

        <div className="flex flex-col gap-3 sm:flex-row">

          <input
            type="text"
            value={meta}
            onChange={(event) =>
              setMeta(event.target.value)
            }
            placeholder="Ex.: Melhorar desempenho em Matemática"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-amber-500"
          />

          <button
            type="button"
            onClick={salvarMeta}
            disabled={!meta.trim()}
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-sm font-black text-amber-400 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ✓ Definir Meta
          </button>

        </div>

      </div>

      {/* REGISTRO */}

      <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">

        <div className="mb-5">

          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
            Diário do professor
          </div>

          <h3 className="mt-1 text-xl font-black">
            📝 Registro de Acompanhamento
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Registre observações importantes
            sobre o desenvolvimento do tutorando.
          </p>

        </div>

        <textarea
          value={observacao}
          onChange={(event) =>
            setObservacao(
              event.target.value
            )
          }
          placeholder="Ex.: Demonstrou evolução na participação durante as atividades..."
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-amber-500"
        />

        <div className="mt-3 flex justify-end">

          <button
            type="button"
            onClick={adicionarRegistro}
            disabled={!observacao.trim()}
            className="rounded-xl border border-green-700/50 bg-green-900/30 px-5 py-3 text-sm font-black text-green-400 transition hover:bg-green-900/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ✓ Registrar acompanhamento
          </button>

        </div>

        {registros.length > 0 && (

          <div className="mt-5 space-y-3">

            {registros.map(
              (registro) => (

                <div
                  key={registro.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="text-[9px] font-bold uppercase tracking-wider text-amber-500">
                        {registro.data}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {registro.texto}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removerRegistro(
                          registro.id
                        )
                      }
                      className="text-xs text-slate-700 transition hover:text-red-400"
                      title="Excluir registro"
                    >
                      ✕
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

        {registros.length === 0 && (

          <div className="mt-5 rounded-xl border border-dashed border-slate-800 p-6 text-center">

            <div className="text-3xl">
              📝
            </div>

            <p className="mt-2 text-sm font-bold text-slate-500">
              Nenhum registro realizado
            </p>

            <p className="mt-1 text-xs text-slate-700">
              As observações adicionadas
              aparecerão aqui.
            </p>

          </div>

        )}

      </div>

      {/* RESUMO */}

      <div className="rounded-2xl border border-amber-900/30 bg-[#11150f] p-5">

        <div className="mb-5">

          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500">
            Reino do Conhecimento
          </div>

          <h3 className="mt-1 text-xl font-black">
            🗺️ Resumo da Jornada
          </h3>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">

            <div className="text-3xl">
              🏆
            </div>

            <div className="mt-2 text-[9px] uppercase tracking-wider text-slate-600">
              Reputação
            </div>

            <div className="mt-1 text-xl font-black text-amber-400">
              Em construção
            </div>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">

            <div className="text-3xl">
              ⚔️
            </div>

            <div className="mt-2 text-[9px] uppercase tracking-wider text-slate-600">
              XP
            </div>

            <div className="mt-1 text-xl font-black text-amber-400">
              Em construção
            </div>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center">

            <div className="text-3xl">
              🏅
            </div>

            <div className="mt-2 text-[9px] uppercase tracking-wider text-slate-600">
              Conquistas
            </div>

            <div className="mt-1 text-xl font-black text-amber-400">
              Em construção
            </div>

          </div>

        </div>

      </div>

      {/* SALVAMENTO */}

      <div className="pb-5 text-center">

        <span className="inline-flex items-center gap-2 rounded-full border border-green-900/30 bg-green-950/10 px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-green-500">

          <span className="h-2 w-2 rounded-full bg-green-500" />

          Dados salvos automaticamente neste dispositivo

        </span>

      </div>

    </section>
  );
}