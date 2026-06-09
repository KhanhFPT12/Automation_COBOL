import { useAppStore } from "../../store";
import { BookOpen, TableProperties, Layers, GitBranch, Terminal, ExternalLink } from "lucide-react";

export function DocSidebar() {
  const { activePage, setActivePage } = useAppStore();

  const handleSupportClick = () => {
    alert("Enterprise support ticket dispatch opened dynamically. Support response SLA for FPT Enterprise tiers is 30 minutes.");
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8" id="doc-sidebar">
      
      {/* 1. DOCUMENTATION CATEGORY */}
      <div>
        <p className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">
          DOCUMENTATION
        </p>
        <ul className="space-y-1 text-sm">
          <li>
            <button 
              id="sidebar-link-auth"
              onClick={() => setActivePage('auth-guide')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition ${activePage === 'auth-guide' ? 'bg-sky-50 text-sky-600 border border-sky-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <BookOpen className="h-4 w-4" />
              Getting Started
            </button>
          </li>
          <li>
            <button 
              id="sidebar-link-mapping"
              onClick={() => setActivePage('data-mapping')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold transition ${activePage === 'data-mapping' ? 'bg-sky-50 text-sky-600 border border-sky-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <TableProperties className="h-4 w-4" />
              Data Type Mapping
            </button>
          </li>
        </ul>
      </div>

      {/* 2. CORE CONCEPTS CATEGORY */}
      <div>
        <p className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">
          CORE CONCEPTS
        </p>
        <ul className="space-y-1 text-sm">
          <li>
            <button 
              onClick={() => alert("Architecture Overview documentation is loaded. Core VM compiled target is Java SE Virtual Machine compatible.")}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <Layers className="h-4 w-4" />
              Architecture Overview
            </button>
          </li>
          <li>
            <button 
              onClick={() => alert("Modernization flow models map direct procedures sequentially. Download logic map components in workspace settings.")}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <GitBranch className="h-4 w-4" />
              Modernization Flows
            </button>
          </li>
          <li>
            <button 
              onClick={() => alert("AI Prompt Engineering guides prompt parameters mapping on our server-side LLMs.")}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <Terminal className="h-4 w-4" />
              AI Prompt Engineering
            </button>
          </li>
        </ul>
      </div>

      {/* Reusable Support Banner Card */}
      <div className="rounded-xl bg-slate-100 border border-slate-200/60 p-5 shadow-sm" id="sidebar-support-card">
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          Need technical support for your enterprise account?
        </p>
        <button 
          onClick={handleSupportClick}
          className="mt-4 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          Contact Support 
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

    </aside>
  );
}