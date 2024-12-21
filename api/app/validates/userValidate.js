const Joi = require('joi')

// Định nghĩa schema cho đăng ký người dùng
const userSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required({
    'string.min': 'Tên người dùng ít nhất 3 ký tự',
    'string.max': 'Tên người dùng tối đa 30 ký tự',
    'string.required': 'Tên người dùng bắt buộc nhập'
  }),
  fullName: Joi.string().min(3).max(30).required({
    'string.min': 'Tên người dùng ít nhất 3 ký tự',
    'string.max': 'Tên người dùng tối đa 30 ký tự',
    'string.required': 'Tên người dùng bắt buộc nhập'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'string.required': 'Email bắt buộc nhập'
  }),
  password: Joi.string()
    .min(8)
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/)
    .required()
    .messages({
      'string.required': 'Mật khẩu bặt buộc nhập',
      'string.min': 'Mật khẩu ít nhất 8 ký tự',
      'string.pattern.base':
        'Mật khẩu phải có ít nhất một chữ cái hoa và một ký tự đặc biệt'
    })
}).unknown(true)

// Định nghĩa schema cho đăng nhập người dùng
const userSchemaLogin = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'string.required': 'Email bắt buộc nhập'
  }),
  password: Joi.string()
    .min(8)
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/)
    .required()
    .messages({
      'string.required': 'Mật khẩu bặt buộc nhập',
      'string.min': 'Mật khẩu ít nhất 8 ký tự',
      'string.pattern.base':
        'Mật khẩu phải có ít nhất một chữ cái hoa và một ký tự đặc biệt'
    })
}).unknown(true)
// Định nghĩa schema cho update người dùng
const userSchemaUpdate = Joi.object({
  userName: Joi.string().min(3).max(30).required({
    'string.min': 'Tên người dùng ít nhất 3 ký tự',
    'string.max': 'Tên người dùng tối đa 30 ký tự',
    'string.required': 'Tên người dùng bắt buộc nhập'
  }),
  fullName: Joi.string().min(3).max(30).required({
    'string.min': 'Tên người dùng ít nhất 3 ký tự',
    'string.max': 'Tên người dùng tối đa 30 ký tự',
    'string.required': 'Tên người dùng bắt buộc nhập'
  }),
  phoneNumber: Joi.string().min(10).regex(/^\d+$/).messages({
    'string.min': 'Số điện thoại phải có ít nhất 10 chữ số.',
    'string.pattern.base': 'Số điện thoại chỉ được chứa các chữ số.'
  }),
  address: Joi.string()
    .min(5)
    .max(100)
    .regex(/^[a-zA-Z0-9\s,.-]+$/)
    .messages({
      'string.min': 'Địa chỉ phải có ít nhất 5 ký tự.',
      'string.max': 'Địa chỉ không được vượt quá 100 ký tự.',
      'string.pattern.base':
        'Địa chỉ chỉ được chứa chữ cái, số, khoảng trắng và các ký tự như dấu phẩy, dấu chấm, và dấu gạch ngang.'
    })
}).unknown(true)

module.exports = {
  userSchema,
  userSchemaLogin,
  userSchemaUpdate
}
