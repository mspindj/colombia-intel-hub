import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import bogBanner from "@/assets/BOG_1280x360.png";
import mdeBanner from "@/assets/MDE_1280x360.png";
import ctgBanner from "@/assets/CTG_1280x360.png";
import heroBg from "@/assets/bogota_background.jpg";
import mdeBg from "@/assets/medellin_background.jpg";
import ctgBg from "@/assets/cartagena_background.jpg";

const heroBgs = [heroBg, mdeBg, ctgBg];

const chapters = [
  { num: "01", title: "Airport arrival & transport" },
  { num: "02", title: "Climate & physical orientation" },
  { num: "03", title: "Street vendor & hustle navigation" },
  { num: "04", title: "Local language & codes" },
  { num: "05", title: "Nightlife & safe zones" },
  { num: "06", title: "Logistics & day trips" },
  { num: "07", title: "Food & health" },
  { num: "08", title: "Local mindset & cultural DNA" },
  { num: "09", title: "Emergencies & contacts" },
];

const cities = [
  {
    code: "BOG-72H",
    name: "Bogotá",
    tagline: '"No dar papaya"',
    price: "$17",
    accent: "bogota",
    banner: bogBanner,
    link: "https://megustacomco.gumroad.com/l/bogota72hours",
    available: true,
  },
  {
    code: "MDE-72H",
    name: "Medellín",
    tagline: '"The Mirage is real"',
    price: "$17",
    accent: "medellin",
    banner: mdeBanner,
    link: "https://megustacomco.gumroad.com/l/medellin-survival-vault",
    available: true,
  },
  {
    code: "CTG-72H",
    name: "Cartagena",
    tagline: '"Cógela Suave"',
    price: "$17",
    accent: "cartagena",
    banner: ctgBanner,
    link: "https://megustacomco.gumroad.com/l/cartagena-survival-vault",
    available: true,
  },
  {
    code: "CLO-72H",
    name: "Cali",
    tagline: "Coming soon",
    price: "",
    accent: "",
    banner: "",
    link: "",
    available: false,
  },
  {
    code: "SMR-72H",
    name: "Santa Marta",
    tagline: "Coming soon",
    price: "",
    accent: "",
    banner: "",
    link: "",
    available: false,
  },
  {
    code: "ADZ-72H",
    name: "San Andrés",
    tagline: "Coming soon",
    price: "",
    accent: "",
    banner: "",
    link: "",
    available: false,
  },
];

const faqs = [
  {
    q: "Is this a regular travel guide?",
    a: "No. This tells you how to survive — scam-free, stress-free. No fluff about the best Instagram spots.",
  },
  {
    q: "I already checked Reddit. Why pay?",
    a: "Reddit has fragments across 200 threads from 2019. This is curated, structured, and current.",
  },
  {
    q: "What format is it?",
    a: "Downloadable PDF. Read on your phone on the plane.",
  },
  {
    q: "Can I get a refund?",
    a: "Digital product, all sales final. At $17, it's less than a bad taxi ride.",
  },
  {
    q: "Who made this?",
    a: "Locals who watched tourists make the same mistakes for years.",
  },
];

const testimonials = [
  {
    name: "Jake R.",
    location: "Austin, TX",
    badge: "BOG-72H",
    badgeAccent: "bogota",
    quote: "A moto-taxi driver tried to charge me $40 from the airport. I already knew from the guide that the official taxi counter price was $8. Paid $8, kept $32. Guide paid for itself in literally 10 minutes.",
    keyResult: "Saved $32 in 10 minutes",
  },
  {
    name: "Sarah L.",
    location: "London, UK",
    badge: "MDE-72H",
    badgeAccent: "medellin",
    quote: "My friends who didn't read it ended up in the wrong neighborhood on night one and had to Uber back to Poblado. I went straight to the right zones — the nightlife chapter is worth the entire price.",
    keyResult: "Knew exactly where to go on night one",
  },
  {
    name: "Marcus W.",
    location: "Toronto, CA",
    badge: "CTG-72H",
    badgeAccent: "cartagena",
    quote: "Other tourists on my boat to Rosario paid 180,000 COP. I negotiated 95,000 because the guide told me the real price and the exact phrase to use. The vendor negotiation section alone is worth 10x the guide price.",
    keyResult: "Paid almost half what other tourists paid",
  },
  {
    name: "Emma K.",
    location: "Sydney, AU",
    badge: "BOG-72H",
    badgeAccent: "bogota",
    quote: "Downloaded it on the plane from Sydney. By the time I landed at El Dorado I felt like I'd already been there a week. No anxiety at immigration, no confusion with the SIM card, no taxi scam. Just ready.",
    keyResult: "Felt like I'd already been there",
  },
];

