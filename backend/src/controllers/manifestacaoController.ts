import { Request, Response } from "express";
import connection from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { registrarLog } from "../../src/utils/logger";

export const getManifestacoesDoUsuario = (req: Request, res: Response) => {
  const userId = req.user?.User_ID;

  connection.query(
    "SELECT Manifestacao_ID, Data_Envio, Titulo, Descricao, Tipo, Tipo_manifestacao, Anonimo, Local, Status, Prioridade, User_ID FROM Manifestacoes WHERE Real_User_ID = ?",
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
    "SELECT Manifestacao_ID, Data_Envio, Titulo, Descricao, Tipo, Tipo_manifestacao, Anonimo, Local, Status, Prioridade, User_ID FROM Manifestacoes WHERE Manifestacao_ID = ?",
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
  const role = req.user?.role;
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

  connection.query(
    "SELECT Real_User_ID, Anonimo FROM Manifestacoes WHERE Manifestacao_ID = ?",
    [manifestacaoId],
    (err, mfResults: RowDataPacket[]) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao buscar manifestação: ${err.message}`,
        });
        return;
      }
      if (mfResults.length === 0) {
        res.status(404).json({
          success: false,
          error: "Manifestação não encontrada",
        });
        return;
      }

      const { Real_User_ID, Anonimo } = mfResults[0];
      const isDono = Real_User_ID === userId;
      const isAdmin = role === "admin";

      if (!isDono && !isAdmin) {
        res.status(403).json({
          success: false,
          error:
            "O usuário autenticado não tem permissão para responder esta manifestação",
        });
        return;
      }

      const ID_ANONIMO = 1;
      if (isDono && Anonimo) {
        resposta.User_ID = ID_ANONIMO;
      } else {
        resposta.User_ID = userId;
      }

      connection.query(
        "INSERT INTO Respostas (Manifestacao_ID, User_ID, Descricao) VALUES (?, ?, ?)",
        [
          resposta.Manifestacao_ID,
          resposta.User_ID,
          resposta.Descricao,
        ],
        (err, insertResult: ResultSetHeader) => {
          if (err) {
            res.status(500).json({
              success: false,
              error: `Erro ao responder manifestação: ${err.message}`,
            });
            return;
          }

          const novaRespostaId = insertResult.insertId;
          connection.query(
            `SELECT 
               Resposta_ID, 
               Manifestacao_ID, 
               User_ID, 
               Descricao, 
               Data_Criacao 
             FROM Respostas 
             WHERE Resposta_ID = ?`,
            [novaRespostaId],
            (err2, respSelect: RowDataPacket[]) => {
              if (err2) {
                res.status(500).json({
                  success: false,
                  error: `Erro ao buscar resposta criada: ${err2.message}`,
                });
                return;
              }
              if (respSelect.length === 0) {
                res.status(404).json({
                  success: false,
                  error: "Resposta não encontrada após inserção",
                });
                return;
              }
              
              const respostaCriada = respSelect[0];
              return res.status(200).json({
                success: true,
                data: {
                  Resposta_ID: respostaCriada.Resposta_ID,
                  Manifestacao_ID: respostaCriada.Manifestacao_ID,
                  User_ID: respostaCriada.User_ID,
                  Descricao: respostaCriada.Descricao,
                  Data_Criacao: respostaCriada.Data_Criacao,
                },
              });
            }
          );
        }
      );
    }
  );
};

export const getMinhaManifestacao = (req: Request, res: Response) => {
  const userId = req.user?.User_ID;
  const manifestacaoId = req.params.id;

  connection.query(
    "SELECT Manifestacao_ID, Data_Envio, Titulo, Descricao, Tipo, Tipo_manifestacao, Anonimo, Local, Status, Prioridade, User_ID FROM Manifestacoes WHERE Real_User_ID = ? AND Manifestacao_ID = ?",
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

export const getRespostasManifestacao = (req: Request, res: Response) => {
  const userId = req.user?.User_ID;
  const role = req.user?.role;
  const manifestacaoId = req.params.id;

  connection.query(
    "SELECT Real_User_ID FROM Manifestacoes WHERE Manifestacao_ID = ?",
    [manifestacaoId],
    (err, manifestacaoResults: RowDataPacket[]) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao buscar manifestação: ${err.message}`,
        });
        return;
      }

      if (manifestacaoResults.length === 0) {
        res.status(404).json({
          success: false,
          error: "Manifestação não encontrada",
        });
        return;
      }

      const { Real_User_ID } = manifestacaoResults[0];

      if (userId !== Real_User_ID && role !== "admin") {
        res.status(403).json({
          success: false,
          error: "Você não tem permissão para visualizar essas respostas.",
        });
        return;
      }

      connection.query(
        "SELECT * FROM Respostas WHERE Manifestacao_ID = ?",
        [manifestacaoId],
        (err, respostasResults: RowDataPacket[]) => {
          if (err) {
            res.status(500).json({
              success: false,
              error: `Erro ao buscar respostas: ${err.message}`,
            });
            return;
          }

          if (respostasResults.length === 0) {
            res.status(404).json({
              success: false,
              error: "Nenhuma resposta encontrada",
            });
            return;
          }

          res.status(200).json({ success: true, data: respostasResults });
        }
      );
    }
  );
};

