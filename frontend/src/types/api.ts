export type UserType = 'servidor' | 'discente' | 'docente' | 'direção' | 'outro';
export type UserRole = 'user' | 'admin' | 'moderador';

export interface User {
  User_ID?: number;
  Nome: string;
  Email: string;
  Telefone?: string | null;
  Foto_Perfil?: string | null;
  SIAPE?: string | null;
  Tipo?: UserType;
  Data_Criacao?: string;
  Role?: UserRole;
  Senha?: string;
}

export interface UserApiResponse {
  success: boolean;
  user?: User;
  error?: string;
}