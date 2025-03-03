import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Services } from "@/components/landing/Services";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

import "./globals.css";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default Home;
