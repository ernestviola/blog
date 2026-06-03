import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import { authJWT } from '../libs/passport.js';

const commentRouter = Router({ mergeParams: true });

commentRouter.get('/', commentController.getAll);
commentRouter.post('/', commentController.post);
commentRouter.put('/:commentId', authJWT, commentController.put);
commentRouter.delete('/:commentId', authJWT, commentController.delete);
commentRouter.post('/:commentId/like', commentController.like);

export default commentRouter;
