const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../error')
const { StatusCodes } = require("http-status-codes")

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1]
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const { id, name, email } = decode
            req.fish = { id, name, email }
            next()
        } catch (err) {
            // throw new UnauthenticatedError("No authorization to access route")
            res.status(StatusCodes.UNAUTHORIZED).send({ msg: "No authorization to access this route`" })
        }
    } else {
        // throw new Error("No token provided")
        res.status(StatusCodes.UNAUTHORIZED).send({ msg: "No token provided" })
    }
}


module.exports = authMiddleware