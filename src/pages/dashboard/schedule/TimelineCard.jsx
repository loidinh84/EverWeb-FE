import { Pencil } from "lucide-react";

export default function TimelineCard({ events = [], onEditTimeline }) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#2C2117]">
            Kịch bản chi tiết ngày cưới (20/12/2026)
          </h2>
          <p className="mt-0.5 text-[11px] text-[#8C7A68]">
            Tiến trình lễ cưới · {events.length} khung giờ chính
          </p>
        </div>

        <button
          type="button"
          onClick={onEditTimeline}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#E2D9CB] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#2C2117] transition hover:border-[#C5A059]"
        >
          <Pencil size={11} />
          Chỉnh sửa timeline
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {events.map((ev, idx) => {
          const isLast = idx === events.length - 1;
          return (
            <div key={ev.id} className="relative flex gap-4">
              {/* Time */}
              <span className="w-11 shrink-0 pt-0.5 text-xs font-bold text-[#2C2117] tabular-nums">
                {ev.time}
              </span>

              {/* Line + Dot */}
              <div className="relative flex flex-col items-center">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[#C5A059] bg-white" />
                {!isLast && (
                  <span className="mt-1 h-full w-px bg-[#E6DFD3]" />
                )}
              </div>

              {/* Content */}
              <div className="flex min-w-0 flex-1 items-start justify-between gap-2 pb-1">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#2C2117]">
                    {ev.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#7D6D5E]">
                    {ev.location}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#9C8B7A]">
                    {ev.description}
                  </p>
                </div>

                <span className="shrink-0 rounded-md border border-[#EAE3D8] bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-medium text-[#6D5B4B]">
                  {ev.owners}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
