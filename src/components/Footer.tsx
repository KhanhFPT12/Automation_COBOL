import React from "react";
import { useAppStore } from "../store";
import type { ActivePage } from "../types";

export function Footer() {
  const { setActivePage } = useAppStore();

  const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement>, target: ActivePage) => {
    e.preventDefault();
    setActivePage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 mt-auto" id="app-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
          <p className="text-sm font-semibold text-slate-800">
            LegacyModern <span className="text-sky-600">AI</span>
          </p>
          <p className="text-xs text-slate-500">
            © 2026 LegacyModern AI. Engineering the future from legacy.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
          <button 
            onClick={(e) => handleLinkClick(e, 'data-mapping')}
            className="hover:text-sky-600 transition cursor-pointer"
            id="footer-about"
          >
            About us
          </button>
          <button 
            onClick={(e) => handleLinkClick(e, 'converter')}
            className="hover:text-sky-600 transition cursor-pointer"
            id="footer-careers"
          >
            Careers
          </button>
          <button 
            onClick={(e) => handleLinkClick(e, 'auth-guide')}
            className="hover:text-sky-600 transition cursor-pointer"
            id="footer-support"
          >
            Support
          </button>
          <button 
            onClick={(e) => handleLinkClick(e, 'data-mapping')}
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