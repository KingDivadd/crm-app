const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModels')
const User = require('../models/userModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../error')

// access chat if it exit and create new one if otherwise
const accessChat = asyncHandler(async(req, res) => {
    const { userId } = req.body
    if (!userId) {
        throw new NotFoundError("Please enter field, or check object spelling.")
    }
    // now let us check the db whether we will find any chat with the login and userId ids
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.fish.id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage")
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email picture"
    })
    if (isChat.length > 0) {
        res.status(StatusCodes.OK).json({ msg: "chat already created", chat: isChat[0] })
    } else {
        // If not found create a new one
        const createChat = await Chat.create({
            chatName: "sender",
            isGroupChat: false,
            users: [req.fish.id, userId],
            chatPicture: userId,
        })

        const fetchChat = await Chat.find({ _id: createChat._id })
            .populate("users", "-password")
            // .populate("chatPicture", "chatPicture")
        res.status(StatusCodes.OK).json(fetchChat)
    }
})

// this fetch all the chat associated with the user
const fetchChat = asyncHandler(async(req, res) => {
    const regUser = req.fish.id

    var fetchChat = await Chat.find({ users: { $elemMatch: { $eq: regUser } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("groupAdmin", "-password")
        .sort('updatedAt')
    fetchChat = await User.populate(fetchChat, {
        path: "latestMessage.sender",
        select: "name email picture"
    })

    res.status(StatusCodes.OK).json({ nbHit: fetchChat.length, fetchChat })
})

const createGroupChat = asyncHandler(async(req, res) => {
    if (!req.body.groupName || !req.body.groupMember) {
        throw new BadRequestError("Please enter all fields")
    }
    const groupMembers = req.body.groupMember
    if (groupMembers.length < 1) {
        throw new BadRequestError("You need to have at least a person in your group")
    }
    groupMembers.push(req.fish.id)

    var createGroup = await Chat.create({
        chatName: req.body.groupName,
        isGroupChat: true,
        users: groupMembers,
        groupAdmin: req.fish.id,
    })

    var fetchGroup = await Chat.findOne({ _id: createGroup._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    res.status(StatusCodes.OK).json(fetchGroup)
})

const renameGroup = asyncHandler(async(req, res) => {
    const { chatID, newChatName } = req.body

    const renameGroup = await Chat.findByIdAndUpdate(chatID, { chatName: newChatName }, { new: true, runValidators: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    res.status(StatusCodes.OK).json(renameGroup)

})

const deleteGroup = asyncHandler(async(req, res) => {
    const { chatID } = req.body
    const deleted = await Chat.findByIdAndDelete(chatID)
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!deleted) {
        throw new NotFoundError("chat not found")
    }
    res.status(StatusCodes.OK).json(deleted)
})

// here we need to proved group id and to be added id to populate the group
const addToGroup = asyncHandler(async(req, res) => {
    const { chatID, userID } = req.body

    const added = await Chat.findByIdAndUpdate(chatID, { $push: { users: userID } }, { new: true, runValidators: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!added) {
        throw new NotFoundError("Chat not found")
    }
    res.status(StatusCodes.OK).json(added)
})

const removeFromGroup = asyncHandler(async(req, res) => {
    const { chatID, userID } = req.body

    const removed = await Chat.findByIdAndUpdate(chatID, { $pull: { users: userID } }, { new: true, runValidators: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!removed) {
        throw new NotFoundError("Chat not found")
    }
    res.status(StatusCodes.OK).json(removed)

})

module.exports = { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup, deleteGroup }