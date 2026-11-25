import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Heart, Loader2, Send } from "lucide-react";
import weddingApi from "../services/weddingApi";

const DEFAULT_FIELDS = [
  { key: "name", label: "Họ và tên", enabled: true, required: true, placeholder: "Nguyễn Văn A" },
  { key: "phone", label: "Số điện thoại", enabled: true, required: true, placeholder: "0901 234 567" },
  { key: "email", label: "Địa chỉ Email", enabled: true, required: false, placeholder: "email@example.com" },
  { key: "address", label: "Địa chỉ nhận thiệp giấy", enabled: true, required: true, placeholder: "Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP" },
  { key: "wishes", label: "Lời chúc gửi đến cô dâu chú rể", enabled: true, required: false, placeholder: "Chúc hai bạn trăm năm hạnh phúc!" },
];

export default function PublicContactPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [config, setConfig] = useState(null);
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    wishes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    weddingApi
      .getPublicContactForm(slug)
      .then((data) => {
        if (!active) return;
        setConfig(data);
        setError("");
      })
      .catch(() => {
        if (!active) return;
        setError("Không tìm thấy trang thu thập thông tin cho đường dẫn này.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.name.trim()) {
      setError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await weddingApi.submitPublicContactForm(slug, values);
      setSubmitted(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể gửi thông tin, vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang tải biểu mẫu...</span>
        </div>
      </div>
    );
  }

  const cc = config?.collectContacts || {};
  const fields = Array.isArray(cc.fields) && cc.fields.length > 0 ? cc.fields : DEFAULT_FIELDS;
  const coverTitle = cc.formCoverTitle || `Mừng Hôn Lễ ${config?.coupleNames || "EverWed"}`;
  const coverNote =
    cc.formCoverNote ||
    "Sự hiện diện của bạn là niềm vinh hạnh lớn nhất của gia đình chúng mình. Vui lòng cập nhật thông tin liên hệ để nhận thiệp mời trang trọng.";

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-stone-200 shadow-lg overflow-hidden">
        <div className="bg-[#1F1A17] text-white px-6 py-7 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-200/90 mb-2">
            <Heart className="w-3.5 h-3.5 fill-amber-200/90" />
            <span>EverWeb · Thiệp & Liên hệ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{coverTitle}</h1>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
            {coverNote}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-[#1F1A17]">
                Cảm ơn bạn đã gửi thông tin!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Thông tin của bạn đã được lưu vào danh bạ khách mời của{" "}
                <span className="font-semibold text-[#1F1A17]">
                  {config?.coupleNames || "cô dâu & chú rể"}
                </span>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700">
                  {error}
                </div>
              )}

              {fields
                .filter((f) => f.enabled !== false)
                .map((field) => {
                  const key = field.key;
                  const isTextarea = key === "address" || key === "wishes";
                  return (
                    <div key={key} className="space-y-1">
                      <label className="block text-xs font-semibold text-stone-700">
                        {field.label}
                        {field.required && (
                          <span className="text-rose-600 ml-1">*</span>
                        )}
                      </label>
                      {isTextarea ? (
                        <textarea
                          rows={key === "wishes" ? 3 : 2}
                          required={Boolean(field.required)}
                          value={values[key] || ""}
                          onChange={(e) =>
                            setValues((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder || ""}
                          className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                        />
                      ) : (
                        <input
                          type={key === "email" ? "email" : "text"}
                          required={Boolean(field.required)}
                          value={values[key] || ""}
                          onChange={(e) =>
                            setValues((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder || ""}
                          className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs sm:text-sm text-[#1F1A17] outline-none focus:border-[#3B52DE]"
                        />
                      )}
                    </div>
                  );
                })}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1F1A17] py-3 text-xs sm:text-sm font-semibold text-white hover:bg-stone-800 transition cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi thông tin...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi thông tin liên hệ</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
