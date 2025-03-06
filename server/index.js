import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import StudentsRoutes from "./routes/StudentsRoutes.js";
import TeachersRoutes from "./routes/TeachersRoutes.js";
import FacultyRoutes from "./routes/FacultyRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8747;

app.use(express.json());
app.use('/api', StudentsRoutes);
app.use('/api', TeachersRoutes);
app.use('/api', FacultyRoutes);
app.use('/api', AuthRoutes);

app.use(express.static(path.join(__dirname, '../client/dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});