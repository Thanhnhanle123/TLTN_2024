const locationModel = require(__path_models + 'location.model') // Nhập mô hình vị trí từ thư mục mô hình
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối

/**
 * Lấy danh sách tất cả các vị trí
 * @returns {Object} - Kết quả với danh sách các vị trí
 */
const getAll = async () => {
  const transaction = await sequelize.transaction()
  try {
    // Lấy tất cả các vị trí từ cơ sở dữ liệu
    const location = await locationModel.findAll({
      transaction // Sử dụng transaction để đảm bảo tính nhất quán dữ liệu
    })

    await transaction.commit() // Commit transaction vì dữ liệu đã được truy xuất thành công
    return {
      status: 200,
      message: 'Thành công',
      data: location
    } // Trả về danh sách vị trí
  } catch (error) {
    await transaction.rollback() // Hoàn tác giao dịch nếu có lỗi xảy ra
    throw error
  }
}

const findById = async id => {
  const transaction = await sequelize.transaction()
  try {
    // Tìm dịch vụ theo id
    const location = await locationModel.findByPk(id)

    if (location) {
      // Nếu dịch vụ được tạo mới, tạo tin dịch vụ
      return {
        status: 200,
        message: 'Thành công',
        data: location.dataValues
      } // Trả về kết quả thành công
    } else {
      // Nếu vị trí không tìm thấy
      return { status: 409, message: 'Vị trí không tồn tại', data: [] } // Trả về thông báo lỗi
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

module.exports = {
  getAll,
  findById
}
