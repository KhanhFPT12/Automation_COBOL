const Meeting = require('../models/Meeting');

const REQUIRED_FIELDS = [
  'fullName',
  'email',
  'phone',
  'topic',
  'preferredDate',
  'preferredTime',
  'timeZone',
  'duration',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_DURATIONS = [30, 60, 90];

function validatePayload(body) {
  const missing = REQUIRED_FIELDS.filter((f) => !body[f] && body[f] !== 0);
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}.`;
  }
  if (!EMAIL_REGEX.test(body.email)) {
    return 'Please provide a valid email address.';
  }
  const duration = Number(body.duration);
  if (!ALLOWED_DURATIONS.includes(duration)) {
    return 'Meeting duration must be 30, 60, or 90 minutes.';
  }
  const date = new Date(body.preferredDate);
  if (Number.isNaN(date.getTime())) {
    return 'Please provide a valid preferred date.';
  }
  if (date < new Date(new Date().toDateString())) {
    return 'Preferred date cannot be in the past.';
  }
  if (!/^\d{2}:\d{2}$/.test(body.preferredTime)) {
    return 'Please provide preferred time in HH:mm format.';
  }
  return null;
}

// ────────────────────────────────────────────────────────────────
// @desc    Create a meeting request
// @route   POST /api/meetings
// @access  Private
// ────────────────────────────────────────────────────────────────
exports.createMeeting = async (req, res) => {
  try {
    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const {
      fullName, companyName, email, phone,
      topic, description, preferredDate, preferredTime, timeZone, duration,
    } = req.body;

    const meeting = await Meeting.create({
      user: req.user._id,
      fullName: fullName.trim(),
      companyName: companyName ? companyName.trim() : '',
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      topic: topic.trim(),
      description: description ? description.trim() : '',
      preferredDate: new Date(preferredDate),
      preferredTime,
      timeZone,
      duration: Number(duration),
      status: 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Yêu cầu đặt lịch đã được gửi và đang chờ Admin phê duyệt.',
      meeting,
    });
  } catch (err) {
    console.error('createMeeting error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    List the current user's meetings
// @route   GET /api/meetings/my
// @access  Private
// ────────────────────────────────────────────────────────────────
exports.getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, meetings });
  } catch (err) {
    console.error('getMyMeetings error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Get one of the current user's meetings by id
// @route   GET /api/meetings/:id
// @access  Private
// ────────────────────────────────────────────────────────────────
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id });
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }
    return res.status(200).json({ success: true, meeting });
  } catch (err) {
    console.error('getMeetingById error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Cancel one of the current user's own meetings
// @route   PATCH /api/meetings/:id/cancel
// @access  Private
// ────────────────────────────────────────────────────────────────
exports.cancelMyMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, user: req.user._id });
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
    return res.status(200).json({ success: true, message: 'Meeting cancelled.', meeting });
  } catch (err) {
    console.error('cancelMyMeeting error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
