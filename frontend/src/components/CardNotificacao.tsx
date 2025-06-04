import { Notificacao } from "@/types/api";
import Button from "@/components/buttons/Button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { atualizarStatusNotificacao } from "@/api/api_routes";

interface CardNotificacaoProps {
  notificacoes: Notificacao[];
  onDelete: (id: number) => void;
}

const CardNotificacao = ({ notificacoes, onDelete }: CardNotificacaoProps) => {
  const [openNotificacao, setOpenNotificacao] = useState(false);
  const [notificacaoAberta, setNotificacaoAberta] =
    useState<Notificacao | null>();

  if (notificacoes.length === 0) {
    return (
      <h2 className="text-muted-foreground p-4 text-center">
        Nenhuma notificação.
      </h2>
    );
  }

  const sortedNotificacoes = [...notificacoes].sort(
    (a, b) =>
      new Date(b.Data_Criacao).getTime() - new Date(a.Data_Criacao).getTime()
  );

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  const closeNotificacao = () => {
    setOpenNotificacao(false);
  };

  const handleAbrirNotificacao = async (id: number, status: string) => {
    try {
      setOpenNotificacao(true);
      if (status === "lida") return;
      await atualizarStatusNotificacao(id, { Status: "lida" });
    } catch (error) {
      console.error("Erro ao abrir notificação:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3.5 w-full mt-3">
      {sortedNotificacoes.map((n) => (
        <div
          key={n.Notificacao_ID}
          className="rounded-[12px] p-4 notificacao shadow-md relative"
          onClick={() => {
            setNotificacaoAberta(n);
            handleAbrirNotificacao(n.Notificacao_ID, n.Status);
          }}
        >
          <div className="grid grid-cols-5 gap-2">
            <Button
              className="absolute top-[8px] right-[8px] p-1 w-[24px] h-[24px] flex items-center justify-center"
              onClick={() => onDelete(n.Notificacao_ID)}
              texto="×"
              color="danger"
              iconPosition="center"
              outline
              full_rounded
            />
            <h2 className="font-semibold text-[1rem] col-span-5 line-clamp-1">
              {n.Titulo}
            </h2>
            <p className="text-sm text-gray-600 col-span-5 line-clamp-2">
              {n.Mensagem}
            </p>

            <div className="text-xs text-gray-400 col-span-3 flex items-center justify-start">
              {formatDate(n.Data_Criacao)}
            </div>

            <div
              className={`text-xs font-semibold col-span-2 flex items-center justify-end text-[var(--color-${
                n.Status === "lida" ? "success" : "warning"
              })]`}
            >
              {n.Status.charAt(0).toUpperCase() + n.Status.slice(1)}
            </div>
          </div>
        </div>
      ))}

      <Dialog open={openNotificacao} onOpenChange={closeNotificacao}>
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-2xl mb-4">
              {notificacaoAberta?.Titulo}
            </DialogTitle>
            <DialogDescription className="border-l px-4 mx-4 text-gray-800">
              {notificacaoAberta?.Mensagem}
              <div className="text-xs text-muted-foreground mt-2">
                {notificacaoAberta?.Data_Criacao
                  ? formatDate(notificacaoAberta.Data_Criacao)
                  : "Data inválida"}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              onClick={closeNotificacao}
              full_rounded
              color="success"
              className="w-full sm:max-w-[200px] px-5"
              texto="ok"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardNotificacao;
