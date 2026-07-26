const Meeting = require('../models/Meeting');
const googleMeetService = require('../services/googleMeetService');
const { notifyMeetingEvent } = require('../utils/notify');
const { sendEmail, buildMeetingApprovedEmail, buildMeetingRejectedEmail } = require('../utils/sendEmail');

function buildLocalDateTimeString(preferredDate, preferredTime) {
  const d = new Date(preferredDate);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${preferredTime}:00`;
}

// Naive local wall-clock start/end (no UTC conversion) - Google Calendar
// interprets `dateTime` + a separate IANA `timeZone` correctly this way.
function computeStartEnd(meeting) {
  const startISO = buildLocalDateTimeString(meeting.preferredDate, meeting.preferredTime);
  const startForMath = new Date(startISO + 'Z');
  const endForMath = new Date(startForMath.getTime() + meeting.duration * 60000);
  const endISO = endForMath.toISOString().slice(0, 19);
  return { startISO, endISO };
}

// ────────────────────────────────────────────────────────────────
// @desc    List all meeting requests (search + status filter + pagination)
// @route   GET /api/admin/meetings
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.listMeetings = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ fullName: re }, { companyName: re }, { email: re }, { topic: re }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [meetings, total] = await Promise.all([
      Meeting.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Meeting.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      meetings,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('listMeetings error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Get one meeting's full detail
// @route   GET /api/admin/meetings/:id
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('user', 'fullName email businessEmail companyName');
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }
    return res.status(200).json({ success: true, meeting });
  } catch (err) {
    console.error('getMeeting error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Approve a meeting - auto-creates a Google Meet link
// @route   PATCH /api/admin/meetings/:id/approve
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.approveMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }
    if (meeting.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Only a Pending meeting can be approved (current status: ${meeting.status}).`,
      });
    }

    // Optional overrides confirmed by the admin in the Approve dialog.
    const { topic, description, preferredDate, preferredTime, duration } = req.body || {};
    if (topic) meeting.topic = topic;
    if (description !== undefined) meeting.description = description;
    if (preferredDate) meeting.preferredDate = new Date(preferredDate);
    if (preferredTime) meeting.preferredTime = preferredTime;
    if (duration) meeting.duration = Number(duration);

    const { startISO, endISO } = computeStartEnd(meeting);

    const { eventId, meetLink } = await googleMeetService.createMeetEvent({
      summary: meeting.topic,
      description: meeting.description,
      startISO,
      endISO,
      timeZone: meeting.timeZone,
      attendeeEmail: meeting.email,
    });

    meeting.status = 'Approved';
    meeting.googleEventId = eventId;
    meeting.meetingLink = meetLink;
    meeting.approvedBy = req.user._id;
    meeting.approvedAt = new Date();
    if (req.body.adminNotes !== undefined) {
      meeting.adminNotes = req.body.adminNotes;
    }
    await meeting.save();

    await notifyMeetingEvent('meeting_approved', meeting);

    try {
      await sendEmail({
        to: meeting.email,
        subject: 'ALSM – Your Meeting Has Been Approved',
        html: buildMeetingApprovedEmail({
          userName: meeting.fullName,
          topic: meeting.topic,
          date: new Date(meeting.preferredDate).toLocaleDateString(),
          time: meeting.preferredTime,
          meetLink: meeting.meetingLink,
          adminNotes: meeting.adminNotes || '',
        }),
      });
    } catch (emailErr) {
      console.error('Approval email failed (meeting still approved):', emailErr.message);
    }

    return res.status(200).json({ success: true, message: 'Meeting approved.', meeting });
  } catch (err) {
    console.error('approveMeeting error:', err.message);
    const isGoogleError =
      err.code === 'GOOGLE_NOT_CONNECTED' ||
      err.code === 'GOOGLE_NOT_CONFIGURED' ||
      err.message?.includes('unauthorized_client') ||
      err.message?.includes('invalid_grant');

    const status = isGoogleError ? 409 : 500;
    const message = isGoogleError
      ? 'Tài khoản Google Calendar chưa được kết nối hoặc đã hết hạn (unauthorized_client). Vui lòng vào Admin > Settings để kết nối lại Google Calendar.'
      : err.message || 'Server error. Please try again.';

    return res.status(status).json({ success: false, message });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Reject a meeting (reason required)
// @route   PATCH /api/admin/meetings/:id/reject
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.rejectMeeting = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'A rejection reason is required.' });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }
    if (meeting.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Only a Pending meeting can be rejected (current status: ${meeting.status}).`,
      });
    }

    meeting.status = 'Rejected';
    meeting.rejectionReason = reason.trim();
    await meeting.save();

    await notifyMeetingEvent('meeting_rejected', meeting);

    try {
      await sendEmail({
        to: meeting.email,
        subject: 'ALSM – Your Meeting Request Has Been Declined',
        html: buildMeetingRejectedEmail({
          userName: meeting.fullName,
          topic: meeting.topic,
          reason: meeting.rejectionReason,
        }),
      });
    } catch (emailErr) {
      console.error('Rejection email failed (meeting still rejected):', emailErr.message);
    }

    return res.status(200).json({ success: true, message: 'Meeting rejected.', meeting });
  } catch (err) {
    console.error('rejectMeeting error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Cancel a meeting (admin side)
// @route   PATCH /api/admin/meetings/:id/cancel
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }
    if (!['Pending', 'Approved'].includes(meeting.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a meeting with status "${meeting.status}".`,
      });
    }

    meeting.status = 'Cancelled';
    await meeting.save();

    await notifyMeetingEvent('meeting_cancelled', meeting);

    return res.status(200).json({ success: true, message: 'Meeting cancelled.', meeting });
  } catch (err) {
    console.error('cancelMeeting error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Mark a meeting as completed
// @route   PATCH /api/admin/meetings/:id/complete
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.completeMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }
    if (meeting.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: `Only an Approved meeting can be marked completed (current status: ${meeting.status}).`,
      });
    }

    meeting.status = 'Completed';
    await meeting.save();

    await notifyMeetingEvent('meeting_completed', meeting);

    return res.status(200).json({ success: true, message: 'Meeting marked as completed.', meeting });
  } catch (err) {
    console.error('completeMeeting error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Get count of pending meetings (for sidebar badge)
// @route   GET /api/admin/meetings/pending-count
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.getPendingCount = async (req, res) => {
  try {
    const count = await Meeting.countDocuments({ status: 'Pending' });
    return res.status(200).json({ success: true, count });
  } catch (err) {
    console.error('getPendingCount error:', err.message);
    return res.status(500).json({ success: false, count: 0 });
  }
};
