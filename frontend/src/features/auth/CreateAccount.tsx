import React, { useState } from "react";
import { useAppStore } from "../../store";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Briefcase,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { authApi, type RegisterIndividualPayload, type RegisterEnterprisePayload } from "../../services/authApi";

const LEGACY_SYSTEMS = ['COBOL', 'RPG', 'Assembly', 'PL/I', 'Fortran', 'BASIC'];
const TECH_STACKS = ['Java Spring Boot', 'Node.js TypeScript', 'Python FastAPI', 'React', 'Vue.js', 'Angular', 'Kubernetes', 'AWS'];
const COMPANY_SIZES = ['1–50', '51–200', '201–1,000', '1,001–5,000', '5,000+'];
const INDUSTRIES = ['Banking & Finance', 'Insurance', 'Healthcare', 'Government', 'Manufacturing', 'Retail', 'Telecommunications', 'Other'];

const INPUT_CLS = "w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50/80 hover:bg-slate-100/60 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-[#0061FF] focus:ring-4 focus:ring-sky-100 font-sans transition-all";
const LABEL_CLS = "block text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-1.5";
const SELECT_CLS = "w-full px-3 py-2.5 text-xs bg-slate-50/80 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-[#0061FF] focus:ring-4 focus:ring-sky-100 font-sans text-slate-700 transition-all";

