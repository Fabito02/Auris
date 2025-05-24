import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";
import CardManifestacao from "@/components/CardManifestacao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/buttons/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { Icon } from "@iconify-icon/react";
import { Input } from "@/components/ui/input";
import { getManifestacoes } from "@/api/api_routes";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const GerenciarManifestacoes = () => {
  const navigate = useNavigate();

  const [manifestacoes, setManifestacoes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    const fetchManifestacoes = async () => {
      try {
        const response = await getManifestacoes();
        if (response.success) {
          setManifestacoes(Array.isArray(response.data) ? response.data.slice().reverse() : []);
        } else {
          console.error("Erro ao buscar manifestações:", response.error);
        }
      } catch (error) {
        console.error("Erro ao buscar manifestações:", error);
      }
    };

    fetchManifestacoes();
  }, [setManifestacoes]);

  const manifestacoesFiltradas = useMemo(() => {
    if (search) {
      return manifestacoes.filter((manifestacao) => {
        const lowerSearch = search.toLowerCase();
        return (
          manifestacao.Titulo?.toLowerCase().includes(lowerSearch) ||
          manifestacao.Descricao.toString().toLowerCase().includes(lowerSearch) ||
          manifestacao.Tipo_manifestacao.toString().toLowerCase().includes(lowerSearch) ||
          manifestacao.Prioridade.toString().toLowerCase().includes(lowerSearch) ||
          manifestacao.Tipo?.toString().toLowerCase().includes(lowerSearch) ||
          manifestacao.Status?.toString().toLowerCase().includes(lowerSearch) ||
          manifestacao.Data_Envio?.toString().toLowerCase().includes(lowerSearch)
        );
      });
    } else {
      return manifestacoes;
    }
  }, [search, manifestacoes]);

  const manifestacoesFiltradasStatus = useMemo(() => {
    if (filtroStatus === "todos") {
      return manifestacoesFiltradas;
    } else if (filtroStatus) {
      return manifestacoesFiltradas.filter(
        (manifestacao) =>
          manifestacao.Status?.toLowerCase() === filtroStatus.toLowerCase()
      );
    }
  }, [filtroStatus, manifestacoesFiltradas]);

  return (
    <BlankLayout showFooter={false} showHeader showNavbar>
      <div className="px-4 mt-12 max-w-6xl mx-auto">
        <Tabs defaultValue="manifestacoes" className="mb-10">
          <TabsList
            className="flex w-full justify-start overflow-x-auto whitespace-nowrap h-[40px] px-1 gap-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <TabsTrigger value="manifestacoes">
              Todas as manifestações
            </TabsTrigger>
            <TabsTrigger value="reclamacoes">Reclamações</TabsTrigger>
            <TabsTrigger value="elogios">Elogios</TabsTrigger>
            <TabsTrigger value="denuncias">Denúncias</TabsTrigger>
            <TabsTrigger value="sugestoes">Sugestões</TabsTrigger>
          </TabsList>
          <TabsContent value="manifestacoes">
            <Card className="mb-6">
              <CardHeader className="relative">
                <CardTitle className="text-2xl">Manifestações</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco")}
                ></Button>
              </CardHeader>

              <div className="flex justify-between px-4 gap-4">
                <div className="relative w-[calc(100%-55px)] md:max-w-md">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/1 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 pl-9"
                  />
                </div>

                <Select
                  value={filtroStatus}
                  onValueChange={(value) => setFiltroStatus(value)}
                >
                  <SelectTrigger className="custom-select">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao
                  action="/admin/gerenciar/manifestacoes/"
                  manifestacoes={manifestacoesFiltradasStatus ?? []}
                />
                {manifestacoesFiltradasStatus?.length === 0 && (
                  <div className="text-muted-foreground w-full text-center ">
                    Nenhuma manifestação encontrada.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reclamacoes">
            <Card className="mb-6">
              <CardHeader className="relative">
                <CardTitle className="text-2xl">Reclamações</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco/reclamacao")}
                ></Button>
              </CardHeader>

              <div className="flex justify-between px-4 gap-4">
                <div className="relative w-[calc(100%-55px)] md:max-w-md">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/1 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 pl-9"
                  />
                </div>

                <Select
                  value={filtroStatus}
                  onValueChange={(value) => setFiltroStatus(value)}
                >
                  <SelectTrigger className="custom-select">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao
                  action="/admin/gerenciar/manifestacoes/"
                  filtrarTipo="reclamacao"
                  manifestacoes={manifestacoesFiltradasStatus ?? []}
                />
                {manifestacoesFiltradasStatus?.length === 0 && (
                  <div className="text-muted-foreground w-full text-center ">
                    Nenhuma reclamação encontrada.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="elogios">
            <Card className="mb-6">
              <CardHeader className="relative">
                <CardTitle className="text-2xl">Elogios</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco/elogio")}
                ></Button>
              </CardHeader>

              <div className="flex justify-between px-4 gap-4">
                <div className="relative w-[calc(100%-55px)] md:max-w-md">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/1 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 pl-9"
                  />
                </div>

                <Select
                  value={filtroStatus}
                  onValueChange={(value) => setFiltroStatus(value)}
                >
                  <SelectTrigger className="custom-select">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao
                  action="/admin/gerenciar/manifestacoes/"
                  filtrarTipo="elogio"
                  manifestacoes={manifestacoesFiltradasStatus ?? []}
                />
                {manifestacoesFiltradasStatus?.length === 0 && (
                  <div className="text-muted-foreground w-full text-center ">
                    Nenhum elogio encontrado.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="denuncias">
            <Card className="mb-6">
              <CardHeader className="relative">
                <CardTitle className="text-2xl">Denúncias</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco/denuncia")}
                ></Button>
              </CardHeader>

              <div className="flex justify-between px-4 gap-4">
                <div className="relative w-[calc(100%-55px)] md:max-w-md">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/1 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 pl-9"
                  />
                </div>

                <Select
                  value={filtroStatus}
                  onValueChange={(value) => setFiltroStatus(value)}
                >
                  <SelectTrigger className="custom-select">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao
                  action="/admin/gerenciar/manifestacoes/"
                  filtrarTipo="denuncia"
                  manifestacoes={manifestacoesFiltradasStatus ?? []}
                />
                {manifestacoesFiltradasStatus?.length === 0 && (
                  <div className="text-muted-foreground w-full text-center ">
                    Nenhuma denúncia encontrada.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sugestoes">
            <Card className="mb-6">
              <CardHeader className="relative">
                <CardTitle className="text-2xl">Sugestões</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco/sugestao")}
                ></Button>
              </CardHeader>

              <div className="flex justify-between px-4 gap-4">
                <div className="relative w-[calc(100%-55px)] md:max-w-md">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/1 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 pl-9"
                  />
                </div>

                <Select
                  value={filtroStatus}
                  onValueChange={(value) => setFiltroStatus(value)}
                >
                  <SelectTrigger className="custom-select">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao
                  action="/admin/gerenciar/manifestacoes/"
                  filtrarTipo="sugestao"
                  manifestacoes={manifestacoesFiltradasStatus ?? []}
                />
                {manifestacoesFiltradasStatus?.length === 0 && (
                  <div className="text-muted-foreground w-full text-center ">
                    Nenhuma sugestão encontrada.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BlankLayout>
  );
};

export default GerenciarManifestacoes;
