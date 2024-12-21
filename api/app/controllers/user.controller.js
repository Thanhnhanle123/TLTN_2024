require('dotenv').config()
const common = require('./common/message')
const userService = require(__path_services + 'user.service')
const messages = require(__path_common + 'messageCommon')

// function use create user
const register = async (req, res, next) => {
  try {
    // Gọi hàm user trong service và xử lý kết quả
    const result = await userService.register(req.body)

    if (result.status == 201) {
      delete result.data['password']
      const { emailRegistrationConfirmation } = require(__path_middlewares +
        'sendMail')
      emailRegistrationConfirmation(
        result.data.email,
        'Email Verification',
        `Please verify your email by clicking the link:
          http://localhost:3000/api/v1/user/verify-email?token=${result.token}`
      )
      result.data = { ...result.data, token: result.token } // Đặt token vào body nếu tạo mới user thành công
    }
    common.message(res, result.status, result.message, result.data) // Trả về thông tin user
  } catch (error) {
    // Trả về phản hồi lỗi
    common.message(res, 500, messages.code500.serverError)
    next(error)
  }
}

// function use create user
const login = async (req, res, next) => {
  try {
    // Gọi hàm user trong service và xử lý kết quả
    const result = await userService.login(req.body)
    if (result.status == 200) {
      delete result.data['password']
      result.data = { ...result.data, token: result.token } // Đặt token vào body nếu tạo mới user thành công
    }
    if (result.data.authentic == 0) {
      return common.message(res, result.status, 'Chưa được xác thực', [])
    }
    common.message(res, result.status, result.message, result.data)
  } catch (error) {
    // Trả về phản hồi lỗi
    common.message(res, 500, messages.code500.serverError)
    next(error)
  }
}

// function use create user
const loginAdmin = async (req, res, next) => {
  try {
    // Gọi hàm user trong service và xử lý kết quả
    const result = await userService.loginAdmin(req.body)
    if (result.status == 200) {
      delete result.data['password']
      result.data = { ...result.data, token: result.token } // Đặt token vào body nếu tạo mới user thành công
    }
    if (result.data.authentic == 0) {
      return common.message(res, result.status, 'Chưa được xác thực', [])
    }
    common.message(res, result.status, result.message, result.data)
  } catch (error) {
    // Trả về phản hồi lỗi
    common.message(res, 500, messages.code500.serverError)
    next(error)
  }
}

// function use update user
const updateInfo = async (req, res, next) => {
  try {
    // Gọi hàm user trong service và xử lý kết quả
    const result = await userService.updateInfo(req.user.sub, req.body)
    common.message(res, result.status, result.message, result.data)
  } catch (error) {
    // Trả về phản hồi lỗi
    common.message(res, 500, messages.code500.serverError)
    next(error)
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    // Gọi hàm user trong service và xử lý kết quả
    req.body.authentic = 1
    const result = await userService.updateInfo(req.user.sub, req.body)
    common.message(
      res,
      result.status,
      result.status == 200 ? 'Xác thực thành công' : 'Xác thực thất bại'
    )
  } catch (error) {
    // Trả về phản hồi lỗi
    common.message(res, 500, messages.code500.serverError)
    next(error)
  }
}

// user.controller.js
const findById = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await userService.findById(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const registerHost = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await userService.registerHost(req.params.id)
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

// user.controller.js
const getAll = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await userService.getAll()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const countUser = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await userService.countUser()
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const loginGoogle = async (req, res, next) => {
  try {
    const payload = req.payload
    const result = await userService.loginGoogle(payload)
    result.data = { ...result.data, token: result.token }
    common.message(res, result.status, result.message, result.data) // Trả về thông tin location
  } catch (error) {
    next(error)
    common.message(res, 500, messages.code500.serverError)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    // Gọi hàm user trong service và xử lý kết quả
    const result = await userService.forgotPassword(email)

    if (result.status == 200) {
      console.log(result.status)
      const { emailResetConfirmation } = require(__path_middlewares +
        'sendMail')
      emailResetConfirmation(
        result.data.email,
        'Yêu cầu thiết lập lại mật khẩu của bạn',
        `http://localhost:3000/api/v1/user/reset-password/${result.token}`
      )
    }
    common.message(res, result.status, result.message, result.data) // Trả về thông tin user
  } catch (error) {
    // Trả về phản hồi lỗi
    common.message(res, 500, messages.code500.serverError)
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token
    const result = await userService.resetPassword(token)
    if (result.status === 200) {
      const uri = 'http://localhost:3002' // URL của trang React
      const redirectUrl = `${uri}/reset-password?token=${token}`
      res.redirect(redirectUrl)
    } else {
      if (result.status == 400) {
        return res.redirect('http://localhost:3002/login')
      }
      // Handle the case where the token is invalid or expired
      common.message(res, result.status, result.message, result.data)
    }
  } catch (error) {
    // Handle unexpected errors
    console.log('error: ' + error)

    // common.message(res, 500, messages.code500.serverError)
    // next(error)
  }
}

const changePasswordForgot = async (req, res, next) => {
  try {
    const token = req.params.token
    const { password } = req.body
    const result = await userService.changePasswordForgot(token, password)
    console.log(result.status)
    if (result.status == 400) {
      return res.redirect('http://localhost:3002/login')
    }
    common.message(res, result.status, result.message, result.data)
  } catch (error) {
    // Trả về phản hồi lỗi
    common.message(res, 500, messages.code500.serverError)
    next(error)
  }
}

module.exports = {
  register,
  login,
  loginAdmin,
  updateInfo,
  verifyEmail,
  findById,
  getAll,
  registerHost,
  countUser,
  loginGoogle,
  forgotPassword,
  resetPassword,
  changePasswordForgot
}
