import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getManifestacaoPorId, getAvatar } from "@/api/api_routes";
import { Manifestacao } from "@/types/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useUsuarioAtual } from "@/hooks/useUsuarioAtual";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Button from "@/components/buttons/Button";

const MinhaManifestacao = () => {
  const { id } = useParams();
  const [manifestacao, setManifestacao] = useState<Manifestacao>();
  const [avatar, setAvatar] = useState<string>();
  const usuarioAtual = useUsuarioAtual();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchManifestacao = async () => {
      const response = await getManifestacaoPorId(Number(id));
      setManifestacao(response.data);
    };
    fetchManifestacao();

    const fetchAvatar = async () => {
      const response = await getAvatar(usuarioAtual?.User_ID || 0);
      setAvatar(response.data.avatarUrl);
    };
    fetchAvatar();
  }, [id, usuarioAtual]);

  if (!manifestacao) return null;

  return (
    <div className="grid grid-cols-3 w-full max-w-5xl mx-auto px-4 py-12">
      <div className="col-span-3 w-10 h-10 min-w-full flex gap-2 items-center relative">
        <Button
          iconPosition="center"
          icon="material-symbols:edit-rounded"
          outline
          className="w-8 h-8 col-span-1 absolute right-9 t-0"
          style={{ border: "none" }}
          full_rounded
          color="muted"
        />
        <Button
          iconPosition="center"
          icon="material-symbols:delete-rounded"
          outline
          className="w-8 h-8 col-span-1 absolute right-0 t-0"
          style={{ border: "none" }}
          full_rounded
          color="danger"
        />
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={avatar || "/user_placeholder.png"}
            alt="Ícone do Usuário"
          />
        </Avatar>

        <div
          className={`rounded-full px-3 py-1 font-bold flex items-center h-8 text-sm text-white ${
            {
              reclamacao: "bg-[var(--color-reclamacao)]",
              elogio: "bg-[var(--color-elogio)]",
              sugestao: "bg-[var(--color-sugestao)]",
              denuncia: "bg-[var(--color-denuncia)]",
            }[manifestacao.Tipo_manifestacao]
          }`}
        >
          {manifestacao.Tipo_manifestacao === "elogio"
            ? "ELOGIO"
            : manifestacao.Tipo_manifestacao === "reclamacao"
            ? "RECLAMAÇÃO"
            : manifestacao.Tipo_manifestacao === "sugestao"
            ? "SUGESTÃO"
            : "DENÚNCIA"}
        </div>

        <p className="truncate">• {manifestacao.Tipo} •</p>

        <div
          className={`w-8 h-8 aspect-square rounded-full flex items-center justify-center ${
            manifestacao.Prioridade === "alta"
              ? "bg-[var(--color-danger)]"
              : manifestacao.Prioridade === "urgente"
              ? "bg-[var(--color-danger-dark)]"
              : manifestacao.Prioridade === "media"
              ? "bg-[var(--color-warning)]"
              : "bg-[var(--color-success)]"
          }`}
          title={`Prioridade ${
            manifestacao.Prioridade.charAt(0).toUpperCase() +
            manifestacao.Prioridade.slice(1)
          }`}
        >
          <Icon
            icon={
              manifestacao.Prioridade === "alta" ||
              manifestacao.Prioridade === "urgente"
                ? "material-symbols:e911-emergency-rounded"
                : manifestacao.Prioridade === "media"
                ? "material-symbols:gpp-maybe-rounded"
                : "material-symbols:clock-arrow-down-rounded"
            }
            width={22}
            className="m-auto text-white"
          />
        </div>
      </div>
      <div className="mt-4 col-span-3 ml-4">
        <h1 className="text-2xl font-medium">{manifestacao.Titulo}</h1>
        <h1 className="text-1xl mt-2 text-">{manifestacao.Descricao}</h1>
      </div>
      <hr className="col-span-3 border-t mx-4 border-gray-300 my-6" />
    </div>
  );
};

export default MinhaManifestacao;
