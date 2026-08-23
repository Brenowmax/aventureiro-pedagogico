"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginTeste() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function entrar() {
    setMensagem("Entrando...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setMensagem(`ERRO: ${error.message}`);
      return;
    }

    if (!data.user) {
      setMensagem("Usuário não encontrado.");
      return;
    }

    setMensagem(
      `Login realizado com sucesso! UUID: ${data.user.id}`
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Teste de Login — Supabase</h1>

      <div
        style={{
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "30px",
        }}
      >
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px" }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ padding: "10px" }}
        />

        <button
          onClick={entrar}
          style={{
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </div>

      {mensagem && (
        <p style={{ marginTop: "20px" }}>
          {mensagem}
        </p>
      )}
    </main>
  );
}