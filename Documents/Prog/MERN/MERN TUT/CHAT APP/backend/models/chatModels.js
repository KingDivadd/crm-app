const mongoose = require('mongoose')


// The chat sould have 1. The users. 2. Last Message. 3. isGroupChat. 4.groupAdmin. 5. isGroupChat
const chatSchema = mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: mongoose.Types.ObjectId, ref: 'Message' },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // chatPicture: {type: String, enum: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1GL8Mz5XG-_9NZ77L0xQzDdiYIBqXgfOUM4pJUnKWww&s', "groupProfilePics"]} // this picture should be the picture of a chat

}, { timestamps: true })



module.exports = mongoose.model('Chat', chatSchema)