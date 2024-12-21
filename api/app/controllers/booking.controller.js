require('dotenv').config()
const common = require('./common/message')
const bookingService = require(__path_services + 'booking.service')
const messages = require(__path_common + 'messageCommon')

// booking.controller.js
const getAll = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await bookingService.getAll()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
// booking.controller.js
const getBookingByHotelId = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await bookingService.getBookingByHotelId(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const getBookingByUserID = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await bookingService.getBookingByUserID(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const cancelBooking = async (req, res, next) => {
  try {
    const result = await bookingService.cancelBooking(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
const checkedInBooking = async (req, res, next) => {
  try {
    const result = await bookingService.checkedInBooking(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
const checkedOutBooking = async (req, res, next) => {
  try {
    const result = await bookingService.checkedOutBooking(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
// booking.controller.js
const countBooking = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await bookingService.countBooking()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

// booking.controller.js
const getIncome = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await bookingService.getIncome()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const create = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await bookingService.create(req.user.sub, req.body)
    return common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const cancel = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await bookingService.create(req.body)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const getIncomeAll = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const hotelId = req.body.hotelId
    const year = req.body.year
    const month = req.body.month
    const result = await bookingService.getIncomeAll(hotelId, year, month)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

module.exports = {
  getAll,
  getBookingByUserID,
  getBookingByHotelId,
  countBooking,
  getIncome,
  create,
  cancel,
  cancelBooking,
  checkedInBooking,
  checkedOutBooking,
  getIncomeAll
}
