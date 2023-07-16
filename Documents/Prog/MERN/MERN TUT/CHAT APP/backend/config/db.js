const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {})
        console.log(`mongoDB connected successfully via port ${conn.connection.host}`.yellow.bold)
    } catch (err) {
        console.log(err)
    }
}


module.exports = connectDB