export function CreateAccount() {
  const { setActivePage } = useAppStore();
  const [activeTab, setActiveTab] = useState<'individual' | 'enterprise'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Password visibility states
  const [showIndPassword, setShowIndPassword] = useState(false);
  const [showEntPassword, setShowEntPassword] = useState(false);

  // Individual fields
  const [indFullName, setIndFullName] = useState('');
  const [indEmail, setIndEmail] = useState('');
  const [indPhone, setIndPhone] = useState('');
  const [indPassword, setIndPassword] = useState('');

  // Enterprise fields
  const [entCompanyName, setEntCompanyName] = useState('');
  const [entBusinessEmail, setEntBusinessEmail] = useState('');
  const [entPhone, setEntPhone] = useState('');
  const [entPassword, setEntPassword] = useState('');
  const [entRepName, setEntRepName] = useState('');
  const [entRepPosition, setEntRepPosition] = useState('');
  const [entCompanySize, setEntCompanySize] = useState('');
  const [entIndustry, setEntIndustry] = useState('');
  const [entLegacySystems, setEntLegacySystems] = useState<string[]>([]);
  const [entTechStack, setEntTechStack] = useState<string[]>([]);

  const toggleLegacy = (val: string) =>
    setEntLegacySystems(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const toggleTech = (val: string) =>
    setEntTechStack(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const [emailSent, setEmailSent] = useState(true);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      let result: { success: boolean; message: string; emailSent?: boolean };
      if (activeTab === 'individual') {
        const payload: RegisterIndividualPayload = {
          fullName: indFullName,
          email: indEmail,
          phone: indPhone,
          password: indPassword,
        };
        result = await authApi.registerIndividual(payload);
        setRegisteredEmail(indEmail);
      } else {
        const payload: RegisterEnterprisePayload = {
          companyName: entCompanyName,
          businessEmail: entBusinessEmail,
          phone: entPhone,
          password: entPassword,
          representativeName: entRepName,
          representativePosition: entRepPosition,
          companySize: entCompanySize || undefined,
          industry: entIndustry || undefined,
          legacySystemType: entLegacySystems.length ? entLegacySystems : undefined,
          targetTechStack: entTechStack.length ? entTechStack : undefined,
        };
        result = await authApi.registerEnterprise(payload);
        setRegisteredEmail(entBusinessEmail);
      }
      setEmailSent(result.emailSent !== false);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!registeredEmail || isResending) return;
    setIsResending(true);
    try {
      await authApi.resendVerification(registeredEmail);
      setEmailSent(true);
    } catch {
      // silently fail — the user can try again
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          {emailSent ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-4 border border-emerald-100 shadow-sm">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Check Your Email</h2>
              <p className="text-xs text-slate-500 mb-1 font-medium">A verification link has been sent to</p>
              <p className="text-sm font-extrabold text-[#0061FF] mb-5">{registeredEmail}</p>
              <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                Click the link in the email to activate your account. If you don't see it, check your spam or promotions folder.
              </p>
            </>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mx-auto mb-4 border border-amber-100 shadow-sm">
                <Mail className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Account Created</h2>
              <p className="text-xs text-slate-500 mb-5">
                Your account was created successfully, but we couldn't send the verification email to <strong>{registeredEmail}</strong>.
              </p>
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-3 mb-6 text-left">
                <p className="text-xs text-amber-900 font-bold mb-1">⚠️ Verification email not sent</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Please click the button below to resend, or use "Resend Verification" on the Sign In page later.
                </p>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-amber-600 active:scale-95 disabled:opacity-60 mb-3 cursor-pointer shadow-sm"
              >
                {isResending ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </>
          )}
          <button
            onClick={() => setActivePage('login')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0061FF] to-[#2563EB] px-4 py-3 text-xs font-bold text-white transition hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 cursor-pointer"
          >
            Go to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 font-sans" id="create-account-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden"
        id="create-account-card"
      >
        {/* Header Branding Banner */}
        <div className="bg-gradient-to-br from-[#0061FF] via-[#2563EB] to-[#6366F1] px-8 py-8 text-white relative overflow-hidden text-center">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <img
            src="/images/alsm2-logo.png"
            alt="ALSM Logo"
            className="h-12 mx-auto mb-3 object-contain drop-shadow-md"
          />
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Create Your Account
          </h2>
          <p className="text-xs font-medium text-blue-100/90 mt-1 max-w-md mx-auto">
            Start your legacy COBOL modernization journey with AI-precision conversion
          </p>
        </div>

        <div className="p-8">
          {/* Account Type Tabs */}
          <div className="flex bg-slate-100/90 rounded-2xl p-1 mb-6 border border-slate-200/60" id="nav-tabs-register">
            <button
              type="button"
              onClick={() => { setActiveTab('individual'); setError(null); }}
              className={`cursor-pointer flex-1 py-2.5 text-center text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'individual'
                  ? 'bg-gradient-to-r from-[#0061FF] to-[#3B82F6] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>INDIVIDUAL</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('enterprise'); setError(null); }}
              className={`cursor-pointer flex-1 py-2.5 text-center text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'enterprise'
                  ? 'bg-gradient-to-r from-[#0061FF] to-[#3B82F6] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>ENTERPRISE</span>
            </button>
          </div>

          {/* Plan Perks Banner */}
          <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3 text-xs text-sky-900 font-medium" id="info-tier-banner">
            {activeTab === 'individual' ? (
              <>
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0 animate-pulse" />
                <span>Includes <strong>50,000 free token conversions</strong> per month upon sign-up.</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-[#0061FF] shrink-0" />
                <span>Enables <strong>mTLS, LDAP SSO integration</strong> and dedicated SLA support.</span>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === 'individual' ? (
                <motion.div
                  key="individual"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className={LABEL_CLS}>FULL NAME</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="register-name-input"
                        type="text"
                        placeholder="e.g. John Doe"
                        value={indFullName}
                        onChange={e => setIndFullName(e.target.value)}
                        required
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLS}>EMAIL ADDRESS</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="register-email-input"
                        type="email"
                        placeholder="john.doe@company.com"
                        value={indEmail}
                        onChange={e => setIndEmail(e.target.value)}
                        required
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLS}>PHONE NUMBER</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+84 900 000 000"
                        value={indPhone}
                        onChange={e => setIndPhone(e.target.value)}
                        required
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLS}>PASSWORD</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="register-password-input"
                        type={showIndPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={indPassword}
                        onChange={e => setIndPassword(e.target.value)}
                        required
                        minLength={8}
                        className={INPUT_CLS}
                      />
                      <button
                        type="button"
                        onClick={() => setShowIndPassword(!showIndPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition cursor-pointer p-0.5"
                        title={showIndPassword ? "Hide password" : "Show password"}
                      >
                        {showIndPassword ? <EyeOff className="h-4 w-4 text-[#0061FF]" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="enterprise"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className={LABEL_CLS}>COMPANY NAME</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Acme Financial Corporation"
                        value={entCompanyName}
                        onChange={e => setEntCompanyName(e.target.value)}
                        required
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLS}>BUSINESS EMAIL</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="corporate@company.com"
                        value={entBusinessEmail}
                        onChange={e => setEntBusinessEmail(e.target.value)}
                        required
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLS}>PHONE NUMBER</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+84 900 000 000"
                        value={entPhone}
                        onChange={e => setEntPhone(e.target.value)}
                        required
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLS}>PASSWORD</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showEntPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={entPassword}
                        onChange={e => setEntPassword(e.target.value)}
                        required
                        minLength={8}
                        className={INPUT_CLS}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEntPassword(!showEntPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition cursor-pointer p-0.5"
                        title={showEntPassword ? "Hide password" : "Show password"}
                      >
                        {showEntPassword ? <EyeOff className="h-4 w-4 text-[#0061FF]" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLS}>REPRESENTATIVE NAME</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Jane Doe"
                          value={entRepName}
                          onChange={e => setEntRepName(e.target.value)}
                          required
                          className={INPUT_CLS}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>POSITION</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="CTO / Head of IT"
                          value={entRepPosition}
                          onChange={e => setEntRepPosition(e.target.value)}
                          required
                          className={INPUT_CLS}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLS}>COMPANY SIZE</label>
                      <select
                        value={entCompanySize}
                        onChange={e => setEntCompanySize(e.target.value)}
                        className={SELECT_CLS}
                      >
                        <option value="">Select size</option>
                        {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={LABEL_CLS}>INDUSTRY</label>
                      <select
                        value={entIndustry}
                        onChange={e => setEntIndustry(e.target.value)}
                        className={SELECT_CLS}
                      >
                        <option value="">Select industry</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLS}>LEGACY SYSTEMS (select all that apply)</label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {LEGACY_SYSTEMS.map(sys => (
                        <button
                          type="button"
                          key={sys}
                          onClick={() => toggleLegacy(sys)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                            entLegacySystems.includes(sys)
                              ? 'bg-gradient-to-r from-[#0061FF] to-[#2563EB] border-[#0061FF] text-white shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-[#0061FF]/40'
                          }`}
                        >
                          {sys}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLS}>TARGET TECH STACK (select all that apply)</label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {TECH_STACKS.map(tech => (
                        <button
                          type="button"
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                            entTechStack.includes(tech)
                              ? 'bg-gradient-to-r from-[#0061FF] to-[#2563EB] border-[#0061FF] text-white shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-[#0061FF]/40'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <button
              id="btn-register-submit"
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0061FF] via-[#2563EB] to-[#6366F1] px-4 py-3 text-xs font-bold text-white transition hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-98 mt-2"
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserCheck className="h-4 w-4" />
              )}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <button
                id="link-go-login"
                onClick={() => setActivePage('login')}
                className="font-extrabold text-[#0061FF] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
