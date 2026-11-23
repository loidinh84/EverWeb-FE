import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Flower2 } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-[#F6F2EA] px-4 py-10 text-[#2C2117]">
      <div className="w-full max-w-[390px] rounded-2xl border border-[#E6DFD3] bg-white p-8 shadow-xs">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <Link
            to={ROUTE_PATHS.HOME}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B52DE] text-white transition hover:opacity-90"
          >
            <Flower2 size={22} />
          </Link>
          <p className="mt-2 text-xs font-semibold tracking-widest text-[#8C7A68] uppercase">
            EverWed
          </p>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-[#2C2117]">
            Chào mừng trở lại
          </h1>
        </div>

        {(redirectReason || serverError) && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
            {serverError || redirectReason}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              className="w-full rounded-xl border border-[#E2D9CB] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#3B52DE] focus:bg-white"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full rounded-xl border border-[#E2D9CB] bg-[#FAF8F5] py-2.5 pr-10 pl-3.5 text-sm text-[#2C2117] placeholder-[#9C8B7A] outline-none focus:border-[#3B52DE] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8C7A68] hover:text-[#2C2117]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
            )}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() =>
                toast.info("Liên hệ quản trị viên để đặt lại mật khẩu")
              }
              className="text-xs font-medium text-[#7D6D5E] underline underline-offset-2 hover:text-[#2C2117]"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#3B52DE] py-2.5 text-sm font-semibold text-white transition hover:bg-[#2F43C2] disabled:opacity-60"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Help box */}
        <div className="mt-6 rounded-xl border border-[#EFEAE1] bg-[#FAF8F5] p-3.5 text-xs">
          <p className="font-semibold text-[#2C2117]">Gặp sự cố đăng nhập?</p>
          <button
            type="button"
            onClick={() => toast.info("Hỗ trợ kỹ thuật: support@everwed.vn")}
            className="mt-1.5 block text-[#6D5B4B] underline underline-offset-2 hover:text-[#2C2117]"
          >
            Cần trợ giúp đăng nhập?
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-[#7D6D5E]">
          Mới sử dụng EverWed?{" "}
          <Link
            to={ROUTE_PATHS.REGISTER}
            className="font-semibold text-[#2C2117] underline underline-offset-2"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
