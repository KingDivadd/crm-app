const jwt = require('jsonwebtoken')


const decodeToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1]
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const { person_id, last_name, first_name, email } = decode
            req.info = { person_id, last_name, first_name, email }
            next()
        } catch (err) {
            return res.status(401).json({ err: `You're not authorized to access this route` })
        }

    } else {
        return res.status(500).json({ err: `No token provided` })
    }
}

module.exports = decodeToken