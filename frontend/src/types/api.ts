export interface User {
  User_ID?: number;
  Nome: string;
  Email: string;
  Telefone?: string | null;
  Foto_Perfil?: string | null;
  SIAPE?: string | null;
  Tipo?: 'aluno' | 'servidor';
  Data_Criacao?: string;
  Role?: 'user' | 'admin' | 'moderador';
  Senha?: string;
}

export interface UserApiResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface Log {
  Log_ID: number;
  Acao: string;
  Data_Acao: string;
  User_ID: number;
}