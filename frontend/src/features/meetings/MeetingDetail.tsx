import { useEffect, useState } from 'react';
import { Calendar, Clock, Globe, User, Phone, Mail, Video, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';
import { meetingApi } from '../../services/meetingApi';
import { adminApi } from '../../services/adminApi';
import type { Meeting } from '../../types';

export function MeetingDetail() {
  const { setActivePage, session } = useAppStore();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const storedMeeting = useAppStore(s => s.selectedMeeting);
  const meetingId = storedMeeting?._id || sessionStorage.getItem('alsm_view_meeting_id');

  useEffect(() => {
    if (!meetingId) { setError('No meeting selected'); setLoading(false); return; }
    (async () => {
      try {
        const isAdmin = session.role === 'ADMIN';
        const data = isAdmin
          ? await adminApi.getMeeting(meetingId)
          : await meetingApi.getById(meetingId);
        setMeeting(data.meeting);
      } catch {
        setError('Failed to load meeting details');
      } finally { setLoading(false); }
    })();
  }, [meetingId]);

  const handleCancel = async () => {
    if (!meeting) return;
    setCancelling(true);
    try {
      const isAdmin = session.role === 'ADMIN';
      const result = isAdmin
        ? await adminApi.cancelMeeting(meeting._id)
        : await meetingApi.cancel(meeting._id);
      setMeeting(result.meeting);
    } catch {} finally { setCancelling(false); }
  };

  const goBack = () => {
    sessionStorage.removeItem('alsm_view_meeting_id');
    setActivePage(session.role === 'ADMIN' ? 'admin-meetings' : 'my-meetings');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 text-sky-500 animate-spin" /></div>;
  if (error || !meeting) return <div className="min-h-screen flex flex-col items-center justify-center gap-3"><p className="text-slate-500">{error || 'Meeting not found'}</p><button onClick={goBack} className="text-sky-600 font-semibold text-sm">Go back</button></div>;

  const statusColors: Record<string, string> = { Pending: 'bg-amber-100 text-amber-700', Approved: 'bg-emerald-100 text-emerald-700', Rejected: 'bg-rose-100 text-rose-700', Cancelled: 'bg-slate-100 text-slate-700', Completed: 'bg-sky-100 text-sky-700' };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12" id="meeting-detail-page">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={goBack} className="text-slate-400 hover:text-slate-700 transition cursor-pointer"><ArrowLeft className="h-5 w-5" /></button>
          <h2 className="font-display text-xl font-extrabold text-slate-900">Meeting Details</h2>
          <span className={"text-xs font-bold px-2.5 py-1 rounded-full " + statusColors[meeting.status]}>{meeting.status}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-4">{meeting.topic}</h3>

        <div className="space-y-3 mb-6">
          <Detail icon={<Calendar className="h-4 w-4" />} label="Date" value={new Date(meeting.preferredDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
          <Detail icon={<Clock className="h-4 w-4" />} label="Time" value={meeting.preferredTime + ' (' + meeting.duration + ' min)'} />
          <Detail icon={<Globe className="h-4 w-4" />} label="Timezone" value={meeting.timeZone} />
          {meeting.fullName && <Detail icon={<User className="h-4 w-4" />} label="Requester" value={meeting.fullName} />}
          {meeting.email && <Detail icon={<Mail className="h-4 w-4" />} label="Email" value={meeting.email} />}
          {meeting.phone && <Detail icon={<Phone className="h-4 w-4" />} label="Phone" value={meeting.phone} />}
          {meeting.description && <div className="pt-2 border-t border-slate-100"><p className="text-xs text-slate-400 font-bold mb-1">Description</p><p className="text-sm text-slate-600">{meeting.description}</p></div>}
          {meeting.rejectionReason && <div className="pt-2 border-t border-red-100"><p className="text-xs text-red-400 font-bold mb-1">Rejection Reason</p><p className="text-sm text-red-600">{meeting.rejectionReason}</p></div>}
        </div>

        {meeting.meetingLink && (
          <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="mb-4 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm"><Video className="h-4 w-4" /> Join Google Meet</a>
        )}

        {['Pending', 'Approved'].includes(meeting.status) && (
          <button disabled={cancelling} onClick={handleCancel} className="w-full text-xs text-red-500 hover:text-red-700 font-semibold py-2 disabled:opacity-50 cursor-pointer">
            {cancelling ? 'Cancelling...' : 'Cancel Meeting'}
          </button>
        )}
      </motion.div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-slate-400">{icon}</span>
      <div><p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p><p className="text-sm text-slate-700">{value}</p></div>
    </div>
  );
}