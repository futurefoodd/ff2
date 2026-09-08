import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { useRef, useState } from "react"

import { TopNavigation } from "@/components/top-navigation"
import { Button } from "@/components/ui/button"
import { env } from "@/config/env"
import {
  booleanFields,
  formSchemas,
  multiValueFields,
  type FormType,
} from "@/lib/consultation-form-schemas"

const tabs: { id: FormType; label: string }[] = [
  { id: "nutrition-consult", label: "Nutrition Consult" },
  { id: "sample-request", label: "Request for Sample" },
  { id: "metabolic-survey", label: "Metabolic Health Survey" },
]

const inputClass =
  "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
const textareaClass =
  "mt-1 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"

type BasicValues = {
  name: string
  age: string
  contact: string
  email: string
  sex: string
}

type FormErrors = Record<string, string>

const emptyBasicValues: BasicValues = {
  name: "",
  age: "",
  contact: "",
  email: "",
  sex: "",
}

function FieldError({ name, errors }: { name: string; errors: FormErrors }) {
  if (!errors[name]) return null

  return (
    <p className="mt-1 text-sm text-destructive" role="alert">
      {errors[name]}
    </p>
  )
}

function TextField({
  label,
  name,
  type = "text",
  required = false,
  min,
  errors,
}: {
  label: string
  name: string
  type?: "text" | "email" | "number"
  required?: boolean
  min?: number
  errors: FormErrors
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {required && <span className="text-destructive"> *</span>}
      <input
        className={inputClass}
        type={type}
        name={name}
        min={min}
        aria-invalid={Boolean(errors[name])}
      />
      <FieldError name={name} errors={errors} />
    </label>
  )
}

function ChoiceGroup({
  legend,
  name,
  options,
  type = "radio",
  required = false,
  errors,
}: {
  legend: string
  name: string
  options: string[]
  type?: "radio" | "checkbox"
  required?: boolean
  errors: FormErrors
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">
        {legend}
        {required && <span className="text-destructive"> *</span>}
      </legend>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-start gap-2 text-sm">
            <input className="mt-1" type={type} name={name} value={option} />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <FieldError name={name} errors={errors} />
    </fieldset>
  )
}

