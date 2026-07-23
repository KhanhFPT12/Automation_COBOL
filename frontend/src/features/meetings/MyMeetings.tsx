import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Timer, Video, Hourglass, XCircle, CheckCircle2, Ban, Loader2, ArrowLeft, Plus } from 'lucide-react';
import { useAppStore } from '../../store';
import type { Meeting, MeetingStatus } from '../../types';

const STATUS_BADGE: Record<MeetingStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  Completed: 'bg-sky-50 text-sky-700 border-sky-200',
};

function MeetingStatusArea({ meeting }: { meeting: Meeting }) {
  switch (meeting.status) {
    case 'Pending':
      return <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600"><Hourglass className="h-3.5 w-3.5" /> Waiting for Approval</span>;
    case 'Approved':
      return meeting.meetingLink ? (
        <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition"><Video className="h-3.5 w-3.5" /> Join Meeting</a>
      ) : <span className="text-xs font-semibold text-emerald-600">Approved - link pending</span>;
    case 'Rejected':
      return <span className="flex items-start gap-1.5 text-xs text-rose-600 max-w-xs"><XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {meeting.rejectionReason || 'No reason provided.'}</span>;
    case 'Cancelled':
      return <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Ban className="h-3.5 w-3.5" /> Cancelled</span>;
    case 'Completed':
      return <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-600"><CheckCircle2 className="h-3.5 w-3.5" /> Completed</span>;
    default: return null;
  }
}

export function MyMeetings() {
  const { myMeetings, isMeetingsLoading, fetchMyMeetings, cancelMeeting, setActivePage } = useAppStore();

  useEffect(() => { fetchMyMeetings(); }, []);

  const handleViewDetail = (id: string) => {
    sessionStorage.setItem('alsm_view_meeting_id', id);
    setActivePage('meeting-detail');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <button onClick={() => setActivePage('home')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition mb-6 cursor-pointer"><ArrowLeft className="h-4 w-4" /> Back</button>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div><h1 className="text-3xl font-extrabold text-slate-900">My Meetings</h1><p className="text-slate-500 mt-1">Track the status of all your meeting requests.</p></div>
        <button onClick={() => setActivePage('book-meeting')} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"><Plus className="h-4 w-4" /> Book a Meeting</button>
      </div>

      {isMeetingsLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading meetings...</div>
      ) : myMeetings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200"><p className="text-slate-500">You haven't booked any meetings yet.</p></div>
      ) : (
        <div className="space-y-4">
          {myMeetings.map((meeting) => (
            <motion.div key={meeting._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition cursor-pointer" onClick={() => handleViewDetail(meeting._id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-900 truncate">{meeting.topic}</h3>
                    <span className={"shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border " + STATUS_BADGE[meeting.status]}>{meeting.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(meeting.preferredDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {meeting.preferredTime} ({meeting.timeZone})</span>
                    <span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> {meeting.duration} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <MeetingStatusArea meeting={meeting} />
                  {['Pending', 'Approved'].includes(meeting.status) && (
                    <button onClick={(e) => { e.stopPropagation(); cancelMeeting(meeting._id); }} className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition cursor-pointer">Cancel</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
