import express from "express";
import { createShortUrl, redirectShortUrl, getUrlStats } from "../controllers/url.js";

const urlRoutes = express.Router();

urlRoutes.post("/shorten", createShortUrl);
// urlRoutes.get("/:shortCode", redirectShortUrl);
urlRoutes.get("/:shortCode/stats", getUrlStats);

export default urlRoutes;