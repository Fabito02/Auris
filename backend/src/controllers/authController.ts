import { Request, Response } from "express";
import connection from "../db";
import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import passport from "passport";
import { User, IUser } from "../models/User";
import { generateToken } from "../config/passport";
import jwt from "jsonwebtoken";

// Login
export const login = (req: Request, res: Response) => {
  passport.authenticate("local", { session: false }, (
    err: Error | null,
    user: User | false,
    info: { message?: string }
  ) => {
    try {
      if (err) {
        console.error('Erro na autenticação:', err);
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
        console.error('Usuário sem ID:', user);
        return res.status(500).json({
          success: false,
          error: "Dados do usuário incompletos"
        });
      }
      
      const { Senha, User_ID, ...userWithoutPassword } = user;

      
      const token = generateToken(user as IUser);

      const response = {
        success: true,
        message: "Login realizado com sucesso",
        token,
        user: userWithoutPassword,
        expiresIn: 3600
      };

      return res.json({
        success: true,
        token,
        user: {
          User_ID: user.User_ID,
          Email: user.Email,
        },
        expiresIn: '1d'
      });

    } catch (error) {
      console.error('Erro no processo de login:', error);
      return res.status(500).json({
        success: false,
        error: "Erro interno no servidor"
      });
    }
  })(req, res);
};

// Registrar
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
        res
          .status(500)
          .json({
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
          res
            .status(500)
            .json({
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
              res
                .status(500)
                .json({
                  success: false,
                  error: `Erro ao criar usuário: ${insertErr.message}`,
                });
              return;
            }
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
