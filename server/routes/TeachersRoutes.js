import express from "express";
import { getTeachers, addTeacher } from "../controllers/TeachersController.js";

const TeachersRoutes = express.Router();

TeachersRoutes.get("/teachers", getTeachers);
TeachersRoutes.post("/teachers", addTeacher);

export default TeachersRoutes;