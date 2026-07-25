import { DocSidebar } from "./DocSidebar";
import { useReducer, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, BrainCircuit, Table, Check, Play, FileCode, CheckCircle2 
} from "lucide-react";

// Strongly-typed state for the automated analysis scanner
interface ScannerState {
  isScanning: boolean;
  scanComplete: boolean;
}

type ScannerAction =
  | { type: "START_SCAN" }
  | { type: "COMPLETE_SCAN" }
  | { type: "RESET_SCAN" };

function scannerReducer(state: ScannerState, action: ScannerAction): ScannerState {
  switch (action.type) {
    case "START_SCAN":
      return { isScanning: true, scanComplete: false };
    case "COMPLETE_SCAN":
      return { isScanning: false, scanComplete: true };
    case "RESET_SCAN":
      return { isScanning: false, scanComplete: false };
    default:
      return state;
  }
}

export function DataMappingGuide() {
  // 1. useReducer for robust visual scan sequence tracking
  const [state, dispatch] = useReducer(scannerReducer, {
    isScanning: false,
    scanComplete: false,
  });

  // 2. useCallback to trigger optimized timing intervals
  const handleScanClick = useCallback(() => {
    dispatch({ type: "START_SCAN" });
    setTimeout(() => {
      dispatch({ type: "COMPLETE_SCAN" });
      setTimeout(() => {
        dispatch({ type: "RESET_SCAN" });
      }, 3000);
    }, 2000);
  }, []);

  // 3. useMemo to cache static equivalence definitions
  const equivalenceData = useMemo(() => [
    { cobol: "PIC X(n)", java: "java.lang.String", strategy: "Fixed-width padding as required" },
    { cobol: "PIC 9(n)", java: "java.lang.Integer / Long", strategy: "Primitive based on byte length" },
    { cobol: "PIC 9(v)99(d)", java: "java.math.BigDecimal", strategy: "Banker's Rounding (Required)" },
    { cobol: "USAGE COMP-3", java: "java.math.BigDecimal", strategy: "Packed decimal translation" },
    { cobol: "USAGE COMP", java: "int / short", strategy: "Binary integer representation" },
    { cobol: "PIC S9(n)", java: "Signed Primitive", strategy: "EBCDIC sign nibble handling" },
  ], []);

  // 4. static content outside rendering cycles or cleanly memoized
  const cobolDataDivision = useMemo(() => `01  WS-CUSTOMER-RECORD.
    05  WS-CUST-ID          PIC 9(08).
    05  WS-CUST-NAME        PIC X(30).
    05  WS-CUST-BALANCE     PIC S9(13)V99 COMP-3.
    05  WS-CUST-STATUS      PIC X(01).
        88  CUST-ACTIVE     VALUE 'A'.
        88  CUST-INACTIVE   VALUE 'I'.`, []);

  const javaPojoData = useMemo(() => `@Data
@Entity
public class CustomerRecord {
    @Id
    private Long custId;
    private String custName;
    
    @Digits(integer=13, fraction=2)
    private BigDecimal custBalance;
    
    private String custStatus;
}`, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans" id="data-mapping-guide">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar Menu */}
        <DocSidebar />

        {/* Right main documentation content panels */}
        <div className="flex-1 min-w-0" id="doc-mapping-content">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4" id="breadcrumbs">
            <span className="hover:text-sky-600 transition cursor-pointer">Docs</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="hover:text-sky-600 transition cursor-pointer">COBOL to Java</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Data Type Mapping</span>
          </nav>

          {/* Heading guide */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Data Type Mapping Guide
            </h1>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-3xl">
              Comprehensive technical reference for converting mainframe COBOL PICTURE clauses into Java primitives, wrapper classes, and Spring Data objects. Ensuring high-fidelity modernization with focus on computational precision.
            </p>
          </div>

          {/* Type Equivalence Table Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
            
            {/* Table block on the left */}
            <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden" id="mapping-table-block">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <Table className="h-4 w-4 text-sky-500" />
                <h3 className="font-bold text-slate-800 text-sm">Type Equivalence Table</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 text-[10px] uppercase tracking-wider">
                      <th className="px-5 py-3">COBOL Clause</th>
                      <th className="px-5 py-3">Java Implementation</th>
                      <th className="px-5 py-3">Precision Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {equivalenceData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-3.5 font-mono text-slate-900 bg-slate-50/10">{row.cobol}</td>
                        <td className="px-5 py-3.5 font-mono text-sky-700 font-semibold">{row.java}</td>
                        <td className="px-5 py-3.5 text-slate-500">{row.strategy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Automated Analysis Widget Card */}
            <div className="rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-6 shadow-md flex flex-col justify-between relative overflow-hidden" id="migration-status-block">
              <div className="absolute right-0 top-0 opacity-10 font-mono text-9xl pointer-events-none select-none">AI</div>
              
              <div>
                <BrainCircuit className="h-8 w-8 text-sky-300 mb-4" />
                <h3 className="font-bold text-base leading-snug">Automated Analysis</h3>
                <p className="text-xs text-sky-100 leading-relaxed font-sans mt-2">
                  Our AI parser evaluates every data division usage to suggest the most efficient Java memory footprint, cutting boilerplate lines of code by up to 70%.
                </p>
              </div>

              {/* Interaction button with mock scanners */}
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {state.isScanning ? (
                    <motion.div 
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-2 text-xs font-mono font-medium text-emerald-300 animate-pulse bg-white/10 rounded-lg border border-white/10"
                    >
                      Analyzing system elements...
                    </motion.div>
                  ) : state.scanComplete ? (
                    <motion.div 
                      key="complete"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-2 text-xs font-mono font-semibold text-emerald-400 bg-white/10 rounded-lg border border-emerald-500/20 flex items-center justify-center gap-1.5"
                    >
                      <Check className="h-4 w-4 text-emerald-400" />
                      Structure Scan Matrix Verified!
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handleScanClick}
                      className="cursor-pointer w-full bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Play className="h-3 w-3 text-sky-600 fill-sky-600" />
                      Run Migration Scan
                    </button>
                  )}
                </AnimatePresence>
                <p className="text-[10px] text-sky-200/80 mt-2 font-medium text-center">Analyzes PIC boundaries and COMP configurations</p>
              </div>
            </div>

          </div>

          {/* Comparative terminals section: Code Transformation Pattern */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-12" id="pattern-block">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-1.5 font-semibold text-slate-800 text-sm">
              <FileCode className="h-4.5 w-4.5 text-violet-500" />
              Code Transformation Pattern
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-950 font-mono text-[11px] text-slate-300 leading-relaxed">
              
              {/* Left comparative console (COBOL) */}
              <div className="p-5">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase mb-3 border-b border-white/5 pb-2">
                  <span>LEGACY COBOL DATA DIVISION</span>
                  <span className="text-indigo-400">COBOL</span>
                </div>
                <pre className="overflow-x-auto text-indigo-300 whitespace-pre">{cobolDataDivision}</pre>
              </div>

              {/* Right comparative console (Java) */}
              <div className="p-5">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase mb-3 border-b border-white/5 pb-2">
                  <span>MODERN JAVA POJO (SPRING DATA)</span>
                  <span className="text-emerald-500">JAVA 17</span>
                </div>
                <pre className="overflow-x-auto text-emerald-400 whitespace-pre">{javaPojoData}</pre>
              </div>

            </div>
          </div>

          {/* Trio info grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                <span className="text-xs font-bold font-mono">COMP</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Computational Precision</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-sans">
                How to maintain COMP-3 parity using BigDecimal scaling in mission-critical financial applications.
              </p>
            </div>
            
            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <div className="h-8 w-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                <span className="text-xs font-bold font-mono">88_V</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">88-Level Translation</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-sans">
                Mapping COBOL condition names to Java Enums or Boolean validation flags using Spring Validation.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-white">
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <span className="text-xs font-bold font-mono">EBCD</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">EBCDIC Handling</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-sans">
                Strategies for byte-to-character conversion during batch data ingestion pipelines.
              </p>
            </div>
          </div>

          {/* The Logic of Modernization Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between" id="modernization-logic-block">
            <div className="flex-1 max-w-lg">
              <h3 className="font-display text-xl font-bold tracking-tight text-slate-900">
                The Logic of Modernization
              </h3>
              <p className="text-xs text-slate-500 mt-2 font-sans">
                Visualizing the flow from flat-file legacy definitions to structured, object-oriented Java schemas. LegacyModern AI ensures every byte is accounted for.
              </p>

              <ul className="mt-6 space-y-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                  Zero-Loss data transformation logic
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                  Schema generation for SQL/NoSQL targets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                  Validation metadata injection
                </li>
              </ul>
            </div>

            {/* Visual illustration box */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center min-w-[240px]" id="engine-graphic">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-700 shadow-sm">
                  01
                </div>
                <div className="h-0.5 w-8 bg-slate-250 relative">
                  <div className="absolute right-0 -top-1 border-t-4 border-l-4 border-t-transparent border-l-slate-250 h-2 w-2 transform rotate-45" />
                </div>
                <div className="h-10 w-10 bg-sky-600 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white shadow-md shadow-sky-600/15">
                  {"{}"}
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono text-slate-400 mt-4 uppercase">Structural Mapping Engine</span>
            </div>

          </div>

        </div>
        
      </div>
    </div>
  );
}