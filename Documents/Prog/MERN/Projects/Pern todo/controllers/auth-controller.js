const asyncHandler = require('express-async-handler')
const pool = require('../config/db')
const bcrypt = require('bcrypt')
const genToken = require('../config/generateToken')

const signUp = asyncHandler(async(req, res) => {
    // first_name, last_name, email, phone, password, createdAt
    const { first_name, last_name, email, phone, password } = req.body

    if (!first_name || !last_name || !email || !password) {
        return res.status(500).json({ err: `Please fill all fields` })
    }
    // now ensure the email is unique
    const emailExist = await pool.query(`SELECT * FROM person WHERE email = $1`, [email])
    if (emailExist.rows.length) {
        return res.status(500).json({ err: `Email already registered to another user.` })
    }

    const createUser = await pool.query(` INSERT INTO person (first_name, last_name, email, phone, updatedAt) VALUES ($1, $2, $3, $4, NOW()::timestamp) RETURNING *`, [first_name, last_name, email, phone]);

    const personId = createUser.rows[0].person_id;

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const userAuth = await pool.query(`
            INSERT INTO auth (password, unique_code, updatedAt, person_id) 
            VALUES ($1, '0000', NOW()::timestamp, $2) 
            RETURNING *`, [encryptedPassword, personId]);

    return res.status(200).json({ msg: 'User created', user: createUser.rows, token: genToken({ person_id: personId, first_name: first_name, last_name: last_name, email: email }) })
})

const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(500).json({ err: `Please fill all fields` })
    }
    const emailExist = await pool.query(`SELECT *  FROM person WHERE email = $1`, [email])
    if (!emailExist.rows.length) {
        return res.status(500).json({ err: `Incorrect email address, check and try again.` })
    }

    const personId = emailExist.rows[0].person_id
    const auth = await pool.query(`SELECT password FROM auth WHERE person_id = $1`, [personId])
    const encryptedPass = auth.rows[0].password

    const passwordMatch = await bcrypt.compare(password, encryptedPass)
    if (!passwordMatch) {
        return res.status(401).json({ err: `Incorrect password` })
    }

    // it should fetch all todo list 

    const fn = emailExist.rows[0].first_name
    const ln = emailExist.rows[0].last_name
    const em = emailExist.rows[0].email

    return res.status(200).json({ msg: 'Login successful', userInfo: emailExist.rows[0], token: genToken({ person_id: personId, last_name: ln, first_name: fn, email: em }) })
})

module.exports = { signUp, login }