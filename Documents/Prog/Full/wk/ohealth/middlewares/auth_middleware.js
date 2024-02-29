const jwt = require('jsonwebtoken')

const decode_token = async(req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1]
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET)
            decode = { user_id, email }
            req.token = (user_id, email)
            next()
        } catch (err) {
            return res.status(401).json({ err: "Not authorized to access this page." })
        }
    } else {
        return res.status(500).json({ err: 'Please provide access token' })
    }
}

module.exports = decode_token