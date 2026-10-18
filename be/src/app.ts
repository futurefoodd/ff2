import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { apiRouter } from "./routes/index.js";
// import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
// import { requestId } from "./middleware/requestId.js";
// import { requestLogger } from "./middleware/requestLogger.js";

export const createApp = () => {
  const app = express();

  // app.use(requestId);
  // app.use(requestLogger);
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use("/api/v1", apiRouter);

  // app.use(notFoundHandler);
  // app.use(errorHandler);

  return app;
};
