const Meeting = require('../models/Meeting');
const { notifyMeetingEvent } = require('../utils/notify');

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes
const REMINDER_WINDOW_MINUTES = 30;

function computeStartDate(meeting) {
  const d = new Date(meeting.preferredDate);
  const [hh, mm] = meeting.preferredTime.split(':').map(Number);
  d.setUTCHours(hh, mm, 0, 0);
  return d;
}

async function checkUpcomingMeetings() {
  try {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MINUTES * 60000);

    const candidates = await Meeting.find({ status: 'Approved', reminderSent: false });
    for (const meeting of candidates) {
      const start = computeStartDate(meeting);
      if (start >= now && start <= windowEnd) {
        await notifyMeetingEvent('meeting_reminder', meeting);
        meeting.reminderSent = true;
        await meeting.save();
      }
    }
  } catch (e) {
    console.warn('meetingReminder job failed:', e.message);
  }
}

/** Starts the background interval; call once at server boot. */
function startMeetingReminderJob() {
  checkUpcomingMeetings();
  setInterval(checkUpcomingMeetings, CHECK_INTERVAL_MS);
}

module.exports = { startMeetingReminderJob };
