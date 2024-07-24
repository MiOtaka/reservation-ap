const express = require('express')
const router = express.Router()
const User = require('../model/user')
const jwt = require('jsonwebtoken')

router.post('/login', async function(req, res) {
    const { email, password } = req.body

    if(!email) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill email!'}]})
    }
    if(!password) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill passsword!'}]})
    }
    
    foundUser = await User.findOne({email})
    try {
        if(!foundUser){
            return res.status(422).send({errors: [{title: 'User error', detail: 'User is not exist!'}]})
          }
        if(!foundUser.hasSamePassword(password)) {
            return res.status(422).send({errors: [{title: 'User error', detail: 'Incorrect password!'}]})
        }
        const token = jwt.sign({
            userId: foundUser.Id,
            username: foundUser.username
        }, 'config.SECRET', { expiresIn: '1h'})


        return res.json(token)
    } catch(err) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Something went wrong!'}]})
    }
})

router.post('/register', async function(req, res) {
    const { username, email, password, confirmPassword } = req.body

    if(!username) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill username!'}]})
    }
    if(!email) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill email!'}]})
    }
    if(!password) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please fill passsword!'}]})
    }
    if(password !== confirmPassword) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Please check passwords!'}]})
    }   

    foundUser = await User.findOne({email})
    try {
        if(foundUser){
            return res.status(422).send({errors: [{title: 'User error', detail: 'User already exist!'}]})
          }
          const user = new User({username, email, password})
          user.save()
          return res.json({"registerd": true})
    } catch(err) {
        return res.status(422).send({errors: [{title: 'User error', detail: 'Something went wrong!'}]})
    }
})

module.exports = router