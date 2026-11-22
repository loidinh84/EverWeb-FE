import { Flower2 } from "lucide-react";

export default function AuthLoadingScreen({
  message = "Đang xác thực quyền truy cập...",
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F2EA] px-4 text-[#2C2117]">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#EAE3D8] bg-[#FCFBF8] px-8 py-7 shadow-sm">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F241D] text-[#C5A059] shadow-xs">
          <Flower2 size={22} />
          <span
            aria-hidden="true"
            className="absolute -inset-1.5 animate-spin rounded-2xl border-2 border-[#C5A059]/25 border-t-[#C5A059]"
          />
        </div>
        <div className="text-center">
          <p className="font-display text-xl font-semibold tracking-tight text-[#2C2117]">
            EverWeb
          </p>
          <p className="mt-1 text-xs font-medium text-[#7D6D5E]">{message}</p>
        </div>
      </div>
    </div>
  );
}
