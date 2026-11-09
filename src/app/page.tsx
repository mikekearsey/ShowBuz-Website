import { Footer } from "@/components/DownloadCta";
import { Header } from "@/components/Header";
import { ChairSection } from "@/components/mockup/ChairSection";
import { DepSection } from "@/components/mockup/DepSection";
import { FaqSection } from "@/components/mockup/FaqSection";
import { FinalCall } from "@/components/mockup/FinalCall";
import { MockupHero } from "@/components/mockup/MockupHero";
import { PitSection } from "@/components/mockup/PitSection";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main>
        <MockupHero />
        <PitSection />
        <ChairSection />
        <DepSection />
        <FaqSection />
        <FinalCall />
      </main>
      <Footer />
    </div>
  );
}
