"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type TipoPerfil = "aluno" | "professor" | "gestor";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      setMensagem("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setMensagem(`Erro ao entrar: ${error.message}`);
      setCarregando(false);
      return;
    }

    if (!data.user) {
      setMensagem("Não foi possível identificar o usuário.");
      setCarregando(false);
      return;
    }

    const { data: perfil, error: perfilError } = await supabase
      .from("perfis")
      .select("id, nome, email, tipo")
      .eq("id", data.user.id)
      .single();

    if (perfilError || !perfil) {
      setMensagem(
        "Usuário autenticado, mas o perfil não foi encontrado."
      );
      await supabase.auth.signOut();
      setCarregando(false);
      return;
    }

    const tipo = perfil.tipo as TipoPerfil;

    if (!["aluno", "professor", "gestor"].includes(tipo)) {
      setMensagem("Tipo de perfil inválido.");
      await supabase.auth.signOut();
      setCarregando(false);
      return;
    }

    /*
      Por enquanto, vamos apenas mostrar o perfil encontrado.
      Ainda NÃO vamos redirecionar para o aplicativo principal.
    */

    setMensagem(
      `Login realizado com sucesso!\n\n` +
      `Nome: ${perfil.nome}\n` +
      `Tipo: ${tipo}\n` +
      `UUID: ${perfil.id}`
    );

    setCarregando(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#090b08",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid #3f3f46",
          background: "#11150f",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <div style={{ fontSize: "42px" }}>⚔️</div>

          <h1
            style={{
              marginTop: "10px",
              fontSize: "26px",
              fontWeight: "900",
            }}
          >
            Aventureiro Pedagógico
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            Entre para acessar seu reino.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#f59e0b",
              }}
            >
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              autoComplete="email"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#020617",
                color: "#fff",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#f59e0b",
              }}
            >
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  entrar();
                }
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#020617",
                color: "#fff",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={entrar}
            disabled={carregando}
            style={{
              marginTop: "8px",
              padding: "13px",
              borderRadius: "10px",
              border: "1px solid #f59e0b",
              background: carregando ? "#78350f" : "#92400e",
              color: "#fff",
              fontWeight: "900",
              cursor: carregando ? "default" : "pointer",
            }}
          >
            {carregando ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </div>

        {mensagem && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #334155",
              background: "#020617",
              color: "#cbd5e1",
              fontSize: "12px",
              lineHeight: "1.6",
              whiteSpace: "pre-line",
            }}
          >
            {mensagem}
          </div>
        )}
      </section>
    </main>
  );
}