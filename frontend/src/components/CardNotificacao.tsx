import { Notificacao } from "@/types/api";
import Button from "@/components/buttons/Button";

interface CardNotificacaoProps {
  notificacoes: Notificacao[];
  onDelete: (id: number) => void;
}

const CardNotificacao = ({
  notificacoes, 
  onDelete
}: CardNotificacaoProps) => {

  if (notificacoes.length === 0) {
    return (
      <h2 className="text-muted-foreground p-4 text-center">
        Nenhuma notificação.
      </h2>
    );
  }

  const sortedNotificacoes = [...notificacoes].sort((a, b) => 
    new Date(b.Data_Criacao).getTime() - new Date(a.Data_Criacao).getTime()
  );

  return (
    <div className="grid grid-cols-1 gap-3.5 w-full mt-3">
      {sortedNotificacoes.map((m) => (
        <div
          key={m.Notificacao_ID}
          className="rounded-[12px] p-4 notificacao shadow-md relative"
        >
          <div className="grid grid-cols-5 gap-2">
            <Button
              className="absolute top-[8px] right-[8px] p-1 w-[24px] h-[24px] flex items-center justify-center"
              onClick={() => onDelete(m.Notificacao_ID)}
              texto="×"
              color="danger"
              iconPosition="center"
              outline
              full_rounded
            />
            <h2 className="font-semibold text-[1rem] col-span-5 line-clamp-1">
              {m.Titulo}
            </h2>
            <p className="text-sm text-gray-600 col-span-5 line-clamp-2">
              {m.Mensagem}
            </p>

            <div className="text-xs text-gray-400 col-span-3 flex items-center justify-start">
              {new Date(m.Data_Criacao).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}{" "}
              {new Date(m.Data_Criacao).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            <div
              className={`text-xs font-semibold col-span-2 flex items-center justify-end text-[var(--color-${
                m.Status === "lida" ? "success" : "warning"
              })]`}
            >
              {m.Status.charAt(0).toUpperCase() + m.Status.slice(1)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardNotificacao;

