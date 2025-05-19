import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      User_ID: number;
      role: string;
      email?: string;
    };
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.AurisToken;

  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      User_ID: number;
      Email: string;
      role: string;
    };

    req.user = {
      User_ID: decoded.User_ID,
      role: decoded.role,
      email: decoded.Email,
    };

    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido" });
    return 
  }
};

export const verifyRole = (rolesPermitidas: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;

    if (
      !role ||
      !rolesPermitidas.some((r) => r.toLowerCase() === role.toLowerCase())
    ) {
      res.status(403).json({
        success: false,
        message: "Acesso negado: permissão insuficiente.",
      });
      return;
    }

    next();
  };
};
