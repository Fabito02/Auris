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
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar usuário atual",
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
      error:
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar endereço do usuário atual",
    };
  }
};

export const updateEnderecoUsuarioAtual = async (
  enderecoData: Partial<Endereco>
) => {
  try {
    const response = await api.put(`/me/endereco`, enderecoData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Erro ao atualizar endereço do usuário",
    };
  }
};

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

export const updateRole = async ({
  User_ID,
  Role,
}: Pick<User, "User_ID" | "Role">) => {
  try {
    const response = await api.put(`/auth/role/${User_ID}`, { Role });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUsuarioAtual = async (userData: Partial<User>) => {
  try {
    const response = await api.put(`/me`, userData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Erro ao atualizar usuário",
    };
  }
};

export const updateAvatarUsuarioAtual = async (avatar: File) => {
  const formData = new FormData();
  formData.append("avatar", avatar, "avatar");

  try {
    const response = await api.put("/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar avatar:", error);
  }
};

export const getAvatar = async (id: number) => {
  try {
    const response = await api.get(`/users/avatar/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Erro ao buscar avatar do usuário atual",
    };
  }
};
