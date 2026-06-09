import React, { useState } from "react";
import { useAppStore } from "../../store";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, LogIn, ArrowLeft, Send } from "lucide-react";
import { authApi } from "../../services/authApi";

type ForgotStatus = 'idle' | 'loading' | 'sent' | 'error';

export function SignIn() {
  const { loginUser, isAuthLoading, authError, clearAuthError, setActivePage } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotMode, setForgotMode] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpStatus, setFpStatus] = useState<ForgotStatus>('idle');
  const [fpMessage, setFpMessage] = useState("");

  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  const isUnverifiedError = authError?.toLowerCase().includes('verif');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(email, password);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpStatus('loading');
    try {
      await authApi.forgotPassword(fpEmail);
      setFpStatus('sent');
      setFpMessage("If an account exists with this email, you'll receive a reset link shortly.");
    } catch (err) {
      setFpStatus('error');
      setFpMessage(err instanceof Error ? err.message : 'Request failed. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    setResendStatus('loading');
    try {
      await authApi.resendVerification(email);
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (authError) clearAuthError();
    setResendStatus('idle');
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (authError) clearAuthError();
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
        <AnimatePresence mode="wait">
          {forgotMode ? (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setFpStatus('idle'); setFpEmail(''); setFpMessage(''); }}
                  className="text-slate-400 hover:text-slate-700 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="font-display text-xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
              </div>

              {fpStatus === 'sent' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-6 text-center">
                  <Send className="h-9 w-9 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-bold text-emerald-800 mb-1">Email Sent</p>
                  <p className="text-xs text-emerald-600">{fpMessage}</p>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(false); setFpStatus('idle'); setFpEmail(''); }}
                    className="mt-5 text-xs font-bold text-sky-600 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <p className="text-xs text-slate-500">Enter your email address and we'll send you a password reset link.</p>
                  <div>
                    <label className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-2">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={fpEmail}
                        onChange={(e) => setFpEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                      />
                    </div>
                  </div>
                  {fpStatus === 'error' && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {fpMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={fpStatus === 'loading'}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                  >
                    {fpStatus === 'loading' ? (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Send Reset Link
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 font-sans">
                  Access your modernization dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      onChange={(e) => handleEmailChange(e.target.value)}
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
                      onClick={() => { setForgotMode(true); setFpEmail(email); clearAuthError(); }}
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
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-red-700">{authError}</p>
                    {isUnverifiedError && (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendStatus !== 'idle'}
                        className="mt-2 text-xs font-bold text-sky-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendStatus === 'loading'
                          ? 'Sending...'
                          : resendStatus === 'sent'
                          ? 'Verification email sent!'
                          : 'Resend verification email'}
                      </button>
                    )}
                  </div>
                )}

                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isAuthLoading}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 shadow-sm shadow-sky-600/10 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                >
                  {isAuthLoading ? (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  {isAuthLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

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
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
