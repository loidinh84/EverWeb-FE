import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Crown,
  Gift,
  Minus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal, useToast } from "../../components/common";
import { ROUTE_PATHS } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import subscriptionApi from "../../services/subscriptionApi";
import {
  BILLING_CYCLES,
  COMPARISON_GROUPS,
  PRICING_FAQS,
  PRICING_PLANS,
  PROMO_CONFIG,
  calculateDiscountedPrice,
  formatVnd,
  getActiveSubscription,
  getCyclePrice,
  saveActiveSubscription,
} from "../../constants/pricingPlans";

export default function PricingShowcase({ onOpenDashboard }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();

  const [billingCycle, setBillingCycle] = useState(BILLING_CYCLES.EVENT.id);
  const [showComparison, setShowComparison] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Đồng bộ trạng thái gói đang sử dụng (từ Backend API khi đã đăng nhập)
  const [activeSub, setActiveSub] = useState(() => getActiveSubscription());

  // Checkout Modal State
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [promoInput, setPromoInput] = useState(PROMO_CONFIG.code);
  const [appliedPromo, setAppliedPromo] = useState(
    PROMO_CONFIG.extraCodes[PROMO_CONFIG.code]
  );
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    subscriptionApi
      .getMySubscription()
      .then((res) => {
        if (!cancelled && res?.subscription) {
          saveActiveSubscription(res.subscription);
          setActiveSub(res.subscription);
          window.dispatchEvent(new Event("everweb:subscription-updated"));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const syncSub = () => setActiveSub(getActiveSubscription());
    window.addEventListener("everweb:subscription-updated", syncSub);
    return () =>
      window.removeEventListener("everweb:subscription-updated", syncSub);
  }, []);

  const handleCopyPromo = (code) => {
    navigator.clipboard?.writeText(code);
    toast.success(`Đã sao chép mã ưu đãi ${code} (-${PROMO_CONFIG.discountPercent}%)!`);
  };

  const createServerOrder = async (plan, cycleId, promoCode) => {
    if (!isAuthenticated) {
      setCurrentOrder(null);
      return;
    }
    try {
      setIsCreatingOrder(true);
      const order = await subscriptionApi.createOrder({
        planId: plan.id,
        cycleId,
        promoCode: promoCode || null,
      });
      setCurrentOrder(order);
    } catch {
      setCurrentOrder(null);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleSelectPlan = async (plan) => {
    if (plan.id === "free") {
      if (isAuthenticated) {
        try {
          const sub = await subscriptionApi.activateFreePlan({
            cycleId: billingCycle,
          });
          saveActiveSubscription(sub);
          setActiveSub(sub);
          window.dispatchEvent(new Event("everweb:subscription-updated"));
        } catch {
          // fallback local
        }
        toast.success("Đã kích hoạt Gói Cơ Bản miễn phí!");
        navigate(ROUTE_PATHS.EVENT_HUB);
      } else if (onOpenDashboard) {
        onOpenDashboard();
      } else {
        navigate(ROUTE_PATHS.LOGIN);
      }
      return;
    }

    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để tạo đơn nâng cấp gói dịch vụ.");
      navigate(ROUTE_PATHS.LOGIN, { state: { from: "/#pricing" } });
      return;
    }

    setPromoInput(PROMO_CONFIG.code);
    setAppliedPromo(PROMO_CONFIG.extraCodes[PROMO_CONFIG.code]);
    setCheckoutPlan(plan);
    await createServerOrder(plan, billingCycle, PROMO_CONFIG.code);
  };

  const handleApplyPromoCode = async (e) => {
    e?.preventDefault();
    const normalized = promoInput.trim().toUpperCase();
    if (!normalized) {
      setAppliedPromo(null);
      toast.info("Đã bỏ mã giảm giá.");
      if (checkoutPlan) await createServerOrder(checkoutPlan, billingCycle, null);
      return;
    }
    const found = PROMO_CONFIG.extraCodes[normalized];
    if (!found) {
      toast.error(
        `Mã "${normalized}" không hợp lệ. Thử dùng mã ${PROMO_CONFIG.code} để giảm 25%!`
      );
      return;
    }
    setAppliedPromo(found);
    toast.success(`Đã áp dụng mã ${found.code} (${found.label})!`);
    if (checkoutPlan) {
      await createServerOrder(checkoutPlan, billingCycle, found.code);
    }
  };

  const checkoutPricing = useMemo(() => {
    if (!checkoutPlan) return null;
    if (currentOrder) {
      const listPrice = currentOrder.original_amount;
      const finalPrice = currentOrder.final_amount;
      return {
        listPrice,
        discountPercent: currentOrder.discount_percent,
        finalPrice,
        savedAmount: Math.max(0, listPrice - finalPrice),
        transferNote: currentOrder.transfer_note,
        orderCode: currentOrder.order_code,
        qrUrl: currentOrder.qr_url,
      };
    }

    const listPrice = getCyclePrice(checkoutPlan.basePrice, billingCycle);
    const discountPercent = appliedPromo?.discountPercent || 0;
    const finalPrice = calculateDiscountedPrice(listPrice, discountPercent);
    const savedAmount = Math.max(0, listPrice - finalPrice);
    const transferNote = `EVERWEB ${checkoutPlan.id.toUpperCase()} ${
      appliedPromo?.code || "STD"
    }`;
    const qrUrl = `https://img.vietqr.io/image/VCB-1028472918-compact2.png?amount=${finalPrice}&addInfo=${encodeURIComponent(
      transferNote
    )}&accountName=${encodeURIComponent("EVERWEB VIETNAM")}`;

    return {
      listPrice,
      discountPercent,
      finalPrice,
      savedAmount,
      transferNote,
      orderCode: null,
      qrUrl,
    };
  }, [checkoutPlan, currentOrder, billingCycle, appliedPromo]);

  const handleConfirmUpgrade = async () => {
    if (!checkoutPlan || !checkoutPricing) return;
    setIsActivating(true);

    try {
      let savedSub = null;
      if (isAuthenticated && currentOrder?.id) {
        const res = await subscriptionApi.confirmOrderPayment(currentOrder.id);
        savedSub = res?.subscription;
      }

      const nextSub = savedSub || {
        planId: checkoutPlan.id,
        planName: checkoutPlan.name,
        cycleId: billingCycle,
        promoCode: appliedPromo?.code || null,
        discountPercent: checkoutPricing.discountPercent,
        pricePaid: checkoutPricing.finalPrice,
        userEmail: user?.email || null,
      };

      saveActiveSubscription(nextSub);
      setActiveSub(nextSub);
      window.dispatchEvent(new Event("everweb:subscription-updated"));
      setCheckoutPlan(null);
      setCurrentOrder(null);
      toast.success(
        `Chúc mừng! Đã kích hoạt ${checkoutPlan.name} thành công và lưu vào hệ thống.`
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Không thể xác nhận thanh toán lúc này. Vui lòng thử lại!"
      );
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <section
      id="pricing"
      className="relative py-20 sm:py-28 px-4 sm:px-8 lg:px-12 bg-[#FAF8F5] overflow-hidden border-t border-[#EAE3DB]"
    >
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[860px] h-[420px] rounded-full bg-gradient-to-r from-[#3B52DE]/10 via-[#C5A059]/10 to-[#5239D8]/10 blur-3xl"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header + Seasonal Promo Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3B52DE]/20 bg-white px-3.5 py-1.5 shadow-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#3446EB] px-2.5 py-0.5 text-[11px] font-bold text-white">
              <Sparkles className="w-3 h-3" />
              -{PROMO_CONFIG.discountPercent}%
            </span>
            <span className="text-xs font-semibold text-[#231F1C]">
              {PROMO_CONFIG.label} · Mã:
            </span>
            <button
              type="button"
              onClick={() => handleCopyPromo(PROMO_CONFIG.code)}
              className="inline-flex items-center gap-1 rounded-md bg-[#F2EFE9] hover:bg-[#E7E0D5] px-2 py-0.5 font-mono-num text-xs font-bold text-[#3446EB] transition cursor-pointer"
              title="Nhấn để sao chép mã giảm giá 25%"
            >
              <span>{PROMO_CONFIG.code}</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#231F1C] tracking-tight leading-[1.1]">
            Đầu tư nhỏ cho{" "}
            <span className="italic text-[#C5A059]">ngày trọng đại</span> hoàn
            hảo
          </h2>

          <p className="text-sm sm:text-base text-[#6B5E52] leading-relaxed max-w-2xl mx-auto">
            Thanh toán một lần duy nhất, không gia hạn ẩn. Dùng thử miễn phí
            toàn bộ luồng cơ bản trước khi nâng cấp bất kỳ lúc nào.
          </p>

          {/* Animated Billing Cycle Switcher */}
          <div className="pt-3 flex justify-center">
            <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-[#EAE3DB] shadow-xs">
              {Object.values(BILLING_CYCLES).map((cycle) => {
                const isActive = billingCycle === cycle.id;
                return (
                  <button
                    key={cycle.id}
                    type="button"
                    onClick={() => setBillingCycle(cycle.id)}
                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? "text-white"
                        : "text-[#6B5E52] hover:text-[#231F1C]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="pricing-cycle-pill"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                        className="absolute inset-0 rounded-full bg-[#231F1C] shadow-sm"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span>{cycle.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          isActive
                            ? "bg-white/15 text-[#F5E6D3]"
                            : "bg-[#F6F4F0] text-[#8C7A68]"
                        }`}
                      >
                        {cycle.sublabel}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* 3 Pricing Tier Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PRICING_PLANS.map((plan, index) => {
            const cyclePrice = getCyclePrice(plan.basePrice, billingCycle);
            const finalPrice = calculateDiscountedPrice(
              cyclePrice,
              plan.basePrice > 0 ? PROMO_CONFIG.discountPercent : 0
            );
            const saved = Math.max(0, cyclePrice - finalPrice);
            const isCurrentPlan = activeSub?.planId === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-3xl p-7 sm:p-8 transition-shadow duration-300 ${
                  plan.popular
                    ? "bg-[#1F1A17] text-white shadow-2xl ring-2 ring-[#3B52DE]/80"
                    : "bg-white text-[#231F1C] border border-[#EAE3DB] shadow-sm hover:shadow-xl"
                }`}
              >
                {/* Floating Popular / Active Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-2xl ${
                        plan.popular
                          ? "bg-[#3B52DE] text-white"
                          : plan.id === "vip"
                          ? "bg-[#C5A059]/15 text-[#9F7B34]"
                          : "bg-[#F6F4F0] text-[#6B5E52]"
                      }`}
                    >
                      {plan.id === "vip" ? (
                        <Crown className="w-4 h-4" />
                      ) : plan.popular ? (
                        <Zap className="w-4 h-4" />
                      ) : (
                        <Gift className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  {isCurrentPlan ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Đang dùng
                    </span>
                  ) : plan.badge ? (
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#3B52DE] to-[#6366F1] text-white shadow-md"
                          : "bg-[#FBF6EC] text-[#9F7B34] border border-[#C5A059]/30"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  ) : null}
                </div>

                <p
                  className={`text-xs leading-relaxed min-h-[34px] ${
                    plan.popular ? "text-stone-300" : "text-[#6B5E52]"
                  }`}
                >
                  {plan.tagline}
                </p>

                {/* Animated Price Block */}
                <div
                  className={`my-6 pb-6 border-b ${
                    plan.popular ? "border-white/15" : "border-[#F0EAE1]"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${plan.id}-${billingCycle}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {plan.basePrice === 0 ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono-num text-4xl font-extrabold tracking-tight">
                            0đ
                          </span>
                          <span
                            className={`text-xs ${
                              plan.popular ? "text-stone-400" : "text-[#8C7A68]"
                            }`}
                          >
                            / dùng thử không giới hạn thời gian
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono-num text-sm line-through ${
                                plan.popular
                                  ? "text-stone-400"
                                  : "text-[#8C7A68]"
                              }`}
                            >
                              {formatVnd(cyclePrice)}
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-500/15 text-rose-400 px-2 py-0.5 text-[11px] font-bold">
                              <Tag className="w-2.5 h-2.5" />-
                              {PROMO_CONFIG.discountPercent}%
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono-num text-4xl font-extrabold tracking-tight">
                              {formatVnd(finalPrice)}
                            </span>
                            <span
                              className={`text-xs ${
                                plan.popular
                                  ? "text-stone-300"
                                  : "text-[#6B5E52]"
                              }`}
                            >
                              /{" "}
                              {billingCycle === BILLING_CYCLES.EVENT.id
                                ? "1 sự kiện"
                                : "vĩnh viễn"}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] font-medium ${
                              plan.popular
                                ? "text-emerald-300"
                                : "text-emerald-700"
                            }`}
                          >
                            Tiết kiệm ngay {formatVnd(saved)} với mã{" "}
                            {PROMO_CONFIG.code}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Highlights */}
                <ul className="space-y-3 text-xs sm:text-[13px] flex-1">
                  {plan.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          plan.popular
                            ? "bg-[#3B52DE]/30 text-indigo-300"
                            : plan.id === "vip"
                            ? "bg-[#C5A059]/20 text-[#9F7B34]"
                            : "bg-[#F2EFE9] text-[#6B5E52]"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span
                        className={
                          plan.popular ? "text-stone-200" : "text-[#3D352E]"
                        }
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-8 pt-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full rounded-2xl py-3.5 px-5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
                      plan.popular
                        ? "bg-[#3446EB] hover:bg-[#2939D6] text-white shadow-indigo-900/40 shadow-lg"
                        : plan.id === "vip"
                        ? "bg-[#231F1C] hover:bg-black text-white"
                        : "bg-[#F4F0EA] hover:bg-[#EAE3DB] text-[#231F1C]"
                    }`}
                  >
                    <span>
                      {isCurrentPlan
                        ? plan.id === "free"
                          ? "Vào Trung tâm sự kiện"
                          : "Gia hạn / Đổi chu kỳ"
                        : plan.ctaText}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Toggle Feature Comparison Table */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setShowComparison((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-[#DFD7CC] bg-white hover:bg-[#F6F4F0] px-6 py-3 text-xs sm:text-sm font-bold text-[#231F1C] shadow-xs transition cursor-pointer"
          >
            <span>
              {showComparison
                ? "Thu gọn bảng so sánh chi tiết"
                : "Xem bảng so sánh chi tiết toàn bộ tính năng"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                showComparison ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: "easeInOut" }}
                className="overflow-hidden mt-6 text-left"
              >
                <div className="rounded-3xl border border-[#EAE3DB] bg-white shadow-sm overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#EAE3DB] bg-[#FAF8F5]">
                        <th className="py-4 px-5 font-bold text-[#231F1C] w-[46%]">
                          Tính năng hệ thống EverWeb
                        </th>
                        <th className="py-4 px-4 text-center font-bold text-[#6B5E52]">
                          Cơ Bản
                        </th>
                        <th className="py-4 px-4 text-center font-bold text-[#3446EB]">
                          Pro — Mùa Cưới
                        </th>
                        <th className="py-4 px-4 text-center font-bold text-[#9F7B34]">
                          VIP — Trọn Gói
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_GROUPS.map((group) => (
                        <GroupRows key={group.category} group={group} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust Bar + FAQ */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 rounded-3xl bg-white border border-[#EAE3DB] p-6 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Cam kết minh bạch từ EverWeb</span>
            </div>
            <h3 className="font-display text-3xl text-[#231F1C] leading-snug">
              Câu hỏi thường gặp về Bảng giá
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5E52] leading-relaxed">
              Mọi thay đổi gói dịch vụ đều đồng bộ tức thì với sự kiện cưới của
              bạn trên Hub, Website cưới và Thiệp mời số — không bao giờ làm mất
              dữ liệu khách mời đã nhập.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate(ROUTE_PATHS.INVITATION + "?view=true")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F0EAE1] border border-[#EAE3DB] px-3.5 py-2 text-xs font-semibold text-[#231F1C] transition cursor-pointer"
              >
                <span>Xem thử Thiệp số mẫu N00</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {PRICING_FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#EAE3DB] bg-white overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-xs sm:text-sm font-bold text-[#231F1C] hover:bg-[#FAF8F5] transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-[#8C7A68] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.24 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-xs sm:text-sm text-[#6B5E52] leading-relaxed border-t border-[#F4EFE8] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Checkout & VietQR Upgrade Modal */}
      <Modal
        isOpen={Boolean(checkoutPlan)}
        onClose={() => !isActivating && setCheckoutPlan(null)}
        title={`Nâng cấp ${checkoutPlan?.name || ""}`}
        size="lg"
      >
        {checkoutPlan && checkoutPricing && (
          <div className="space-y-5 text-xs text-stone-700">
            {/* Summary Card */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7A68]">
                  Gói dịch vụ đã chọn
                </p>
                <p className="text-base font-bold text-[#231F1C] mt-0.5">
                  {checkoutPlan.name} ·{" "}
                  <span className="text-[#3446EB]">
                    {
                      Object.values(BILLING_CYCLES).find(
                        (c) => c.id === billingCycle
                      )?.label
                    }
                  </span>
                </p>
              </div>
              <div className="text-left sm:text-right">
                {checkoutPricing.savedAmount > 0 && (
                  <p className="font-mono-num text-xs line-through text-stone-400">
                    {formatVnd(checkoutPricing.listPrice)}
                  </p>
                )}
                <p className="font-mono-num text-2xl font-extrabold text-[#3446EB]">
                  {formatVnd(checkoutPricing.finalPrice)}
                </p>
              </div>
            </div>

            {/* Promo Code Form */}
            <form
              onSubmit={handleApplyPromoCode}
              className="p-3.5 rounded-2xl border border-[#EAE3DB] bg-white space-y-2"
            >
              <label className="font-bold text-stone-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#3446EB]" />
                <span>Mã ưu đãi mùa cưới:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Nhập mã (VD: MUACUOI25)"
                  className="flex-1 rounded-xl border border-stone-300 px-3 py-2 text-xs font-mono-num font-bold uppercase text-stone-900 outline-none focus:border-[#3446EB]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#231F1C] hover:bg-black text-white px-4 py-2 font-bold cursor-pointer transition"
                >
                  Áp dụng
                </button>
              </div>
              {appliedPromo && (
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Đang áp dụng {appliedPromo.code}: Giảm{" "}
                  {appliedPromo.discountPercent}% (Tiết kiệm{" "}
                  {formatVnd(checkoutPricing.savedAmount)})
                </p>
              )}
            </form>

            {/* VietQR Payment Block */}
            <div className="p-4 rounded-2xl border border-[#EAE3DB] bg-white text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3446EB]">
                <QrCode className="w-3.5 h-3.5" />
                <span>Quét mã VietQR để thanh toán nhanh</span>
              </div>
              <div className="inline-block p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DB]">
                <img
                  src={checkoutPricing.qrUrl}
                  alt="Mã VietQR thanh toán EverWeb"
                  className="w-44 h-44 object-contain mx-auto rounded-lg bg-white p-1.5"
                />
              </div>
              <div className="text-[11px] text-stone-600 space-y-1">
                <p>
                  Số tiền:{" "}
                  <strong className="font-mono-num text-stone-900">
                    {formatVnd(checkoutPricing.finalPrice)}
                  </strong>{" "}
                  · Nội dung CK:{" "}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        checkoutPricing.transferNote
                      );
                      toast.success("Đã sao chép nội dung chuyển khoản!");
                    }}
                    className="font-mono-num font-bold text-[#3446EB] hover:underline cursor-pointer"
                  >
                    {checkoutPricing.transferNote}
                  </button>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={isActivating || isCreatingOrder}
                onClick={() => {
                  setCheckoutPlan(null);
                  setCurrentOrder(null);
                }}
                className="rounded-xl border border-stone-200 px-4 py-2.5 font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
              >
                Để sau
              </button>
              <button
                type="button"
                disabled={isActivating || isCreatingOrder}
                onClick={handleConfirmUpgrade}
                className="rounded-xl bg-[#3446EB] hover:bg-[#2939D6] disabled:opacity-60 text-white px-5 py-2.5 font-bold shadow-md transition cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isCreatingOrder
                    ? "Đang tạo đơn hàng..."
                    : isActivating
                    ? "Đang kích hoạt gói..."
                    : "Xác nhận đã chuyển khoản & Kích hoạt ngay"}
                </span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

function GroupRows({ group }) {
  return (
    <>
      <tr className="bg-[#FAF8F5]/70 border-b border-[#EAE3DB]">
        <td
          colSpan={4}
          className="py-2.5 px-5 text-[11px] font-bold uppercase tracking-wider text-[#8C7A68]"
        >
          {group.category}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr
          key={row.label}
          className="border-b border-[#F3EEE7] last:border-b-0 hover:bg-[#FAF8F5]/50 transition-colors"
        >
          <td className="py-3.5 px-5 font-medium text-[#231F1C]">
            {row.label}
          </td>
          <ComparisonCell value={row.free} />
          <ComparisonCell value={row.pro} highlight />
          <ComparisonCell value={row.vip} />
        </tr>
      ))}
    </>
  );
}

function ComparisonCell({ value, highlight = false }) {
  if (typeof value === "boolean") {
    return (
      <td className="py-3.5 px-4 text-center">
        {value ? (
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
              highlight
                ? "bg-[#3446EB]/15 text-[#3446EB]"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </span>
        ) : (
          <span className="inline-flex h-5 w-5 items-center justify-center text-stone-300">
            <Minus className="w-3.5 h-3.5" />
          </span>
        )}
      </td>
    );
  }
  return (
    <td
      className={`py-3.5 px-4 text-center text-xs font-semibold ${
        highlight ? "text-[#3446EB]" : "text-[#6B5E52]"
      }`}
    >
      {value}
    </td>
  );
}

