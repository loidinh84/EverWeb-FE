import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import WebsiteDesignPage from "../features/WebsiteDesignPage";
import { ROUTE_PATHS } from "../../constants/roles";

export default function WebsitePreviewPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <WebsiteDesignPage previewOnly />
      <button
        type="button"
        onClick={() => navigate(ROUTE_PATHS.WEBSITE_DESIGN)}
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#1F1A17] shadow-lg border border-stone-200 backdrop-blur-sm transition hover:bg-stone-50 cursor-pointer"
      >
        <ArrowLeft size={14} />
        Quay lại thiết kế
      </button>
    </div>
  );
}
