import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/buttons/Button";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { Input } from "@/components/ui/input";
import { checkAuth } from "@/api/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { toast } from "sonner";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { registrarUsuario } from "@/api/api_routes";

const tabVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Gerenciar = () => {
  const [file, setFile] = useState<File | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [siape, setSiape] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Acompanhamento";
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin"]);
    }
  }, []);

  const handleSubmitArquivo = async (): Promise<void> => {
    if (!file) {
      toast.error("Selecione um arquivo", {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            height={20}
            className="text-[var(--color-danger)]"
          />
        ),
      });
      return;
    }

    let registrosComSucesso = 0;

    try {
      const csvString = await file.text();

      const parser = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
      });

      const promises = parser.data.map(async (record: any) => {
        const user = {
          Nome: record.Nome,
          Email: record.Email,
          SIAPE: record.SIAPE,
          Senha: record.SIAPE,
        };

        try {
          await registrarUsuario(user);
          registrosComSucesso++;
        } catch (error: any) {
          toast.error(
            `Erro ao registrar usuário ${user.Email}: ${error.message}`,
            {
              icon: (
                <Icon
                  icon="mdi:alert-circle"
                  height={20}
                  className="text-[var(--color-danger)]"
                />
              ),
            }
          );
        }
      });

      await Promise.all(promises);
      toast.success(`${registrosComSucesso} usuários cadastrados.`, {
        icon: (
          <Icon
            icon="mdi:check-circle"
            height={20}
            className="text-[var(--color-success)]"
          />
        ),
      });

      setFile(null);
    } catch (e) {
      console.error("Erro ao ler o arquivo:", e);
      toast.error("Não foi possível processar o arquivo", {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            height={20}
            className="text-[var(--color-danger)]"
          />
        ),
      });
    }
  };

  const handleSubmitManual = async (): Promise<void> => {
    const user = {
      Nome: nome,
      Email: email,
      SIAPE: siape,
      Senha: siape,
    };

    if (!user.Nome || !user.Email || !user.SIAPE) {
      toast.error("Preencha todos os campos!", {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            height={20}
            className="text-[var(--color-warning)]"
          />
        ),
      });
      return;
    }

    try {
      await registrarUsuario(user);

      toast.success("Usuário cadastrado com sucesso.", {
        icon: (
          <Icon
            icon="mdi:check-circle"
            height={20}
            className="text-[var(--color-success)]"
          />
        ),
      });

      setNome("");
      setEmail("");
      setSiape("");
    } catch (err: any) {
      const backendMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erro desconhecido ao cadastrar.";

      toast.error(`Falha ao registrar: ${backendMsg}`, {
        icon: (
          <Icon
            icon="mdi:alert-circle"
            height={20}
            className="text-[var(--color-danger)]"
          />
        ),
      });
    }
  };

  return (
    <BlankLayout
      showFooter={false}
      showHeader={true}
      showNavbar={true}
      removeBodyPadding={false}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold my-14 text-[var(--color-primary)]">
          Adicionar Usuário
        </h1>
      </div>

      <div className="w-full max-w-6xl mx-auto sm:px-6 lg:px-8">
        <Tabs defaultValue="manual" className="w-full px-4">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="arquivo">Arquivo CSV</TabsTrigger>
          </TabsList>

          <TabsContent value="arquivo">
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Selecionar arquivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="file"
                    name="arquivo"
                    id="arquivo"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.item(0) ?? null)}
                  />
                  <Button
                    icon="mdi:users"
                    texto="Adicionar"
                    className="mt-4"
                    onClick={handleSubmitArquivo}
                  />
                </CardContent>
                <CardFooter className="border-t">
                  <p className="text-sm text-red-700">
                    *OBS: O número de SIAPE/matrícula será utilizado como senha
                    para acesso ao sistema.
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="manual">
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tabVariants}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Informações do usuário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <h3 className="mb-1">Nome</h3>
                      <Input
                        name="nome"
                        value={nome}
                        placeholder="Nome completo"
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <h3 className="mb-1 mt-4">Email</h3>
                      <Input
                        name="email"
                        value={email}
                        placeholder="Email do usuário"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <h3 className="mb-1 mt-4">SIAPE/Matrícula</h3>
                      <Input
                        name="matricula"
                        value={siape}
                        placeholder="xxxxxxx"
                        onChange={(e) => setSiape(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    icon="mdi:user"
                    texto="Adicionar"
                    className="mt-4"
                    onClick={handleSubmitManual}
                  />
                </CardContent>
                <CardFooter className="border-t">
                  <p className="text-sm text-red-700">
                    *OBS: O número de SIAPE/matrícula será utilizado como senha
                    para acesso ao sistema.
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </BlankLayout>
  );
};

export default Gerenciar;
