const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//A Chat User should have: 1. Name.   2. Email.    3. password.   4. picture
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, require: [true, 'Please provide email'], match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please provide a valid email address"], unique: true },
    password: { type: String, required: true, trim: true },
    picture: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1GL8Mz5XG-_9NZ77L0xQzDdiYIBqXgfOUM4pJUnKWww&s', trim: true },
}, { timestamps: true })


// encrypting the password
userSchema.pre('save', async function(next) {
    if (!this.isModified) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// matching passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)