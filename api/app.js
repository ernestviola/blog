import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import passport from './libs/passport.js';
import blogRouter from './routes/blogRouter.js';

const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.AUTHOR_CLIENT_URL,
  process.env.READER_CLIENT_URL,
];

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

// Routes
app.use('/api', authRouter);
app.use('/api/blogs', blogRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.status || 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).json({ message });
});

app.listen(PORT, (err) => {
  if (err) throw new Error('Trouble starting the app.');
  console.log(`App listening at port ${PORT}`);
});
