import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import "../admin.css";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { useEffect } from "react";
import Geral from "@/components/admin/acompanhamento/Geral";
import Reclamacoes from "@/components/admin/acompanhamento/Reclamacoes";
import Elogios from "@/components/admin/acompanhamento/Elogios";
import Denuncias from "@/components/admin/acompanhamento/Denuncias";
import Sugestoes from "@/components/admin/acompanhamento/Sugestoes";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";
import { getManifestacoes, getUsuarios } from "@/api/api_routes";
import { Manifestacao, User } from "@/types/api";

const Acompanhamento = () => {

  const [expandido, setExpandido] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState("0");
  const [manifestacoes, setManifestacoes] = useState<Manifestacao[]>([]);
  const [reclamacoes, setReclamacoes] = useState<Manifestacao[]>([]);
  const [elogios, setElogios] = useState<Manifestacao[]>([]);
  const [denuncias, setDenuncias] = useState<Manifestacao[]>([]);
  const [sugestoes, setSugestoes] = useState<Manifestacao[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const manifestacoesResponse = await getManifestacoes();
        const usuariosResponse = await getUsuarios();

        if (manifestacoesResponse.success) {
          setManifestacoes(manifestacoesResponse.data);
          setReclamacoes(
            manifestacoesResponse.data.filter(
              (manifestacao) => manifestacao.Tipo_manifestacao === "reclamacao"
            )
          );
          setElogios(
            manifestacoesResponse.data.filter(
              (manifestacao) => manifestacao.Tipo_manifestacao === "elogio"
            )
          );
          setDenuncias(
            manifestacoesResponse.data.filter(
              (manifestacao) => manifestacao.Tipo_manifestacao === "denuncia"
            )
          );
          setSugestoes(
            manifestacoesResponse.data.filter(
              (manifestacao) => manifestacao.Tipo_manifestacao === "sugestao"
            )
          );
        }

        if (usuariosResponse.success) {
          setUsuarios(usuariosResponse.data);
        }
      } catch (error) {
        console.error("Erro ao buscar manifestações:", error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Acompanhamento";
    checkAuth(navigate, ["admin", "moderador"]);

    const handleExibirTab = () => {
      const tabs = document.querySelectorAll(".tabContainer");
      tabs.forEach((tab) => {
        if (tab.id === `tab-${abaSelecionada}`) {
          tab.classList.remove("hidden");
        } else {
          tab.classList.add("hidden");
        }
      });
    };
    handleExibirTab();
    setExpandido(false);
  }, [abaSelecionada]);

  const toggleSidebar = () => {
    setExpandido(!expandido);
  };

  const opcoes = [
    { icon: "material-symbols:dashboard-rounded", label: "Visão Geral" },
    { icon: "material-symbols:feedback-rounded", label: "Reclamações" },
    { icon: "material-symbols:thumb-up-rounded", label: "Elogios" },
    { icon: "material-symbols:warning-rounded", label: "Denúncias" },
    { icon: "material-symbols:lightbulb-rounded", label: "Sugestões" },
  ];

  return (
    <BlankLayout
      showFooter={false}
      showHeader={true}
      showNavbar={true}
      removeBodyPadding={false}
    >
      <div className="corpoDoSite">
        <div className={`barraLateral ${expandido ? "expandido" : ""}`}>
          <Button onClick={toggleSidebar} className="toggle-expandir">
            <Icon
              icon={
                expandido
                  ? "material-symbols:chevron-left"
                  : "material-symbols:chevron-right"
              }
            />
          </Button>
          {opcoes.map((opcao, index) => (
            <div
              key={index}
              className={`opcao ${expandido ? "expandido" : ""}`}
              onClick={() => setAbaSelecionada(index.toString())}
            >
              <Icon icon={opcao.icon} className="icone" />
              {expandido && <span className="label">{opcao.label}</span>}
            </div>
          ))}
        </div>

        <div
          className={`conteudo ${expandido ? "escurecido" : ""}`}
          onClick={() => setExpandido(false)}
        >
          <div className="conteudoContainer">
            <div className="tabContainer hidden" id="tab-0">
              <Geral manifestacoes={manifestacoes} usuarios={usuarios} />
            </div>
            <div className="tabContainer hidden" id="tab-1">
              <Reclamacoes manifestacoes={reclamacoes} usuarios={usuarios} />
            </div>
            <div className="tabContainer hidden" id="tab-2">
              <Elogios manifestacoes={elogios} usuarios={usuarios} />
            </div>
            <div className="tabContainer hidden" id="tab-3">
              <Denuncias manifestacoes={denuncias} usuarios={usuarios} />
            </div>
            <div className="tabContainer hidden" id="tab-4">
              <Sugestoes manifestacoes={sugestoes} usuarios={usuarios} />
            </div>
          </div>
        </div>
      </div>
    </BlankLayout>
  );
};

export default Acompanhamento;
