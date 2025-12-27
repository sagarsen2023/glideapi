import express from "express";
import cors from "cors";
import { config } from "./config";
import { successLog } from "./utils/logger";
import { connectToDb } from "./config/connect-to-db";
import { initializeCore } from "core";

const port = config.port;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initializeApp = async () => {
  await connectToDb();
  await initializeCore();

  // API Routes - dynamically import after generation
  const { setupAllRoutes } = await import("./plugins/setup-all-routes");
  await setupAllRoutes(app);

  app.listen(port, () => {
    successLog(
      `Server is running on port ${port} ===> http://localhost:${port}`,
    );
  });
};

initializeApp();
