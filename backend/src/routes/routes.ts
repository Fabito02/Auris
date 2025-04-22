import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';
import {verifyToken} from '../middlewares/auth';

const router = Router();

// rotas de autenticação
router.post('/auth/registrar', authController.registrar);
router.post('/auth/login', authController.login);
router.post('/logout', (req, res) => {
  res.clearCookie('Auris_Token', {
    httpOnly: true,
    path: '/',
  });
  res.json({ success: true });
});

// rotas para usuário atual
router.get('/me', verifyToken, userController.getUsuarioAtual);

// rotas para usuários
router.get('/users', userController.listUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;