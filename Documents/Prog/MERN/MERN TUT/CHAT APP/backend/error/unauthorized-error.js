const { StatusCodes } = require('http-status-codes')
const CustomeAPIError = require('./custom-api-error')

class UnAuthorizationError extends CustomeAPIError {
    constructor(message) {
        super(message)
        this.StatusCodes = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnAuthorizationError