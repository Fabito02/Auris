import { Request, Response } from "express";
import connection from "../db";
import { RowDataPacket } from "mysql2";

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

  export const getManifestacoes = (
    req: Request,
    res: Response
  ) => {
    connection.query(
      "SELECT * FROM Manifestacoes",
      (err, results: RowDataPacket[]) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: `Erro ao buscar manifestações: ${err.message}`,
          });
        }
        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Nenhuma manifestação encontrada",
          });
        }
        return res.status(200).json({ success: true, data: results });
      }
    );
  };
  
  export const getManifestacaoPorId = (req: Request, res: Response) => {
    const id = Number(req.params.id);
  
    connection.query(
      "SELECT * FROM Manifestacoes WHERE Manifestacao_ID = ?",
      [id],
      (err, results: RowDataPacket[]) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: `Erro ao buscar manifestação: ${err.message}`,
          });
        }
        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Manifestação não encontrada",
          });
        }
        return res.status(200).json({
          success: true,
          data: results[0],
        });
      }
    );
  };

  export const getMinhaManifestacao = (
    req: Request,
    res: Response
  ) => {
    const userId = req.user?.User_ID;
    const manifestacaoId = req.params.id;
  
    connection.query(
      "SELECT * FROM Manifestacoes WHERE User_ID = ? AND Manifestacao_ID = ?",
      [userId, manifestacaoId],
      (err, results: RowDataPacket[]) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: `Erro ao buscar a manifestação: ${err.message}`,
          });
        }
  
        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Manifestação não encontrada",
          });
        }
  
        return res.status(200).json({
          success: true,
          data: results[0], // apenas uma manifestação
        });
      }
    );
  };

  export const getRespostasManifestacao = (
    req: Request,
    res: Response
  ) => {
    const manifestacaoId = req.params.id

    connection.query(
      "SELECT * FROM  Respostas WHERE Manifestacao_ID = ?",
      [manifestacaoId],
      (err, results: RowDataPacket[]) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: `Erro ao buscar manifestações: ${err.message}`,
          });
        }
        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Nenhuma manifestação encontrada",
          });
        }
        return res.status(200).json({ success: true, data: results });
      }
    );
  };
  
  