import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as meController from '../controllers/meController';
import * as authController from '../controllers/authController';
import * as logController from '../controllers/logController';
import {verifyToken, verifyRole} from '../middlewares/auth';

const router = Router();

// rotas de autenticação
router.post('/auth/registrar', authController.registrar);
router.post('/auth/login', authController.login);
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso. O token deve removido do localStorage no frontend.',
  });
});
router.get('/auth/role/:id', verifyToken, verifyRole((['admin'])), authController.getRoleById);
router.put('/auth/role/:id', verifyToken, verifyRole((['admin'])), authController.updateRole);
router.get('/confirmar', authController.confirmarEmail);
router.post('/confirmar/recuperar', authController.confirmarRecuperacao);
router.post('/recuperar', authController.recuperarSenha);
router.get("/auth/senha", verifyToken, authController.checkPrecisaTrocarSenha);
router.post("/auth/nova-senha", verifyToken, authController.trocarSenha);

// rotas para usuário atual
router.get('/me', verifyToken, meController.getUsuarioAtual);
router.put('/me', verifyToken, meController.updateUsuarioAtual);
router.get('/me/endereco', verifyToken, meController.getEnderecoUsuarioAtual);
router.put('/me/endereco', verifyToken, meController.updateEnderecoUsuarioAtual);
router.put('/me/avatar', verifyToken, meController.updateAvatar);

// rotas para usuários
router.get('/users', verifyToken, verifyRole((['admin', 'moderador'])), userController.listUsers);
router.post('/users', verifyToken, verifyRole((['admin'])), userController.registrarUsuario);
router.get('/users/:id', verifyToken, verifyRole((['admin', 'moderador'])), userController.getUserById);
router.put('/users/:id', verifyToken, verifyRole((['admin', 'moderador'])), userController.updateUser);
router.get('/users/:id/endereco', verifyToken, verifyRole((['admin', 'moderador'])), userController.getEnderecoByUserId);
router.put('/users/:id/endereco', verifyToken, verifyRole((['admin'])), userController.updateEnderecoByUserId);
router.delete('/users/:User_ID', verifyToken, verifyRole((['admin'])), userController.deleteUser);
router.get('/users/avatar/:id', verifyToken, userController.getAvatar);

// rotas de logs
router.get('/logs', verifyToken, verifyRole((['admin'])), logController.getLogs);

export default router;