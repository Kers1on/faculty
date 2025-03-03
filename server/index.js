const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const port = 8747;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});