function BasicInformationFields({
  values,
  errors,
  onChange,
}: {
  values: BasicValues
  errors: FormErrors
  onChange: (field: keyof BasicValues, value: string) => void
}) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {(
          [
            ["Name", "name", "text"],
            ["Age", "age", "number"],
            ["Contact Number", "contact", "text"],
            ["Email", "email", "email"],
          ] as const
        ).map(([label, name, type]) => (
          <label key={name} className="block text-sm font-medium">
            {label}
            <span className="text-destructive"> *</span>
            <input
              className={inputClass}
              type={type}
              name={name}
              min={type === "number" ? 0 : undefined}
              value={values[name]}
              onChange={(event) => onChange(name, event.target.value)}
              aria-invalid={Boolean(errors[name])}
            />
            <FieldError name={name} errors={errors} />
          </label>
        ))}
      </div>
      <fieldset>
        <legend className="text-sm font-medium">
          Sex<span className="text-destructive"> *</span>
        </legend>
        <div className="mt-2 flex gap-5">
          {["Male", "Female"].map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="sex"
                value={option}
                checked={values.sex === option}
                onChange={(event) => onChange("sex", event.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
        <FieldError name="sex" errors={errors} />
      </fieldset>
    </section>
  )
}

function NutritionConsultFields({ errors }: { errors: FormErrors }) {
  return (
    <>
      <section className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Height (cm)"
            name="height"
            type="number"
            min={0}
            required
            errors={errors}
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            min={0}
            required
            errors={errors}
          />
        </div>
        <ChoiceGroup
          legend="Referred By"
          name="referredBy"
          options={["Agent", "Doctor"]}
          errors={errors}
        />
        <TextField
          label="Social Media ID"
          name="socialMediaId"
          errors={errors}
        />
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-semibold">Lifestyle &amp; Habits</h2>
        <ChoiceGroup
          legend="Daily Activity Level"
          name="activityLevel"
          options={[
            "Sedentary (<2000 steps)",
            "Moderate (5000 steps)",
            "Active (10000 steps)",
          ]}
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Exercise Routine"
          name="exerciseRoutine"
          options={[
            "Brisk Walk",
            "Yoga",
            "Gym Workout",
            "Swimming",
            "Hiking",
            "None",
          ]}
          type="checkbox"
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Exercise Frequency"
          name="exerciseFrequency"
          options={["Weekends", "3 times a week", "Daily", "None"]}
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Job Demands or Hazard"
          name="jobHazards"
          options={[
            "Night Shift",
            "Cleaning Services",
            "Frequent Deadlines",
            "Engine Services/Construction Works",
            "N/A",
          ]}
          type="checkbox"
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Typical Sleep Hours per Night"
          name="sleepHours"
          options={["4 hrs", "6 hrs", "8 hrs"]}
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Smoking | Vaping Use"
          name="smokingVaping"
          options={["Social", "Habitual", "None"]}
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Alcohol Consumption"
          name="alcoholTypes"
          options={["Beer", "Wine", "Liquor", "None"]}
          type="checkbox"
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Alcohol Consumption Frequency"
          name="alcoholFrequency"
          options={["Social", "Habitual", "None"]}
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Dietary Patterns"
          name="dietaryPatterns"
          options={[
            "One Meal Per Day (OMAD)",
            "Weekly Intermittent Fasting",
            "Meals After 8pm",
            "Meals With Bigger Portion Of Carbs",
          ]}
          type="checkbox"
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Usual Eating Style"
          name="eatingStyles"
          options={["Vegetarian", "Vegan", "Omnivore", "Keto", "Fast Food"]}
          type="checkbox"
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Daily Water Intake"
          name="waterIntake"
          options={["2–3 glass", "4–6 glass", "8–10 glass"]}
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Comfort beverage"
          name="comfortBeverages"
          options={[
            "Coffee",
            "Tea",
            "Chocolaty",
            "Dairy",
            "Sugary drink",
            "Snacks/Pastry",
          ]}
          type="checkbox"
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Comfort beverage Frequency"
          name="comfortBeverageFrequency"
          options={["When Stressed", "Often", "Sometimes", "Rarely", "None"]}
          required
          errors={errors}
        />
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-semibold">Wellness Goals</h2>
        <ChoiceGroup
          legend="Primary Goal"
          name="primaryGoal"
          options={[
            "Weight Loss",
            "Gut Health & Regular Bowel Movement",
            "Energy Boost",
          ]}
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Secondary Goals"
          name="secondaryGoals"
          options={[
            "Muscle Gain",
            "Joint Comfort",
            "Skin Health",
            "Women's Wellness & Beauty",
          ]}
          type="checkbox"
          required
          errors={errors}
        />
        <ChoiceGroup
          legend="Specific Concerns"
          name="specificConcerns"
          options={[
            "Bloating",
            "Reflux",
            "Constipation",
            "Hormonal Issues",
            "Knee & Back Ache",
            "Stress & Cramps",
          ]}
          type="checkbox"
          required
          errors={errors}
        />
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-semibold">Additional Info</h2>
        <label className="block text-sm font-medium">
          Supplements Currently Taken
          <textarea className={textareaClass} name="supplements" />
        </label>
        <ChoiceGroup
          legend="Family History of Health Issues"
          name="familyHistory"
          options={[
            "Diabetes",
            "Hypertension",
            "Heart Disease",
            "IBS / IBD",
            "Anaemia",
          ]}
          type="checkbox"
          errors={errors}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["recentHospitalisation", "Recent Hospitalisation"],
            ["yearlyScreening", "Yearly Medical Screening"],
            ["foodAllergy", "Any Food Allergy"],
            ["medication", "Presently on Medication"],
            ["recentTravel", "Recent Travel Abroad"],
          ].map(([name, label]) => (
            <label key={name} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={name} />
              {label}
            </label>
          ))}
        </div>
      </section>
    </>
  )
}

