import express from "express";
import { getFaculty, addFaculty, createFacultativeGroup, updateLabResult, deleteFacultativeGroup } from "../controllers/FacultyController.js";

const FacultyRoutes = express.Router();

FacultyRoutes.get("/faculty", getFaculty);
FacultyRoutes.post("/faculty", addFaculty);

FacultyRoutes.post("/faculty/group", createFacultativeGroup);
FacultyRoutes.put("/faculty/group/:id/:column", updateLabResult);
FacultyRoutes.delete("/faculty/group", deleteFacultativeGroup);

export default FacultyRoutes;