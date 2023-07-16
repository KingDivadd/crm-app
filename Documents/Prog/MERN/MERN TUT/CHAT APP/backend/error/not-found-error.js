const { StatusCodes } = require('http-status-codes')
const CustomeAPIError = require('./custom-api-error')

class NotFoundError extends CustomeAPIError {
    constructor(message) {
        super(message)
        this.StatusCodes = StatusCodes.NOT_FOUND
    }
}

module.exports = NotFoundError