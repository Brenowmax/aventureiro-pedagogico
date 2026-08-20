"use client";

import React, { useState } from "react";

type Tutorando = {
  id: number;
  nome: string;
  turma: string;
  dataEnturmacao: string;
};

export default function MeusTutorados() {
  // Estado para armazenar a lista de tutorados/alunos enturmados
  const [tutorados, setTutorados] =
    useState<Tutorando[]>([]);

  // Estado para controlar os campos do formulário
  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");

  // Mensagem de feedback
  const [mensagem, setMensagem] = useState("");

  // Função para cadastrar/enturmar o aluno
  const handleEnturmar = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!nome.trim() || !turma.trim()) {
      setMensagem(
        "Por favor, preencha todos os campos!"
      );
      return;
    }

    const novoTutorado: Tutorando = {
      id: Date.now(),
      nome: nome.trim(),
      turma: turma.trim(),
      dataEnturmacao:
        new Date().toLocaleDateString("pt-BR"),
    };

    // Adiciona o novo tutorado à lista existente
    setTutorados((atuais) => [
      novoTutorado,
      ...atuais,
    ]);

    // Limpa os campos
    setNome("");
    setTurma("");
    setMensagem(
      "Aluno enturmado com sucesso!"
    );

    // Limpa a mensagem após 3 segundos
    setTimeout(() => {
      setMensagem("");
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* CABEÇALHO */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Meus Tutorados
        </h1>

        <p className="text-gray-600">
          Cadastre e gerencie a lista de alunos
          acompanhados por você.
        </p>
      </div>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleEnturmar}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Enturmar Novo Aluno
        </h2>

        {mensagem && (
          <div
            className={`p-3 rounded text-sm font-medium ${
              mensagem.includes("sucesso")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensagem}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NOME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Aluno
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              placeholder="Ex: João Silva"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* TURMA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turma
            </label>

            <input
              type="text"
              value={turma}
              onChange={(e) =>
                setTurma(e.target.value)
              }
              placeholder="Ex: 8º A, Turma B, 3001..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* BOTÃO */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Enturmar Aluno
          </button>
        </div>
      </form>

      {/* LISTA DE TUTORADOS */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Lista de Tutorados ({tutorados.length})
        </h2>

        {tutorados.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Nenhum tutorado enturmado até o momento.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                  <th className="py-3 px-4">
                    Nome do Aluno
                  </th>

                  <th className="py-3 px-4">
                    Turma
                  </th>

                  <th className="py-3 px-4">
                    Data de Cadastro
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {tutorados.map((aluno) => (
                  <tr
                    key={aluno.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {aluno.nome}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded font-medium">
                        {aluno.turma}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {aluno.dataEnturmacao}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}