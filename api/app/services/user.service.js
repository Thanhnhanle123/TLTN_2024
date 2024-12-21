const { dateNow } = require(__path_common + 'date')
const usersModel = require(__path_models + 'user.model') // Nhập mô hình người dùng từ thư mục mô hình
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const { Op } = require('sequelize') // import Op từ sequelize
const bcrypt = require('bcryptjs')
const { formatKeyObject } = require(__path_common + 'format') // format

/**
 * Tạo người dùng mới hoặc tìm người dùng đã tồn tại
 * @param {Object} body - Dữ liệu người dùng mới, bao gồm userName, email, password và fullName
 * @returns {Object} - Kết quả với thông tin người dùng và token hoặc thông báo lỗi
 */
const register = async body => {
  const transaction = await sequelize.transaction()
  try {
    const createdAt = dateNow() // Thời gian tạo người dùng (theo mili giây)
    const updatedAt = dateNow() // Thời gian cập nhật người dùng (theo mili giây)
    const userData = formatKeyObject(body) // Lấy dữ liệu từ body của request
    // Tìm người dùng theo email hoặc tạo người dùng mới nếu không tồn tại
    const [user, created] = await usersModel.findOrCreate({
      where: { email: userData.email }, // Điều kiện tìm người dùng
      defaults: { ...userData, createdAt, updatedAt }, // Dữ liệu mặc định khi tạo người dùng mới
      transaction
    })

    if (created) {
      // Nếu người dùng được tạo mới, tạo và trả về token cùng với thông tin người dùng
      const token = auth.encodedToken(user.id)
      await transaction.commit()
      return {
        status: 201,
        message: 'Thành công',
        data: user.dataValues,
        token: token
      } // Trả về kết quả thành công
    } else {
      // Nếu người dùng đã tồn tại, trả về thông báo lỗi
      await transaction.rollback() // Rollback transaction vì không có thay đổi nào
      return { status: 409, message: 'Email đã tồn tại.', data: [] } // Trả về thông báo lỗi
    }
  } catch (error) {
    await transaction.rollback() // Hoàn tác giao dịch nếu có lỗi xảy ra
    throw error // Ném lỗi để controller xử lý
  }
}

/**
 * Đăng nhập vào hệ thống
 * @param {Object} body - Dữ liệu người dùng, email, password
 * @returns {Object} - Kết quả với thông tin người dùng và token hoặc thông báo lỗi
 */
