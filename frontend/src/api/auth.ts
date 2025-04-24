import axios from "axios";
import { User } from "../types/api";
import { useNavigate } from "react-router-dom";

const hostname = window.location.hostname;

const api = axios.create({
  baseURL: `http://${hostname}:4000/api`,
});

interface UserResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const getUsuarioAtual = async (): Promise<UserResponse> => {
  try {
    const token = localStorage.getItem('auris_token');
    
    if (!token) {
      return {
        success: false,
        error: "Usuário não autenticado"
      };
    }

    const response = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
    
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error);
    return {
      success: false,
      error: error.response?.data?.error || "Erro ao carregar dados do usuário"
    };
  }
};

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
