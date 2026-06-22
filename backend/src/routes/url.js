import express from "express";
import { createShortUrl, redirectShortUrl, getUrlStats, getMyUrls} from "../controllers/url.js";
import authMiddleware from "../middleware/authMiddleware.js";

const urlRoutes = express.Router();

urlRoutes.post("/shorten", authMiddleware, createShortUrl);
// urlRoutes.get("/:shortCode", redirectShortUrl);
urlRoutes.get("/:shortCode/stats", getUrlStats);
urlRoutes.get("/my", authMiddleware, getMyUrls);

export default urlRoutes;