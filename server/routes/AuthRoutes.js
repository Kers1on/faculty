import express from "express";
import { login, register } from "../controllers/AuthController.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/auth/login", login);
AuthRoutes.post("/auth/register", register);

export default AuthRoutes;