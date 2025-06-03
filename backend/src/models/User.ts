import { RowDataPacket } from "mysql2";

export interface User {
  User_ID?: number;
  Nome?: string;
  Email?: string;
  Senha?: string;
  Telefone?: string;
  Avatar?: string;
  SIAPE?: string;
  Tipo?: "aluno" | "servidor";
  Data_Criacao?: Date;
  Role?: "user" | "admin" | "moderador" | "anonimo";
  Email_Verificado?: boolean;
  Token_Verificacao?: string;
  Requer_Alteracao_Senha?: boolean;
  Primeiro_Acesso?: boolean;
}

export interface IUser extends RowDataPacket {
  User_ID: number;
  Email: string;
  Senha?: string;
  Role?: string;
}
