import { useAppStore } from "../store";
import { Calendar, Menu, X, User, LogOut, ShieldCheck, ChevronDown, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationBell } from "./NotificationBell";

export function Header() {
  const { activePage, setActivePage, session, logout, fetchNotifications } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!session.isLoggedIn) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoggedIn]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="h-0.5 w-full bg-linear-to-r from-sky-500 via-blue-600 to-sky-400" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div
          onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
          className="flex cursor-pointer items-center gap-2"
          id="logo-container"
        >
          <img
            src="/images/alsm-logo.png"
            alt="ALSM - Automating Legacy System Modernization"
            className="h-10 w-auto object-contain"
            style={{ mixBlendMode: 'multiply' }}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <span
            className="font-display text-xl font-bold tracking-tight text-slate-800 hidden items-center gap-1"
            id="logo-fallback"
          >
            ALSM <span className="text-sky-600 text-sm font-semibold">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            id="nav-home"
            onClick={() => setActivePage('home')}
            className={`cursor-pointer transition-colors hover:text-sky-600 py-1.5 px-0.5 relative ${activePage === 'home' ? 'text-sky-600 border-b-2 border-sky-600 font-semibold' : ''}`}
          >
            Products
          </button>
          <button
            id="nav-converter"
            onClick={() => setActivePage('converter')}
            className={`cursor-pointer transition-colors hover:text-sky-600 py-1.5 px-0.5 relative ${activePage === 'converter' || activePage === 'product-experience' ? 'text-sky-600 border-b-2 border-sky-600 font-semibold' : ''}`}
          >
            Solutions
          </button>
          <button
            id="nav-docs"
            onClick={() => setActivePage('data-mapping')}
            className={`cursor-pointer transition-colors hover:text-sky-600 py-1.5 px-0.5 relative ${activePage === 'data-mapping' || activePage === 'auth-guide' ? 'text-sky-600 border-b-2 border-sky-600 font-semibold' : ''}`}
          >
            Documentation
          </button>
          {session.isLoggedIn && (
            <button
              id="nav-my-meetings"
              onClick={() => setActivePage('my-meetings')}
              className={`cursor-pointer transition-colors hover:text-sky-600 py-1.5 px-0.5 relative ${activePage === 'my-meetings' || activePage === 'book-meeting' ? 'text-sky-600 border-b-2 border-sky-600 font-semibold' : ''}`}
            >
              My Meetings
            </button>
          )}
          {session.role === 'ADMIN' && (
            <button
              id="nav-admin"
              onClick={() => setActivePage('admin-dashboard')}
              className={`cursor-pointer flex items-center gap-1.5 transition-colors hover:text-sky-600 py-1.5 px-0.5 relative ${activePage.startsWith('admin-') ? 'text-sky-600 border-b-2 border-sky-600 font-semibold' : ''}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </button>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session.isLoggedIn ? (
            <div className="flex items-center gap-3" id="header-user-badge">
              <button
                id="btn-book-meeting-loggedin"
                onClick={() => setActivePage('book-meeting')}
                className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 shadow-sm shadow-sky-600/10"
              >
                <Calendar className="h-3.5 w-3.5" />
                Book a meeting
              </button>
              <NotificationBell />
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 transition cursor-pointer" id="btn-user-menu">
                  <User className="h-3.5 w-3.5 text-sky-600" />
                  {session.name}
                  <ChevronDown className={"h-3.5 w-3.5 transition " + (dropdownOpen ? "rotate-180" : "")} />
                </button>
                {dropdownOpen && <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{session.name}</p>
                      <p className="text-xs text-slate-500">{session.email}</p>
                      {session.role === "ADMIN" && <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full mt-1 inline-block">ADMIN</span>}
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setDropdownOpen(false); setActivePage("profile"); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"><User className="h-4 w-4" /> View Profile</button>
                      <div className="border-t border-slate-100"></div>
                      <button onClick={() => { setDropdownOpen(false); setActivePage("change-password"); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"><Key className="h-4 w-4" /> Change Password</button>
                      <button onClick={() => { setDropdownOpen(false); logout(); }} className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"><LogOut className="h-4 w-4" /> Sign Out</button>
                    </div>
                  </div>
                </>}
              </div>
            </div>
          ) : (
            <>
              <button 
                id="btn-signin"
                onClick={() => setActivePage('login')}
                className="cursor-pointer text-sm font-semibold text-slate-700 transition hover:text-sky-600 border border-slate-200 hover:border-sky-600/30 px-4 py-2 rounded-lg"
              >
                Sign in
              </button>
              <button 
                id="btn-book-meeting"
                onClick={() => setActivePage('converter')}
                className="cursor-pointer flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 shadow-sm shadow-sky-600/10"
              >
                <Calendar className="h-4 w-4" />
                Book a meeting
              </button>
            </>
          )}
        </div>

        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            id="mobile-menu-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 shadow-inner" id="mobile-drawer">
          <div className="flex flex-col gap-4">
            <button 
              id="mobile-nav-home"
              onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
              className={`text-left text-sm py-2 px-3 rounded-lg hover:bg-slate-50 ${activePage === 'home' ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-600'}`}
            >
              Products / Home
            </button>
            <button
              id="mobile-nav-converter"
              onClick={() => { setActivePage('converter'); setMobileMenuOpen(false); }}
              className={`text-left text-sm py-2 px-3 rounded-lg hover:bg-slate-50 ${activePage === 'converter' || activePage === 'product-experience' ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-600'}`}
            >
              Solutions
            </button>
            <button
              id="mobile-nav-docs"
              onClick={() => { setActivePage('data-mapping'); setMobileMenuOpen(false); }}
              className={`text-left text-sm py-2 px-3 rounded-lg hover:bg-slate-50 ${activePage === 'data-mapping' || activePage === 'auth-guide' ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-600'}`}
            >
              Documentation
            </button>
            {session.isLoggedIn && (
              <button
                id="mobile-nav-my-meetings"
                onClick={() => { setActivePage('my-meetings'); setMobileMenuOpen(false); }}
                className={`text-left text-sm py-2 px-3 rounded-lg hover:bg-slate-50 ${activePage === 'my-meetings' || activePage === 'book-meeting' ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-600'}`}
              >
                My Meetings
              </button>
            )}
            {session.role === 'ADMIN' && (
              <button
                id="mobile-nav-admin"
                onClick={() => { setActivePage('admin-dashboard'); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 text-left text-sm py-2 px-3 rounded-lg hover:bg-slate-50 ${activePage.startsWith('admin-') ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-600'}`}
              >
                <ShieldCheck className="h-4 w-4" /> Admin
              </button>
            )}
            <hr className="border-slate-100" />
            {session.isLoggedIn ? (
              <div className="flex flex-col gap-3 px-3">
                <span className="text-xs text-slate-500 font-mono">Logged in as {session.email}</span>
                <button
                  onClick={() => { setActivePage('book-meeting'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow"
                >
                  <Calendar className="h-4 w-4" /> Book a meeting
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-sm font-semibold text-rose-600 py-1"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setActivePage('login'); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg"
                >
                  Sign in
                </button>
                <button 
                  onClick={() => { setActivePage('converter'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow"
                >
                  <Calendar className="h-4 w-4" /> Book a meeting
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}