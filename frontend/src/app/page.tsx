import CTASection from "@/components/landing/CTASection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import ProblemSection from "@/components/landing/ProblemSection";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <DashboardPreview />
      <CTASection />
      <Footer />
    </>
  );
}
