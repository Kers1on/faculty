import express from "express";
import { getStudents } from "../controllers/StudentsController.js";

const StudentsRoutes = express.Router();

// Add POST requests
StudentsRoutes.get("/students", getStudents);

export default StudentsRoutes;