import { TopNavigation } from "@/components/top-navigation"

const eventDates = [
  ["Oct 27th, 2024", "Utara Dietetics, Southern Park"],
  ["Nov 16th, 2024", "STEM 4 ALL, USJ"],
  ["Dec 21st, 2024", "PKD, Bukit Mertajam"],
  ["Jan 19th, 2025", "KBS, Sarawak"],
  ["Mar 23rd, 2025", "Mt. Kiara Club"],
  ["May 25th, 2025", "Bertam Golf Course"],
  ["July 27th, 2025", "Perda Food Tech Park"],
] as const

export function GutBrainAxisProbioticsPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopNavigation />
      <main className="mx-auto max-w-3xl px-6 py-14 lg:py-20">
        <article>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Gut-Brain Axis &amp; Probiotics
          </h1>

          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            {eventDates.map(([date, location]) => (
              <p key={`${date}-${location}`}>
                <strong className="font-semibold text-foreground">
                  {date}
                </strong>{" "}
                @ {location}
              </p>
            ))}
          </div>

          <div className="mt-10 space-y-5 text-base leading-7 text-muted-foreground">
            <header>
              <h2 className="text-2xl font-semibold text-foreground">
                Nutrient Dense Soft Pastilles increase Gut Brain Axis (GBA)
                Functionality
              </h2>
              <p className="mt-2 text-sm">
                Synopsis (based on product trials since 2023 and literature
                review of 19 reference sites)
              </p>
            </header>

            <p>
              The gut and the brain communicate bidirectionally through the
              Gut–Brain Axis (GBA), which operates through interconnected
              neural, endocrine, immune, and microbiome pathways. Emerging
              evidence shows that dietary choices, spring water and exposure to
              Schumann resonance (grounding) can influence these pathways and
              modulate gut–brain communication. Lifestyle activities align with
              stress-reduction and nervous-system calming mechanisms indirectly
              support GBA regulation.
            </p>
            <p>NVC Soft Pastilles, SKU VII</p>
            <p>
              Functional food and progressive clinical nutrition made save,
              simple and effective.
            </p>
            <p>
              The certified organic ingredients are Halal Gelatine (source
              chicken, sheep, fish, bovine), Annona, Plantain, Gum Arabica,
              Roselle, Beetroot, Amla, Virgin Coconut Oil, Nipah Nectar, Panela
              (raw cane sugar)
            </p>
            <p>
              Nutrient-dense soft pastilles containing resistant starch (paleo
              prebiotics), phytosterols, omega-3 and MCTs, polyphenols
              (antioxidants), pro-collagen complex (amino acids, polypeptides,
              glycoproteins and ascorbate) together with essential vitamins and
              minerals, support the GBA interventions.
            </p>
            <p>
              When formulated with certified organic bioactive ingredients, soft
              pastilles may provide a safe, convenient, and well-tolerated
              modality for supporting GBA functionality. By delivering
              phytonutrients, bioactive compounds and medical grade probiotics
              we influence microbial diversity, short-chain fatty acid
              synthesis, enhance mitochondrial activity, regulate inflammatory
              signalling and neurotransmitter biosynthesis.
            </p>
            <p>
              Soft Pastilles are formulated for maximum quick absorption via the
              buccal sublingual pathway thus giving early results.
            </p>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                Product Information
              </h2>
              <p>
                Soft pastille formulations can help stabilize neurocognitive and
                autonomic responses. Improved GBA responses can enhance
                emotional resilience, cognitive processing and stress tolerance,
                thereby increasing patient receptiveness and engagement in
                mental-health counselling and related psychotherapeutic
                interventions.
              </p>
            </section>

            <section className="space-y-5">
              <div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Resistant Starch (Prebiotics)
                </h2>
                <p>
                  feeds beneficial gut bacteria (commensal microbes). These
                  probiotics ferment this fiber into beneficial metabolites,
                  notably short-chain fatty acids (SCFAs), which improves
                  intestinal barrier function, reduce systemic and neuro
                  inflammation.
                </p>
              </div>
              <div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Omega-3 and MCTs
                </h2>
                <div className="space-y-5">
                  <p>
                    play essential roles in cellular energy metabolism,
                    neurodevelopment and cognitive processing. These healthy
                    lipids support the synthesis of neuronal membranes, enhance
                    mitochondrial efficiency and facilitate the production of
                    ketone bodies associated with improved mood regulation and a
                    reduced risk of depressive symptoms.
                  </p>
                  <p>
                    These lipids been studied for their capacity to modulate
                    cholesterol profile by increasing HDL cholesterol, balancing
                    the Omega 3:6 ratio and dietary trans-fat burden.
                  </p>
                </div>
              </div>
              <div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Vitamins and Micronutrients
                </h2>
                <p>
                  Ascorbate, B vitamins, folate, zinc, and magnesium are
                  involved as coenzymes and cofactors in the metabolic pathways
                  that affect the development and functioning of the nervous
                  system and neuro hormones
                </p>
              </div>
              <div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Life Culture Probiotics (med-grade)
                </h2>
                <p>
                  When paired with nutrient-rich soft pastilles, as reported in
                  several probiotic–nutrition synergy studies, these med-grade
                  probiotics supports clearer focus, calmer mood, and healthier
                  digestion. Research in children shows benefits in
                  strengthening natural immunity and easing seasonal flu-like or
                  allergy-related discomfort.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                Dosage
              </h2>
              <div className="space-y-3">
                <p>
                  In regular children the entry dosage is 1 soft pastille per
                  day.
                </p>
                <p>
                  In children with ADHD entry dosage would be 1 soft pastille
                  per day.
                </p>
                <p>
                  In regular older adults the dosage would be 2 soft pastilles
                  per day and early benefits can be seen after 1st week
                </p>
                <p>
                  In recovering older adults and elderly the dosage would be 3
                  soft pastilles per day and benefits can be felt after 2 weeks
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                Oral Hygiene and Early Dental Care
              </h2>
              <div className="space-y-5">
                <p>
                  “Buccal/sublingual nutrient-dense pastilles direct delivery
                  beneficial probiotics, natural anti-inflammatory compounds,
                  prebiotic substrates, phytonutrients
                  (cofactors/vitamins/coenzyme) into the biofilm environment
                  where they can compete with pathogens, produce antimicrobial
                  metabolites, modulate local immunity, and change local pH.
                  This may help modulate the oral microbiome and mucosal health.
                </p>
                <p>
                  Evidence from clinical trials of lozenges with probiotics and
                  bioactive ingredients shows improvements in some markers of
                  oral dysbiosis and gum inflammation. Results are promising but
                  heterogeneous. Systemic nutritional effects depend on
                  absorption and is dose dependent.
                </p>
                <p>
                  These interventions should be considered adjunctive and not
                  replacements for professional dental care.”
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                Mechanism of Action
              </h2>
              <p>
                NVC nutrient-dense soft pastille may function as a cofactor and
                coenzyme delivery system, that support microcapillary
                functionality, cellular metabolism, anti-inflammatory activity
                and microbiome stability. The formulation can act in line with
                &quot;psychobiotic&quot; principles thus contributing in some
                parts to improved physiological balance, better stress
                modulation and complementary support to well-being. While not a
                replacement for medical therapy, functional soft pastilles
                facilitate &apos;nutrient synergy&apos; that enhance the
                body&apos;s response to prescription medication and promote
                treatment efficacy in the elderly.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                Research &amp; Development (under funding campaign phase)
              </h2>
              <p>
                Certified organic cultivation of selected non-GMO plant species
                has been shown to yield higher concentrations of key bioactive
                compounds, including Acetogenins and Thymoquinone, presently
                under investigation for their potent anti-inflammatory,
                immunomodulatory, and cytoprotective properties. Our cultivation
                and processing activities at the Agri Research Institute operate
                under a strict Farm to Pharmacy framework, ensuring
                traceability, phytochemical integrity and therapeutic
                consistency across all research batches and clinical-grade
                formulations.
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  )
}
