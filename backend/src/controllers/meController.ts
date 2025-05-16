import { Request, Response, NextFunction, RequestHandler } from "express";
import connection from "../db";
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";
import { registrarLog } from "../utils/logger";
import multer from "multer";
import path from "path";
import mime from "mime-types";
import fs from "fs";

export const getUsuarioAtual = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !("User_ID" in req.user)) {
      res.status(403).json({ success: false, error: "Acesso não autorizado" });
      return;
    }

    const userId = req.user.User_ID;

    const [rows] = await connection
      .promise()
      .query<RowDataPacket[]>(
        "SELECT User_ID, Nome, Email, Telefone, Avatar, SIAPE, Tipo, Data_Criacao, Role FROM Users WHERE User_ID = ?",
        [userId]
      );

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: "Usuário não encontrado" });
      return;
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ success: false, error: "Erro interno" });
  }
};

export const getEnderecoUsuarioAtual = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !("User_ID" in req.user)) {
      res.status(403).json({ success: false, error: "Acesso não autorizado." });
      return;
    }

    const userId = req.user.User_ID;

    const [rows] = await connection
      .promise()
      .query<RowDataPacket[]>("SELECT * FROM Endereco WHERE User_ID = ?", [
        userId,
      ]);

    if (rows.length === 0) {
      res
        .status(404)
        .json({ success: false, error: "Endereço não encontrado." });
      return;
    }

    res.json({ success: true, endereco: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno." });
  }
};

export const updateEnderecoUsuarioAtual = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !("User_ID" in req.user)) {
      res.status(403).json({ success: false, error: "Acesso não autorizado." });
      return;
    }

    const userId = req.user.User_ID;
    const endereco = req.body;

    if (!endereco) {
      res.status(400).json({ success: false, error: "Endereço é necessário." });
      return;
    }

    const [updateResults] = await connection
      .promise()
      .query<ResultSetHeader>("UPDATE Endereco SET ? WHERE User_ID = ?", [
        endereco,
        userId,
      ]);

    if (updateResults.affectedRows === 0) {
      const [insertResults] = await connection
        .promise()
        .query<ResultSetHeader>("INSERT INTO Endereco SET ?, User_ID = ?", [
          endereco,
          userId,
        ]);

      if (insertResults.affectedRows === 0) {
        res
          .status(500)
          .json({ success: false, error: "Erro ao criar novo endereço." });
        return;
      }

      res
        .status(201)
        .json({ success: true, message: "Endereço criado com sucesso." });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Endereço atualizado com sucesso." });
  } catch (error) {
    next(error);
  }
};

export const updateUsuarioAtual = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !("User_ID" in req.user)) {
      res.status(403).json({ success: false, error: "Acesso não autorizado." });
      return;
    }

    const userId = req.user.User_ID;
    const user = req.body;

    if (!user) {
      res.status(400).json({ success: false, error: "Usuário é necessário." });
      return;
    }

    const [updateResults] = await connection
      .promise()
      .query<ResultSetHeader>("UPDATE Users SET ? WHERE User_ID = ?", [
        user,
        userId,
      ]);

    if (updateResults.affectedRows === 0) {
      res.status(404).json({ success: false, error: "Usuário não encontrado" });
      return;
    }

    const [emailResults] = await connection
      .promise()
      .query<RowDataPacket[]>("SELECT Email FROM Users WHERE User_ID = ?", [
        userId,
      ]);

    if (emailResults.length === 0) {
      res.status(404).json({ success: false, error: "Usuário não encontrado" });
      return;
    }

    const email = emailResults[0].Email;
    res
      .status(200)
      .json({ success: true, message: "Usuário atualizado com sucesso." });
    registrarLog(`Usuário ${email} atualizado.`, userId);
  } catch (error) {
    next(error);
  }
};

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.resolve(__dirname, "..", "uploads", "avatars"));
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now();
    const extension = mime.extension(file.mimetype) || "png";
    cb(null, `${uniqueSuffix}.${extension}`);
  },
});

