import express from "express";
import { getFaculty, addFaculty } from "../controllers/FacultyController.js";

const FacultyRoutes = express.Router();

FacultyRoutes.get("/faculty", getFaculty);
FacultyRoutes.post("/faculty", addFaculty);

export default FacultyRoutes;