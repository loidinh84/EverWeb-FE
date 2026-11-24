import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { extractApiError } from "../../services/api";
import authApi from "../../services/authApi";
import AuthVisualShowcase from "./AuthVisualShowcase";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialToken = searchParams.get("token") || "";
  const [step, setStep] = useState(initialToken ? 2 : 1); // 1 = Request Email, 2 = Enter Token & New Password, 3 = Success

  // Step 1 State
  const [email, setEmail] = useState("");
  // Step 2 State
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate Step 1
  const validateStep1 = () => {
    const nextErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Email không đúng định dạng.";
    }
    return nextErrors;
  };

  // Validate Step 2
  const validateStep2 = () => {
    const nextErrors = {};
    if (!token.trim()) {
      nextErrors.token = "Vui lòng nhập mã token đặt lại mật khẩu.";
    }
    if (newPassword.length < 6) {
      nextErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }
    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    return nextErrors;
  };

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await authApi.forgotPassword(email.trim());
      toast.success(response.message || "Vui lòng kiểm tra email của bạn!");
      
      // If token is returned directly (e.g. development environment)
      if (response.resetToken) {
        setToken(response.resetToken);
      }
      setStep(2);
    } catch (error) {
      const parsed = extractApiError(
        error,
        "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại."
      );
      if (Object.keys(parsed.fieldErrors).length > 0) {
        setErrors(parsed.fieldErrors);
      }
      setServerError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await authApi.resetPassword({
        token: token.trim(),
        newPassword,
      });
      toast.success(response.message || "Đã cập nhật mật khẩu thành công!");
      setStep(3);
    } catch (error) {
      const parsed = extractApiError(
        error,
        "Đặt lại mật khẩu thất bại. Mã token có thể đã hết hạn."
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

      {/* RIGHT: Forgot Password Form */}
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

          {/* STEP 1: Request Reset Link */}
          {step === 1 && (
            <>
              <div className="mt-7 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[#1F1A17]">
                  Quên mật khẩu
                </h1>
                <p className="mt-2 text-xs text-stone-500">
                  Nhập địa chỉ email của bạn để nhận mã khôi phục mật khẩu.
                </p>
              </div>

              {serverError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleRequestToken} className="mt-6 space-y-4" noValidate>
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Địa chỉ email"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-[#1F1A17] placeholder:text-stone-400 outline-none transition focus:border-[#3B52DE] focus:ring-1 focus:ring-[#3B52DE]"
                    />
                    <div className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-stone-400">
                      <Mail size={16} />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-[#3B52DE] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F43C2] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi mã đặt lại mật khẩu"}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-stone-500 underline decoration-dotted underline-offset-4 hover:text-[#3B52DE] transition cursor-pointer"
                >
                  Đã có mã token? Nhập tại đây
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Enter Token and New Password */}
          {step === 2 && (
            <>
              <div className="mt-7 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[#1F1A17]">
                  Đặt mật khẩu mới
                </h1>
                <p className="mt-2 text-xs text-stone-500">
                  Nhập mã token xác thực và mật khẩu mới của bạn bên dưới.
                </p>
              </div>

              {serverError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="mt-5 space-y-3.5" noValidate>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Mã token xác thực"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-mono text-[#1F1A17] placeholder:font-sans placeholder:text-stone-400 outline-none transition focus:border-[#3B52DE] focus:ring-1 focus:ring-[#3B52DE]"
                    />
                    <div className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-stone-400">
                      <KeyRound size={16} />
                    </div>
                  </div>
                  {errors.token && (
                    <p className="mt-1 text-xs text-rose-600">{errors.token}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
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
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-rose-600">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu mới"
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-[#3B52DE] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F43C2] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-stone-500 underline decoration-dotted underline-offset-4 hover:text-[#3B52DE] transition cursor-pointer"
                >
                  Cần gửi lại email hoặc mã token khác?
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Password Updated Success */}
          {step === 3 && (
            <div className="mt-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1F1A17]">
                Đổi mật khẩu thành công!
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể đăng nhập ngay với mật khẩu mới.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => navigate(ROUTE_PATHS.LOGIN, { replace: true })}
                  className="w-full rounded-full bg-[#3B52DE] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F43C2] active:scale-[0.99] cursor-pointer"
                >
                  Tiếp tục đăng nhập
                </button>
              </div>
            </div>
          )}

          {/* Back to Sign In Footer */}
          <div className="mt-8 text-center">
            <Link
              to={ROUTE_PATHS.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#3B52DE] transition"
            >
              <ArrowLeft size={14} />
              <span>Quay lại Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

