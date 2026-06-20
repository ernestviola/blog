import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import { authJWT, authJWTUsernameOnly } from '../libs/passport.js';

const commentRouter = Router({ mergeParams: true });

commentRouter.get('/', commentController.getAll);
commentRouter.post('/', authJWTUsernameOnly, commentController.post);
commentRouter.put('/:commentId', authJWT, commentController.put);
commentRouter.delete('/:commentId', authJWT, commentController.delete);
commentRouter.post(
  '/:commentId/like',
  authJWTUsernameOnly,
  commentController.like,
);

export default commentRouter;
