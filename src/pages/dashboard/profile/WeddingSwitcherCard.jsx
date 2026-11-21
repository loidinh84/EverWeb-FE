import { AlertTriangle, Check, Plus, Trash2 } from "lucide-react";
import { formatDateVi, getStatusMeta } from "../../../utils/weddingHelpers";

export default function WeddingSwitcherCard({
  weddings,
  selectedWeddingId,
  onSelectWedding,
  onOpenCreate,
  onOpenDelete,
  isDeletingDisabled,
}) {
  return (
    <div className="space-y-5">
      {/* Wedding switcher card */}
      <section className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#2C2117]">
            Hồ sơ đám cưới của bạn
          </h3>
          <span className="rounded-full bg-[#F3ECE1] px-2.5 py-0.5 text-[11px] font-semibold text-[#6D5B4B] tabular-nums">
            {weddings.length} hồ sơ
          </span>
        </div>

        <div className="mt-3.5 max-h-[264px] space-y-2 overflow-y-auto pr-0.5">
          {weddings.map((w) => {
            const isActive = w.id === selectedWeddingId;
            const statusMeta = getStatusMeta(w.status);
            const dateText = formatDateVi(w.wedding_date) || "Chưa có ngày cưới";

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelectWedding(w.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition ${
                  isActive
                    ? "border-[#C5A059] bg-[#FBF5EA]"
                    : "border-[#EAE3D8] bg-[#FCFBF8] hover:border-[#D5C7B2] hover:bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${statusMeta.dotClass}`}
                    />
                    <p className="truncate text-xs font-semibold text-[#2C2117]">
                      {w.title}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate pl-4 text-[11px] text-[#8C7A68]">
                    {dateText}
                    {w.venue_name ? ` · ${w.venue_name}` : ""}
                  </p>
                </div>

                {isActive && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C5A059] text-white">
                    <Check size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#C5A059]/70 bg-[#FCF9F2] px-3.5 py-2 text-xs font-semibold text-[#7A5622] transition hover:border-[#C5A059] hover:bg-[#FBF5EA]"
        >
          <Plus size={14} />
          Tạo hồ sơ cưới mới
        </button>
      </section>

      {/* Danger zone card */}
      <section className="rounded-2xl border border-rose-200/80 bg-[#FFF9F9] p-5">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <AlertTriangle size={15} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-rose-900">Vùng nguy hiểm</h3>
            <p className="mt-1 text-xs leading-relaxed text-rose-700/90">
              Xoá hồ sơ sẽ xoá vĩnh viễn toàn bộ khách mời, sơ đồ bàn, ngân sách,
              công việc và album ảnh của tiệc cưới này.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDelete}
          disabled={isDeletingDisabled}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-white px-3.5 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={14} />
          Xoá hồ sơ đám cưới
        </button>
      </section>
    </div>
  );
}
