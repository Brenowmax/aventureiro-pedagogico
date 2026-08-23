"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TesteSupabase() {
  const [resultado, setResultado] = useState("Verificando login...");

  useEffect(() => {
    async function testar() {
      const { data: usuario } = await supabase.auth.getUser();

      if (!usuario.user) {
        setResultado(
          "Nenhum usuário autenticado. Entre primeiro em /login-teste."
        );
        return;
      }

      const { data, error } = await supabase
        .from("series")
        .select("id, nome, ordem")
        .order("ordem");

      if (error) {
        setResultado(`ERRO: ${error.message}`);
        return;
      }

      setResultado(
        `Usuário autenticado: ${usuario.user.id}\n\n` +
        `Séries encontradas: ${
          data?.map((serie) => serie.nome).join(", ") || "nenhuma"
        }`
      );
    }

    testar();
  }, []);

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        whiteSpace: "pre-line",
      }}
    >
      <h1>Teste do Supabase</h1>

      <p>{resultado}</p>
    </main>
  );
}