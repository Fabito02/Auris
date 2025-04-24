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

const Acompanhamento = () => {
  const [expandido, setExpandido] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState("0");

  useEffect(() => {
    document.title = "Acompanhamento";

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
              <Geral />
            </div>
            <div className="tabContainer hidden" id="tab-1">
              <Reclamacoes />
            </div>
            <div className="tabContainer hidden" id="tab-2">
              <Elogios />
            </div>
            <div className="tabContainer hidden" id="tab-3">
              <Denuncias />
            </div>
            <div className="tabContainer hidden" id="tab-4">
              <Sugestoes />
            </div>
          </div>
        </div>
      </div>
    </BlankLayout>
  );
};

export default Acompanhamento;
