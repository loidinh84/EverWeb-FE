export const RECIPIENT_GROUPS = [
  { id: "missing", label: "Khách chưa có SĐT & Địa chỉ", count: 0 },
  { id: "all", label: "Toàn bộ danh sách khách mời", count: 0 },
  { id: "friends", label: "Nhóm Bạn bè & Đồng nghiệp", count: 0 },
  { id: "family", label: "Họ hàng & Người thân ở xa", count: 0 },
];

export const DEFAULT_FIELDS = [
  { key: "fullName", label: "Họ và tên khách mời", required: true, enabled: true, desc: "Bắt buộc để in lên bao thư thiệp cưới" },
  { key: "phone", label: "Số điện thoại di động", required: true, enabled: true, desc: "Gửi SMS nhắc ngày cưới & liên hệ giao thiệp" },
  { key: "address", label: "Địa chỉ nhận thiệp giấy tận nơi", required: false, enabled: true, desc: "Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành" },
  { key: "email", label: "Địa chỉ Email", required: false, enabled: true, desc: "Gửi thiệp điện tử (E-invitation) có tương tác" },
  { key: "companions", label: "Số lượng người đi cùng dự kiến", required: false, enabled: true, desc: "Giúp cô dâu chú rể sắp xếp chỗ ngồi chu đáo" },
  { key: "wishes", label: "Lời chúc mừng gửi đến đôi uyên ương", required: false, enabled: true, desc: "Lưu giữ kỷ niệm và hiển thị tại bàn tiệc" },
];

export const INITIAL_SUBMISSIONS = [];
