import { Router } from 'express';
import authController from '../controllers/authController.js';
import { optionalAuthJWTUsernameOnly } from '../libs/passport.js';

const authRouter = Router();

authRouter.post('/signup', optionalAuthJWTUsernameOnly, authController.signup);
authRouter.post('/login', authController.login);
authRouter.post('/username', authController.createUsername);

export default authRouter;
