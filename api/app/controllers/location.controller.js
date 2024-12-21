const common = require('./common/message')
const locationService = require(__path_services + 'location.service')
const messages = require(__path_common + 'messageCommon')

// function use list location
const getAll = async (req, res, next) => {
  try {
    // Gọi hàm location trong service và xử lý kết quả
    const result = await locationService.getAll()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
const findById = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await locationService.findById(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

module.exports = {
  getAll,
  findById
}
