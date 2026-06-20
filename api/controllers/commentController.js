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
    const { usernameId } = req.query;
    const comments = await prisma.comment.findMany({
      where: {
        blogId,
      },
      include: {
        username: true,
        _count: {
          select: { commentLikes: true },
        },
        commentLikes: usernameId
          ? {
              where: { usernameId },
            }
          : false,
      },
      orderBy: [{ commentLikes: { _count: 'desc' } }, { added: 'asc' }],
    });

    const shaped = comments.map(({ commentLikes, ...rest }) => ({
      ...rest,
      likedByUser: commentLikes.length > 0,
    }));

    return res.status(200).json({ comments: shaped });
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

commentController.like = async (req, res, next) => {
  const { commentId } = req.params;
  const { usernameId } = req.body;
  try {
    // if contains then delete
    const commentLike = await prisma.commentLike.findFirst({
      where: {
        commentId: commentId,
        usernameId: usernameId,
      },
    });
    if (commentLike) {
      await prisma.commentLike.delete({
        where: {
          id: commentLike.id,
        },
      });
    } else {
      await prisma.commentLike.create({
        data: {
          commentId: commentId,
          usernameId: usernameId,
        },
      });
    }

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
      include: {
        username: true,
        _count: {
          select: { commentLikes: true },
        },
        commentLikes: {
          where: { usernameId },
        },
      },
      orderBy: [{ commentLikes: { _count: 'desc' } }, { added: 'asc' }],
    });

    comment.likedByUser = comment.commentLikes.length > 0;
    delete comment.commentLikes;

    return res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

export default commentController;
