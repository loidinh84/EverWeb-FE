export const INITIAL_QUESTIONS = [
  {
    id: "q1",
    title: "Bạn có thể đến chung vui cùng chúng mình không?",
    type: "Lựa chọn (Có / Không)",
    required: true,
    active: true,
    desc: "Câu hỏi bắt buộc để xác định số lượng khách tham dự chính thức",
    followUps: [
      "Lựa chọn khẩu phần ăn (Món mặn / Món chay / Kiêng dị ứng)",
      "Bạn có cần hỗ trợ xe đưa đón hoặc đặt phòng khách sạn không?",
      "Lời nhắn nhủ thân thương gửi đến cô dâu & chú rể",
    ],
  },
  {
    id: "q2",
    title: "Số lượng người đi cùng bạn (bao gồm người lớn & trẻ em)?",
    type: "Số lượng (1 - 5 người)",
    required: true,
    active: true,
    desc: "Giúp sảnh tiệc chuẩn bị đủ ghế ngồi và quà cảm ơn",
    followUps: [],
  },
  {
    id: "q3",
    title: "Lựa chọn món ăn chính của bạn và người đi cùng",
    type: "Chọn món (Mặn / Chay)",
    required: false,
    active: true,
    desc: "Thực đơn tiệc cưới cao cấp được thiết kế riêng",
    followUps: [],
  },
  {
    id: "q4",
    title: "Bạn có tham dự tiệc cocktail đón khách lúc 17:30 không?",
    type: "Lựa chọn (Có / Không)",
    required: false,
    active: false,
    desc: "Thưởng thức rượu vang, bánh ngọt và chụp ảnh check-in cùng CD-CR",
    followUps: [],
  },
];

export const INITIAL_ANSWERS = [];
