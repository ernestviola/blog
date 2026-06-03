import { body, validationResult, matchedData } from 'express-validator';

import { prisma } from '../libs/prisma.js';

const blogController = {};
const blogValidation = [];

blogController.getAll = async (req, res, next) => {
  try {
    const blogs = await prisma.blog.findMany();

    if (!blogs.length) {
      return res.status(404).json({ message: 'Not found.' });
    }

    return res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

blogController.getSingle = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id,
      },
    });

    if (!blog) {
      return res.status(404).json({ message: 'Not Found.' });
    }

    await prisma.blog.update({
      where: {
        id: blog.id,
      },
      data: {
        views: blog.views + 1,
      },
    });

    return res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

blogController.post = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.create({});
  } catch (error) {}
};

blogController.put = (req, res, next) => {
  const { id } = req.params;
};

blogController.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await prisma.blog.delete({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!blog) return res.status('404').json({ message: 'Not Found' });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export default blogController;
