import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../../services/authApi';

export function ResetPassword() {
  const token = window.location.pathname.split('/reset-password/')[1] || '';
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (newPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPass !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try { await authApi.resetPassword(token, newPass); setSuccess(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to reset password. Link may have expired.'); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12'>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center'>
        <CheckCircle2 className='h-12 w-12 text-emerald-500 mx-auto mb-4' />
        <h2 className='text-xl font-extrabold text-slate-900 mb-2'>Password Reset!</h2>
        <p className='text-sm text-slate-500 mb-6'>Your password has been reset. You can now sign in.</p>
        <a href='/' className='bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 text-sm font-semibold rounded-xl transition inline-block cursor-pointer'>Go to Sign In</a>
      </motion.div>
    </div>
  );

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12'>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>
        <a href='/' className='text-slate-400 hover:text-slate-700 transition mb-6 flex items-center gap-1.5 cursor-pointer'><ArrowLeft className='h-4 w-4' /> Back to Sign In</a>
        <div className='flex items-center gap-3 mb-6'><Lock className='h-5 w-5 text-sky-600' /><h2 className='text-xl font-extrabold text-slate-900'>Set New Password</h2></div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div><label className='block text-[10px] font-bold text-slate-400 uppercase mb-1.5'>New Password</label><div className='relative'><input type={show ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} required className='w-full px-3 py-2.5 pr-10 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500' /><button type='button' onClick={() => setShow(!show)} className='absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer'>{show ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}</button></div></div>
          <div><label className='block text-[10px] font-bold text-slate-400 uppercase mb-1.5'>Confirm Password</label><input type={show ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required className='w-full px-3 py-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500' /></div>
          {error && <p className='text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2'>{error}</p>}
          <button type='submit' disabled={loading} className='w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-60 cursor-pointer text-sm'>{loading ? <span className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin' /> : <Lock className='h-4 w-4' />}{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      </motion.div>
    </div>
  );
}