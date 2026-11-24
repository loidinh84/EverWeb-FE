import { useState } from "react";
import { Modal, useToast } from "../../components/common";
import { extractApiError } from "../../services/api";
import feedbackApi from "../../services/feedbackApi";

const FEEDBACK_TYPES = [
  "Góp ý tính năng mới",
  "Trải nghiệm giao diện",
  "Báo lỗi hệ thống",
  "Khác",
];

export default function FeedbackModal({ isOpen, onClose }) {
  const toast = useToast();
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !message.trim()) {
      toast.error("Vui lòng chọn loại góp ý và nhập nội dung");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await feedbackApi.submit({
        category,
        message: message.trim(),
      });
      toast.success(res?.message || "Cảm ơn bạn đã gửi góp ý!");
      setCategory("");
      setMessage("");
      onClose?.();
    } catch (error) {
      toast.error(extractApiError(error, "Không thể gửi góp ý lúc này").message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chúng tôi rất mong nhận được góp ý từ bạn!"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#1F1A17]">
            Loại góp ý của bạn là gì?*
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
          >
            <option value="">Chọn một mục...</option>
            {FEEDBACK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#1F1A17]">
            Bạn muốn nhắn gửi điều gì với chúng tôi?*
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập nội dung góp ý của bạn..."
            className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-[#1F1A17] placeholder-[#A8A29E] outline-none focus:border-[#3B52DE]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-medium text-stone-700"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#3B52DE] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#2F43C2] disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi góp ý"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
