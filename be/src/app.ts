import express from "express";
import cors from "cors";
// import swaggerUi from "swagger-ui-express";
import { env } from "./env.js";
// import { apiRouter } from "./routes/index.js";
// import { swaggerSpec, swaggerUiOptions } from "./docs/swagger.js";
// import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
// import { requestId } from "./middleware/requestId.js";
// import { requestLogger } from "./middleware/requestLogger.js";

export const createApp = () => {
  const app = express();

  // app.use(requestId);
  // app.use(requestLogger);
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());

//   app.get("/api-docs.json", (_req, res) => {
//     res.json(swaggerSpec);
//   });
//   app.use(
//     "/api-docs",
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec, swaggerUiOptions),
//   );

  app.use("/api/v1", (req, res, next) => {
    // Your middleware logic here
    res.json({ message: "API v1 is under construction" });
    next();
  });
  // app.use("/api/v1", apiRouter);

  // app.use(notFoundHandler);
  // app.use(errorHandler);

  return app;
};
