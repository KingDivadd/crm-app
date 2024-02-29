const express = require('express')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const http = require('http')
const cors = require('cors')
require('colors')
require('dotenv').config()
const userRoutes = require('./routes/user_routes')
const authRoutes = require('./routes/auth_routes')

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
    }
})

// ROUTES
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

const start = async() => {
    const server_port = process.env.SERVER_PORT || 6000
    try {
        app.listen(server_port, console.log(`OHealth server started and running on port ${server_port}`.yellow.bold))
    } catch (err) {
        console.log(`something went wrong`.red.bold)
    }
}

start()