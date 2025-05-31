import {
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Label,
  Bar,
  BarChart,
  YAxis,
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
    tipos: Array.from(new Set(manifestacoes.map((m) => m.Tipo))).filter(
      (t) => t !== ""
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
    urgente: manifestacoes.filter(
      (manifestacao) => manifestacao.Prioridade === "urgente"
    ).length,
    alta: manifestacoes.filter(
      (manifestacao) => manifestacao.Prioridade === "alta"
    ).length,
    media: manifestacoes.filter(
      (manifestacao) => manifestacao.Prioridade === "media"
    ).length,
    baixa: manifestacoes.filter(
      (manifestacao) => manifestacao.Prioridade === "baixa"
    ).length,
  };

  const categoriaColors = ["var(--color-success)", "var(--color-secondary)"];

  const tiposManifestacao = Array.from(
    new Set(manifestacoes.map((m) => m.Tipo).filter((t) => t && t !== ""))
  );

  const visãoGeral = tiposManifestacao.map((tipo, idx) => ({
    tipo,
    Total: manifestacoes.filter((m) => m.Tipo === tipo).length,
    fill: categoriaColors[idx % categoriaColors.length],
  }));

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
      titulo: "Reclamações",
    },
    { cor: "warning", total: manifestacoesInfo.pendentes, titulo: "Pendentes" },
    {
      cor: "info",
      total: manifestacoesInfo.emAndamento,
      titulo: "Em andamento",
    },
    { cor: "success", total: manifestacoesInfo.concluido, titulo: "Concluído" },
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

  const dadosPrioridade = [
    {
      nome: "Urgente",
      valor: manifestacoesInfo.urgente,
      cor: "var(--color-danger-dark)",
    },
    { nome: "Alta", valor: manifestacoesInfo.alta, cor: "var(--color-danger)" },
    {
      nome: "Média",
      valor: manifestacoesInfo.media,
      cor: "var(--color-warning)",
    },
    {
      nome: "Baixa",
      valor: manifestacoesInfo.baixa,
      cor: "var(--color-success)",
    },
  ];

  const chartConfig = {} satisfies ChartConfig;

  return (
    <div className="p-6 max-w-7xl m-auto">
      <CardInfo conteudo_cards={data_cards} className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col col-span-3">
          <CardHeader className="items-center pb-0">
            <CardTitle>Reclamações por categoria</CardTitle>
            <CardDescription>
              Distribuição dos dados totais por categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto w-full max-h-[500px]"
            >
              <BarChart
                layout="vertical"
                data={visãoGeral}
                margin={{
                  right: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} hide />
                <YAxis
                  type="category"
                  dataKey="tipo"
                  width={120}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="Total"
                  fill="var(--color-secondary)"
                  radius={[6, 6, 6, 6]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Reclamações</CardTitle>
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
                  hide
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
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col col-span-3 md:col-span-2">
          <CardHeader className="items-center pb-0">
            <CardTitle>Prioridade das Reclamações</CardTitle>
            <CardDescription>
              Distribuição por nível de urgência
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
                  data={dadosPrioridade}
                  dataKey="valor"
                  nameKey="nome"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      const total = dadosPrioridade.reduce(
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
                  {dadosPrioridade.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {dadosPrioridade.map((item) => (
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

        <Card className="flex flex-col col-span-3 md:col-span-1">
          <CardHeader className="items-center pb-0">
            <CardTitle>Distribuição de Reclamações</CardTitle>
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
