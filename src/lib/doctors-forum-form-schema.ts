import { z } from "zod"

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`).max(2000)

const symptomChange = z.enum(
  ["worse", "noChange", "slightlyBetter", "muchBetter"],
  { error: "Select a symptom change" }
)

const score = z.coerce
  .number({ error: "Enter a score from 1 to 5" })
  .int("Score must be a whole number")
  .min(1, "Score must be from 1 to 5")
  .max(5, "Score must be from 1 to 5")

const yesOrNo = z.enum(["yes", "no"], {
  error: "Select yes or no",
})

export const doctorsForumFormSchema = z.object({
  name: requiredText("Name").max(120),
  rn: requiredText("RN#").max(120),
  age: z.coerce
    .number({ error: "Enter a valid age" })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be 120 or less"),
  gender: z.enum(["male", "female"], { error: "Select a gender" }),
  bmi: z.coerce
    .number({ error: "Enter a valid BMI" })
    .positive("BMI must be greater than 0")
    .max(100, "BMI must be 100 or less"),
  visitDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid visit date"),
  caregiver: requiredText("Caregiver").max(120),
  regularMedication: requiredText("Regular medication"),
  reasonsForVisit: z.array(z.string()).default([]),

  chronicPain: symptomChange,
  muscleAche: symptomChange,
  jointStiffness: symptomChange,
  energyFatigue: symptomChange,
  brainFog: symptomChange,
  sleep: symptomChange,
  digestiveSymptoms: symptomChange,
  skinAllergies: symptomChange,
  badBreath: symptomChange,

  painBefore: score,
  painAfter: score,
  fatigueBefore: score,
  fatigueAfter: score,
  brainFogBefore: score,
  brainFogAfter: score,
  strengthMobilityBefore: score,
  strengthMobilityAfter: score,
  sleepQualityBefore: score,
  sleepQualityAfter: score,
  stressBefore: score,
  stressAfter: score,
  digestiveComfortBefore: score,
  digestiveComfortAfter: score,

  reducedSmoking: yesOrNo,
  improvedDiet: yesOrNo,
  increasedActivity: yesOrNo,
  betterSleep: yesOrNo,
  consistentHydration: yesOrNo,
  reducedProcessedFood: yesOrNo,

  qualityOfLife: z.enum(
    [
      "muchWorse",
      "noChange",
      "slightImprovement",
      "moderateImprovement",
      "significantImprovement",
    ],
    { error: "Select a quality-of-life change" }
  ),
  alternativeToSupplements: requiredText("An answer"),
  simpleAndEasy: requiredText("An answer"),
  supportNeeded: requiredText("An answer"),
  clinicalFindings: z.string().trim().max(2000).optional(),
  changesRecommended: z.string().trim().max(2000).optional(),
  followUpDosage: z.string().trim().max(2000).optional(),
})

export type DoctorsForumFormValues = z.infer<typeof doctorsForumFormSchema>
