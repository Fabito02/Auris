import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/buttons/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const tabVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Elogio = () => {
  const [tab, setTab] = useState<
    "contato" | "tipo" | "descricao" | "finalizar"
  >("contato");

  const [salvarContato, setSalvarContato] = useState(false);
  const [tipoElogio, setTipoElogio] = useState("");
  const [titulo, setTitulo] = useState("");
  const quillContainerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const [progresso, setProgresso] = useState(1);

  useEffect(() => {
    document.title = "Enviar Elogio";
  }, []);

  const handleSetProgresso = (
    value: "contato" | "tipo" | "descricao" | "finalizar"
  ) => {
    if (value === "contato") {
      setProgresso(25);
    } else if (value === "tipo") {
      setProgresso(50);
    } else if (value === "descricao") {
      setProgresso(75);
    } else {
      setProgresso(100);
    }
  };

  useEffect(() => {
    if (tab === "descricao" && quillContainerRef.current) {
      quillContainerRef.current.innerHTML = "";
      quillRef.current = new Quill(quillContainerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });
    }

    handleSetProgresso(tab);
  }, [tab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const descricaoHTML = quillRef.current?.root.innerHTML || "";
    console.log({
      salvarContato,
      tipoElogio,
      titulo,
      descricao: descricaoHTML,
    });
    // lógica de envio...
  };

  return (
    <BlankLayout showHeader showNavbar showFooter={false}>
      <form onSubmit={handleSubmit} className="flex justify-center p-6 my-4">
        <div className="w-[850px]">
          
          <Progress
            value={progresso}
            className="w-[100%] mb-6 h-3 [&>div]:bg-[var(--color-primary)]"
          />

          <Tabs
            value={tab}
            onValueChange={(value) =>
              setTab(value as "contato" | "tipo" | "descricao" | "finalizar")
            }
          >
            <TabsList className="flex justify-between w-full overflow-auto">
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="tipo">Tipo de Elogio</TabsTrigger>
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="finalizar">Finalizar</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {tab === "contato" && (
                <TabsContent value="contato" forceMount>
                  <motion.div
                    key="contato"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={tabVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Contato</CardTitle>
                        <CardDescription>
                          Você deseja enviar suas informações de contato?
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Checkbox
                          id="enviarContato"
                          checked={salvarContato}
                          className="data-[state=checked]:bg-[#16aa51] data-[state=checked]:border-[#16aa51]"
                          onCheckedChange={(c) => setSalvarContato(!!c)}
                        />
                        <span className="ml-2 text-sm text-muted-foreground">
                          Sim, desejo enviar minhas informações de contato.
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              )}

              {tab === "tipo" && (
                <TabsContent value="tipo" forceMount>
                  <motion.div
                    key="tipo"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={tabVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Tipo de Elogio</CardTitle>
                        <CardDescription>
                          Selecione o tipo do seu elogio.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Select
                          name="tipoElogio"
                          onValueChange={(value) => setTipoElogio(value)}
                        >
                          <SelectTrigger className="custom-select">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent className="custom-select-content">
                            <SelectItem value="infraestrutura">
                              Estrutura e Espaços
                            </SelectItem>
                            <SelectItem value="atendimento">
                              Atendimento
                            </SelectItem>
                            <SelectItem value="servico">Serviço</SelectItem>
                            <SelectItem value="seguranca">Segurança</SelectItem>
                            <SelectItem value="higiene">Higiene</SelectItem>
                            <SelectItem value="alimentacao">
                              Alimentação
                            </SelectItem>
                            <SelectItem value="equipamentos">
                              Equipamentos
                            </SelectItem>
                            <SelectItem value="docentes">Docentes</SelectItem>
                            <SelectItem value="servidores">
                              Servidores
                            </SelectItem>
                            <SelectItem value="acessibilidade">
                              Acessibilidade
                            </SelectItem>
                            <SelectItem value="eventos">Eventos</SelectItem>
                            <SelectItem value="burocracia">
                              Burocracia
                            </SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>

                        {tipoElogio === "infraestrutura" && (
                          <div>
                            <h3 className="mb-2 mt-4">Área do Campus</h3>
                            <Select name="areaCampus">
                              <SelectTrigger className="custom-select">
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                              <SelectContent className="custom-select-content">
                                <SelectItem value="portaria">
                                  Portaria
                                </SelectItem>
                                <SelectItem value="biblioteca">
                                  Biblioteca
                                </SelectItem>
                                <SelectItem value="setor-administrativo">
                                  Setor Administrativo
                                </SelectItem>
                                <SelectItem value="predio-pedagogico-1">
                                  Prédio Pedagógico I
                                </SelectItem>
                                <SelectItem value="auditório">
                                  Auditório
                                </SelectItem>
                                <SelectItem value="semirresidencial">
                                  Semirresidencial
                                </SelectItem>
                                <SelectItem value="nucleo-assuntos-estudantis">
                                  Núcleo de Assuntos Estudantis
                                </SelectItem>
                                <SelectItem value="lanchonete">
                                  Lanchonete
                                </SelectItem>
                                <SelectItem value="refeitorio">
                                  Refeitório
                                </SelectItem>
                                <SelectItem value="nucleo-estudos-agroecologia">
                                  Núcleo de Estudos em Agroecologia
                                </SelectItem>
                                <SelectItem value="predio-pedagogico-2">
                                  Prédio Pedagógico II
                                </SelectItem>
                                <SelectItem value="moradia-estudantil">
                                  Moradia Estudantil - Residencial
                                </SelectItem>
                                <SelectItem value="laboratorio-solos">
                                  Laboratório de Solos
                                </SelectItem>
                                <SelectItem value="ginasio">Ginásio</SelectItem>
                                <SelectItem value="suinocultura">
                                  Suinocultura
                                </SelectItem>
                                <SelectItem value="casa-racao">
                                  Casa de Ração
                                </SelectItem>
                                <SelectItem value="laboratorio-campo">
                                  Laboratório de Campo
                                </SelectItem>
                                <SelectItem value="bovinocultura">
                                  Bovinocultura
                                </SelectItem>
                                <SelectItem value="avicultura">
                                  Avicultura
                                </SelectItem>
                                <SelectItem value="casa-maquinas">
                                  Casa de Máquinas
                                </SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              )}

              {tab === "descricao" && (
                <TabsContent value="descricao" forceMount>
                  <motion.div
                    key="descricao"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={tabVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Descrição do elogio</CardTitle>
                        <CardDescription>
                          Descreva o motivo e contexto do elogio.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="mb-2">Título</h3>
                          <Input
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Digite um título"
                            required
                          />
                        </div>
                        <div>
                          <h3 className="mb-2">Detalhes</h3>
                          <div
                            ref={quillContainerRef}
                            className="min-h-[200px] bg-white"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              )}
              {tab === "finalizar" && (
                <TabsContent value="finalizar">
                  <motion.div
                    key="contato"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={tabVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="space-y-2">
                        <Icon
                          icon={"line-md:check-list-3-filled"}
                          className="text-center w-full text-8xl text-[var(--color-success)] my-4"
                        ></Icon>
                      </CardContent>
                      <CardFooter className="border-t">
                        <p className="text-center text-muted-foreground w-full">
                          Tudo Pronto! Clique em "Enviar" para enviar seu
                          elogio.
                        </p>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>

            <div className="flex justify-between w-full gap-4 mt-4">
              <Button
                texto="Voltar"
                color="secondary"
                type="button"
                onClick={() => {
                  const order = ["contato", "tipo", "descricao", "finalizar"];
                  const idx = order.indexOf(tab);
                  if (idx > 0) setTab(order[idx - 1] as any);
                }}
              />
              {tab === "finalizar" ? (
                <Button texto="Enviar" type="submit" />
              ) : (
                <Button
                  texto="Avançar"
                  type="button"
                  onClick={() => {
                    const order = ["contato", "tipo", "descricao", "finalizar"];
                    const idx = order.indexOf(tab);
                    if (idx < order.length - 1) setTab(order[idx + 1] as any);
                  }}
                />
              )}
            </div>
          </Tabs>
        </div>
      </form>
    </BlankLayout>
  );
};

export default Elogio;
