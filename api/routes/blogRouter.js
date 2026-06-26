import { Router } from 'express';
import blogController from '../controllers/blogController.js';
import blogLikeController from '../controllers/blogLikeController.js';
import {
  authJWT,
  authJWTUsernameOnly,
  optionalAuthJWT,
} from '../libs/passport.js';
import commentRouter from './commentRouter.js';

const blogRouter = Router();

blogRouter.get('/', optionalAuthJWT, blogController.getAll);
blogRouter.get('/:id', optionalAuthJWT, blogController.getSingle);
blogRouter.post('/', authJWT, blogController.post);
blogRouter.put('/:id', authJWT, blogController.put);
blogRouter.delete('/:id', authJWT, blogController.delete);

blogRouter.post('/:id/like', authJWTUsernameOnly, blogLikeController.post);
blogRouter.delete('/:id/like', authJWTUsernameOnly, blogLikeController.delete);

blogRouter.use('/:blogId/comments', commentRouter);

export default blogRouter;
