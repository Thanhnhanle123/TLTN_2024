const { checkType } = require(__path_common + 'check')
function toCamelCase (str) {
  return str.replace(/_./g, match => match.charAt(1).toUpperCase())
}

/**
 * Đổi tên key từ camelCase/PascalCase thành snake_case
 * @param   {Object} data - Object cần định dạng lại key
 * @returns {Object}      - Object đã được định dạng key
 */
const formatKeyObject = data => {
  // Kiểm tra nếu data là một object
  if (checkType(data) === 'object') {
    const formattedData = {}

    // Duyệt qua từng key trong object
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Chuyển đổi key từ camelCase hoặc PascalCase sang snake_case
        const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        formattedData[newKey] = data[key]
      }
    }
    return formattedData
  }

  // Nếu data không phải là object, trả về data như ban đầu
  return data
}

const convertKeysToCamelCase = obj => {
  const newObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelCaseKey = toCamelCase(key)
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        newObj[camelCaseKey] = convertKeysToCamelCase(obj[key])
      } else {
        newObj[camelCaseKey] = obj[key]
      }
    }
  }
  return newObj
}

module.exports = {
  formatKeyObject,
  convertKeysToCamelCase
}
