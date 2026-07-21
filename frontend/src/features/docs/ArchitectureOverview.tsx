import { DocSidebar } from "./DocSidebar";
import { useMemo } from "react";
import {
  ChevronRight,
  FolderTree,
  Workflow,
  Layers,
  Wrench,
  History,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function ArchitectureOverview() {
  const workspaceTree = useMemo(
    () => `project/
├── bms_src/                  ← Source BMS (input): BNK1MAI.bms, BNK1ACC.bms, ...
├── dspf_src/                 ← Source DSPF (input): FILE1.dspf, WORD.dspf, ...
└── (uploaded via the Convert Tool - no local setup required)

After conversion, ALSM returns a complete, runnable React project:

bms-react-project/
├── src/
│   ├── pages/
│   │   ├── BMSPage/           ← One .tsx component per BMS screen + bmsRoutes.tsx
│   │   └── DSPFPage/          ← One .tsx component per DSPF record + dspfRoutes.tsx
│   ├── components/            ← Shared GridSystem, Input, Button, Menu
│   ├── layouts/DefaultLayout/  ← Header, Sidebar, Footer wrapping every screen
│   └── main.tsx                ← Router pointing only at the converted screens
├── package.json
└── README.md                   ← npm install && npm run dev instructions`,
    []
  );

  const targetStacks = [
    {
      name: "Java 17 (Spring Boot)",
      deps: "spring-boot-starter-web, spring-boot-starter-data-jpa, spring-boot-starter-security, jjwt-jackson, lombok",
      note: "Matches ALSM's real Spring Boot backend (backend/pom.xml) - use this when the target is a REST API with JPA entities.",
    },
    {
      name: "Node.js Express (TS)",
      deps: "express, mongoose, jsonwebtoken, bcryptjs",
      note: "Matches ALSM's real Node/Mongo backend (backend/package.json) - use this for a lightweight API with a flexible schema.",
    },
    {
      name: "Python FastAPI",
      deps: "fastapi, pydantic, uvicorn",
      note: "Use this when the target is a standalone Python service, separate from ALSM's two existing backends.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans" id="architecture-overview-page">
      <div className="flex flex-col lg:flex-row gap-12">
        <DocSidebar />

        <div className="flex-1 min-w-0" id="architecture-main-panel">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4" id="breadcrumbs-architecture">
            <span className="hover:text-sky-600 transition cursor-pointer">Docs</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="hover:text-sky-600 transition cursor-pointer">Core Concepts</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">Architecture Overview</span>
          </nav>

          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold font-mono text-sky-700 tracking-wider uppercase mb-3 border border-sky-100">
              CORE CONCEPTS
            </span>
            <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Architecture Overview
            </h1>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
              ALSM converts legacy source (BMS, DSPF, COBOL/RPG/Assembly) into modern stacks through a pipeline built
              around two separate workspaces: the <strong>legacy source</strong> you upload, and the{" "}
              <strong>modern target project</strong> generated automatically. This page explains the structure of
              both and how they connect.
            </p>
          </div>

          {/* Section: Two workspaces */}
          <section className="mb-10" id="sec-workspaces">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderTree className="h-4.5 w-4.5 text-sky-600" />
              Two Workspaces: Legacy Source & Modern Target
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-4 font-sans max-w-3xl">
              You don't need to create this folder structure yourself - just upload{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.bms</code>/
              <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.dspf</code> files (individually or bundled
              in a <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.zip</code>) through the Convert tool.
              ALSM builds the entire target structure below and packages it into a single zip for download.
            </p>
            <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-mono text-xs overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-900 bg-slate-900 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 font-semibold ml-2">WORKSPACE LAYOUT</span>
              </div>
              <pre className="p-5 overflow-x-auto whitespace-pre leading-relaxed">{workspaceTree}</pre>
            </div>
          </section>

          {/* Section: Conversion pipeline */}
          <section className="mb-10" id="sec-pipeline">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Workflow className="h-4.5 w-4.5 text-sky-600" />
              Conversion Pipeline
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-4 font-sans max-w-3xl">
              For BMS/DSPF, the pipeline runs fully automatically - no manual per-file work required:
            </p>
            <ol className="space-y-3 text-xs text-slate-700 font-sans max-w-3xl">
              {[
                ["Upload", "Select .bms/.dspf files, or a .zip containing several, in the \"BMS to React\" tab."],
                ["Parse", "bms2react.py / dspf2react.py reads BMS macros (DFHMSD/DFHMDI/DFHMDF) or DDS specs, splitting by record/map as needed."],
                ["Generate", "Each screen becomes one .tsx component (field positions preserved on the 24x80 grid; color/HILIGHT/ATTRB mapped to CSS)."],
                ["Wire routes", "bmsRoutes.tsx / dspfRoutes.tsx and the Sidebar menu are regenerated automatically, listing only the screens that were actually converted."],
                ["Package", "Everything is bundled with the full frontend template (components, layouts, README.md) into a downloadable zip that runs immediately with npm install && npm run dev."],
              ].map(([title, desc], i) => (
                <li key={title} className="flex gap-3">
                  <span className="shrink-0 h-6 w-6 rounded-full bg-sky-50 border border-sky-100 text-sky-700 font-bold flex items-center justify-center text-[11px]">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{title}</span>
                    <span className="text-slate-500"> — {desc}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Section: Target stacks */}
          <section className="mb-10" id="sec-targets">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-sky-600" />
              Choosing a Target Stack (Code Converter)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-4 font-sans max-w-3xl">
              For the "Code Converter" tab (COBOL/RPG/Assembly), you pick one of three targets. Each maps to a
              different set of underlying libraries:
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3">Target</th>
                    <th className="px-5 py-3">Core Libraries</th>
                    <th className="px-5 py-3">When to Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {targetStacks.map((t) => (
                    <tr key={t.name} className="hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{t.name}</td>
                      <td className="px-5 py-3.5 font-mono text-sky-700 text-[11px]">{t.deps}</td>
                      <td className="px-5 py-3.5 text-slate-500">{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Reviewing generated code */}
          <section className="mb-10" id="sec-review">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="h-4.5 w-4.5 text-sky-600" />
              Reviewing & Fixing Generated Code
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-3 font-sans max-w-3xl">
              The generated project uses TypeScript in strict mode (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">noUnusedLocals</code>,{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">noUnusedParameters</code>). After unzipping:
            </p>
            <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-mono text-xs overflow-hidden mb-4">
              <pre className="p-5 overflow-x-auto whitespace-pre leading-relaxed">
                <span className="text-slate-500"># 1. Install dependencies</span>{"\n"}
                <span className="text-emerald-400">npm install</span>{"\n\n"}
                <span className="text-slate-500"># 2. Build first to catch import/type errors before running dev</span>{"\n"}
                <span className="text-emerald-400">npm run build</span>{"\n\n"}
                <span className="text-slate-500"># 3. Start the dev server</span>{"\n"}
                <span className="text-emerald-400">npm run dev</span>
              </pre>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-slate-700 max-w-3xl">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                "Declared but never read" errors usually mean a screen has no output fields - already handled for
                most cases in bms2react.py/dspf2react.py.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                If the Spring Boot/Node backend isn't running yet, screens still render correctly - only submitting a
                field (pressing Enter) will surface an API error.
              </li>
            </ul>
          </section>

          {/* Section: Regeneration caveat */}
          <section className="mb-6" id="sec-regeneration">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-amber-600" />
              Re-running a Conversion
            </h3>
            <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 items-start max-w-3xl">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed font-sans">
                Converting the same BMS/DSPF files again will <strong>fully overwrite</strong> the previous screens
                in <code className="bg-white px-1 py-0.5 rounded font-mono">BMSPage</code>/
                <code className="bg-white px-1 py-0.5 rounded font-mono">DSPFPage</code>, along with their routes and
                Sidebar menu. If you've hand-edited the generated code, back it up before re-converting.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
