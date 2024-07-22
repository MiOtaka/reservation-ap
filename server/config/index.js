if(process.env.NODE_ENV === 'production') {
    model.exports = require('./prod')
} else {
    model.exports = require('./dev')
}