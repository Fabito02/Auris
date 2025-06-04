import connection from "./src/db";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function runSeeds() {
  const promiseConnection = connection.promise();

  try {
    console.log("Iniciando processo de seed...");

    await createDatabase(promiseConnection);

    await createTables(promiseConnection);

    await insertSeeds(promiseConnection);

    console.log("Seed concluído com sucesso!");
  } catch (err) {
    console.error("Erro durante a execução dos seeds:", err);
  } finally {
    connection.end();
    process.exit(0);
  }
}

async function createDatabase(conn: mysql.Connection) {
  try {
    await conn.query("CREATE DATABASE IF NOT EXISTS Auris");
    console.log("Banco de dados Auris verificado/criado");
    await conn.query("USE Auris");
  } catch (err) {
    console.error("Erro ao criar/verificar o banco de dados:", err);
    throw err;
  }
}

async function createTables(conn: mysql.Connection) {
  const queries = [
    `CREATE TABLE IF NOT EXISTS Users (
            User_ID INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            Nome VARCHAR(100) NOT NULL,
            Email VARCHAR(100) UNIQUE,
            Telefone VARCHAR(20),
            Avatar VARCHAR(255) DEFAULT NULL,
            SIAPE VARCHAR(50),
            Tipo ENUM('servidor', 'aluno'),
            Senha VARCHAR(255),
            Data_Criacao DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            Role ENUM('user', 'admin', 'moderador', 'anonimo') DEFAULT 'user',
            Token_Verificacao VARCHAR(255),
            Email_Verificado BOOLEAN DEFAULT FALSE,
            Requer_Alteracao_Senha BOOLEAN DEFAULT FALSE,
            Primeiro_Acesso BOOLEAN DEFAULT TRUE,
            is_anonymous BOOLEAN DEFAULT FALSE
        ) ENGINE=InnoDB;`,

    `CREATE TABLE IF NOT EXISTS Endereco (
            Endereco_ID INT AUTO_INCREMENT PRIMARY KEY,
            Logradouro VARCHAR(100),
            Bairro VARCHAR(50),
            Cidade VARCHAR(50),
            Numero VARCHAR(30),
            Complemento VARCHAR(100),
            Estado CHAR(2),
            CEP CHAR(9),
            User_ID INT,
            FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
        ) ENGINE=InnoDB`,

    `CREATE TABLE IF NOT EXISTS Manifestacoes (
            Manifestacao_ID INT AUTO_INCREMENT PRIMARY KEY,
            Data_Envio DATETIME DEFAULT CURRENT_TIMESTAMP,
            Titulo VARCHAR(100) NOT NULL,
            Descricao LONGTEXT NOT NULL,
            Tipo VARCHAR(50),
            Tipo_manifestacao ENUM('reclamacao', 'sugestao', 'denuncia', 'elogio') NOT NULL,
            Anonimo BOOLEAN DEFAULT FALSE,
            Local VARCHAR(100),
            Status ENUM('pendente', 'em_andamento', 'concluido') DEFAULT 'pendente',
            Prioridade ENUM('baixa', 'media', 'alta', 'urgente') DEFAULT 'media',
            User_ID INT NOT NULL,
            Real_User_ID INT,
            FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
            FOREIGN KEY (Real_User_ID) REFERENCES Users(User_ID)
        ) ENGINE=InnoDB`,

    `CREATE TABLE IF NOT EXISTS Respostas (
            Resposta_ID INT AUTO_INCREMENT PRIMARY KEY,
            Descricao TEXT NOT NULL,
            Data_Criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            Manifestacao_ID INT NOT NULL,
            User_ID INT NOT NULL,
            FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
            FOREIGN KEY (Manifestacao_ID) REFERENCES Manifestacoes(Manifestacao_ID) ON DELETE CASCADE
        ) ENGINE=InnoDB`,

    `CREATE TABLE IF NOT EXISTS Logs (
            Log_ID INT AUTO_INCREMENT PRIMARY KEY,
            Acao VARCHAR(100) NOT NULL,
            Data_Acao DATETIME DEFAULT CURRENT_TIMESTAMP,
            User_ID INT,
            FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE SET NULL
        ) ENGINE=InnoDB`,

    `CREATE TABLE IF NOT EXISTS Notificacoes (
            Notificacao_ID INT AUTO_INCREMENT PRIMARY KEY,
            Titulo VARCHAR(100) NOT NULL,
            Mensagem TEXT NOT NULL,
            Status ENUM('lida', 'pendente') DEFAULT 'pendente',
            Data_Criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            User_ID INT NOT NULL,
            FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
        ) ENGINE=InnoDB`,
  ];

  for (const [index, query] of queries.entries()) {
    try {
      await conn.query(query);
      console.log(`Tabela ${index + 1} criada/verificada com sucesso`);
    } catch (err) {
      console.error(`Erro ao criar tabela ${index + 1}:`, err);
    }
  }
}

