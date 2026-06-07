import React from "react";
import { useAppStore } from "../../store";
import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, LogIn } from "lucide-react";
import { FaChrome, FaGithub } from "react-icons/fa";

export function SignIn() {
  const { login, setActivePage } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please provide a valid company email address.");
      return;
    }
    const extractedName = email.split('@')[0];
    const uppercaseName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
    login(email, uppercaseName);
    alert(`Welcome back, ${uppercaseName}! Accessing your modernization dashboard...`);
  };

  const handleOAuth = (provider: string) => {
    login(`member@${provider.toLowerCase()}.com`, `${provider} Developer`);
    alert(`Synced securely via ${provider} OAuth federation gateway.`);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 font-sans" id="signin-page">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8"
        id="signin-card"
      >
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-sans">
            Access your modernization dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-2">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                id="login-email-input"
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">
                PASSWORD
              </label>
              <button 
                type="button"
                onClick={() => alert("Password reset link dispatched via systems SMTP server.")}
                className="text-[10px] font-bold text-sky-600 hover:text-sky-700 font-sans hover:underline"
              >
                Forgot password?
              </button>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                id="login-password-input"
                type="password" 
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input 
              id="login-custom-checkbox"
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
            />
            <label htmlFor="login-custom-checkbox" className="ml-2 text-xs font-semibold text-slate-600 select-all cursor-pointer">
              Remember this device for 30 days
            </label>
          </div>

          <button 
            id="btn-login-submit"
            type="submit"
            className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 shadow-sm shadow-sky-600/10 active:scale-95"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>

        </form>

        <div className="relative my-8 text-center" id="divider-oauth">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-150" />
          </div>
          <span className="relative font-bold text-[9px] tracking-wider uppercase font-mono px-3 text-slate-400 bg-white">
            OR CONTINUE WITH
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => handleOAuth("Google")}
            className="cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition py-2 text-xs font-bold text-slate-700"
          >
            <FaChrome className="h-4 w-4 text-rose-500" />
            Google
          </button>
          
          <button 
            type="button"
            onClick={() => handleOAuth("GitHub")}
            className="cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition py-2 text-xs font-bold text-slate-700"
          >
            <FaGithub className="h-4 w-4 text-slate-900" />
            GitHub
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            Don't have an account?{" "}
            <button 
              id="link-go-register"
              onClick={() => setActivePage('register')}
              className="font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
            >
              Request Access
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
}