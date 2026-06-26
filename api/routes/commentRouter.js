import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import { authJWT, authJWTUsernameOnly } from '../libs/passport.js';
import commentLikeController from '../controllers/commentLikeController.js';

const commentRouter = Router({ mergeParams: true });

commentRouter.get('/', commentController.getAll);
commentRouter.post('/', authJWTUsernameOnly, commentController.post);
commentRouter.put('/:commentId', authJWTUsernameOnly, commentController.put);
commentRouter.delete(
  '/:commentId',
  authJWTUsernameOnly,
  commentController.delete,
);
commentRouter.post(
  '/:commentId/like',
  authJWTUsernameOnly,
  commentLikeController.post,
);
commentRouter.delete(
  '/:commentId/like',
  authJWTUsernameOnly,
  commentLikeController.delete,
);

export default commentRouter;