async function insertSeeds(conn: mysql.Connection) {
  try {
    const senhaPadrao = "12345678";
    const hashedSenha = await bcrypt.hash(senhaPadrao, 10);

    const users = [
      {
        Nome: "Anônimo",
        Role: "anonimo",
        Email_Verificado: true,
        Primeiro_Acesso: false,
        is_anonymous: true,
      },
      {
        Nome: "admin",
        Email: "teste@admin.com",
        Telefone: "(11) 99999-9999",
        Tipo: "servidor",
        Role: "admin",
        Senha: hashedSenha,
        Token_Verificacao: "123456789",
        Email_Verificado: true,
        Primeiro_Acesso: true,
      },
      {
        Nome: "moderador",
        Email: "teste@moderador.com",
        Telefone: "(11) 98888-8888",
        SIAPE: "1234567",
        Tipo: "servidor",
        Role: "moderador",
        Senha: hashedSenha,
        Token_Verificacao: "123456789",
        Email_Verificado: true,
        Primeiro_Acesso: false,
      },
      {
        Nome: "user",
        Email: "teste@user.com",
        Telefone: "(11) 97777-7777",
        Tipo: "aluno",
        Senha: hashedSenha,
        Token_Verificacao: "123456789",
        Email_Verificado: true,
        Primeiro_Acesso: false,
      },
    ];

    for (const user of users) {
      await conn.query("INSERT IGNORE INTO Users SET ?", user);
    }
    console.log("Usuários inseridos/verificados");

    const enderecos = [
      {
        Logradouro: "Rua das Acácias",
        Bairro: "Jardim Primavera",
        Cidade: "Rio de Janeiro",
        Numero: "150",
        Complemento: "Apto 202",
        Estado: "RJ",
        CEP: "20031-170",
        User_ID: 2,
      },
      {
        Logradouro: "Avenida Atlântica",
        Bairro: "Copacabana",
        Cidade: "Rio de Janeiro",
        Numero: "3000",
        Estado: "RJ",
        CEP: "22070-001",
        User_ID: 3,
      },
      {
        Logradouro: "Praça da Liberdade",
        Bairro: "Liberdade",
        Cidade: "Belo Horizonte",
        Numero: "50",
        Complemento: "Edifício Central",
        Estado: "MG",
        CEP: "30140-010",
        User_ID: 4,
      },
    ];

    for (const endereco of enderecos) {
      await conn.query("INSERT IGNORE INTO Endereco SET ?", endereco);
    }
    console.log("Endereços inseridos/verificados");

    const manifestacoes = [
      {
        Titulo: "Problema na iluminação",
        Descricao: "As luzes do corredor principal não estão funcionando.",
        Tipo: "Infraestrutura",
        Tipo_manifestacao: "reclamacao",
        Local: "Corredor principal, 2º andar",
        Prioridade: "alta",
        User_ID: 1,
        Status: "pendente",
        Anonimo: true,
        Real_User_ID: 2,
      },
      {
        Titulo: "As carteiras estão muito danificadas",
        Descricao:
          "As carteiras das salas de aula estão muito danificadas e precisam ser trocadas.",
        Tipo: "Recursos",
        Tipo_manifestacao: "reclamacao",
        Local: "Biblioteca",
        Prioridade: "alta",
        User_ID: 1,
        Status: "pendente",
        Anonimo: true,
        Real_User_ID: 2,
      },
      {
        Titulo: "A higiene do campus está excelente",
        Descricao: "O campus está muito limpo e organizado nos ultimos dias!",
        Tipo: "Higiene",
        Tipo_manifestacao: "elogio",
        Local: "Biblioteca",
        Prioridade: "baixa",
        User_ID: 2,
        Status: "concluido",
        Real_User_ID: 2,
      },
      {
        Titulo: "Solicitação de material",
        Descricao: "Poderiam solicitar mais livros para a biblioteca.",
        Tipo: "Recursos",
        Tipo_manifestacao: "sugestão",
        Local: "Biblioteca",
        Prioridade: "media",
        User_ID: 2,
        Status: "em_andamento",
        Real_User_ID: 2,
      },
      {
        Titulo: "Agressão no refeitorio",
        Descricao:
          "Um aluno foi agredido na refeitorio e ficou gravemente ferido.",
        Tipo: "Segurança",
        Tipo_manifestacao: "denuncia",
        Local: "Biblioteca",
        Prioridade: "urgente",
        User_ID: 2,
        Status: "em_andamento",
        Real_User_ID: 2,
      },
      {
        Titulo: "Computadores lentos",
        Descricao: "Os computadores do laboratório estão muito lentos.",
        Tipo: "Tecnologia",
        Tipo_manifestacao: "reclamacao",
        Local: "Laboratório de Informática",
        Prioridade: "media",
        User_ID: 3,
        Status: "pendente",
        Real_User_ID: 3,
      },
      {
        Titulo: "Falta de papel higiênico",
        Descricao: "Os banheiros estão sem papel higiênico há dias.",
        Tipo: "Infraestrutura",
        Tipo_manifestacao: "reclamacao",
        Local: "Banheiros do bloco B",
        Prioridade: "alta",
        User_ID: 3,
        Status: "pendente",
        Real_User_ID: 3,
      },
      {
        Titulo: "Excelente atendimento",
        Descricao: "O atendimento na secretaria está excelente.",
        Tipo: "Serviço",
        Tipo_manifestacao: "elogio",
        Local: "Secretaria",
        Prioridade: "baixa",
        User_ID: 3,
        Status: "concluido",
        Real_User_ID: 4,
      },
      {
        Titulo: "Mais opções vegetarianas",
        Descricao:
          "Seria interessante adicionar mais opções vegetarianas no cardápio.",
        Tipo: "Alimentação",
        Tipo_manifestacao: "sugestão",
        Local: "Refeitório",
        Prioridade: "media",
        User_ID: 4,
        Status: "em_andamento",
        Real_User_ID: 4,
      },
      {
        Titulo: "Roubo de bicicleta",
        Descricao: "Minha bicicleta foi roubada no estacionamento.",
        Tipo: "Segurança",
        Tipo_manifestacao: "denuncia",
        Local: "Estacionamento",
        Prioridade: "urgente",
        User_ID: 4,
        Status: "em_andamento",
        Real_User_ID: 4,
      },
    ];

    for (const manifestacao of manifestacoes) {
      await conn.query("INSERT IGNORE INTO Manifestacoes SET ?", manifestacao);
    }
    console.log("Manifestações inseridas/verificadas");

    const respostas = [
      {
        Descricao: "Já solicitamos a manutenção da iluminação",
        User_ID: 2,
        Manifestacao_ID: 1,
      },
      {
        Descricao: 'Irei marcar como "concluído", pois já foi resolvido.',
        User_ID: 2,
        Manifestacao_ID: 1,
      },
      {
        Descricao:
          "Estamos analisando a situação para tomar as medidas necessárias.",
        User_ID: 3,
        Manifestacao_ID: 2,
      },
      {
        Descricao: "Agradecemos seu elogio, continuaremos nos esforçando!",
        User_ID: 3,
        Manifestacao_ID: 3,
      },
      {
        Descricao:
          "Estamos considerando sua sugestão para futuras atualizações.",
        User_ID: 4,
        Manifestacao_ID: 4,
      },
      {
        Descricao: "As medidas de segurança estão sendo reforçadas.",
        User_ID: 4,
        Manifestacao_ID: 5,
      },
    ];

    for (const resposta of respostas) {
      await conn.query("INSERT IGNORE INTO Respostas SET ?", resposta);
    }
    console.log("Respostas inseridas/verificadas");

    const notificacoes = [
      {
        Titulo: "Nova manifestação recebida",
        Mensagem: "Você recebeu uma nova manifestação para análise.",
        Status: "pendente",
        User_ID: 2,
      },
      {
        Titulo: "Resposta recebida",
        Mensagem:
          'Sua manifestação "Solicitação de material" recebeu uma resposta.',
        Status: "pendente",
        User_ID: 4,
      },
      {
        Titulo: "Nova manifestação recebida",
        Mensagem: "Você recebeu uma nova manifestação para análise.",
        Status: "pendente",
        User_ID: 3,
      },
      {
        Titulo: "Resposta recebida",
        Mensagem:
          'Sua manifestação "Elogio ao professor" recebeu uma resposta.',
        Status: "pendente",
        User_ID: 3,
      },
      {
        Titulo: "Nova manifestação recebida",
        Mensagem: "Você recebeu uma nova manifestação para análise.",
        Status: "pendente",
        User_ID: 4,
      },
      {
        Titulo: "Resposta recebida",
        Mensagem:
          'Sua manifestação "Solicitação de manutenção" recebeu uma resposta.',
        Status: "pendente",
        User_ID: 2,
      },
    ];

    for (const notificacao of notificacoes) {
      await conn.query("INSERT IGNORE INTO Notificacoes SET ?", notificacao);
    }
    console.log("Notificações inseridas/verificadas");
  } catch (err) {
    console.error("Erro ao inserir seeds:", err);
    throw err;
  }
}

runSeeds();
