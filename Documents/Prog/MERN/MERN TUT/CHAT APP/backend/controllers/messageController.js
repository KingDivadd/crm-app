const asyncHandler = require('express-async-handler')
const { BadRequestError } = require('../error')
const Message = require('../models/messageModel')
const User = require('../models/userModel')
const Chat = require('../models/chatModels')
const { StatusCodes } = require('http-status-codes')


const sendMessage = asyncHandler(async(req, res) => {
    const { content, chatId } = req.body

    if (!content || !chatId) {
        throw new BadRequestError("Please fill in all the fields")
    }

    var message = await Message.create({
        sender: req.fish.id,
        content: content,
        chat: chatId
    })

    message = await message.populate("sender", "name email picture")
    message = await message.populate("chat")
    message = await User.populate(message, {
        path: "chat.users",
        select: "name email picture"
    })

    await Chat.findByIdAndUpdate({ _id: chatId }, { latestMessage: message })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    res.status(StatusCodes.OK).json({ message })
})

const allMessages = asyncHandler(async(req, res) => {

    const allmessages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name picture email")
        .populate("chat")
    res.status(StatusCodes.OK).json({ nbHit: allmessages.length, allmessages })
})

module.exports = { sendMessage, allMessages }