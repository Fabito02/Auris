import { useEffect, useState } from "react";
import { getUsuarioAtual, enviarNotificacao } from "@/api/api_routes";
import { User } from "@/types/api";

export function useUsuarioAtual() {
  const [usuario, setUsuario] = useState<User | null>();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const res = await getUsuarioAtual();

        if (!res.success) {
          console.error("Erro ao buscar usuário:", res.error);
          return;
        }

        setUsuario(res.user);

        if (res.user.Primeiro_Acesso) {
          sessionStorage.setItem("primeiroAcesso", "true");
          await enviarNotificacao({
            Titulo: "Seja bem-vindo(a)!",
            Mensagem:
              "Na Auris, sua manifestação é valorizada. Fale com a gente e ajude a construir um ambiente melhor.",
            User_ID: res.user.User_ID,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, []);

  return usuario;
}
