import express from "express";
import { getFaculty, addFaculty, createFacultativeGroup } from "../controllers/FacultyController.js";

const FacultyRoutes = express.Router();

FacultyRoutes.get("/faculty", getFaculty);
FacultyRoutes.post("/faculty", addFaculty);
FacultyRoutes.post("/faculty/group", createFacultativeGroup);

export default FacultyRoutes;