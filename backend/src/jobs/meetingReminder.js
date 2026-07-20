const Meeting = require('../models/Meeting');
const { notifyMeetingEvent } = require('../utils/notify');

const CHECK_INTERVAL_MS = 60 * 1000; // every 1 minute
const REMINDER_WINDOW_MINUTES = 16; // Check meetings starting in the next 16 minutes

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

    // Find any meeting that might need any of the 3 reminders
    const candidates = await Meeting.find({ 
      status: 'Approved',
      $or: [
        { reminder15Sent: false },
        { reminder10Sent: false },
        { reminder5Sent: false }
      ]
    });
    
    for (const meeting of candidates) {
      const start = computeStartDate(meeting);
      
      // Only process meetings that are in the future but within our 16m window
      if (start >= now && start <= windowEnd) {
        // Calculate difference in minutes
        const diffMs = start.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        let shouldSave = false;

        // 15 minute reminder (send when <= 15 and > 10)
        if (diffMins <= 15 && diffMins > 10 && !meeting.reminder15Sent) {
          await notifyMeetingEvent('meeting_reminder_15', meeting);
          meeting.reminder15Sent = true;
          shouldSave = true;
        }
        
        // 10 minute reminder (send when <= 10 and > 5)
        if (diffMins <= 10 && diffMins > 5 && !meeting.reminder10Sent) {
          await notifyMeetingEvent('meeting_reminder_10', meeting);
          meeting.reminder10Sent = true;
          shouldSave = true;
        }

        // 5 minute reminder (send when <= 5)
        if (diffMins <= 5 && !meeting.reminder5Sent) {
          await notifyMeetingEvent('meeting_reminder_5', meeting);
          meeting.reminder5Sent = true;
          shouldSave = true;
        }

        if (shouldSave) {
          await meeting.save();
        }
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
