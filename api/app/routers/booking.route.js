const express = require('express')
const router = express.Router()
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực

// controller booking
const bookingController = require(__path_controllers + 'booking.controller')

// get booking information
router.get(
  '/getall/',
  auth.authenticateJWT,
  auth.role('Admin'),
  bookingController.getAll
)

router.get(
  '/getBookingByHotelId/:id',
  auth.authenticateJWT,
  auth.role('Host'),
  bookingController.getBookingByHotelId
)

router.get('/getBookingByUserID/:id', bookingController.getBookingByUserID)

router.post('/createboking',auth.authenticateJWT, bookingController.create)
router.post('/cancelboking/:id', bookingController.cancel)

router.get(
  '/count/',
  auth.authenticateJWT,
  auth.role('Admin'),
  bookingController.countBooking
)

router.get(
  '/getIncome/',
  auth.authenticateJWT,
  auth.role('Admin'),
  bookingController.getIncome
)

router.get("/cancelBooking/:id", auth.authenticateJWT,bookingController.cancelBooking);
router.get("/checkedInBooking/:id", auth.authenticateJWT,bookingController.checkedInBooking);
router.get("/checkedOutBooking/:id", auth.authenticateJWT,bookingController.checkedOutBooking);
router.post("/getIncomeAll", auth.authenticateJWT, bookingController.getIncomeAll);
module.exports = router
