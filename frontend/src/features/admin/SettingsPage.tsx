import { useEffect, useState } from "react";
import { CalendarCheck2, Loader2, Unlink, ExternalLink } from "lucide-react";
import { adminApi } from "../../services/adminApi";

export function SettingsPage() {
  const [connected, setConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getGoogleStatus();
      setConnected(data.connected);
      setConnectedEmail(data.connectedEmail);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load Google Calendar status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const connect = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await adminApi.getGoogleConnectUrl();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || "Could not start Google connection.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not start Google connection.");
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    if (!confirm("Disconnect Google Calendar? Approving meetings will no longer auto-create Meet links until reconnected.")) return;
    setBusy(true);
    try {
      await adminApi.disconnectGoogle();
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to disconnect.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage platform-level integrations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-sky-50 flex items-center justify-center">
            <CalendarCheck2 className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Google Calendar</h3>
            <p className="text-xs text-slate-500">Used to auto-create Google Meet links when approving meetings.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-2"><Loader2 className="h-4 w-4 animate-spin" /> Checking status...</div>
        ) : connected ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-emerald-700">Connected</p>
              <p className="text-xs text-emerald-600">{connectedEmail}</p>
            </div>
            <button
              onClick={disconnect}
              disabled={busy}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition disabled:opacity-40"
            >
              <Unlink className="h-3.5 w-3.5" /> Disconnect
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-4">
            <p className="text-sm text-slate-600 mb-3">No Google account connected yet. Approving a meeting will fail until you connect one.</p>
            <button
              onClick={connect}
              disabled={busy}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
              Connect Google Calendar
            </button>
          </div>
        )}

        {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mt-4">{error}</p>}
      </div>
    </div>
  );
}
