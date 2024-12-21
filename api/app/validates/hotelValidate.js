const Joi = require('joi')

const hotelSchemaRegister = Joi.object({
  hotel_name: Joi.string().required().messages({
    'string.empty': 'Tên khách sạn là bắt buộc',
    'any.required': 'Tên khách sạn là bắt buộc'
  }),
  user_id: Joi.number().integer().required().messages({
    'number.base': 'user id phải là một số nguyên',
    'any.required': 'user id là bắt buộc'
  }),
  location: Joi.number().integer().required().messages({
    'number.base': 'Vị trí phải là một số nguyên',
    'any.required': 'Vị trí là bắt buộc'
  }),
  address: Joi.string().required().messages({
    'string.base': 'Địa chỉ phải là một chuỗi',
    'any.required': 'Địa chỉ là bắt buộc'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Mô tả là bắt buộc',
    'any.required': 'Mô tả là bắt buộc'
  }),
  rating: Joi.number().precision(1).min(0).max(5).optional().messages({
    'number.base': 'Xếp hạng phải là một số',
    'number.min': 'Xếp hạng phải lớn hơn hoặc bằng 0',
    'number.max': 'Xếp hạng phải nhỏ hơn hoặc bằng 5',
    'number.precision': 'Xếp hạng chỉ được có một chữ số thập phân'
  }),
  services: Joi.array()
    .items(Joi.number().integer())
    .optional()
    .allow(null)
    .messages({
      'array.base': 'Services phải là một mảng',
      'array.items': 'Mỗi dịch vụ phải là số nguyên',
      'any.allowOnly': 'Services có thể là null hoặc một mảng các số nguyên'
    })
}).unknown(true) // Cho phép các trường không xác định trong schema

const hotelSchemaUpdate = Joi.object({
  hotel_name: Joi.string().required().messages({
    'string.empty': 'Tên khách sạn là bắt buộc',
    'any.required': 'Tên khách sạn là bắt buộc'
  }),
  location: Joi.number().integer().required().messages({
    'number.base': 'Vị trí phải là một số nguyên',
    'any.required': 'Vị trí là bắt buộc'
  }),
  address: Joi.string().required().messages({
    'string.base': 'Địa chỉ phải là một chuỗi',
    'any.required': 'Địa chỉ là bắt buộc'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Mô tả là bắt buộc',
    'any.required': 'Mô tả là bắt buộc'
  }),
  rating: Joi.number().precision(1).min(0).max(5).optional().messages({
    'number.base': 'Xếp hạng phải là một số',
    'number.min': 'Xếp hạng phải lớn hơn hoặc bằng 0',
    'number.max': 'Xếp hạng phải nhỏ hơn hoặc bằng 5',
    'number.precision': 'Xếp hạng chỉ được có một chữ số thập phân'
  }),
  services: Joi.array()
    .items(Joi.number().integer())
    .optional()
    .allow(null)
    .messages({
      'array.base': 'Services phải là một mảng',
      'array.items': 'Mỗi dịch vụ phải là số nguyên',
      'any.allowOnly': 'Services có thể là null hoặc một mảng các số nguyên'
    })
}).unknown(true) // Cho phép các trường không xác định trong schema

// Export schema xác thực
module.exports = {
  hotelSchemaRegister,
  hotelSchemaUpdate
}
