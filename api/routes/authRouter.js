import { Router } from 'express';
import authController from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.post('/username', authController.createUsername);

export default authRouter;
