const express = require('express')
const router = express.Router()
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực
const promotionController = require(__path_controllers + 'promotion.controller')

// 1. API Thêm khuyến mãi
router.post(
  '/promotions',
  auth.authenticateJWT,
  auth.role('Admin'),
  promotionController.create
)

// 2. API Lấy danh sách khuyến mãi
router.get(
  '/promotions',
  auth.authenticateJWT,
  auth.role('Admin'),
  promotionController.findAll
)

// 3. API Cập nhật khuyến mãi
router.put(
  '/promotions/:id',
  auth.authenticateJWT,
  auth.role('Admin'),
  promotionController.updatePromotion
)

// 4. API Xóa khuyến mãi
router.delete(
  '/promotions/:id',
  auth.authenticateJWT,
  auth.role('Admin'),
  promotionController.deletePromotion
)

// 5. API Thêm khuyến mãi cho phòng
router.post(
  '/promotions/room',
  auth.authenticateJWT,
  auth.role('Host'),
  promotionController.createPromotionRoom
)

// 6. API Lấy danh sách khuyến mãi cho một phòng cụ thể trong khách sạn
router.get('/promotions/room/:roomId', promotionController.getPromotionRoom)
// 7. API Lấy danh sách khuyến mãi cho tất cả các phòng trong một khách sạn
router.get('/promotions/hotel/:hotelId', promotionController.getPromotionHotel)

module.exports = router
