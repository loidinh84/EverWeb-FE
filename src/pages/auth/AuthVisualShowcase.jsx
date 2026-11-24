import heroWedding from "../../assets/image/hero-wedding.jpg";
import weddingCouple from "../../assets/image/wedding-couple.jpg";
import galleryBouquet from "../../assets/image/gallery-bouquet.jpg";

export default function AuthVisualShowcase() {
  return (
    <div className="hidden lg:flex lg:col-span-7 flex-col justify-center bg-[#F4F6FA] p-8 xl:p-12 relative overflow-hidden select-none">
      {/* Soft pastel background glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-pink-100/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl space-y-5">
        {/* Top Row: RSVP Card + Stationery Collage */}
        <div className="grid grid-cols-2 gap-5 items-stretch">
          {/* Card 1: RSVP / Guest Tracker Widget */}
          <div className="flex flex-col justify-between rounded-3xl border border-stone-200/60 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-4">
              {/* Vertical Avatar Stack */}
              <div className="flex flex-col -space-y-1.5 rounded-full bg-[#FAF8F5] p-1 border border-stone-100 shadow-2xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E57373] text-[10px] font-bold text-white ring-2 ring-white overflow-hidden">
                  <img src={heroWedding} alt="guest" className="h-full w-full object-cover" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#81C784] text-[10px] font-bold text-white ring-2 ring-white overflow-hidden">
                  <img src={weddingCouple} alt="guest" className="h-full w-full object-cover" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFB74D] text-[10px] font-bold text-white ring-2 ring-white overflow-hidden">
                  <img src={galleryBouquet} alt="guest" className="h-full w-full object-cover" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#64B5F6] text-[10px] font-bold text-white ring-2 ring-white">
                  +4
                </div>
              </div>

              {/* Counts */}
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-4">
                  <div>
                    <p className="font-display text-3xl font-semibold text-[#1F1A17] leading-none">
                      95
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-stone-500">
                      Tổng khách mời
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-3xl font-semibold text-[#1F1A17] leading-none">
                      16
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-stone-500">
                      Hộ gia đình
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Pills */}
            <div className="mt-5 space-y-2">
              <div className="rounded-xl bg-[#F7F5F0] px-3.5 py-2 text-xs font-medium text-stone-700">
                <span className="font-bold text-[#1F1A17]">60</span> Tham dự
              </div>
              <div className="rounded-xl bg-[#F7F5F0] px-3.5 py-2 text-xs font-medium text-stone-700">
                <span className="font-bold text-[#1F1A17]">25</span> Không tham dự
              </div>
            </div>
          </div>

          {/* Card 2: Stationery / Invitation Cards Grid */}
          <div className="rounded-3xl border border-stone-200/60 bg-white p-3 shadow-xs">
            <div className="grid grid-cols-3 gap-2 h-full">
              {/* 1: Navy Monogram Card */}
              <div className="flex flex-col justify-between rounded-xl bg-[#142036] p-2 text-center text-white shadow-2xs aspect-[3/4]">
                <p className="font-display text-base font-bold tracking-widest text-[#E6C687]">
                  M&R
                </p>
                <p className="text-[7px] uppercase tracking-wider text-white/80">
                  Save The Date
                </p>
              </div>

              {/* 2: Lime Modern Card */}
              <div className="flex flex-col justify-between rounded-xl bg-[#C7F438] p-2 text-center text-[#1E380C] shadow-2xs aspect-[3/4]">
                <p className="font-bold text-[8px] leading-tight uppercase">
                  Celeste & Steven
                </p>
                <p className="text-[7px] font-mono tracking-tighter">
                  03 . 22 . 27
                </p>
              </div>

              {/* 3: Beach Photo Card */}
              <div className="relative rounded-xl overflow-hidden shadow-2xs aspect-[3/4]">
                <img src={heroWedding} alt="beach" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/25 flex items-end justify-center p-1.5">
                  <p className="font-display italic text-[8px] text-white">
                    Save The Date
                  </p>
                </div>
              </div>

              {/* 4: Arch Terracotta Card */}
              <div className="flex flex-col justify-between rounded-t-full rounded-b-xl bg-[#B88764] p-2 text-center text-white shadow-2xs aspect-[3/4]">
                <p className="pt-2 font-display italic text-[8px]">
                  save the date
                </p>
                <p className="text-[7px] uppercase tracking-wider text-white/80 pb-1">
                  09 . 14 . 26
                </p>
              </div>

              {/* 5: 3-Photo Strip Card */}
              <div className="flex flex-col justify-between rounded-xl bg-[#FAF8F5] border border-stone-200 p-1.5 text-center shadow-2xs aspect-[3/4]">
                <div className="grid grid-cols-3 gap-0.5 h-12 overflow-hidden rounded">
                  <img src={weddingCouple} alt="moment 1" className="h-full w-full object-cover" />
                  <img src={galleryBouquet} alt="moment 2" className="h-full w-full object-cover" />
                  <img src={heroWedding} alt="moment 3" className="h-full w-full object-cover" />
                </div>
                <p className="font-display font-bold text-[9px] text-[#1F1A17] tracking-tight">
                  10 . 23 . 26
                </p>
              </div>

              {/* 6: Floral Botanical Card */}
              <div className="flex flex-col justify-between rounded-xl bg-white border border-stone-200 p-1.5 text-center shadow-2xs aspect-[3/4]">
                <div className="h-3 w-full bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200 rounded-t opacity-70" />
                <div>
                  <p className="font-display text-[8px] font-semibold tracking-wider text-[#1F1A17] uppercase">
                    Melissa & Greyson
                  </p>
                  <p className="text-[6px] text-stone-400 mt-0.5">Formal Invitation</p>
                </div>
                <div className="h-2 w-full bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200 rounded-b opacity-70" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Card: Laptop Website Builder Preview */}
        <div className="relative rounded-3xl border border-stone-200/60 bg-gradient-to-tr from-[#FBECE6] via-[#F4F6FC] to-[#EBF0F8] p-6 shadow-xs overflow-hidden flex flex-col items-center justify-center">
          {/* Laptop Shell */}
          <div className="relative w-[84%] max-w-[460px] rounded-t-xl border-[5px] border-[#231F1C] bg-[#231F1C] shadow-2xl">
            {/* Screen Top Bezel Dot */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-stone-600" />

            {/* Screen Content */}
            <div className="overflow-hidden rounded-t bg-[#FFE6ED]">
              {/* Website Navigation Header */}
              <div className="flex items-center justify-between bg-[#FFD6E2] px-3 py-1.5 border-b border-pink-200/60">
                <p className="font-sans font-black text-xs tracking-tight text-[#1635D6]">
                  Alina & Marko
                </p>
                <div className="hidden sm:flex items-center gap-2 text-[7px] font-semibold text-[#1635D6]/80">
                  <span>Welcome</span>
                  <span>Our Story</span>
                  <span>Schedule</span>
                  <span>Q&A</span>
                  <span>Photos</span>
                  <span>Registry</span>
                  <span>RSVP</span>
                </div>
              </div>

              {/* Website Hero Couple Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={weddingCouple}
                  alt="Alina and Marko"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Laptop Keyboard Base */}
            <div className="h-2.5 w-full bg-[#1A1816] rounded-b flex items-center justify-center">
              <div className="h-0.5 w-12 bg-stone-700 rounded-full" />
            </div>
          </div>

          {/* Floating Left: Typography Card */}
          <div className="absolute left-3 xl:left-5 top-1/2 -translate-y-1/2 rounded-2xl bg-white/90 p-3 shadow-lg border border-white/80 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1.5">
              Kiểu chữ
            </p>
            <div className="space-y-1 text-xs text-[#1F1A17]">
              <p className="font-serif tracking-widest text-[11px]">CINZEL</p>
              <p className="italic font-serif text-[11px]">Pinyon Script</p>
              <p className="font-display font-medium text-[11px]">Playfair Display</p>
              <p className="italic text-[10px] text-stone-600">Cedarville Cursive</p>
            </div>
          </div>

          {/* Floating Right: Color Picker Card */}
          <div className="absolute right-3 xl:right-5 top-1/2 -translate-y-1/2 rounded-2xl bg-white/90 p-3 shadow-lg border border-white/80 backdrop-blur-md">
            <div className="space-y-2 text-[10px]">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-stone-600">Màu chữ</span>
                <span className="h-3.5 w-3.5 rounded bg-[#1635D6] ring-1 ring-stone-300" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-stone-600">Màu nền</span>
                <span className="h-3.5 w-3.5 rounded bg-[#FFD6E2] ring-1 ring-stone-300" />
              </div>
              <div className="pt-1.5 border-t border-stone-200/60">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#131F37]" />
                  <span className="h-3 w-3 rounded-full bg-[#1635D6]" />
                  <span className="h-3 w-3 rounded-full bg-[#7093EB]" />
                  <span className="h-3 w-3 rounded-full bg-[#FCE8E6]" />
                  <span className="h-3 w-3 rounded-full bg-[#D89874]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

