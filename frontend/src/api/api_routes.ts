import axios from "axios";
import { User } from "../types/api";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
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

export const postRegistrar = async (usuario: User) => {
  const response = await api.post("/auth/registrar", usuario);
  return response.data;
};

export const postLogin = async (credenciais: Pick<User, 'Email' | 'Senha'>) => {
  const response = await api.post("/auth/login", credenciais);
  return response.data;
};