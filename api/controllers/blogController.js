import { body, query, validationResult, matchedData } from 'express-validator';

import { prisma } from '../libs/prisma.js';

const blogController = {};
const blogValidation = [
  body('title').trim().optional(),
  body('body').trim().optional(),
  body('published').isBoolean().optional(),
];

const putBlogValidation = [
  body('title').trim().optional(),
  body('body').trim().optional(),
  body('published').isBoolean().optional(),
];

const searchParams = [
  query('title').trim().optional(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
  query('sort').optional(),
  query('order').optional(),
];

blogController.getAll = [
  searchParams,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const fieldErrors = {};
        errors.array().forEach((error) => {
          fieldErrors[error.path] = error.msg;
        });
        return res.status(400).json({ fieldErrors });
      }

      const {
        title,
        page = 1,
        limit = 10,
        sort = 'added',
        order = 'desc',
      } = matchedData(req);

      const where = req.user
        ? {
            OR: [{ published: true }, { userId: req.user.id }],
            title: {
              contains: title,
              mode: 'insensitive',
            },
          }
        : {
            published: true,
          };

      const include = {
        user: {
          select: { username: { select: { username: true } } },
        },
      };

      const orderBy = {
        [sort]: order,
      };

      const skip = (page - 1) * limit;

      const blogs = await prisma.blog.findMany({
        include,
        where,
        orderBy,
        skip,
        take: limit,
      });

      if (!blogs.length) {
        return res.status(404).json({ message: 'Not found.' });
      }

      return res.status(200).json({ success: true, blogs, page });
    } catch (error) {
      next(error);
    }
  },
];

blogController.getSingle = async (req, res, next) => {
  const { id } = req.params;
  try {
    let blog;
    const where = req.user
      ? {
          id: id,
          OR: [{ published: true }, { userId: req.user.id }],
        }
      : {
          id: id,
          published: true,
        };

    const include = req.user
      ? {
          user: {
            select: { username: { select: { username: true } } },
          },
          _count: { select: { blogLikes: true } },
          blogLikes: { where: { usernameId: req.user.usernameId } },
        }
      : {
          user: {
            select: { username: { select: { username: true } } },
          },
          _count: { select: { blogLikes: true } },
        };

    blog = await prisma.blog.update({
      where,
      include,
      data: {
        views: { increment: 1 },
      },
    });

    blog.likedByUser = blog.blogLikes?.length > 0;

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
