import { useAppStore } from "../store";
import type { ActivePage } from "../types";

export function Footer() {
  const { setActivePage } = useAppStore();

  const navTo = (target: ActivePage) => {
    setActivePage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 mt-auto" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <img
              src="/images/alsm-logo.png"
              alt="ALSM"
              className="h-7 w-auto object-contain"
              style={{ mixBlendMode: 'multiply' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <p className="text-sm font-semibold text-slate-800">
              ALSM <span className="text-sky-600">AI</span>
            </p>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 ALSM. Automating Legacy System Modernization.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
          <button
            onClick={() => navTo('pricing')}
            className="hover:text-sky-600 transition cursor-pointer"
            id="footer-pricing"
          >
            Pricing
          </button>
          <button 
            onClick={() => navTo('data-mapping')}
            className="hover:text-sky-600 transition cursor-pointer"
            id="footer-about"
          >
            About us
          </button>
          <button 
            onClick={() => navTo('converter')}
            className="hover:text-sky-600 transition cursor-pointer"
            id="footer-careers"
          >
            Careers
          </button>
          <button 
            onClick={() => navTo('auth-guide')}
            className="hover:text-sky-600 transition cursor-pointer"
            id="footer-support"
          >
            Support
          </button>
          <button 
            onClick={() => navTo('data-mapping')}
            className="hover:text-sky-600 transition cursor-pointer"
            id="footer-privacy"
          >
            Privacy Policy
          </button>
        </div>

      </div>
    </footer>
  );
}
