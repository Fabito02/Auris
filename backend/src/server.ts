import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/routes";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { URL_BASE_FRONTEND } from "./config";

dotenv.config();

const app = express();

app.use(cors({
  origin: URL_BASE_FRONTEND,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
