const Joi = require('joi')

const personSchema = Joi.object({
    person_id: Joi.string().alphanum().max(100).required(),
    full_name: Joi.string().max(200).required(),
    email: Joi.string().email().required(),
    gender: Joi.string().required(),
    birth_date: Joi.date().iso().max('now').required(),
    contry_code: Joi.number().integer().required(),
    phone: Joi.string(),
    referral_code: Joi.string().alphanum(),

    created_at: Joi.date().required()
})

module.exports = personSchema









// CREATE TABLE chat_user (
//     chat_user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
//     first_name VARCHAR(50) NOT NULL,
//     last_name VARCHAR(50) NOT NULL,
//     email VARCHAR(70) NOT NULL,
//     phone VARCHAR(12) UNIQUE NOT NULL,
//     pic VARCHAR(255),
//     createdAt DATE DEFAULT NOW()::timestamp NOT NULL,
//     updatedAt DATE DEFAULT NOW()::timestamp NOT NULL );

//     chat_id uuid[] references chat(chat_id) ,