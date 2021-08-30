const express = require('express');
const postRouter = require('./routes/post');

const app = express();
const port = 3000;

app.use(express.json());
app.use(postRouter);

app.listen(port, () => {
  console.log('server running on port', port);
});