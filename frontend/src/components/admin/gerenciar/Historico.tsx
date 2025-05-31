import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getLogs } from "@/api/api_routes";
import { useEffect, useState, useMemo } from "react";
import { Log } from "@/types/api";
import { Icon } from "@iconify-icon/react";
import AnimarAoVer from "@/components/AnimarAoVer";

export default function Component() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getLogs().then((res) => {
      setLogs(res.data);
    });
  }, []);

  const logsFiltrados = useMemo(() => {
    return logs.filter(
      (log) =>
        log.Acao.toLowerCase().includes(search.toLowerCase()) ||
        log.User_ID.toString().includes(search)
    );
  }, [search, logs]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      <h1 className="text-3xl my-6 font-[500]">Histórico de Atividades</h1>
      <div className="relative">
        <Icon
          icon="lucide:search"
          height={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Pesquisar ação ou ID do usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 md:max-w-md pl-9"
        />
      </div>
      <AnimarAoVer>
        <Table>
          <TableCaption>
            {logsFiltrados.length === 0 && (
              <div className="text-muted-foreground w-full text-center ">
                Nenhuma atividade encontrada.
              </div>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Ação</TableHead>
              <TableHead className="w-[160px]">Data da ação</TableHead>
              <TableHead className="text-right w-[120px]">
                ID do Usuário
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logsFiltrados
              .slice()
              .reverse()
              .map((log: Log) => (
                <TableRow key={log.Log_ID}>
                  <TableCell>{log.Acao}</TableCell>
                  <TableCell>
                    {new Date(log.Data_Acao).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell className="text-right">{log.User_ID}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter />
        </Table>
      </AnimarAoVer>
    </div>
  );
}
