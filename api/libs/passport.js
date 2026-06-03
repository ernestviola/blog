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

export const authJWT = passport.authenticate('jwt', { session: false });

export default passport;
