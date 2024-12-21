const validateRequest = (schema, customMessages = {}) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errorMessages = error.details.map(detail => {
        const message = customMessages[detail.context.key] || detail.message
        return {
          field: detail.context.key,
          message: message.replace(/['"]/g, '')
        }
      })

      return res.status(400).json({
        status: 'fail',
        message: 'Validation Error',
        errors: errorMessages
      })
    }
    next()
  }
}

module.exports = validateRequest
