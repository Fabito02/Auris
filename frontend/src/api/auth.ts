import { useNavigate } from "react-router-dom";

export const checkAuth = (navigate: ReturnType<typeof useNavigate>, roles: string[]) => {
  const token = localStorage.getItem('auris_token');
  const roleUser = localStorage.getItem('auris_role');

  if (!token) {
    navigate("/errors/401");
    return false
  } else if (roles.includes(roleUser || "")) {
    return true
  } else {
    navigate("/errors/403");
    return false
  }
};

export const checkRole = (role: string) => {
  const roleUser = localStorage.getItem('auris_role');
  if (!roleUser || roleUser !== role) {
    return false;
  } else {
    return true
  }
};
