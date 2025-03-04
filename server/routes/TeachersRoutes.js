import express from "express";
import { getTeachers } from "../controllers/TeachersController.js";

const TeachersRoutes = express.Router();

// Add POST requests
TeachersRoutes.get("/teachers", getTeachers);

export default TeachersRoutes;