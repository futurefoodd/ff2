import { CalendarDays, CheckCircle2, Mail, Phone, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"

import { CookieConsent } from "@/components/cookie-consent"
import { DocumentTranslations } from "@/components/document-translations"
import { TopNavigation } from "@/components/top-navigation"
import { FeaturedProduct } from "@/components/featured-product"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const heroSlides = [
  {
    image: "/landing_image_1.webp",
    alt: "Future Foods NVC3 pro-collagen soft pastilles and daily nutrition blend",
  },
  {
    image: "/landing_image_2.webp",
    alt: "Future Foods Women's Wellness pastilles and nutrition blend",
  },
  {
    image: "/landing_image_3.webp",
    alt: "Future Foods NVC3 soft pastilles and sublingual nutrition formulation",
  },
  {
    image: "/landing_image_4.webp",
    alt: "Future Foods Farm to Pharmacy promise and organic farming photographs",
  },
]

const announcements = [
  {
    image: "/rotary2.jpeg",
    alt: "Health Begins in Your Gut talk with Dr Keshu A., hosted by Rotary Club of Damansara Uptown",
    date: "29 Aug 2026",
    title: "A fresh start for your wellness routine",
    description: "Health Begins In Your Gut - Rotary Club of Damansara Uptown.",
  },
  {
    image: "/nice.jpeg",
    alt: "Sepri Natural Products company profile for the NICE 26 expo",
    date: "26-28 Aug 2026",
    title: "NICE 26 - National Innovation and Commercialisation Expo",
    description:
      "Visit us at Sepri Natural Products' booth, 26-28 August 2026, 9:00 AM - 5:00 PM daily at Kuala Lumpur Convention Centre (KLCC). Theme: Mission to Market Malaysia to the World - Matching Investors.",
  },
]

const testimonials = [
  {
    name: "Carol Lee",
    designation: "Fitness Enthusiast",
    quote:
      "These nutrient rich soft pastilles helps your good bacteria in your gut to grow and stay strong. Your own probiotics help you better digest food and absorb important nutrients, can stop sugar cravings and even improve your mood.",
  },
  {
    name: "Kathijah Ibrahim",
    designation: "Deputy Director, MOE",
    quote:
      "These soft pastilles are well formulated to help your body better absorb natural vitamin C, amino acids, dietary calcium and magnesium for muscle recovery and stronger bones. I also have improved joint flexibility and have less pain.",
  },
  {
    name: "Selina Gan",
    designation: "Founder of OPIKA ORGANIC",
    quote:
      "I feel the Omega 3, MCTs and B vitamins are easily and quickly absorbed in my mouth. I quickly get natural energy to rebound after workouts, recover from daily tiredness and also very much less brain fog.",
  },
  {
    name: "Carine Tan",
    designation: "Wellness Enthusiast",
    quote:
      "I'm currently consuming my first box, and I'm impressed with how my body is responding. The first change I noticed was my energy level — I feel more alert, lighter, and able to work out without feeling drained.👍\n\nAnother big improvement is my skin. I've always had dry areas around my mouth, but lately my skin feels more hydrated and comfortable. It's a nice surprise. I didn't expect so soon.\n\nThe soft pastilles themselves are easy to bring anywhere, easy to consume, and taste really good",
  },
]

const faqs = [
  {
    question: "Are our products Halal?",
    answer:
      "Yes, each ingredient has its Halal certificate and OEM Halal certification for the production process.",
  },
  {
    question: "What is Pro-Collagen in soft-pastilles?",
    answer:
      "A tasty fruit-based soft pastille made with an organic blend of plant nutrients and halal gelatine that supports collagen synthesis. Soft pastilles are a source of plant-based Ascorbate (Vitamin C) antioxidants and anti-inflammatory compounds to help your body and mind stay active.",
  },
  {
    question: "How do these soft-pastilles help my sensitive / ageing skin?",
    answer:
      "These nutrient-rich soft-pastilles contain natural amino acids, glycoproteins, polyphenols, and ascorbate (dietary vitamin-c) to reduce skin sensitivity, strengthen joints and nails, and support muscle recovery. These soft-pastilles promote natural collagen and elastin production, helping your skin feel firmer with a healthier glow.",
  },
  {
    question: "What is Paleo-Prebiotics®?",
    answer:
      "It’s a unique blend of ancient soluble plant fibres and resistant starches that feed your gut’s good bacteria, improving digestion, nutrient absorption, and easing bowel movement.",
  },
  {
    question: "Why are MCTs included?",
    answer:
      "MCT C8 & C10 (from virgin coconut oil) combined with ALA=Omega 3 are energy lipids that quickly refuel your body and brain, keeping you active and refreshed.",
  },
  {
    question: "How should I take these soft-pastilles?",
    answer:
      "Place a soft-pastille twice or thrice daily under your tongue for faster absorption, or as advised by your doctor, counsellor, pharmacist, or nutritionist.",
  },
  {
    question: "Are these soft-pastilles safe for everyday use?",
    answer:
      "Yes! They are made without any artificial colours, sweeteners, preservatives, or hidden additives. These soft pastilles use Low GI Nipa Fructans from Sarawak’s Gula Apong.",
  },
  {
    question: "What do these soft-pastilles taste like?",
    answer:
      "They have a naturally fruity taste from organic ingredients such as roselle, plantain, gooseberry, and soursop, making them enjoyable to take by children, active adults, and older adults.",
  },
  {
    question:
      "Can these soft-pastilles help with ageing discomforts and keep up with daily demands?",
    answer:
      "Yes! The unique blend of natural Vitamin C, amino acids, glycoproteins, polyphenols, and ALA-Omega 3 works together (nutrient synergy) to support muscle recovery, strengthen skin and nails, and improve joint comfort and flexibility; helping you feel alert and ready for daily activity.",
  },
  {
    question: "Are these soft-pastilles suitable for women’s wellness?",
    answer:
      "Yes! These soft pastilles are specially crafted to support women’s wellness; helping boost energy and mood, enhance skin hydration, promote hormonal balance, and nurture overall vitality for a beautiful you.",
  },
  {
    question: "How should I store the product?",
    answer:
      "Keep the box at or below 28°C, away from sunlight and moisture to maintain freshness.",
  },
  {
    question: "Where are these soft-pastilles made?",
    answer:
      "They are professionally formulated and produced in Malaysia by Utara Dietetics & Plant-Based Research in partnership with a HACCP and Halal certified OEM manufacturer.",
  },
  {
    question: "Does this soft-pastille have a five-star product rating?",
    answer:
      "Yes! Independent customer reviews and patient feedback to doctors consistently rate our soft pastilles at five stars, reflecting high satisfaction in areas such as taste, effectiveness, overall wellness support, and value for money.",
  },
]

function TestimonialsCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (
      !api ||
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    const interval = window.setInterval(() => api.scrollNext(), 4500)

    return () => window.clearInterval(interval)
  }, [api, isPaused])

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      setApi={setApi}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false)
        }
      }}
    >
      <div>
        <CarouselContent className="py-2">
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="h-64 gap-0 rounded-3xl border-border/70 py-0 shadow-sm">
                <CardHeader className="pt-5 pb-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className="size-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 [scrollbar-width:thin] overflow-y-auto pb-4 text-foreground">
                  <p className="text-sm leading-6 whitespace-pre-line">
                    “{testimonial.quote}”
                  </p>
                </CardContent>
                <CardFooter className="mt-auto shrink-0 flex-col items-start gap-1 border-t bg-card py-4">
                  <strong>{testimonial.name}</strong>
                  <span className="text-sm text-muted-foreground">
                    {testimonial.designation}
                  </span>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <CarouselPrevious className="static m-0 border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground" />
        <CarouselNext className="static m-0 border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground" />
      </div>
    </Carousel>
  )
}

