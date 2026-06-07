import React from "react";
import { useAppStore } from "../../store";
import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Lock, Sparkles, Building2, UserCheck } from "lucide-react";

export function CreateAccount() {
  const { login, setActivePage } = useAppStore();
  const [activeTab, setActiveTab] = useState<'individual' | 'enterprise'>('individual');
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert("Please configure the Full Name and corporate Email Address credentials.");
      return;
    }
    login(email, fullName);
    alert(`Account allocated successfully! Your ${activeTab} modernization tokens are ready.`);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 font-sans" id="create-account-page">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8"
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
            onClick={() => setActiveTab('individual')}
            className={`cursor-pointer flex-1 py-2 text-center text-xs font-bold leading-none rounded-lg transition ${activeTab === 'individual' ? 'bg-white text-sky-600 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:text-slate-900'}`}
          >
            INDIVIDUAL
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('enterprise')}
            className={`cursor-pointer flex-1 py-2 text-center text-xs font-bold leading-none rounded-lg transition ${activeTab === 'enterprise' ? 'bg-white text-sky-600 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ENTERPRISE
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-xs text-slate-500 font-sans" id="info-tier-banner">
          {activeTab === 'individual' ? (
            <>
              <Sparkles className="h-4.5 w-4.5 text-amber-500 shrink-0" />
              <span>Includes 50,000 free token conversions per month.</span>
            </>
          ) : (
            <>
              <Building2 className="h-4.5 w-4.5 text-sky-600 shrink-0" />
              <span>Enables mTLS, LDAP SSO integration and dedicated SLA.</span>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-2">
              FULL NAME
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                id="register-name-input"
                type="text" 
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-2">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                id="register-email-input"
                type="email" 
                placeholder="j.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                id="register-password-input"
                type="password" 
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
              />
            </div>
          </div>

          <button 
            id="btn-register-submit"
            type="submit"
            className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 shadow-sm shadow-sky-600/10 active:scale-95"
          >
            <UserCheck className="h-4 w-4" />
            Create Account
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