import { body, validationResult, matchedData } from 'express-validator';

import { prisma } from '../libs/prisma.js';

const commentController = {};
const commentValidation = [
  body('body').trim().notEmpty(),
  body('usernameId').trim().notEmpty(),
];

const putcommentValidation = [body('body').trim().notEmpty().optional()];

commentController.getAll = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const comments = await prisma.comment.findMany({
      where: {
        blogId,
      },
      include: {
        username: true,
        _count: {
          select: { commentLikes: true },
        },
      },
      orderBy: [{ commentLikes: { _count: 'desc' } }, { added: 'asc' }],
    });

    return res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

commentController.post = [
  commentValidation,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const fieldErrors = {};
      errors.array().forEach((error) => {
        fieldErrors[error.path] = error.msg;
      });
      return res.status(400).json({ fieldErrors });
    }
    const data = matchedData(req);
    try {
      const { blogId } = req.params;
      const comment = await prisma.comment.create({
        data: { blogId: blogId, ...data },
      });

      return res.status(200).json({ success: true, comment });
    } catch (error) {
      next(error);
    }
  },
];

commentController.put = [
  putcommentValidation,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const fieldErrors = {};
      errors.array().forEach((error) => {
        fieldErrors[error.path] = error.msg;
      });
      return res.status(400).json({ fieldErrors });
    }
    const data = matchedData(req);

    try {
      const { blogId, commentId } = req.params;
      const comment = await prisma.comment.update({
        where: {
          id: commentId,
          userId: req.user.id,
        },
        data: { ...data },
      });

      if (!comment) return res.status(404).json({ message: 'Not found.' });

      return res.status(200).json({ success: true, comment });
    } catch (error) {
      next(error);
    }
  },
];

commentController.delete = async (req, res, next) => {
  try {
    const { blogId, commentId } = req.params;
    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
        userId: req.user.id,
      },
    });

    if (!comment) return res.status('404').json({ message: 'Not found.' });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// model commentLike {
//   id         String   @id @default(uuid())
//   comment    comment  @relation(fields: [commentId], references: [id])
//   commentId  String
//   username   username @relation(fields: [usernameId], references: [id])
//   usernameId String
//   added      DateTime @default(now())

//   @@unique([commentId, usernameId])
// }

commentController.like = async (req, res, next) => {
  const { commentId, usernameId } = req.params;
  try {
    const commentLike = await prisma.commentLike.create({
      data: {
        commentId: commentId,
        usernameId: usernameId,
      },
    });

    const commentLikes = await prisma.commentLike.findMany({
      where: {
        commentId: commentId,
      },
    });

    return res.status(200).json({
      success: true,
      commentId: commentId,
      likes: commentLikes.length,
    });
  } catch (error) {
    next(error);
  }
};

export default commentController;
