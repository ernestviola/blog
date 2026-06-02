import express from 'express';

const PORT = process.env.PORT || 3000;

const app = express();

app.listen(PORT, (err) => {
  if (err) throw new Error('Trouble starting the app.');

  console.log(`App listening at port ${PORT}`);
});
