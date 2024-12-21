const express = require('express')
const router = express.Router()
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực

// controller locations
const locationController = require(__path_controllers + 'location.controller')

// USER
// get All
router.get('/list-all', locationController.getAll)

// ADMIN
// findById/:id service
router.get(
  '/admin/findById/:id',
  auth.authenticateJWT,
  locationController.findById
)

module.exports = router
