import { DocSidebar } from "./DocSidebar";
import { useState } from "react";
import { 
  ChevronRight, Search, ShieldCheck, HelpCircle, Copy, Check 
} from "lucide-react";

export function AuthGuide() {
  const [copied, setCopied] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleCopy = () => {
    const code = `const API_KEY = 'lm_live_xxxxxxxx';
const ENDPOINT = 'https://api.legacymodern.ai/v1/modernize';

async function modernizeCode(source) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ source })
  });
  return await response.json();
}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const errorData = [
    { status: 401, code: "unauthorized", desc: "The API key provided is invalid or has expired." },
    { status: 403, code: "insufficient_scope", desc: "The key does not have permission to access this resource." },
    { status: 429, code: "rate_limit_exceeded", desc: "You have sent too many requests in a short period of time." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans" id="auth-guide-page">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar Menu */}
        <DocSidebar />

        {/* Right content layout splits into double layouts: content (left) + On This Page (right) */}
        <div className="flex-1 min-w-0 flex flex-col xl:flex-row gap-10">

          {/* Core content block */}
          <div className="flex-1 min-w-0" id="auth-main-panel">
            
            {/* Header toolbar metadata: Docs > Getting Started > Authentication Guide + Version Selector + Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-200/60 pb-5">
              <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500" id="breadcrumbs-auth">
                <span className="hover:text-sky-600 transition cursor-pointer">Docs</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <span className="hover:text-sky-600 transition cursor-pointer">Getting Started</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-800 font-bold">Authentication Guide</span>
              </nav>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded shrink-0">
                  v2.4.0-stable
                </span>
                
                {/* Search document mockup */}
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search docs (Ctrl+K)" 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Title description tag */}
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold font-mono text-sky-700 tracking-wider uppercase mb-3 border border-sky-100">
                SECURITY PROTOCOL
              </span>
              <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Authentication Guide
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-sans">
                Learn how to securely authenticate your applications with the LegacyModern AI API. Our platform uses Bearer tokens and mutual TLS for enterprise-grade security during the modernization process.
              </p>
            </div>

            {/* AI Recommendation notice block */}
            <div className="p-5 rounded-xl bg-sky-50/50 border border-sky-150 relative overflow-hidden flex gap-4 items-start mb-10" id="auth-recommendation-block">
              <div className="h-2 px-1 w-1 bg-sky-600 rounded-full shrink-0 mt-2"></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-sky-800 font-mono tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  AI RECOMMENDATION
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-sans">
                  For development environments, we recommend using short-lived developer tokens (expiring in 1 hour) to ensure minimum exposure risk during the initial integration phase.
                </p>
              </div>
            </div>

            {/* Section: Authentication Overview */}
            <section className="mb-10" id="sec-overview">
              <h3 className="font-display text-lg font-bold text-slate-900">Authentication Overview</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                Every request to the LegacyModern API must include an Authorization header. We utilize standard OAuth 2.0 flows for user-based access and API keys for automated system-to-system integrations.
              </p>
            </section>

            {/* Section: Managing API Keys */}
            <section className="mb-10" id="sec-apikeys">
              <h3 className="font-display text-lg font-bold text-slate-900">Managing API Keys</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans">
                API keys provide full access to your organization's modernization workflows. Keep them safe and rotate them regularly through the Security Dashboard.
              </p>

              {/* Graphic Placeholder (distributed security architecture) */}
              <div className="mt-6 border border-slate-200 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center h-48 relative overflow-hidden" id="architecture-diagram">
                <HelpCircle className="h-10 w-10 text-slate-300 stroke-1 mb-2 animate-pulse" />
                <span className="text-xs font-semibold text-slate-700">Figure 1.0: LegacyModern's Distributed Security Architecture</span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono tracking-wider uppercase">mTLS Gateway • OAuth Identity Management</span>
              </div>
            </section>

            {/* Section: Implementation Example */}
            <section className="mb-10" id="sec-implementation">
              <h3 className="font-display text-lg font-bold text-slate-900">Implementation Example</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-6 font-sans">
                Use the following snippet to authorize your requests in Node.js using the standard fetch API.
              </p>

              {/* Editor screen frame with Dots and Copy button */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-mono text-xs overflow-hidden" id="helper-snippet-block">
                <div className="px-5 py-3 border-b border-slate-900 bg-slate-900 flex justify-between items-center">
                  <div className="flex gap-1.5 items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[10px] text-slate-500 font-semibold ml-2">AUTH_HELPER.JS</span>
                  </div>
                  
                  <button 
                    onClick={handleCopy}
                    className="cursor-pointer text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 hover:bg-white/5 py-1 px-2.5 rounded border border-white/5"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        COPY CODE
                      </>
                    )}
                  </button>
                </div>

                {/* Styled code */}
                <pre className="p-5 overflow-x-auto whitespace-pre leading-relaxed select-all font-mono">
                  <span className="text-blue-400">const</span> <span className="text-amber-400">API_KEY</span> = <span className="text-emerald-400">'lm_live_xxxxxxxx'</span>;{"\n"}
                  <span className="text-blue-400">const</span> <span className="text-amber-400">ENDPOINT</span> = <span className="text-emerald-400">'https://api.legacymodern.ai/v1/modernize'</span>;{"\n\n"}
                  <span className="text-blue-400">async function</span> <span className="text-violet-400">modernizeCode</span>(source) {"{"}{"\n"}
                  {"  "}<span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> <span className="text-violet-400">fetch</span>(ENDPOINT, {"{"}{"\n"}
                  {"    "}method: <span className="text-emerald-400">'POST'</span>,{"\n"}
                  {"    "}headers: {"{"}{"\n"}
                  {"      "}<span className="text-emerald-400">'Authorization'</span>: <span className="text-emerald-300">`Bearer $`</span>{"{"}<span className="text-amber-400">API_KEY</span>{"}"}<span className="text-emerald-300">`</span>,{"\n"}
                  {"      "}<span className="text-emerald-400">'Content-Type'</span>: <span className="text-emerald-400">'application/json'</span>{"\n"}
                  {"    "}{"}"},{"\n"}
                  {"    "}body: <span className="text-violet-400">JSON</span>.<span className="text-violet-400">stringify</span>({"{"} source {"}"}){"\n"}
                  {"  "}{"}"});{"\n"}
                  {"  "}<span className="text-blue-400">return await</span> response.<span className="text-violet-400">json</span>();{"\n"}
                  {"}"}
                </pre>
              </div>
            </section>

            {/* Section: Error Codes */}
            <section className="mb-6" id="sec-errorcodes">
              <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Error Codes</h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm" id="error-codes-block">
                <table className="w-full text-left text-xs text-slate-700 animate-fade-in">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Code</th>
                      <th className="px-5 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {errorData.map((err, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-3.5 font-bold text-rose-600 font-mono">{err.status}</td>
                        <td className="px-5 py-3.5 font-mono text-slate-800 bg-slate-50/10 font-semibold">{err.code}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-sans">{err.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>

          {/* Right Layout Table of Contents Column */}
          <aside className="w-full xl:w-56 shrink-0" id="on-this-page-sidebar">
            <div className="sticky top-24 space-y-8">
              <div>
                <p className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">
                  ON THIS PAGE
                </p>
                <ul className="space-y-2 text-xs font-semibold text-slate-500 border-l border-slate-200 pl-3">
                  <li>
                    <a href="#sec-overview" className="hover:text-sky-600 hover:border-l hover:border-sky-600 hover:-ml-3.5 hover:pl-3 w-full block transition">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#sec-apikeys" className="hover:text-sky-600 hover:border-l hover:border-sky-600 hover:-ml-3.5 hover:pl-3 w-full block transition">
                      API Keys
                    </a>
                  </li>
                  <li>
                    <a href="#sec-implementation" className="hover:text-sky-600 hover:border-l hover:border-sky-600 hover:-ml-3.5 hover:pl-3 w-full block transition">
                      Implementation
                    </a>
                  </li>
                  <li>
                    <a href="#sec-errorcodes" className="hover:text-sky-600 hover:border-l hover:border-sky-600 hover:-ml-3.5 hover:pl-3 w-full block transition">
                      Error Codes
                    </a>
                  </li>
                </ul>
              </div>

              {/* Reusable Pro Tip Column Card */}
              <div className="rounded-xl bg-orange-50 text-orange-800 border border-orange-100 p-5 shadow-sm" id="protip-card">
                <p className="text-[10px] uppercase font-bold font-mono tracking-wider text-orange-700 flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  PRO TIP
                </p>
                <p className="text-xs leading-relaxed font-sans text-orange-700">
                  Use the <code className="font-mono bg-white px-1 py-0.5 rounded border border-orange-100">--dry-run</code> flag in your API calls to test authorization workflows without spending modernization tokens.
                </p>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
