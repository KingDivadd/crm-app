const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const asyncHandler = require('express-async-handler')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const sendEmail = require('./email_controller')
const gen_token = require('../config/generate_token')


// code generation
function uniqueCode() {
    const characters = '0123456789';
    let randomString = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

const validate_new_user = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const signup = asyncHandler(async(req, res) => {
    const { first_name, last_name, email, password, } = req.body

    const { error: validation_error } = validate_new_user.validate(req.body)

    if (validation_error) {
        const error_message = validation_error.message.replace(/"/g, '');
        return res.status(400).json({ err: error_message });
    }

    try {
        const user_exist = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
        if (user_exist) {
            return res.status(500).json({ err: `${email} is already registered into another user` })
        }

        const new_user = await prisma.users.create({
            data: {
                first_name: first_name,
                last_name: last_name,
                email: email
            }
        })
        if (!new_user) {
            return res.status(500).json({ err: 'something went wrong.' })
        }

        const salt = await bcrypt.genSalt(10)
        const encrypted_password = await bcrypt.hash(password, salt)

        const new_auth = await prisma.auth.create({
            data: {
                unique_code: uniqueCode(),
                password: encrypted_password,
                user: {
                    connect: {
                        user_id: new_user.user_id
                    }
                },
            }
        })

        sendEmail("Account Creation", { last_name: last_name, first_name: first_name, info: "Welcome to OHealth. Accessing vip medical services with just a click of a button.", code: '' }, email)

        return res.status(200).json({ user: new_user, token: gen_token({ user_id: new_user.user_id, }) })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: 'Internal server error' })
    }

})

const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    if (!email) { return res.status(500).json({ err: 'Please enter your correct email address.' }) }
    if (!password) { return res.status(500).json({ err: 'Please enter your password' }) }

    try {
        const user_exist = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
        if (!user_exist) {
            return res.status(404).json({ err: "Incorrect email, check email and try again" })
        }

        const auth = await prisma.auth.findUnique({
            where: {
                user_id: user_exist.user_id
            }
        })
        if (!auth) {
            return res.status(404).json({ err: 'user auth not found.' })
        }

        const encrypted_password = auth.password
        const match_password = await bcrypt.compare(password, encrypted_password)
        if (!match_password) {
            return res.status(401).json({ err: `Incorrect password, correct password and try again.` })
        }
        return res.status(200).json({ logged_in_user: user_exist })
    } catch (err) {
        return res.status(500).json({ err: "error, something went wrong." })
    }
})

const gen_code = asyncHandler(async(req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(404).json({ err: 'Please provide your correct email address' })
    }
    try {
        const user_exist = await prisma.users.findUnique({
            where: { email: email }
        })
        if (!user_exist) {
            return res.status(404).json({ err: `User not found` })
        }
        const user_auth = await prisma.auth.findUnique({
            where: { user_id: user_exist.user_id }
        })
        if (!user_auth) { return res.status(404).json({ err: `user auth not found` }) }
        const new_code = uniqueCode()
        await prisma.auth.update({
            where: { user_id: user_exist.user_id },
            data: { unique_code: new_code }
        })

        //  will have to integrate mailing system here


        return res.status(200).json({ code: new_code })
    } catch (error) {
        return res.status(500).json({ err: "error, something went wrong." })
    }
})

const verify_code = asyncHandler(async(req, res) => {
    const { email, unique_code } = req.body
    if (!email || email.trim() === '') {
        return res.status(404).json({ err: 'Please enter the code sent to your email' })
    }
    if (!unique_code || unique_code.trim() === '') {
        return res.status(404).json({ err: 'Please enter the code sent to your email' })
    }
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).json({ err: `${email} is not a registered email address` })
        }
        const verify = await prisma.auth.findUnique({
            where: {
                user_id: user.user_id,
                unique_code: unique_code
            }
        })
        if (!verify) {
            return res.status(500).json({ err: 'Incorrect code provided.' })
        }
        return res.status(200).json({ msg: 'Verification successful' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: 'Internal server error' })
    }

})

const change_password = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    if (!email) {
        return res.status(500).json({ err: 'Please provie your email address' })
    }
    if (!password) {
        return res.status(500).json({ err: 'Invalid password' })
    }
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).json({ err: `${email} is not a registered email address` })
        }

        const salt = await bcrypt.genSalt(10)
        const encrypted_password = await bcrypt.hash(password, salt)

        const new_password = await prisma.auth.update({
            where: {
                user_id: user.user_id
            },
            data: {
                password: encrypted_password
            }
        })
        return res.status(200).json({ msg: 'Password changed successfully' })
    } catch (err) {
        return res.status(500).json({ err: 'Internal server error' })
    }
})



module.exports = { signup, login, gen_code, verify_code, change_password }