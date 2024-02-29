const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const asyncHandler = require('express-async-handler')
const Joi = require('joi')


const gender_enum = ['male', 'female']

const validate_user = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    other_names: Joi.string(),
    gender: Joi.string().valid(gender_enum),
    date_of_birth: Joi.string(),
    avatar: Joi.string(),
    country_code: Joi.string(),
    phone_number: Joi.string(),
    referral_code: Joi.string()
})

const edit_user = asyncHandler(async(req, res) => {
    const { first_name, last_name, other_names, gender, date_of_birth, avatar, country_code, phone_number, referral_code, } = req.body

    const { error: validation_error } = validate_user.validate(req.body)
    if (validate.error) {
        const error_message = validation_error.message.replace(/"/g, '');
        return res.status(400).json({ err: error_message });
    }

    try {
        const user_exist = await prisma.users.findUnique({
            where: {
                user_id: req.token.user_id
            }
        })
        if (!user_exist) {
            return res.status(404).json({ err: 'User not found' })
        }

        const update_user = await prisma.users.update({
            where: {
                user_id: req.token.user_id
            },
            data: req.body
        })
        if (!update_user) {
            return res.status(500).json({ err: 'Profile update failed.' })
        }

        const updated_user = await prisma.users.findUnique({
            where: {
                user_id: req.token.user_id
            }
        })

        return res.status(200).json({ updated_profile: update_user })

    } catch (err) {

    }
})

module.exports = { edit_user };