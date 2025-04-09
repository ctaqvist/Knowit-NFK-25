const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname)));

app.listen(8000, () => {
  console.log('HTTP server running at http://localhost:8000');
});