function SampleRequestFields({ errors }: { errors: FormErrors }) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">Sample Delivery</h2>
      <label className="block text-sm font-medium">
        Delivery Address<span className="text-destructive"> *</span>
        <textarea className={textareaClass} name="address" />
        <FieldError name="address" errors={errors} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Postcode" name="postcode" required errors={errors} />
        <TextField label="State" name="state" required errors={errors} />
      </div>
      <TextField
        label="Product Interest"
        name="productInterest"
        required
        errors={errors}
      />
      <label className="block text-sm font-medium">
        Why would you like to try a sample?
        <textarea className={textareaClass} name="requestReason" />
      </label>
    </section>
  )
}

function MetabolicSurveyFields({ errors }: { errors: FormErrors }) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">Metabolic Health</h2>
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          label="Height (cm)"
          name="height"
          type="number"
          min={0}
          required
          errors={errors}
        />
        <TextField
          label="Weight (kg)"
          name="weight"
          type="number"
          min={0}
          required
          errors={errors}
        />
        <TextField
          label="Waist (cm)"
          name="waist"
          type="number"
          min={0}
          required
          errors={errors}
        />
      </div>
      <ChoiceGroup
        legend="Daily Activity Level"
        name="activityLevel"
        options={["Sedentary", "Moderate", "Active"]}
        required
        errors={errors}
      />
      <ChoiceGroup
        legend="Typical Sleep Hours per Night"
        name="sleepHours"
        options={["4 hrs", "6 hrs", "8 hrs"]}
        required
        errors={errors}
      />
      <ChoiceGroup
        legend="Daily Water Intake"
        name="waterIntake"
        options={["2–3 glass", "4–6 glass", "8–10 glass"]}
        required
        errors={errors}
      />
      <ChoiceGroup
        legend="Diagnosed Conditions"
        name="diagnosedConditions"
        options={["Diabetes", "Hypertension", "High Cholesterol", "None"]}
        type="checkbox"
        errors={errors}
      />
      <ChoiceGroup
        legend="Family History of Health Issues"
        name="familyHistory"
        options={["Diabetes", "Hypertension", "Heart Disease", "None"]}
        type="checkbox"
        errors={errors}
      />
      <ChoiceGroup
        legend="Current Symptoms"
        name="symptoms"
        options={[
          "Fatigue",
          "Sugar Cravings",
          "Poor Sleep",
          "Digestive Discomfort",
          "Weight Changes",
          "None",
        ]}
        type="checkbox"
        required
        errors={errors}
      />
    </section>
  )
}

function readFormData(form: HTMLFormElement) {
  const formData = new FormData(form)
  const values: Record<string, unknown> = Object.fromEntries(formData.entries())

  for (const field of multiValueFields) {
    values[field] = formData.getAll(field)
  }

  for (const field of booleanFields) {
    values[field] = formData.has(field)
  }

  return values
}

function validationErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: FormErrors = {}

  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form")
    errors[field] ??= issue.message
  }

  return errors
}

