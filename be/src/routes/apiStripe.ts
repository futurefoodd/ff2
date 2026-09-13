import { Router } from "express"
// import { HttpError } from "../middleware/errorHandler.js"
import type { Request, Response } from "express"
import { asyncHandler } from "@utils/asyncHandler.js"
import { StripeClient } from "@client/stripeClient.js"
import {env} from "../env.js"

export const stripeRouter = Router()

const BASE_URL = env.baseUrl;

stripeRouter.post(
  "/create-checkout-session",
  asyncHandler(async (req: Request, res: Response) => {
    const session = await StripeClient.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "{{PRICE_ID}}",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${BASE_URL}?success=true`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: "{{INTEGRATION_ID}}",
    })

    res.redirect(303, session.url?? '')
  })
)
