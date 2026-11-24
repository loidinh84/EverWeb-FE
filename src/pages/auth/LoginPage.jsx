import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../components/common";
import { getSafeRedirectPath, ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { extractApiError } from "../../services/api";
import AuthVisualShowcase from "./AuthVisualShowcase";

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
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 bg-white text-[#1F1A17]">
      {/* LEFT: Visual Showcase Collage */}
      <AuthVisualShowcase />

      {/* RIGHT: Sign In Form */}
      <div className="flex lg:col-span-5 flex-col items-center justify-center px-6 py-12 sm:px-10">
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
          <div className="mt-7 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#1F1A17]">
              Đăng nhập
            </h1>
            <p className="mt-2 text-xs text-stone-500">
              Chưa có tài khoản?{" "}
              <Link
                to={ROUTE_PATHS.REGISTER}
                className="underline decoration-dotted underline-offset-4 font-semibold text-stone-900 hover:text-[#3B52DE] transition"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Server Error / Alert */}
          {(redirectReason || serverError) && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
              {serverError || redirectReason}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
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
                  placeholder="Mật khẩu"
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#3B52DE] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F43C2] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </div>
          </form>

          {/* Reset Password Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-stone-500">
              Quên mật khẩu?{" "}
              <Link
                to={ROUTE_PATHS.FORGOT_PASSWORD}
                className="underline decoration-dotted underline-offset-4 font-medium text-stone-800 hover:text-[#3B52DE] cursor-pointer transition"
              >
                Đặt lại mật khẩu
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
