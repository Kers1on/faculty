import express from "express";
import { getFaculty } from "../controllers/FacultyController.js";

const FacultyRoutes = express.Router();

// Add POST requests
FacultyRoutes.get("/faculty", getFaculty);

export default FacultyRoutes;