const express = require('express')
const { accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup, deleteGroup } = require('../controllers/chatController')

const authMidware = require('../middleware/authMidware')

const router = express.Router()

router.route('/').post(authMidware, accessChat) // this creates the chat if it does not already exist.
router.route('/').get(authMidware, fetchChat)
router.route('/group').post(authMidware, createGroupChat)
router.route('/rename').put(authMidware, renameGroup)
router.route('/delete').delete(authMidware, deleteGroup)
router.route('/groupadd').put(authMidware, addToGroup)
router.route('/groupremove').put(authMidware, removeFromGroup)




module.exports = router