export function ConsultationsPage() {
  const [activeTab, setActiveTab] = useState<FormType>("nutrition-consult")
  const [syncBasicInformation, setSyncBasicInformation] = useState(true)
  const [basicValues, setBasicValues] = useState<Record<FormType, BasicValues>>(
    {
      "nutrition-consult": { ...emptyBasicValues },
      "sample-request": { ...emptyBasicValues },
      "metabolic-survey": { ...emptyBasicValues },
    }
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [turnstileToken, setTurnstileToken] = useState("")
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined)

  const changeTab = (tab: FormType) => {
    setActiveTab(tab)
    setErrors({})
    setStatus("")
    setTurnstileToken("")
  }

  const updateBasicInformation = (field: keyof BasicValues, value: string) => {
    setBasicValues((current) => {
      if (syncBasicInformation) {
        return {
          "nutrition-consult": {
            ...current["nutrition-consult"],
            [field]: value,
          },
          "sample-request": {
            ...current["sample-request"],
            [field]: value,
          },
          "metabolic-survey": {
            ...current["metabolic-survey"],
            [field]: value,
          },
        }
      }

      return {
        ...current,
        [activeTab]: { ...current[activeTab], [field]: value },
      }
    })
  }

  const resetCurrentForm = () => {
    setErrors({})
    setStatus("")
    setTurnstileToken("")
    turnstileRef.current?.reset()

    setBasicValues((current) => {
      if (syncBasicInformation) {
        return {
          "nutrition-consult": { ...emptyBasicValues },
          "sample-request": { ...emptyBasicValues },
          "metabolic-survey": { ...emptyBasicValues },
        }
      }

      return { ...current, [activeTab]: { ...emptyBasicValues } }
    })
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus("")

    const values = readFormData(form)
    const result = formSchemas[activeTab].safeParse(values)

    if (!result.success) {
      setErrors(validationErrors(result.error.issues))
      return
    }

    if (!turnstileToken) {
      setErrors({ form: "Complete the security check before submitting" })
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch(`${env.API_BASE_URL}/forms/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          data: result.data,
          turnstileToken,
        }),
      })

      const body = (await response.json()) as { message?: string }
      if (!response.ok) {
        throw new Error(body.message || "Unable to submit the form")
      }

      form.reset()
      setStatus(body.message || "Your form was submitted successfully.")
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to submit the form. Please try again."
      )
      setTurnstileToken("")
      turnstileRef.current?.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const action = `consultation_${activeTab.replaceAll("-", "_")}`

  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopNavigation />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        <header className="max-w-2xl">
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            Request for Nutrition Consult
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Request a nutrition consultation, apply for free product samples, or
            complete the metabolic health survey.
          </p>
        </header>

        <div
          className="mt-8 flex flex-wrap gap-2 border-b"
          role="tablist"
          aria-label="Consultation forms"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`border-b-2 px-3 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
              onClick={() => changeTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={syncBasicInformation}
            onChange={(event) => setSyncBasicInformation(event.target.checked)}
          />
          Sync basic information across all tabs
        </label>

        <form
          key={activeTab}
          className="mt-8 space-y-8"
          noValidate
          onSubmit={(event) => void submitForm(event)}
          onReset={resetCurrentForm}
        >
          <BasicInformationFields
            values={basicValues[activeTab]}
            errors={errors}
            onChange={updateBasicInformation}
          />

          {activeTab === "nutrition-consult" && (
            <NutritionConsultFields errors={errors} />
          )}
          {activeTab === "sample-request" && (
            <SampleRequestFields errors={errors} />
          )}
          {activeTab === "metabolic-survey" && (
            <MetabolicSurveyFields errors={errors} />
          )}

          <label className="flex items-start gap-2 text-sm leading-6">
            <input className="mt-1.5" type="checkbox" name="consent" />
            <span>
              By clicking Submit, you acknowledge that you have read and agree
              to our{" "}
              <a
                className="underline underline-offset-4"
                href="/privacy-policy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>{" "}
              and that your personal data will be processed in accordance with
              the <strong>Personal Data Protection Act 2010 (PDPA)</strong>.
            </span>
          </label>
          <FieldError name="consent" errors={errors} />

          <Turnstile
            key={activeTab}
            ref={turnstileRef}
            siteKey={env.TURNSTILE_SITE_KEY}
            options={{ action, theme: "auto", size: "flexible" }}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            onError={() => setTurnstileToken("")}
          />
          <FieldError name="form" errors={errors} />

          {status && (
            <p className="text-sm" role="status">
              {status}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
            <Button type="reset" variant="outline" disabled={isSubmitting}>
              Reset Form
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
