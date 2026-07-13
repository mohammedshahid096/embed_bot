import {
  Navbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  ChatPreviewSection,
  CTASection,
  Footer,
} from "../features/home";

function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-violet-500/30">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ChatPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
