import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { prisma } from './prisma.js';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  'jwt',
  new JwtStrategy(opts, async (payload, done) => {
    try {
      if (!payload.sub) return done(null, false);
      const user = await prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      done(err);
    }
  }),
);

passport.use(
  'jwt-username-only',
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await prisma.username.findUnique({
        where: {
          id: payload.usernameId,
        },
      });

      if (!user) return done(null, false);

      user.usernameId = user.id;
      // delete user.id;
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);

export const authJWT = passport.authenticate('jwt', { session: false });
export const authJWTUsernameOnly = passport.authenticate('jwt-username-only', {
  session: false,
});

export const optionalAuthJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) req.user = user;
    next();
  })(req, res, next);
};

export const optionalAuthJWTUsernameOnly = (req, res, next) => {
  passport.authenticate(
    'jwt-username-only',
    { session: false },
    (err, user) => {
      if (err) return next(err);
      if (user) req.user = user;
      next();
    },
  )(req, res, next);
};

export const optionalAuthJWTCombined = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.user = user;
      return next();
    }
    // fall back to username-only
    passport.authenticate(
      'jwt-username-only',
      { session: false },
      (err, user) => {
        if (err) return next(err);
        if (user) req.user = user;
        next();
      },
    )(req, res, next);
  })(req, res, next);
};

export default passport;
