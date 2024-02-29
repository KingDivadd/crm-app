const express = require('express')
const app = express()
const cors = require('cors')
require('colors')
require('dotenv').config()
const todoRoutes = require('./routes/todo-routes')
const authRoutes = require('./routes/auth-routes')
const userRoutes = require('./routes/person-routes')

app.use(express.json())
app.use(cors())

// ROUTES
app.use('/api/todo', todoRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/person', userRoutes)

const start = async() => {
    const PORT = process.env.SERVER_PORT || 6000;
    try {
        app.listen(PORT, console.log(`App started and running on port ${PORT}`.yellow.bold))
    } catch (err) {
        console.log(`Something went wrong`.red.bold)
    }
}

start()