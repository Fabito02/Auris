import { Request, Response } from 'express';
import connection from '../db';
import { RowDataPacket } from 'mysql2';
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { ResultSetHeader } from 'mysql2';
import { registrarLog } from "../utils/logger";

export const getUsuarioAtual = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !('User_ID' in req.user)) {
      res.status(403).json({ success: false, error: "Acesso não autorizado" });
      return;
    }

    const userId = req.user.User_ID;

    const [rows] = await connection.promise().query<RowDataPacket[]>(
      "SELECT User_ID, Nome, Email, Telefone, Foto_Perfil, SIAPE, Tipo, Data_Criacao, Role FROM Users WHERE User_ID = ?",
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: "Usuário não encontrado" });
      return;
    }

    res.json({ success: true, user: rows[0] });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ success: false, error: "Erro interno" });
  }
};

export const listUsers = (req: Request, res: Response): void => {
  connection.query(
    "SELECT User_ID, Nome, Email, Telefone, Foto_Perfil, SIAPE, Tipo, Data_Criacao, Role FROM Users",
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
    "SELECT User_ID, Nome, Email, Telefone, Foto_Perfil, SIAPE, Tipo, Data_Criacao, Role FROM Users WHERE User_ID = ?",
    [userId],
    (err, results: RowDataPacket[]) => {
      if (err) {
        return res
          .status(500)
          .json({
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
        return res
          .status(500)
          .json({
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
          return res
            .status(500)
            .json({
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

export const deleteUser = (req: Request<{ User_ID: string }>, res: Response) => {
  const userId = Number(req.params.User_ID);

  connection.beginTransaction((transactionErr) => {
    if (transactionErr) {
      return res
        .status(500)
        .json({
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
            res
              .status(500)
              .json({
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
                res
                  .status(500)
                  .json({
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
                  res
                    .status(500)
                    .json({
                      success: false,
                      error: `Erro ao confirmar transação: ${commitErr.message}`,
                    });
                });
              }

              registrarLog(`Usuário deletado`, userId);

              return res
                .status(200)
                .json({
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
        return res
          .status(500)
          .json({
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

export const getEnderecoUsuarioAtual = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !('User_ID' in req.user)) {
      res.status(403).json({ success: false, error: "Acesso não autorizado." });
      return;
    }

    const userId = req.user.User_ID;

    const [rows] = await connection.promise().query<RowDataPacket[]>(
      "SELECT * FROM Endereco WHERE User_ID = ?",
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: "Endereço não encontrado." });
      return;
    }

    res.json({ success: true, endereco: rows[0] });

  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno." });
  }
};
