import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function CTASection() {
  return (
    <section className="relative px-6 py-24">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/50 via-card/50 to-blue-950/50 p-12 text-center backdrop-blur-xl sm:p-16">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -top-20 -left-20 h-60 w-60 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-blue-600/15 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Free to Start
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Ready to Add AI to{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Your Website?
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Create your first chatbot in under 5 minutes. No credit card
            required. Start with our generous free tier.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup">
              <Button
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-violet-600 to-blue-600 text-base text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/40 active:scale-[0.98]"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4.5 w-4.5 transition-transform group-hover/button:translate-x-0.5" />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
