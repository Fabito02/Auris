export interface User {
  User_ID?: number;
  Nome: string;
  Email: string;
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

export interface Endereco {
  Endereco_ID: number;
  Logradouro: string;
  Bairro: string;
  Cidade: string;
  Numero: string;
  Complemento: string;
  Estado: string;
  CEP: string;
  User_ID: number;
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

export interface Manifestacao {
  Manifestacao_ID: number;
  Data_Envio: string;
  Titulo?: string;
  Descricao: string;
  Tipo: string;
  Tipo_manifestacao: "elogio" | "reclamacao" | "sugestao" | "denuncia";
  Anonimo?: boolean;
  Local?: string;
  Status: "pendente" | "em_andamento" | "concluido";
  Prioridade: "baixa" | "media" | "alta" | "urgente";
  User_ID: number;
}

export interface Notificacao {
  Notificacao_ID: number;
  Titulo: string;
  Mensagem: string;
  Status: "lida" | "pendente";
  Data_Criacao: string;
  User_ID: number;
}

export interface Resposta {
  Resposta_ID: number;
  Descricao: string;
  Manifestacao_ID: number;
  User_ID: number;
  Data_Criacao: string;
}
