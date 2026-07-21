const jwt = require('jsonwebtoken');
const User = require('../models/User');
const googleMeetService = require('../services/googleMeetService');

// ────────────────────────────────────────────────────────────────
// @desc    Return the Google consent URL for the admin to navigate to.
//          Returns JSON (not a redirect) because this is called via
//          fetch/axios with a Bearer header; the frontend then does
//          `window.location.href = url` itself as a separate top-level
//          navigation (which can't carry our Authorization header).
// @route   GET /api/admin/google/connect
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.connect = async (req, res) => {
  try {
    // The OAuth callback below is a plain browser redirect from Google (no
    // Authorization header), so the admin's JWT is smuggled through as the
    // `state` param and re-verified on the way back.
    const state = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const url = googleMeetService.getAuthUrl(state);
    return res.status(200).json({ success: true, url });
  } catch (err) {
    console.error('google connect error:', err.message);
    return res.status(500).json({ success: false, message: `Không thể khởi tạo kết nối Google: ${err.message}` });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    OAuth callback - exchanges the code, persists tokens
// @route   GET /api/admin/google/callback
// @access  Public (state param re-verifies the admin)
// ────────────────────────────────────────────────────────────────
exports.callback = async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) {
      return res.status(400).send(`Google từ chối cấp quyền: ${error}`);
    }
    if (!code || !state) {
      return res.status(400).send('Thiếu code hoặc state từ Google.');
    }

    let decoded;
    try {
      decoded = jwt.verify(state, process.env.JWT_SECRET);
    } catch {
      return res.status(401).send('Phiên xác thực đã hết hạn, vui lòng thử kết nối lại.');
    }

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(403).send('Chỉ tài khoản Admin mới được kết nối Google Calendar.');
    }

    const { connectedEmail } = await googleMeetService.connectFromCode(code, admin._id);

    return res.send(`
      <html><body style="font-family: sans-serif; text-align:center; padding-top: 80px;">
        <h2>Đã kết nối Google Calendar (${connectedEmail || 'unknown'})</h2>
        <p>Bạn có thể đóng tab này và quay lại trang Admin Settings.</p>
      </body></html>
    `);
  } catch (err) {
    console.error('google callback error:', err.message);
    return res.status(500).send(`Kết nối thất bại: ${err.message}`);
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Whether a Google account is currently connected
// @route   GET /api/admin/google/status
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.status = async (req, res) => {
  try {
    const status = await googleMeetService.getStatus();
    return res.status(200).json({ success: true, ...status });
  } catch (err) {
    console.error('google status error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Disconnect the currently connected Google account
// @route   DELETE /api/admin/google
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.disconnect = async (req, res) => {
  try {
    await googleMeetService.disconnect();
    return res.status(200).json({ success: true, message: 'Đã ngắt kết nối Google Calendar.' });
  } catch (err) {
    console.error('google disconnect error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
