import { Router } from "express";
import * as userController from "../controllers/userController";
import * as manifestacaoController from "../controllers/manifestacaoController";
import * as meController from "../controllers/meController";
import * as authController from "../controllers/authController";
import * as logController from "../controllers/logController";
import { verifyToken, verifyRole } from "../middlewares/auth";

const router = Router();

// rotas de autenticação
router.post("/auth/registrar", authController.registrar);
router.post("/auth/login", authController.login);
router.post("/logout", (req, res) => {
  res.clearCookie("AurisToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout realizado com sucesso. Cookie removido do navegador.",
  });
  return 
});

router.get(
  "/auth/role/:id",
  verifyToken,
  verifyRole(["admin"]),
  authController.getRoleById
);
router.put(
  "/auth/role/:id",
  verifyToken,
  verifyRole(["admin"]),
  authController.updateRole
);
router.get("/confirmar", authController.confirmarEmail);
router.post("/confirmar/recuperar", authController.confirmarRecuperacao);
router.post("/recuperar", authController.recuperarSenha);
router.get("/auth/senha", verifyToken, authController.checkPrecisaTrocarSenha);
router.post("/auth/nova-senha", verifyToken, authController.trocarSenha);

// rotas para usuário atual
router.get("/me", verifyToken, meController.getUsuarioAtual);
router.put("/me", verifyToken, meController.updateUsuarioAtual);
router.get("/me/endereco", verifyToken, meController.getEnderecoUsuarioAtual);
router.put(
  "/me/endereco",
  verifyToken,
  meController.updateEnderecoUsuarioAtual
);
router.put("/me/avatar", verifyToken, meController.updateAvatar);
router.get("/me/role", verifyToken, meController.getRoleUsuarioAtual);
router.delete(
  "/me/notificacao/:Notificacao_ID",
  verifyToken,
  meController.deleteNotificacao
);
router.get(
  "/me/notificacao/:id",
  verifyToken,
  meController.getNotificacaoPorIDdeUsuario
);
router.get(
  "/me/notificacao",
  verifyToken,
  meController.getNotificacoesDoUsuario
);

// rotas para usuários
router.get(
  "/users",
  verifyToken,
  verifyRole(["admin", "moderador"]),
  userController.listUsers
);
router.post(
  "/users",
  verifyToken,
  verifyRole(["admin"]),
  authController.registrarUsuario
);
router.get(
  "/users/:id",
  verifyToken,
  verifyRole(["admin", "moderador"]),
  userController.getUserById
);
router.put(
  "/users/:id",
  verifyToken,
  verifyRole(["admin"]),
  userController.updateUser
);
router.get(
  "/users/:id/endereco",
  verifyToken,
  verifyRole(["admin", "moderador"]),
  userController.getEnderecoByUserId
);
router.put(
  "/users/:id/endereco",
  verifyToken,
  verifyRole(["admin"]),
  userController.updateEnderecoByUserId
);
router.delete(
  "/users/:User_ID",
  verifyToken,
  verifyRole(["admin"]),
  userController.deleteUser
);
router.get("/users/avatar/:id", verifyToken, userController.getAvatar);
router.post("/users/notificacao", verifyToken, userController.postEnviarNotificacao);

// rotas para manifestações
router.get("/me/manifestacoes", verifyToken, manifestacaoController.getManifestacoesDoUsuario);
router.get("/manifestacoes", verifyToken, verifyRole(["admin", "moderador"]), manifestacaoController.getManifestacoes);
router.get("/manifestacoes/:id", verifyToken, verifyRole(["admin", "moderador"]), manifestacaoController.getManifestacaoPorId);
router.get("/me/manifestacoes/:id", verifyToken, manifestacaoController.getMinhaManifestacao);
router.get("/manifestacoes/:id/respostas", verifyToken, verifyRole(["admin", "moderador"]), manifestacaoController.getRespostasManifestacao);

// rotas de logs
router.get("/logs", verifyToken, verifyRole(["admin"]), logController.getLogs);

export default router;