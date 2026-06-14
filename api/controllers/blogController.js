import { body, validationResult, matchedData } from 'express-validator';

import { prisma } from '../libs/prisma.js';

const blogController = {};
const blogValidation = [
  body('title').trim().notEmpty(),
  body('body').trim().notEmpty(),
  body('published').isBoolean(),
];

const putBlogValidation = [
  body('title').trim().notEmpty().optional(),
  body('body').trim().notEmpty().optional(),
];

blogController.getAll = async (req, res, next) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        user: {
          select: { username: { select: { username: true } } },
        },
      },
    });

    if (!blogs.length) {
      return res.status(404).json({ message: 'Not found.' });
    }

    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    next(error);
  }
};

blogController.getSingle = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.update({
      where: {
        id: id,
      },
      include: {
        user: {
          select: { username: { select: { username: true } } },
        },
      },
      data: {
        views: { increment: 1 },
      },
    });

    if (!blog) {
      return res.status(404).json({ message: 'Not found.' });
    }

    return res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

blogController.post = [
  blogValidation,
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
      const blog = await prisma.blog.create({
        data: { userId: req.user.id, ...data },
      });

      return res.status(200).json({ success: true, blog });
    } catch (error) {
      next(error);
    }
  },
];

blogController.put = [
  putBlogValidation,
  async (req, res, next) => {
    const { id } = req.params;
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
      const blog = await prisma.blog.update({
        where: {
          id: id,
          userId: req.user.id,
        },
        data: { ...data },
      });

      if (!blog) return res.status(404).json({ message: 'Not found.' });

      return res.status(200).json({ success: true, blog });
    } catch (error) {
      next(error);
    }
  },
];

blogController.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.delete({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!blog) return res.status('404').json({ message: 'Not found.' });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

blogController.like = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.update({
      where: {
        id: id,
      },
      data: { likes: { increment: 1 } },
    });

    return res.status(200).json({ success: true, likes: blog.likes });
  } catch (error) {
    next(error);
  }
};

export default blogController;
