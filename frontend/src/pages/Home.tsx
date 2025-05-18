import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import Slider from "../components/Slider";
import CardInfo from "../components/card-info/CardInfo";
import Button from "../components/buttons/Button";
import AnimarAoVer from "@/components/AnimarAoVer";
import { motion } from "framer-motion";
import "./Home.css";
import { checkAuth } from "../api/auth";
import { getPrecisaTrocarSenha, getManifestacoesDoUsuario, getUsuarioAtual } from "../api/api_routes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardManifestacao from "@/components/CardManifestacao";
import { User } from "@/types/api";

const slides = [
  "/home/slides/1.png",
  "/home/slides/2.png",
  "/home/slides/3.png",
  "/home/slides/4.png",
  "/home/slides/5.png",
  "/home/slides/6.png",
  "/home/slides/7.png",
  "/home/slides/8.png",
  "/home/slides/9.png",
  "/home/slides/10.png",
];

const data_cards = [
  { cor: "danger", total: 32, titulo: "Manifestações" },
  { cor: "warning", total: 15, titulo: "Pendentes" },
  { cor: "info", total: 3, titulo: "Em andamento" },
  { cor: "success", total: 12, titulo: "Concluído" },
];

const Home = () => {
  const navigate = useNavigate();

  const [precisaTrocarSenha, setPrecisaTrocarSenha] = useState(false);
  const [manifestacoes, setManifestacoes] = useState<any[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<User>();


  useEffect(() => {
    const fetchManifestacoes = async () => {
      try {
        const response = await getManifestacoesDoUsuario();
        if (response.success) {
          setManifestacoes(response.data.reverse().slice(0, 4));
        } else {
          console.error("Erro ao buscar manifestações:", response.error);
        }
      } catch (error) {
        console.error("Erro ao buscar manifestações:", error);
      }
    }

    fetchManifestacoes();
  }, [setManifestacoes]);

  useEffect(() => {
    const fetchUsuarioAtual = async () => {
      try {
        const response = await getUsuarioAtual();
        if (response.success) {
          setUsuarioAtual(response.user);
        } else {
          console.error("Erro ao buscar usuário:", response.error);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    fetchUsuarioAtual();
  }, [setManifestacoes]);

  useEffect(() => {
    document.title = "Home";
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin", "moderador", "user"]);
    }

    (async () => {
      try {
        const response = await getPrecisaTrocarSenha();
        if (response?.success === true) {
          setPrecisaTrocarSenha(true);
        }
      } catch (error) {
        return;
      }
    })();
  }, []);

  const closeModal = () => {
    setPrecisaTrocarSenha(false);
    navigate("/alterar-senha");
  };

  return (
    <div className="ouvidoria-home">
      <section className="hero-banner bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 frase-impactante">
            {(() => {
              const horaAtual = new Date().getHours();
              let mensagem = "Olá";
              if (horaAtual < 12) {
                mensagem = "Bom dia";
              } else if (horaAtual < 18) {
                mensagem = "Boa tarde";
              } else {
                mensagem = "Boa noite";
              }
              return `${mensagem} ${usuarioAtual?.Nome.split(" ").slice(0, 1)}!`;
            })()}
          </h1>
          <p className="mb-6 text-gray-600">
            Compartilhe aqui suas críticas, elogios, denúncias, sugestões ou
            necessidades.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate("/fale-conosco")}
              texto="Enviar Manifestação"
              icon="material-symbols:add-box"
            />
            <Button
              onClick={() => navigate("/minhas-manifestacoes")}
              color="secondary"
              texto="minhas manifestações"
              icon="material-symbols:feedback-rounded"
            />
          </div>
        </div>
      </section>

      <AnimarAoVer>
        <CardInfo conteudo_cards={data_cards} className="mt-12" />
      </AnimarAoVer>

      <Slider imagens={slides} />

      <div className="px-4 mt-12 max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Manifestações recentes</CardTitle>
            <CardDescription>Visualize suas últimas atividades</CardDescription>
          </CardHeader>
          <CardContent className="px-4 space-y-4">
            <CardManifestacao manifestacoes={manifestacoes} />
            {manifestacoes.length === 0 && (
              <div className="text-muted-foreground w-full text-center ">
                Nenhuma manifestação encontrada.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AnimarAoVer>
        <section className="action-cards py-6">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
              className="card h-full shadow-md radius-card flex flex-col items-center text-center p-6 bg-white"
            >
              <Icon
                icon="material-symbols:add-box"
                className="iconeCard mb-4"
                width={48}
                height={48}
              />
              <h3 className="text-xl font-semibold mb-2">Nova Manifestação</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Registre sua reclamação, sugestão ou elogio.
              </p>
              <Button
                onClick={() => navigate("/fale-conosco")}
                texto="Acessar"
                outline
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
              className="card h-full shadow-md radius-card flex flex-col items-center text-center p-6 bg-white"
            >
              <Icon
                icon="material-symbols:help-center"
                className="iconeCard mb-4"
                width={48}
                height={48}
              />
              <h3 className="text-xl font-semibold mb-2">Dúvidas Frequentes</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Encontre respostas rápidas no FAQ.
              </p>
              <Button
                onClick={() => navigate("/informacoes")}
                texto="Ver FAQ"
                outline
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
              className="card h-full shadow-md radius-card flex flex-col items-center text-center p-6 bg-white"
            >
              <Icon
                icon="material-symbols:list-alt"
                className="iconeCard mb-4"
                width={48}
                height={48}
              />
              <h3 className="text-xl font-semibold mb-2">Regulamento</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Consulte o regulamento do site.
              </p>
              <Button
                onClick={() => navigate("/regulamento")}
                texto="Consultar"
                outline
              />
            </motion.div>
          </div>
        </section>
      </AnimarAoVer>

      <section className="info-section bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <Icon
              icon="material-symbols:calendar-clock"
              width={40}
              height={40}
              className="mb-2 iconeInfo"
            />
            <h3 className="font-semibold mb-1">Prazos de Resposta</h3>
            <p className="text-gray-600 text-xs">Atendemos em até 3 dias úteis.</p>
          </div>
          <div>
            <Icon
              icon="material-symbols:lock"
              width={40}
              height={40}
              className="mb-2 iconeInfo"
            />
            <h3 className="font-semibold mb-1">Sigilo Garantido</h3>
            <p className="text-gray-600 text-xs">
              Seus dados são protegidos pela LGPD.
            </p>
          </div>
          <div>
            <Icon
              icon="material-symbols:alternate-email"
              width={40}
              height={40}
              className="mb-2 iconeInfo"
            />
            <h3 className="font-semibold mb-1">Contato Alternativo</h3>
            <p className="text-gray-600 text-xs">ouvidoria.almenara@ifnmg.edu.br</p>
          </div>
        </div>
      </section>

      <Dialog open={precisaTrocarSenha} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[400px] rounded-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[var(--color-primary)] text-3xl mb-4">
              Senha insegura!
            </DialogTitle>
            <DialogDescription className="text-center">
              Altere a sua senha para garantir a segurança da conta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button
              onClick={closeModal}
              full_rounded
              color="success"
              className="w-full sm:max-w-[200px] px-5"
              texto="alterar"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
