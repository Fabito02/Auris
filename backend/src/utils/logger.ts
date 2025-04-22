import connection from "../db";

export const registrarLog = async (acao: string, user_id: number | null): Promise<void> => {
  try {
    connection.query(
      "INSERT INTO Logs (Acao, User_ID) VALUES (?, ?)",
      [acao, user_id]
    );
    console.log("Log registrado:", acao, `User_ID: ${user_id}`);
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
};