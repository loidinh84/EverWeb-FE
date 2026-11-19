import { Download, Heart, Printer } from "lucide-react";

const QUICK_AMOUNTS = ["200.000đ", "500.000đ", "1.000.000đ", "Tuỳ chọn"];

export function VietQrPreview() {
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-xl border border-[#E6DFD3] bg-white p-2">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full text-[#2C2117]"
        aria-label="Mã VietQR"
      >
        <rect x="4" y="4" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="11" y="11" width="12" height="12" rx="1" fill="currentColor" />
        <rect x="70" y="4" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="77" y="11" width="12" height="12" rx="1" fill="currentColor" />
        <rect x="4" y="70" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="11" y="77" width="12" height="12" rx="1" fill="currentColor" />
        <path
          d="M38 8h8v8h-8zM52 8h10v6H52zM38 22h12v6H38zM56 22h6v10h-6zM8 38h10v6H8zM24 38h8v12h-8zM68 38h10v8H68zM84 38h12v6H84zM68 54h14v6H68zM86 52h10v12H86zM8 52h12v10H8zM38 68h8v10h-8zM52 70h12v6H52zM70 70h10v10H70zM86 72h10v12H86zM38 84h14v10H38zM60 84h12v10H60zM78 88h14v6H78z"
          fill="currentColor"
        />
      </svg>
      <div className="absolute flex h-7 w-7 items-center justify-center rounded-full border border-[#E6DFD3] bg-[#FBF5EA] text-[#B88B3E] shadow-2xs">
        <Heart size={13} className="fill-current" />
      </div>
    </div>
  );
}

export default function VietQrCard({
  selectedAmount,
  onSelectAmount,
  onDownload,
  onPrint,
}) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <h2 className="text-sm font-semibold text-[#2C2117]">
        Mã QR Mừng Cưới (VietQR)
      </h2>

      <div className="mt-4 flex items-center gap-4">
        <VietQrPreview />
        <div className="min-w-0 space-y-1 text-xs">
          <p className="text-[11px] text-[#9C8B7A]">Receiver</p>
          <p className="text-sm font-bold text-[#2C2117]">Wedding VietQR</p>
          <p className="text-[#5E5042]">Ngân hàng Vietcombank (VCB)</p>
          <p className="font-medium text-[#2C2117] tabular-nums">
            STK 102456789
          </p>
          <p className="text-[#5E5042]">Chủ TK Nguyễn Đức Nam</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {QUICK_AMOUNTS.map((amt) => {
          const isSelected = selectedAmount === amt;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => onSelectAmount?.(amt)}
              className={`rounded-lg border px-2 py-1.5 text-[11px] font-medium transition tabular-nums ${
                isSelected
                  ? "border-[#C5A059] bg-[#FBF5EA] text-[#8A6121]"
                  : "border-[#E6DFD3] bg-white text-[#5E5042] hover:bg-[#FAF7F2]"
              }`}
            >
              {amt}
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E2D9CB] bg-white py-2 text-xs font-semibold text-[#2C2117] transition hover:bg-[#FAF7F2]"
        >
          <Download size={13} />
          Tải mã QR
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EFEAE1] py-2 text-xs font-semibold text-[#3B2A1A] transition hover:bg-[#E5DEC9]"
        >
          <Printer size={13} />
          In bộ nhận diện
        </button>
      </div>
    </div>
  );
}
