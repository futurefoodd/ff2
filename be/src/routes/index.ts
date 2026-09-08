import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import { apiLimiter } from "../middleware/rateLimit.js"
import { stripeRouter } from "@routes/apiStripe.js"
import { consultationsRouter } from "./consultations.js"

export const apiRouter = Router()

apiRouter.get("/health", (_req, res) => res.json({ status: "ok" }))

apiRouter.use("/forms/consultations", apiLimiter, consultationsRouter)

apiRouter.use(requireAuth)
apiRouter.use(apiLimiter)

apiRouter.use("/stripe", stripeRouter)
