import express from "express";
import { getStudents, addStudent, updateStudent, deleteStudent } from "../controllers/StudentsController.js";
import authenticateToken from "../middlewares/AuthMiddleware.js";

const StudentsRoutes = express.Router();

StudentsRoutes.use(authenticateToken);

StudentsRoutes.get("/students", getStudents);
StudentsRoutes.post("/students", addStudent);
StudentsRoutes.put("/students/:id", updateStudent);
StudentsRoutes.delete("/students/:id", deleteStudent);

export default StudentsRoutes;