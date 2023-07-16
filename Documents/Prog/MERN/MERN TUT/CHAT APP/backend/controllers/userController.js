const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnAuthoriztion } = require('../error')
const generateToken = require('../config/generateToken')


const registerUser = asyncHandler(async(req, res) => {
    const user = await User.create(req.body)
    res.status(StatusCodes.CREATED).json({ user: { nam: user.name, username: user.username, email: user.email, picture: user.picture, id: user._id }, token: generateToken(user._id, user.name, user.email) })
})


const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please enter email and password combination')
    }
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.status(StatusCodes.OK).json({ user: { nam: user.name, email: user.email, picture: user.picture, id: user._id }, token: generateToken(user._id, user.email, user.name) })
    } else {
        throw new UnAuthoriztion('Incorrect Email or Password.')
    }
})

const getAllUser = asyncHandler(async(req, res) => {
    const keyword = req.query.search ? {
        $or: [{ name: { $regex: req.query.name, $options: 'i' } }, { email: { $regex: req.query.email, $options: 'i' } }]
    } : {}
    const findUser = await User.find(keyword).find({ _id: { $ne: req.fish.id } })
    res.status(StatusCodes.OK).json({ nbHit: findUser.length, findUser })

})

const getEveryUser = asyncHandler(async(req, res) => {
    const users = await User.find({})
    res.status(StatusCodes.OK).json({ nbHit: users.length, users })
})
module.exports = { registerUser, authUser, getAllUser, getEveryUser }