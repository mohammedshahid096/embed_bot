import { Link } from "react-router-dom";
import { ArrowRight, Zap, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function HeroSection() {
  const [copied, setCopied] = useState(false);
  const scriptSnippet = `<script src="https://cdn.embedbot.ai/widget.js" data-bot-id="YOUR_BOT_ID"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/12 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-indigo-600/8 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 backdrop-blur-sm">
          <Zap className="h-3.5 w-3.5" />
          <span>AI-Powered Chatbot for Your Website</span>
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Embed an AI Chatbot on{" "}
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Any Website
          </span>{" "}
          in Seconds
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Train your chatbot with your own data — documents, website crawling, or custom datasets.
          Just paste one script tag, and your AI assistant is live.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link to="/signup">
            <Button
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-violet-600 to-blue-600 text-base text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/40 active:scale-[0.98]"
            >
              Start for Free
              <ArrowRight className="ml-2 h-4.5 w-4.5 transition-transform group-hover/button:translate-x-0.5" />
            </Button>
          </Link>
          <a href="#demo">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              Watch Demo
            </Button>
          </a>
        </div>

        {/* Script Snippet Preview */}
        <div className="mt-16 w-full max-w-2xl">
          <p className="mb-3 text-sm text-muted-foreground">
            It&apos;s this simple — just paste this into your site:
          </p>
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/60 backdrop-blur-xl transition-all hover:border-violet-500/30">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground/60">index.html</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto px-5 py-4 text-left">
              <code className="text-sm leading-relaxed">
                <span className="text-muted-foreground/50">&lt;</span>
                <span className="text-blue-400">script</span>{" "}
                <span className="text-violet-400">src</span>
                <span className="text-muted-foreground/50">=</span>
                <span className="text-emerald-400">"https://cdn.embedbot.ai/widget.js"</span>{" "}
                <span className="text-violet-400">data-bot-id</span>
                <span className="text-muted-foreground/50">=</span>
                <span className="text-amber-400">"YOUR_BOT_ID"</span>
                <span className="text-muted-foreground/50">&gt;&lt;/</span>
                <span className="text-blue-400">script</span>
                <span className="text-muted-foreground/50">&gt;</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
