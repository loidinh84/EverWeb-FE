import LandingNavbar from "./LandingNavbar";
import ScrollHero from "./ScrollHero";
import FeatureShowcase from "./FeatureShowcase";
import AiChatShowcase from "./AiChatShowcase";
import MessagingShowcase from "./MessagingShowcase";
import SeatingShowcase from "./SeatingShowcase";
import LandingFooter from "./LandingFooter";

export default function Landing({ onOpenDashboard }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#FAF8F5] text-[#231F1C]">
      <LandingNavbar onOpenDashboard={onOpenDashboard} />
      <ScrollHero onOpenDashboard={onOpenDashboard} />

      <main className="relative z-10 bg-[#FAF8F5]">
        <FeatureShowcase />
        <AiChatShowcase />
        <MessagingShowcase />
        <SeatingShowcase />
      </main>

      <LandingFooter onOpenDashboard={onOpenDashboard} />
    </div>
  );
}
