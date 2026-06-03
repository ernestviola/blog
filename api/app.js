import express from 'express';
import authRouter from './routes/authRouter.js';
import passport from './libs/passport.js';
import blogRouter from './routes/blogRouter.js';

const PORT = process.env.PORT || 3000;

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/', authRouter);
app.use('/blogs', blogRouter);

app.use((error, req, res, next) => {
  console.log(error);
});

app.listen(PORT, (err) => {
  if (err) throw new Error('Trouble starting the app.');
  console.log(`App listening at port ${PORT}`);
});
