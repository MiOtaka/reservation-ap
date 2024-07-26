const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../model/user')



function notAuthorized(res) {
    return res.status(401).send({errors: [{title: 'Not Authorized', detail: 'You need to login!'}]})
}

exports.authMiddleware = function(req, res, next) {
    const token = req.headers.authorization

    if(!token) {
        return notAuthorized(res)
    }

    jwt.verify(token.split(' ')[1], config.SECRET, async function(err, decodedToken) {
        if(err) {
            return res.status(401).send({errors: [{title: 'Not Authorized', detail: 'Invalid Token!'}]})
        }
        
        // User.findById(decodedToken.userId, async function(err, foundUser){
        //     if(err) {
        //         return res.status(401).send({errors: [{title: 'Not Authorized', detail: 'Invalid Token!'}]})
        //     }
        //     if(!foundUser) {
        //         return res.status(401).send({errors: [{title: 'Not Authorized', detail: 'User Not found!'}]})
        //     }
        //     next()
        // })

        try {
            const foundUser = await User.findById(decodedToken.userId)
            if(!foundUser) {
                return res.status(401).send({errors: [{title: 'Not Authorized', detail: 'User Not found!'}]})
            }
             next()
          } catch (err) {
            return res.status(401).send({errors: [{title: 'Not Authorized', detail: 'Invalid Token!'}]})
          }
       
    })

    next()
}