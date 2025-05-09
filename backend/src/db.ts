import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "Auris",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco de dados:", err.message);
    console.error("Código de erro:", err.code);
    console.error(
      "Verifique se o banco de dados está rodando e/ou as credenciais estão corretas."
    );
  }
});

export default connection;
