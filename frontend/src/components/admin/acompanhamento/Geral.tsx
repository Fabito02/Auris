import {
  CartesianGrid,
  XAxis,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Label,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardInfo from "../../card-info/CardInfo";
import { Manifestacao, User } from "@/types/api";

interface props {
  manifestacoes: Manifestacao[];
  usuarios: User[];
}

export default function Component({ manifestacoes, usuarios }: props) {
  const manifestacoesInfo = {
    manifestacoes: manifestacoes.length,
    reclamacoes: manifestacoes.filter(
      (manifestacao) => manifestacao.Tipo_manifestacao === "reclamacao"
    ).length,
    elogios: manifestacoes.filter(
      (manifestacao) => manifestacao.Tipo_manifestacao === "elogio"
    ).length,
    denuncias: manifestacoes.filter(
      (manifestacao) => manifestacao.Tipo_manifestacao === "denuncia"
    ).length,
    sugestoes: manifestacoes.filter(
      (manifestacao) => manifestacao.Tipo_manifestacao === "sugestao"
    ).length,
    pendentes: manifestacoes.filter(
      (manifestacao) => manifestacao.Status === "pendente"
    ).length,
    emAndamento: manifestacoes.filter(
      (manifestacao) => manifestacao.Status === "em_andamento"
    ).length,
    concluido: manifestacoes.filter(
      (manifestacao) => manifestacao.Status === "concluido"
    ).length,
  };

  const dataDeHoje = new Date();
  const manifestacoesInfo7dias = Array.from({ length: 7 }, (_, i) => {
    const start = new Date(
      dataDeHoje.getFullYear(),
      dataDeHoje.getMonth(),
      dataDeHoje.getDate() - (6 - i)
    );
    const end = new Date(
      dataDeHoje.getFullYear(),
      dataDeHoje.getMonth(),
      dataDeHoje.getDate() - (6 - i) + 1
    );
    return manifestacoes.filter((manifestacao) => {
      const dataEnvio = new Date(manifestacao.Data_Envio);
      return dataEnvio >= start && dataEnvio < end;
    }).length;
  });

  const manifestacoesPorTipoUsuario = {
    alunos: manifestacoes.filter((manifestacao) =>
      usuarios.find(
        (usuario) =>
          usuario.User_ID === manifestacao.User_ID && usuario.Tipo === "aluno"
      )
    ).length,
    servidores: manifestacoes.filter((manifestacao) =>
      usuarios.find(
        (usuario) =>
          usuario.User_ID === manifestacao.User_ID &&
          usuario.Tipo === "servidor"
      )
    ).length,
  };

  const data_cards = [
    {
      cor: "danger",
      total: manifestacoesInfo.manifestacoes,
      titulo: "Manifestações",
    },
    { cor: "warning", total: manifestacoesInfo.pendentes, titulo: "Pendentes" },
    {
      cor: "info",
      total: manifestacoesInfo.emAndamento,
      titulo: "Em andamento",
    },
    { cor: "success", total: manifestacoesInfo.concluido, titulo: "Concluído" },
  ];

  const visãoGeral = [
    {
      nome: "Reclamações",
      Total: manifestacoesInfo.reclamacoes,
      fill: "var(--color-reclamacao)",
    },
    {
      nome: "Elogios",
      Total: manifestacoesInfo.elogios,
      fill: "var(--color-elogio)",
    },
    {
      nome: "Denúncias",
      Total: manifestacoesInfo.denuncias,
      fill: "var(--color-denuncia)",
    },
    {
      nome: "Sugestões",
      Total: manifestacoesInfo.sugestoes,
      fill: "var(--color-sugestao)",
    },
  ];

  const totalManifestacoes = [
    { Total: manifestacoesInfo7dias[0] },
    { Total: manifestacoesInfo7dias[1] },
    { Total: manifestacoesInfo7dias[2] },
    { Total: manifestacoesInfo7dias[3] },
    { Total: manifestacoesInfo7dias[4] },
    { Total: manifestacoesInfo7dias[5] },
    { Total: manifestacoesInfo7dias[6] },
  ];

  const dadosPorPerfil = [
    {
      nome: "Servidores",
      valor: manifestacoesPorTipoUsuario.servidores,
      cor: "var(--color-secondary)",
    },
    {
      nome: "Alunos",
      valor: manifestacoesPorTipoUsuario.alunos,
      cor: "var(--color-success)",
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <div className="p-6 max-w-7xl m-auto">
      <CardInfo conteudo_cards={data_cards} className="mt-4 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Manifestações</CardTitle>
            <CardDescription>Número total nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="w-full h-[auto] max-h-[300px]"
            >
              <LineChart
                accessibilityLayer
                data={totalManifestacoes}
                margin={{
                  top: 20,
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey=" "
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="Total"
                  type="natural"
                  stroke="var(--color-secondary)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-secondary)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col col-span-3 md:col-span-2">
          <CardHeader className="items-center pb-0">
            <CardTitle>Visão Geral das Manifestações</CardTitle>
            <CardDescription>
              Distribuição dos dados totais por tipo
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={visãoGeral}
                  dataKey="Total"
                  nameKey="nome"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      const total = visãoGeral.reduce(
                        (acc, curr) => acc + curr.Total,
                        0
                      );
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {total.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                  {visãoGeral.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {visãoGeral.map((item) => (
                <div key={item.nome} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm">{item.nome}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col col-span-3 md:col-span-1">
          <CardHeader className="items-center pb-0">
            <CardTitle>Distribuição de Manifestações</CardTitle>
            <CardDescription>Por perfil do usuário</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={dadosPorPerfil}
                  dataKey="valor"
                  nameKey="nome"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      const total = dadosPorPerfil.reduce(
                        (acc, curr) => acc + curr.valor,
                        0
                      );
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                  {dadosPorPerfil.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {dadosPorPerfil.map((item) => (
                <div key={item.nome} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.cor }}
                  />
                  <span className="text-sm">{item.nome}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
