import { Router } from 'express';
import blogController from '../controllers/blogController.js';
import { authJWT } from '../libs/passport.js';

const blogRouter = Router();

blogRouter.get('/', blogController.getAll);
blogRouter.get('/:id', blogController.getSingle);
blogRouter.post('/:id', authJWT, blogController.post);
blogRouter.put('/:id', authJWT, blogController.put);
blogRouter.delete('/:id', authJWT, blogController.delete);

export default blogRouter;
