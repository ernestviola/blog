import { body, validationResult, matchedData } from 'express-validator';

import bcrypt from 'bcryptjs';
import { prisma } from '../libs/prisma.js';
import jwt from 'jsonwebtoken';

const newUserValidation = [
  body('email').trim().isEmail().withMessage('Must be a valid email.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an upper case.')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lower case.')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number.')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain a special character.'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match.');
    }
    return value === req.body.password;
  }),
];

const loginValidation = [body('email').notEmpty(), body('password').notEmpty()];

const authController = {};

authController.signup = [
  newUserValidation,
  async (req, res, next) => {
    // validate username, password, confirmation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const fieldErrors = {};
      errors.array().forEach((error) => {
        fieldErrors[error.path] = error.msg;
      });
      return res.status(400).json({ fieldErrors });
    }

    // store
    try {
      const { email, password } = matchedData(req);
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hash,
        },
      });

      // return Authorization
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
        expiresIn: '2 days',
      });

      return res.status(201).json({ token });
    } catch (error) {
      if (error.code === 'P2002')
        return res.status(409).json({ message: 'Email is already in use.' });
      next(error);
    }
  },
];

authController.login = [
  loginValidation,
  async (req, res, next) => {
    // validate email pw
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const fieldErrors = {};
      errors.array().forEach((error) => {
        fieldErrors[error.path] = error.msg;
      });
      return res.status(400).json({ fieldErrors });
    }

    const { email, password } = matchedData(req);

    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return res
          .status(401)
          .json({ message: 'Incorrect email or password.' });
      }

      // check if password is correct
      const matchedUserPassword = await bcrypt.compare(password, user.password);
      if (!matchedUserPassword) {
        return res
          .status(401)
          .json({ message: 'Incorrect email or password.' });
      }

      // return JWT
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
        expiresIn: '2 days',
      });

      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  },
];

export default authController;
