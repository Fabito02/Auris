import { useNavigate } from "react-router-dom";
import { getRoleUsuarioAtual } from "./api_routes";

export const checkAuth = async (
  navigate: ReturnType<typeof useNavigate>,
  roles: string[]
) => {
  try {
    const response = await getRoleUsuarioAtual();

    const roleUser = response.data.Role;

    if (roles.includes(roleUser)) {
      return true;
    } else {
      navigate("/errors/403");
      return false;
    }
  } catch (error) {
    console.error("Erro ao verificar autentica o:", error);
    navigate("/errors/401");
    return false;
  }
};

export const checkRole = async (role: string) => {
  const response = await getRoleUsuarioAtual();
  const roleUser = response.data.Role;

  if (!roleUser || roleUser !== role) {
    return false;
  } else {
    return true;
  }
};
