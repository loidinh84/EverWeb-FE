import { useState } from "react";
import { Modal, Table, useToast } from "./components/common";

// Dữ liệu mẫu để demo các common components (sẽ thay bằng API thật sau)
const SAMPLE_INVITATIONS = [
  { id: "1", groom: "Nguyễn Văn Nam", bride: "Trần Thị Lan", weddingDate: "2026-12-20", status: "published" },
  { id: "2", groom: "Lê Minh Khoa", bride: "Phạm Thu Hà", weddingDate: "2027-01-08", status: "draft" },
  { id: "3", groom: "Hoàng Đức Anh", bride: "Võ Ngọc Mai", weddingDate: "2027-02-14", status: "archived" },
];

const STATUS_LABELS = {
  draft: { text: "Nháp", className: "bg-gray-100 text-gray-600" },
  published: { text: "Đã xuất bản", className: "bg-emerald-100 text-emerald-700" },
  archived: { text: "Lưu trữ", className: "bg-amber-100 text-amber-700" },
};

const btn = "rounded-lg px-4 py-2 text-sm font-medium transition";

function App() {
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(SAMPLE_INVITATIONS);

  const columns = [
    { key: "groom", title: "Chú rể" },
    { key: "bride", title: "Cô dâu" },
    {
      key: "weddingDate",
      title: "Ngày cưới",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      key: "status",
      title: "Trạng thái",
      align: "center",
      render: (value) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_LABELS[value]?.className}`}>
          {STATUS_LABELS[value]?.text}
        </span>
      ),
    },
  ];

  const reload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info("Đã tải lại danh sách");
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">Chào mừng các bạn đến với EverWeb.</h1>

      <div className="flex flex-wrap gap-3">
        <button className={`${btn} bg-emerald-500 text-white hover:bg-emerald-600`} onClick={() => toast.success("Lưu thiệp mời thành công!")}>
          Toast success
        </button>
        <button className={`${btn} bg-red-500 text-white hover:bg-red-600`} onClick={() => toast.error("Không thể kết nối máy chủ")}>
          Toast error
        </button>
        <button className={`${btn} bg-amber-500 text-white hover:bg-amber-600`} onClick={() => toast.warning("Thiệp chưa có ảnh bìa")}>
          Toast warning
        </button>
        <button className={`${btn} border border-gray-300 hover:bg-gray-50`} onClick={reload}>
          Tải lại bảng
        </button>
        <button className={`${btn} border border-gray-300 hover:bg-gray-50`} onClick={() => setData((d) => (d.length ? [] : SAMPLE_INVITATIONS))}>
          Bật/tắt dữ liệu trống
        </button>
      </div>

      <Table columns={columns} data={data} loading={loading} onRowClick={setSelected} emptyText="Chưa có thiệp mời nào" />

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Chi tiết thiệp mời"
        footer={
          <>
            <button className={`${btn} border border-gray-300 hover:bg-gray-50`} onClick={() => setSelected(null)}>
              Đóng
            </button>
            <button
              className={`${btn} bg-rose-500 text-white hover:bg-rose-600`}
              onClick={() => {
                toast.success(`Đã chọn thiệp của ${selected.groom} & ${selected.bride}`);
                setSelected(null);
              }}
            >
              Xác nhận
            </button>
          </>
        }
      >
        {selected && (
          <div className="space-y-2">
            <p><b>Chú rể:</b> {selected.groom}</p>
            <p><b>Cô dâu:</b> {selected.bride}</p>
            <p><b>Ngày cưới:</b> {new Date(selected.weddingDate).toLocaleDateString("vi-VN")}</p>
            <p><b>Trạng thái:</b> {STATUS_LABELS[selected.status]?.text}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
