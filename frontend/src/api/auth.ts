import axios from "axios";
import { User } from "../types/api";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
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

export const checkAuth = async (navigate: ReturnType<typeof useNavigate>): Promise<void> => {
  const res = await getUsuarioAtual();
  if (!res.success) {
    navigate('/login');
  }
};

export const checkRole = async (role: string) => {
  const res = await getUsuarioAtual();
  if (!res.success || res.user?.Role !== role) {
    return false;
  } else {
    return true
  }
};
