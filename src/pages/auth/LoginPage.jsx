import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Flower2,
  Info,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "../../components/common";
import { getSafeRedirectPath, ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { extractApiError } from "../../services/api";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromLocation = location.state?.from;
  const redirectReason = location.state?.reason;

  const validate = () => {
    const nextErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Email không đúng định dạng.";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const result = await login({
        email: email.trim(),
        password,
      });
      toast.success(result.message || "Đăng nhập thành công!");
      const target = getSafeRedirectPath(fromLocation, result.user.role);
      navigate(target, { replace: true });
    } catch (error) {
      const parsed = extractApiError(
        error,
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
      if (Object.keys(parsed.fieldErrors).length > 0) {
        setErrors(parsed.fieldErrors);
      }
      setServerError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F2EA] text-[#2C2117]">
      {/* Left Editorial Brand Panel */}
      <aside className="relative hidden w-5/12 flex-col justify-between overflow-hidden bg-[#2F241D] p-10 text-[#EDE4D6] lg:flex xl:p-14">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#C5A059]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#C5A059]/10 blur-3xl" />

        <div className="relative z-10">
          <Link
            to={ROUTE_PATHS.HOME}
            className="inline-flex items-center gap-3 text-white transition hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C5A059] text-[#2F241D] shadow-xs">
              <Flower2 size={20} />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">
                EverWeb
              </p>
              <p className="text-[10px] tracking-widest text-[#CBBBA8] uppercase">
                Hoa Tình Yêu · Ngày chung đôi
              </p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-[#E8CD94]">
            <ShieldCheck size={14} />
            <span>Khu vực quản trị được bảo vệ</span>
          </div>
          <h1 className="font-display text-4xl leading-tight font-medium text-white xl:text-5xl">
            Quản lý trọn vẹn từng khoảnh khắc ngày chung đôi.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-[#CBBBA8]">
            Đăng nhập để tiếp tục thiết kế thiệp mời số, theo dõi phản hồi
            khách mời RSVP, cân đối ngân sách và sử dụng Trợ lý cưới AI.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6 text-xs text-[#B6A38E]">
          <p>Phiên đăng nhập được xác thực bằng JWT & phân quyền theo vai trò.</p>
        </div>
      </aside>

      {/* Right Auth Form */}
      <main className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <Link
              to={ROUTE_PATHS.HOME}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D5B4B] transition hover:text-[#2C2117]"
            >
              <ArrowLeft size={14} />
              <span>Về trang chủ</span>
            </Link>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2F241D] text-[#C5A059]">
                <Flower2 size={15} />
              </div>
              <span className="font-display text-lg font-semibold text-[#2C2117]">
                EverWeb
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE3D8] bg-[#FCFBF8] p-7 shadow-sm sm:p-9">
            <div className="mb-6">
              <h2 className="font-display text-3xl font-semibold text-[#2C2117]">
                Đăng nhập quản trị
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[#7D6D5E]">
                Truy cập không gian quản lý tiệc cưới hoặc trang quản trị hệ
                thống.
              </p>
            </div>

            {redirectReason === "unauthenticated" && fromLocation?.pathname && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#E5D3B3] bg-[#FBF5EA] px-3.5 py-2.5 text-xs text-[#6B4E23]">
                <Info size={15} className="mt-0.5 shrink-0 text-[#A67C37]" />
                <span>
                  Vui lòng đăng nhập để truy cập trang{" "}
                  <strong className="font-semibold">
                    {fromLocation.pathname}
                  </strong>
                  .
                </span>
              </div>
            )}

            {serverError && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
              >
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-xs font-semibold text-[#4A3B2C]"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9C8B7A]"
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    placeholder="name@example.com"
                    className={`w-full rounded-xl border bg-white py-2.5 pr-3.5 pl-10 text-sm text-[#2C2117] placeholder:text-[#B6A38E] transition outline-none ${
                      errors.email
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-[#DFD5C5] focus:border-[#C5A059]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-xs font-semibold text-[#4A3B2C]"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9C8B7A]"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                    placeholder="Nhập mật khẩu"
                    className={`w-full rounded-xl border bg-white py-2.5 pr-10 pl-10 text-sm text-[#2C2117] placeholder:text-[#B6A38E] transition outline-none ${
                      errors.password
                        ? "border-rose-400 focus:border-rose-500"
                        : "border-[#DFD5C5] focus:border-[#C5A059]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8C7A68] transition hover:text-[#2C2117]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F241D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#44352B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}</span>
                {!isSubmitting && <ArrowRight size={15} />}
              </button>
            </form>

            <div className="mt-6 border-t border-[#EAE3D8] pt-5 text-center text-xs text-[#7D6D5E]">
              Chưa có tài khoản quản lý tiệc cưới?{" "}
              <Link
                to={ROUTE_PATHS.REGISTER}
                className="font-semibold text-[#A67C37] underline-offset-2 transition hover:text-[#7A5622] hover:underline"
              >
                Đăng ký tài khoản
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
