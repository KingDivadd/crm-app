const express = require('express')
const router = express.Router()

const { allUsers } = require('../controllers/person-controller')

router.route('/all-users').get(allUsers)

module.exports = router