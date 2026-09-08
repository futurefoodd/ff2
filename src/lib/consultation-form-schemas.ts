import { z } from "zod"

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`)
const selectedItems = (label: string) =>
  z.array(z.string()).min(1, `Select at least one ${label.toLowerCase()}`)
const positiveNumber = (label: string) =>
  z.coerce.number().positive(`${label} must be greater than 0`)
const consent = z
  .boolean()
  .refine((value) => value, "You must agree to the Privacy Policy")

export const basicInformationSchema = z.object({
  name: requiredText("Name").max(120),
  age: z.coerce.number().int().min(1).max(120),
  contact: requiredText("Contact number").max(40),
  email: z.string().trim().email("Enter a valid email address").max(254),
  sex: z.enum(["Male", "Female"], { error: "Select a sex" }),
})

export const nutritionConsultSchema = basicInformationSchema.extend({
  height: positiveNumber("Height").max(300),
  weight: positiveNumber("Weight").max(500),
  referredBy: z.enum(["Agent", "Doctor"]).optional(),
  socialMediaId: z.string().trim().max(120).optional(),
  activityLevel: requiredText("Daily activity level"),
  exerciseRoutine: selectedItems("exercise routine"),
  exerciseFrequency: requiredText("Exercise frequency"),
  jobHazards: selectedItems("job demand or hazard"),
  sleepHours: requiredText("Sleep hours"),
  smokingVaping: requiredText("Smoking or vaping use"),
  alcoholTypes: selectedItems("alcohol option"),
  alcoholFrequency: requiredText("Alcohol consumption frequency"),
  dietaryPatterns: selectedItems("dietary pattern"),
  eatingStyles: selectedItems("eating style"),
  waterIntake: requiredText("Daily water intake"),
  comfortBeverages: selectedItems("comfort beverage"),
  comfortBeverageFrequency: requiredText("Comfort beverage frequency"),
  primaryGoal: requiredText("Primary goal"),
  secondaryGoals: selectedItems("secondary goal"),
  specificConcerns: selectedItems("specific concern"),
  supplements: z.string().trim().max(2000).optional(),
  familyHistory: z.array(z.string()).default([]),
  recentHospitalisation: z.boolean(),
  yearlyScreening: z.boolean(),
  foodAllergy: z.boolean(),
  medication: z.boolean(),
  recentTravel: z.boolean(),
  consent,
})

export const sampleRequestSchema = basicInformationSchema.extend({
  address: requiredText("Delivery address").max(500),
  postcode: requiredText("Postcode").max(20),
  state: requiredText("State").max(100),
  productInterest: requiredText("Product interest").max(160),
  requestReason: z.string().trim().max(1000).optional(),
  consent,
})

export const metabolicSurveySchema = basicInformationSchema.extend({
  height: positiveNumber("Height").max(300),
  weight: positiveNumber("Weight").max(500),
  waist: positiveNumber("Waist measurement").max(300),
  activityLevel: requiredText("Daily activity level"),
  sleepHours: requiredText("Sleep hours"),
  waterIntake: requiredText("Daily water intake"),
  diagnosedConditions: z.array(z.string()).default([]),
  familyHistory: z.array(z.string()).default([]),
  symptoms: selectedItems("current symptom"),
  consent,
})

export type FormType =
  "nutrition-consult" | "sample-request" | "metabolic-survey"

export const formSchemas = {
  "nutrition-consult": nutritionConsultSchema,
  "sample-request": sampleRequestSchema,
  "metabolic-survey": metabolicSurveySchema,
} as const

export const multiValueFields = new Set([
  "exerciseRoutine",
  "jobHazards",
  "alcoholTypes",
  "dietaryPatterns",
  "eatingStyles",
  "comfortBeverages",
  "secondaryGoals",
  "specificConcerns",
  "familyHistory",
  "diagnosedConditions",
  "symptoms",
])

export const booleanFields = new Set([
  "recentHospitalisation",
  "yearlyScreening",
  "foodAllergy",
  "medication",
  "recentTravel",
  "consent",
])
