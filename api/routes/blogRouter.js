import { Router } from 'express';
import blogController from '../controllers/blogController.js';
import { authJWT } from '../libs/passport.js';
import commentRouter from './commentRouter.js';

const blogRouter = Router();

blogRouter.get('/', blogController.getAll);
blogRouter.get('/:id', blogController.getSingle);
blogRouter.post('/', authJWT, blogController.post);
blogRouter.put('/:id', authJWT, blogController.put);
blogRouter.delete('/:id', authJWT, blogController.delete);
blogRouter.post('/:id/like', blogController.like);

blogRouter.use('/:blogId/comments', commentRouter);

export default blogRouter;
