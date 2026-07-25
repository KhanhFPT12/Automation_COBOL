import { ChevronDown, ChevronUp } from "lucide-react";
import type { ConversionErrorDetails } from "../utils/conversionError";

interface Props {
  error: ConversionErrorDetails;
  expanded: boolean;
  onToggle: () => void;
}

export function ConversionErrorLog({ error, expanded, onToggle }: Props) {
  return (
    <div className="mb-6 text-left">
      <button type="button" onClick={onToggle} aria-expanded={expanded} className="mx-auto flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
        View error details
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && (
        <dl className="mt-4 grid gap-3 rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-sm">
          <div><dt className="font-semibold text-slate-500">Error code</dt><dd className="mt-1 font-mono text-rose-700">{error.code}</dd></div>
          <div><dt className="font-semibold text-slate-500">Error message</dt><dd className="mt-1 break-words text-slate-700">{error.message}</dd></div>
          <div><dt className="font-semibold text-slate-500">Problematic line</dt><dd className="mt-1 whitespace-pre-wrap break-words font-mono text-slate-700">{error.line}</dd></div>
          <div><dt className="font-semibold text-slate-500">Suggested fix</dt><dd className="mt-1 text-slate-700">{error.suggestion}</dd></div>
        </dl>
      )}
    </div>
  );
}
