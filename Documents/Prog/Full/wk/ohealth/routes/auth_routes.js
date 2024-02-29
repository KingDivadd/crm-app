const express = require('express')
const router = express.Router()
const { signup, login, change_password, gen_code, verify_code } = require('../controllers/auth_controller')

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/gen-code').post(gen_code)
router.route('/verify-code').post(verify_code)
router.route('/change-password').patch(change_password)

module.exports = router