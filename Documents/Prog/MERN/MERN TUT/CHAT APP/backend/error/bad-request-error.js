const { StatusCodes } = require('http-status-codes')
const CustomeAPIError = require('./custom-api-error')

class BadRequestError extends CustomeAPIError {
    constructor(message) {
        super(message)
        this.StatusCodes = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError