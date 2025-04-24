import { Router } from 'express';
import * as userController from '../controllers/userController';
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

// rotas para usuário atual
router.get('/me', verifyToken, userController.getUsuarioAtual);

// rotas para usuários
router.get('/users', verifyToken, verifyRole((['admin', 'moderador'])), userController.listUsers);
router.get('/users/:id', verifyToken, verifyRole((['admin', 'moderador'])), userController.getUserById);
router.put('/users/:id', verifyToken, verifyRole((['admin', 'moderador'])), userController.updateUser);
router.delete('/users/:User_ID', verifyToken, verifyRole((['admin'])), userController.deleteUser);

// rotas de logs
router.get('/logs', verifyToken, verifyRole((['admin'])), logController.getLogs);

export default router;