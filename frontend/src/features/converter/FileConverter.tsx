import React, { useRef } from "react";
import { useAppStore } from "../../store";
import { useCodeConverter } from "../../hook/useCodeConverter";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  RefreshCw,
  Upload,
  Terminal,
  Check,
  Sparkles,
  Cpu,
  FileJson,
  Copy,
  CheckCircle2,
} from "lucide-react";

export function FileConverter() {
  const { setActivePage } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    state,
    computedStatsText,
    setSourceCode,
    setFileType,
    setTargetType,
    handleSampleChange,
    setDemoVideoPlaying,
    handleCopy,
    setDragging,
    runConversion,
  } = useCodeConverter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceCode(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceCode(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(e.target.value as "COBOL" | "RPG" | "Assembly");
  };

  const handleTargetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetType(
      e.target.value as
        | "Java 17 (Spring Boot)"
        | "Nodejs Express (TS)"
        | "Python FastAPI",
    );
  };

  return (
    <div
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans"
      id="converter-page"
    >
      <section className="flex flex-col lg:flex-row gap-12 items-center justify-between mb-16">
        <div className="flex-1 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100">
            <Sparkles className="h-3 w-3" />
            Breakthrough solution 2026
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Specialized AI Agent for <br />
            <span className="text-sky-600">Enterprise Modernization</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Your AI development partner for the full software lifecycle—from
            planning to delivery. Modernize legacy systems (COBOL, RPG,
            Assembly) safely, securely, and automatically.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              id="playground-btn-book"
              onClick={() =>
                alert(
                  "Meeting booking window opened! Our modernization specialists will contact you at your email registered in AI Studio.",
                )
              }
              className="cursor-pointer font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 hover:shadow-lg transition px-6 py-3 rounded-xl shadow shadow-sky-600/10"
            >
              Book a meeting →
            </button>
            <button
              id="playground-btn-demo"
              onClick={() => setDemoVideoPlaying(true)}
              className="cursor-pointer font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Play className="h-4 w-4 text-sky-600 fill-sky-600" />
              Watch Interactive Demo
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <AnimatePresence mode="wait">
            {state.demoVideoPlaying ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border-2 border-sky-600 bg-slate-950 p-6 shadow-2xl relative text-white h-72 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs font-mono text-sky-400">
                    DEMO PRESENTATION
                  </span>
                  <button
                    onClick={() => setDemoVideoPlaying(false)}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300"
                  >
                    Close Demo
                  </button>
                </div>
                <div className="text-center py-6">
                  <Cpu className="h-10 w-10 text-sky-400 mx-auto animate-pulse mb-3" />
                  <p className="font-semibold text-sm">
                    Automated Stream Analysis Engine
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    This workspace triggers deep scanning loops through
                    mainframe PICTURE clauses, compiling variables into abstract
                    syntax trees (AST) before generating Java/Spring pojos.
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-500 text-center">
                  Duration ~1:25 • Click Close to return to live terminal
                  workspace
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl relative overflow-hidden group">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-semibold ml-2">
                    LegacyModern Agent - Code Conversion
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-600 space-y-3">
                  <p className="text-sky-600 font-semibold">
                    // Running automated checks on systems...
                  </p>
                  <p className="text-slate-400">
                    [info] Port 3000 online proxy standard configured.
                  </p>
                  <p className="text-slate-400">
                    [info] Active Gemini-3.5-flash agent loaded server-side.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-semibold text-slate-700">
                      AI Client listening for workspace source events
                    </span>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-center text-2xl font-bold text-slate-900 mb-8">
          Develop faster with an AI partner
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sky-600 font-bold text-lg mb-2 block">
              01
            </span>
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Engineering productivity
            </h4>
            <p className="text-xs text-slate-500">
              Achieve 20-80% productivity gains in SDLC tasks, saving hours on
              repetitive code mapping.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sky-600 font-bold text-lg mb-2 block">
              02
            </span>
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Accelerate time to value
            </h4>
            <p className="text-xs text-slate-500">
              Deliver complex work 20-40% faster and reduce hours on manual
              class declarations.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sky-600 font-bold text-lg mb-2 block">
              03
            </span>
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Predictable cost efficiency
            </h4>
            <p className="text-xs text-slate-500">
              Reduce structural compute costs by 40% through streamlined, light
              dependencies.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sky-600 font-bold text-lg mb-2 block">
              04
            </span>
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Earlier risk detection
            </h4>
            <p className="text-xs text-slate-500">
              Highlight vulnerabilities and dead logic lines instantly during
              conversion scans.
            </p>
          </div>
        </div>
      </section>

      <section
        className="border-t border-slate-200 pt-16"
        id="playground-tool-section"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Try our File Converter
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Experience the power of our specialized AI by uploading a legacy
              source file or choosing a sample context.
            </p>
          </div>
          <button
            onClick={() => setActivePage("data-mapping")}
            className="cursor-pointer flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-sky-600 shrink-0"
          >
            <FileJson className="h-4 w-4 text-sky-500" />
            Technical Documentation
          </button>
        </div>

        <div
          className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col"
          id="workspace-block"
        >
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer font-bold text-xs bg-white border border-slate-200 hover:bg-slate-50 transition px-3 py-1.5 rounded-md flex items-center gap-1.5 text-slate-700"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                Open File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".cbl,.ccp,.cpy,.txt,.rpg,.asm"
              />

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Load Samples:
                </span>
                <button
                  onClick={() => handleSampleChange("customerRecord")}
                  className={`text-[11px] font-semibold px-2 py-1 rounded transition ${state.activeSample === "customerRecord" ? "bg-sky-50 text-sky-700 border border-sky-200" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Customer Record
                </button>
                <button
                  onClick={() => handleSampleChange("invoiceItem")}
                  className={`text-[11px] font-semibold px-2 py-1 rounded transition ${state.activeSample === "invoiceItem" ? "bg-sky-50 text-sky-700 border border-sky-200" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Invoice Items
                </button>
                <button
                  onClick={() => handleSampleChange("employeeDetails")}
                  className={`text-[11px] font-semibold px-2 py-1 rounded transition ${state.activeSample === "employeeDetails" ? "bg-sky-50 text-sky-700 border border-sky-200" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Employee File
                </button>
              </div>
            </div>

            <button
              id="btn-workspace-convert"
              onClick={runConversion}
              disabled={state.isConverting || !state.sourceCode}
              className="cursor-pointer bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 transition active:scale-95 shadow shadow-sky-600/15"
            >
              {state.isConverting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Run Conversion
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-white">
            <div className="flex flex-col min-h-[380px]">
              <div className="bg-slate-50/50 border-b border-slate-100 p-3 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 font-mono uppercase">
                  <Terminal className="h-3.5 w-3.5 text-slate-400" />
                  Legacy Source
                </span>

                <select
                  id="source-type-select"
                  value={state.fileType}
                  onChange={handleFileTypeChange}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="COBOL">COBOL (.cbl)</option>
                  <option value="RPG">RPG (*free)</option>
                  <option value="Assembly">IBM Assembly (.asm)</option>
                </select>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex-1 p-4 font-mono text-xs flex flex-col ${state.isDragging ? "bg-sky-50/80 border-2 border-dashed border-sky-400" : ""}`}
              >
                <textarea
                  id="source-code-textarea"
                  value={state.sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  placeholder="Enter or paste your legacy code here, or drop a code file..."
                  className="w-full flex-1 min-h-[300px] resize-none border-0 focus:ring-0 p-0 font-mono text-xs text-slate-800 bg-transparent focus:outline-none placeholder-slate-400 leading-relaxed"
                />

                {!state.sourceCode && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50/10 pointer-events-none">
                    <Upload className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-500">
                      Drag and drop source file here
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Supports .cbl, .ccp, .cpy, .free
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 pointer-events-auto text-xs bg-white border border-slate-200 text-sky-600 hover:bg-slate-50 px-3 py-1.5 rounded font-bold shadow-sm"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col min-h-[380px] bg-slate-950/2 md:bg-transparent">
              <div className="bg-slate-50/50 border-b border-slate-200 p-3 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 font-mono uppercase">
                  <Cpu className="h-3.5 w-3.5 text-slate-400 animate-pulse" />
                  Converted output
                </span>

                <select
                  id="target-type-select"
                  value={state.targetType}
                  onChange={handleTargetTypeChange}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="Java 17 (Spring Boot)">
                    Java 17 (Spring Boot)
                  </option>
                  <option value="Nodejs Express (TS)">
                    Node.js (TypeScript)
                  </option>
                  <option value="Python FastAPI">Python (FastAPI)</option>
                </select>
              </div>

              <div className="flex-1 p-4 flex flex-col font-mono text-xs overflow-hidden relative min-h-[300px]">
                <AnimatePresence mode="wait">
                  {state.isConverting ? (
                    <motion.div
                      key="converting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-8 text-center"
                    >
                      <Cpu className="h-8 w-8 text-sky-500 animate-spin mb-4" />
                      <p className="font-semibold text-slate-800 text-xs mb-1">
                        Synthesizing Target AST Structure...
                      </p>
                      <p className="text-[11px] text-slate-500 h-4 font-mono font-medium animate-pulse">
                        {state.progressStep}
                      </p>
                    </motion.div>
                  ) : state.convertedCode ? (
                    <motion.div
                      key="converted-output"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col h-full grow"
                    >
                      <div className="flex justify-between items-center mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 shrink-0">
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded">
                          AI Compiled Successfully
                        </span>
                        <button
                          onClick={handleCopy}
                          className="text-[11px] border border-slate-200 bg-white hover:bg-slate-50 font-semibold px-2.5 py-1 rounded inline-flex items-center gap-1 text-slate-600 cursor-pointer"
                        >
                          {state.copied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy Code
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="flex-1 overflow-auto whitespace-pre p-2 bg-slate-900 text-slate-100 rounded-lg text-xs leading-relaxed max-h-[320px]">
                        <code>{state.convertedCode}</code>
                      </pre>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-8 leading-relaxed">
                      <Terminal className="h-10 w-10 text-slate-200 mb-2" />
                      <p className="text-xs font-semibold text-slate-500">
                        Conversion output will appear here
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Select your source file variables and click "Run
                        Conversion" on top of the tab toolbar to start.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="bg-sky-600 text-white text-[10px] font-mono font-medium px-4 py-2 flex justify-between items-center flex-wrap gap-2 shrink-0">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-300 rounded-full inline-block animate-pulse" />
                workspace: active (main*)
              </span>
              <span>•</span>
              <span>compiler: Engine v2.4.0</span>
            </div>
            <div className="flex items-center gap-4">
              <span>mode: UTF-8</span>
              <span>
                type: {state.fileType} to {state.targetType}
              </span>
            </div>
          </div>
        </div>

        {state.convertedCode && !state.isConverting && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-emerald-50/50 border border-emerald-250 rounded-2xl p-6"
            id="workspace-explanation-panel"
          >
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
              Transformation Blueprint Details
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed mt-2 pl-6.5">
              {state.explanation}
            </p>

            {state.stats && (
              <div className="grid grid-cols-3 gap-4 border-t border-emerald-200/50 pt-4 mt-4 pl-6.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Lines of Legacy
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {state.stats.linesOfLegacy} Source Lines
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Lines of Modern Target
                  </span>
                  <span className="text-sm font-semibold text-emerald-700">
                    {state.stats.linesOfModern} Java Class Lines
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Estimated OPEX reduction
                  </span>
                  <span className="text-sm font-semibold text-sky-600">
                    {computedStatsText
                      ? state.stats.approximateSavedOpexPercentage
                      : 0}
                    % Saved
                  </span>
                </div>
              </div>
            )}
            {computedStatsText && (
              <div className="mt-3 pl-6.5 text-[10px] text-slate-400 font-medium font-mono border-t border-emerald-200/30 pt-3">
                // metric profiles: {computedStatsText.lineRatioText} |{" "}
                {computedStatsText.savingsExplanation}
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
