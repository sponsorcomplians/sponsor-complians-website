/**
 * All 34 testimonials — consolidated from client feedback document.
 * Each testimonial is categorised and assigned a pastel colour palette.
 *
 * Categories → Pastel Colours:
 *   Support  → Orange  (#FFF3E0 bg, #E65100 accent)
 *   Compliance → Green (#E8F5E9 bg, #2E7D32 accent)
 *   Training → Purple (#F3E5F5 bg, #6A1B9A accent)
 *   General  → Red    (#FFEBEE bg, #C62828 accent)
 */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  source: string;
  category: "support" | "compliance" | "training" | "general";
}

export const PASTEL_COLORS = {
  support: {
    bg: "#FFF8F0",
    accent: "#D4793A",
    border: "#FFECD6",
    badge: "#F0A060",
    badgeBg: "#FFF8F0",
    label: "Support",
  },
  compliance: {
    bg: "#F2FAF3",
    accent: "#4A9E5C",
    border: "#D8F0DB",
    badge: "#6BBF7B",
    badgeBg: "#F2FAF3",
    label: "Compliance",
  },
  training: {
    bg: "#F9F0FC",
    accent: "#9B5CB8",
    border: "#EDDCF4",
    badge: "#B87FD0",
    badgeBg: "#F9F0FC",
    label: "Training",
  },
  general: {
    bg: "#FFF2F2",
    accent: "#D45858",
    border: "#FFDEDE",
    badge: "#EF7B7B",
    badgeBg: "#FFF2F2",
    label: "General",
  },
} as const;

