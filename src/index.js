/* eslint-disable no-console */
import express from 'express';

const app = express();

app.listen(3000, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Server running on port 3000');
  }
});
