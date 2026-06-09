import { useAppStore } from "../store";
import { ChevronLeft, CreditCard, Lock, ShieldCheck, Sparkles, CheckCircle2, Building2, ArrowRight } from "lucide-react";
import { useState } from "react";

export function PaymentPage() {
  const { setActivePage } = useAppStore();
  const [selectedMethod, setSelectedMethod] = useState<'credit' | 'paypal' | 'bank'>('credit');
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return (
      <div className="flex-1 w-full bg-[#f8fafc] text-slate-900 flex items-center justify-center p-4 min-h-[calc(100vh-64px)] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-sky-200/40 to-blue-200/40 blur-3xl rounded-full pointer-events-none"></div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 max-w-lg w-full shadow-2xl shadow-sky-900/10 text-center border border-white relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">Thanh toán thành công!</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Chào mừng bạn đến với <span className="font-semibold text-slate-900">Gói Professional</span>. Hệ thống đã được nâng cấp và sẵn sàng phục vụ.
          </p>
          
          <div className="bg-white rounded-2xl p-6 mb-8 text-left border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 to-blue-600"></div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 text-sm font-medium">Mã giao dịch</span>
              <span className="text-slate-900 font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded">#TXN-9824ALSM</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 text-sm font-medium">Số tiền</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 font-bold text-lg">2.739.000đ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">Phương thức</span>
              <span className="text-slate-700 font-semibold text-sm capitalize flex items-center gap-1.5">
                {selectedMethod === 'credit' && <CreditCard className="w-4 h-4 text-sky-500" />}
                {selectedMethod === 'bank' && <Building2 className="w-4 h-4 text-sky-500" />}
                {selectedMethod === 'paypal' && <span className="font-bold text-blue-600 text-sm">P</span>}
                {selectedMethod === 'credit' ? 'Visa •••• 4242' : selectedMethod}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setActivePage('home')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-lg hover:from-slate-800 hover:to-slate-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            Về trang chủ <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#f8fafc] text-slate-900 pb-24 relative selection:bg-sky-200">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none"></div>

      {/* Top Navigation */}
      <div className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-slate-800">
              ALSM
            </span>
            <span className="bg-gradient-to-r from-sky-600 to-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">
              ENTERPRISE
            </span>
          </div>
          <button 
            onClick={() => setActivePage('pricing')}
            className="group flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Trở lại Bảng giá
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 grid lg:grid-cols-[1.2fr_1fr] gap-12 relative z-10">
        
        {/* Left Column: Form */}
        <div className="animate-in slide-in-from-left-4 fade-in duration-700">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3 tracking-tight">Thanh toán an toàn</h1>
          <p className="text-slate-500 mb-10 text-lg">
            Chọn phương thức thanh toán để nâng cấp lên Gói Professional.
          </p>

          <form className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative" onSubmit={(e) => e.preventDefault()}>
            
            {/* Payment Method Selector */}
            <div className="mb-10">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">
                <span className="w-6 h-px bg-slate-200"></span>
                Phương thức thanh toán
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedMethod('credit')}
                  className={`relative py-5 rounded-2xl flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'credit' 
                    ? 'ring-2 ring-sky-500 bg-sky-50/50 text-sky-700 shadow-md scale-[1.02]' 
                    : 'ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50 text-slate-500 hover:scale-[1.01]'
                  }`}
                >
                  {selectedMethod === 'credit' && (
                    <div className="absolute top-2 right-2 bg-sky-500 rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <CreditCard className={`w-7 h-7 ${selectedMethod === 'credit' ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-semibold">Thẻ Tín dụng</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setSelectedMethod('paypal')}
                  className={`relative py-5 rounded-2xl flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'paypal' 
                    ? 'ring-2 ring-sky-500 bg-sky-50/50 text-sky-700 shadow-md scale-[1.02]' 
                    : 'ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50 text-slate-500 hover:scale-[1.01]'
                  }`}
                >
                  {selectedMethod === 'paypal' && (
                    <div className="absolute top-2 right-2 bg-sky-500 rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <span className={`font-black text-2xl leading-none ${selectedMethod === 'paypal' ? 'text-[#00457C]' : 'text-slate-400'}`}>P</span>
                  <span className="text-sm font-semibold">PayPal</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setSelectedMethod('bank')}
                  className={`relative py-5 rounded-2xl flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 ${
                    selectedMethod === 'bank' 
                    ? 'ring-2 ring-sky-500 bg-sky-50/50 text-sky-700 shadow-md scale-[1.02]' 
                    : 'ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50 text-slate-500 hover:scale-[1.01]'
                  }`}
                >
                  {selectedMethod === 'bank' && (
                    <div className="absolute top-2 right-2 bg-sky-500 rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Building2 className={`w-7 h-7 ${selectedMethod === 'bank' ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-semibold">Chuyển khoản</span>
                </button>
              </div>
            </div>

            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 fill-mode-both">
              {selectedMethod === 'credit' && (
                <div className="mb-10">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">
                    <span className="w-6 h-px bg-slate-200"></span>
                    Thông tin thẻ
                  </label>
                  <div className="space-y-4">
                    <div className="relative group">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Số thẻ"
                        defaultValue="4242 4242 4242 4242" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white font-mono text-slate-900 transition-all shadow-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors font-medium">MM</span>
                        <input 
                          type="text" 
                          placeholder="MM / YY" 
                          defaultValue="12 / 26"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white font-mono text-slate-900 transition-all shadow-sm"
                        />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                        <input 
                          type="password" 
                          placeholder="CVC"
                          defaultValue="***" 
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white font-mono text-slate-900 transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'bank' && (
                <div className="mb-10 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-6 shadow-inner">
                  <p className="text-sm text-sky-900 font-semibold mb-3">Vui lòng chuyển khoản với nội dung thanh toán:</p>
                  <div className="bg-white p-4 rounded-xl border border-sky-200 mb-3 shadow-sm flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-900 font-mono tracking-widest">ALSM PRO JONATHAN</span>
                    <button className="text-sky-600 hover:text-sky-700 text-xs font-bold uppercase tracking-wider bg-sky-50 py-1.5 px-3 rounded-lg cursor-pointer">Copy</button>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hệ thống tự động đối soát trong vòng 5 phút.
                  </p>
                </div>
              )}

              {selectedMethod === 'paypal' && (
                <div className="mb-10 bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-[#00457C] font-black text-3xl">P</div>
                  <p className="text-slate-600 font-medium">Bạn sẽ được chuyển hướng tới PayPal để hoàn tất thanh toán an toàn.</p>
                </div>
              )}

              {/* Billing Address */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">
                  <span className="w-6 h-px bg-slate-200"></span>
                  Thông tin thanh toán
                </label>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Họ và Tên" 
                    defaultValue="Nguyễn Văn A"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white text-slate-900 transition-all font-medium shadow-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Địa chỉ" 
                    defaultValue="128 Tech Plaza, Khu Công Nghệ Cao"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white text-slate-900 transition-all font-medium shadow-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Thành phố" 
                      defaultValue="TP. Hồ Chí Minh"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white text-slate-900 transition-all font-medium shadow-sm"
                    />
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 focus:bg-white text-slate-900 transition-all font-medium appearance-none shadow-sm cursor-pointer"
                      >
                        <option>Việt Nam</option>
                        <option>United States</option>
                      </select>
                      <ChevronLeft className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* TOS Agreement */}
              <div className="flex items-start gap-3 mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <input 
                  type="checkbox" 
                  id="tos" 
                  defaultChecked
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                />
                <label htmlFor="tos" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                  Tôi đồng ý với <a href="#" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline">Điều khoản Dịch vụ</a> và <a href="#" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline">Chính sách Bảo mật</a> của ALSM.
                </label>
              </div>
            </div>
          </form>

          {/* Footer Trust Badges */}
          <div className="flex items-center gap-8 mt-8 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-300" /> Mã hóa SSL 256-bit
            </span>
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-300" /> Thanh toán an toàn
            </span>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="animate-in slide-in-from-right-4 fade-in duration-700 delay-100 fill-mode-both lg:sticky lg:top-24 h-max">
          <div className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] rounded-3xl p-8 lg:p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/30 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-2xl font-display font-bold text-white mb-8 relative z-10 flex items-center gap-3">
              Tóm tắt đơn hàng
            </h2>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-lg text-white">Gói Professional</p>
                  <p className="text-sm text-slate-400">Thanh toán theo tháng</p>
                </div>
                <span className="font-medium text-white text-lg">2.490.000đ</span>
              </div>

              <div className="border-t border-slate-700/50 pt-6 mb-6 mt-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-400">Tạm tính</span>
                  <span className="text-white font-medium">2.490.000đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Thuế (VAT 10%)</span>
                  <span className="text-white font-medium">249.000đ</span>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-6 mb-10">
                <p className="text-xs font-bold text-sky-400 tracking-widest uppercase mb-2">TỔNG CỘNG</p>
                <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">2.739.000đ</div>
              </div>

              <button 
                onClick={() => setIsSuccess(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg hover:from-sky-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mb-6 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl"></div>
                <span className="relative z-10 flex items-center gap-2">Thanh toán ngay <ArrowRight className="w-5 h-5" /></span>
              </button>
              
              <p className="text-xs text-slate-400 text-center flex items-start gap-1.5 justify-center px-4 leading-relaxed">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                Thanh toán được mã hóa an toàn. Bạn có thể hủy gói bất kỳ lúc nào.
              </p>
            </div>
          </div>

          {/* Unlocking with Pro box */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 mt-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full pointer-events-none -z-0"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-gradient-to-br from-sky-100 to-blue-50 p-2.5 rounded-xl shadow-inner border border-white">
                <Sparkles className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Quyền lợi đặc biệt</h3>
                <p className="font-bold text-slate-900">Mở khóa với bản PRO</p>
              </div>
            </div>
            
            <ul className="space-y-4 relative z-10">
              {[
                'Không giới hạn dự án chuyển đổi mã',
                'Hàng đợi tính toán ưu tiên cao nhất',
                'Bảo đảm SLA cấp doanh nghiệp 99.9%',
                'Hỗ trợ kỹ thuật trực tiếp 24/7'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <div className="mt-0.5 bg-emerald-100 rounded-full p-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

// Add the Building2 icon to lucide-react imports at the top
