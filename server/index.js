import express from "express";
import { db } from "./db";

const app = express();
const port = 8747;

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});