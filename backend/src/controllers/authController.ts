import { Request, Response, RequestHandler } from "express";
import connection from "../db";
import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import passport from "passport";
import { User, IUser } from "../models/User";
import { generateToken } from "../config/passport";
import { registrarLog } from "../utils/logger";
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
dotenv.config(); 

export const login = (req: Request, res: Response) => {
  passport.authenticate("local", { session: false }, async (
    err: Error | null,
    user: User | false,
    info: { message?: string }
  ) => {
    try {
      if (err) {
        return res.status(500).json({ success: false, error: "Erro interno no servidor" });
      }

      if (!user) {
        return res.status(401).json({ success: false, error: info.message || "Credenciais inválidas" });
      }

      if (!user.User_ID) {
        return res.status(500).json({ success: false, error: "Dados do usuário incompletos" });
      }

      // Verifica se o email foi confirmado
      const [rows] = await connection.promise().query<RowDataPacket[]>(
        "SELECT Email_Verificado FROM Users WHERE User_ID = ?",
        [user.User_ID]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      const emailVerified = rows[0].Email_Verificado as boolean;

      if (!emailVerified) {
        return res.status(401).json({
          success: false,
          error: "Email não verificado. Por favor, verifique seu email para ativar a conta.",
        });
      }

      // Gera token de autenticação
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
        expiresIn: '1d',
      });

    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ success: false, error: "Erro interno no servidor" });
    }
  })(req, res);
};

export const registrar = async (req: Request, res: Response): Promise<void> => {
  const user = req.body;

  if (!user.Senha) {
    res.status(400).json({ success: false, error: "Senha é obrigatória." });
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

    const token = randomUUID();
    user.Token_Verificacao = token;
    user.Email_Verificado = false;

    const [result] = await connection.promise().query<ResultSetHeader>(
      "INSERT INTO Users SET ?",
      user
    );

    registrarLog(`Novo usuário registrado: ${user.Email}`, result.insertId);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

    //temporário apenas para desenvolvimento
    const link = `http://localhost:5173/confirmar?token=${token}`;

    await transporter.sendMail({
      from: 'Auris IFNMG <noreply@ifnmg.edu.br>',
      to: user.Email,
      subject: 'Confirme seu e-mail',
      html: `
          <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <div style="background-color: #2c2c2c; padding: 20px; text-align: center;">
            <img src="cid:logo_auris" alt="Logo Auris" style="width: 300px; height: auto;" />
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #2c2c2c;">
            <h2 style="color: #2c2c2c; margin: 0; text-align: center; margin-bottom: 30px;">CONFIRMAÇÃO DE E-MAIL</h2>
            <p style="font-size: 16px;">Olá ${user.Nome || ""},</p>
            <p style="font-size: 16px;">Estamos quase lá! Basta clicar no botão abaixo para confirmar seu e-mail e ativar sua conta na plataforma <strong>Auris</strong>:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background-color: #16aa51; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 12px; font-size: 16px;">ATIVAR CONTA</a>
            </div>
            <p style="font-size: 14px; color: #777;">Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:</p>
            <p style="font-size: 14px; word-break: break-all;">${link}</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-bottom: 10px;">
            © ${new Date().getFullYear()} Auris IFNMG. Todos os direitos reservados.
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'Logo.png',
          path: 'src/public/Logo.png',
          cid: 'logo_auris'
        }
      ]
    });
    

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso!",
      User_ID: result.insertId,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: `Erro no registro: ${err.message}`,
    });
  }
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

      connection.query(
        "SELECT Email FROM Users WHERE User_ID = ?",
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

          const email = results[0].Email;
          res.status(200).json({ success: true, message: "Permissão atualizada com sucesso." });
          registrarLog(`Permissão de ${email} atualizada para ${newRole}`, userId);
        }
      );
    }
  );
};

export async function confirmarEmail(req: Request, res: Response) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ success: false, error: 'Token não fornecido ou inválido' });
    return;
  }

  try {
    const [rows]: any = await connection.promise().query(
      'SELECT * FROM Users WHERE Token_Verificacao = ?',
      [token]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, error: 'Token inválido ou expirado' });
      return;
    }

    await connection.promise().query(
      'UPDATE Users SET Email_Verificado = ?, Token_Verificacao = NULL WHERE Token_Verificacao = ?',
      [true, token]
    );

    registrarLog('Email verificado', rows[0].User_ID);

    res.json({ success: true, message: 'Email verificado com sucesso!' });
    
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({ success: false, error: 'Erro ao processar a verificação' });
  }
}