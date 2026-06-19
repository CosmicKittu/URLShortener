import express from "express";
import cors from "cors";
import urlRoutes from "./routes/url.js";
import { redirectShortUrl } from "./controllers/url.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "URL shortner API is running",
  });
});

app.use("/api/urls", urlRoutes);
app.get("/:shortCode", redirectShortUrl);

export default app;