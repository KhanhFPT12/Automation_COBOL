import { useState } from 'react';
import { Key, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';
import { authApi } from '../../services/authApi';

export function ChangePassword() {
  const { setActivePage } = useAppStore();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPass !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await authApi.changePassword(current, newPass);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Password Changed!</h2>
        <p className="text-sm text-slate-500 mb-6">Your password has been updated successfully.</p>
        <button onClick={() => setActivePage('home')} className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 text-sm font-semibold rounded-xl transition cursor-pointer">Back to Home</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <button onClick={() => setActivePage('home')} className="text-slate-400 hover:text-slate-700 transition mb-6 flex items-center gap-1.5 cursor-pointer"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="flex items-center gap-3 mb-6"><Key className="h-5 w-5 text-sky-600" /><h2 className="text-xl font-extrabold text-slate-900">Change Password</h2></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Current Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} required className="w-full px-3 py-2.5 pr-10 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">New Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} required className="w-full px-3 py-2.5 pr-10 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Confirm New Password</label>
            <input type={show ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required className="w-full px-3 py-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500" />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-60 cursor-pointer text-sm">{loading ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Key className="h-4 w-4" />}{loading ? 'Changing...' : 'Update Password'}</button>
        </form>
      </motion.div>
    </div>
  );
}
