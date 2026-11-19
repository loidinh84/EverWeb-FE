export default function ContractProgressCard() {
  const rows = [
    { label: "Đã ký hợp đồng", value: "6 (75%)", pct: 75, color: "#A67C37" },
    { label: "Đang thương thảo", value: "2 (25%)", pct: 25, color: "#DFC796" },
  ];

  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Đánh giá & Tiến độ hợp đồng
      </h2>

      <div className="mt-4 space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#5E5042]">{r.label}</span>
              <span className="font-semibold text-[#2C2117] tabular-nums">
                {r.value}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFEAE1]">
              <div
                className="h-full rounded-full"
                style={{ width: `${r.pct}%`, backgroundColor: r.color }}
              />
            </div>
          </div>
        ))}

        <div className="border-t border-[#F1ECE3] pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#5E5042]">
              Hoàn thành thanh toán
            </span>
            <span className="font-semibold text-[#2C2117] tabular-nums">
              4 / 8 đối tác
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EFEAE1]">
            <div className="h-full w-1/2 rounded-full bg-[#C5A059]" />
          </div>
        </div>
      </div>
    </div>
  );
}