export const getRespostasManifestacaoDoUsuario = (
  req: Request,
  res: Response
) => {
  const userId = req.user?.User_ID;
  const role = req.user?.role;
  const manifestacaoId = req.params.id;

  connection.query(
    "SELECT Real_User_ID FROM Manifestacoes WHERE Manifestacao_ID = ? AND Real_User_ID = ?",
    [manifestacaoId, userId],
    (err, manifestacaoResults: RowDataPacket[]) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: `Erro ao buscar manifestação: ${err.message}`,
        });
        return;
      }

      if (manifestacaoResults.length === 0) {
        res.status(404).json({
          success: false,
          error: "Manifestação não encontrada",
        });
        return;
      }

      const { Real_User_ID } = manifestacaoResults[0];

      if (userId !== Real_User_ID && role !== "admin") {
        res.status(403).json({
          success: false,
          error: "Você não tem permissão para visualizar essas respostas.",
        });
        return;
      }

      connection.query(
        "SELECT * FROM Respostas WHERE Manifestacao_ID = ?",
        [manifestacaoId],
        (err, respostasResults: RowDataPacket[]) => {
          if (err) {
            res.status(500).json({
              success: false,
              error: `Erro ao buscar respostas: ${err.message}`,
            });
            return;
          }

          if (respostasResults.length === 0) {
            res.status(404).json({
              success: false,
              error: "Nenhuma resposta encontrada",
            });
            return;
          }

          res.status(200).json({ success: true, data: respostasResults });
        }
      );
    }
  );
};

export const deleteManifestacao = async (req: Request, res: Response) => {
  const userId = Number(req.user?.User_ID);
  const manifestacaoId = Number(req.params.id);

  await connection
    .promise()
    .query<ResultSetHeader>("DELETE FROM Respostas WHERE Manifestacao_ID = ?", [
      manifestacaoId,
    ]);

  let manifestacaoTitulo: string | undefined;
  try {
    const [rows] = await connection
      .promise()
      .query<RowDataPacket[]>(
        "SELECT Titulo FROM Manifestacoes WHERE Manifestacao_ID = ?",
        [manifestacaoId]
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
        "DELETE FROM Manifestacoes WHERE Manifestacao_ID = ?",
        [manifestacaoId]
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

export const atualizarStatusManifestacao = (
  req: Request,
  res: Response
): void => {
  const id = Number(req.params.id);
  const novoStatus = req.body.Status;

  connection.query<ResultSetHeader>(
    "UPDATE Manifestacoes SET Status = ? WHERE Manifestacao_ID = ?",
    [novoStatus, id],
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

export const enviarManifestacao = (req: Request, res: Response) => {
  const userId = req.user?.User_ID;
  const manifestacao = req.body;

  if (manifestacao.Anonimo) {
    manifestacao.User_ID = 1;
    manifestacao.Real_User_ID = userId;
  } else {
    manifestacao.User_ID = userId;
    manifestacao.Real_User_ID = userId;
  }

  if (manifestacao.Tipo_manifestacao === "elogio") {
    manifestacao.Status = "concluido";
    manifestacao.Prioridade = "baixa";
  } else if (manifestacao.Tipo_manifestacao === "sugestao") {
    manifestacao.Status = "pendente";
    manifestacao.Prioridade = "media";
  } else if (manifestacao.Tipo_manifestacao === "reclamacao") {
    manifestacao.Status = "pendente";
    manifestacao.Prioridade = "alta";
  } else if (manifestacao.Tipo_manifestacao === "denuncia") {
    manifestacao.Status = "pendente";
    manifestacao.Prioridade = "urgente";
  }

  connection.query(
    "INSERT INTO Manifestacoes ?",
    [manifestacao],
    (err, results: RowDataPacket[]) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: `Erro ao enviar a manifestação: ${err.message}`,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Erro ao enviar a manifestação",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Manifestação enviada com sucesso",
        data: results[0],
      });
    }
  );
};
