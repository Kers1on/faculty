import express from "express";
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from "../controllers/TeachersController.js";

const TeachersRoutes = express.Router();

TeachersRoutes.get("/teachers", getTeachers);
TeachersRoutes.post("/teachers", addTeacher);
TeachersRoutes.put("/teachers/:id", updateTeacher);
TeachersRoutes.delete("/teachers/:id", deleteTeacher);

export default TeachersRoutes;