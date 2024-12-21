const express = require('express')
const router = express.Router()
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực

// controller room
const roomController = require(__path_controllers + 'room.controller')

router.get('/getRoomsByHotelId/:hotel_id', roomController.getRoomsByHotelId)
router.post('/createRoom', auth.authenticateJWT, roomController.createRoom)
router.post('/updateRoom', auth.authenticateJWT, roomController.updateRoom)
router.get('/deleteRoom/:id', auth.authenticateJWT, roomController.deleteRoom)
router.post(
  '/restoreRoom/:id',
  auth.authenticateJWT,
  roomController.restoreRoom
)

module.exports = router
