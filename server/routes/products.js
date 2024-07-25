const express = require('express')
const router = express.Router()
const Product = require('../model/product')
const UserCtrl = require('../controllers/user')

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {

    return res.json({"secret": true})
        })



router.get('', async function(req, res) {
foundProducts = await Product.find({})
        res.json(foundProducts)
    })

router.get('/:productId', UserCtrl.authMiddleware, async function(req, res) {
    const productId = req.params.productId
    try {
        foundProducts = await Product.findById(productId)
        res.json(foundProducts)
    } catch(err) {
        return res.status(422).send({errors: [{title: 'Product error', detail: 'Product not found!'}]})
    }
})

module.exports = router