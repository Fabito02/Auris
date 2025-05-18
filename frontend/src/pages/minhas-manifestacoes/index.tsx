import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";
import CardManifestacao from "@/components/CardManifestacao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/buttons/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { Manifestacao } from "@/types/api";
import { Icon } from "@iconify-icon/react";
import { Input } from "@/components/ui/input";
import { getManifestacoesDoUsuario } from "@/api/api_routes";

const MinhasManifestacoes = () => {
  const navigate = useNavigate();

  const [manifestacoes, setManifestacoes] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchManifestacoes = async () => {
      try {
        const response = await getManifestacoesDoUsuario();
        if (response.success) {
          setManifestacoes([response.data]);
        } else {
          console.error("Erro ao buscar manifestações:", response.error);
        }
      } catch (error) {
        console.error("Erro ao buscar manifestações:", error);
      }
    }

    fetchManifestacoes();
  }, [setManifestacoes]);

  const manifestacoesFiltradas = useMemo(() => {
    return manifestacoes.filter(
      (manifestacoes: Manifestacao) =>
        manifestacoes.Titulo?.toLowerCase().includes(search.toLowerCase()) ||
        manifestacoes.Descricao.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        manifestacoes.Tipo_manifestacao.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        manifestacoes.Prioridade.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        manifestacoes.Tipo?.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        manifestacoes.Status?.toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        manifestacoes.Data_Envio?.toString()
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search, manifestacoes]);

  useEffect(() => {
    document.title = "Minhas Manifestações";
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin", "moderador", "user"]);
    }
  }, []);

  return (
    <BlankLayout showFooter={false} showHeader showNavbar>
      <div className="px-4 mt-12 w-6xl mx-auto">
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
                <CardTitle className="text-2xl">Suas manifestações</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco")}
                ></Button>
              </CardHeader>

              <div className=" px-4">
                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-[calc(100%-55px)] md:max-w-md pl-9"
                  />
                </div>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao manifestacoes={manifestacoesFiltradas} />
                {manifestacoesFiltradas.length === 0 && (
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
                <CardTitle className="text-2xl">Suas reclamações</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco/reclamacao")}
                ></Button>
              </CardHeader>

              <div className=" px-4">
                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-[calc(100%-55px)] md:max-w-md pl-9"
                  />
                </div>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao filtrarTipo="reclamacao" manifestacoes={manifestacoesFiltradas} />
                {manifestacoesFiltradas.length === 0 && (
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
                <CardTitle className="text-2xl">Seus elogios</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco/elogio")}
                ></Button>
              </CardHeader>

              <div className=" px-4">
                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-[calc(100%-55px)] md:max-w-md pl-9"
                  />
                </div>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao filtrarTipo="elogio" manifestacoes={manifestacoesFiltradas} />
                {manifestacoesFiltradas.length === 0 && (
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
                <CardTitle className="text-2xl">Suas denúncias</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco/denuncia")}
                ></Button>
              </CardHeader>

              <div className=" px-4">
                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-[calc(100%-55px)] md:max-w-md pl-9"
                  />
                </div>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao filtrarTipo="denuncia" manifestacoes={manifestacoesFiltradas} />
                {manifestacoesFiltradas.length === 0 && (
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
                <CardTitle className="text-2xl">Suas sugestões</CardTitle>
                <Button
                  iconPosition="center"
                  icon="ic:round-plus"
                  className="p-0 w-9 h-9 absolute right-3 top-2 transform -translate-y-1/2"
                  onClick={() => navigate("/fale-conosco/sugestao")}
                ></Button>
              </CardHeader>

              <div className=" px-4">
                <div className="relative">
                  <Icon
                    icon="lucide:search"
                    height={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Pesquisar por título, status, tipo, prioridade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 w-[calc(100%-55px)] md:max-w-md pl-9"
                  />
                </div>
              </div>

              <CardContent className="px-4 space-y-4">
                <CardManifestacao filtrarTipo="sugestao" manifestacoes={manifestacoesFiltradas} />
                {manifestacoesFiltradas.length === 0 && (
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

export default MinhasManifestacoes;
