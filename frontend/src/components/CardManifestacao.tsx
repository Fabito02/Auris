import { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify-icon/react";
import { Manifestacao } from "@/types/api";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAvatar } from "@/api/api_routes";
import { useNavigate } from "react-router-dom";

interface CardManifestacaoProps {
  manifestacoes: Manifestacao[];
  filtrarTipo?: "reclamacao" | "elogio" | "sugestao" | "denuncia";
  action?: string;
}

interface ManifestacaoComAvatar extends Manifestacao {
  avatarUrl: string;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const CardManifestacao = ({
  manifestacoes,
  filtrarTipo,
  action,
}: CardManifestacaoProps) => {
  const navigate = useNavigate();

  const [lista, setLista] = useState<ManifestacaoComAvatar[]>([]);

  const manifestacoesFiltradas = useMemo(() => {
    if (!filtrarTipo) return manifestacoes;
    return manifestacoes.filter((m) => m.Tipo_manifestacao === filtrarTipo);
  }, [manifestacoes, filtrarTipo]);

  useEffect(() => {
    Promise.all(
      manifestacoesFiltradas.map(async (m) => {
        if (m.Anonimo) {
          return { ...m, avatarUrl: "/user_placeholder_anonimo.png" };
        }
        try {
          const { avatarUrl } = await getAvatar(m.User_ID);
          return { ...m, avatarUrl: avatarUrl || "/user_placeholder.png" };
        } catch {
          return { ...m, avatarUrl: "/user_placeholder.png" };
        }
      })
    ).then((res) => setLista(res));
  }, [manifestacoesFiltradas]);

  function getPlainTextFromQuill(html: string): string {
    const container = document.createElement("div");
    container.innerHTML = html;

    container.querySelectorAll("img, video").forEach((el) => el.remove());

    return container.textContent || "";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lista.map((m) => (
        <Card
          key={m.Manifestacao_ID}
          className="cursor-pointer transition duration-300 ease-in-out hover:bg-gray-100 py-4 px-0 gap-4"
          onClick={
            action ? () => navigate(action + m.Manifestacao_ID) : undefined
          }
        >
          <CardHeader className="flex items-center font-semibold text-sm space-x-1 px-4">
            <Avatar className="w-7 h-7">
              <AvatarImage src={m.avatarUrl} alt="Ícone do Usuário" />
            </Avatar>

            <div
              className={`rounded-full text-xs px-3 py-1 font-bold text-white ${
                {
                  reclamacao: "bg-[var(--color-reclamacao)]",
                  elogio: "bg-[var(--color-elogio)]",
                  sugestao: "bg-[var(--color-sugestao)]",
                  denuncia: "bg-[var(--color-denuncia)]",
                }[m.Tipo_manifestacao]
              }`}
            >
              {m.Tipo_manifestacao === "elogio"
                ? "ELOGIO"
                : m.Tipo_manifestacao === "reclamacao"
                ? "RECLAMAÇÃO"
                : m.Tipo_manifestacao === "sugestao"
                ? "SUGESTÃO"
                : "DENÚNCIA"}
            </div>

            <p className="truncate text-medium">• {m.Tipo} •</p>

            <div
              className={`w-7 h-7 aspect-square rounded-full flex items-center justify-center ${
                m.Prioridade === "alta"
                  ? "bg-[var(--color-danger)]"
                  : m.Prioridade === "urgente"
                  ? "bg-[var(--color-danger-dark)]"
                  : m.Prioridade === "media"
                  ? "bg-[var(--color-warning)]"
                  : "bg-[var(--color-success)]"
              }`}
              title={`Prioridade ${
                m.Prioridade.charAt(0).toUpperCase() + m.Prioridade.slice(1)
              }`}
            >
              <Icon
                icon={
                  m.Prioridade === "alta" || m.Prioridade === "urgente"
                    ? "material-symbols:e911-emergency-rounded"
                    : m.Prioridade === "media"
                    ? "material-symbols:gpp-maybe-rounded"
                    : "material-symbols:clock-arrow-down-rounded"
                }
                width={20}
                className="m-auto text-white"
              />
            </div>
          </CardHeader>

          <CardContent className="mx-3 px-4">
            <CardTitle className="truncate mb-2">{m.Titulo}</CardTitle>
            <div className="mt-2 text-muted-foreground border-l px-2">
              <p className="truncate">{getPlainTextFromQuill(m.Descricao)}</p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pr-4">
            <p className="text-xs text-gray-600 truncate">{formatDate(m.Data_Envio)} {m.Local && ` - Local: ${m.Local}`}</p>
            <div
              className={`px-2 text-xs text-white h-6 ${
                m.Status === "pendente"
                  ? "bg-[var(--color-warning)]"
                  : m.Status === "em_andamento"
                  ? "bg-[var(--color-info)]"
                  : "bg-[var(--color-success)]"
              } rounded-full flex items-center justify-center`}
            >
              {m.Status === "pendente"
                ? "Pendente"
                : m.Status === "em_andamento"
                ? "Em andamento"
                : "Concluído"}
              <Icon
                icon={
                  m.Status === "concluido"
                    ? "material-symbols:sentiment-excited-outline-rounded"
                    : m.Status === "em_andamento"
                    ? "material-symbols:sentiment-neutral-outline-rounded"
                    : "material-symbols:sentiment-dissatisfied-outline-rounded"
                }
                width={20}
                className="ml-1"
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CardManifestacao;
