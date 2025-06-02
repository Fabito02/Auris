import { Request, Response } from "express";
import connection from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { registrarLog } from "../../src/utils/logger";

export const getManifestacoesDoUsuario = (req: Request, res: Response) => {
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

export const getManifestacoes = (req: Request, res: Response) => {
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

export const responderManifestacao = (req: Request, res: Response) => {
  const manifestacaoId = Number(req.params.id);
  const userId = req.user?.User_ID;
  const resposta = req.body;

  if (!resposta) {
    res.status(400).json({ error: "Resposta é obrigatória." });
    return;
  }

  if (!userId) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  resposta.Manifestacao_ID = manifestacaoId;
  resposta.User_ID = userId;

  connection.query(
    "INSERT INTO Respostas SET ?",
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
        res.status(404).json({
          success: false,
          error: "Manifestação não encontrada",
        });
        return;
      }

      registrarLog("Manifestação respondida", userId);

      res.status(200).json({
        message: `Resposta enviada para a manifestação de ID ${manifestacaoId}`,
        data: {
          id: results.insertId,
          resposta,
        },
      });
      return;
    }
  );
};

export const atualizarResposta = (req: Request, res: Response) => {
  const manifestacaoId = Number(req.params.id);
  const userId = req.user?.User_ID;
  const respostaId = Number(req.params.respostaId);
  const resposta = req.body;

  if (!resposta) {
    res.status(400).json({ error: "Resposta é obrigatória." });
    return;
  }

  if (!userId) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  connection.query(
    "UPDATE Respostas SET Descricao = ? WHERE Resposta_ID = ? AND Manifestacao_ID = ? AND User_ID = ?",
    [resposta.Descricao, respostaId, manifestacaoId, userId],
    (err, results: ResultSetHeader) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao responder manifestação: ${err.message}`,
        });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).json({
          success: false,
          error: "Manifestação não encontrada",
        });
        return;
      }

      registrarLog("Resposta atualizada", userId);

      res.status(200).json({
        message: `Resposta atualizada para a manifestação de ID ${manifestacaoId}`,
        data: {
          id: respostaId,
          resposta,
        },
      });
      return;
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
          data: results[0],
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

  export const getRespostasManifestacaoDoUsuario = (
    req: Request,
    res: Response
  ) => {
    const userId = req.user?.User_ID
    const manifestacaoId = req.params.id

    connection.query(
      "SELECT * FROM  Respostas WHERE Manifestacao_ID = ? AND User_ID = ?",
      [manifestacaoId, userId],
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

export const deleteManifestacaoDoUsuario = async (
  req: Request,
  res: Response
) => {
  const userId = Number(req.user?.User_ID);
  const manifestacaoId = Number(req.params.id);

  await connection
    .promise()
    .query<ResultSetHeader>(
      "DELETE FROM Respostas WHERE Manifestacao_ID = ? AND User_ID = ?",
      [manifestacaoId, userId]
    );

  await connection
    .promise()
    .query<ResultSetHeader>(
      "DELETE FROM Respostas WHERE Manifestacao_ID = ? AND User_ID = ?",
      [manifestacaoId, userId]
    );

  let manifestacaoTitulo: string | undefined;
  try {
    const [rows] = await connection
      .promise()
      .query<RowDataPacket[]>(
        "SELECT Titulo FROM Manifestacoes WHERE Manifestacao_ID = ? AND User_ID = ?",
        [manifestacaoId, userId]
      );
    if (Array.isArray(rows) && rows.length > 0) {
      manifestacaoTitulo = rows[0].Titulo;
    }
  } catch (err) {
    manifestacaoTitulo = undefined;
  }
  try {
    const [results] = await connection
      .promise()
      .query<ResultSetHeader>(
        "DELETE FROM Manifestacoes WHERE Manifestacao_ID = ? AND User_ID = ?",
        [manifestacaoId, userId]
      );

    if (results.affectedRows === 0) {
      res.status(404).json({
        success: false,
        error: "Nenhuma manifestação encontrada",
      });
      return;
    }

    registrarLog(`Manifestação "${manifestacaoTitulo}" deletada.`, userId);

    res.status(200).json({
      success: true,
      message: "Manifestação deletada com sucesso",
    });
    return;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Erro desconhecido";
    res.status(500).json({
      success: false,
      error: `Erro ao deletar manifestação: ${errorMessage}`,
    });
    return;
  }
};


export const atualizarManifestacao = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const dadosAtualizados = req.body;

  if (!id || isNaN(id)) {
    res.status(400).json({
      success: false,
      error: "ID inválido para manifestação.",
    });
    return;
  }

  connection.query<ResultSetHeader>(
    "UPDATE Manifestacoes SET ? WHERE Manifestacao_ID = ?",
    [dadosAtualizados, id],
    (err, results) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao atualizar manifestação: ${err.message}`,
        });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).json({
          success: false,
          error: "Manifestação não encontrada.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Manifestação atualizada com sucesso.",
      });
    }
  );
};