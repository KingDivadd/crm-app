const jwt = require('jsonwebtoken')


const gen_token = (user_id, email) => {
    return jwt.sign({ user_id, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

module.exports = gen_token