import React, { useState } from "react";
import { useAppStore } from "../../store";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Mail, Lock, Phone, Building2, Sparkles,
  UserCheck, CheckCircle2, Briefcase,
} from "lucide-react";
import { authApi, type RegisterIndividualPayload, type RegisterEnterprisePayload } from "../../services/authApi";

const LEGACY_SYSTEMS = ['COBOL', 'RPG', 'Assembly', 'PL/I', 'Fortran', 'BASIC'];
const TECH_STACKS = ['Java Spring Boot', 'Node.js TypeScript', 'Python FastAPI', 'React', 'Vue.js', 'Angular', 'Kubernetes', 'AWS'];
const COMPANY_SIZES = ['1–50', '51–200', '201–1,000', '1,001–5,000', '5,000+'];
const INDUSTRIES = ['Banking & Finance', 'Insurance', 'Healthcare', 'Government', 'Manufacturing', 'Retail', 'Telecommunications', 'Other'];

const INPUT_CLS = "w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans";
const LABEL_CLS = "block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-2";
const SELECT_CLS = "w-full px-3 py-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans text-slate-700";

export function CreateAccount() {
  const { setActivePage } = useAppStore();
  const [activeTab, setActiveTab] = useState<'individual' | 'enterprise'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (activeTab === 'individual') {
        const payload: RegisterIndividualPayload = {
          fullName: indFullName,
          email: indEmail,
          phone: indPhone,
          password: indPassword,
        };
        await authApi.registerIndividual(payload);
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
        await authApi.registerEnterprise(payload);
        setRegisteredEmail(entBusinessEmail);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-10 text-center"
        >
          <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-2">Check your email</h2>
          <p className="text-xs text-slate-500 mb-1">A verification link has been sent to</p>
          <p className="text-sm font-bold text-slate-800 mb-5">{registeredEmail}</p>
          <p className="text-xs text-slate-400 mb-8">
            Click the link in the email to activate your account. Check your spam folder if you don't see it.
          </p>
          <button
            onClick={() => setActivePage('login')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 active:scale-95"
          >
            Go to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 font-sans" id="create-account-page">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-8"
        id="create-account-card"
      >
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-sans">
            Start your modernization journey with precision
          </p>
        </div>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-6 border border-slate-200/45" id="nav-tabs-register">
          <button
            type="button"
            onClick={() => { setActiveTab('individual'); setError(null); }}
            className={`cursor-pointer flex-1 py-2 text-center text-xs font-bold leading-none rounded-lg transition ${activeTab === 'individual' ? 'bg-white text-sky-600 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:text-slate-900'}`}
          >
            INDIVIDUAL
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('enterprise'); setError(null); }}
            className={`cursor-pointer flex-1 py-2 text-center text-xs font-bold leading-none rounded-lg transition ${activeTab === 'enterprise' ? 'bg-white text-sky-600 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ENTERPRISE
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-xs text-slate-500 font-sans" id="info-tier-banner">
          {activeTab === 'individual' ? (
            <>
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Includes 50,000 free token conversions per month.</span>
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4 text-sky-600 shrink-0" />
              <span>Enables mTLS, LDAP SSO integration and dedicated SLA.</span>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'individual' ? (
              <motion.div
                key="individual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                      placeholder="John Doe"
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
                      placeholder="j.doe@company.com"
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
                      type="password"
                      placeholder="Min 8 characters"
                      value={indPassword}
                      onChange={e => setIndPassword(e.target.value)}
                      required
                      minLength={8}
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="enterprise"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <label className={LABEL_CLS}>COMPANY NAME</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Acme Corporation"
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
                      placeholder="contact@company.com"
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
                      type="password"
                      placeholder="Min 8 characters"
                      value={entPassword}
                      onChange={e => setEntPassword(e.target.value)}
                      required
                      minLength={8}
                      className={INPUT_CLS}
                    />
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
                        placeholder="CTO"
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
                  <div className="flex flex-wrap gap-2 mt-1">
                    {LEGACY_SYSTEMS.map(sys => (
                      <button
                        type="button"
                        key={sys}
                        onClick={() => toggleLegacy(sys)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${entLegacySystems.includes(sys) ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300'}`}
                      >
                        {sys}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLS}>TARGET TECH STACK (select all that apply)</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {TECH_STACKS.map(tech => (
                      <button
                        type="button"
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${entTechStack.includes(tech) ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300'}`}
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
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <button
            id="btn-register-submit"
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 shadow-sm shadow-sky-600/10 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
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
              className="font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
