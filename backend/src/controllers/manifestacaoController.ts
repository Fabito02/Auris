  import { Request, Response } from "express";
  import connection from "../db";
  import { RowDataPacket } from "mysql2";
  import { ResultSetHeader } from "mysql2";
  import {registrarLog} from "../utils/logger";
  import express from "express";
  const app = express();
  app.use(express.json());


  export const getManifestacoesDoUsuario = (
    req: Request,
    res: Response
  ) => {
    const userId = req.user?.User_ID;
  
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
        return res.status(200).json({ success: true, data: results });
      }
    );
  };

export const responderManifestacao = (req: Request, res: Response) => {
  const manifestacaoId = Number(req.params.id);
  const userId = req.user?.User_ID;
  const resposta = req.body;

  if (!resposta) {
    res.status(400).json({ error: 'Resposta é obrigatória.' });
    return;
  }

  if (!userId) {
    res.status(401).json({ error: 'Usuário não autenticado.' });
    return;
  }

  connection.query(
    "UPDATE Manifestacoes SET Resposta = ? WHERE Manifestacao_ID = ?",
    [resposta, manifestacaoId],
    (err, results: ResultSetHeader) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao responder manifestação: ${err.message}`,
        });
        return;
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: "Manifestação não encontrada",
        });
      }

      registrarLog("Manifestação respondida", userId);

      res.status(200).json({
        message: `Resposta enviada para manifestação ${manifestacaoId}`,
        data: {
          id: manifestacaoId,
          resposta,
        },
      });
      return;
    }
  );
};