export const INITIAL_GUESTS = [];

export const DEFAULT_TABLES = [
  { id: "t1", name: "Bàn 1 · Nhà gái", capacity: 8, guests: [] },
  { id: "t2", name: "Bàn 2 · Nhà trai", capacity: 8, guests: [] },
  { id: "t3", name: "Bàn 3 · Bạn bè", capacity: 8, guests: [] },
  { id: "t4", name: "Bàn 4 · Đồng nghiệp", capacity: 8, guests: [] },
];

export const DEFAULT_MENU_SETS = [
  {
    id: "set-main",
    name: "Thực đơn Tiệc Chính (Mặn)",
    dishes: [
      { id: "d1", course: "Khai vị", name: "Gỏi ngó sen tôm thịt & Chả giò hải sản" },
      { id: "d2", course: "Khai vị", name: "Súp cua măng tây trứng cút" },
      { id: "d3", course: "Món chính", name: "Gà ta quay mật ong & Xôi gấc" },
      { id: "d4", course: "Món chính", name: "Bò nấu tiêu xanh kèm bánh mì" },
      { id: "d5", course: "Món chính", name: "Lẩu hải sản chua cay & Bún tươi" },
      { id: "d6", course: "Tráng miệng", name: "Chè hạt sen long nhãn thanh mát" },
      { id: "d7", course: "Đồ uống", name: "Bia, Nước ngọt, Nước suối" },
    ],
  },
  {
    id: "set-veg",
    name: "Thực đơn Chay Thanh Đạm",
    dishes: [
      { id: "v1", course: "Khai vị", name: "Gỏi nấm bào ngư & Chả giò chay" },
      { id: "v2", course: "Khai vị", name: "Súp bí đỏ kem tươi hạt bí" },
      { id: "v3", course: "Món chính", name: "Đậu hũ non sốt nấm đông cô" },
      { id: "v4", course: "Món chính", name: "Lẩu nấm thiên nhiên & Mì udon" },
      { id: "v5", course: "Tráng miệng", name: "Rau câu dừa lá dứa" },
      { id: "v6", course: "Đồ uống", name: "Trà hoa cúc & Nước suối" },
    ],
  },
  {
    id: "set-vip",
    name: "Thực đơn VIP Đặc Biệt",
    dishes: [
      { id: "p1", course: "Khai vị", name: "Súp bào ngư vi cá hải vị" },
      { id: "p2", course: "Món chính", name: "Tôm hùm nướng phô mai" },
      { id: "p3", course: "Món chính", name: "Thăn bò Úc sốt rượu vang đỏ" },
      { id: "p4", course: "Món chính", name: "Cá mú hấp Hong Kong" },
      { id: "p5", course: "Tráng miệng", name: "Panna Cotta chanh dây & Trái cây" },
      { id: "p6", course: "Đồ uống", name: "Rượu vang đỏ, Bia & Nước ép" },
    ],
  },
];

export function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[parts.length - 2][0] + parts[parts.length - 1][0];
}
