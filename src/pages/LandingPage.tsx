// src\pages\LandingPage.tsx

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { FeaturesSection } from "../components/FeaturesSection";
// import { BentoFeatures } from "../components/BentoFeatures";
import { SmartInsights } from "../components/SmartInsights";
import { HowItWorks } from "../components/HowItWorks";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturesSection/>
      {/* <BentoFeatures /> */}
      <SmartInsights />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export { LandingPage };
