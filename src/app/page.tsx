import { DownloadCta, Footer } from "@/components/DownloadCta";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Objections } from "@/components/Objections";
import { ProofStrip } from "@/components/ProofStrip";

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <Header />
      <main>
        <Hero />
        <ProofStrip />
        <HowItWorks />
        <FeatureGrid />
        <Objections />
        <DownloadCta />
      </main>
      <Footer />
    </div>
  );
}
