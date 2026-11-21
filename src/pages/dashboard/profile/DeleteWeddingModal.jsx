import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "../../../components/common";

function DeleteWeddingConfirmBody({ wedding, onClose, onConfirm }) {
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmTarget = wedding.slug || wedding.title;
  const isMatched = confirmInput.trim() === confirmTarget;

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!isMatched || isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm(wedding.id);
      onClose();
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleConfirm} className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs leading-relaxed text-rose-800">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-600" />
        <div>
          <p className="font-semibold">
            Hành động này không thể hoàn tác.
          </p>
          <p className="mt-1 text-rose-700">
            Hồ sơ <strong>{wedding.title}</strong> cùng toàn bộ danh sách khách
            mời, sơ đồ bàn, ngân sách, lịch trình và album ảnh liên quan sẽ bị
            xoá vĩnh viễn.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="delete-wedding-confirm"
          className="mb-1.5 block text-xs text-[#5E5042]"
        >
          Nhập chính xác{" "}
          <code className="rounded bg-[#F3ECE1] px-1.5 py-0.5 font-mono text-xs font-semibold text-[#2C2117]">
            {confirmTarget}
          </code>{" "}
          để xác nhận xoá:
        </label>
        <input
          id="delete-wedding-confirm"
          type="text"
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
          placeholder={confirmTarget}
          className="w-full rounded-xl border border-[#E2D9CB] px-3.5 py-2 text-sm text-[#2C2117] outline-none focus:border-rose-500"
          autoFocus
        />
      </div>

      <div className="flex justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="rounded-lg border border-[#E2D9CB] px-4 py-2 text-xs font-semibold text-[#5E5042] hover:bg-[#FAF7F2] disabled:opacity-50"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={!isMatched || isDeleting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isDeleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          {isDeleting ? "Đang xoá..." : "Xoá vĩnh viễn"}
        </button>
      </div>
    </form>
  );
}

export default function DeleteWeddingModal({
  isOpen,
  wedding,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      isOpen={isOpen && Boolean(wedding)}
      onClose={onClose}
      title="Xác nhận xoá hồ sơ cưới"
      size="sm"
    >
      {isOpen && wedding && (
        <DeleteWeddingConfirmBody
          key={wedding.id}
          wedding={wedding}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      )}
    </Modal>
  );
}
