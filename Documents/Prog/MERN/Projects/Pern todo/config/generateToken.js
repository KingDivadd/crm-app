const jwt = require('jsonwebtoken')

const genToken = (person_id, first_name, last_name, email) => {
    return jwt.sign({ person_id, first_name, last_name, email }, process.env.JWT_SECRET, { expiresIn: process.env.LIFETIME })
}


module.exports = genToken