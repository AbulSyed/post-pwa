const express = require('express');
const postRouter = require('./routes/post');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(postRouter);

app.listen(port, () => {
  console.log('server running on port', port);
});