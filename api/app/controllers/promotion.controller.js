const common = require('./common/message')
const promotionService = require(__path_services + 'promotion.service')
const messages = require(__path_common + 'messageCommon')

const create = async (req, res, next) => {
  try {
    const body = req.body;
    const result = await promotionService.create(body)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const findAll = async (req, res, next) => {
  try {
    const result = await promotionService.findAll()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
const updatePromotion = async (req, res, next) => {
  try {
    const id = req.params.id
    const body = req.body
    const result = await promotionService.updatePromotion(id, body)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const deletePromotion = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await promotionService.deletePromotion(id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
const createPromotionRoom = async (req, res, next) => {
  try {
    const body = req.body
    const result = await promotionService.createPromotionRoom(body)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
const getPromotionRoom = async (req, res, next) => {
  try {
    const roomId = req.params.roomId
    const result = await promotionService.getPromotionRoom(roomId)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const getPromotionHotel = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId
    const result = await promotionService.getPromotionHotel(hotelId)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

module.exports = {
  create,
  findAll,
  updatePromotion,
  deletePromotion,
  createPromotionRoom,
  getPromotionRoom,
  getPromotionHotel
}
