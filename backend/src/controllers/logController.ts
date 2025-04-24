import { Request, Response } from "express";
import connection from "../db";
import { RowDataPacket } from "mysql2";

export const getLogs = (req: Request, res: Response): void => {
  connection.query(
    "SELECT * FROM Logs",
    (err, results: RowDataPacket[]) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao buscar histórico de ações: ${err.message}`,
        });
        return;
      }
      res.status(200).json({ success: true, data: results });
    }
  );
};