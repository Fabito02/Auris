import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getManifestacaoDoUsuario,
  getRespostasManifestacaoDoUsuario,
  getUsuarioByUserId,
} from "@/api/api_routes";
import { Manifestacao, Resposta, User } from "@/types/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Button from "@/components/buttons/Button";
import { URL_BASE_AVATAR } from "@/config";
import { checkAuth } from "@/api/auth";

const MinhaManifestacao = () => {
    
  const navigate = useNavigate();
  const { id } = useParams();
  const [manifestacao, setManifestacao] = useState<Manifestacao>();
  const [avatar, setAvatar] = useState<string>();
  const [respostas, setRespostas] = useState<Resposta[]>();
  const [usuariosRespostas, setUsuariosRespostas] = useState<
    Record<number, User>
  >({});

  useEffect(() => {
    checkAuth(navigate, ["admin", "moderador", "user"]);
  }, []);

  const fetchRespostas = async () => {
    setRespostas(undefined);
    const response = await getRespostasManifestacaoDoUsuario(Number(id));
    const respostasData = response.data;
    setRespostas(respostasData);

    const usuarios: Record<number, User> = {};
    await Promise.all(
      respostasData.map(async (resposta: Resposta) => {
        if (!usuarios[resposta.User_ID]) {
          const usuarioResp = await getUsuarioByUserId(resposta.User_ID);
          usuarios[resposta.User_ID] = usuarioResp.data;
        }
      })
    );
    setUsuariosRespostas(usuarios);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchManifestacao = async () => {
      try {
        const response = await getManifestacaoDoUsuario(Number(id));
        console.log(response);
        setManifestacao(response.data);
        document.title = response.data.Titulo?.toString() || "Manifestação";
        if (response.error) {
          navigate("/errors/404");
          return null;
        }
      } catch (error) {
        console.error("Erro ao buscar manifestação:", error);
        navigate("/errors/404");
        return null;
      }
    };
    fetchManifestacao();
    fetchRespostas();
  }, []);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await getUsuarioByUserId(manifestacao?.User_ID ?? 0);
        if (response.data) {
          setAvatar(`${URL_BASE_AVATAR}/${response.data.Avatar}`);
        }
      } catch (error) {
        console.error("Erro ao buscar avatar:", error);
      }
    };

    if (manifestacao) {
      fetchAvatar();
    }
  }, [manifestacao, setAvatar]);

  if (!manifestacao) {
    navigate("/errors/404");
    return;
  }

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  return (
    <div className="grid grid-cols-2 w-full max-w-6xl mx-auto px-6 pt-12 pb-24 min-h-full ">
      <div className="col-span-2 h-8 w-full flex gap-2 items-center">
        <Avatar
          onClick={() =>
            navigate(`/admin/gerenciar/${manifestacao.User_ID}/perfil`)
          }
        >
          <AvatarImage
            className="h-8 min-h-8 aspect-square cursor-pointer rounded-full"
            src={avatar || "/user_placeholder.png"}
            alt="Ícone do Usuário"
          />
        </Avatar>

        <div
          className={`rounded-full px-3 py-1 font-bold flex items-center h-7 text-sm text-white ${
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
          className={`w-7 h-7 aspect-square rounded-full flex items-center justify-center ${
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
            width={20}
            className="m-auto text-white"
          />
        </div>
      </div>

      <div className="mt-5 col-span-2 ml-4">
        <h1 className="text-xl font-semibold">{manifestacao.Titulo}</h1>
        <h1 className="text-1xl mt-2">{manifestacao.Descricao}</h1>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-600 flex items-center">
            {formatDate(manifestacao.Data_Envio)}
          </p>
          <div
            className={`px-2 text-xs text-white h-6 ${
              manifestacao.Status === "pendente"
                ? "bg-[var(--color-warning)]"
                : manifestacao.Status === "em_andamento"
                ? "bg-[var(--color-info)]"
                : "bg-[var(--color-success)]"
            } rounded-full flex items-center justify-center`}
          >
            {manifestacao.Status === "pendente"
              ? "Pendente"
              : manifestacao.Status === "em_andamento"
              ? "Em andamento"
              : "Concluído"}
            <Icon
              icon={
                manifestacao.Status === "concluido"
                  ? "material-symbols:sentiment-excited-outline-rounded"
                  : manifestacao.Status === "em_andamento"
                  ? "material-symbols:sentiment-neutral-outline-rounded"
                  : "material-symbols:sentiment-dissatisfied-outline-rounded"
              }
              width={20}
              className="ml-1"
            />
          </div>
        </div>
      </div>

      <hr className="col-span-2 border-t mx- border-gray-300 mt-4" />

      <div className="grid grid-cols-2 gap-4 col-span-2">
        <div className="col-span-2 md:col-span-1 flex flex-col mt-14">
          <h1 className="text-2xl font-medium col-span-2 mb-6">
            Enviar comentário
          </h1>
          <Card className="mt-2 py-4 gap-4">
            <CardContent className="px-4 flex flex-col relative">
              <Textarea className="h-35 pr-12"></Textarea>
              <Button
                icon="material-symbols:send"
                iconPosition="center"
                className="mt-4 justify-end w-10 h-10 absolute right-7 bottom-3"
              />
            </CardContent>
            <CardFooter className="border-t pb-2">
              <p className="text-sm text-red-500 w-full text-center">
                *OBS: mantenha um tom respeitoso ao escrever seu comentário.
              </p>
            </CardFooter>
          </Card>
        </div>
        <div className="md:order-first col-span-2 md:col-span-1 flex flex-col gap-4 mt-8 md:mt-14">
          <h1 className="text-2xl font-medium col-span-2 mb-4">Comentários</h1>
          {respostas?.length === 0 ||
            (!respostas && (
              <div className="text-muted-foreground mt-4 w-full text-center">
                Nenhum comentário.
              </div>
            ))}
          {respostas?.map((resposta) => {
            const usuario = usuariosRespostas[resposta.User_ID];
            return (
              <Card key={resposta.Resposta_ID} className="py-4 gap-3">
                <CardHeader className="px-4 flex flex-row items-center">
                  <Avatar>
                    <AvatarImage
                      src={
                        `${URL_BASE_AVATAR}/${usuario?.Avatar}` ||
                        "/user_placeholder.png"
                      }
                      alt="Ícone do Usuário"
                      className="w-10 h-10 aspect-square cursor-pointer rounded-full"
                    />
                  </Avatar>
                  <div className="ml-2">
                    <p className="text-md font-medium leading-none">
                      {usuario?.Nome || "Usuário"}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="ml-3 text-gray-600">{resposta.Descricao}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(resposta.Data_Criacao)}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MinhaManifestacao;
