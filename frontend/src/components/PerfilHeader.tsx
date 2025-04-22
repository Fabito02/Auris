import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Icon } from "@iconify-icon/react";
import { Link } from "react-router-dom";
import "./PerfilHeader.css";
import Button from "./buttons/Button";

const PerfilHeader = () => {
  return (
    <div className="flex flex-row justify-end items-center w-[125px]">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="botao-notificacao active">
            <Icon
              icon="material-symbols:notifications-rounded"
              className="mr-[15px] text-[26px] text-[#00000066]"
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="shadow-md w-[220px] mr-2 mt-5 rounded-lg dropdown border-0 rounded-[16px] menu-opcoes w-[100vw] max-w-[420px] max-h-[600px] mx-2">
          <div className="py-2">
            <p className="text-center font-semibold ">NOTIFICAÇÕES</p>
          </div>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem asChild className="mt-1 rounded-[12px] p-4 notificacao">
            <div className="grid grid-cols-5 gap-2 shadow-sm">
              <Button
                className="absolute top-[8px] right-[8px] p-1 w-[24px] h-[24px] flex items-center justify-center"
                onClick={() => console.log('Deletar notificação')}
                texto="×"
                color="danger"
                iconPosition="center"
                outline
                full_rounded
              />
              <h2 className="font-semibold text-[1rem] col-span-5">Novo comentário</h2>
              <p className="text-sm text-gray-600 col-span-5">
                Sua manifestação "Problemas na estrutura do refeitorio." recebeu um comentário.
              </p>
              <span className="text-xs text-gray-400 col-span-3 flex items-center justify-start">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span
                className="text-xs font-semibold col-span-2 flex items-center justify-end"
                style={{ color: "var(--color-warning)" }}
              >
                Pendente
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="mt-1 rounded-[12px] p-4 notificacao">
            <div className="grid grid-cols-5 gap-2 shadow-sm">
              <Button
                className="absolute top-[8px] right-[8px] p-1 w-[24px] h-[24px] flex items-center justify-center"
                onClick={() => console.log('Deletar notificação')}
                texto="×"
                color="danger"
                iconPosition="center"
                outline
                full_rounded
              />
              <h2 className="font-semibold text-[1rem] col-span-5">Nova mensagem</h2>
              <p className="text-sm text-gray-600 col-span-5">
                Você recebeu uma nova mensagem de um outro usuário.
              </p>
              <span className="text-xs text-gray-400 col-span-3 flex items-center justify-start">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span
                className="text-xs font-semibold col-span-2 flex items-center justify-end"
                style={{ color: "var(--color-success)" }}
              >
                Lido
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="mt-1 rounded-[12px] p-4 notificacao">
            <div className="grid grid-cols-5 gap-2 shadow-sm">
              <Button
                className="absolute top-[8px] right-[8px] p-1 w-[24px] h-[24px] flex items-center justify-center"
                onClick={() => console.log('Deletar notificação')}
                texto="×"
                color="danger"
                iconPosition="center"
                outline
                full_rounded
              />
              <h2 className="font-semibold text-[1rem] col-span-5">Atualização de manifestação</h2>
              <p className="text-sm text-gray-600 col-span-5">
                Sua manifestação "Problemas na estrutura do refeitorio." foi atualizada.
              </p>
              <span className="text-xs text-gray-400 col-span-3 flex items-center justify-start">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span
                className="text-xs font-semibold col-span-2 flex items-center justify-end"
                style={{ color: "var(--color-warning)" }}
              >
                Pendente
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10  h-10 mr-2 cursor-pointer">
            <AvatarImage src="/pudim.png" alt="Ícone do Usuário" />
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="shadow-md w-[220px] mr-2 mt-4 rounded-lg dropdown border-0 rounded-[16px] menu-opcoes">
          <div className="flex gap-3 pl-2 py-2">
          <Avatar className="w-[45px] h-[45px]">
            <AvatarImage src="/pudim.png" alt="Ícone do Usuário" />
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          <p className="font-medium username">Username</p>
          </div>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem asChild className="mt-1 rounded-[12px] item-dropdown">
            <Link to="/perfil" className="flex gap-2 link_item">
              <Icon icon="material-symbols:settings-rounded" className="iconMenu" />
              Configurações
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className=" rounded-[12px] item-dropdown">
            <Link to="/minhas-manifestacoes" className="flex items-center gap-2 link_item">
              <Icon icon="material-symbols:feedback-rounded" className="iconMenu" />
              Minhas manifestações
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className=" rounded-[12px] item-dropdown">
            <Link to="" className="flex items-center gap-2 link_item">
              <Icon icon="material-symbols:logout-rounded" className="iconMenu" />
              Sair
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PerfilHeader;
