import { FileText, Globe, Upload, ArrowRight, Cpu, MessageCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Add Your Data",
    description:
      "Upload documents, PDFs, or paste URLs. Our crawler indexes your website content automatically.",
    details: ["PDF & document upload", "Website crawling", "Custom text datasets"],
    gradient: "from-violet-600 to-purple-600",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Processes & Embeds",
    description:
      "Your data is chunked, embedded, and stored in ChromaDB for semantic search and retrieval.",
    details: ["Text chunking & embedding", "ChromaDB vector storage", "Semantic indexing"],
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    step: "03",
    icon: MessageCircle,
    title: "Deploy & Chat",
    description:
      "Paste a single script tag on your site. Your chatbot is live and ready to answer questions.",
    details: ["One-line embed script", "Real-time conversations", "Context-aware answers"],
    gradient: "from-emerald-600 to-teal-600",
  },
];

function HowItWorksSection() {
  return (
    <section className="relative px-6 py-24">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
            How It Works
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Three Steps to Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Chatbot
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From raw data to a live chatbot in minutes — no ML expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute top-14 right-0 hidden h-px w-8 translate-x-full bg-gradient-to-r from-white/10 to-transparent lg:block" />
              )}

              <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-card/50">
                {/* Step number */}
                <div className="absolute top-6 right-6 text-5xl font-black text-white/[0.03] select-none">
                  {item.step}
                </div>

                <div
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {/* Detail list */}
                <ul className="mt-5 space-y-2">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="h-3 w-3 text-violet-400" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
