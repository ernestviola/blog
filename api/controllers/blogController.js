import { body, validationResult, matchedData, query } from 'express-validator';

import { prisma } from '../libs/prisma.js';

const blogController = {};
const blogValidation = [
  body('title').trim().optional(),
  body('body').trim().optional(),
  body('published').isBoolean().optional(),
];

const searchParams = [query('title').trim().optional()];

const putBlogValidation = [
  body('title').trim().optional(),
  body('body').trim().optional(),
  body('published').isBoolean().optional(),
];

blogController.getAll = [
  searchParams,
  async (req, res, next) => {
    try {
      // check if user is logged in. if true then return their unpublished posts
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const fieldErrors = {};
        errors.array().forEach((error) => {
          fieldErrors[error.path] = error.msg;
        });
        return res.status(400).json({ fieldErrors });
      }

      const { title } = matchedData(req);

      let blogs;
      if (req.user) {
        blogs = await prisma.blog.findMany({
          include: {
            user: {
              select: { username: { select: { username: true } } },
            },
          },
          where: {
            OR: [{ published: true }, { userId: req.user.id }],
            title: {
              contains: title,
              mode: 'insensitive',
            },
          },
        });
      } else {
        // if not only return published posts
        blogs = await prisma.blog.findMany({
          include: {
            user: {
              select: { username: { select: { username: true } } },
            },
          },
          where: {
            published: true,
          },
        });
      }

      if (!blogs.length) {
        return res.status(404).json({ message: 'Not found.' });
      }

      return res.status(200).json({ success: true, blogs });
    } catch (error) {
      next(error);
    }
  },
];
blogController.getSingle = async (req, res, next) => {
  const { id } = req.params;
  try {
    let blog;
    if (req.user) {
      blog = await prisma.blog.update({
        where: {
          id: id,
          OR: [{ published: true }, { userId: req.user.id }],
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
    } else {
      blog = await prisma.blog.update({
        where: {
          id: id,
          published: true,
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
    }

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

export default blogController;