const upload = multer({ storage }).single("avatar");

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.User_ID;

  upload(req, res, (err: any) => {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(new Error("Nenhum arquivo enviado."));
    }

    const avatarFilename = req.file.filename;

    connection.query(
      "SELECT Avatar FROM Users WHERE User_ID = ?",
      [userId],
      async (err, avatar: RowDataPacket[]) => {
        if (err) {
          return next(err);
        }

        const oldAvatar = avatar[0].Avatar;
        if (oldAvatar) {
          const filePath = path.resolve(
            __dirname,
            "..",
            "uploads",
            "avatars",
            oldAvatar
          );
          try {
            await fs.promises.unlink(filePath);
          } catch (unlinkErr: any & { code: string }) {
            if (unlinkErr.code !== "ENOENT") {
              return next(unlinkErr);
            }
          }
        }

        connection.query(
          "UPDATE Users SET Avatar = ? WHERE User_ID = ?",
          [avatarFilename, userId],
          (err, results: ResultSetHeader) => {
            if (err) {
              return next(err);
            }

            if (results.affectedRows === 0) {
              return next(new Error("Usuário não encontrado."));
            }

            return res.status(200).json({
              success: true,
              message: "Avatar atualizado com sucesso.",
              avatarUrl: `http://localhost:4000/uploads/avatars/${avatarFilename}`,
            });
          }
        );
      }
    );
  });
};

export const getRoleUsuarioAtual: RequestHandler<{ id: string }> = (
  req,
  res,
  next
) => {
  const userId = req.user?.User_ID;

  connection.query(
    "SELECT Role FROM Users WHERE User_ID = ?",
    [userId],
    (err, results: RowDataPacket[]) => {
      if (err) {
        next(err);
        return;
      }

      if (results.length === 0) {
        res
          .status(404)
          .json({ success: false, error: "Usuário não encontrado" });
        return;
      }

      res.status(200).json({ success: true, data: results[0] });
    }
  );
};

export const deleteNotificacao = (
  req: Request<{ Notificacao_ID: string }>,
  res: Response
) => {
  const notificationId = Number(req.params.Notificacao_ID);
  const userId = req.user?.User_ID

  connection.beginTransaction((transactionErr) => {
    if (transactionErr) {
      return res.status(500).json({
        success: false,
        error: `Erro ao iniciar transação: ${transactionErr.message}`,
      });
    }

        connection.query(
          "DELETE FROM Notificacoes WHERE Notificacao_ID = ? AND User_ID = ?",
          [notificationId, userId],
          (notificacaoDeleteErr, results: ResultSetHeader) => {
            if (notificacaoDeleteErr) {
              return connection.rollback(() => {
                res.status(500).json({
                  success: false,
                  error: `Erro ao deletar notificação: ${notificacaoDeleteErr.message}`,
                });
              });
            }

            if (results.affectedRows === 0) {
              return connection.rollback(() => {
                res
                  .status(404)
                  .json({ success: false, error: "Notificação não encontrada" });
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

              registrarLog(`Notificação deletada`, notificationId);

              return res.status(200).json({
                success: true,
                message: "Notificação deletada com sucesso",
              });
            });
          }
        );
      }
    );
  };

  export const getManifestacoes = (
    req: Request,
    res: Response
  ) => {
    const userId = Number(req.params.id);
  
    connection.query(
      "SELECT * FROM Manifestacoes WHERE User_ID = ?",
      [userId],
      (err, results: RowDataPacket[]) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: `Erro ao buscar manifestações: ${err.message}`,
          });
        }
        if (results.length === 0) {
          return res
            .status(404)
            .json({ success: false, error: "Nenhuma manifestação encontrada" });
        }
        return res.status(200).json({ success: true, data: results[0] });
      }
    );
  };

  export const getNotificacaoPorIDdeUsuario: RequestHandler<{ id: string }> = (
    req,
    res,
    next
  ) => {
    const userId = req.user?.User_ID;
    const notificacaoid = Number(req.params.id);
  
    connection.query(
      "SELECT * FROM Notificacoes WHERE Notificacao_ID = ? AND User_ID = ?",
      [notificacaoid, userId],
      (err, results: RowDataPacket[]) => {
        if (err) {
          next(err);
          return;
        }
  
        if (results.length === 0) {
          res
            .status(404)
            .json({ success: false, error: "Notificação não encontrada" });
          return;
        }
  
        res.status(200).json({ success: true, data: results[0] });
      }
    );
  };

  export const getNotificacoesDoUsuario: RequestHandler<{ id: string }> = (
    req,
    res,
    next
  ) => {
    const userId = req.user?.User_ID;
    const notificacaoid = Number(req.params.id);
  
    connection.query(
      "SELECT * FROM Notificacoes WHERE  User_ID = ?",
      [ userId],
      (err, results: RowDataPacket[]) => {
        if (err) {
          next(err);
          return;
        }
  
        if (results.length === 0) {
          res
            .status(404)
            .json({ success: false, error: "Nenhuma notificação encontrada" });
          return;
        }
  
        res.status(200).json({ success: true, data: results[0] });
      }
    );
  };
  