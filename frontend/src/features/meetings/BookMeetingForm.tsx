import { useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  Globe,
  User,
  Building2,
  Mail,
  Phone,
  FileText,
  AlignLeft,
  Timer,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useAppStore } from "../../store";
import type { MeetingDuration } from "../../types";

const TIME_ZONES = [
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
  "UTC",
];

const DURATIONS: MeetingDuration[] = [30, 60, 90];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition placeholder-slate-400";
const labelClass = "flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5";

export function BookMeetingForm() {
  const { session, bookMeeting, isBookingMeeting, bookMeetingError, bookMeetingSuccess, clearBookMeetingStatus, setActivePage } =
    useAppStore();

  const [form, setForm] = useState({
    fullName: session.name || "",
    companyName: "",
    email: session.email || "",
    phone: "",
    topic: "",
    description: "",
    preferredDate: "",
    preferredTime: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh",
    duration: 30 as MeetingDuration,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
    if (!form.phone.trim()) errors.phone = "Phone number is required.";
    if (!form.topic.trim()) errors.topic = "Meeting topic is required.";
    if (!form.preferredDate) errors.preferredDate = "Preferred date is required.";
    else if (new Date(form.preferredDate) < new Date(new Date().toDateString()))
      errors.preferredDate = "Date cannot be in the past.";
    if (!form.preferredTime) errors.preferredTime = "Preferred time is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await bookMeeting(form);
  };

  if (bookMeetingSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-emerald-200 rounded-2xl shadow-lg p-10">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-9 w-9 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Request sent!</h2>
          <p className="text-slate-500 text-sm mb-8">{bookMeetingSuccess}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActivePage("my-meetings")}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
            >
              Go to My Meetings
            </button>
            <button
              onClick={clearBookMeetingStatus}
              className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold px-6 py-3 rounded-xl transition"
            >
              Book another meeting
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <button
        onClick={() => setActivePage("home")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Book a Meeting</h1>
      <p className="text-slate-500 mb-8">
        Tell us about what you'd like to discuss. Your request will be reviewed by our team and
        you'll be notified once it's approved.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}><User className="h-3.5 w-3.5" /> Full Name *</label>
            <input className={inputClass} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Doe" />
            {fieldErrors.fullName && <p className="text-xs text-rose-500 mt-1">{fieldErrors.fullName}</p>}
          </div>
          <div>
            <label className={labelClass}><Building2 className="h-3.5 w-3.5" /> Company Name (Optional)</label>
            <input className={inputClass} value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Acme Corp" />
          </div>
          <div>
            <label className={labelClass}><Mail className="h-3.5 w-3.5" /> Email *</label>
            <input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
            {fieldErrors.email && <p className="text-xs text-rose-500 mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className={labelClass}><Phone className="h-3.5 w-3.5" /> Phone Number *</label>
            <input className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+84 90 000 0000" />
            {fieldErrors.phone && <p className="text-xs text-rose-500 mt-1">{fieldErrors.phone}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}><FileText className="h-3.5 w-3.5" /> Meeting Topic *</label>
          <input className={inputClass} value={form.topic} onChange={(e) => update("topic", e.target.value)} placeholder="e.g. BMS to React migration consultation" />
          {fieldErrors.topic && <p className="text-xs text-rose-500 mt-1">{fieldErrors.topic}</p>}
        </div>

        <div>
          <label className={labelClass}><AlignLeft className="h-3.5 w-3.5" /> Meeting Description</label>
          <textarea className={`${inputClass} min-h-[90px] resize-y`} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Share any context that will help us prepare..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}><Calendar className="h-3.5 w-3.5" /> Preferred Date *</label>
            <input type="date" className={inputClass} value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} min={new Date().toISOString().slice(0, 10)} />
            {fieldErrors.preferredDate && <p className="text-xs text-rose-500 mt-1">{fieldErrors.preferredDate}</p>}
          </div>
          <div>
            <label className={labelClass}><Clock className="h-3.5 w-3.5" /> Preferred Time *</label>
            <input type="time" className={inputClass} value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} />
            {fieldErrors.preferredTime && <p className="text-xs text-rose-500 mt-1">{fieldErrors.preferredTime}</p>}
          </div>
          <div>
            <label className={labelClass}><Globe className="h-3.5 w-3.5" /> Time Zone *</label>
            <select className={inputClass} value={form.timeZone} onChange={(e) => update("timeZone", e.target.value)}>
              {TIME_ZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}><Timer className="h-3.5 w-3.5" /> Meeting Duration *</label>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => update("duration", d)}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    form.duration === d
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {bookMeetingError && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">{bookMeetingError}</p>
        )}

        <button
          type="submit"
          disabled={isBookingMeeting}
          className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl shadow shadow-sky-600/15 transition"
        >
          {isBookingMeeting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Sending request...</>
          ) : (
            "Submit Meeting Request"
          )}
        </button>
      </form>
    </div>
  );
}
