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

const Denuncia = () => {
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
            ["link", "video"],
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
      Tipo_manifestacao: "denuncia" as "denuncia",
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
          "Erro ao enviar o denuncia. Tente novamente mais tarde.",
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
                <p className="text-sm text-red-500 my-4">
                  *OBS: Estas informações serão usadas para entrar em contato
                  com você. Denúncias identificadas permitem um acompanhamento
                  mais eficaz.
                </p>
              </CardContent>
              <CardHeader>
                <CardTitle>Tipo de denúncia</CardTitle>
                <CardDescription>
                  Selecione o tipo da sua denúncia.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select
                  name="tipoDenuncia"
                  onValueChange={(value) => setTipo(value)}
                >
                  <SelectTrigger className="custom-select">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="custom-select-content">
                    <SelectItem value="Assédio Moral">Assédio Moral</SelectItem>
                    <SelectItem value="Assédio Sexual">
                      Assédio Sexual
                    </SelectItem>
                    <SelectItem value="Discriminação">
                      Discriminação (Racial, de Gênero, etc.)
                    </SelectItem>
                    <SelectItem value="Violência ou Agressão Física">
                      Violência ou Agressão Física
                    </SelectItem>
                    <SelectItem value="Ameaça ou Intimidação">
                      Ameaça ou Intimidação
                    </SelectItem>
                    <SelectItem value="Bullying ou Cyberbullying">
                      Bullying ou Cyberbullying
                    </SelectItem>
                    <SelectItem value="Negligência ou Abuso de Autoridade">
                      Negligência ou Abuso de Autoridade
                    </SelectItem>
                    <SelectItem value="Corrupção, Fraude ou Irregularidades">
                      Corrupção, Fraude ou Irregularidades
                    </SelectItem>
                    <SelectItem value="Abuso de Poder">
                      Abuso de Poder
                    </SelectItem>
                    <SelectItem value="Desvios de Conduta ou Ética">
                      Desvios de Conduta ou Ética
                    </SelectItem>
                    <SelectItem value="Infraestrutura Perigosa ou Insegura">
                      Infraestrutura Perigosa ou Insegura
                    </SelectItem>
                    <SelectItem value="Conduta Inadequada de Docentes ou Servidores">
                      Conduta Inadequada de Docentes ou Servidores
                    </SelectItem>
                    <SelectItem value="Falta de Higiene em Ambientes Críticos">
                      Falta de Higiene em Ambientes Críticos
                    </SelectItem>
                    <SelectItem value="Descarte Irregular de Resíduos">
                      Descarte Irregular de Resíduos
                    </SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
              <CardHeader>
                <CardTitle>Descrição da denúncia</CardTitle>
                <CardDescription>
                  Descreva o motivo e contexto da denúncia.
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
                  texto="enviar denúncia"
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

export default Denuncia;
