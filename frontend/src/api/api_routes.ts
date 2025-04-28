import axios from "axios";
import { User, Endereco } from "../types/api";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auris_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
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
  const response = await api.get("/me");
  return response.data;
};

export const getEnderecoUsuarioAtual = async () => {
  const response = await api.get("/me/endereco");
  return response.data;
};

export const updateEnderecoUsuarioAtual = async (
  enderecoData: Partial<Endereco>
) => {
  const response = await api.put(`/me/endereco`, enderecoData);
  return {
    success: true,
    data: response.data,
  };
};

export const getEnderecoByUserId = async (id: number) => {
  const response = await api.get(`/users/${id}/endereco`);
  return response.data;
};

export const getUsuarioByUserId = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export const postRegistrar = async (usuario: User) => {
  const response = await api.post("/auth/registrar", usuario);
  return response.data;
};

export const postLogin = async (credenciais: Pick<User, "Email" | "Senha">) => {
  const response = await api.post("/auth/login", credenciais);
  return response.data;
};

export const postLogout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const updateRole = async ({User_ID, Role,}: Pick<User, "User_ID" | "Role">) => {
  const response = await api.put(`/auth/role/${User_ID}`, { Role });
  return response.data;
};

export const updateUsuarioAtual = async (userData: Partial<User>) => {
  const response = await api.put(`/me`, userData);
  return {
    success: true,
    data: response.data,
  };
};

export const updateAvatarUsuarioAtual = async (avatar: File) => {
  const formData = new FormData();
  formData.append("avatar", avatar, "avatar");

  const response = await api.put("/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return {
    success: true,
    data: response.data,
  };
};

export const getAvatar = async (id: number) => {
  const response = await api.get(`/users/avatar/${id}`);
  return response.data;
};

export const registrarUsuario = async (user: User): Promise<void> => {
  const response = await api.post("/users", user);
  return response.data
};
