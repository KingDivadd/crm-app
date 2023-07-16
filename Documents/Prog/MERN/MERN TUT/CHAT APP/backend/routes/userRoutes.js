const express = require('express')
const { registerUser, authUser, getAllUser, getEveryUser } = require('../controllers/userController')
const authMidware = require('../middleware/authMidware')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(authUser)
router.route('/getusers').get(authMidware, getAllUser)
router.route('/').get(getEveryUser)

module.exports = router