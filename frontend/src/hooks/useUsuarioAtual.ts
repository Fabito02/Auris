import { useEffect, useState } from "react";
import {
  getUsuarioAtual,
  verificarPrimeiroAcesso,
  enviarNotificacao,
} from "@/api/api_routes";
import { User } from "@/types/api";

export function useUsuarioAtual() {
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const responseUsuario = await getUsuarioAtual();
        if (responseUsuario.success) {
          setUsuario(responseUsuario.user);
        } else {
          console.error("Erro ao buscar usuário:", responseUsuario.error);
          return;
        }

        const responseAcesso = await verificarPrimeiroAcesso();
        if (responseAcesso.primeiroAcesso) {
          await enviarNotificacao({
            Titulo: "Seja bem-vindo(a)!",
            Mensagem:
              "Na Auris, sua manifestação é valorizada. Fale com a gente e ajude a construir um ambiente melhor.",
            User_ID: responseUsuario.user.User_ID,
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