const login = async body => {
  try {
    const { email, password } = body // Lấy dữ liệu từ body của request

    // Tìm người dùng theo email
    const user = await usersModel.findOne({
      where: { email } // Điều kiện tìm người dùng
    })

    if (user) {
      const match = await auth.comparePassword(password, user.password) // Kiểm tra mật khẩu
      if (match) {
        // Nếu hợp lệ
        const token = auth.encodedToken(user.id) // Tạo token với id người dùng
        return {
          status: 200,
          message: 'Thành công',
          data: user.dataValues,
          token: token
        } // Trả về kết quả thành công
      } else {
        return { status: 403, message: 'Mật khẩu không chính xác', data: [] }
      }
    } else {
      return { status: 409, message: 'Người dùng không tồn tại', data: [] }
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

const loginAdmin = async body => {
  try {
    const { email, password } = body // Lấy dữ liệu từ body của request

    // Tìm người dùng theo email
    const user = await usersModel.findOne({
      where: { email } // Điều kiện tìm người dùng
    })

    if (user) {
      if (user.role !== 1) {
        return {
          status: 403,
          message: 'Bạn không có quyền truy cập',
          data: []
        } // Kiểm tra quyền
      }

      const match = await auth.comparePassword(password, user.password) // Kiểm tra mật khẩu
      if (match) {
        // Nếu hợp lệ
        const token = auth.encodedToken(user.id) // Tạo token với id người dùng
        return {
          status: 200,
          message: 'Thành công',
          data: user.dataValues,
          token: token
        } // Trả về kết quả thành công
      } else {
        return { status: 403, message: 'Mật khẩu không chính xác', data: [] }
      }
    } else {
      return { status: 409, message: 'Người dùng không tồn tại', data: [] }
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

/**
 * Cập nhật thông tin người dùng
 * @param   {Object} id     - Đối tượng chứa id người dùng
 * @param   {Object} body   - Dữ liệu người dùng cần cập nhật
 * @returns {Object}        - Kết quả với thông tin người dùng đã cập nhật
 */
const updateInfo = async (id, body) => {
  const transaction = await sequelize.transaction()
  try {
    // Tìm người dùng theo id
    const user = await usersModel.findByPk(id)
    if (!user) {
      return {
        status: 404,
        message: 'Không tìm thấy thông tin người dùng',
        data: []
      }
    }
    // Di chuyển giá trị từ body (chuyển đổi key body giống với key db) sang user
    user.set({ ...formatKeyObject(body), updatedAt: dateNow() })

    // Lưu các thay đổi
    await user.save(transaction)
    await transaction.commit()

    // Trả về thông tin người dùng đã cập nhật
    return {
      status: 200,
      message: 'Người dùng đã được cập nhật',
      data: user.dataValues
    }
  } catch (error) {
    await transaction.rollback()
    throw error // Ném lỗi để controller xử lý
  }
}

/**
 * Lấy thông tin người dùng
 * @param {number} userId - ID của người dùng cần lấy thông tin
 * @returns {Object} - Kết quả với thông tin người dùng hoặc thông báo lỗi
 */
const findById = async id => {
  try {
    // Tìm dịch vụ theo id
    const user = await usersModel.findByPk(id)

    if (user) {
      // Nếu dịch vụ được tạo mới, tạo tin dịch vụ
      return {
        status: 200,
        message: 'Thành công',
        data: user.dataValues
      } // Trả về kết quả thành công
    } else {
      // Nếu vị trí không tìm thấy
      return { status: 409, message: 'Người dùng không tồn tại', data: [] } // Trả về thông báo lỗi
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

const registerHost = async id => {
  const transaction = await sequelize.transaction()
  try {
    const [updatedCount] = await usersModel.update(
      { role: 2 }, // Set role to 2
      { where: { id }, transaction } // Update by user ID within the transaction
    )

    if (updatedCount > 0) {
      // Fetch the updated user data to include in the response
      const user = await usersModel.findByPk(id, { transaction })
      await transaction.commit() // Commit the transaction if update succeeds
      return {
        status: 200,
        message: 'Thành công',
        data: user.dataValues
      }
    } else {
      await transaction.rollback() // Roll back if no records were updated
      return { status: 409, message: 'Người dùng không tồn tại', data: [] }
    }
  } catch (error) {
    await transaction.rollback() // Roll back on error
    throw error
  }
}

const countUser = async () => {
  try {
    // Tìm dịch vụ theo id
    const data = await usersModel.count()

    if (data) {
      return {
        status: 200,
        message: 'Thành công',
        data: data
      } // Trả về kết quả thành công
    } else {
      // Nếu vị trí không tìm thấy
      return { status: 409, message: 'booking không tồn tại', data: [] } //Trả về thông báo lỗi
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

/**
 * Lấy thông tin tất cả người dùng
 * @returns {Object} - Kết quả với thông tin người dùng hoặc thông báo lỗi
 */
const getAll = async () => {
  const Sequelize = require('sequelize')
  const transaction = await sequelize.transaction()
  try {
    // Lấy tất cả người dùng
    const users = await usersModel.findAll({
      where: {
        role: {
          [Sequelize.Op.ne]: 1 // Điều kiện không bằng 1
        }
      }
    })

    if (users && users.length > 0) {
      // Nếu có người dùng, commit giao dịch và trả về kết quả
      await transaction.commit()
      return {
        status: 200,
        message: 'Thành công',
        data: users // Trả về tất cả dữ liệu người dùng
      }
    } else {
      // Nếu không có người dùng, rollback giao dịch
      await transaction.rollback()
      return { status: 409, message: 'Không tìm thấy người dùng', data: [] }
    }
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback()
    // Ném lỗi để controller xử lý
    throw error
  }
}
const loginGoogle = async payload => {
  const transaction = await sequelize.transaction()
  try {
    const createdAt = dateNow()
    const updatedAt = dateNow()
    const { email, name, sub } = payload
    const userData = {
      user_name: email,
      email: email,
      full_name: name,
      google_id: sub,
      authentic: 1,
      is_active: true
    }

    const [user, created] = await usersModel.findOrCreate({
      where: { email: userData.email },
      defaults: { ...userData, createdAt, updatedAt },
      transaction
    })

    // Commit the transaction, whether or not a new user was created
    const tokenLogin = auth.encodedToken(user.dataValues.id)
    await transaction.commit()
    return {
      status: 200,
      message: 'Đăng nhập thành công',
      data: user.dataValues,
      token: tokenLogin
    }
  } catch (error) {
    // Rollback the transaction only if an error occurs
    await transaction.rollback()
    throw error
  }
}
const forgotPassword = async email => {
  const transaction = await sequelize.transaction()
  try {
    const user = await usersModel.findOne({
      where: { email } // Điều kiện tìm người dùng
    })
    if (user) {
      const token = auth.encodedToken(user.id)
      user.set({
        ...formatKeyObject({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 300000 // 5 phút hết hạn
        }),
        updatedAt: dateNow()
      })

      // Lưu các thay đổi
      await user.save(transaction)
      await transaction.commit()
      return {
        status: 200,
        message: 'Thành công',
        data: user.dataValues,
        token: token
      } // Trả về
    } else {
      return { status: 409, message: 'Người dùng không tồn tại', data: [] }
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const resetPassword = async token => {
  try {
    const user = await usersModel.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: Date.now() } // Kiểm tra token còn hạn
      }
    })
    if (!user) {
      return {
        status: 400,
        message: 'Token không hợp lệ hoặc đã hết hạn.',
        data: null
      }
    }
    return {
      status: 200,
      message: 'Xác thực thành công',
      data: { token: token }
    }
  } catch (error) {
    throw error
  }
}

const changePasswordForgot = async (token, password) => {
  try {
    const user = await usersModel.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: Date.now() } // Kiểm tra token còn hạn
      }
    })

    if (!user) {
      return {
        status: 400,
        message: 'Token không hợp lệ hoặc đã hết hạn.',
        data: null
      }
    }
    if (user.reset_password_token == null) {
      return {
        status: 400,
        message: 'Token không hợp lệ hoặc đã hết hạn.',
        data: null
      }
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.reset_password_token = null
    user.reset_password_expires = null
    await user.save()
    return {
      status: 200,
      message: 'Thay đội mật khẩu thành công',
      data: user.dataValues
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  register, // Tạo người dùng
  login, // Đăng nhập hệ thống
  updateInfo, // Cập nhật thông tin người dùng
  findById, // Lấy thông tin người dùng
  getAll,
  registerHost,
  countUser,
  loginGoogle,
  forgotPassword,
  resetPassword,
  changePasswordForgot,
  loginAdmin
}
