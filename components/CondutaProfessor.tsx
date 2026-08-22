"use client";

import { useEffect, useState } from "react";

type TipoConduta = "positiva" | "advertencia" | "demerito";

type RegistroConduta = {
  id: string;
  alunoId: string;
  alunoNome: string;
  turma: string;
  tipo: TipoConduta;
  motivo: string;
  descricao: string;
  data: string;
};

type Aluno = {
  id: string;
  name: string;
  turma: string;
};

type Props = {
  alunos: Aluno[];
};

const STORAGE_CONDUTA = "aventureiro-conduta";

const tipos: {
  valor: TipoConduta;
  nome: string;
  icone: string;
}[] = [
  {
    valor: "positiva",
    nome: "Conduta positiva",
    icone: "🌟",
  },
  {
    valor: "advertencia",
    nome: "Advertência",
    icone: "⚠️",
  },
  {
    valor: "demerito",
    nome: "Demérito",
    icone: "⚔️",
  },
];

export default function CondutaProfessor({ alunos }: Props) {
  const [registros, setRegistros] = useState<RegistroConduta[]>([]);
  const [alunoId, setAlunoId] = useState("");
  const [tipo, setTipo] = useState<TipoConduta>("positiva");
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("");

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_CONDUTA);

      if (salvo) {
        setRegistros(JSON.parse(salvo));
      }
    } catch {
      setRegistros([]);
    }
  }, []);

  function salvarRegistros(novosRegistros: RegistroConduta[]) {
    setRegistros(novosRegistros);

    localStorage.setItem(
      STORAGE_CONDUTA,
      JSON.stringify(novosRegistros)
    );
  }

  function registrarConduta() {
    if (!alunoId || !motivo.trim()) {
      alert("Selecione o aluno e informe o motivo.");
      return;
    }

    const aluno = alunos.find((item) => item.id === alunoId);

    if (!aluno) {
      alert("Aluno não encontrado.");
      return;
    }

    const novoRegistro: RegistroConduta = {
      id: crypto.randomUUID(),
      alunoId: aluno.id,
      alunoNome: aluno.name,
      turma: aluno.turma,
      tipo,
      motivo: motivo.trim(),
      descricao: descricao.trim(),
      data: new Date().toISOString(),
    };

    salvarRegistros([novoRegistro, ...registros]);

    setAlunoId("");
    setTipo("positiva");
    setMotivo("");
    setDescricao("");

    alert("Registro de conduta realizado com sucesso!");
  }

  function excluirRegistro(id: string) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este registro?"
    );

    if (!confirmar) return;

    salvarRegistros(
      registros.filter((registro) => registro.id !== id)
    );
  }

  const registrosFiltrados = filtroAluno
    ? registros.filter(
        (registro) => registro.alunoId === filtroAluno
      )
    : registros;

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="text-4xl">⚖️</div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Conduta dos Aventureiros
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Registre acontecimentos importantes da
              trajetória comportamental dos seus tutorandos.
            </p>
          </div>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
        <h3 className="mb-5 text-lg font-bold text-white">
          📝 Registrar ocorrência
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* ALUNO */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Aventureiro
            </label>

            <select
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              <option value="">Selecione o aluno</option>

              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.name} — {aluno.turma}
                </option>
              ))}
            </select>
          </div>

          {/* TIPO */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Tipo de registro
            </label>

            <select
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value as TipoConduta)
              }
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              {tipos.map((item) => (
                <option key={item.valor} value={item.valor}>
                  {item.icone} {item.nome}
                </option>
              ))}
            </select>
          </div>

          {/* MOTIVO */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Motivo
            </label>

            <input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex.: colaboração com os colegas"
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Observação
            </label>

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva brevemente o ocorrido..."
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={registrarConduta}
          className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-6 py-3 font-bold text-amber-300 transition hover:bg-amber-500/20"
        >
          ⚖️ Registrar conduta
        </button>
      </div>

      {/* HISTÓRICO */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-bold text-white">
              📜 Histórico de conduta
            </h3>

            <p className="text-sm text-slate-400">
              Registros realizados pelo professor.
            </p>
          </div>

          <select
            value={filtroAluno}
            onChange={(e) => setFiltroAluno(e.target.value)}
            className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white"
          >
            <option value="">Todos os aventureiros</option>

            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.name}
              </option>
            ))}
          </select>
        </div>

        {registrosFiltrados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
            Nenhum registro de conduta encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {registrosFiltrados.map((registro) => {
              const tipoRegistro = tipos.find(
                (item) => item.valor === registro.tipo
              );

              return (
                <div
                  key={registro.id}
                  className="rounded-xl border border-slate-700 bg-slate-800/70 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl">
                          {tipoRegistro?.icone}
                        </span>

                        <span className="font-bold text-white">
                          {registro.alunoNome}
                        </span>

                        <span className="text-sm text-slate-500">
                          {registro.turma}
                        </span>

                        <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300">
                          {tipoRegistro?.nome}
                        </span>
                      </div>

                      <p className="mt-3 font-semibold text-slate-200">
                        {registro.motivo}
                      </p>

                      {registro.descricao && (
                        <p className="mt-1 text-sm text-slate-400">
                          {registro.descricao}
                        </p>
                      )}

                      <p className="mt-3 text-xs text-slate-500">
                        {new Date(
                          registro.data
                        ).toLocaleDateString("pt-BR")}{" "}
                        às{" "}
                        {new Date(
                          registro.data
                        ).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        excluirRegistro(registro.id)
                      }
                      className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}