"use client";

import React, { useState } from "react";
import AdventureMap from "./AdventureMap";
import {
  MuralValidacaoProfessor,
  SolicitacaoValidacao,
} from "./MuralValidacaoProfessor";

export const Home: React.FC = () => {
  // ============================================================
  // ABAS DO PROFESSOR
  // ============================================================

  const [abaProfessor, setAbaProfessor] = useState<
    "validacoes" | "missoes" | "mapa"
  >("validacoes");

  // ============================================================
  // SOLICITAÇÕES DE VALIDAÇÃO
  // ============================================================

  const [solicitacoes, setSolicitacoes] = useState<
    SolicitacaoValidacao[]
  >([
    {
      id: "sol-1",
      tipo: "missao",
      alunoId: "s1",
      alunoNome: "Lucas Silva",
      alunoAvatar: "🧙‍♂️",
      alunoTurma: "9º Ano A",
      titulo: "Explorador da Matemática",
      categoria: "DIÁRIO",
      descricao:
        "Concluir os exercícios propostos nas Montanhas dos Números.",
      xpReward: 100,
      coinReward: 40,
      dataEnvio: new Date().toLocaleString("pt-BR"),
      comentarioAluno:
        "Concluí todos os exercícios das Montanhas dos Números!",
    },

    {
      id: "sol-2",
      tipo: "missao",
      alunoId: "s2",
      alunoNome: "Beatriz Lima",
      alunoAvatar: "🧝‍♀️",
      alunoTurma: "9º Ano A",
      titulo: "Sábio Leitor",
      categoria: "SEMANAL",
      descricao:
        "Ler o capítulo 4 do livro de Português e registrar a atividade.",
      xpReward: 250,
      coinReward: 100,
      dataEnvio: new Date().toLocaleString("pt-BR"),
      comentarioAluno:
        "Li o capítulo 4 do livro de Português.",
    },
  ]);

  // ============================================================
  // FORMULÁRIO DE CRIAÇÃO DE MISSÃO
  // ============================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState<
    "Diário" | "Semanal" | "Mensal"
  >("Diário");

  const [xpReward, setXpReward] = useState(100);
  const [coinReward, setCoinReward] = useState(50);

  // ============================================================
  // APROVAR VALIDAÇÃO
  // ============================================================

  const handleAprovar = (
    solicitacao: SolicitacaoValidacao
  ) => {
    alert(
      `✓ ${solicitacao.titulo} de ${solicitacao.alunoNome} aprovada!\n\nRecompensa concedida.`
    );

    setSolicitacoes((prev) =>
      prev.filter(
        (item) => item.id !== solicitacao.id
      )
    );
  };

  // ============================================================
  // RECUSAR VALIDAÇÃO
  // ============================================================

  const handleRecusar = (
    solicitacao: SolicitacaoValidacao,
    motivo?: string
  ) => {
    alert(
      `✕ Solicitação recusada.\n\nAluno: ${
        solicitacao.alunoNome
      }\nMotivo: ${
        motivo ||
        "Não atendeu aos critérios da missão."
      }`
    );

    setSolicitacoes((prev) =>
      prev.filter(
        (item) => item.id !== solicitacao.id
      )
    );
  };

  // ============================================================
  // CRIAR MISSÃO
  // ============================================================

  const handleCriarMissao = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert(
        "Preencha o título e a descrição!"
      );
      return;
    }

    alert(
      `⚔️ Missão "${title}" criada com sucesso!\n\nCategoria: ${category}\nXP: ${xpReward}\nMoedas: ${coinReward}`
    );

    setTitle("");
    setDescription("");
    setCategory("Diário");
    setXpReward(100);
    setCoinReward(50);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ======================================================
            BANNER DO MESTRE
        ====================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div>
            <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md mb-2">
              Painel do Mestre / Professor
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight">
              Aventureiro Pedagógico
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Gerencie os desafios, acompanhe o
              desempenho e valide o progresso dos
              alunos no reino.
            </p>
          </div>

          {/* ==================================================
              ABAS DO PROFESSOR
          ================================================== */}

          <div className="flex flex-wrap bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto gap-1">

            {/* MURAL */}

            <button
              type="button"
              onClick={() =>
                setAbaProfessor("validacoes")
              }
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                abaProfessor === "validacoes"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🛡️</span>

              <span>
                Mural de Validação
              </span>

              {solicitacoes.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {solicitacoes.length}
                </span>
              )}
            </button>

            {/* MISSÕES */}

            <button
              type="button"
              onClick={() =>
                setAbaProfessor("missoes")
              }
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                abaProfessor === "missoes"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>➕</span>

              <span>
                Criar Missões
              </span>
            </button>

            {/* MAPA */}

            <button
              type="button"
              onClick={() =>
                setAbaProfessor("mapa")
              }
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                abaProfessor === "mapa"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🗺️</span>

              <span>
                Mapa Acadêmico
              </span>
            </button>
          </div>
        </div>

        {/* ======================================================
            ABA — MURAL DE VALIDAÇÃO
        ====================================================== */}

        {abaProfessor === "validacoes" && (
          <MuralValidacaoProfessor
            solicitacoes={solicitacoes}
            onAprovar={handleAprovar}
            onRecusar={handleRecusar}
          />
        )}

        {/* ======================================================
            ABA — CRIAR MISSÕES
        ====================================================== */}

        {abaProfessor === "missoes" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

            <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
              ⚔️ Cadastrar Nova Missão
            </h2>

            <p className="text-slate-400 text-xs mb-6">
              Crie desafios pedagógicos para os
              alunos cumprirem no sistema.
            </p>

            <form
              onSubmit={handleCriarMissao}
              className="space-y-4"
            >

              {/* TÍTULO */}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Título da Missão
                </label>

                <input
                  type="text"
                  placeholder="Ex: Desafio das Equações de 2º Grau"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                />
              </div>

              {/* DESCRIÇÃO */}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Descrição dos Objetivos
                </label>

                <textarea
                  rows={4}
                  placeholder="Instruções para o aluno concluir a missão..."
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                />
              </div>

              {/* CONFIGURAÇÕES */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* CATEGORIA */}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Categoria
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value as
                          | "Diário"
                          | "Semanal"
                          | "Mensal"
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                  >
                    <option value="Diário">
                      Diário
                    </option>

                    <option value="Semanal">
                      Semanal
                    </option>

                    <option value="Mensal">
                      Mensal
                    </option>
                  </select>
                </div>

                {/* XP */}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Recompensa XP
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={xpReward}
                    onChange={(e) =>
                      setXpReward(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>

                {/* MOEDAS */}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Recompensa Moedas
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={coinReward}
                    onChange={(e) =>
                      setCoinReward(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* PUBLICAR */}

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-lg shadow-lg transition-all mt-4"
              >
                ⚔️ Publicar Missão
              </button>
            </form>
          </div>
        )}

        {/* ======================================================
            ABA — MAPA ACADÊMICO DO PROFESSOR
        ====================================================== */}

        {abaProfessor === "mapa" && (
          <section className="space-y-5">

            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-5 shadow-xl">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">
                    Área exclusiva do professor
                  </div>

                  <h2 className="text-2xl font-black text-white mt-1">
                    🗺️ Mapa da Reputação Acadêmica
                  </h2>

                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Consulte o desenvolvimento dos
                    componentes curriculares e lance
                    as notas bimestrais dos alunos.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                  <div className="text-[9px] font-black uppercase tracking-wider text-amber-500">
                    Permissão
                  </div>

                  <div className="text-xs font-black text-amber-300 mt-1">
                    ✏️ Edição de notas habilitada
                  </div>
                </div>

              </div>
            </div>

            {/* 
              O AdventureMap utilizado aqui é o mesmo mapa
              utilizado no perfil do aluno.

              A diferença de permissão deve ser controlada
              pelo próprio componente AdventureMap.
            */}

            <AdventureMap />

          </section>
        )}

      </div>
    </div>
  );
};

export default Home;