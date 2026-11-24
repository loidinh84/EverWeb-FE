import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../components/common";
import { getDefaultRouteByRole, ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { extractApiError } from "../../services/api";
import AuthVisualShowcase from "./AuthVisualShowcase";

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      nextErrors.full_name = "Họ và tên phải có ít nhất 2 ký tự.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Email không đúng định dạng.";
    }

    if (password.length < 6) {
      nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
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
      const result = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });
      toast.success(result.message || "Đăng ký tài khoản thành công!");
      navigate(getDefaultRouteByRole(result.user.role), { replace: true });
    } catch (error) {
      const parsed = extractApiError(
        error,
        "Đăng ký tài khoản thất bại. Vui lòng thử lại."
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
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 bg-white text-[#1F1A17]">
      {/* LEFT: Visual Showcase Collage */}
      <AuthVisualShowcase />

      {/* RIGHT: Register Form */}
      <div className="flex lg:col-span-5 flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[380px]">
          {/* Logo */}
          <div className="text-center">
            <Link
              to={ROUTE_PATHS.HOME}
              className="inline-block transition hover:opacity-80"
            >
              <span className="font-display text-4xl sm:text-5xl font-normal italic tracking-tight text-[#1F1A17]">
                .EverWeb
              </span>
            </Link>
          </div>

          {/* Heading & Subtitle */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#1F1A17]">
              Đăng ký tài khoản
            </h1>
            <p className="mt-2 text-xs text-stone-500">
              Đã có tài khoản?{" "}
              <Link
                to={ROUTE_PATHS.LOGIN}
                className="underline decoration-dotted underline-offset-4 font-semibold text-stone-900 hover:text-[#3B52DE] transition"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Server Error / Alert */}
          {serverError && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
              {serverError}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Họ và tên"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-[#1F1A17] placeholder:text-stone-400 outline-none transition focus:border-[#3B52DE] focus:ring-1 focus:ring-[#3B52DE]"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-rose-600">{errors.full_name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Địa chỉ email"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-[#1F1A17] placeholder:text-stone-400 outline-none transition focus:border-[#3B52DE] focus:ring-1 focus:ring-[#3B52DE]"
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
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-11 text-sm text-[#1F1A17] placeholder:text-stone-400 outline-none transition focus:border-[#3B52DE] focus:ring-1 focus:ring-[#3B52DE]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-11 text-sm text-[#1F1A17] placeholder:text-stone-400 outline-none transition focus:border-[#3B52DE] focus:ring-1 focus:ring-[#3B52DE]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"
                  }
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer transition"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#3B52DE] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F43C2] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
              </button>
            </div>
          </form>

          {/* Policy footer */}
          <div className="mt-5 text-center">
            <p className="text-[11px] leading-relaxed text-stone-400">
              Bằng việc đăng ký tài khoản, bạn đồng ý với{" "}
              <span className="text-stone-600 underline">Điều khoản dịch vụ</span>{" "}
              và{" "}
              <span className="text-stone-600 underline">Chính sách bảo mật</span> của .EverWeb.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
