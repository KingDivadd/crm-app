const express = require('express')
const router = express.Router()
const { createTodo, allTodo, getSpecificTodo, editTodo, deleteTodo } = require('../controllers/todo-controller')
const decodeToken = require('../middleware/auth-middleware')


router.route('/create-todo').post(decodeToken, createTodo)
router.route('/get-all-todo').get(decodeToken, allTodo)
router.route('/get-all-todo/:id').get(decodeToken, getSpecificTodo)
router.route('/edit-todo').patch(decodeToken, editTodo)
router.route('/delete-todo').delete(decodeToken, deleteTodo)

module.exports = router