const badgeBgClass: Record<string, string> = {
  bogota: "bg-[#c0392b]/20 text-[#c0392b]",
  medellin: "bg-[#27ae60]/20 text-[#27ae60]",
  cartagena: "bg-[#2980b9]/20 text-[#2980b9]",
};

const lossStats = [
  {
    value: "$40",
    desc: "What tourists pay for a taxi that should cost $8",
    highlight: false,
  },
  {
    value: "3 hrs",
    desc: "Average time lost on day 1 figuring out basics locals already know",
    highlight: false,
  },
  {
    value: "$17",
    desc: "The cost of knowing everything before you land — less than a lunch in Bogotá",
    highlight: true,
  },
];
const accentBorderClass: Record<string, string> = {
  bogota: "border-bogota",
  medellin: "border-medellin",
  cartagena: "border-cartagena",
};

const accentTextClass: Record<string, string> = {
  bogota: "text-bogota",
  medellin: "text-medellin",
  cartagena: "text-cartagena",
};

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % 3), 4000);
    return () => clearInterval(id);
  }, []);

  const scrollToCity = () => {
    document.getElementById("cities")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="font-mono font-bold text-primary tracking-[0.25em] text-xs sm:text-sm">
            ME GUSTA COLOMBIA
          </span>
          <a
            href="#cities"
            onClick={(e) => {
              e.preventDefault();
              scrollToCity();
            }}
            className="font-mono text-xs text-primary hover:text-primary/80 transition-colors tracking-wider"
          >
            GET INTEL →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {heroBgs.map((bg, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: bgIndex === i ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center py-32">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-4">
            For travelers who refuse to wing it
          </p>
          <p className="font-mono text-xs sm:text-sm text-primary tracking-[0.3em] mb-6 uppercase">
            Classified // First-Timer Protocol
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Tourists get scammed, overpay, and waste their first 3 days.{" "}
            <span className="text-primary">You won't.</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Every city has cheat codes the locals don't post online. We put them
            in a 72-hour tactical briefing — so you land prepared, not panicked.
          </p>
          <div className="flex items-center justify-center gap-4 font-mono text-xs text-muted-foreground mb-4">
            <span><span className="text-foreground font-bold">2,847+</span> briefed</span>
            <span className="text-border">|</span>
            <span>⭐ <span className="text-foreground font-bold">4.9</span> avg rating</span>
            <span className="text-border">|</span>
            <span><span className="text-foreground font-bold">3</span> cities covered</span>
          </div>
          <p className="italic text-sm text-muted-foreground mb-8">
            Your flight is booked. The clock started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Button
              size="lg"
              className="font-mono tracking-wider text-sm"
              onClick={scrollToCity}
            >
              GET YOUR CITY BRIEFING — $17
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-mono tracking-wider text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <a
                href="https://megustacomco.gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                ALL 3 CITIES — $37 (SAVE 27%)
              </a>
            </Button>
          </div>
          <p className="text-muted-foreground text-xs font-mono">
            Takes 45 minutes to read. Covers your entire first 72 hours.
          </p>
          <ChevronDown className="mx-auto mt-16 w-6 h-6 text-muted-foreground animate-bounce" />
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 text-center">
            What's Inside
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            9 chapters of local intel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((ch) => (
              <div
                key={ch.num}
                className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors"
              >
                <span className="font-mono text-primary text-sm font-bold">
                  {ch.num}
                </span>
                <p className="mt-2 font-semibold text-foreground">{ch.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 text-center">
            Field Reports // Post-Landing Intel
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            They landed prepared. Here's what happened.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-background border border-border rounded-lg p-6 border-l-[3px] border-l-primary hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-xs px-2.5 py-0.5 rounded-full ${badgeBgClass[t.badgeAccent]}`}
                  >
                    {t.badge}
                  </span>
                  <span className="text-primary text-sm tracking-wide">★★★★★</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic mb-3">
                  "{t.quote}"
                </p>
                <p className="text-primary font-bold text-sm mb-4">
                  → {t.keyResult}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {t.name} · {t.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOSS AVERSION */}
      <section className="py-20 sm:py-28 bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-10 text-center">
            The Cost of Not Knowing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lossStats.map((stat, i) => (
              <div
                key={i}
                className={`rounded-lg p-6 sm:p-8 text-center border ${
                  stat.highlight
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background"
                }`}
              >
                <p
                  className={`text-4xl sm:text-5xl font-extrabold mb-3 ${
                    stat.highlight ? "text-primary" : "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    stat.highlight ? "text-primary/80" : "text-muted-foreground"
                  }`}
                >
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITY CARDS */}
      <section id="cities" className="py-20 sm:py-28 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 text-center">
            Choose Your Briefing
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            City Survival Vaults
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div
                key={city.code}
                className={`rounded-lg overflow-hidden border-2 transition-all ${
                  city.available
                    ? `${accentBorderClass[city.accent]} hover:scale-[1.02]`
                    : "border-border opacity-40 cursor-not-allowed"
                }`}
              >
                {city.available && city.banner ? (
                  <div className="relative h-36 sm:h-40 overflow-hidden">
                    <img
                      src={city.banner}
                      alt={`${city.name} survival guide`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="font-mono text-xs text-primary tracking-wider">
                        {city.code}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-36 sm:h-40 bg-secondary flex items-center justify-center">
                    <span className="font-mono text-xs text-muted-foreground tracking-wider">
                      {city.code}
                    </span>
                  </div>
                )}
                <div className="p-5 bg-card">
                  <h3
                    className={`text-xl font-bold mb-1 ${
                      city.available
                        ? accentTextClass[city.accent]
                        : "text-muted-foreground"
                    }`}
                  >
                    {city.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    {city.tagline}
                  </p>
                  {city.available ? (
                    <a
                      href={city.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        className="w-full font-mono tracking-wider text-sm"
                        size="sm"
                      >
                        GET INTEL — {city.price}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      className="w-full font-mono tracking-wider text-sm"
                      size="sm"
                      disabled
                      variant="secondary"
                    >
                      COMING SOON
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLE */}
      <section className="py-20 sm:py-28 bg-card">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3">
            Explorer Bundle
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
            3 cities. One download. Save 27%.
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-2xl text-muted-foreground line-through">
              $51
            </span>
            <span className="text-5xl sm:text-6xl font-extrabold text-primary">
              $37
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-8">
            Bogotá + Medellín + Cartagena — everything you need before you land.
          </p>
          <Button
            size="lg"
            className="font-mono tracking-wider text-sm px-10"
            asChild
          >
            <a
              href="https://megustacomco.gumroad.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GET THE EXPLORER BUNDLE
            </a>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 text-center">
            Intel Briefing
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-lg px-5 bg-card"
              >
                <AccordionTrigger className="font-mono text-sm text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-mono font-bold text-primary tracking-[0.25em] text-xs">
                ME GUSTA COLOMBIA
              </span>
              <p className="text-muted-foreground text-xs mt-1">
                <a
                  href="mailto:hola@megusta.com.co"
                  className="hover:text-primary transition-colors"
                >
                  hola@megusta.com.co
                </a>
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { name: "Pinterest", url: "https://pinterest.com" },
                { name: "Facebook", url: "https://facebook.com" },
                { name: "Instagram", url: "https://instagram.com" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors tracking-wider"
                >
                  {s.name.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-8">
            © {new Date().getFullYear()} Me Gusta Colombia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
