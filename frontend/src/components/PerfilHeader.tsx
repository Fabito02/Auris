import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Icon } from "@iconify-icon/react";
import { Link } from "react-router-dom";
import "./PerfilHeader.css";
import { postLogout } from "@/api/api_routes";
import Button from "./buttons/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { getUsuarioAtual, getAvatar } from "@/api/api_routes";
import { User } from "@/types/api";

const PerfilHeader = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [logoutSucesso, setLogoutSucesso] = useState<boolean | undefined>(undefined);
  const [avatar , setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const usuario = await getUsuarioAtual();
      setUser(usuario.user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchAvatar = async () => {
        if (!user?.User_ID) return;
        const avatar = await getAvatar(user.User_ID);
        setAvatar(avatar.avatarUrl);
      };
  
      fetchAvatar()
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await postLogout();
      localStorage.removeItem("auris_token");
      localStorage.removeItem("auris_role");
      setLogoutSucesso(true);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="flex flex-row justify-end items-center w-[125px]">
      <Popover>
        <PopoverTrigger asChild>
          <div className="botao-notificacao active">
            <Icon
              icon="material-symbols:notifications-rounded"
              className="mr-[15px] text-[26px] text-[#00000066]"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent className="shadow-lg w-[220px] mr-2 mt-5 rounded-lg dropdown border-0 rounded-[16px] menu-opcoes w-[100vw] max-w-[420px] max-h-[600px] mx-2 p-3 gap-2">
          <div className="pb-2">
            <h1 className="text-center font-semibold">NOTIFICAÇÕES</h1>
          </div>

          <div className="my-1 border-t border-gray-200" />

          <div className="mt-1 rounded-[12px] p-4 notificacao shadow-md relative">
            <div className="grid grid-cols-5 gap-2">
              <Button
                className="absolute top-[8px] right-[8px] p-1 w-[24px] h-[24px] flex items-center justify-center"
                onClick={() => console.log("Deletar notificação")}
                texto="×"
                color="danger"
                iconPosition="center"
                outline
                full_rounded
              />
              <h2 className="font-semibold text-[1rem] col-span-5">
                Novo comentário
              </h2>
              <p className="text-sm text-gray-600 col-span-5">
                Sua manifestação "Problemas na estrutura do refeitório." recebeu
                um comentário.
              </p>

              <div className="text-xs text-gray-400 col-span-3 flex items-center justify-start">
                {new Date().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div
                className="text-xs font-semibold col-span-2 flex items-center justify-end"
                style={{ color: "var(--color-warning)" }}
              >
                Pendente
              </div>
            </div>
          </div>

          <div className="mt-1 rounded-[12px] p-4 notificacao shadow-md relative">
            <div className="grid grid-cols-5 gap-2">
              <Button
                className="absolute top-[8px] right-[8px] p-1 w-[24px] h-[24px] flex items-center justify-center"
                onClick={() => console.log("Deletar notificação")}
                texto="×"
                color="danger"
                iconPosition="center"
                outline
                full_rounded
              />
              <h2 className="font-semibold text-[1rem] col-span-5">
                Nova mensagem
              </h2>
              <p className="text-sm text-gray-600 col-span-5">
                Você recebeu uma nova mensagem de um outro usuário.
              </p>

              <div className="text-xs text-gray-400 col-span-3 flex items-center justify-start">
                {new Date().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div
                className="text-xs font-semibold col-span-2 flex items-center justify-end"
                style={{ color: "var(--color-success)" }}
              >
                Lido
              </div>
            </div>
          </div>

          <div className="mt-1 rounded-[12px] p-4 notificacao shadow-md relative">
            <div className="grid grid-cols-5 gap-2">
              <Button
                className="absolute top-[8px] right-[8px] p-1 w-[24px] h-[24px] flex items-center justify-center"
                onClick={() => console.log("Deletar notificação")}
                texto="×"
                color="danger"
                iconPosition="center"
                outline
                full_rounded
              />
              <h2 className="font-semibold text-[1rem] col-span-5">
                Atualização de manifestação
              </h2>
              <p className="text-sm text-gray-600 col-span-5">
                Sua manifestação "Problemas na estrutura do refeitório." foi
                atualizada.
              </p>

              <div className="text-xs text-gray-400 col-span-3 flex items-center justify-start">
                {new Date().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div
                className="text-xs font-semibold col-span-2 flex items-center justify-end"
                style={{ color: "var(--color-warning)" }}
              >
                Pendente
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10  h-10 mr-2 cursor-pointer">
            <AvatarImage
              src={avatar || "/user_placeholder.png"}
              alt="Ícone do Usuário"
            />
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="shadow-md w-[220px] mr-2 mt-4 rounded-lg dropdown border-0 rounded-[16px] menu-opcoes">
          <div className="flex gap-3 pl-2 py-2">
            <Avatar className="w-[45px] h-[45px]">
              <AvatarImage
                src={avatar || "/user_placeholder.png"}
                alt="Ícone do Usuário"
              />
            </Avatar>
            <p className="font-medium username">
              {user?.Nome?.split(" ")[0] || "Usuário"}
            </p>
          </div>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            asChild
            className="mt-1 rounded-[12px] item-dropdown"
          >
            <Link to="/perfil" className="flex gap-2 link_item">
              <Icon
                icon="material-symbols:settings-rounded"
                className="iconMenu"
              />
              Configurações
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className=" rounded-[12px] item-dropdown">
            <Link
              to="/minhas-manifestacoes"
              className="flex items-center gap-2 link_item"
            >
              <Icon
                icon="material-symbols:feedback-rounded"
                className="iconMenu"
              />
              Minhas manifestações
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className=" rounded-[12px] item-dropdown">
            <div
              onClick={() => handleLogout()}
              className="flex items-center gap-2 link_item"
            >
              <Icon
                icon="material-symbols:logout-rounded"
                className="iconMenu"
              />
              Sair
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={logoutSucesso}
        onOpenChange={(open) => setLogoutSucesso(open)}
      >
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
              Logout realizado com sucesso!
            </DialogTitle>
            <DialogDescription className="text-center">
              Você precisa fazer login.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              onClick={() => {
                setLogoutSucesso(false);
                navigate("/login");
              }}
              full_rounded
              color="success"
              className="w-full sm:max-w-[200px] px-5"
              texto="login"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PerfilHeader;
