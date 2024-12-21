require('dotenv').config()
const common = require('./common/message')
const roomService = require(__path_services + 'room.service')
const messages = require(__path_common + 'messageCommon')

// room.controller.js
const getRoomsByHotelId = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await roomService.getRoomsByHotelId(req.params.hotel_id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const deleteRoom = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await roomService.deleteRoom(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
const restoreRoom = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await roomService.restoreRoom(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const createRoom = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await roomService.createRoom(req.body)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const updateRoom = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await roomService.updateRoom(req.body)
    common.message(res, result.status, result.message, result.data)
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

module.exports = {
  getRoomsByHotelId,
  createRoom,
  updateRoom,
  deleteRoom,
  restoreRoom
}
