const Notification = require('../models/Notification');

const TEMPLATES = {
  meeting_approved: (meeting) => ({
    title: 'Meeting approved',
    message: `Your meeting "${meeting.topic}" has been approved. You can join it from My Meetings.`,
  }),
  meeting_rejected: (meeting) => ({
    title: 'Meeting rejected',
    message: `Your meeting "${meeting.topic}" was rejected. Reason: ${meeting.rejectionReason || 'No reason provided'}.`,
  }),
  meeting_cancelled: (meeting) => ({
    title: 'Meeting cancelled',
    message: `Your meeting "${meeting.topic}" has been cancelled.`,
  }),
  meeting_reminder_15: (meeting) => ({
    title: 'Meeting starting in 15 minutes',
    message: `Your meeting "${meeting.topic}" is starting in 15 minutes.`,
  }),
  meeting_reminder_10: (meeting) => ({
    title: 'Meeting starting in 10 minutes',
    message: `Your meeting "${meeting.topic}" is starting in 10 minutes.`,
  }),
  meeting_reminder_5: (meeting) => ({
    title: 'Meeting starting in 5 minutes',
    message: `Your meeting "${meeting.topic}" is starting in 5 minutes!`,
  }),
  meeting_completed: (meeting) => ({
    title: 'Meeting completed',
    message: `Your meeting "${meeting.topic}" has been marked as completed.`,
  }),
};

/** Create a notification for a meeting-status change. Best-effort: never throws. */
async function notifyMeetingEvent(type, meeting) {
  try {
    const build = TEMPLATES[type];
    if (!build) return;
    const { title, message } = build(meeting);
    await Notification.create({
      user: meeting.user,
      type,
      title,
      message,
      meeting: meeting._id,
    });
  } catch (e) {
    console.warn(`Failed to create "${type}" notification:`, e.message);
  }
}

module.exports = { notifyMeetingEvent };
