import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "Auris",
  multipleStatements: true,
};

let connection!: mysql.Connection;

function handleDisconnect() {
  connection = mysql.createConnection(config);

  connection.connect((err) => {
    if (err) {
      console.error("Erro ao conectar no banco de dados:", err.message);
      console.error("Código de erro:", err.code);
      setTimeout(handleDisconnect, 2000);
      return;
    }
    console.log("MySQL conectado com sucesso.");
  });

  connection.on("error", (err: any) => {
    console.error("MySQL error", err.code);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

// inicia o loop de conexão
handleDisconnect();

export default connection;
