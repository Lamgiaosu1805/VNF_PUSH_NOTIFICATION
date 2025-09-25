const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const router = express.Router()

router.post('/pushNotification', NotificationController.pushNotification);
router.post('/pushMultiNotification', NotificationController.pushMultiNotification);
router.post('/sendMail', NotificationController.sendMail);

module.exports = router;