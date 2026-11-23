import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, UserPlus } from "lucide-react";
import { Modal, useToast } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import { extractApiError } from "../../services/api";
import weddingApi from "../../services/weddingApi";

export default function CollaboratorsModal({ isOpen, onClose, weddingId }) {
  const { user } = useAuth();
  const toast = useToast();

  const [owner, setOwner] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [loadedKey, setLoadedKey] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canFetch = Boolean(
    isOpen && weddingId && !String(weddingId).startsWith("local-")
  );
  const currentKey = canFetch ? String(weddingId) : "";
  const isLoading = canFetch && loadedKey !== currentKey;

  useEffect(() => {
    if (!canFetch) return undefined;

    let cancelled = false;
    weddingApi
      .getMembers(weddingId)
      .then((data) => {
        if (cancelled) return;
        setOwner(data?.owner || null);
        setCollaborators(data?.collaborators || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadedKey(String(weddingId));
      });

    return () => {
      cancelled = true;
    };
  }, [canFetch, weddingId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Vui lòng nhập email cộng tác viên");
      return;
    }
    if (!weddingId || String(weddingId).startsWith("local-")) {
      toast.error("Vui lòng tạo sự kiện trên máy chủ trước khi mời cộng tác viên");
      return;
    }

    setIsSubmitting(true);
    try {
      const added = await weddingApi.addMember(weddingId, {
        email: email.trim(),
        role,
      });
      setCollaborators((prev) => [...prev, added]);
      setEmail("");
      setShowAddForm(false);
      toast.success(`Đã thêm ${added.email} làm cộng tác viên`);
    } catch (error) {
      toast.error(extractApiError(error, "Không thể thêm cộng tác viên").message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await weddingApi.removeMember(weddingId, userId);
      setCollaborators((prev) => prev.filter((c) => c.userId !== userId));
      toast.info("Đã gỡ cộng tác viên");
    } catch (error) {
      toast.error(extractApiError(error, "Không thể gỡ cộng tác viên").message);
    }
  };

  const ownerEmail = owner?.email || user?.email || "ban@everwed.vn";
  const ownerInitial = ownerEmail.slice(0, 1).toUpperCase();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quản trị viên sự kiện"
      size="md"
    >
      <div className="space-y-5">
        {/* Owner */}
        <div>
          <p className="mb-2 text-xs font-semibold text-[#2C2117]">
            Chủ sở hữu
          </p>
          <div className="flex items-center justify-between rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3E8D2] text-xs font-bold text-[#8A6121]">
                {ownerInitial}
              </div>
              <span className="text-sm font-medium text-[#2C2117]">
                {ownerEmail}
              </span>
            </div>
            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-[#7D6D5E] ring-1 ring-[#E6DFD3]">
              Bạn
            </span>
          </div>
        </div>

        {/* Collaborators */}
        <div>
          <p className="mb-2 text-xs font-semibold text-[#2C2117]">
            Cộng tác viên
          </p>

          {isLoading ? (
            <div className="flex justify-center py-4 text-[#8C7A68]">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : collaborators.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E2D9CB] bg-[#FAF8F5] px-4 py-4 text-center text-xs text-[#8C7A68]">
              Chưa có cộng tác viên nào. Bạn có thể mời bạn đời hoặc người thân
              cùng quản lý sự kiện.
            </div>
          ) : (
            <div className="divide-y divide-[#F1ECE3] rounded-xl border border-[#E6DFD3]">
              {collaborators.map((c) => (
                <div
                  key={c.userId}
                  className="flex items-center justify-between px-4 py-2.5 text-xs"
                >
                  <div>
                    <p className="font-semibold text-[#2C2117]">
                      {c.fullName || c.email}
                    </p>
                    <p className="text-[#8C7A68]">{c.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[11px] font-medium text-[#3B52DE]">
                      {c.role === "viewer" ? "Chỉ xem" : "Biên tập"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(c.userId)}
                      aria-label={`Gỡ ${c.email}`}
                      className="rounded-md p-1 text-[#9C8B7A] hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddForm ? (
            <form onSubmit={handleAdd} className="mt-3 space-y-2.5 rounded-xl border border-[#E6DFD3] bg-[#FAF8F5] p-3.5">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email tài khoản EverWed..."
                  className="flex-1 rounded-lg border border-[#E2D9CB] bg-white px-3 py-2 text-xs outline-none focus:border-[#3B52DE]"
                  autoFocus
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-lg border border-[#E2D9CB] bg-white px-2.5 py-2 text-xs outline-none focus:border-[#3B52DE]"
                >
                  <option value="editor">Quyền chỉnh sửa</option>
                  <option value="viewer">Chỉ xem</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg border border-[#E2D9CB] bg-white px-3 py-1.5 text-xs font-medium text-[#5E5042]"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#3B52DE] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2F43C2] disabled:opacity-60"
                >
                  <UserPlus size={13} />
                  {isSubmitting ? "Đang mời..." : "Gửi lời mời"}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#E2D9CB] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#2C2117] transition hover:border-[#3B52DE]"
            >
              <Plus size={14} />
              Thêm cộng tác viên
            </button>
          )}
        </div>

        <div className="flex justify-end border-t border-[#F1ECE3] pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#2C2117] px-6 py-2 text-xs font-semibold text-white transition hover:bg-[#3D2F22]"
          >
            Xong
          </button>
        </div>
      </div>
    </Modal>
  );
}
