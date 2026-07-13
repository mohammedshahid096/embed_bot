import {
  Globe,
  Database,
  MessageSquare,
  Code2,
  Brain,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Website Crawling",
    description:
      "Automatically crawl and index your entire website. Our bot learns your content so it can answer any question about your site.",
    gradient: "from-violet-500 to-purple-600",
    glow: "violet",
  },
  {
    icon: Database,
    title: "Custom Datasets",
    description:
      "Upload PDFs, documents, or any text data. Train your chatbot with your own knowledge base using ChromaDB vector storage.",
    gradient: "from-blue-500 to-cyan-600",
    glow: "blue",
  },
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description:
      "Powered by advanced LLMs, your chatbot provides contextual, natural conversations that delight your visitors.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "emerald",
  },
  {
    icon: Code2,
    title: "One-Line Integration",
    description:
      "Copy and paste a single script tag. Works with React, Vue, WordPress, Shopify — any website, no coding required.",
    gradient: "from-amber-500 to-orange-600",
    glow: "amber",
  },
  {
    icon: Brain,
    title: "ChromaDB Vector Store",
    description:
      "Your data is stored as embeddings in ChromaDB for lightning-fast semantic search and contextually accurate responses.",
    gradient: "from-pink-500 to-rose-600",
    glow: "pink",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data never leaves your control. Self-host or use our cloud — enterprise-grade security with full data ownership.",
    gradient: "from-indigo-500 to-violet-600",
    glow: "indigo",
  },
];

const glowColors: Record<string, string> = {
  violet: "group-hover:shadow-violet-500/20",
  blue: "group-hover:shadow-blue-500/20",
  emerald: "group-hover:shadow-emerald-500/20",
  amber: "group-hover:shadow-amber-500/20",
  pink: "group-hover:shadow-pink-500/20",
  indigo: "group-hover:shadow-indigo-500/20",
};

function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            Features
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Everything You Need to Build{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Smart Chatbots
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From data ingestion to deployment — a complete platform for building
            AI chatbots that actually understand your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-card/40 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-2xl ${glowColors[feature.glow]}`}
            >
              {/* Hover gradient effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div
                className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
              >
                <feature.icon className="h-5 w-5 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
