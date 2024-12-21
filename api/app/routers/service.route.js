const express = require('express')
const router = express.Router()
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực

// controller service
const serviceController = require(__path_controllers + 'service.controller')

// USER
// Xem danh dịch vụ
router.get('/list-all', serviceController.getAll)
router.get('/findByHotelId/:id', serviceController.findByHotelId)

router.post(
  '/create',
  auth.authenticateJWT,
  auth.role('Admin'),
  serviceController.create
)
router.get(
  '/remove/:id',
  auth.authenticateJWT,
  auth.role('Admin'),
  serviceController.remove
)

// ADD: Route to update a service
router.put(
  '/update/:id',
  auth.authenticateJWT,
  auth.role('Admin'),
  serviceController.update
)

module.exports = router
