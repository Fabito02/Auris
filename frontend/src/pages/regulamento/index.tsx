import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "@/api/auth";

const Regulamento = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Regulamento";
    const token = localStorage.getItem("auris_token");
    if (!token) {
      navigate("/errors/401");
    } else {
      checkAuth(navigate, ["admin", "moderador", "user"]);
    }
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao Regulamento do site</h1>
      <p>Esta é a página de regulamento do nosso site.</p>
    </div>
  );
};

export default Regulamento;
