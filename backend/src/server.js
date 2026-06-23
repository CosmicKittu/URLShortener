
import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startClickSyncJob } from "./jobs/syncClicks.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

connectDB();
connectRedis();
startClickSyncJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});