const mongoose = require('mongoose')

// Each message should have 1. The sender. 2. The chat(where the message is being sent). 3. the Content
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
}, { timestamps: true })


module.exports = mongoose.model('Message', messageSchema)