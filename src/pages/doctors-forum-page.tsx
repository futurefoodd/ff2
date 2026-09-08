import { useState } from "react"

import { TopNavigation } from "@/components/top-navigation"
import { Button } from "@/components/ui/button"
import { doctorsForumFormSchema } from "@/lib/doctors-forum-form-schema"

const inputClass =
  "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
const textareaClass =
  "mt-1 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"

const reasonsForVisit = [
  "chronic pain",
  "joint stiffness",
  "fall recovery",
  "muscle cramps",
  "muscle weakness",
  "osteoporosis / oedema",
  "sluggish digestion",
  "reflux",
  "bloating",
  "bad breath (dysbiosis)",
  "gum issues",
  "episodic constipation",
  "dehydration",
  "fatigue",
  "sleepy",
  "peri-menopause",
  "brain fog",
  "wrinkled skin",
  "skin allergies",
  "breakouts",
  "smoker / vapers cough",
  "others",
]

const symptomChanges = [
  ["chronicPain", "Chronic pain"],
  ["muscleAche", "Muscle ache/weakness"],
  ["jointStiffness", "Joint stiffness"],
  ["energyFatigue", "Energy/Fatigue"],
  ["brainFog", "Brain fog"],
  ["sleep", "Sleep"],
  ["digestiveSymptoms", "Digestive symptoms"],
  ["skinAllergies", "Skin allergies"],
  ["badBreath", "Bad breath/oral health"],
] as const

const changeOptions = [
  ["worse", "Worse"],
  ["noChange", "No Change"],
  ["slightlyBetter", "Slightly Better"],
  ["muchBetter", "Much Better"],
] as const

const objectiveScores = [
  ["pain", "Pain"],
  ["fatigue", "Fatigue"],
  ["brainFog", "Brain fog"],
  ["strengthMobility", "Strength/mobility"],
  ["sleepQuality", "Sleep quality"],
  ["stress", "Stress"],
  ["digestiveComfort", "Digestive comfort"],
] as const

const lifestyleImprovements = [
  ["reducedSmoking", "Reduced smoking/vaping"],
  ["improvedDiet", "Improved diet"],
  ["increasedActivity", "Increased physical activity"],
  ["betterSleep", "Better sleep routine"],
  ["consistentHydration", "More consistent hydration"],
  ["reducedProcessedFood", "Reduced processed food/sugar"],
] as const

type FormErrors = Record<string, string>

function FieldError({ name, errors }: { name: string; errors: FormErrors }) {
  if (!errors[name]) return null

  return (
    <p className="mt-1 text-sm text-destructive" role="alert">
      {errors[name]}
    </p>
  )
}

function RequiredMark() {
  return <span className="text-destructive"> *</span>
}

function TextField({
  label,
  name,
  type = "text",
  errors,
}: {
  label: string
  name: string
  type?: "text" | "number" | "date"
  errors: FormErrors
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <RequiredMark />
      <input
        className={inputClass}
        type={type}
        name={name}
        min={type === "number" ? 0 : undefined}
        aria-invalid={Boolean(errors[name])}
      />
      <FieldError name={name} errors={errors} />
    </label>
  )
}

