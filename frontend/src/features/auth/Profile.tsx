import { useState } from "react";
import { User, Mail, Shield, Calendar, ArrowLeft, Save, Loader2, Pencil } from "lucide-react";
import { motion } from "motion/react";
import { useAppStore } from "../../store";
import { authApi } from "../../services/authApi";

export function Profile() {
  const { session, setActivePage } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(session.name || "");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <button onClick={() => setActivePage("home")} className="text-slate-400 hover:text-slate-700 transition mb-6 flex items-center gap-1.5 cursor-pointer"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center"><User className="h-6 w-6 text-sky-600" /></div><div><h2 className="text-xl font-extrabold text-slate-900">{session.name}</h2><p className="text-xs text-slate-500">{session.email}</p></div></div>
          {!editing && <button onClick={() => setEditing(true)} className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"><Pencil className="h-4 w-4" /></button>}
        </div>
        {success && <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 text-xs text-emerald-700 font-semibold">Profile updated!</div>}
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs text-red-700">{error}</div>}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {editing ? (<>
            <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Full Name</label><input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500" /></div>
            <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+84..." className="w-full px-3 py-2.5 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500" /></div>
            <div className="flex gap-2 pt-2"><button onClick={() => { setEditing(false); setError(""); setSuccess(false); }} className="flex-1 text-sm font-semibold text-slate-500 py-2 rounded-lg hover:bg-slate-50 transition cursor-pointer">Cancel</button>
              <button onClick={async () => { setSaving(true); setError(""); setSuccess(false); try { await authApi.updateProfile({ fullName: fullName.trim(), phone: phone.trim() }); setSuccess(true); setEditing(false); } catch(e) { setError(e?.message || "Failed"); } finally { setSaving(false); } }} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-60 cursor-pointer text-sm">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving..." : "Save"}</button>
            </div>
          </>) : (<>
            <div className="flex items-center gap-3 py-1.5"><User className="h-4 w-4 text-slate-400" /><div><p className="text-[10px] text-slate-400 font-bold uppercase">Name</p><p className="text-sm text-slate-700">{session.name || "—"}</p></div></div>
            <div className="flex items-center gap-3 py-1.5"><Mail className="h-4 w-4 text-slate-400" /><div><p className="text-[10px] text-slate-400 font-bold uppercase">Email</p><p className="text-sm text-slate-700">{session.email}</p></div></div>
            <div className="flex items-center gap-3 py-1.5"><Shield className="h-4 w-4 text-slate-400" /><div><p className="text-[10px] text-slate-400 font-bold uppercase">Role</p><p className="text-sm text-slate-700">{session.role}</p></div></div>
            <div className="flex items-center gap-3 py-1.5"><Calendar className="h-4 w-4 text-slate-400" /><div><p className="text-[10px] text-slate-400 font-bold uppercase">Account</p><p className="text-sm text-slate-700">{session.accountType}</p></div></div>
          </>)}
        </div>
      </motion.div>
    </div>
  );
}
