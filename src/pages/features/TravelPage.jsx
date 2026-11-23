import { useState } from "react";
import { Building2, Car, MapPin, Plane, Plus, Star, Utensils } from "lucide-react";
import { Modal, useToast } from "../../components/common";
import FeatureShell from "./FeatureShell";
import { useCurrentWedding, useWeddingFeature } from "./useCurrentWedding";

const INITIAL_HOTELS = [
  { id: "h1", name: "Lotte Hotel Saigon", distance: "Cách sảnh tiệc 1.2 km", stars: 5, price: "2.400.000đ/đêm" },
  { id: "h2", name: "Sheraton Saigon Grand", distance: "Cách sảnh tiệc 1.8 km", stars: 5, price: "3.100.000đ/đêm" },
  { id: "h3", name: "Silverland Sakyo Hotel", distance: "Cách sảnh tiệc 800m", stars: 4, price: "1.350.000đ/đêm" },
];

const INITIAL_TRAVEL_TIPS = [
  { id: "tr1", title: "Di chuyển từ Sân bay Tân Sơn Nhất", detail: "Khoảng 25 phút đi taxi/Grab tới khu vực sảnh tiệc.", icon: Plane },
  { id: "tr2", title: "Xe đưa đón khách mời miễn phí", detail: "Khởi hành lúc 16:45 từ điểm đón trung tâm Quận 1.", icon: Car },
  { id: "tr3", title: "Gợi ý quán ăn & tham quan", detail: "6 địa điểm ẩm thực nổi bật quanh khu vực Bình Thạnh & Q.1.", icon: Utensils },
];

export default function TravelPage() {
  const toast = useToast();
  const { wedding } = useCurrentWedding();

  const { data: travelData, saveSection } = useWeddingFeature(
    wedding,
    "travel_config",
    {
      hotels: INITIAL_HOTELS,
      guestNote:
        "Quý khách ở xa có thể đặt phòng tại các khách sạn gợi ý bên dưới để nhận mã ưu đãi riêng của lễ cưới.",
    }
  );

  const [tab, setTab] = useState("stay");
  const hotels = travelData.hotels || INITIAL_HOTELS;
  const note = travelData.guestNote || "";
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [hotelForm, setHotelForm] = useState({ name: "", distance: "", price: "" });

  const setHotels = (updater) =>
    saveSection((prev) => ({
      ...prev,
      hotels:
        typeof updater === "function"
          ? updater(prev.hotels || INITIAL_HOTELS)
          : updater,
    }));
  const setNote = (val) => saveSection({ guestNote: val });

  const handleAddHotel = (e) => {
    e.preventDefault();
    if (!hotelForm.name.trim()) return;
    setHotels((prev) => [
      {
        id: `h-${Date.now()}`,
        name: hotelForm.name.trim(),
        distance: hotelForm.distance.trim() || "Gần sảnh tiệc",
        stars: 4,
        price: hotelForm.price.trim() || "Liên hệ",
      },
      ...prev,
    ]);
    toast.success("Đã thêm khách sạn gợi ý");
    setHotelForm({ name: "", distance: "", price: "" });
    setIsAddOpen(false);
  };

  return (
    <FeatureShell
      title="Di chuyển & Nơi lưu trú"
      subtitle={`Địa điểm tiệc: ${wedding?.venue_name || "Sảnh Hoa Mai - TP. Hồ Chí Minh"}`}
      wedding={wedding}
      actions={
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#3B52DE] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2]"
        >
          <Plus size={14} /> Thêm khách sạn
        </button>
      }
    >
      <div className="mb-5 flex gap-4 border-b border-[#EAE3D8]">
        {[
          { key: "stay", label: `Nơi lưu trú (${hotels.length})` },
          { key: "travel", label: `Hướng dẫn di chuyển (${INITIAL_TRAVEL_TIPS.length})` },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`border-b-2 pb-2.5 text-xs font-semibold transition ${
              tab === t.key
                ? "border-[#3B52DE] text-[#3B52DE]"
                : "border-transparent text-[#8C7A68] hover:text-[#2C2117]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stay" ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
            <label className="mb-1.5 block text-xs font-semibold text-[#2C2117]">
              Lời nhắn cho khách ở xa
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-[#E2D9CB] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2C2117] outline-none focus:border-[#3B52DE] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {hotels.map((h) => (
              <div
                key={h.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E6DFD3] bg-white p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#3B52DE]">
                      <Building2 size={18} />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <Star size={12} className="fill-current" /> {h.stars}.0
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-[#2C2117]">{h.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#8C7A68]">
                    <MapPin size={12} /> {h.distance}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#F1ECE3] pt-3 text-xs">
                  <span className="font-semibold text-[#2C2117] tabular-nums">
                    {h.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.info(`Đã sao chép thông tin ${h.name}`)}
                    className="font-semibold text-[#3B52DE] hover:underline"
                  >
                    Chia sẻ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {INITIAL_TRAVEL_TIPS.map(({ id, title, detail, icon: Icon }) => (
            <div key={id} className="rounded-2xl border border-[#E6DFD3] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#3B52DE]">
                <Icon size={18} />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#2C2117]">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#6D5B4B]">
                {detail}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm khách sạn gợi ý"
        size="sm"
      >
        <form onSubmit={handleAddHotel} className="space-y-3.5">
          <input
            type="text"
            value={hotelForm.name}
            onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
            placeholder="Tên khách sạn"
            className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
            autoFocus
          />
          <input
            type="text"
            value={hotelForm.distance}
            onChange={(e) => setHotelForm({ ...hotelForm, distance: e.target.value })}
            placeholder="Khoảng cách (VD: Cách sảnh 1 km)"
            className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
          />
          <input
            type="text"
            value={hotelForm.price}
            onChange={(e) => setHotelForm({ ...hotelForm, price: e.target.value })}
            placeholder="Giá tham khảo (VD: 1.500.000đ/đêm)"
            className="w-full rounded-xl border border-[#E2D9CB] px-3 py-2 text-sm outline-none focus:border-[#3B52DE]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-lg border border-[#E2D9CB] px-4 py-2 text-xs font-medium"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3B52DE] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F43C2]"
            >
              Thêm
            </button>
          </div>
        </form>
      </Modal>
    </FeatureShell>
  );
}
