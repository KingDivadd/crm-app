const express = require('express')
const dotenv = require('dotenv')
const color = require('colors')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const notFound = require('./middleware/notFound')
const errorHandlerMidware = require('./middleware/errorHandler')
const cors = require('cors')


const app = express()
dotenv.config()
app.use(express.json())

// routes
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOption))

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// error handler
app.use(errorHandlerMidware)
app.use(notFound)

const PORT = process.env.PORT | 5500
const start = async() => {
    try {
        await connectDB()
        app.listen(PORT, console.log(`App running on port ${PORT}`.cyan.bold))
    } catch (err) {
        console.log(err)
    }
}

start()