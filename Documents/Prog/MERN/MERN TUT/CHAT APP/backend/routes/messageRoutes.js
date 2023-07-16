const express = require('express')
const authMiddleware = require('../middleware/authMidware')
const { sendMessage, allMessages } = require('../controllers/messageController')

const router = express.Router()

router.route('/').post(authMiddleware, sendMessage)
router.route('/:chatId').get(authMiddleware, allMessages)


module.exports = router