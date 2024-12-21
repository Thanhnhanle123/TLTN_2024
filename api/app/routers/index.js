var express = require('express')
var router = express.Router()
router.use('/user', require('./user.route'))
router.use('/hotel', require('./hotel.route'))
router.use('/location', require('./location.route'))
router.use('/service', require('./service.route'))
router.use('/comment', require('./comment.route'))
router.use('/booking', require('./booking.route'))
router.use('/room', require('./room.route'))
router.use('/promotion', require('./promotion.route'))

module.exports = router
