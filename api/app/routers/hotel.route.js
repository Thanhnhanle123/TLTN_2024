const express = require('express')
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực
const router = express.Router()
const validateRequest = require(__path_validates + 'validate')
const { uploadImage } = require(__path_middlewares + 'uploads') // middleware upload
const { copyImage } = require(__path_utils + 'copy') // middleware upload

const { hotelSchemaRegister, hotelSchemaUpdate } = require(__path_validates +
  'hotelValidate')

// controller hotel
const hotelController = require(__path_controllers + 'hotel.controller')

// Xem danh sách khách sạn
router.get(
  '/count',
  auth.authenticateJWT,
  auth.role('Admin'),
  hotelController.countHotel
)

router.get('/list-all', hotelController.getAll)

// Tìm kiếm khách sạn
router.get('/find', hotelController.find)

// Đăng ký khách sạn
router.post(
  '/register',
  auth.authenticateJWT,
  uploadImage.array('images', 1),
  copyImage,
  validateRequest(hotelSchemaRegister),
  hotelController.register
)

// Update khách sạn
router.put(
  '/update/:id',
  auth.authenticateJWT,
  uploadImage.array('images', 1),
  copyImage,
  validateRequest(hotelSchemaUpdate),
  hotelController.update
)

// Tìm kiếm khách sạn
router.get('/findById/:id', hotelController.findById)
router.get("/getIncomeById/:id", hotelController.getIncomeById);
router.get(
  '/getHotelByUserId/:id',
  auth.authenticateJWT,
  auth.role('Host'),
  hotelController.getHotelByUserId
)

module.exports = router
