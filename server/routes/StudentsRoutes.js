import express from "express";
import { getStudents, addStudent, updateStudent, deleteStudent } from "../controllers/StudentsController.js";

const StudentsRoutes = express.Router();

StudentsRoutes.get("/students", getStudents);
StudentsRoutes.post("/students", addStudent);
StudentsRoutes.put("/students/:id", updateStudent);
StudentsRoutes.delete("/students/:id", deleteStudent);

export default StudentsRoutes;