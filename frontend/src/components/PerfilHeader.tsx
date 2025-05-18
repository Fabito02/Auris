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
import { getAvatar } from "@/api/api_routes";
import CardNotificacao from "./CardNotificacao";
import { useUsuarioAtual } from "@/hooks/useUsuarioAtual";
import { getNotificacoesDoUsuario } from "@/api/api_routes";
import { Notificacao } from "@/types/api";

const PerfilHeader = () => {
  const navigate = useNavigate();
  const user = useUsuarioAtual();

  const [logoutSucesso, setLogoutSucesso] = useState<boolean | undefined>(
    undefined
  );
  const [avatar, setAvatar] = useState<string | null>(null);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

    const fetchNotificacoes = async () => {
      const response = await getNotificacoesDoUsuario();
      const data = response.data;
      setNotificacoes(Array.isArray(data) ? data.reverse() : [data]);
    };

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchAvatar = async () => {
        if (!user?.User_ID) return;
        const avatar = await getAvatar(user.User_ID);
        setAvatar(avatar.avatarUrl);
      };

      fetchAvatar();
    }
  }, [user]);

  useEffect(() => {
    const botaoNotificacao = document.querySelector(".botao-notificacao");
    if (notificacoes.length > 0) {
      botaoNotificacao?.classList.add("active");
    } else {
      botaoNotificacao?.classList.remove("active");
    }
  }, [notificacoes]);

  const handleLogout = async () => {
    try {
      await postLogout();
      localStorage.removeItem("auris_token");
      setLogoutSucesso(true);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="flex flex-row justify-end items-center w-[125px]">
      <Popover>
        <PopoverTrigger asChild>
          <div className="botao-notificacao"
            onClick={() => fetchNotificacoes()}
          >
            <Icon
              icon="material-symbols:notifications-rounded"
              className="mr-[15px] text-[26px] text-[#00000075]"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="shadow-lg mr-2 mt-5 dropdown border-0 rounded-[16px] menu-opcoes w-[100vw] max-w-[420px] max-h-[600px] mx-2 p-3 gap-2 overflow-auto"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <div className="pb-2">
            <h1 className="text-center font-semibold">NOTIFICAÇÕES</h1>
          </div>
          <div className="my-1 border-t border-gray-200" />
          <CardNotificacao notificacoes={notificacoes} />
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

        <DropdownMenuContent className="shadow-md w-[220px] mr-2 mt-4 dropdown border-0 rounded-[16px] menu-opcoes">
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
