import { prisma } from '../libs/prisma.js';

const blogLikeController = {};

blogLikeController.post = async (req, res, next) => {
  // get the blogId
  const { blogId } = req.params;
  const { usernameId } = req.user;

  try {
    await prisma.blogLike.create({
      data: {
        blogId,
        usernameId,
      },
    });

    const { _count } = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { _count: { select: { blogLikes: true } } },
    });

    return res.status(200).json({ success: true, count: _count.blogLikes });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Already liked.' });
    }
    next(error);
  }
};

blogLikeController.delete = async (req, res, next) => {
  const { blogId } = req.params;
  const { usernameId } = req.user;

  try {
    await prisma.blogLike.delete({
      where: {
        blogId_usernameId: {
          blogId,
          usernameId,
        },
      },
    });

    const { _count } = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { _count: { select: { blogLikes: true } } },
    });

    return res.status(200).json({ success: true, count: _count.blogLikes });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Like not found.' });
    }
    next(error);
  }
};

export default blogLikeController;
