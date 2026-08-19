import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  Wallet,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, PlanTier, UserProfile } from '../types';
import { translations } from '../translations';
import { DEFAULT_PLANS } from '../utils/storage';

interface PricingModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpgradePlan: (planId: PlanTier['id'], storageGB: number) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  lang,
  isOpen,
  onClose,
  user,
  onUpgradePlan,
}) => {
  const t = translations[lang];
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<'card' | 'paypal' | 'crypto' | 'wallets'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Ammar Yaser');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  if (!isOpen) return null;

  const handleSelectPlan = (plan: PlanTier) => {
    if (plan.id === user.plan) return;
    setSelectedPlan(plan);
    setPaymentComplete(false);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
      onUpgradePlan(selectedPlan.id, selectedPlan.storageGB);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-850/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{t.pricing.title}</h2>
              <p className="text-xs text-slate-400">{t.pricing.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {selectedPlan ? (
            /* PAYMENT CHECKOUT VIEW */
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{lang === 'ar' ? 'الرجوع إلى قائمة الخطط' : 'Back to Plans'}</span>
              </button>

              {paymentComplete ? (
                /* INVOICE & SUCCESS */
                <div className="text-center py-8 space-y-4 bg-emerald-950/20 border border-emerald-800/40 rounded-3xl p-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-black text-white">{t.pricing.invoiceGenerated}</h3>
                  <p className="text-xs text-slate-300">
                    {lang === 'ar'
                      ? `تمت ترقية حسابك إلى ${selectedPlan.nameAr} بسعة ${selectedPlan.storageGB} جيجابايت بنجاح!`
                      : `Your account has been upgraded to ${selectedPlan.name} (${selectedPlan.storageGB} GB Storage) successfully!`}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-md mx-auto text-start font-mono text-xs text-slate-300 space-y-2">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Invoice ID:</span>
                      <span className="text-cyan-400 font-bold">INV-2026-MC-{Math.floor(1000 + Math.random() * 9000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tier:</span>
                      <span className="font-bold">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Paid:</span>
                      <span className="text-emerald-400 font-bold">
                        ${billingCycle === 'annual' ? selectedPlan.priceAnnual : selectedPlan.priceMonthly} USD
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-emerald-400 font-bold">PAID (Instant Activation)</span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg cursor-pointer"
                  >
                    {lang === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Proceed to Dashboard'}
                  </button>
                </div>
              ) : (
                /* CHECKOUT GATEWAY SELECTION & FORM */
                <form onSubmit={handleProcessPayment} className="space-y-6">
                  {/* Selected Plan Summary Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-400">Selected Plan</span>
                      <h4 className="text-base font-black text-white">{lang === 'ar' ? selectedPlan.nameAr : selectedPlan.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {selectedPlan.storageGB >= 1000 ? `${selectedPlan.storageGB / 1000} TB` : `${selectedPlan.storageGB} GB`} Storage • Unlimited Direct Speed
                      </p>
                    </div>
                    <div className="text-end">
                      <div className="text-2xl font-black text-white">
                        ${billingCycle === 'annual' ? selectedPlan.priceAnnual : selectedPlan.priceMonthly}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {billingCycle === 'annual' ? '/ year (20% off)' : '/ month'}
                      </span>
                    </div>
                  </div>

                  {/* Payment Gateway Tabs */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">{t.pricing.selectGateway}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentGateway('card')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentGateway === 'card'
                            ? 'bg-blue-600/20 border-blue-500 text-cyan-300 shadow-md'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>{t.pricing.creditCard}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentGateway('paypal')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentGateway === 'paypal'
                            ? 'bg-blue-600/20 border-blue-500 text-cyan-300 shadow-md'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Zap className="w-5 h-5 text-blue-400" />
                        <span>PayPal Express</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentGateway('crypto')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentGateway === 'crypto'
                            ? 'bg-blue-600/20 border-blue-500 text-cyan-300 shadow-md'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Coins className="w-5 h-5 text-amber-400" />
                        <span>USDT / BTC</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentGateway('wallets')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentGateway === 'wallets'
                            ? 'bg-blue-600/20 border-blue-500 text-cyan-300 shadow-md'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Wallet className="w-5 h-5 text-emerald-400" />
                        <span>Apple Pay / Mada</span>
                      </button>
                    </div>
                  </div>

                  {/* Gateway Form Inputs */}
                  {paymentGateway === 'card' && (
                    <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-750">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400">{t.pricing.cardNumber}</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full mt-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-400">{t.pricing.expiry}</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="w-full mt-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-400">{t.pricing.cvv}</label>
                          <input
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="w-full mt-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentGateway === 'crypto' && (
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-2 text-xs text-amber-200">
                      <p className="font-bold">Instant USDT (TRC-20) Payment Address:</p>
                      <p className="font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-amber-400 select-all">
                        TYg83J99KxL2PmqWs4X88aBvcReQW1942K
                      </p>
                      <p className="text-[11px] text-slate-400">Your cloud quota activates instantly upon network confirmation.</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{processing ? 'Processing Secure Payment...' : t.pricing.payNow}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t.pricing.guarantee}</span>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* PLANS GRID */
            <>
              {/* Billing Toggle */}
              <div className="flex items-center justify-center">
                <div className="flex items-center p-1 rounded-2xl bg-slate-800 border border-slate-700/80">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.pricing.monthly}
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{t.pricing.annual}</span>
                    <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DEFAULT_PLANS.map((plan) => {
                  const isCurrent = user.plan === plan.id;
                  const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col justify-between p-5 rounded-3xl transition-all ${
                        plan.isPopular
                          ? 'bg-gradient-to-b from-blue-950/80 via-slate-900 to-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/20'
                          : 'bg-slate-850/80 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                          {lang === 'ar' ? plan.badgeAr : plan.badge}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-black text-white">
                            {lang === 'ar' ? plan.nameAr : plan.name}
                          </h3>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-black text-white">${price}</span>
                            <span className="text-xs text-slate-400">
                              {price === 0 ? '' : billingCycle === 'annual' ? '/yr' : '/mo'}
                            </span>
                          </div>
                        </div>

                        {/* Storage Badge */}
                        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-200">
                          <span>{lang === 'ar' ? 'مساحة التخزين' : 'Cloud Storage'}</span>
                          <span className="text-cyan-400 font-mono">
                            {plan.storageGB >= 1000 ? `${plan.storageGB / 1000} TB` : `${plan.storageGB} GB`}
                          </span>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-2 text-xs text-slate-300">
                          {(lang === 'ar' ? plan.featuresAr : plan.features).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Upgrade CTA */}
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        disabled={isCurrent}
                        className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            : plan.isPopular
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isCurrent ? (
                          <span>{t.pricing.currentPlan}</span>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>{t.pricing.choosePlan}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
