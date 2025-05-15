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

const data_cards = [
  { cor: "danger", total: 32, titulo: "Manifestações" },
  { cor: "warning", total: 15, titulo: "Pendentes" },
  { cor: "info", total: 3, titulo: "Em andamento" },
  { cor: "success", total: 12, titulo: "Concluído" },
];

const visãoGeral = [
  { nome: "Reclamações", Total: 196, fill: "var(--color-secondary)" },
  { nome: "Elogios", Total: 30, fill: "var(--color-info)" },
  { nome: "Denúncias", Total: 160, fill: "var(--color-danger)" },
  { nome: "Sugestões", Total: 73, fill: "var(--color-success)" },
];

const totalManifestacoes = [
  { dia: "Segunda", Total: 266 },
  { dia: "Terça", Total: 505 },
  { dia: "Quarta", Total: 357 },
  { dia: "Quinta", Total: 263 },
  { dia: "Sexta", Total: 339 },
  { dia: "Sábado", Total: 354 },
  { dia: "Domingo", Total: 400 },
];

const dadosPorPerfil = [
  { nome: "Docentes", valor: 48, cor: "var(--color-info)" },
  { nome: "Discentes", valor: 32, cor: "var(--color-success)" },
  { nome: "Servidores", valor: 25, cor: "var(--color-primary)" },
  { nome: "Direção", valor: 18, cor: "var(--color-secondary)" },
  { nome: "Outros", valor: 12, cor: "var(--color-warning)" },
];

const chartConfig = {} satisfies ChartConfig;

export default function Component() {
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

        <Card className="flex flex-col col-span-3 md:col-span-1">
          <CardHeader className="items-center pb-0">
            <CardTitle>Visão Geral das Manifestações</CardTitle>
            <CardDescription>
              Com base em dados dos últimos 30 dias
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
          </CardContent>
        </Card>

        <Card className="flex flex-col col-span-3 md:col-span-2">
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
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
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
