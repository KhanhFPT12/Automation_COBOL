import { DocSidebar } from "./DocSidebar";
import {
  ChevronRight,
  GitBranch,
  CheckCircle2,
  FlaskConical,
  ArrowRight,
} from "lucide-react";

const FLOW_A_STEPS = ["Upload .bms/.dspf", "Parse macros/DDS", "Generate .tsx screens", "Package project", "Download & run"];
const FLOW_B_STEPS = ["Paste/upload source", "Select target stack", "Run Conversion", "Review output"];

export function ModernizationFlows() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans" id="modernization-flows-page">
      <div className="flex flex-col lg:flex-row gap-12">
        <DocSidebar />

        <div className="flex-1 min-w-0" id="modernization-flows-main-panel">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4">
            <span className="hover:text-sky-600 transition cursor-pointer">Docs</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="hover:text-sky-600 transition cursor-pointer">Core Concepts</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Modernization Flows</span>
          </nav>

          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold font-mono text-sky-700 tracking-wider uppercase mb-3 border border-sky-100">
              CORE CONCEPTS
            </span>
            <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Modernization Flows
            </h1>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
              ALSM currently exposes two independent modernization flows, at two different levels of maturity. This
              page describes both so you know exactly what to expect from each before you start.
            </p>
          </div>

          {/* Flow A */}
          <section className="mb-10" id="sec-flow-a">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="h-4.5 w-4.5 text-sky-600" />
                Flow A — BMS/DSPF to React
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                <CheckCircle2 className="h-3 w-3" /> Production
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-5 font-sans max-w-3xl">
              Fully automated end-to-end: real BMS macro / DDS parsers generate an actual, runnable React project.
              See the <span className="font-semibold text-slate-700">Architecture Overview</span> page for the
              underlying pipeline details.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {FLOW_A_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                    {step}
                  </span>
                  {i < FLOW_A_STEPS.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
                </div>
              ))}
            </div>
          </section>

          {/* Flow B */}
          <section className="mb-10" id="sec-flow-b">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="h-4.5 w-4.5 text-violet-600" />
                Flow B — Code Converter (COBOL / RPG / Assembly)
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 border border-amber-200 uppercase tracking-wide">
                <FlaskConical className="h-3 w-3" /> Demo
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-5 font-sans max-w-3xl">
              <strong>Important:</strong> this flow currently runs entirely in the browser using pre-written sample
              outputs (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">hook/useCodeConverter.tsx</code>).
              It does not call a real parser or an LLM backend yet - it exists to demonstrate the intended UX. Treat
              its output as illustrative, not as a real conversion result.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {FLOW_B_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                    {step}
                  </span>
                  {i < FLOW_B_STEPS.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
                </div>
              ))}
            </div>
          </section>

          {/* Which flow to use */}
          <section className="mb-6" id="sec-which-flow">
            <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Which Flow Should I Use?
            </h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3">If you have...</th>
                    <th className="px-5 py-3">Use</th>
                    <th className="px-5 py-3">You'll get</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-5 py-3.5 text-slate-700">Real .bms or .dspf files to convert</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-700">Flow A</td>
                    <td className="px-5 py-3.5 text-slate-500">A downloadable, runnable React project</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 text-slate-700">COBOL/RPG/Assembly and want to explore the UX</td>
                    <td className="px-5 py-3.5 font-bold text-amber-700">Flow B (demo)</td>
                    <td className="px-5 py-3.5 text-slate-500">Sample output for evaluation purposes only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
