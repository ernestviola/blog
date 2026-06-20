import { body, validationResult, matchedData } from 'express-validator';

import bcrypt from 'bcryptjs';
import { prisma } from '../libs/prisma.js';
import jwt from 'jsonwebtoken';

const newUserValidation = [
  body('email').trim().isEmail().withMessage('Must be a valid email.'),
  body('username')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Must choose a username between 1 and 100 characters long.'),
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
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match.');
    }
    return value === req.body.password;
  }),
];

const loginValidation = [
  body('username').notEmpty(),
  body('password').notEmpty(),
];

const usernameValidation = [
  body('username')
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Must choose a username between 1 and 100 characters long.'),
];

const authController = {};

/**
 * statuses
 * 201: successful signup
 * 400: field errors
 * 409: username or email in use
 */
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
    const { email, username, password } = matchedData(req);
    // store
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hash,
          username: {
            create: { username },
          },
        },
        include: {
          username: true,
        },
      });

      // return Authorization
      const token = jwt.sign(
        {
          sub: user.id,
          username: user.username.username,
          usernameId: user.username.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '2 days',
        },
      );

      return res.status(201).json({ token });
    } catch (error) {
      if (error.code === 'P2002') {
        const emailInUse = await prisma.user.findFirst({ where: { email } });
        const usernameInUse = await prisma.username.findFirst({
          where: { username },
        });

        const fieldErrors = {};

        if (emailInUse) {
          fieldErrors['email'] = 'Email is already in use.';
        }

        if (usernameInUse) {
          fieldErrors['username'] = 'Username is already in use.';
        }
        return res.status(409).json({ fieldErrors });
      }

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

    const { username, password } = matchedData(req);

    /**
     * user logs in with a username or password
     * check to see if username is actually an email
     *
     *  if email then try the email route of checking if the email exists
     *
     *  if username check if username exists and is attached to a user
     */

    try {
      let user;
      if (username.includes('@')) {
        // is an email, try email.
        user = await prisma.user.findFirst({
          include: {
            username: true,
          },
          where: {
            email: username,
          },
        });
      } else {
        // try username
        user = await prisma.user.findFirst({
          include: {
            username: true,
          },
          where: {
            username: { username },
          },
        });
      }

      if (!user) {
        return res.status(401).json({
          fieldErrors: {
            username: 'Incorrect username.',
            password: 'Incorrect password.',
          },
        });
      }

      console.log(user);

      // check if password is correct
      const matchedUserPassword = await bcrypt.compare(password, user.password);
      if (!matchedUserPassword) {
        return res.status(401).json({
          fieldErrors: {
            username: 'Incorrect username.',
            password: 'Incorrect password.',
          },
        });
      }

      // return JWT
      const token = jwt.sign(
        {
          sub: user.id,
          username: user.username.username,
          usernameId: user.username.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '2 days',
        },
      );

      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  },
];

authController.createUsername = [
  usernameValidation,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const fieldErrors = {};
      errors.array().forEach((error) => {
        fieldErrors[error.path] = error.msg;
      });
      return res.status(400).json({ fieldErrors });
    }
    const { username } = matchedData(req);

    try {
      const user = await prisma.username.create({
        data: {
          username: username,
        },
        select: {
          username: true,
          id: true,
        },
      });

      // return Authorization
      const token = jwt.sign(
        {
          username: user.username,
          usernameId: user.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '2 days',
        },
      );

      return res.status(201).json({ token });
    } catch (error) {
      if (error.code === 'P2002') {
        const usernameInUse = await prisma.username.findFirst({
          where: { username },
        });

        const fieldErrors = {};

        if (usernameInUse) {
          fieldErrors['username'] = 'Username is already in use.';
        }
        return res.status(409).json({ fieldErrors });
      }

      next(error);
    }
  },
];

export default authController;
