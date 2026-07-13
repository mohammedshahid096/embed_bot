import { useState, useEffect, useRef } from "react";
import { Bot, User, Send, X, MessageCircle } from "lucide-react";

const demoMessages = [
  {
    role: "user" as const,
    text: "What products do you sell?",
  },
  {
    role: "bot" as const,
    text: "We offer a wide range of products including electronics, home appliances, and accessories. Our bestsellers include wireless headphones, smart home devices, and premium laptop stands. Would you like me to help you find something specific?",
  },
  {
    role: "user" as const,
    text: "Do you have a return policy?",
  },
  {
    role: "bot" as const,
    text: "Yes! We offer a 30-day hassle-free return policy. If you're not satisfied with your purchase, simply initiate a return from your dashboard. Refunds are processed within 3-5 business days.",
  },
];

function ChatPreviewSection() {
  const [visibleMessages, setVisibleMessages] = useState<typeof demoMessages>(
    [],
  );
  const [isTyping, setIsTyping] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateMessages();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleMessages, isTyping]);

  const animateMessages = () => {
    let index = 0;
    const showNext = () => {
      if (index < demoMessages.length) {
        const msg = demoMessages[index];
        if (msg.role === "bot") {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages((prev) => [...prev, msg]);
            index++;
            setTimeout(showNext, 1200);
          }, 1500);
        } else {
          setVisibleMessages((prev) => [...prev, msg]);
          index++;
          setTimeout(showNext, 800);
        }
      }
    };
    setTimeout(showNext, 600);
  };

  return (
    <section ref={sectionRef} id="demo" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Text */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
              Live Preview
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              See It{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                In Action
              </span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Your chatbot instantly understands your website content and
              provides accurate, contextual responses to visitor queries — 24/7,
              with zero manual effort.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Answers from your own crawled data",
                "Natural, conversational responses",
                "Handles FAQs, product info & support",
                "Customizable look & feel",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Chat Widget Preview */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Glow effect behind the widget */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
            </div>

            {/* Chat Widget */}
            <div className="relative w-full max-w-sm">
              {chatOpen ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-violet-600/20 to-blue-600/20 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                          <Bot className="h-4.5 w-4.5 text-white" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          EmbedBot
                        </p>
                        <p className="text-xs text-emerald-400">Online</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChatOpen(false)}
                      className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div
                    className="h-80 overflow-y-auto px-4 py-4 space-y-3"
                    ref={scrollRef}
                  >
                    {/* Welcome message */}
                    <div className="flex gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-muted/50 px-3.5 py-2.5 text-sm text-foreground">
                        Hi! 👋 I'm your AI assistant. Ask me anything about this
                        website!
                      </div>
                    </div>

                    {visibleMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-2.5 animate-in fade-in ${
                          msg.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {msg.role === "bot" ? (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                            <Bot className="h-3.5 w-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                            msg.role === "user"
                              ? "rounded-tr-md bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                              : "rounded-tl-md bg-muted/50 text-foreground"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex gap-2.5 animate-in fade-in">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                          <Bot className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="rounded-2xl rounded-tl-md bg-muted/50 px-4 py-3">
                          <div className="flex gap-1">
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="border-t border-white/5 px-4 py-3">
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-muted/30 px-3.5 py-2.5">
                      <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                        readOnly
                      />
                      <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white transition-all hover:from-violet-500 hover:to-blue-500">
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Floating chat button when closed */
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setChatOpen(true);
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 shadow-xl shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-violet-500/40"
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatPreviewSection;
