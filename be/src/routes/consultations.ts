import { Router } from "express"
import type { Request, Response } from "express"
import { z } from "zod"

import { env } from "../env.js"
import { HttpError } from "../middleware/errorHandler.js"
import { logger } from "../logger.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const requiredText = z.string().trim().min(1).max(2_000)
const selectedItems = z.array(z.string().trim().min(1).max(160)).min(1)
const basicInformationSchema = z.object({
  name: requiredText.max(120),
  age: z.number().int().min(1).max(120),
  contact: requiredText.max(40),
  email: z.string().trim().email().max(254),
  sex: z.enum(["Male", "Female"]),
})

const nutritionConsultSchema = basicInformationSchema.extend({
  height: z.number().positive().max(300),
  weight: z.number().positive().max(500),
  referredBy: z.enum(["Agent", "Doctor"]).optional(),
  socialMediaId: z.string().trim().max(120).optional(),
  activityLevel: requiredText,
  exerciseRoutine: selectedItems,
  exerciseFrequency: requiredText,
  jobHazards: selectedItems,
  sleepHours: requiredText,
  smokingVaping: requiredText,
  alcoholTypes: selectedItems,
  alcoholFrequency: requiredText,
  dietaryPatterns: selectedItems,
  eatingStyles: selectedItems,
  waterIntake: requiredText,
  comfortBeverages: selectedItems,
  comfortBeverageFrequency: requiredText,
  primaryGoal: requiredText,
  secondaryGoals: selectedItems,
  specificConcerns: selectedItems,
  supplements: z.string().trim().max(2_000).optional(),
  familyHistory: z.array(z.string().max(160)),
  recentHospitalisation: z.boolean(),
  yearlyScreening: z.boolean(),
  foodAllergy: z.boolean(),
  medication: z.boolean(),
  recentTravel: z.boolean(),
  consent: z.literal(true),
})

const sampleRequestSchema = basicInformationSchema.extend({
  address: requiredText.max(500),
  postcode: requiredText.max(20),
  state: requiredText.max(100),
  productInterest: requiredText.max(160),
  requestReason: z.string().trim().max(1_000).optional(),
  consent: z.literal(true),
})

const metabolicSurveySchema = basicInformationSchema.extend({
  height: z.number().positive().max(300),
  weight: z.number().positive().max(500),
  waist: z.number().positive().max(300),
  activityLevel: requiredText,
  sleepHours: requiredText,
  waterIntake: requiredText,
  diagnosedConditions: z.array(z.string().max(160)),
  familyHistory: z.array(z.string().max(160)),
  symptoms: selectedItems,
  consent: z.literal(true),
})

const consultationSubmissionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("nutrition-consult"),
    data: nutritionConsultSchema,
    turnstileToken: z.string().min(1).max(2_048),
  }),
  z.object({
    type: z.literal("sample-request"),
    data: sampleRequestSchema,
    turnstileToken: z.string().min(1).max(2_048),
  }),
  z.object({
    type: z.literal("metabolic-survey"),
    data: metabolicSurveySchema,
    turnstileToken: z.string().min(1).max(2_048),
  }),
])

const turnstileResultSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
})

const actionFor = (type: string) => `consultation_${type.replaceAll("-", "_")}`

async function verifyTurnstile(
  token: string,
  expectedAction: string,
  remoteIp: string | undefined
) {
  if (!env.turnstileSecretKey) {
    throw new HttpError(503, "Form protection is not configured")
  }

  const body = new URLSearchParams({
    secret: env.turnstileSecretKey,
    response: token,
    idempotency_key: crypto.randomUUID(),
  })
  if (remoteIp) body.set("remoteip", remoteIp)

  let response: globalThis.Response
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        signal: AbortSignal.timeout(8_000),
      }
    )
  } catch {
    throw new HttpError(503, "Security verification is temporarily unavailable")
  }

  if (!response.ok) {
    throw new HttpError(503, "Security verification is temporarily unavailable")
  }

  const result = turnstileResultSchema.safeParse(await response.json())
  if (!result.success || !result.data.success) {
    throw new HttpError(400, "Security verification failed. Please try again")
  }

  if (result.data.action !== expectedAction) {
    throw new HttpError(400, "Security verification failed. Please try again")
  }

  if (
    env.turnstileAllowedHostnames.length > 0 &&
    (!result.data.hostname ||
      !env.turnstileAllowedHostnames.includes(result.data.hostname))
  ) {
    throw new HttpError(400, "Security verification failed. Please try again")
  }
}

async function storeSubmission(id: string, type: string, payload: unknown) {
  if (!env.supabaseUrl || !env.supabaseSecretKey) {
    throw new HttpError(503, "Form submission storage is not configured")
  }

  let response: globalThis.Response
  try {
    response = await fetch(
      `${env.supabaseUrl.replace(/\/$/, "")}/rest/v1/consultation_submissions`,
      {
        method: "POST",
        headers: {
          apikey: env.supabaseSecretKey,
          Authorization: `Bearer ${env.supabaseSecretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ id, submission_type: type, payload }),
        signal: AbortSignal.timeout(8_000),
      }
    )
  } catch {
    throw new HttpError(503, "Unable to save your form. Please try again later")
  }

  if (!response.ok) {
    throw new HttpError(503, "Unable to save your form. Please try again later")
  }
}

export const consultationsRouter = Router()

consultationsRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const submission = consultationSubmissionSchema.safeParse(req.body)
    if (!submission.success) {
      throw new HttpError(400, "Please check the form and try again")
    }

    const { type, data, turnstileToken } = submission.data
    await verifyTurnstile(turnstileToken, actionFor(type), req.ip)

    const submissionId = crypto.randomUUID()
    await storeSubmission(submissionId, type, data)
    logger.info("consultation form accepted", { submissionId, type })
    res.status(201).json({
      message: "Your form was submitted successfully.",
      submissionId,
    })
  })
)
