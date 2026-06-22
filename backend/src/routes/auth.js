import express from "express";
import { registerUser, loginUser } from "../controllers/auth.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
// urlRoutes.get("/:shortCode", redirectShortUrl);
// urlRoutes.get("/:shortCode/stats", getUrlStats);

export default authRoutes;