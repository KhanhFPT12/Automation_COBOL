import React, { useState } from "react";
import { useAppStore } from "../../store";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, LogIn, ArrowLeft, Send, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "../../services/authApi";

type ForgotStatus = 'idle' | 'loading' | 'sent' | 'error';

export function SignIn() {
  const { loginUser, loginWithGoogle, isAuthLoading, authError, clearAuthError, setActivePage, setAuthError } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGoogleSuccess = (credential: string | undefined) => { if (credential) loginWithGoogle(credential); };

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
                        className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
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

              <div className="space-y-3 mb-6">
                <div className="group relative h-[42px] w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 transition hover:bg-slate-50">
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.32 2.98-7.41Z" />
                      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.62A10 10 0 0 0 12 22Z" />
                      <path fill="#FBBC05" d="M6.4 13.88A6.02 6.02 0 0 1 6.08 12c0-.65.11-1.29.32-1.88V7.5H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.5l3.34-2.62Z" />
                      <path fill="#EA4335" d="M12 5.99c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.94 5.5l3.34 2.62C7.19 7.75 9.4 5.99 12 5.99Z" />
                    </svg>
                    Sign in with Google
                  </div>
                  <div className="absolute inset-0 z-10 opacity-[0.01] [&>div]:h-full [&>div]:w-full [&_iframe]:!h-full [&_iframe]:!w-full">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => handleGoogleSuccess(credentialResponse.credential)}
                      onError={() => setAuthError('Google sign-in failed or was cancelled. Please try again.')}
                      theme="outline"
                      size="large"
                      shape="rectangular"
                      text="signin_with"
                      width="400"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { window.location.href = '/api/auth/github'; }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  Sign in with GitHub
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-500">or continue with email</span></div>
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      required
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer" tabIndex={-1}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
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
