import { Heart } from "lucide-react";

export default function GuestWishesCard({ wishes = [], onToggleLike }) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Lời chúc & Tin nhắn từ khách mời
      </h2>

      <div className="mt-3 divide-y divide-[#F1ECE3]">
        {wishes.map((w) => (
          <div key={w.id} className="py-3 first:pt-1 last:pb-0">
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFE6D6] text-[10px] font-bold text-[#7A5622]">
                {w.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#2C2117]">{w.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#5E5042]">
                  {w.text}
                </p>
                <button
                  type="button"
                  onClick={() => onToggleLike?.(w.id)}
                  className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium transition ${
                    w.liked ? "text-rose-600" : "text-[#9C8B7A] hover:text-rose-600"
                  }`}
                >
                  <Heart size={11} className={w.liked ? "fill-current" : ""} />
                  {w.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
