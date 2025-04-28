import { RowDataPacket } from "mysql2";

export interface User {
  User_ID?: number;
  Nome?: string;
  Email?: string;
  Senha?: string;
  Telefone?: string;
  Avatar?: string;
  SIAPE?: string;
  Tipo?: string;
  Data_Criacao?: Date;
  Role?: string;
  Email_Verificado?: boolean;
  Token_Verificacao?: string;
}

export interface IUser extends RowDataPacket {
  User_ID: number;
  Email: string;
  Senha?: string;
  Role?: string;
}
