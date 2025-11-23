import express from "express";
import cors from "cors";
import { config } from "./config";
import { successLog } from "./utils/logger";
import { setupAllRoutes } from "./plugins/setup-all-routes";
import { initializeCore } from "core";
import { connectToDb } from "./config/connect-to-db";

const port = config.port;

const app = express();

connectToDb();

initializeCore();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
setupAllRoutes(app);

app.listen(port, () => {
  successLog(`Server is running on port ${port} ===> http://localhost:${port}`);
});
