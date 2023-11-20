const express = require('express')
const router = express.Router()
const { deleteProduct, newProduct, transferProduct, updateProductInfo } = require("../controller/product-controller")
const tokenDecoder = require('../middleware/auth-middleware')

router.route('/new-product').post(tokenDecoder, newProduct)
router.route('/edit-product-info/:id').post(tokenDecoder, updateProductInfo)
router.route('/tranfer-product/:id').post(tokenDecoder, transferProduct)
router.route('/delete-product/:id').post(tokenDecoder, deleteProduct)

module.exports = router