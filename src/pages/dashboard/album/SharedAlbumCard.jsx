import { MoreHorizontal, Search } from "lucide-react";

export default function SharedAlbumCard({
  photos = [],
  searchValue = "",
  onSearchChange,
  onSelectPhoto,
  onViewAll,
}) {
  return (
    <div className="rounded-xl border border-[#E6DFD3] bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#2C2117]">
          Album ảnh chung của khách mời
        </h2>
        <MoreHorizontal size={16} className="text-[#8C7A68]" />
      </div>

      <div className="relative mt-3">
        <Search
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9C8B7A]"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Tìm theo tên khách quét QR gửi ảnh (120 ảnh)..."
          className="w-full rounded-lg border border-[#E6DFD3] bg-[#FAF8F5] py-2 pr-3 pl-8 text-xs text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#C5A059] focus:bg-white"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => onSelectPhoto?.(photo)}
            className="group text-left"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-[#EFEAE1] bg-[#FAF7F2]">
              <img
                src={photo.src}
                alt={`Ảnh của ${photo.author}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-1.5 truncate text-xs font-semibold text-[#2C2117]">
              {photo.author}
            </p>
            <p className="text-[11px] text-[#9C8B7A]">{photo.time}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#6D5B4B] hover:text-[#2C2117]"
      >
        Xem toàn bộ album ›
      </button>
    </div>
  );
}
