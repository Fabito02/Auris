import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import "../admin.css";
import { BlankLayout } from "@/components/BlankLayout/BlankLayout";
import { useEffect } from "react";
import Manifestacoes from "@/components/admin/gerenciar/Manifestacoes";
import Usuarios from "@/components/admin/gerenciar/Usuarios";
import Permissoes from "@/components/admin/gerenciar/Permissoes";
import Historico from "@/components/admin/gerenciar/Historico";
import { checkRole } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";

const Gerenciar = () => {
  const [expandido, setExpandido] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState("0");
  const [isAdminResult, setIsAdminResult] = useState(false);

  function isAdmin() {
    return checkRole("admin");
  }

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Acompanhamento";
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin", "moderador"]);
    }

    isAdmin().then((result) => setIsAdminResult(result));

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
    {
      icon: "material-symbols:record-voice-over-rounded",
      label: "Manifestações",
    },
    { icon: "material-symbols:groups-rounded", label: "Usuários" },
  ];

  if (isAdminResult) {
    opcoes.push({
      icon: "material-symbols:security-rounded",
      label: "Permissoes",
    });
    opcoes.push({
      icon: "material-symbols:work-history-rounded",
      label: "Histórico",
    });
  }

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
              {opcao && (
                <>
                  <Icon icon={opcao.icon} className="icone" />
                  {expandido && <span className="label">{opcao.label}</span>}
                </>
              )}
            </div>
          ))}
        </div>

        <div
          className={`conteudo ${expandido ? "escurecido" : ""}`}
          onClick={() => setExpandido(false)}
        >
          <div className="conteudoContainer">
            <div className="tabContainer hidden" id="tab-0">
              <Manifestacoes />
            </div>
            <div className="tabContainer hidden" id="tab-1">
              <Usuarios />
            </div>
            {isAdminResult && (
              <>
                <div className="tabContainer hidden" id="tab-2">
                  <Permissoes />
                </div>
                <div className="tabContainer hidden" id="tab-3">
                  <Historico />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </BlankLayout>
  );
};

export default Gerenciar;
