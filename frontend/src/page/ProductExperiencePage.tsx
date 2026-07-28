import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ConversionErrorLog } from "../components/ConversionErrorDetails";
import { GENERIC_CONVERSION_ERROR, getConversionError, type ConversionErrorDetails } from "../utils/conversionError";
import {
  Upload,
  FileArchive,
  CheckCircle2,
  Download,
  AlertCircle,
  Loader2,
  FolderOpen,
  ArrowRight,
  X,
  RefreshCw,
} from "lucide-react";

type ConvertStatus = "idle" | "uploading" | "success" | "failed";

export function ProductExperiencePage() {
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBmsFiles, setSelectedBmsFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<ConversionErrorDetails | null>(null);
  const [showError, setShowError] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isReady = selectedFile !== null || selectedBmsFiles.length > 0;

  const reset = () => {
    setStatus("idle");
    setSelectedFile(null);
    setSelectedBmsFiles([]);
    setErrorMsg("");
    setErrorDetails(null);
    setShowError(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const zips = arr.filter((f) => f.name.toLowerCase().endsWith(".zip"));
    const bms = arr.filter((f) => f.name.toLowerCase().endsWith(".bms"));

    if (zips.length > 0) {
      setSelectedFile(zips[0]);
      setSelectedBmsFiles([]);
    } else if (bms.length > 0) {
      setSelectedFile(null);
      setSelectedBmsFiles(bms);
    } else {
      setErrorMsg("Only .zip (containing BMS files) or individual .bms files are accepted.");
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleConvert = async () => {
    if (!isReady) return;
    setStatus("uploading");
    setErrorMsg("");
    setErrorDetails(null);
    setShowError(false);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("files", selectedFile);
      } else {
        selectedBmsFiles.forEach((f) => formData.append("files", f));
      }

      const token = localStorage.getItem("alsm_token") || localStorage.getItem("token") || "";
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const resp = await fetch("/api/bms-converter/upload", {
        method: "POST",
        headers,
        body: formData,
      });

      if (!resp.ok) {
        const json = await resp.json().catch(() => ({}));
        const details = getConversionError(json, resp.status);
        setErrorDetails(details);
        throw new Error(details.message);
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : GENERIC_CONVERSION_ERROR.message;
      setErrorMsg(msg);
      setErrorDetails((current) => current || { ...GENERIC_CONVERSION_ERROR, message: msg });
      setStatus("failed");
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "bms-react-project.zip";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20">
      {/* ─── Hero ─── */}
      <section className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-semibold text-sky-700 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
              CICS2React · BMS Converter
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Product{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                Experience
              </span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Upload a BMS directory (compressed as .zip or select individual .bms files) and the system
              will automatically convert them to React components and send you back a ZIP file.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Steps ─── */}
      <section className="pb-12 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: "1", label: "Upload", desc: ".zip or .bms files", icon: <Upload className="h-5 w-5" /> },
              { step: "2", label: "Convert", desc: "CICS2React processes", icon: <RefreshCw className="h-5 w-5" /> },
              { step: "3", label: "Download", desc: "Receive result .zip", icon: <Download className="h-5 w-5" /> },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="relative flex flex-col items-center text-center bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-3">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-sky-600 tracking-widest uppercase mb-1">
                  Step {item.step}
                </span>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                {i < 2 && (
                  <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 hidden sm:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Upload & Convert Area ─── */}
      <section className="pb-20 px-4">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-emerald-200 rounded-2xl shadow-lg p-10 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="h-9 w-9 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Conversion Successful!
                </h2>
                <p className="text-slate-500 text-sm mb-3">
                  Your full React project is ready. Unzip and run:
                </p>
                <div className="bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl px-5 py-3 text-left inline-block mx-auto mb-8 leading-6">
                  <span className="text-slate-500">$ </span>cd bms-react-project<br />
                  <span className="text-slate-500">$ </span>npm install<br />
                  <span className="text-slate-500">$ </span>npm run dev
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded-xl shadow transition"
                  >
                    <Download className="h-5 w-5" />
                    Download ZIP
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold px-6 py-3 rounded-xl transition"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Convert Another File
                  </button>
                </div>
              </motion.div>
            )}

            {status === "failed" && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-rose-200 rounded-2xl shadow-lg p-10 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="h-9 w-9 text-rose-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">An Error Occurred</h2>
                <p className="text-rose-600 text-sm bg-rose-50 border border-rose-100 rounded-lg px-4 py-3 mb-4 font-mono">
                  {errorMsg}
                </p>
                {errorDetails && <ConversionErrorLog error={errorDetails} expanded={showError} onToggle={() => setShowError((show) => !show)} />}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={handleConvert} className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition"><RefreshCw className="h-4 w-4" /> Retry</button>
                  <button onClick={reset} className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold px-6 py-3 rounded-xl transition">Select another file</button>
                </div>
              </motion.div>
            )}

            {status === "uploading" && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-lg p-10 text-center"
              >
                <Loader2 className="h-12 w-12 text-sky-500 animate-spin mx-auto mb-5" />
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Converting…</h2>
                <p className="text-slate-400 text-sm">
                  CICS2React is analyzing BMS screens and generating React components.
                  <br />
                  Please wait a moment.
                </p>
              </motion.div>
            )}

            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
              >
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`
                    relative cursor-pointer p-10 flex flex-col items-center justify-center text-center
                    border-2 border-dashed rounded-2xl transition-all duration-200 m-4
                    ${dragOver
                      ? "border-sky-400 bg-sky-50"
                      : isReady
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/50"
                    }
                  `}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".zip,.bms"
                    multiple
                    className="hidden"
                    onChange={onInputChange}
                  />

                  <AnimatePresence mode="wait">
                    {isReady ? (
                      <motion.div
                        key="ready"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                          {selectedFile ? (
                            <FileArchive className="h-7 w-7 text-emerald-600" />
                          ) : (
                            <FolderOpen className="h-7 w-7 text-emerald-600" />
                          )}
                        </div>
                        <p className="font-semibold text-emerald-700 text-sm">
                          {selectedFile
                            ? selectedFile.name
                            : `${selectedBmsFiles.length} BMS file(s) selected`}
                        </p>
                        {selectedFile && (
                          <p className="text-xs text-slate-400 mt-1">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); reset(); }}
                          className="mt-3 flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition mx-auto"
                        >
                          <X className="h-3.5 w-3.5" /> Clear selection
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <div className="h-14 w-14 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
                          <Upload className="h-7 w-7 text-sky-500" />
                        </div>
                        <p className="font-semibold text-slate-700">Drag &amp; drop files here</p>
                        <p className="text-sm text-slate-400 mt-1">
                          or{" "}
                          <span className="text-sky-600 underline underline-offset-2">
                            browse from your computer
                          </span>
                        </p>
                        <p className="mt-4 text-xs text-slate-400">
                          Accepts:{" "}
                          <code className="bg-slate-100 rounded px-1.5 py-0.5 font-mono">.zip</code>{" "}
                          (compressed BMS directory) or multiple{" "}
                          <code className="bg-slate-100 rounded px-1.5 py-0.5 font-mono">.bms</code>
                          {" "}· Max 100 MB
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {errorMsg && status === "idle" && (
                    <p className="mt-4 text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                      {errorMsg}
                    </p>
                  )}
                </div>

                <div className="px-4 pb-4">
                  <button
                    onClick={handleConvert}
                    disabled={!isReady}
                    className={`
                      w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition
                      ${isReady
                        ? "bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20 cursor-pointer"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      }
                    `}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Convert Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-slate-400 mt-6 leading-relaxed"
          >
            Your files are stored temporarily during processing and deleted immediately after.
            The result is a complete React project — unzip, run{" "}
            <code className="font-mono">npm install && npm run dev</code> and you're done.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
