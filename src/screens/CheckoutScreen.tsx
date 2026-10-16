import React, { useState } from 'react';
import {
  Check,
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  Wallet,
  Building,
  Banknote,
  Edit2,
  ChevronRight,
  Plus,
  Tag,
  TicketPercent,
  Smartphone,
  Lock,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutScreen: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    cartDeliveryCharge,
    couponCode,
    appliedCouponDiscount,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    placeOrder,
    navigate,
    showToast,
    user,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(2);
  const [deliveryOption, setDeliveryOption] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD' | 'NetBanking' | 'Wallet'>('UPI');

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM'>('GPay');
  const [upiId, setUpiId] = useState('afneel@okaxis');

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 8912');
  const [cardHolder, setCardHolder] = useState('Afneel');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [saveCard, setSaveCard] = useState(true);

  // Cash on Delivery State
  const [codCaptchaTarget, setCodCaptchaTarget] = useState('4829');
  const [codCaptchaInput, setCodCaptchaInput] = useState('4829');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Address picker state
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  // Interactive Payment Gateway Simulator Modal State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentStage, setPaymentStage] = useState<'authorizing' | 'otp' | 'success'>('authorizing');
  const [otpCode, setOtpCode] = useState('749215');

  const currentAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const finalAmount = cartTotal + (deliveryOption === 'Express' ? 49 : 0);

  // Helper for Card Network Logo
  const getCardNetwork = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('6')) return 'RuPay';
    if (clean.startsWith('3')) return 'Amex';
    return 'Card';
  };

  // Card formatting
  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const formatted = clean.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      clean = `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    setCardExpiry(clean);
  };

  const regenerateCaptcha = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCodCaptchaTarget(newCode);
    setCodCaptchaInput('');
  };

  // Initiate Payment / Order Confirmation Flow
  const handleInitiateOrder = () => {
    if (!currentAddress) {
      showToast('Please select or add a shipping address', 'error');
      return;
    }

    // Validation per payment option
    if (paymentMethod === 'UPI') {
      if (!upiId.trim() || !upiId.includes('@')) {
        showToast('Please enter a valid UPI ID (e.g. name@okaxis)', 'error');
        return;
      }
    } else if (paymentMethod === 'Card') {
      const cleanNum = cardNumber.replace(/\D/g, '');
      if (cleanNum.length < 15) {
        showToast('Please enter a valid 16-digit card number', 'error');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        showToast('Please enter a valid expiry date (MM/YY)', 'error');
        return;
      }
      if (cardCvv.length < 3) {
        showToast('Please enter a 3-digit CVV', 'error');
        return;
      }
    } else if (paymentMethod === 'COD') {
      if (codCaptchaInput.trim() !== codCaptchaTarget.trim()) {
        showToast('Please enter the matching verification code for COD', 'error');
        return;
      }
    } else if (paymentMethod === 'NetBanking') {
      if (!selectedBank) {
        showToast('Please select your bank for Net Banking', 'error');
        return;
      }
    }

    // Open Payment Gateway Simulator
    setPaymentModalOpen(true);
    setPaymentStage('authorizing');
    setIsProcessingPayment(true);

    if (paymentMethod === 'Card') {
      // Show 3D Secure OTP stage after 1.2s
      setTimeout(() => {
        setPaymentStage('otp');
        setIsProcessingPayment(false);
      }, 1200);
    } else if (paymentMethod === 'COD') {
      // Immediate order confirmation for COD
      setTimeout(() => {
        finishPaymentAndPlaceOrder();
      }, 1400);
    } else {
      // UPI / Net Banking auto-auth simulation
      setTimeout(() => {
        finishPaymentAndPlaceOrder();
      }, 2000);
    }
  };

  const finishPaymentAndPlaceOrder = () => {
    setIsProcessingPayment(false);
    setPaymentStage('success');

    setTimeout(() => {
      let methodLabel = 'UPI';
      if (paymentMethod === 'UPI') {
        methodLabel = `UPI (${selectedUpiApp} - ${upiId})`;
      } else if (paymentMethod === 'Card') {
        methodLabel = `Credit Card (${getCardNetwork(cardNumber)} •••• ${cardNumber.slice(-4)})`;
      } else if (paymentMethod === 'COD') {
        methodLabel = 'Cash on Delivery';
      } else if (paymentMethod === 'NetBanking') {
        methodLabel = `Net Banking (${selectedBank})`;
      } else if (paymentMethod === 'Wallet') {
        methodLabel = 'ZOODI Wallet';
      }

      const order = placeOrder({
        address: currentAddress,
        deliveryOption,
        paymentMethod: methodLabel,
      });

      setPaymentModalOpen(false);
      navigate('order_placed', { orderId: order.id });
    }, 1200);
  };

  return (
    <div className="pb-36 p-4 flex flex-col gap-4">
      {/* Stepper (1 Shipping, 2 Payment, 3 Review) */}
      <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-pink-500 text-white">
            1
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Shipping
          </span>
        </div>

        <div className="w-6 h-0.5 bg-pink-500" />

        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-pink-500 text-white">
            2
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Payment
          </span>
        </div>

        <div className="w-6 h-0.5 bg-slate-200 dark:bg-slate-700" />

        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            3
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Review
          </span>
        </div>
      </div>

      {/* Shipping Address Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-500" />
            <span>Shipping Address</span>
          </h3>
          <button
            type="button"
            onClick={() => setShowAddressPicker(true)}
            className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Change</span>
          </button>
        </div>

        {currentAddress ? (
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {currentAddress.name}
            </p>
            <p className="mt-1">
              {currentAddress.addressLine}, {currentAddress.city} - {currentAddress.pincode}
            </p>
            <p className="text-slate-400 dark:text-slate-500 mt-1">
              Phone: {currentAddress.phone}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate('addresses')}
            className="w-full py-3 rounded-xl border border-dashed border-pink-500 text-pink-500 text-xs font-bold"
          >
            + Add Shipping Address
          </button>
        )}
      </div>

      {/* Delivery Options */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-teal-500" />
          <span>Delivery Options</span>
        </h3>

        <div className="flex flex-col gap-2.5">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="delivery"
                checked={deliveryOption === 'Standard'}
                onChange={() => setDeliveryOption('Standard')}
                className="accent-pink-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Standard Delivery
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Estimated 3-5 business days
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              FREE
            </span>
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="delivery"
                checked={deliveryOption === 'Express'}
                onChange={() => setDeliveryOption('Express')}
                className="accent-pink-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Express Delivery
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Estimated 1-2 business days
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              ₹49
            </span>
          </label>
        </div>
      </div>

      {/* Payment Method Section (Matching User Image with all Working Options) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-pink-500" />
            <span>PAYMENT METHOD</span>
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>100% Secure</span>
          </span>
        </h3>

        <div className="flex flex-col gap-2.5">
          {/* 1. UPI (Google Pay / PhonePe / Paytm) */}
          <div
            onClick={() => setPaymentMethod('UPI')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
              paymentMethod === 'UPI'
                ? 'border-pink-500 bg-pink-50/20 dark:bg-pink-950/20 ring-1 ring-pink-500/30'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="accent-pink-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  UPI (Google Pay / PhonePe / Paytm)
                </span>
              </div>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                Instant
              </span>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="pl-6 pt-1 flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
                {/* UPI App selector tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'GPay', label: 'Google Pay' },
                    { id: 'PhonePe', label: 'PhonePe' },
                    { id: 'Paytm', label: 'Paytm' },
                    { id: 'BHIM', label: 'BHIM UPI' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id as any)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                        selectedUpiApp === app.id
                          ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>

                {/* Input matching screenshot */}
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. name@okaxis)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                  />
                  {upiId.includes('@') && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center gap-1 text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Quick handle pills */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Quick handles:</span>
                  {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => {
                        const prefix = upiId.split('@')[0] || 'afneel';
                        setUpiId(`${prefix}${handle}`);
                      }}
                      className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-pink-600 dark:text-pink-400 font-mono hover:bg-pink-50 transition-colors"
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Credit / Debit Card */}
          <div
            onClick={() => setPaymentMethod('Card')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
              paymentMethod === 'Card'
                ? 'border-pink-500 bg-pink-50/20 dark:bg-pink-950/20 ring-1 ring-pink-500/30'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="accent-pink-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Credit / Debit Card
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600">VISA</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-amber-600">Master</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600">RuPay</span>
              </div>
            </div>

            {paymentMethod === 'Card' && (
              <div className="pl-6 pt-1 flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
                {/* Card Number */}
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono tracking-wider"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {getCardNetwork(cardNumber)}
                  </span>
                </div>

                {/* Cardholder Name */}
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Cardholder Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                  />
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="CVV"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Save card */}
                <label className="flex items-center gap-2 cursor-pointer mt-0.5">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="accent-pink-500 rounded"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Save this card securely for faster checkout
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* 3. Cash on Delivery */}
          <div
            onClick={() => setPaymentMethod('COD')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
              paymentMethod === 'COD'
                ? 'border-pink-500 bg-pink-50/20 dark:bg-pink-950/20 ring-1 ring-pink-500/30'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-pink-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Cash on Delivery
                </span>
              </div>
              <Banknote className="w-4 h-4 text-emerald-500" />
            </div>

            {paymentMethod === 'COD' && (
              <div className="pl-6 pt-1 flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pay at doorstep with Cash or UPI QR Code</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                    Exact cash amount or UPI payment accepted by delivery executive upon package arrival.
                  </p>
                </div>

                {/* Security verification code to prevent accidental orders */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-mono font-black text-sm tracking-widest text-slate-800 dark:text-white select-none">
                    <span>{codCaptchaTarget}</span>
                    <button
                      type="button"
                      onClick={regenerateCaptcha}
                      className="p-0.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      title="New Code"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    value={codCaptchaInput}
                    onChange={(e) => setCodCaptchaInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-center"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Net Banking */}
          <div
            onClick={() => setPaymentMethod('NetBanking')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
              paymentMethod === 'NetBanking'
                ? 'border-pink-500 bg-pink-50/20 dark:bg-pink-950/20 ring-1 ring-pink-500/30'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'NetBanking'}
                  onChange={() => setPaymentMethod('NetBanking')}
                  className="accent-pink-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Net Banking
                </span>
              </div>
              <Building className="w-4 h-4 text-slate-400" />
            </div>

            {paymentMethod === 'NetBanking' && (
              <div className="pl-6 pt-1 flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Popular Banks:
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    'HDFC Bank',
                    'SBI',
                    'ICICI Bank',
                    'Axis Bank',
                    'Kotak Bank',
                    'PNB',
                  ].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2 rounded-xl text-center text-[11px] font-bold border transition-all ${
                        selectedBank === bank
                          ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-pink-400'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>

                {/* All Banks Dropdown */}
                <div className="mt-1">
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Or select other bank:
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Bank">Kotak Mahindra Bank</option>
                    <option value="PNB">Punjab National Bank (PNB)</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Canara Bank">Canara Bank</option>
                    <option value="Union Bank of India">Union Bank of India</option>
                    <option value="IndusInd Bank">IndusInd Bank</option>
                    <option value="Federal Bank">Federal Bank</option>
                    <option value="IDBI Bank">IDBI Bank</option>
                    <option value="YES Bank">YES Bank</option>
                    <option value="South Indian Bank">South Indian Bank</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary & Applied Coupon Breakdown */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Order Summary ({cart.length} items)
          </h3>
          <button
            type="button"
            onClick={() => navigate('coupons')}
            className="text-[11px] font-bold text-[#DF1951] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <TicketPercent className="w-3.5 h-3.5" />
            <span>{couponCode ? 'Change Coupon' : 'Apply Coupon'}</span>
          </button>
        </div>

        {couponCode && (
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Coupon Applied: '{couponCode}'
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              -₹{appliedCouponDiscount.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Items Total</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ₹{cartSubtotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Coupon Discount {couponCode ? `(${couponCode})` : ''}
          </span>
          <span
            className={`font-semibold ${
              cartDiscount > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {cartDiscount > 0 ? `-₹${cartDiscount.toLocaleString('en-IN')}` : '₹0'}
          </span>
        </div>

        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Delivery Charge</span>
          <span className="font-semibold">
            {deliveryOption === 'Express' ? (
              <span>₹49 (Express)</span>
            ) : cartDeliveryCharge === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
            ) : (
              <span>₹{cartDeliveryCharge}</span>
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
          <span>To Pay</span>
          <span className="text-base text-pink-600 dark:text-pink-400 font-black">
            ₹{finalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Sticky Place Order CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 shadow-lg">
        <button
          type="button"
          onClick={handleInitiateOrder}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Pay & Place Order • ₹{finalAmount.toLocaleString('en-IN')}</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-1.5 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Secured by 256-Bit SSL Payment Gateway</span>
        </p>
      </div>

      {/* Address Picker Modal */}
      {showAddressPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Select Delivery Address
            </h3>
            <div className="flex flex-col gap-2.5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    setShowAddressPicker(false);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {addr.name} ({addr.type})
                    </span>
                    {selectedAddressId === addr.id && (
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {addr.addressLine}, {addr.city} - {addr.pincode}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{addr.phone}</p>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setShowAddressPicker(false);
                  navigate('addresses');
                }}
                className="mt-2 py-2.5 rounded-xl border border-dashed border-pink-500 text-pink-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add / Manage Addresses</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Payment Gateway Processing Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-center">
            {paymentStage === 'authorizing' && (
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-pink-50 dark:bg-pink-950/50 text-pink-500 flex items-center justify-center mb-4 relative">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {paymentMethod === 'UPI' && 'Connecting to UPI Gateway...'}
                  {paymentMethod === 'Card' && 'Contacting Bank 3D Secure...'}
                  {paymentMethod === 'NetBanking' && `Connecting to ${selectedBank}...`}
                  {paymentMethod === 'COD' && 'Confirming Cash on Delivery...'}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {paymentMethod === 'UPI' && `Approve payment of ₹${finalAmount} on ${upiId}`}
                  {paymentMethod === 'Card' && `Verifying card ending in ${cardNumber.slice(-4)}`}
                  {paymentMethod === 'NetBanking' && 'Transferring to secure net banking gateway'}
                  {paymentMethod === 'COD' && `Booking order for ₹${finalAmount}`}
                </p>

                {paymentMethod === 'UPI' && (
                  <button
                    type="button"
                    onClick={finishPaymentAndPlaceOrder}
                    className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer mt-2"
                  >
                    Simulate UPI Approval (Instant)
                  </button>
                )}
              </div>
            )}

            {paymentStage === 'otp' && (
              <div className="flex flex-col items-center py-2 text-left">
                <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-pink-500" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Bank 3D Secure Verification</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">OTP via SMS</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                  Enter the 6-digit One Time Password (OTP) sent to your mobile registered with your bank:
                </p>

                <div className="w-full mb-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center text-lg font-mono tracking-widest font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
                    <span>Resend OTP in 24s</span>
                    <button
                      type="button"
                      onClick={() => setOtpCode('749215')}
                      className="text-pink-500 font-bold hover:underline"
                    >
                      Auto-fill: 749215
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={finishPaymentAndPlaceOrder}
                  className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify OTP & Pay ₹{finalAmount}</span>
                </button>
              </div>
            )}

            {paymentStage === 'success' && (
              <div className="flex flex-col items-center py-6 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Payment Approved!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ₹{finalAmount} authorized successfully. Creating your order...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
