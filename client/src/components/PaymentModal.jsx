import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap,
  Sparkles,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, event, user, onSuccess }) => {
  if (!isOpen || !event) return null;

  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'demo'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('Initiating payment gateway...');
  const [error, setError] = useState('');

  // Form states
  const [upiId, setUpiId] = useState(user?.email ? `${user.email.split('@')[0]}@okaxis` : '');
  const [cardNumber, setCardNumber] = useState('4532 8920 1192 4831');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardName, setCardName] = useState(user?.name || 'Alen Student');
  const [selectedBank, setSelectedBank] = useState('Federal Bank');

  const price = event.price || 0;

  const handleExecutePayment = (method) => {
    setError('');
    setIsProcessing(true);
    setProcessingStep('Connecting to Sahrdaya Banking Gateway (SSL 256-bit)...');

    setTimeout(() => {
      setProcessingStep(`Authorizing ₹${price} via ${method}...`);
    }, 600);

    setTimeout(() => {
      setProcessingStep('Payment approved! Generating digital admission pass...');
    }, 1200);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedTxnId = `SHR-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      onSuccess({
        paymentMethod: method,
        paymentId: generatedTxnId,
        paymentAmount: price,
      });
    }, 1600);
  };

  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (!upiId || !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. student@okaxis)');
      return;
    }
    handleExecutePayment(`UPI (${upiId})`);
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    handleExecutePayment('Debit / Credit Card');
  };

  const handleBankSubmit = (e) => {
    e.preventDefault();
    handleExecutePayment(`Net Banking (${selectedBank})`);
  };

  const handleDemoInstantPay = () => {
    handleExecutePayment('Instant Demo Gateway (Viva Mode)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Sahrdaya Pay</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-400">Campus Official Event Payment Gateway</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition relative z-10 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Processing Overlay */}
        {isProcessing ? (
          <div className="p-10 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-black text-gray-900">Processing Your Payment</h4>
              <p className="text-xs font-medium text-indigo-600 animate-pulse">{processingStep}</p>
              <p className="text-[11px] text-gray-400">Please do not refresh or close this window.</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 max-w-sm mx-auto text-xs text-gray-600">
              Total Amount: <span className="font-extrabold text-gray-900">₹{price}.00</span>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-6">
            {/* Event & Pricing Summary */}
            <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Event Registration
                </span>
                <h4 className="text-sm font-black text-gray-900 line-clamp-1">{event.title}</h4>
                <p className="text-xs text-gray-500">
                  {event.clubName} • {event.venue}
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-indigo-100 sm:pl-4">
                <span className="text-[10px] text-gray-500 font-medium block">Total Payable</span>
                <div className="text-2xl font-black text-indigo-700">₹{price}</div>
                <span className="text-[10px] text-emerald-600 font-bold block">No convenience fee</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Tabs */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-gray-100 rounded-2xl text-xs font-bold text-gray-600">
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    activeTab === 'upi'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'hover:text-gray-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    activeTab === 'card'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'hover:text-gray-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span className="text-[11px]">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    activeTab === 'netbanking'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'hover:text-gray-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="text-[11px]">Net Banking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    activeTab === 'demo'
                      ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm'
                      : 'hover:text-gray-900 text-indigo-700 font-extrabold'
                  }`}
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span className="text-[11px]">Viva Demo</span>
                </button>
              </div>

              {/* Tab 1: UPI / QR */}
              {activeTab === 'upi' && (
                <form onSubmit={handleUpiSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    {/* Simulated Authentic QR */}
                    <div className="w-32 h-32 bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center shrink-0">
                      <div className="grid grid-cols-4 gap-1 w-24 h-24 p-1 border-2 border-indigo-900 rounded-lg">
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                        <div className="bg-indigo-900 rounded-sm"></div>
                      </div>
                      <span className="text-[9px] font-black tracking-widest text-indigo-700 mt-1 uppercase">
                        Scan to Pay ₹{price}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5 font-bold text-gray-800">
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                        <span>Scan with any UPI App</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Scan this QR with Google Pay, PhonePe, Paytm, or BHIM to pay instantly.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-bold text-gray-700">
                          GPay
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-bold text-gray-700">
                          PhonePe
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-bold text-gray-700">
                          Paytm
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-bold text-gray-700">
                          BHIM UPI
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Or Enter Your UPI ID (VPA)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. alen@okaxis or mobile@upi"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    {/* Quick handles */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 pt-1">
                      <span>Quick handles:</span>
                      {['@okaxis', '@oksbi', '@paytm', '@ybl'].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => {
                            const prefix = upiId.includes('@') ? upiId.split('@')[0] : upiId || 'student';
                            setUpiId(`${prefix}${h}`);
                          }}
                          className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 font-mono text-[10px] text-gray-700 transition"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    <span>Pay ₹{price}.00 via UPI</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Tab 2: Card */}
              {activeTab === 'card' && (
                <form onSubmit={handleCardSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength="19"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 8920 1192 4831"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-16"
                        required
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        RuPay / Visa
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name as on card"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{price}.00 Securely</span>
                  </button>
                </form>
              )}

              {/* Tab 3: Net Banking */}
              {activeTab === 'netbanking' && (
                <form onSubmit={handleBankSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Select Your Bank
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        'Federal Bank',
                        'State Bank of India',
                        'South Indian Bank',
                        'HDFC Bank',
                        'ICICI Bank',
                        'Canara Bank',
                      ].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3 rounded-xl border text-left font-bold transition flex items-center justify-between ${
                            selectedBank === bank
                              ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <span>{bank}</span>
                          {selectedBank === bank && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    You will be redirected to {selectedBank}&apos;s secure authorization gateway to approve ₹{price}.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    <span>Proceed with {selectedBank} (₹{price})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Tab 4: Fast Viva / Evaluator Demo */}
              {activeTab === 'demo' && (
                <div className="p-4 bg-gradient-to-br from-amber-50 to-indigo-50 border border-amber-200/70 rounded-2xl space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">
                        Academic Viva & Evaluator Simulator
                      </h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">
                        This one-click button simulates a successful payment response from Sahrdaya Banking Partner with a valid transaction ID (`SHR-PAY-XXXXXX`) so external evaluators can verify the entire ticket confirmation flow seamlessly without real currency transactions.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-gray-200/80 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Student Account:</span>
                      <span className="font-bold text-gray-800">{user?.email || 'alen225001@sahrdaya.ac.in'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Simulation Target:</span>
                      <span className="font-bold text-emerald-600">Immediate Ticket Confirmation</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDemoInstantPay}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black text-sm rounded-2xl transition shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Authorize & Confirm Ticket Instantly (₹{price})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer Trust Bar */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                RBI & SCET Compliant
              </span>
              <span>Need help? events@sahrdaya.ac.in</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
