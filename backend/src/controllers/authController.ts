import { Request, Response, RequestHandler } from "express";
import connection from "../db";
import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import passport from "passport";
import { User, IUser } from "../models/User";
import { generateToken } from "../config/passport";
import { registrarLog } from "../utils/logger";

export const login = (req: Request, res: Response) => {
  passport.authenticate("local", { session: false }, (
    err: Error | null,
    user: User | false,
    info: { message?: string }
  ) => {
    try {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Erro interno no servidor"
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          error: info.message || "Credenciais inválidas"
        });
      }

      if (!user.User_ID) {
        return res.status(500).json({
          success: false,
          error: "Dados do usuário incompletos"
        });
      }

      const token = generateToken(user as IUser);

      registrarLog(`Novo login de ${user.Email}`, user.User_ID);

      return res.json({
        success: true,
        token,
        user: {
          User_ID: user.User_ID,
          Email: user.Email,
          role: user.Role,
        },
        expiresIn: '1d'
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Erro interno no servidor"
      });
    }
  })(req, res);
};

export const registrar = (req: Request, res: Response): void => {
  const user = req.body;

  if (!user.Senha) {
    res.status(400).json({ success: false, error: "Senha é obrigatória." });
    return;
  }

  connection.query(
    "SELECT Email FROM Users WHERE Email = ?",
    [user.Email],
    (err, results: RowDataPacket[]) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao verificar email: ${err.message}`,
        });
        return;
      }

      if (results.length > 0) {
        res.status(400).json({ success: false, error: "Este email já está em uso." });
        return;
      }

      bcrypt.hash(user.Senha, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          res.status(500).json({
            success: false,
            error: `Erro ao encriptar a senha: ${hashErr.message}`,
          });
          return;
        }

        user.Senha = hashedPassword;

        connection.query(
          "INSERT INTO Users SET ?",
          user,
          (insertErr, results: ResultSetHeader) => {
            if (insertErr) {
              res.status(500).json({
                success: false,
                error: `Erro ao criar usuário: ${insertErr.message}`,
              });
              return;
            }

            registrarLog(`Novo usuário registrado: ${user.Email}`, results.insertId);
            
            res.status(201).json({
              success: true,
              message: "Usuário criado com sucesso!",
              User_ID: results.insertId,
            });
          }
        );
      });
    }
  );
};

export const getRoleById: RequestHandler<{ id: string }> = (req, res, next) => {
  const userId = Number(req.params.id);

  connection.query(
    "SELECT Role FROM Users WHERE User_ID = ?",
    [userId],
    (err, results: RowDataPacket[]) => {
      if (err) {
        next(err);
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ success: false, error: "Usuário não encontrado" });
        return;
      }

      res.status(200).json({ success: true, data: results[0] });
    }
  );
};

export const updateRole: RequestHandler<{ id: string }> = (req, res, next) => {
  const userId = Number(req.params.id);
  const newRole = req.body.Role;

  if (!newRole) {
    res.status(400).json({ success: false, error: "'Role' é necessário." });
    return;
  }

  connection.query(
    "UPDATE Users SET Role = ? WHERE User_ID = ?",
    [newRole, userId],
    (err, results: ResultSetHeader) => {
      if (err) {
        next(err);
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).json({ success: false, error: "Usuário não encontrado" });
        return;
      }

      res.status(200).json({ success: true, message: "Permissão atualizada com sucesso." });
    }
  );
};
