"use client";

import React, { useState } from "react";
import { MuralValidacaoProfessor, SolicitacaoAluno } from "./MuralValidacaoProfessor";

export const Home: React.FC = () => {
  // Estado para alternar sub-abas do Mestre
  const [abaProfessor, setAbaProfessor] = useState<"validacoes" | "missoes">("validacoes");

  // Estado das solicitações enviadas pelos alunos
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAluno[]>([
    {
      id: "sol-1",
      alunoNome: "Lucas Silva",
      alunoAvatar: "🧙‍♂️",
      missaoTitulo: "Explorador da Matemática",
      missaoCategoria: "DIÁRIO",
      xpReward: 100,
      coinReward: 40,
      dataEnvio: new Date().toISOString(),
      comentarioAluno: "Concluí todos os exercícios das Montanhas dos Números!",
    },
    {
      id: "sol-2",
      alunoNome: "Beatriz Lima",
      alunoAvatar: "🧝‍♀️",
      missaoTitulo: "Sábio Leitor",
      missaoCategoria: "SEMANAL",
      xpReward: 250,
      coinReward: 100,
      dataEnvio: new Date().toISOString(),
      comentarioAluno: "Li o capítulo 4 do livro de Português.",
    },
  ]);

  // Estados do formulário de criação de missão
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Diário" | "Semanal" | "Mensal">("Diário");
  const [xpReward, setXpReward] = useState(100);
  const [coinReward, setCoinReward] = useState(50);

  // Ações de validação
  const handleAprovar = (solicitacao: SolicitacaoAluno) => {
    alert(`✓ Missão de ${solicitacao.alunoNome} aprovada! Recompensa concedida.`);
    setSolicitacoes((prev) => prev.filter((item) => item.id !== solicitacao.id));
  };

  const handleRecusar = (id: string, motivo?: string) => {
    alert(`✕ Solicitação recusada. Motivo: "${motivo || "Não atendeu aos critérios da missão."}"`);
    setSolicitacoes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCriarMissao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Preencha o título e a descrição!");
      return;
    }
    alert(`⚔️ Missão "${title}" criada com sucesso!`);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Banner do Mestre */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md mb-2">
              Painel do Mestre / Professor
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Aventureiro Pedagógico
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Gerencie os desafios e valide o progresso dos alunos no reino.
            </p>
          </div>

          {/* Botões para alternar abas */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto">
            <button
              onClick={() => setAbaProfessor("validacoes")}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                abaProfessor === "validacoes"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🛡️</span> Mural de Validação
              {solicitacoes.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {solicitacoes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setAbaProfessor("missoes")}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                abaProfessor === "missoes"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>➕</span> Criar Missões
            </button>
          </div>
        </div>

        {/* RENDERIZAÇÃO DA ABA ATIVA */}
        {abaProfessor === "validacoes" && (
          <MuralValidacaoProfessor
            solicitacoes={solicitacoes}
            onAprovar={handleAprovar}
            onRecusar={handleRecusar}
          />
        )}

        {abaProfessor === "missoes" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
              ➕ Cadastrar Nova Missão
            </h2>
            <p className="text-slate-400 text-xs mb-6">
              Crie desafios pedagógicos para os alunos cumprirem no sistema.
            </p>

            <form onSubmit={handleCriarMissao} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Título da Missão
                </label>
                <input
                  type="text"
                  placeholder="Ex: Desafio das Equações de 2º Grau"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Descrição dos Objetivos
                </label>
                <textarea
                  rows={3}
                  placeholder="Instruções para o aluno concluir a missão..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                  >
                    <option value="Diário">Diário</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensal">Mensal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Recompensa XP
                  </label>
                  <input
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Recompensa Moedas
                  </label>
                  <input
                    type="number"
                    value={coinReward}
                    onChange={(e) => setCoinReward(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-lg shadow-lg transition-all mt-4"
              >
                ⚔️ Publicar Missão
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;