function TextAreaField({
  label,
  name,
  required = false,
  errors,
}: {
  label: string
  name: string
  required?: boolean
  errors: FormErrors
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {required && <RequiredMark />}
      <textarea
        className={textareaClass}
        name={name}
        rows={3}
        aria-invalid={Boolean(errors[name])}
      />
      <FieldError name={name} errors={errors} />
    </label>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="border-b pb-3 text-xl font-semibold">{children}</h2>
}

function RadioTable({
  legend,
  rows,
  options,
  errors,
}: {
  legend: string
  rows: readonly (readonly [string, string])[]
  options: readonly (readonly [string, string])[]
  errors: FormErrors
}) {
  return (
    <fieldset>
      <legend className="text-base font-semibold">
        {legend}
        <RequiredMark />
      </legend>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="border p-3">Item</th>
              {options.map(([, label]) => (
                <th key={label} className="border p-3 text-center font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, label]) => (
              <tr key={name}>
                <th className="border p-3 text-left font-normal">
                  {label}
                  <FieldError name={name} errors={errors} />
                </th>
                {options.map(([value, optionLabel]) => (
                  <td key={value} className="border p-3 text-center">
                    <input
                      type="radio"
                      name={name}
                      value={value}
                      aria-invalid={Boolean(errors[name])}
                      aria-label={`${label}: ${optionLabel}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </fieldset>
  )
}

export function DoctorsForumPage() {
  const [status, setStatus] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("")

    const form = event.currentTarget
    const formData = new FormData(form)
    const values: Record<string, unknown> = Object.fromEntries(
      formData.entries()
    )
    values.reasonsForVisit = formData.getAll("reasonsForVisit")

    const result = doctorsForumFormSchema.safeParse(values)

    if (!result.success) {
      const nextErrors: FormErrors = {}

      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? "form")
        nextErrors[field] ??= issue.message
      }

      setErrors(nextErrors)
      setStatus("Please correct the highlighted fields.")

      const firstInvalidField = String(result.error.issues[0]?.path[0] ?? "")
      requestAnimationFrame(() => {
        const field = form.querySelector<HTMLElement>(
          `[name="${CSS.escape(firstInvalidField)}"]`
        )
        field?.focus()
      })
      return
    }

    setErrors({})
    setStatus("Assessment form completed.")
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopNavigation />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        <header className="max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by Functional Medicine Practitioners and Health Counsellors
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Doctor&apos;s Forum
          </h1>
          <h2 className="mt-6 text-2xl font-semibold">
            Upskill your team with plant-based nutrition science
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            A forum for healthcare professionals, caregivers, dieticians, sports
            nutritionists and wellness enthusiasts.
          </p>
        </header>

        <form
          className="mt-10 space-y-10"
          noValidate
          onSubmit={submitForm}
          onReset={() => {
            setErrors({})
            setStatus("")
          }}
        >
          <section className="space-y-6">
            <SectionHeading>Senior General Practitioners</SectionHeading>

            <div className="rounded-lg border bg-muted/40 p-5">
              <h3 className="font-semibold">
                Product Feasibility Assessment: Nutritional Soft Pastilles, 3g
                each
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
                <li>
                  <strong>Active Ingredient:</strong> 350mg NVC3
                </li>
                <li>
                  <strong>Mode of Delivery:</strong> Buccal / Sublingual
                </li>
                <li>
                  <strong>Dosage:</strong> 2 to 3 pastilles per day
                </li>
                <li>
                  <strong>Duration:</strong> 2 weeks
                </li>
                <li>
                  <strong>Functional Claim:</strong> Natural Anti-Inflammatory |
                  Muscle Recovery
                </li>
                <li>
                  <strong>Qualitative Methodology:</strong> Before-and-After
                  Assessment Survey
                </li>
                <li>
                  <strong>Quantitative Methodology:</strong> Selected Blood
                  Assays
                </li>
              </ul>
              <div className="mt-4 text-sm leading-6">
                <p>
                  <strong>
                    Middle-aged (45–55) | older participants (56–65)
                  </strong>
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>
                    chronic pain, cramps, muscle weakness, joint stiffness, fall
                    recovery, osteoporosis / oedema
                  </li>
                  <li>
                    sluggish digestion, bloating, reflux, bad breath
                    (dysbiosis), gum swelling, constipation
                  </li>
                  <li>fatigue, brain fog, sleepy, menopause</li>
                  <li>wrinkled skin, skin allergies, breakouts</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold">
              Participant&apos;s Information (History)
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Name" name="name" errors={errors} />
              <TextField label="RN#" name="rn" errors={errors} />
              <TextField label="Age" name="age" type="number" errors={errors} />
              <label className="block text-sm font-medium">
                Gender
                <RequiredMark />
                <select
                  className={inputClass}
                  name="gender"
                  defaultValue=""
                  aria-invalid={Boolean(errors.gender)}
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <FieldError name="gender" errors={errors} />
              </label>
              <TextField label="BMI" name="bmi" errors={errors} />
              <TextField
                label="Visit Date"
                name="visitDate"
                type="date"
                errors={errors}
              />
              <TextField label="Caregiver" name="caregiver" errors={errors} />
            </div>
            <TextAreaField
              label="Regular Medication"
              name="regularMedication"
              required
              errors={errors}
            />

            <fieldset>
              <legend className="text-sm font-medium">
                Reason for Visit(s) (check all that apply):
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {reasonsForVisit.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-start gap-2 text-sm"
                  >
                    <input
                      className="mt-0.5"
                      type="checkbox"
                      name="reasonsForVisit"
                      value={reason}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="space-y-8">
            <div>
              <SectionHeading>
                Part B: Post Product Trial Assessment
              </SectionHeading>
              <p className="mt-2 text-sm text-muted-foreground">
                Completed 3–4 weeks after product trial
              </p>
            </div>

            <RadioTable
              legend="1. Symptom Change (Compared to Before)"
              rows={symptomChanges}
              options={changeOptions}
              errors={errors}
            />

            <fieldset>
              <legend className="text-base font-semibold">
                2. Objective Follow-Up Scores (Repeat rating from 1–5)
                <RequiredMark />
              </legend>
              <p className="mt-2 text-sm text-muted-foreground">
                1 = None, 2 = Minimal, 3 = No change/Moderate, 4 = Significant,
                5 = Extreme
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-120 border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="border p-3">Symptom</th>
                      <th className="border p-3 text-center">Before</th>
                      <th className="border p-3 text-center">After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectiveScores.map(([name, label]) => (
                      <tr key={name}>
                        <th className="border p-3 text-left font-normal">
                          {label}
                        </th>
                        {["Before", "After"].map((period) => (
                          <td key={period} className="border p-3 text-center">
                            <input
                              className="h-9 w-20 rounded-md border px-2"
                              type="number"
                              name={`${name}${period}`}
                              min={1}
                              max={5}
                              aria-invalid={Boolean(errors[`${name}${period}`])}
                              aria-label={`${label} ${period}`}
                            />
                            <FieldError
                              name={`${name}${period}`}
                              errors={errors}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </fieldset>

            <RadioTable
              legend="3. Lifestyle Improvements"
              rows={lifestyleImprovements}
              options={[
                ["yes", "Yes"],
                ["no", "No"],
              ]}
              errors={errors}
            />

            <fieldset>
              <legend className="text-base font-semibold">
                4. Quality of Life (QOL)
                <RequiredMark />
              </legend>
              <p className="mt-2 text-sm">
                Compared to Pre Product Trial Assessment:
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {[
                  ["muchWorse", "Much worse"],
                  ["noChange", "No change"],
                  ["slightImprovement", "Slight improvement"],
                  ["moderateImprovement", "Moderate improvement"],
                  ["significantImprovement", "Significant improvement"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="qualityOfLife"
                      value={value}
                      aria-invalid={Boolean(errors.qualityOfLife)}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <FieldError name="qualityOfLife" errors={errors} />
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="mb-4 text-base font-semibold">
                5. Participant Feedback
                <RequiredMark />
              </legend>
              <TextAreaField
                label="1. Can this soft pastille be an alternative to your current supplements?"
                name="alternativeToSupplements"
                required
                errors={errors}
              />
              <TextAreaField
                label="2. Is this soft pastille nutrition simple and easy to take?"
                name="simpleAndEasy"
                required
                errors={errors}
              />
              <TextAreaField
                label="3. What support would you like going forward?"
                name="supportNeeded"
                required
                errors={errors}
              />
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="mb-4 text-base font-semibold">
                Clinician Notes (optional)
              </legend>
              <TextAreaField
                label="Summary of clinical findings"
                name="clinicalFindings"
                errors={errors}
              />
              <TextAreaField
                label="Changes recommended"
                name="changesRecommended"
                errors={errors}
              />
              <TextAreaField
                label="Follow-up dosage"
                name="followUpDosage"
                errors={errors}
              />
            </fieldset>

            <div className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
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
                the{" "}
                <strong className="text-foreground">
                  Personal Data Protection Act 2010 (PDPA)
                </strong>
                .
              </p>
              <p>
                By submitting this form, I consent to participate in this
                product trial assessment and acknowledge that I have provided
                accurate information.
              </p>
            </div>

            {status && (
              <p
                role="status"
                className={
                  errors.form || Object.keys(errors).length
                    ? "text-sm font-medium text-destructive"
                    : "text-sm font-medium"
                }
              >
                {status}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Submit Assessment</Button>
              <Button type="reset" variant="outline">
                Reset Form
              </Button>
            </div>
          </section>
        </form>
      </main>
    </div>
  )
}
