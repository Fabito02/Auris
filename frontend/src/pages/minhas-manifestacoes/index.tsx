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

const MinhasManifestacoes = () => {
  const navigate = useNavigate();

  const [manifestacoes, setManifestacoes] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setManifestacoes([
      {
        Manifestacao_ID: 1,
        Titulo: "Assédio no corredor principal",
        Descricao:
          "No dia 14/05/2025, por volta das 10h, eu (discente do curso de Zootecnia) estava caminhando pelo corredor principal do 2º prédio quando fui abordado pelo professor de matemática, que fez um comentário inapropriado sobre minha roupa. Eu me senti desconfortável e ofendido com o comportamento do professor.",
        Tipo: "Assédio",
        Tipo_manifestacao: "denuncia",
        Prioridade: "urgente",
        User_ID: 4,
        Status: "pendente",
        Data_Envio: new Date().toISOString(),
        Anonimo: false,
      },
      {
        Manifestacao_ID: 2,
        Titulo: "Problema com a internet no laboratório de redes",
        Descricao:
          "A internet do laboratório 1 não está funcionando corretamente. Eu tentei conectar meu notebook, mas não consegui. Além disso, a rede Wi-Fi do laboratório não está aparecendo na lista de redes disponíveis.",
        Tipo: "Equipamentos",
        Tipo_manifestacao: "reclamacao",
        Prioridade: "alta",
        User_ID: 4,
        Status: "em_andamento",
        Data_Envio: new Date().toISOString(),
        Anonimo: false,
      },
      {
        Manifestacao_ID: 3,
        Titulo: "Elogio pela limpeza do banheiro masculino",
        Descricao:
          "O banheiro masculino do 2º prédio está sempre impecável e bem cuidado. Eu gostaria de parabenizar a equipe de limpeza pelo ótimo trabalho que eles fazem.",
        Tipo: "Estrutura e espaços",
        Tipo_manifestacao: "elogio",
        Local: "Prédio Pedagógico II",
        Prioridade: "baixa",
        User_ID: 4,
        Status: "concluido",
        Data_Envio: new Date().toISOString(),
        Anonimo: false,
      },
      {
        Manifestacao_ID: 4,
        Titulo: "Sugestão de melhorias para o site da Campus",
        Descricao:
          "Sugestão de melhorias para o site da Campus, como a possibilidade de ter uma seção de notícias, uma seção de eventos e uma seção de links úteis. Além disso, sugestão de melhoria na navegação e responsividade do site.",
        Tipo: "Serviço",
        Tipo_manifestacao: "sugestao",
        Prioridade: "media",
        User_ID: 4,
        Status: "pendente",
        Data_Envio: new Date().toISOString(),
        Anonimo: false,
      },
    ]);
  }, []);

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
                  color="secondary"
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
                  color="secondary"
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
                <CardManifestacao manifestacoes={manifestacoesFiltradas} />
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
                  color="secondary"
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
                <CardManifestacao manifestacoes={manifestacoesFiltradas} />
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
                  color="secondary"
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
                <CardManifestacao manifestacoes={manifestacoesFiltradas} />
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
                  color="secondary"
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
                <CardManifestacao manifestacoes={manifestacoesFiltradas} />
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