export const allTestimonials: Testimonial[] = [
  // ─── SUPPORT (Orange) ───
  {
    quote: "The CoS request for our workforce expansion was handled accurately and efficiently. It allowed us to grow without compliance fear.",
    name: "Cindy Murimi",
    role: "HR",
    company: "Southvale Care Ltd",
    source: "Phone / Call",
    category: "support",
  },
  {
    quote: "The CoS support was smooth and efficient. We felt reassured knowing everything was handled correctly.",
    name: "Ifeoma Akubue",
    role: "Director",
    company: "Nwando Care",
    source: "Phone / Call",
    category: "support",
  },
  {
    quote: "The response to the Home Office concerns was detailed and strategic. We felt heard, represented and properly defended.",
    name: "Andrew Maguraushe",
    role: "Director",
    company: "Leelin Ltd",
    source: "Phone / Call",
    category: "support",
  },
  {
    quote: "The consultancy support went far beyond basic advice. Recruitment, HR and sponsor duties were aligned into one structured system. It transformed how we manage compliance internally.",
    name: "Ada Bamisedun",
    role: "Director",
    company: "Keeva Care Ltd",
    source: "Email",
    category: "support",
  },
  {
    quote: "The CoS assignments and visa applications were handled with absolute precision. We trusted the process completely. That peace of mind is invaluable.",
    name: "Toma Omoma",
    role: "Head of HR",
    company: "Greensleeves Homes Trust",
    source: "Phone / Call",
    category: "support",
  },
  {
    quote: "Facing suspension was one of the most stressful moments in our business. Their representation was clear, composed and powerful. We felt protected and properly guided throughout.",
    name: "Roseline Anyanwu",
    role: "Director",
    company: "Gentle Hands Care Agency Ltd",
    source: "Email",
    category: "support",
  },
  {
    quote: "The concerns email shook us. Their response was strategic, thorough and professionally written. It gave us a fighting chance and restored our confidence.",
    name: "Timothy Frank",
    role: "Director",
    company: "Frank Care Solutions",
    source: "Email",
    category: "support",
  },
  {
    quote: "The CoS and recruitment support removed a huge amount of pressure from our team. Everything was handled correctly and efficiently. It allowed us to focus on care delivery without compliance anxiety.",
    name: "Memory Chiyangwa",
    role: "Director",
    company: "Caring Hearts Support Services",
    source: "Phone / Call",
    category: "support",
  },
  {
    quote: "When we received the 'we have concerns' email, we genuinely feared for our licence. Their response was calm, strategic and incredibly detailed. They constructed a plan and protected our position.",
    name: "Alexandra Sobona",
    role: "Director",
    company: "Beersheba Social Care Services Limited",
    source: "Email",
    category: "support",
  },
  {
    quote: "Our sponsor licence application felt overwhelming and high stakes. They broke it down step by step and made sure nothing was left to chance. The result was approval with confidence.",
    name: "Nicole Tshuma",
    role: "Director",
    company: "Ace24 Healthcare Ltd",
    source: "Email",
    category: "support",
  },
  {
    quote: "Losing our licence would have been catastrophic. Their strategic support during the revoked licence situation gave us direction and strength when we needed it most.",
    name: "Enock Anane",
    role: "Director",
    company: "Oice Support Services Ltd",
    source: "Email",
    category: "support",
  },

  // ─── COMPLIANCE (Green) ───
  {
    quote: "The audit exposed weaknesses we had overlooked. Implementing the recommendations gave us confidence and structure.",
    name: "Olubanke Talabi",
    role: "Director",
    company: "React HCP Ltd",
    source: "Email",
    category: "compliance",
  },
  {
    quote: "The audit and action plan forced us to rebuild properly. We now operate with documented systems and real oversight.",
    name: "Collins Chizanga",
    role: "Director",
    company: "Option Care Ltd",
    source: "Phone / Call",
    category: "compliance",
  },
  {
    quote: "The audit highlighted gaps we had unknowingly normalised. Fixing them has made us stronger and far more confident.",
    name: "Rejoyce Mutepfa",
    role: "Director",
    company: "Living Waters Healthcare Services Limited",
    source: "Email",
    category: "compliance",
  },
  {
    quote: "The audit gave us direct, practical steps to strengthen our licence position. It changed how we view compliance.",
    name: "Evelyn Walters",
    role: "Director",
    company: "Karpe Diem Healthcare Ltd",
    source: "Email",
    category: "compliance",
  },
  {
    quote: "The audit and action plan did more than fix gaps. It helped us build proper compliance infrastructure. We now run a structured system instead of relying on memory.",
    name: "Adebola Folarin",
    role: "Director",
    company: "Fresh Tree Care Services Limited",
    source: "Phone / Call",
    category: "compliance",
  },
  {
    quote: "We assumed our systems were fine until the audit showed otherwise. The improvements were practical and immediately actionable. We are now operating at a completely different standard.",
    name: "Cristine Enriquez",
    role: "Director",
    company: "FeelCare Domiciliary Services Ltd",
    source: "Phone / Call",
    category: "compliance",
  },
  {
    quote: "The Home Office visit could have gone very differently without their preparation. Our files were aligned, our team was confident and our responses were structured. That level of preparation made all the difference.",
    name: "Rafiq Chati",
    role: "Authorising Officer",
    company: "Esteemed Life Care",
    source: "Survey",
    category: "compliance",
  },
  {
    quote: "We were under scrutiny and the pressure was intense. Their audit and structured response restored our confidence. Every issue was addressed properly and nothing was left ambiguous.",
    name: "Sylevester Mandisodza",
    role: "Director",
    company: "Divine Health Services Limited",
    source: "Email",
    category: "compliance",
  },
  {
    quote: "The action plan completely changed how we approach sponsor compliance. It gave us clarity, accountability and a roadmap. We feel prepared instead of exposed.",
    name: "Parveen Goyal",
    role: "Director",
    company: "Cross Lane Care",
    source: "Phone / Call",
    category: "compliance",
  },
  {
    quote: "We realised how vulnerable fragmented systems had made us. The audit forced us to tighten everything up properly. We now operate with real control rather than assumptions.",
    name: "Alfred Blessing",
    role: "Authorising Officer",
    company: "Central Staffing Limited",
    source: "Email",
    category: "compliance",
  },
  {
    quote: "We thought we were compliant until the audit showed us where we were exposed. The action plan did not just point out problems, it rebuilt our structure properly. We now sleep easier knowing our licence is protected.",
    name: "Parveen Goyal",
    role: "Director",
    company: "A Better Carehome",
    source: "Phone / Call",
    category: "compliance",
  },

  // ─── GENERAL (Red) ───
  {
    quote: "Facing suspension was overwhelming. Their representation was composed, detailed and reassuring. We felt supported from start to finish.",
    name: "Hilda Abban",
    role: "Director",
    company: "Rock of Fire Centre Ltd",
    source: "Email",
    category: "general",
  },
  {
    quote: "Very good.",
    name: "Ay Dennis",
    role: "",
    company: "",
    source: "Google Review",
    category: "general",
  },

  // ─── TRAINING (Purple) ───
  {
    quote: "The training for our Authorising Officer and sponsored workers was invaluable. We are no longer nervous about scrutiny because we understand our duties properly.",
    name: "Michelle Nyatito",
    role: "HR",
    company: "Multilink Management Care",
    source: "Survey",
    category: "training",
  },
  {
    quote: "Thank you for the great presentation style Ian, it was really informative. The depth of knowledge on sponsor compliance was exceptional — I now feel confident managing our obligations.",
    name: "Akinbayo Akinyera",
    role: "Care Provider",
    company: "",
    source: "Featured",
    category: "training",
  },
  {
    quote: "The training was very educative and interesting. Ian is a very good trainer — he made complex immigration rules easy to understand. Looking forward to the platform launch.",
    name: "Jibs Tee",
    role: "Registered Manager",
    company: "",
    source: "Featured",
    category: "training",
  },
  {
    quote: "This is honestly more than a training, very relatable and insightful. Thank you for going over and beyond. The manual compliance support has been invaluable for our organisation.",
    name: "Adefehinti Bukola",
    role: "HR Manager",
    company: "",
    source: "Featured",
    category: "training",
  },
  {
    quote: "You are the best professional trainers, I would recommend you to as many organisations as possible. The compliance guidance has kept our licence safe through two Home Office visits.",
    name: "James Wahome",
    role: "Authorising Officer",
    company: "",
    source: "Featured",
    category: "training",
  },
  {
    quote: "Your training and encounter was an eye opener and I just realized that when time, effort, and resources are put together miracles happen. We went from near-suspension to full compliance.",
    name: "Lucy Kirathe",
    role: "Nominated Sponsor",
    company: "",
    source: "Featured",
    category: "training",
  },
  {
    quote: "Extremely useful, very in depth session that leaves you with a greater understanding. Visual resources and high engagement during the sessions. The manual audit service is world class.",
    name: "Tino Lee",
    role: "Operations Director",
    company: "",
    source: "Featured",
    category: "training",
  },
  {
    quote: "Excellent training from great company lead by Ian. I was able to understand what it takes to reach a new destiny through hard work and commitment. We now run a fully compliant sponsorship programme.",
    name: "Duncan Ngugi",
    role: "Care Home Manager",
    company: "",
    source: "Featured",
    category: "training",
  },
  {
    quote: "Very educative and informative, I learnt a lot during the session. Thanks.",
    name: "Yusuf Joel",
    role: "",
    company: "",
    source: "Google Review",
    category: "training",
  },
  {
    quote: "I believed that the training was very insightful and educative.",
    name: "Folami Sandra",
    role: "",
    company: "",
    source: "Google Review",
    category: "training",
  },
];

/** Get testimonials by category */
export function getTestimonialsByCategory(category: Testimonial["category"]) {
  return allTestimonials.filter((t) => t.category === category);
}

/** Get a shuffled subset of testimonials */
export function getRandomTestimonials(count: number) {
  const shuffled = [...allTestimonials].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
