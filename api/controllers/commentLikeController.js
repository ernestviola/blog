import { prisma } from '../libs/prisma.js';
const commentLikeController = {};

commentLikeController.post = async (req, res, next) => {
  const { commentId } = req.params;
  const { usernameId } = req.user;

  try {
    await prisma.commentLike.create({
      data: {
        usernameId,
        commentId,
      },
    });

    const { _count } = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: { _count: { select: { commentLikes: true } } },
    });

    return res.status(200).json({ success: true, count: _count.blogLikes });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Already liked.' });
    }
    next(error);
  }
};

commentLikeController.delete = async (req, res, next) => {
  const { commentId } = req.params;
  const { usernameId } = req.user;

  try {
    await prisma.commentLike.delete({
      where: {
        commentId_usernameId: {
          commentId,
          usernameId,
        },
      },
    });

    const { _count } = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: { _count: { select: { commentLikes: true } } },
    });

    return res.status(200).json({ success: true, count: _count.blogLikes });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Like not found.' });
    }
    next(error);
  }
};

export default commentLikeController;
