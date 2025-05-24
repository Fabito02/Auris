import { Request, Response, RequestHandler, NextFunction } from "express";
import connection from "../db";
import { RowDataPacket } from "mysql2";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { ResultSetHeader } from "mysql2";
import { registrarLog } from "../utils/logger";
import nodemailer from "nodemailer";
import { URL_BASE_FRONTEND, URL_BASE_AVATAR } from "../config";

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
  res: Response,
  next: NextFunction
) => {
  const userId = Number(req.params.User_ID);
  if (isNaN(userId)) {
    res.status(400).json({ success: false, error: "ID inválido" });
    return;
  }

  connection.beginTransaction((err) => {
    if (err) return next(err);

    connection.query(
      "DELETE FROM Manifestacoes WHERE User_id = ?",
      [userId],
      (deleteErr) => {
        if (deleteErr) {
          connection.rollback(() => next(deleteErr));
          return;
        }

        connection.query(
          "INSERT INTO Logs (Acao, User_ID) VALUES (?, ?)",
          ["Usuário deletado", userId],
          (logErr) => {
            if (logErr) {
              connection.rollback(() => next(logErr));
              return;
            }

            connection.query(
              "DELETE FROM Users WHERE User_ID = ?",
              [userId],
              (userDeleteErr, results: ResultSetHeader) => {
                if (userDeleteErr) {
                  connection.rollback(() => {
                    res.status(500).json({
                      success: false,
                      error: `Erro ao deletar usuário: ${userDeleteErr.message}`,
                    });
                    return;
                  });
                }

                if (results.affectedRows === 0) {
                  connection.rollback(() => {
                    res
                      .status(404)
                      .json({
                        success: false,
                        error: "Usuário não encontrado",
                      });
                  });
                  return;
                }

                connection.commit((commitErr) => {
                  if (commitErr) {
                    connection.rollback(() => next(commitErr));
                    return;
                  }
                  res.status(200).json({
                    success: true,
                    message: "Usuário deletado com sucesso",
                  });
                });
              }
            );
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
    res
      .status(400)
      .json({ success: false, error: "ID do usuário não fornecido" });
    return;
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

      const avatarUrl = `${URL_BASE_AVATAR}/${avatarFilename}`;

      return res.status(200).json({
        success: true,
        avatarUrl,
      });
    }
  );
};

export const postEnviarNotificacao = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data = req.body;

  try {
    const [result] = await connection
      .promise()
      .query<ResultSetHeader>("INSERT INTO Notificacoes SET ?", [data]);

    if (result.affectedRows === 0) {
      res.status(500).json({
        success: false,
        error: "Erro ao enviar notificação.",
      });
      return;
    }

    const [results2] = await connection
      .promise()
      .query<RowDataPacket[]>(
        "SELECT * FROM Notificacoes WHERE Notificacao_ID = ?",
        [result.insertId]
      );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const [user] = await connection
      .promise()
      .query<RowDataPacket[]>("SELECT * FROM Users WHERE User_ID = ?", [
        req.body.User_ID,
      ]);

    const link = `${URL_BASE_FRONTEND}/home`;

    await transporter.sendMail({
      from: "Auris IFNMG <noreply@ifnmg.edu.br>",
      to: user[0].Email,
      subject: "Nova notificação",
      html: `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                <div style="background-color: #2c2c2c; padding: 20px; text-align: center;">
                  <img src="cid:logo_auris" alt="Logo Auris" style="width: 300px; height: auto;" />
                </div>
                <div style="padding: 30px; background-color: #ffffff; color: #2c2c2c;">
                  <h2 style="color: #2c2c2c; margin: 0; text-align: center; margin-bottom: 30px;">NOVA NOTIFICAÇÃO</h2>
                  <p style="font-size: 16px;">Olá ${user[0].Nome || ""},</p>
                  <span style="font-size: 16px; margin-top: 10px; font-weight: bold">${
                    results2[0].Titulo || ""
                  }</span>
                  <p style="font-size: 16px;">${results2[0].Mensagem || ""}</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="background-color: #16aa51; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 12px; font-size: 16px;">ACESSAR PLATAFORMA</a>
                  </div>
                </div>
                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-bottom: 10px;">
                  © 2025 Auris IFNMG. Todos os direitos reservados.
                </div>
              </div>
            `,
      attachments: [
        {
          filename: "Logo.png",
          path: "src/public/Logo.png",
          cid: "logo_auris",
        },
      ],
    });

    res.status(200).json({ success: true, data: results2[0] });
    return;
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor.",
    });
    return;
  }
};
