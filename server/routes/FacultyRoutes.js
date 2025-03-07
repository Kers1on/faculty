import express from "express";
import { getFaculty,
         addFaculty,
         createFacultativeGroup,
         updateLabResult,
         deleteFacultativeGroup,
         getFacultativeGroup,
         updateFaculty,
         deleteFaculty } from "../controllers/FacultyController.js";
import authenticateToken from "../middlewares/AuthMiddleware.js";

const FacultyRoutes = express.Router();

FacultyRoutes.use(authenticateToken);

FacultyRoutes.get("/faculty", getFaculty);
FacultyRoutes.post("/faculty", addFaculty);
FacultyRoutes.put("/faculty/:id", updateFaculty);
FacultyRoutes.delete("/faculty/:id", deleteFaculty);

FacultyRoutes.get("/faculty/group", getFacultativeGroup);
FacultyRoutes.post("/faculty/group", createFacultativeGroup);
FacultyRoutes.put("/faculty/group/:id/:column", updateLabResult);
FacultyRoutes.delete("/faculty/group/:group_name/:faculty_id", deleteFacultativeGroup);

export default FacultyRoutes;