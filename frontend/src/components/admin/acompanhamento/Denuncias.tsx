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

const data_cards = [
  { cor: "danger", total: 32, titulo: "Denúncias" },
  { cor: "warning", total: 15, titulo: "Pendentes" },
  { cor: "info", total: 3, titulo: "Em andamento" },
  { cor: "success", total: 12, titulo: "Concluído" },
];

const visãoGeral = [
  { tipo: "Assédio Moral", Total: 196, fill: "var(--color-success)" },
  { tipo: "Assédio Sexual", Total: 30, fill: "var(--color-secondary)" },
  { tipo: "Discriminação", Total: 160, fill: "var(--color-success)" },
  { tipo: "Violência", Total: 73, fill: "var(--color-secondary)" },
  { tipo: "Ameaça / Intimidação", Total: 45, fill: "var(--color-success)" },
  { tipo: "Bullying", Total: 50, fill: "var(--color-secondary)" },
  {
    tipo: "Negligência / Abuso de Autoridade",
    Total: 25,
    fill: "var(--color-success)",
  },
  {
    tipo: "Corrupção, Fraude, Irregularidades",
    Total: 40,
    fill: "var(--color-secondary)",
  },
  { tipo: "Abuso de Poder", Total: 35, fill: "var(--color-success)" },
  {
    tipo: "Desvios de Conduta / Ética",
    Total: 20,
    fill: "var(--color-secondary)",
  },
  { tipo: "Infraestrutura", Total: 15, fill: "var(--color-success)" },
  { tipo: "Conduta Inadequada", Total: 10, fill: "var(--color-secondary)" },
  { tipo: "Falta de Higiene", Total: 5, fill: "var(--color-success)" },
  { tipo: "Descarte Irregular", Total: 8, fill: "var(--color-secondary)" },
  { tipo: "Outros", Total: 3, fill: "var(--color-success)" },
];

const dadosPrioridade = [
  { nome: "Urgente", valor: 8, cor: "var(--color-danger-dark)" },
  { nome: "Alta", valor: 12, cor: "var(--color-danger)" },
  { nome: "Média", valor: 25, cor: "var(--color-warning)" },
  { nome: "Baixa", valor: 15, cor: "var(--color-success)" },
];

const dadosPorPerfil = [
  { nome: "Docentes", valor: 48, cor: "var(--color-info)" },
  { nome: "Discentes", valor: 32, cor: "var(--color-success)" },
  { nome: "Servidores", valor: 25, cor: "var(--color-primary)" },
  { nome: "Direção", valor: 18, cor: "var(--color-secondary)" },
  { nome: "Outros", valor: 12, cor: "var(--color-warning)" },
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

const chartConfig = {} satisfies ChartConfig;

export default function Component() {
  return (
    <div className="p-6">
      <CardInfo conteudo_cards={data_cards} className="mt-4 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col col-span-3">
          <CardHeader className="items-center pb-0">
            <CardTitle>Denúncias por categoria</CardTitle>
            <CardDescription>
              Com base em dados dos últimos 30 dias
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
                  barSize={40}
                  radius={[6, 6, 6, 6]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Denúncias</CardTitle>
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
        <Card className="flex flex-col col-span-3 md:col-span-1">
          <CardHeader className="items-center pb-0">
            <CardTitle>Prioridade das Denúncias</CardTitle>
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
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
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
            {/* Legenda */}
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

        <Card className="flex flex-col col-span-3 md:col-span-2">
          <CardHeader className="items-center pb-0">
            <CardTitle>Distribuição de Denúncias</CardTitle>
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
