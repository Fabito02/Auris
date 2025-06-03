import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getManifestacaoDoUsuario,
  getRespostasManifestacaoDoUsuario,
  getUsuarioByUserId,
  deleteManifestacao,
  atualizarStatusManifestacao,
  responderManifestacao,
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
import { checkAuth, checkRole } from "@/api/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import "./manifestacao.css";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import {
  SelectGroup,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import "quill/dist/quill.snow.css";

const MinhaManifestacao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [manifestacao, setManifestacao] = useState<Manifestacao>();
  const [avatar, setAvatar] = useState<string>();
  const [respostas, setRespostas] = useState<Resposta[]>();
  const [usuariosRespostas, setUsuariosRespostas] = useState<
    Record<number, User>
  >({});
  const [openConfirmacao, setOpenConfirmacao] = useState(false);
  const [openEditarStatus, setOpenEditarStatus] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [resposta, setResposta] = useState<string>("");
  const [openSuccessEditarStatus, setOpenSuccessEditarStatus] = useState(false);
  const [status, setStatus] = useState<
    "pendente" | "em_andamento" | "concluido"
  >(manifestacao?.Status || "pendente");
  const [statusEdicao, setStatusEdicao] = useState<
    "pendente" | "em_andamento" | "concluido"
  >(manifestacao?.Status || "pendente");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    checkAuth(navigate, ["admin", "moderador", "user"]);
    const fetchRole = async () => {
      const isAdmin = await checkRole("admin");
      const isModerador = await checkRole("moderador");
      setRole(isAdmin ? "admin" : isModerador ? "moderador" : "user");
    };
    fetchRole();
  }, []);

  const fetchRespostas = async () => {
    setRespostas(undefined);
    const response = await getRespostasManifestacaoDoUsuario(Number(id));
    const respostasData = response.data;
    setRespostas(respostasData.reverse());

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
        if (manifestacao?.User_ID === 1) {
          setAvatar("/user_placeholder_anonimo.png");
          return;
        }
        const response = await getUsuarioByUserId(manifestacao?.User_ID ?? 0);
        if (response.data) {
          response.data.Avatar
            ? setAvatar(`${URL_BASE_AVATAR}/${response.data.Avatar}`)
            : setAvatar("/user_placeholder.png");
        }
      } catch (error) {
        console.error("Erro ao buscar avatar:", error);
      }
    };

    if (manifestacao) {
      fetchAvatar();
      setStatus(manifestacao.Status);
    }
  }, [manifestacao, setAvatar]);

  if (!manifestacao) {
    navigate("/errors/404");
    return;
  }

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  const handleDelete = async () => {
    try {
      await deleteManifestacao(Number(id));
      setOpenConfirmacao(false);
      setOpenSuccess(true);
    } catch (error) {
      console.error("Erro ao deletar manifestação:", error);
    }
  };

  const handleSetStatus = async () => {
    try {
      await atualizarStatusManifestacao({
        Status: statusEdicao,
        Manifestacao_ID: manifestacao.Manifestacao_ID,
      });
      setOpenEditarStatus(false);
      setOpenSuccessEditarStatus(true);
      setStatus(statusEdicao);
    } catch (error) {
      console.error("Erro ao editar status da manifestação:", error);
    }
  };

  const handlePostResposta = async () => {
    try {
      if (!resposta.trim()) {
        toast.error("Por favor, insira uma resposta valida.", {
          icon: (
            <Icon
              icon="mdi:alert-circle"
              height={20}
              className="text-[var(--color-warning)]"
            />
          ),
        });
        return;
      } else if (resposta.trim().length < 5) {
        toast.error("A resposta deve ter pelo menos 5 caracteres.", {
          icon: (
            <Icon
              icon="mdi:alert-circle"
              height={20}
              className="text-[var(--color-warning)]"
            />
          ),
        });
        return;
      }

      const novaResposta = {
        Descricao: resposta,
      };
      const response = await responderManifestacao(
        manifestacao.Manifestacao_ID,
        novaResposta
      );
      setRespostas([response.data, ...(respostas || [])]);
      setResposta("");
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
    }
  };

  const closeModal = () => {
    setOpenConfirmacao(false);
  };

  const closeEditarStatus = () => {
    setOpenEditarStatus(false);
  };

  const closeSuccess = () => {
    setOpenSuccess(false);
    navigate("/minhas-manifestacoes");
  };

  const closeSucessEditarStatus = () => {
    setOpenSuccessEditarStatus(false);
  };

  return (
    <BlankLayout showNavbar showHeader showFooter={false}>
      <div className="grid grid-cols-2 w-full max-w-7xl mx-auto px-6 pt-12 pb-16 min-h-full ">
        <div className="col-span-2 display flex w-full justify-between">
          <div className="h-8 w-full flex gap-2 items-center">
            <Avatar onClick={() => navigate(`/perfil`)}>
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
          {(role === "admin" || role === "moderador") && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="focus:outline-none">
                <Icon
                  icon="heroicons-solid:menu-alt-3"
                  height="30px"
                  className="text-gray-700 pl-4 "
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="menu-mobile-content mt-1 mr-2 border-0">
                <DropdownMenuItem
                  className="custom-menu !bg-[var(--color-primary)] !text-white"
                  onClick={() => setOpenEditarStatus(true)}
                >
                  <Icon icon="material-symbols:edit-rounded" />
                  EDITAR
                </DropdownMenuItem>
                {role === "admin" && (
                  <DropdownMenuItem
                    className="custom-menu !bg-[var(--color-danger)] !text-white"
                    onClick={() => setOpenConfirmacao(true)}
                  >
                    <Icon icon="material-symbols:delete-rounded" />
                    DELETAR
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-5 col-span-2 ml-4">
          <h1 className="text-2xl font-semibold">{manifestacao.Titulo}</h1>
          <div className="ql-snow border-l border-r my-8">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: manifestacao.Descricao }}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-600 flex items-center">
              {formatDate(manifestacao.Data_Envio)}
            </p>
            <div
              className={`px-2 text-xs text-white h-6 ${
                status === "pendente"
                  ? "bg-[var(--color-warning)]"
                  : status === "em_andamento"
                  ? "bg-[var(--color-info)]"
                  : "bg-[var(--color-success)]"
              } rounded-full flex items-center justify-center`}
            >
              {status === "pendente"
                ? "Pendente"
                : status === "em_andamento"
                ? "Em andamento"
                : "Concluído"}
              <Icon
                icon={
                  status === "concluido"
                    ? "material-symbols:sentiment-excited-outline-rounded"
                    : status === "em_andamento"
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
            <div className="sticky top-20">
              <h1 className="text-2xl font-medium col-span-2 mb-8">
                Enviar resposta
              </h1>
              <Card className="mt-2 py-4 gap-4">
                <CardContent className="px-4 flex flex-col relative">
                  <Textarea
                    className="min-h-35 pb-15 overflow-hidden"
                    style={{
                      height: "35px",
                      resize: "none",
                      overflow: "hidden",
                    }}
                    onChange={(e) => {
                      setResposta(e.target.value);
                      e.target.style.height = "35px";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    value={resposta}
                  ></Textarea>
                  <Button
                    icon="material-symbols:send"
                    iconPosition="center"
                    className="mt-4 justify-end w-10 h-10 absolute right-7 bottom-3"
                    onClick={handlePostResposta}
                  />
                </CardContent>
                <CardFooter className="border-t pb-2">
                  <p className="text-sm text-red-500 w-full text-center">
                    Mantenha um tom respeitoso ao escrever sua resposta.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
          <div className="md:order-first col-span-2 md:col-span-1 flex flex-col gap-4 mt-8 md:mt-14">
            <h1 className="text-2xl font-medium col-span-2 mb-4">Respostas</h1>
            {respostas?.length === 0 ||
              (!respostas && (
                <div className="text-muted-foreground mt-4 w-full text-center">
                  Nenhuma resposta.
                </div>
              ))}
            {respostas?.map((resposta) => {
              const usuario = usuariosRespostas[resposta.User_ID];
              return (
                <Card key={resposta.Resposta_ID} className="py-4 gap-3">
                  <CardHeader className="px-4 flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center">
                      <Avatar>
                        <AvatarImage
                          src={
                            usuario?.User_ID === 1
                              ? "/user_placeholder_anonimo.png"
                              : usuario?.Avatar
                              ? `${URL_BASE_AVATAR}/${usuario.Avatar}`
                              : "/user_placeholder.png"
                          }
                          alt="Ícone do Usuário"
                          className="w-8 h-8 aspect-square rounded-full"
                        />
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-md font-medium leading-none">
                          {usuario?.Nome || "Usuário"}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {formatDate(resposta.Data_Criacao)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="ml-3 text-gray-600">{resposta.Descricao}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Dialog open={openConfirmacao} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
                Confirme a sua ação.
              </DialogTitle>
              <DialogDescription className="text-center">
                Deseja realmente deletar a manifestação?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
              <Button
                onClick={handleDelete}
                full_rounded
                color="success"
                className="w-full px-5"
                texto="sim"
              />
              <Button
                onClick={closeModal}
                full_rounded
                color="danger"
                className="w-full px-5"
                texto="cancelar"
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openEditarStatus} onOpenChange={closeEditarStatus}>
          <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
                Editar status
              </DialogTitle>
              <Select
                defaultValue={manifestacao.Status}
                onValueChange={(e) =>
                  setStatusEdicao(
                    e as "pendente" | "em_andamento" | "concluido"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Selecione um status</SelectLabel>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </DialogHeader>
            <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
              <Button
                onClick={handleSetStatus}
                full_rounded
                color="success"
                className="w-full px-5"
                texto="salvar"
              />
              <Button
                onClick={closeEditarStatus}
                full_rounded
                color="danger"
                className="w-full px-5"
                texto="cancelar"
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openSuccess} onOpenChange={closeSuccess}>
          <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
                Manifestação deletada com sucesso!
              </DialogTitle>
              <DialogDescription className="text-center">
                Clique no botão abaixo para voltar às suas manifestações.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center mt-4">
              <Button
                onClick={closeSuccess}
                full_rounded
                color="success"
                className="w-full sm:max-w-[200px] px-5"
                texto="voltar"
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openSuccessEditarStatus}
          onOpenChange={closeSucessEditarStatus}
        >
          <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
                Status alterado com sucesso!
              </DialogTitle>
              <DialogDescription className="text-center">
                Clique no botão abaixo para continuar.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center mt-4">
              <Button
                onClick={closeSucessEditarStatus}
                full_rounded
                color="success"
                className="w-full sm:max-w-[200px] px-5"
                texto="ok"
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BlankLayout>
  );
};

export default MinhaManifestacao;
