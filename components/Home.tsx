"use client";

import React, { useState } from "react";
import AdventureMap from "@/components/AdventureMap";
import {
  MuralValidacaoProfessor,
  SolicitacaoValidacao,
} from "./MuralValidacaoProfessor";

export const Home: React.FC = () => {
  // ============================================================
  // ABAS DO PAINEL DO PROFESSOR
  // ============================================================

  const [abaProfessor, setAbaProfessor] = useState<
    "validacoes" | "missoes" | "mapa"
  >("validacoes");

  // ============================================================
  // SOLICITAÇÕES DE VALIDAÇÃO
  // ============================================================

  const [solicitacoes, setSolicitacoes] =
    useState<SolicitacaoValidacao[]>([
      {
        id: "sol-1",
        tipo: "missao",
        alunoId: "aluno-1",
        alunoNome: "Lucas Silva",
        alunoAvatar: "🧙‍♂️",
        alunoTurma: "9º Ano A",
        titulo: "Explorador da Matemática",
        categoria: "DIÁRIO",
        descricao:
          "Concluir os exercícios das Montanhas dos Números.",
        xpReward: 100,
        coinReward: 40,
        dataEnvio: new Date().toLocaleDateString("pt-BR"),
        comentarioAluno:
          "Concluí todos os exercícios das Montanhas dos Números!",
      },
      {
        id: "sol-2",
        tipo: "missao",
        alunoId: "aluno-2",
        alunoNome: "Beatriz Lima",
        alunoAvatar: "🧝‍♀️",
        alunoTurma: "9º Ano A",
        titulo: "Sábio Leitor",
        categoria: "SEMANAL",
        descricao:
          "Realizar a leitura do capítulo indicado pelo professor.",
        xpReward: 250,
        coinReward: 100,
        dataEnvio: new Date().toLocaleDateString("pt-BR"),
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
  // APROVAR SOLICITAÇÃO
  // ============================================================

  const handleAprovar = (
    solicitacao: SolicitacaoValidacao
  ) => {
    alert(
      `✓ Missão de ${solicitacao.alunoNome} aprovada! Recompensa concedida.`
    );

    setSolicitacoes((prev) =>
      prev.filter(
        (item) => item.id !== solicitacao.id
      )
    );
  };

  // ============================================================
  // RECUSAR SOLICITAÇÃO
  // ============================================================

  const handleRecusar = (
    solicitacao: SolicitacaoValidacao,
    motivo?: string
  ) => {
    alert(
      `✕ Solicitação recusada.\n\nMotivo: ${
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
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert(
        "Preencha o título e a descrição!"
      );
      return;
    }

    alert(
      `⚔️ Missão "${title}" criada com sucesso!`
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
            CABEÇALHO DO PROFESSOR
        ====================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5">

          <div>
            <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md mb-2">
              Painel do Mestre / Professor
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight">
              Aventureiro Pedagógico
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Gerencie os desafios, acompanhe o mapa
              acadêmico e valide o progresso dos alunos.
            </p>
          </div>

          {/* ==================================================
              ABAS
          ================================================== */}

          <div className="flex flex-wrap bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full xl:w-auto gap-1">

            {/* MURAL */}

            <button
              type="button"
              onClick={() =>
                setAbaProfessor("validacoes")
              }
              className={`flex-1 xl:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                abaProfessor === "validacoes"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
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
              className={`flex-1 xl:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                abaProfessor === "missoes"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
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
              className={`flex-1 xl:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                abaProfessor === "mapa"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
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

            <div className="mb-6">
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-500">
                Ferramenta do Mestre
              </div>

              <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
                ⚔️ Cadastrar Nova Missão
              </h2>

              <p className="text-slate-400 text-xs mt-1">
                Crie desafios pedagógicos para os
                alunos cumprirem no sistema.
              </p>
            </div>

            <form
              onSubmit={handleCriarMissao}
              className="space-y-5"
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
                    setDescription(e.target.value)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none resize-none"
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
                        Number(e.target.value)
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
                        Number(e.target.value)
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
            ABA — MAPA DO PROFESSOR
        ====================================================== */}

        {abaProfessor === "mapa" && (
          <div className="space-y-4">

            {/* AVISO DO MODO PROFESSOR */}

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">
                    Área exclusiva do professor
                  </div>

                  <h2 className="mt-1 text-xl font-black text-white">
                    🗺️ Mapa da Reputação Acadêmica
                  </h2>

                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Selecione um componente curricular
                    no mapa para visualizar e editar as
                    notas dos quatro bimestres.
                  </p>
                </div>

                <div className="shrink-0 rounded-xl border border-emerald-500/20 bg-slate-950/60 px-4 py-3 text-center">

                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                    Modo atual
                  </div>

                  <div className="mt-1 text-xs font-black text-emerald-400">
                    ✏️ EDIÇÃO DO PROFESSOR
                  </div>

                </div>

              </div>

            </div>

            {/* MAPA */}

            <AdventureMap mode="teacher" />

          </div>
        )}

      </div>
    </div>
  );
};

export default Home;