export function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <TopNavigation />
      <main>
        <section
          id="home"
          aria-label="Featured highlights"
          className="border-b bg-muted/30 md:px-6 md:py-12 lg:px-12"
        >
          <Carousel opts={{ loop: true }} className="mx-auto max-w-7xl">
            <CarouselContent className="-ml-4">
              {heroSlides.map((slide, index) => (
                <CarouselItem key={slide.image} className="pl-4 md:py-4">
                  <Card className="aspect-[1366/768] w-full gap-0 rounded-3xl border border-border/60 py-0 shadow-lg md:aspect-auto">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      width={1366}
                      height={768}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className="block h-full w-full object-contain md:h-auto"
                    />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 border-background bg-background/90 shadow-sm md:left-5" />
            <CarouselNext className="right-3 border-background bg-background/90 shadow-sm md:right-5" />
          </Carousel>
        </section>

        <FeaturedProduct />

        <section className="bg-muted/50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                  What’s new
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Announcements
                </h2>
              </div>
              <p className="max-w-md text-muted-foreground">
                Helpful updates, expert ideas, and fresh ways to make your
                wellbeing a priority.
              </p>
            </div>
            <Carousel opts={{ align: "start" }}>
              <CarouselContent>
                {announcements.map((announcement) => (
                  <CarouselItem
                    key={announcement.title}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="h-96 rounded-3xl py-0">
                      <a
                        href={announcement.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View full poster: ${announcement.title}`}
                        className="block h-44 shrink-0 overflow-hidden"
                      >
                        <img
                          src={announcement.image}
                          alt={announcement.alt}
                          loading="lazy"
                          className="h-full w-full bg-muted object-cover"
                        />
                      </a>
                      <CardHeader>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          {announcement.date}
                        </div>
                        <CardTitle>{announcement.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="leading-6">
                          {announcement.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-6 flex justify-end gap-2">
                <CarouselPrevious className="static m-0" />
                <CarouselNext className="static m-0" />
              </div>
            </Carousel>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Functional claims
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Built around your everyday needs
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Supports Gut Probiotics",
                description:
                  "These soft pastilles feed your gut probiotics to grow and stay strong. These good microbes help you better digest food and absorb essential nutrients, keep your immune system active, and even improve your mood.",
              },
              {
                title: "Strengthens Muscle, Joints & Nails",
                description:
                  "These clinically formulated soft pastilles helps your body better absorb natural vitamin C, amino acids, polypeptides and dietary calcium for muscle recovery and stronger bones. These soft pastilles have also been studied to reduce inflammation thus supporting joint and ligament flexibility.",
              },
              {
                title: "Higher Energy Creating Better Mood",
                description:
                  "Organic ALA Omega 3, MCT 8, MCT10 and B-Complex in these soft pastilles are absorbed quickly in the mouth giving you more natural energy to recover from fatigue, improve attention span and reduce brain fog. These soft pastilles contain polyphenols with natural anti-inflammatory benefits, helping your body rebound after daily walks or workouts.",
              },
            ].map((claim, index) => (
              <Card key={claim.title} className="h-96 rounded-3xl shadow-sm">
                <CardHeader>
                  <span className="text-sm font-semibold text-primary">
                    0{index + 1}
                  </span>
                  <CheckCircle2 className="mt-5 size-7 text-primary" />
                  <CardTitle className="mt-1 text-lg">{claim.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-6">
                    {claim.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-background py-20 text-foreground">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-10">
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                Testimonials
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Loved by people building healthier habits
              </h2>
            </div>
            <TestimonialsCarousel />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Questions, answered
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Everything you need to know before getting started.
            </p>
          </div>
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="border-t bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
          <div>
            <Link to="/#home" className="flex items-center gap-2.5">
              <img
                src="/ff_icon.png"
                alt="Future Foods logo"
                className="size-9 rounded-md object-cover"
              />
            </Link>
            <p className="mt-4 max-w-sm leading-6 text-muted-foreground">
              'Nutrition on Demand' Fuel your active lifestyle with bioactive foods designed for functional needs and a healthy gut.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Company</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" to="/#terms">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/#refund">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/#privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="font-medium text-primary hover:underline"
                  to="/#consultation"
                >
                  Request for Consultation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  className="flex items-center gap-2 hover:text-foreground"
                  href="mailto:hello@company.example"
                >
                  <Mail className="size-4" />
                  consult@futurefoods.com.my
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 hover:text-foreground"
                  href="tel:+60312345678"
                >
                  <Phone className="size-4" />
                  +60 102202574
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function App() {
  return (
    <>
      <DocumentTranslations />
      <Outlet />
      <CookieConsent />
    </>
  )
}

export default App
