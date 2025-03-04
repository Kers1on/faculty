import express from "express";
import { getStudents, addStudent } from "../controllers/StudentsController.js";

const StudentsRoutes = express.Router();

StudentsRoutes.get("/students", getStudents);
StudentsRoutes.post("/students", addStudent);

export default StudentsRoutes;