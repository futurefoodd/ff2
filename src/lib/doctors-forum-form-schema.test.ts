import { describe, expect, it } from "vitest"

import { doctorsForumFormSchema } from "@/lib/doctors-forum-form-schema"

const validValues = {
  name: "Jane Tan",
  rn: "RN-123",
  age: "52",
  gender: "female",
  bmi: "23.4",
  visitDate: "2026-09-06",
  caregiver: "Dr Lim",
  regularMedication: "None",
  reasonsForVisit: ["fatigue"],
  chronicPain: "noChange",
  muscleAche: "slightlyBetter",
  jointStiffness: "muchBetter",
  energyFatigue: "slightlyBetter",
  brainFog: "noChange",
  sleep: "slightlyBetter",
  digestiveSymptoms: "noChange",
  skinAllergies: "noChange",
  badBreath: "noChange",
  painBefore: "4",
  painAfter: "2",
  fatigueBefore: "4",
  fatigueAfter: "2",
  brainFogBefore: "3",
  brainFogAfter: "2",
  strengthMobilityBefore: "2",
  strengthMobilityAfter: "4",
  sleepQualityBefore: "2",
  sleepQualityAfter: "4",
  stressBefore: "4",
  stressAfter: "2",
  digestiveComfortBefore: "3",
  digestiveComfortAfter: "4",
  reducedSmoking: "no",
  improvedDiet: "yes",
  increasedActivity: "yes",
  betterSleep: "yes",
  consistentHydration: "yes",
  reducedProcessedFood: "yes",
  qualityOfLife: "moderateImprovement",
  alternativeToSupplements: "Yes",
  simpleAndEasy: "Yes",
  supportNeeded: "A follow-up consultation",
  clinicalFindings: "",
  changesRecommended: "",
  followUpDosage: "",
}

describe("doctorsForumFormSchema", () => {
  it("accepts a complete assessment and coerces numeric fields", () => {
    const result = doctorsForumFormSchema.safeParse(validValues)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.age).toBe(52)
      expect(result.data.bmi).toBe(23.4)
      expect(result.data.painBefore).toBe(4)
    }
  })

  it("rejects missing choices and scores outside 1 to 5", () => {
    const result = doctorsForumFormSchema.safeParse({
      ...validValues,
      chronicPain: undefined,
      painAfter: "6",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.chronicPain).toBeDefined()
      expect(result.error.flatten().fieldErrors.painAfter).toContain(
        "Score must be from 1 to 5"
      )
    }
  })
})
