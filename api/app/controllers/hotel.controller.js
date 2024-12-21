const common = require('./common/message')
const hotelService = require(__path_services + 'hotel.service')
const messages = require(__path_common + 'messageCommon')

const countHotel = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await hotelService.countHotel()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

// function use list hotel
const getAll = async (req, res, next) => {
  try {
    // Gọi hàm user trong service và xử lý kết quả
    const result = await hotelService.getAll()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin hotel
  } catch (error) {
    // Trả về phản hồi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const find = async (req, res, next) => {
  try {
    const result = await hotelService.find()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin hotel
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}
// Register hotel
const register = async (req, res, next) => {
  try {
    const data = {
      user_id: req.body.user_id,
      hotel_name: req.body.hotel_name,
      location: req.body.location,
      address: req.body.address,
      rating: req.body.rating,
      services: req.body.services,
      description: req.body.description
    }
    const result = await hotelService.register(
      data,
      req.files.length > 0 ? req.files[0] : null
    )
    common.message(res, result.status, result.message, result.data) // Trả về thông tin hotel đã được đăng ký
  } catch (error) {
    console.error(error);
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

// Update hotel
const update = async (req, res, next) => {
  try {
    const hotelId = req.params.id // Lấy ID của khách sạn từ URL params
    const data = {
      user_id: req.body.user_id,
      hotel_name: req.body.hotel_name,
      location: req.body.location,
      address: req.body.address,
      rating: req.body.rating,
      services: req.body.services,
      description: req.body.description
    }
    const result = await hotelService.update(
      hotelId,
      data,
      req.files.length > 0 ? req.files[0] : null
    ) // Gọi hàm updateHotel với hotelId và dữ liệu từ body
    // Trả về thông tin khách sạn đã được cập nhật
    return common.message(res, result.status, result.message, result.data)
  } catch (error) {
    // Xử lý lỗi và trả về phản hồi lỗi
    next(error) // Gửi lỗi cho middleware tiếp theo để xử lý (nếu có)
    return common.message(res, 500, messages.code500.serverError)
  }
}

const findById = async (req, res, next) => {
  try {
    const result = await hotelService.findById(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin hotel
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const getIncomeById = async (req, res, next) => {
  try {
    const result = await hotelService.getIncomeById(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin hotel
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const getHotelByUserId = async (req, res, next) => {
  try {
    const result = await hotelService.getHotelByUserId(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin hotel
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

module.exports = {
  countHotel,
  getAll,
  find,
  register,
  update,
  findById,
  getHotelByUserId,
  getIncomeById,
};
