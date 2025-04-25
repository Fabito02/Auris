import axios from "axios";
import { User } from "../types/api";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auris_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.error) {
      return Promise.reject(new Error(error.response.data.error));
    }
    return Promise.reject(new Error(error.message || "Erro na conexão"));
  }
);

export const getUsuarios = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getLogs = async () => {
  const response = await api.get("/logs");
  return response.data;
};

export const getRole = async (usuario: User) => {
  const response = await api.post("/auth/role", usuario);
  return response.data;
};

export const getUsuarioAtual = async () => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Erro ao buscar usuário atual",
    };
  }
};

export const getEnderecoUsuarioAtual = async () => {
  try {
    const response = await api.get("/me/endereco");
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Erro ao buscar endereço do usuário atual",
    };
  }
};

export const postRegistrar = async (usuario: User) => {
  const response = await api.post("/auth/registrar", usuario);
  return response.data;
};

export const postLogin = async (credenciais: Pick<User, 'Email' | 'Senha'>) => {
  const response = await api.post("/auth/login", credenciais);
  return response.data;
};

export const postLogout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const updateRole = async ({ User_ID, Role }: Pick<User, 'User_ID' | 'Role'>) => {
  try {
    const response = await api.put(`/auth/role/${User_ID}`, { Role });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
