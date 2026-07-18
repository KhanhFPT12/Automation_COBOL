import { DocSidebar } from "./DocSidebar";
import {
  ChevronRight,
  Terminal,
  AlertTriangle,
  Sparkles,
  ListChecks,
} from "lucide-react";

const PROMPT_STRUCTURE = `SYSTEM
You are a legacy modernization engine. Convert the given source code
to the requested target stack. Preserve business logic exactly -
never invent behavior that isn't in the source.

USER
sourceLanguage: "COBOL"
targetStack: "Java 17 (Spring Boot)"
sourceCode: |
  01  WS-CUSTOMER-RECORD.
      05  WS-CUST-ID     PIC 9(08).
      05  WS-CUST-BALANCE PIC S9(13)V99 COMP-3.

RESPONSE CONTRACT (JSON)
{
  "convertedCode": "...",
  "explanation": "...",
  "stats": {
    "linesOfLegacy": 3,
    "linesOfModern": 12,
    "approximateSavedOpexPercentage": 65
  }
}`;

export function AiPromptEngineering() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans" id="ai-prompt-engineering-page">
      <div className="flex flex-col lg:flex-row gap-12">
        <DocSidebar />

        <div className="flex-1 min-w-0" id="ai-prompt-main-panel">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4">
            <span className="hover:text-sky-600 transition cursor-pointer">Docs</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="hover:text-sky-600 transition cursor-pointer">Core Concepts</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">AI Prompt Engineering</span>
          </nav>

          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold font-mono text-sky-700 tracking-wider uppercase mb-3 border border-sky-100">
              CORE CONCEPTS
            </span>
            <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              AI Prompt Engineering
            </h1>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
              This page explains how ALSM's automated conversion works today, and how to design prompts for the
              LLM-based converter that Flow B (Code Converter) is meant to eventually call.
            </p>
          </div>

          {/* Honesty notice */}
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-100 flex gap-4 items-start mb-10">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-800 font-mono tracking-wider">Current state</p>
              <p className="text-xs text-amber-800 leading-relaxed mt-1.5 font-sans">
                No prompt is sent to any LLM anywhere in ALSM today. The BMS/DSPF pipeline (
                <code className="bg-white px-1 py-0.5 rounded font-mono">bms2react.py</code> /{" "}
                <code className="bg-white px-1 py-0.5 rounded font-mono">dspf2react.py</code>) is deterministic regex
                parsing of BMS macros and DDS specs - not an AI model. The Code Converter tab's output is a static,
                pre-written demo. This page is written for whoever builds the real LLM-backed converter next.
              </p>
            </div>
          </div>

          {/* Section: Where prompting fits */}
          <section className="mb-10" id="sec-where">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-sky-600" />
              Where Prompting Fits In
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-4 font-sans max-w-3xl">
              The natural integration point is <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">runConversion()</code> in{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">frontend/src/store.ts</code>: replace the
              simulated delay with a real call to an LLM API, keeping the same response shape the UI already expects
              (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">ConversionStats</code> in{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">types.ts</code>) so no frontend changes are
              needed.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-mono text-xs overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-900 bg-slate-900 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 font-semibold ml-2">SUGGESTED PROMPT STRUCTURE</span>
              </div>
              <pre className="p-5 overflow-x-auto whitespace-pre leading-relaxed">{PROMPT_STRUCTURE}</pre>
            </div>
          </section>

          {/* Section: Best practices */}
          <section className="mb-6" id="sec-best-practices">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <ListChecks className="h-4.5 w-4.5 text-sky-600" />
              Prompt Engineering Best Practices
            </h3>
            <ul className="mt-4 space-y-3 text-xs text-slate-700 max-w-3xl">
              {[
                ["Be explicit about the target version", "\"Java 17 (Spring Boot 3.x)\" produces more consistent output than just \"Java\"."],
                ["Reuse the Data Type Mapping table as ground truth", "Paste the COBOL→Java PIC-clause rules from the Data Type Mapping guide directly into the system prompt so the model doesn't guess."],
                ["Force structured output", "Ask for JSON matching the ConversionStats contract - free-form prose is unreliable to parse in the UI."],
                ["Separate code from explanation", "Request convertedCode and explanation as distinct fields; mixing them in one code block breaks the copy-to-clipboard UX."],
                ["Never trust generated code blindly", "Always compile/build the result (see Architecture Overview's build step) before treating a conversion as final - an LLM can produce code that looks right but doesn't compile."],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3 p-4 rounded-xl border border-slate-200 bg-white">
                  <Terminal className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{title}</p>
                    <p className="text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
