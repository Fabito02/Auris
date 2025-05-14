import "./fale-conosco.css";
import { BlankLayout } from "../../components/BlankLayout/BlankLayout";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";

const FaleConosco = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Fale Conosco";
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin", "moderador", "user"]);
    }
  }, []);

  return (
    <BlankLayout
      showFooter={false}
      showHeader={true}
      showNavbar={true}
      removeBodyPadding={false}
    >
      <div className="max-w-470 mx-auto">
        <div className="container-cards mt-[6vh] px-[10vw]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="coluna">
              <Link to="/fale-conosco/reclamacao">
                <img
                  className="tipoManifestacao"
                  src="/fale-conosco/cards/reclamação.svg"
                  alt="Card Reclamação"
                />
              </Link>
            </div>
            <div className="coluna">
              <Link to="/fale-conosco/elogio">
                <img
                  className="tipoManifestacao"
                  src="/fale-conosco/cards/elogio.svg"
                  alt="Card Elogio"
                />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="coluna">
              <Link to="/fale-conosco/denuncia">
                <img
                  className="tipoManifestacao"
                  src="/fale-conosco/cards/denúncia.svg"
                  alt="Card Denúncia"
                />
              </Link>
            </div>
            <div className="coluna">
              <Link to="/fale-conosco/sugestao">
                <img
                  className="tipoManifestacao"
                  src="/fale-conosco/cards/sugestão.svg"
                  alt="Card Sugestão"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BlankLayout>
  );
};

export default FaleConosco;
