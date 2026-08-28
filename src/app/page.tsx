import { DownloadCta, Footer } from "@/components/DownloadCta";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <Header />
      <main>
        <Hero />
        <FeatureGrid />
        <DownloadCta />
      </main>
      <Footer />
    </div>
  );
}
