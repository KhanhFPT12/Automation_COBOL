import { useAppStore } from "../../store";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  LineChart,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import type { Variants } from "motion/react";


export function LandingPage() {
  const { setActivePage } = useAppStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const codeSnippetCobol = `// COBOL Source (Legacy)
IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.
PROCEDURE DIVISION.
    DISPLAY 'MODERNIZING...'.`;

  const codeSnippetJava = `// LegacyModern AI Output (Refactored)
@Service
public class ModernSystem {
    public void processMessage() {
        Logger.info("Legacy system successfully modernised");
    }
}`;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col w-full pb-16"
      id="landing-page-container"
    >
      {/* Hero Section */}
      <section
        className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20 lg:pb-12 flex flex-col lg:flex-row gap-12 items-center"
        id="hero-section"
      >
        <motion.div
          variants={itemVariants}
          className="max-w-2xl flex-1 text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 border border-violet-100">
            <Cpu className="h-3 w-3" />
            ENGINEERING PRECISION
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            The AI Partner for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700">
              Enterprise Modernization
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-lg mx-auto lg:mx-0">
            Bridge the gap between legacy reliability and cloud-native agility.
            Our suite of AI-driven tools automates the complex journey from
            technical debt to modern architecture with surgical precision.
          </p>
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <button
              id="hero-btn-explore"
              onClick={() => setActivePage("converter")}
              className="group cursor-pointer flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 active:scale-95"
            >
              Explore Tools
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              id="hero-btn-docs"
              onClick={() => setActivePage("data-mapping")}
              className="cursor-pointer flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-sky-600 active:scale-95"
            >
              Read Documentation
            </button>
          </div>
        </motion.div>

        {/* Right side abstract graphic structure */}
        <motion.div
          variants={itemVariants}
          className="flex-1 w-full max-w-md lg:max-w-none relative"
          id="hero-interactive-preview"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-sky-500/10 blur-2xl group-hover:bg-sky-500/25 transition-all duration-700" />
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-400 block" />
                <span className="h-3 w-3 rounded-full bg-amber-400 block" />
                <span className="h-3 w-3 rounded-full bg-emerald-400 block" />
              </div>
              <span className="text-xs font-mono font-medium text-slate-400 ml-2">
                legacymodern_agent_orchestra.sh
              </span>
            </div>

            {/* Visual transformation lines */}
            <div className="space-y-4 pt-6 text-sm font-mono text-slate-600">
              <p className="text-slate-400">
                // Scanning complex compilation targets...
              </p>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-800 font-semibold">
                  [COBOL] WS-CUSTOMER-RECORD
                </span>
                <ChevronRight className="h-4 w-4 text-sky-500 font-bold" />
                <span className="text-emerald-600 font-semibold">
                  [Java 17 POJO] Verified
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-800 font-semibold">
                  [RPG] PACKED(15:2) COMP-3
                </span>
                <ChevronRight className="h-4 w-4 text-sky-500 font-bold" />
                <span className="text-emerald-600 font-semibold">
                  [BigDecimal] Banker Rounding
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-sky-600 font-semibold">
                  Ready to convert standard files
                </span>
                <button
                  onClick={() => setActivePage("converter")}
                  className="text-xs bg-sky-600 hover:bg-sky-700 text-white font-semibold py-1.5 px-3 rounded-md transition"
                >
                  Try Workspace
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Modernization Suite */}
      <section
        className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 w-full"
        id="core-suite-section"
      >
        <div className="border-t border-slate-200/80 pt-16">
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950">
              Core Modernization Suite
            </h2>
            <div className="h-1 w-24 bg-sky-600 mt-2 rounded"></div>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {/* 1. Code Converter */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-100 transition hover:shadow-md flex flex-col justify-between"
              id="suite-card-converter"
            >
              <div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Code Converter
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-sans">
                  Seamlessly refactor monolithic COBOL, Assembly, and C++ into
                  high-performance, cloud-native Java and Python. Automated
                  syntax mapping with human-like logic preservation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                  99.8% Accuracy
                </span>
                <button
                  onClick={() => setActivePage("converter")}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-0.5"
                >
                  Learn More <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>

            {/* 2. Logic Analyzer */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-100 transition hover:shadow-md flex flex-col justify-between"
              id="suite-card-analyzer"
            >
              <div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <LineChart className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Logic Analyzer
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-sans">
                  Map and visualize undocumented legacy workflows. Identify
                  business logic bottlenecks and dead code using advanced AI
                  flow analysis and dependency mapping.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-violet-100">
                  Graph Visualization
                </span>
                <button
                  onClick={() => setActivePage("data-mapping")}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-0.5"
                >
                  Learn More <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>

            {/* 3. Automated Testing */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-100 transition hover:shadow-md flex flex-col justify-between"
              id="suite-card-testing"
            >
              <div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Automated Testing
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-sans">
                  Ensure functional parity between legacy and modern systems.
                  Our AI generates comprehensive regression test suites based on
                  real-world production traffic patterns.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-100">
                  Parity Validation
                </span>
                <button
                  onClick={() => setActivePage("auth-guide")}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-0.5"
                >
                  Learn More <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* From Legacy COBOL to Clean Java in Milloseconds Section */}
      <section
        className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 w-full"
        id="transformation-section"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
          {/* Left panel instructions */}
          <div className="flex-1 max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600">
              TRANSFORMATION ENGINE
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              From Legacy COBOL to Clean Java in Milliseconds
            </h2>
            <p className="mt-4 text-slate-600 font-sans leading-relaxed">
              Our AI doesn't just translate code; it re-architects it. It
              understands the business intent behind procedural legacy code and
              transforms it into scalable, object-oriented microservices.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Automatic Documentation Generation
                  </h4>
                  <p className="text-xs text-slate-500">
                    Every run automatically extracts metadata and maps variable
                    structures step-by-step.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Zero-Downtime Migration Paths
                  </h4>
                  <p className="text-xs text-slate-500">
                    Produce Spring/Node compatible components ready for seamless
                    Blue/Green deployments.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    SOC2 & GDPR Compliance Integrated
                  </h4>
                  <p className="text-xs text-slate-500">
                    AI monitors compliance markers, securely scrubbing local
                    identifiers from legacy lines.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right panel side-by-side terminal */}
          <div
            className="flex-1 w-full max-w-2xl bg-terminal-bg rounded-2xl border border-slate-850 shadow-2xl p-4 overflow-hidden self-stretch flex flex-col justify-between"
            id="terminal-pane"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500 block" />
                <span className="h-3 w-3 rounded-full bg-amber-500 block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500 block" />
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                converter.legacy_modern_ai.io
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 grow font-mono text-xs text-slate-300">
              {/* COBOL part */}
              <div className="flex flex-col gap-2 p-3 bg-slate-950/50 rounded-lg border border-slate-900">
                <div className="text-[10px] text-slate-500 font-bold border-b border-slate-900 pb-1.5 tracking-wider uppercase">
                  // COBOL Source
                </div>
                <pre className="text-indigo-300 select-all overflow-x-auto whitespace-pre-wrap">
                  {codeSnippetCobol}
                </pre>
              </div>

              {/* Java part */}
              <div className="flex flex-col gap-2 p-3 bg-slate-950/50 rounded-lg border border-slate-900">
                <div className="text-[10px] text-emerald-600 font-bold border-b border-slate-900 pb-1.5 tracking-wider uppercase">
                  // JAVA OUTPUT (Refactored)
                </div>
                <pre className="text-emerald-400 select-all overflow-x-auto whitespace-pre-wrap">
                  {codeSnippetJava}
                </pre>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-900">
              <span className="text-xs text-slate-500">
                Need real translation? Try the live converter widget.
              </span>
              <button
                onClick={() => setActivePage("converter")}
                className="cursor-pointer text-xs font-semibold bg-white text-slate-900 px-3 py-1.5 rounded hover:bg-slate-100 transition whitespace-nowrap"
              >
                Go to Converter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blue Banner with Stats */}
      <section
        className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 w-full"
        id="stats-banner-section"
      >
        <div className="rounded-2xl bg-gradient-to-r from-sky-600 to-blue-800 p-8 sm:p-12 shadow-xl shadow-sky-600/10 text-white flex flex-wrap justify-around items-center gap-8">
          <div className="text-center min-w-[150px]">
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              500M+
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-100 mt-2">
              Lines Converted
            </p>
          </div>
          <div className="text-center min-w-[150px]">
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              65%
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-100 mt-2">
              OPEX Reduction
            </p>
          </div>
          <div className="text-center min-w-[150px]">
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              12x
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-100 mt-2">
              Faster Deployment
            </p>
          </div>
          <div className="text-center min-w-[150px]">
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              0.02%
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-100 mt-2">
              Failure Rate
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
