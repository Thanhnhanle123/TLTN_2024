const { checkType } = require(__path_common + 'check')
const { convertKeysToCamelCase } = require(__path_common + 'format')
const message = (res, status, message, data) => {
  if (checkType(data) === 'object') {
    data = convertKeysToCamelCase(data)
  }
  return res
    .status(status)
    .json({ status: status, message: message, data: data })
}

module.exports = {
  message
}
