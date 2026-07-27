import { useAppStore } from '../store';
import type { ActivePage } from '../types';

export function Footer() {
  const { setActivePage } = useAppStore();

  const navTo = (target: ActivePage) => {
    setActivePage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className='w-full bg-slate-900 border-t border-slate-800 pt-12 pb-6 mt-auto' id='app-footer'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10'>
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <div className='h-8 w-8 rounded-lg bg-sky-600 flex items-center justify-center'>
                <span className='text-white font-extrabold text-sm'>A</span>
              </div>
              <span className='text-lg font-extrabold text-white'>ALSM <span className='text-sky-400'>AI</span></span>
            </div>
            <p className='text-xs text-slate-400 leading-relaxed'>Automating Legacy System Modernization. AI-powered code conversion for COBOL, RPG, Assembly.</p>
          </div>
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-300 mb-4'>Product</h4>
            <div className='flex flex-col gap-2'>
              <button onClick={() => navTo('converter')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>Converter</button>
              <button onClick={() => navTo('pricing')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>Pricing</button>
              <button onClick={() => navTo('data-mapping')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>Data Mapping</button>
              <button onClick={() => navTo('auth-guide')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>Auth Guide</button>
            </div>
          </div>
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-300 mb-4'>Company</h4>
            <div className='flex flex-col gap-2'>
              <button onClick={() => navTo('data-mapping')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>About Us</button>
              <button onClick={() => navTo('converter')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>Careers</button>
              <button onClick={() => navTo('data-mapping')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>Privacy Policy</button>
            </div>
          </div>
          <div>
            <h4 className='text-xs font-bold uppercase tracking-wider text-slate-300 mb-4'>Support</h4>
            <div className='flex flex-col gap-2'>
              <button onClick={() => navTo('auth-guide')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>Documentation</button>
              <button onClick={() => navTo('converter')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>API Reference</button>
              <button onClick={() => navTo('data-mapping')} className='text-xs text-slate-400 hover:text-sky-400 transition text-left cursor-pointer'>Contact Us</button>
            </div>
          </div>
        </div>

        <div className='border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-slate-500'>© 2026 ALSM. All rights reserved.</p>
          <div className='flex items-center gap-4 text-xs text-slate-500'>
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
