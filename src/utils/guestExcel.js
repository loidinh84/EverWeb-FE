import * as XLSX from "xlsx";

export const SAMPLE_30_GUESTS_EXCEL_ROWS = [
  { "Họ và tên lót": "Nguyễn Văn", Tên: "An", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234501", Email: "an.nguyen@gmail.com", "Địa chỉ": "Q.1, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Bạn đại học" },
  { "Họ và tên lót": "Trần Thị Thu", Tên: "Hà", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234502", Email: "ha.tran@gmail.com", "Địa chỉ": "Q.3, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 0, "Phân loại": "Bạn thân" },
  { "Họ và tên lót": "Lê Hoàng", Tên: "Nam", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234503", Email: "nam.le@gmail.com", "Địa chỉ": "Q. Bình Thạnh, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Đồng nghiệp" },
  { "Họ và tên lót": "Phạm Minh", Tên: "Thư", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234504", Email: "thu.pham@gmail.com", "Địa chỉ": "Q. Phú Nhuận, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 0, "Phân loại": "Phù dâu" },
  { "Họ và tên lót": "Hoàng Quốc", Tên: "Bảo", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234505", Email: "bao.hoang@gmail.com", "Địa chỉ": "TP. Thủ Đức, TP.HCM", "Xác nhận RSVP": "Chờ phản hồi", "Người đi cùng": 2, "Phân loại": "Họ hàng" },
  { "Họ và tên lót": "Vũ Ngọc", Tên: "Mai", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234506", Email: "mai.vu@gmail.com", "Địa chỉ": "Q.10, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Đồng nghiệp" },
  { "Họ và tên lót": "Đặng Thanh", Tên: "Tùng", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234507", Email: "tung.dang@gmail.com", "Địa chỉ": "Q.7, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 0, "Phân loại": "Bạn đại học" },
  { "Họ và tên lót": "Bùi Thị Bích", Tên: "Ngọc", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234508", Email: "ngoc.bui@gmail.com", "Địa chỉ": "Q. Tân Bình, TP.HCM", "Xác nhận RSVP": "Chờ phản hồi", "Người đi cùng": 1, "Phân loại": "Gia đình" },
  { "Họ và tên lót": "Đỗ Minh", Tên: "Trí", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234509", Email: "tri.do@gmail.com", "Địa chỉ": "Q.5, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Bạn thân" },
  { "Họ và tên lót": "Hồ Thị Kim", Tên: "Oanh", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234510", Email: "oanh.ho@gmail.com", "Địa chỉ": "Q. Gò Vấp, TP.HCM", "Xác nhận RSVP": "Từ chối", "Người đi cùng": 0, "Phân loại": "Đồng nghiệp" },
  { "Họ và tên lót": "Ngô Gia", Tên: "Kiệt", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234511", Email: "kiet.ngo@gmail.com", "Địa chỉ": "TP. Biên Hòa, Đồng Nai", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 2, "Phân loại": "Họ hàng" },
  { "Họ và tên lót": "Dương Thảo", Tên: "Vy", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234512", Email: "vy.duong@gmail.com", "Địa chỉ": "Q.2, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 0, "Phân loại": "Bạn đại học" },
  { "Họ và tên lót": "Lý Hải", Tên: "Đăng", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234513", Email: "dang.ly@gmail.com", "Địa chỉ": "Q.4, TP.HCM", "Xác nhận RSVP": "Chờ phản hồi", "Người đi cùng": 1, "Phân loại": "Đồng nghiệp" },
  { "Họ và tên lót": "Phan Thị Lan", Tên: "Phương", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234514", Email: "phuong.phan@gmail.com", "Địa chỉ": "Q. Bình Tân, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Gia đình" },
  { "Họ và tên lót": "Trịnh Xuân", Tên: "Phúc", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234515", Email: "phuc.trinh@gmail.com", "Địa chỉ": "Q.6, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 0, "Phân loại": "Bạn thân" },
  { "Họ và tên lót": "Huỳnh Tấn", Tên: "Phát", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234516", Email: "phat.huynh@gmail.com", "Địa chỉ": "TP. Thủ Dầu Một, Bình Dương", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Họ hàng" },
  { "Họ và tên lót": "Mai Thị Hồng", Tên: "Nhung", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234517", Email: "nhung.mai@gmail.com", "Địa chỉ": "Q.8, TP.HCM", "Xác nhận RSVP": "Chờ phản hồi", "Người đi cùng": 0, "Phân loại": "Bạn đại học" },
  { "Họ và tên lót": "Cao Đức", Tên: "Mạnh", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234518", Email: "manh.cao@gmail.com", "Địa chỉ": "Q.11, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Đồng nghiệp" },
  { "Họ và tên lót": "Tạ Thị Phương", Tên: "Linh", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234519", Email: "linh.ta@gmail.com", "Địa chỉ": "Q.12, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Bạn thân" },
  { "Họ và tên lót": "Châu Thành", Tên: "Công", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234520", Email: "cong.chau@gmail.com", "Địa chỉ": "TP. Vũng Tàu", "Xác nhận RSVP": "Từ chối", "Người đi cùng": 0, "Phân loại": "Bạn đại học" },
  { "Họ và tên lót": "Lâm Hoàng", Tên: "Yến", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234521", Email: "yen.lam@gmail.com", "Địa chỉ": "Q. Tân Phú, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 0, "Phân loại": "Đồng nghiệp" },
  { "Họ và tên lót": "Võ Nhật", Tên: "Minh", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234522", Email: "minh.vo@gmail.com", "Địa chỉ": "Q.3, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Phù rể" },
  { "Họ và tên lót": "Nguyễn Thị Thanh", Tên: "Tâm", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234523", Email: "tam.nguyen@gmail.com", "Địa chỉ": "TP. Mỹ Tho, Tiền Giang", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 2, "Phân loại": "Gia đình" },
  { "Họ và tên lót": "Trần Quang", Tên: "Huy", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234524", Email: "huy.tran@gmail.com", "Địa chỉ": "Q.9, TP.HCM", "Xác nhận RSVP": "Chờ phản hồi", "Người đi cùng": 0, "Phân loại": "Bạn đại học" },
  { "Họ và tên lót": "Lê Thị Kim", Tên: "Chi", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234525", Email: "chi.le@gmail.com", "Địa chỉ": "Q. Bình Thạnh, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Đồng nghiệp" },
  { "Họ và tên lót": "Phạm Tuấn", Tên: "Khang", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234526", Email: "khang.pham@gmail.com", "Địa chỉ": "Q.1, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 0, "Phân loại": "Bạn thân" },
  { "Họ và tên lót": "Hoàng Mỹ", Tên: "Duyên", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234527", Email: "duyen.hoang@gmail.com", "Địa chỉ": "Q.7, TP.HCM", "Xác nhận RSVP": "Chờ phản hồi", "Người đi cùng": 1, "Phân loại": "Họ hàng" },
  { "Họ và tên lót": "Đinh Gia", Tên: "Hưng", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234528", Email: "hung.dinh@gmail.com", "Địa chỉ": "TP. Cần Thơ", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 2, "Phân loại": "Gia đình" },
  { "Họ và tên lót": "Bùi Khánh", Tên: "Huyền", "Phía gia đình": "Nhà gái", "Số điện thoại": "0901234529", Email: "huyen.bui@gmail.com", "Địa chỉ": "Q. Phú Nhuận, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 0, "Phân loại": "Bạn đại học" },
  { "Họ và tên lót": "Nguyễn Hữu", Tên: "Thắng", "Phía gia đình": "Nhà trai", "Số điện thoại": "0901234530", Email: "thang.nguyen@gmail.com", "Địa chỉ": "Q.10, TP.HCM", "Xác nhận RSVP": "Tham dự", "Người đi cùng": 1, "Phân loại": "Đồng nghiệp" },
];

export function downloadSampleGuestsExcel(filename = "test-danh-sach-30-khach-moi.xlsx") {
  const ws = XLSX.utils.json_to_sheet(SAMPLE_30_GUESTS_EXCEL_ROWS);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "KhachMoi");
  XLSX.writeFile(wb, filename);
}

function pickField(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
      return String(row[key]).trim();
    }
  }
  return "";
}

function normalizeRsvpLabel(raw) {
  const v = String(raw || "").trim().toLowerCase();
  if (v.includes("tham dự") || v === "attending" || v === "accepted" || v === "có") {
    return "Tham dự";
  }
  if (v.includes("từ chối") || v === "declined" || v === "không") {
    return "Từ chối";
  }
  return "Chờ phản hồi";
}

function normalizeSideLabel(raw) {
  const v = String(raw || "").trim().toLowerCase();
  if (v.includes("gái") || v === "bride") return "Nhà gái";
  return "Nhà trai";
}

export async function parseGuestsExcelFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  return rows
    .map((row) => {
      const fullNameCombined = pickField(row, [
        "Họ và tên",
        "Họ tên",
        "full_name",
        "Full Name",
        "name",
      ]);
      let lastName = pickField(row, ["Họ và tên lót", "Họ", "lastName", "last_name"]);
      let firstName = pickField(row, ["Tên", "firstName", "first_name"]);

      if (!firstName && fullNameCombined) {
        const parts = fullNameCombined.split(/\s+/).filter(Boolean);
        if (parts.length <= 1) {
          firstName = parts[0] || "";
        } else {
          lastName = parts.slice(0, -1).join(" ");
          firstName = parts[parts.length - 1];
        }
      }

      const fullName = `${lastName} ${firstName}`.trim();
      if (!fullName) return null;

      let phone = pickField(row, ["Số điện thoại", "SĐT", "Điện thoại", "phone", "Phone"]);
      // Excel đôi khi mất số 0 đầu nếu lưu dạng số (VD: 901234501)
      if (phone && /^\d{9}$/.test(phone) && !phone.startsWith("0")) {
        phone = `0${phone}`;
      }

      const companionsRaw = pickField(row, ["Người đi cùng", "companions", "max_companions"]);
      const companions = Math.min(10, Math.max(0, parseInt(companionsRaw, 10) || 0));

      return {
        lastName,
        firstName,
        fullName,
        side: normalizeSideLabel(pickField(row, ["Phía gia đình", "Gia đình", "side"])),
        phone,
        email: pickField(row, ["Email", "email"]),
        address: pickField(row, ["Địa chỉ", "address"]),
        rsvp: normalizeRsvpLabel(pickField(row, ["Xác nhận RSVP", "RSVP", "Trạng thái", "rsvp"])),
        companions,
        tag: pickField(row, ["Phân loại", "Nhóm", "tag"]) || "Bạn bè",
      };
    })
    .filter(Boolean);
}

