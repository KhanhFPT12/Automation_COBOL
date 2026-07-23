import { User, Mail, Shield, Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';

export function Profile() {
  const { session, setActivePage } = useAppStore();
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12'>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>
        <button onClick={() => setActivePage('home')} className='text-slate-400 hover:text-slate-700 transition mb-6 flex items-center gap-1.5 cursor-pointer'><ArrowLeft className='h-4 w-4' /> Back</button>
        <div className='flex items-center gap-3 mb-6'>
          <div className='h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center'><User className='h-6 w-6 text-sky-600' /></div>
          <div><h2 className='text-xl font-extrabold text-slate-900'>{session.name}</h2><p className='text-xs text-slate-500'>{session.email}</p></div>
        </div>
        <div className='space-y-3 pt-4 border-t border-slate-100'>
          {session.name && <div className='flex items-center gap-3 py-1.5'><User className='h-4 w-4 text-slate-400' /><div><p className='text-[10px] text-slate-400 font-bold uppercase'>Name</p><p className='text-sm text-slate-700'>{session.name}</p></div></div>}
          <div className='flex items-center gap-3 py-1.5'><Mail className='h-4 w-4 text-slate-400' /><div><p className='text-[10px] text-slate-400 font-bold uppercase'>Email</p><p className='text-sm text-slate-700'>{session.email}</p></div></div>
          <div className='flex items-center gap-3 py-1.5'><Shield className='h-4 w-4 text-slate-400' /><div><p className='text-[10px] text-slate-400 font-bold uppercase'>Role</p><p className='text-sm text-slate-700'>{session.role}</p></div></div>
          <div className='flex items-center gap-3 py-1.5'><Calendar className='h-4 w-4 text-slate-400' /><div><p className='text-[10px] text-slate-400 font-bold uppercase'>Account</p><p className='text-sm text-slate-700'>{session.accountType}</p></div></div>
        </div>
      </motion.div>
    </div>
  );
}
