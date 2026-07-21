const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const meetingController = require('../controllers/meetingController');

const router = express.Router();

router.use(protect);

router.post('/', meetingController.createMeeting);
router.get('/my', meetingController.getMyMeetings);
router.get('/:id', meetingController.getMeetingById);
router.patch('/:id/cancel', meetingController.cancelMyMeeting);

module.exports = router;
