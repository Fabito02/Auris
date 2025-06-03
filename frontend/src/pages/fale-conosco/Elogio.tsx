import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/buttons/Button";
import { Checkbox } from "@/components/ui/checkbox";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";
import { enviarManifestacao } from "@/api/api_routes";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const Elogio = () => {
  const [anonimo, setAnonimo] = useState(false);
  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const quillContainerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const [local, setLocal] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Enviar Reclamação";
    checkAuth(navigate, ["admin", "moderador", "user"]);
  }, []);

  const closeSuccess = () => {
    setOpenSuccess(false);
    navigate("/home");
  };

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (quillContainerRef.current) {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const descricaoHTML = quillRef.current?.root.innerHTML || "";

    if (!tipo) {
      toast.error("Selecione um tipo para a sua manifestação.", {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            className="text-[var(--color-warning)]"
            height={20}
          />
        ),
      });
      return;
    }

    if (descricaoHTML.length < 5) {
      toast.error("A descricao deve ter pelo menos 5 caracteres.", {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            className="text-[var(--color-warning)]"
            height={20}
          />
        ),
      });
      return;
    }

    if (tipo === "Estrutura e Espaços" && !local) {
      toast.error("Selecione a área do campus.", {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            className="text-[var(--color-warning)]"
            height={20}
          />
        ),
      });
      return;
    }

    if (titulo.length < 5) {
      toast.error("O título deve ter pelo menos 5 caracteres.", {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            className="text-[var(--color-warning)]"
            height={20}
          />
        ),
      });
      return;
    }

    const data = {
      Anonimo: anonimo,
      Tipo_manifestacao: "elogio" as "elogio",
      Tipo: tipo,
      Titulo: titulo,
      Descricao: descricaoHTML,
      Local: local,
    };
    try {
      await enviarManifestacao(data);
      setAnonimo(false);
      setTipo("");
      setTitulo("");
      setLocal("");
      quillRef.current?.setContents([]);
      setOpenSuccess(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Erro ao enviar o elogio. Tente novamente mais tarde.",
        {
          icon: (
            <Icon
              icon="mdi:alert-circle"
              className="text-[var(--color-warning)]"
              height={20}
            />
          ),
        }
      );
    }
  };

  return (
    <BlankLayout showHeader showNavbar showFooter={false}>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center p-4 mb-4 mt-6"
      >
        <div
          className="w-5xl overflow-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informações pessoais</CardTitle>
                <CardDescription>
                  Você deseja enviar suas informações pessoais e de contato?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Checkbox
                  id="enviarContato"
                  checked={anonimo}
                  className="data-[state=checked]:bg-[#16aa51] data-[state=checked]:border-[#16aa51]"
                  onCheckedChange={(c) => setAnonimo(!!c)}
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  Desejo fazer uma manifestação anônima.
                </span>
              </CardContent>
              <CardHeader>
                <CardTitle>Tipo de Elogio</CardTitle>
                <CardDescription>
                  Selecione o tipo do seu elogio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select name="tipo" onValueChange={(value) => setTipo(value)}>
                  <SelectTrigger className="custom-select">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="custom-select-content">
                    <SelectItem value="Estrutura e Espaços">
                      Estrutura e Espaços
                    </SelectItem>
                    <SelectItem value="Atendimento">Atendimento</SelectItem>
                    <SelectItem value="Serviço">Serviço</SelectItem>
                    <SelectItem value="Segurança">Segurança</SelectItem>
                    <SelectItem value="Higiene">Higiene</SelectItem>
                    <SelectItem value="Alimentação">Alimentação</SelectItem>
                    <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="Docentes">Docentes</SelectItem>
                    <SelectItem value="Servidores">Servidores</SelectItem>
                    <SelectItem value="Acessibilidade">
                      Acessibilidade
                    </SelectItem>
                    <SelectItem value="Eventos">Eventos</SelectItem>
                    <SelectItem value="Burocracia">Burocracia</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>

                {tipo === "Estrutura e Espaços" && (
                  <div>
                    <h3 className="mb-2 mt-4">Área do Campus</h3>
                    <Select
                      name="local"
                      onValueChange={(value) => setLocal(value)}
                    >
                      <SelectTrigger className="custom-select">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="custom-select-content">
                        <SelectItem value="Portaria">Portaria</SelectItem>
                        <SelectItem value="Biblioteca">Biblioteca</SelectItem>
                        <SelectItem value="Setor Administrativo">
                          Setor Administrativo
                        </SelectItem>
                        <SelectItem value="Prédio Pedagógico I">
                          Prédio Pedagógico I
                        </SelectItem>
                        <SelectItem value="Auditório">Auditório</SelectItem>
                        <SelectItem value="Semirresidencial">
                          Semirresidencial
                        </SelectItem>
                        <SelectItem value="Núcleo de Assuntos Estudantis">
                          Núcleo de Assuntos Estudantis
                        </SelectItem>
                        <SelectItem value="Lanchonete">Lanchonete</SelectItem>
                        <SelectItem value="Refeitório">Refeitório</SelectItem>
                        <SelectItem value="Núcleo de Estudos em Agroecologia">
                          Núcleo de Estudos em Agroecologia
                        </SelectItem>
                        <SelectItem value="Prédio Pedagógico II">
                          Prédio Pedagógico II
                        </SelectItem>
                        <SelectItem value="Moradia Estudantil - Residencial">
                          Moradia Estudantil - Residencial
                        </SelectItem>
                        <SelectItem value="Laboratório de Solos">
                          Laboratório de Solos
                        </SelectItem>
                        <SelectItem value="Ginásio">Ginásio</SelectItem>
                        <SelectItem value="Suinocultura">
                          Suinocultura
                        </SelectItem>
                        <SelectItem value="Casa de Ração">
                          Casa de Ração
                        </SelectItem>
                        <SelectItem value="Laboratório de Campo">
                          Laboratório de Campo
                        </SelectItem>
                        <SelectItem value="Bovinocultura">
                          Bovinocultura
                        </SelectItem>
                        <SelectItem value="Avicultura">Avicultura</SelectItem>
                        <SelectItem value="Casa de Máquinas">
                          Casa de Máquinas
                        </SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
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
                  <h3 className="mb-2">Descrição</h3>
                  <div
                    ref={quillContainerRef}
                    className="min-h-[200px] bg-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  color="primary"
                  texto="enviar elogio"
                  type="submit"
                  icon="material-symbols:send-rounded"
                  iconPosition="right"
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>

      <Dialog open={openSuccess} onOpenChange={closeSuccess}>
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
              Manifestação enviada com sucesso!
            </DialogTitle>
            <DialogDescription className="text-center">
              Clique no botão abaixo para voltar à home.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              onClick={closeSuccess}
              full_rounded
              color="success"
              className="w-full sm:max-w-[200px] px-5"
              texto="home"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BlankLayout>
  );
};

export default Elogio;
