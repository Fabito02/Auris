import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import Slider from "../components/Slider";
import CardInfo from "../components/card-info/CardInfo";
import Button from "../components/buttons/Button";
import AnimarAoVer from "@/components/AnimarAoVer";
import { motion } from "framer-motion";
import "./Home.css";
import { checkAuth } from "../api/auth";

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

  useEffect(() => {
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin", "moderador", "user"]);
    }
  }, []);

  return (
    <div className="ouvidoria-home">
      <section className="hero-banner bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 frase-impactante">
            Sua voz é importante!
          </h1>
          <p className="mb-6 text-gray-600">
            Compartilhe aqui suas críticas, elogios, denúncias, sugestões ou
            necessidades.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/fale-conosco">
              <Button
                texto="Enviar Manifestação"
                icon="material-symbols:add-box"
              />
            </Link>
            <Link to="/minhas-manifestacoes">
              <Button
                outline
                texto="minhas manifestações"
                icon="material-symbols:feedback-rounded"
              />
            </Link>
          </div>
        </div>
      </section>

      <AnimarAoVer>
        <CardInfo conteudo_cards={data_cards} className="mt-12" />
      </AnimarAoVer>

      <Slider imagens={slides} />

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
              <p className="text-gray-600 mb-4">
                Registre sua reclamação, sugestão ou elogio.
              </p>
              <Link to="/fale-conosco">
                <Button texto="Acessar" outline />
              </Link>
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
              <p className="text-gray-600 mb-4">
                Encontre respostas rápidas no FAQ.
              </p>
              <Link to="/informacoes">
                <Button texto="Ver FAQ" outline />
              </Link>
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
              <p className="text-gray-600 mb-4">
                Consulte o regulamento do site.
              </p>
              <Link to="/regulamento">
                <Button texto="Consultar" outline />
              </Link>
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
            <p className="text-gray-600">Atendemos em até 3 dias úteis.</p>
          </div>
          <div>
            <Icon
              icon="material-symbols:lock"
              width={40}
              height={40}
              className="mb-2 iconeInfo"
            />
            <h3 className="font-semibold mb-1">Sigilo Garantido</h3>
            <p className="text-gray-600">
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
            <p className="text-gray-600">ouvidoria.almenara@ifnmg.edu.br</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
