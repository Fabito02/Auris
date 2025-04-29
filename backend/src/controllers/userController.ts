import { Request, Response, RequestHandler } from "express";
import connection from "../db";
import { RowDataPacket } from "mysql2";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { ResultSetHeader } from "mysql2";
import { registrarLog } from "../utils/logger";

export const listUsers = (req: Request, res: Response): void => {
  connection.query(
    "SELECT User_ID, Nome, Email, Telefone, Avatar, SIAPE, Tipo, Data_Criacao, Role FROM Users",
    (err, results: RowDataPacket[]) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao buscar usuários: ${err.message}`,
        });
        return;
      }
      res.status(200).json({ success: true, data: results });
    }
  );
};

export const getUserById = (req: Request<{ id: string }>, res: Response) => {
  const userId = Number(req.params.id);

  connection.query(
    "SELECT User_ID, Nome, Email, Telefone, Avatar, SIAPE, Tipo, Data_Criacao, Role FROM Users WHERE User_ID = ?",
    [userId],
    (err, results: RowDataPacket[]) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: `Erro ao buscar usuário: ${err.message}`,
        });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Usuário não encontrado" });
      }
      return res.status(200).json({ success: true, data: results[0] });
    }
  );
};

export const updateUser = (
  req: Request<{ id: string }, {}, Partial<User>>,
  res: Response
) => {
  const userId = Number(req.params.id);
  const userData = req.body;

  if (userData.Senha) {
    bcrypt.hash(userData.Senha, 10, (err, hashed) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: `Erro ao encriptar a senha: ${err.message}`,
        });
      }
      userData.Senha = hashed;
      performUpdate();
    });
  } else {
    performUpdate();
  }

  function performUpdate() {
    connection.query(
      "UPDATE Users SET ? WHERE User_ID = ?",
      [userData, userId],
      (err, results: ResultSetHeader) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: `Erro ao atualizar usuário: ${err.message}`,
          });
        }
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Usuário não encontrado" });
        }

        registrarLog("Usuário atualizado", userId);

        return res
          .status(200)
          .json({ success: true, message: "Usuário atualizado com sucesso" });
      }
    );
  }
};

export const deleteUser = (
  req: Request<{ User_ID: string }>,
  res: Response
) => {
  const userId = Number(req.params.User_ID);

  connection.beginTransaction((transactionErr) => {
    if (transactionErr) {
      return res.status(500).json({
        success: false,
        error: `Erro ao iniciar transação: ${transactionErr.message}`,
      });
    }

    connection.query(
      "DELETE FROM Manifestacoes WHERE User_ID = ?",
      [userId],
      (deleteErr) => {
        if (deleteErr) {
          return connection.rollback(() => {
            res.status(500).json({
              success: false,
              error: `Erro ao deletar manifestações: ${deleteErr.message}`,
            });
          });
        }

        connection.query(
          "DELETE FROM Users WHERE User_ID = ?",
          [userId],
          (userDeleteErr, results: ResultSetHeader) => {
            if (userDeleteErr) {
              return connection.rollback(() => {
                res.status(500).json({
                  success: false,
                  error: `Erro ao deletar usuário: ${userDeleteErr.message}`,
                });
              });
            }

            if (results.affectedRows === 0) {
              return connection.rollback(() => {
                res
                  .status(404)
                  .json({ success: false, error: "Usuário não encontrado" });
              });
            }

            connection.commit((commitErr) => {
              if (commitErr) {
                return connection.rollback(() => {
                  res.status(500).json({
                    success: false,
                    error: `Erro ao confirmar transação: ${commitErr.message}`,
                  });
                });
              }

              registrarLog(`Usuário deletado`, userId);

              return res.status(200).json({
                success: true,
                message: "Usuário deletado com sucesso",
              });
            });
          }
        );
      }
    );
  });
};

export const getEnderecoByUserId = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);

  connection.query(
    "SELECT * FROM Endereco WHERE User_ID = ?",
    [userId],
    (err, results: RowDataPacket[]) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: `Erro ao buscar endereço: ${err.message}`,
        });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Endereço nao encontrado" });
      }
      return res.status(200).json({ success: true, data: results[0] });
    }
  );
};

export const updateEnderecoByUserId: RequestHandler<{ id: string }> = (
  req,
  res,
  next
) => {
  const userId = Number(req.params.id);
  const endereco = req.body;

  if (!endereco) {
    res.status(400).json({ success: false, error: "Endereço é necessário." });
    return;
  }

  connection.query(
    "UPDATE Endereco SET ? WHERE User_ID = ?",
    [endereco, userId],
    (err, results: ResultSetHeader) => {
      if (err) {
        next(err);
        return;
      }

      if (results.affectedRows === 0) {
        res
          .status(404)
          .json({ success: false, error: "Endereço não encontrado" });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "Endereço atualizado com sucesso." });
    }
  );
};

export const getAvatar = (req: Request, res: Response): void => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({ success: false, error: "ID do usuário não fornecido" });
    return 
  }

  connection.query(
    "SELECT Avatar FROM Users WHERE User_ID = ?",
    [userId],
    (err, results: RowDataPacket[]) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: `Erro ao buscar avatar: ${err.message}`,
        });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Avatar não encontrado" });
      }

      const avatarFilename = results[0].Avatar;
      
      if (!avatarFilename) {
        return res
          .status(404)
          .json({ success: false, error: "Usuário não possui avatar" });
      }

      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${avatarFilename}`;

      return res.status(200).json({
        success: true,
        avatarUrl,
      });
    }
  );
};

export const registrarUsuario = async (req: Request, res: Response) => {
  const user = req.body;

  if (!user) {
    res.status(400).json({ success: false, error: "Usuário é necessário." });
    return;
  }

  const isEmailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailInstitucionalIFNMG = (email: string) => {
    if (!isEmailValido(email)) return false;
    const dominio = email.split('@')[1]?.toLowerCase();
    return dominio?.endsWith('ifnmg.edu.br') ?? false;
  };

  const isAluno = (email: string) => {
    if (!isEmailValido(email)) return false;
    const dominio = email.split('@')[1]?.toLowerCase();
    return dominio?.endsWith('aluno.ifnmg.edu.br') ?? false;
  };

  if (!isEmailValido(user.Email)) {
    res.status(400).json({ success: false, error: "Email inválido." });
    return;
  }

  if (!isEmailInstitucionalIFNMG(user.Email)) {
    res.status(400).json({ success: false, error: "Este email não é de domínio institucional IFNMG." });
    return;
  }

  try {
    const [existing] = await connection.promise().query<RowDataPacket[]>(
      "SELECT Email FROM Users WHERE Email = ?",
      [user.Email]
    );

    if (existing.length > 0) {
      res.status(400).json({ success: false, error: "Este email já está em uso." });
      return;
    }

    user.Tipo = isAluno(user.Email) ? "aluno" : "servidor";
    user.Senha = await bcrypt.hash(user.Senha, 10);
    user.Email_Verificado = true;
    user.Requer_Alteracao_Senha = true;

    const [result] = await connection.promise().query<ResultSetHeader>(
      "INSERT INTO Users SET ?",
      user
    );

    if (result.affectedRows === 0) {
      res.status(500).json({ success: false, error: "Erro ao registrar usuário." });
      return;
    }

    registrarLog(`Novo usuário registrado: ${user.Email}`, result.insertId);
    res.status(200).json({ success: true, message: "Usuário registrado com sucesso." });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ success: false, error: "Erro interno do servidor." });
  }
};