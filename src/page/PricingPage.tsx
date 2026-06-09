import { useAppStore } from "../store";
import { CheckCircle2, Building2, Users, ShieldCheck, Zap, ChevronDown, MessageSquare } from "lucide-react";

export function PricingPage() {
  const { setActivePage } = useAppStore();

  return (
    <div className="flex-1 w-full bg-[#f8fafc] text-slate-900 pb-20">
      {/* Header Section */}
      <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wider mb-6">
          PRICING & PLANS
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
          Enterprise modernization,<br/>sized for your team.
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Scale your legacy transformation with AI-powered insights and professional-grade security. Choose the plan that fits your modernization roadmap.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 items-start mb-24">
        
        {/* Starter Plan */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Starter (Trial)</h3>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-6">Foundations for small teams</p>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-bold text-slate-900">0đ</span>
            <span className="text-slate-500 font-medium">/ 14 ngày</span>
          </div>
          <ul className="space-y-4 mb-8">
            {['5 Active projects', '500 Screens per month', '10GB Cloud storage', 'Automated checks', 'Basic support'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
                {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setActivePage('home')}
            className="w-full py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Bắt đầu dùng thử <span className="ml-1">→</span>
          </button>
        </div>

        {/* Professional Plan */}
        <div className="relative bg-gradient-to-b from-[#8ba3c7] to-[#99b2d8] rounded-2xl p-8 shadow-xl transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="bg-slate-600 text-white text-xs font-bold py-1 px-4 rounded-full shadow-sm">
              MOST POPULAR
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Professional</h3>
          <p className="text-xs font-semibold text-slate-700 tracking-wider uppercase mb-6">The standard for scaling</p>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-bold text-slate-900">2.490.000đ</span>
            <span className="text-slate-700 font-medium">/tháng</span>
          </div>
          <ul className="space-y-4 mb-8">
            {[
              '20 Active projects', 
              '5,000 Screens per month', 
              '50GB Cloud storage', 
              'Advanced AI models', 
              'Priority support',
              'Team collaboration'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-800 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-slate-600" />
                {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setActivePage('payment')}
            className="w-full py-3 px-4 rounded-lg bg-[#0a192f] text-white font-semibold hover:bg-[#112240] transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            Đăng ký gói <span className="ml-1">→</span>
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Enterprise</h3>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-6">Mission-critical systems</p>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-bold text-slate-900">Tùy chỉnh</span>
          </div>
          <ul className="space-y-4 mb-8">
            {[
              'Unlimited projects', 
              'Unlimited screens', 
              'Dedicated support', 
              'Custom integrations', 
              'Enterprise-grade security',
              'Custom SLA agreements'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
                {feature}
              </li>
            ))}
          </ul>
          <button 
            className="w-full py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Liên hệ Sales <MessageSquare className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>

      {/* Why upgrade section */}
      <div className="max-w-5xl mx-auto px-4 mb-24">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Why upgrade to Professional?</h2>
        <p className="text-slate-600 mb-10 max-w-3xl">
          Modernization is complex. Our professional tier provides the precision tools required for enterprise-scale deployments.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm col-span-1">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Advanced AI Orchestration</h3>
            <p className="text-slate-600 text-sm mb-6">
              Access our proprietary Large Language Models specifically tuned for COBOL to Java conversion and legacy UI mapping. Reduce hallucination rates by 40% compared to generic models.
            </p>
            <div className="rounded-lg overflow-hidden bg-slate-900 aspect-video relative flex items-center justify-center">
              {/* Decorative abstract node network */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-cyan-900 opacity-50"></div>
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
              <div className="text-cyan-400 opacity-80 font-mono text-xs z-10 text-center">
                [ AI Orchestration active ]<br/>
                Analyzing monolith structure...
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm col-span-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Unified Collaboration</h3>
              <p className="text-slate-600 text-sm mb-4">
                Real time code reviews and shared modernization dashboards for teams up to 20 users.
              </p>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600">
                    U{i}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                  +12
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">SOC2 Type II</h3>
              <p className="text-slate-500 text-xs">
                Enterprise-grade compliance across all transformation projects.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Priority Queue</h3>
              <p className="text-slate-500 text-xs">
                Guaranteed sub-2hr response times for critical tickets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 mb-24">
        <h2 className="text-center font-medium text-slate-800 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {['Can I switch plans later?', 'What counts as a \'Screen\'?', 'Do you offer discounts for non-profits?'].map((q, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="font-medium text-slate-800">{q}</span>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[#0a192f] rounded-2xl p-12 text-center text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Ready to modernize?</h2>
            <p className="text-blue-200 mb-8 max-w-md mx-auto">
              Join the leading enterprises accelerating their digital transformation with ALSM AI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setActivePage('payment')}
                className="py-3 px-6 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Start Free Trial
              </button>
              <button className="py-3 px-6 rounded-lg border border-slate-600 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
