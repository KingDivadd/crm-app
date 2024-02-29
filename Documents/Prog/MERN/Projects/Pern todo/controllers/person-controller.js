const asyncHandler = require('express-async-handler')
const pool = require('../config/db')

const allUsers = asyncHandler(async(req, res) => {
    console.log('all users...')
    const all_users = await pool.query("SELECT * FROM person ORDER BY person_id");
    console.log(all_users)
    return res.status(200).json({ users: all_users })
})

module.exports = { allUsers }