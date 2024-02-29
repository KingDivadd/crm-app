const asyncHandler = require('express-async-handler')
const pool = require('../config/db')

const createTodo = asyncHandler(async(req, res) => {
    const { description } = req.body
    if (!description) {
        return res.status(500).json({ err: `Please provide the description` })
    }

    const newTodo = await pool.query("INSERT INTO todo (description, updatedAt, person_id) VALUES($1, NOW()::timestamp, $2) RETURNING *", [description, req.info.person_id.person_id])
    return res.status(200).json({ res: newTodo.rows })
})

const allTodo = asyncHandler(async(req, res) => {
    const allTodo = await pool.query("SELECT * FROM todo WHERE person_id = $1 ORDER BY createdat", [req.info.person_id.person_id])
    return res.status(200).json({ nbHit: allTodo.rows.length, allTodos: allTodo.rows })
})

const getSpecificTodo = asyncHandler(async(req, res) => {
    const { id } = req.params
    const selectedTodo = await pool.query(`SELECT * FROM todo WHERE todo_id = $1`, [id])
    return res.status(200).json({ selectedTodo: selectedTodo.rows })
})

const editTodo = asyncHandler(async(req, res) => {
    const { id, newDesc } = req.body

    if (!id) {
        return res.status(500).json({ err: `Please provide the todo id` })
    }
    if (!newDesc) {
        const selectedTodo = await pool.query(`SELECT * FROM todo WHERE ${id} = todo_id`)
        return res.status(200).json({ msg: `No changes was made`, selectedTodo: selectedTodo.rows })
    }
    const updateTodo = await pool.query(`UPDATE todo SET description = '${newDesc}' WHERE todo_id = ${id}`)
    const newTodo = await pool.query(`SELECT * FROM todo WHERE todo_id = ${id}`)
    return res.status(200).json({ msg: `Table updated successfully`, updatedTodo: newTodo.rows })
})

const deleteTodo = asyncHandler(async(req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(500).json({ err: 'Please provide todo id to be deleted' })
    }
    const deleteTodo = await pool.query(`DELETE FROM todo WHERE todo_id = ${id}`)
    const updatedTodo = await pool.query(`SELECT * FROM todo ORDER BY todo_id`)

    return res.status(200).json({ msg: `Todo Deleted successfully`, nbHit: updatedTodo.rows.length, updatedTodoList: updatedTodo.rows })
})

module.exports = { createTodo, allTodo, getSpecificTodo, editTodo, deleteTodo }