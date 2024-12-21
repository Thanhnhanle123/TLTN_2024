const hotelsModel = require(__path_models + 'hotel.model') // Nhập mô hình khách sạn từ thư mục mô hình
const hotelServiceModel = require(__path_models + 'hotel_services.model') // Nhập mô hình khách sạn từ thư mục mô hình
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const messages = require(__path_common + 'messageCommon')
const { formatKeyObject } = require(__path_common + 'format') // format
const { dateNow } = require(__path_common + 'date')
const fs = require('fs')

const countHotel = async () => {
  try {
    // Tìm dịch vụ theo id
    const hotels = await hotelsModel.count()

    if (hotels) {
      return {
        status: 200,
        message: 'Thành công',
        data: hotels
      } // Trả về kết quả thành công
    } else {
      // Nếu vị trí không tìm thấy
      return { status: 409, message: 'Hotel không tồn tại', data: [] } //Trả về thông báo lỗi
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

/**
 * Lấy danh sách tất cả các khách sạn
 * @returns {Object} - Kết quả với danh sách các khách sạn hoặc thông báo lỗi
 */
const getAll = async () => {
  const transaction = await sequelize.transaction();
  try {
    // Execute the raw SQL query
   const results = await sequelize.query(
     `
      SELECT h.*
      FROM hotels h
      JOIN rooms r ON r.hotel_id = h.id
      GROUP BY h.id
      `,
     {
       type: sequelize.QueryTypes.SELECT,
       transaction,
     }
   );

    await transaction.commit(); // Commit the transaction

    // Check and return the result as a list
    return {
      status: 200,
      message: messages.code200.success,
      data: Array.isArray(results) ? results : [results], // Ensure the result is an array
    };
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    throw error;
  }
};




const findById = async id => {
  // const transaction = await sequelize.transaction();
  try {
    // Tìm dịch vụ theo id
    const results = await hotelsModel.findByPk(id)

    if (results) {
      // Nếu dịch vụ được tạo mới, tạo tin dịch vụ
      return {
        status: 200,
        message: 'Thành công',
        data: results.dataValues
      } // Trả về kết quả thành công
    } else {
      // Nếu vị trí không tìm thấy
      return { status: 409, message: 'Vị trí không tồn tại', data: [] } // Trả về thông báo lỗi
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

const getIncomeById = async (hotelId) => {
  try {
    // Query to calculate total income
    const [results] = await sequelize.query(
      `
      SELECT
          COALESCE(SUM(b.total_price), 0) AS total_income
      FROM
          bookings b
      JOIN
          rooms r ON b.room_id = r.id
      JOIN
          hotels h ON r.hotel_id = h.id
      WHERE
          h.id = :hotelId
      AND
          b.booking_status = 1;
      `,
      {
        replacements: { hotelId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return {
      status: 200,
      message: "Thành công",
      data: results.total_income, // Directly returning the result
    };
  } catch (error) {
    throw error;
  }
};



const getHotelByUserId = async userId => {
  const transaction = await sequelize.transaction()
  try {
    const results = await sequelize.query(
      `
      SELECT h.*, hs.service_id
      FROM hotels h
      LEFT JOIN hotel_services hs ON h.id = hs.hotel_id
      WHERE h.user_id = :userId
      `,
      {
        replacements: { userId }, // Pass userId as a parameter to prevent SQL injection
        type: sequelize.QueryTypes.SELECT,
        transaction
      }
    )

    if (results.length > 0) {
      await transaction.commit() // Commit transaction after successful retrieval

      // Extract hotel information (assuming only one hotel per user_id)
      const hotelInfo = {
        id: results[0].id,
        user_id: results[0].user_id,
        hotel_name: results[0].hotel_name,
        image_hotel: results[0].image_hotel,
        location: results[0].location,
        address: results[0].address,
        description: results[0].description,
        rating: results[0].rating,
        typeHotel: results[0].typeHotel,
        createdAt: results[0].createdAt,
        updatedAt: results[0].updatedAt,
        services: results
          .map(row => row.service_id)
          .filter(serviceId => serviceId !== null)
      }

      return {
        status: 200,
        message: 'Thành công',
        data: hotelInfo
      }
    } else {
      await transaction.rollback() // Roll back transaction if no data found
      return { status: 409, message: 'Vị trí không tồn tại', data: [] }
    }
  } catch (error) {
    await transaction.rollback() // Roll back on error
    throw error
  }
}

const find = async (req, res, next) => {
  return {
    status: 200,
    message: 'ok'
  }
}

const register = async (body, file) => {
  const transaction = await sequelize.transaction() // Bắt đầu giao dịch
  var filePath = ''
  var fileName = ''
  console.log(file)
  if (file != null) {
    filePath = file.path
    fileName = file.filename
  }
  try {
    const createdAt = dateNow() // Thời gian tạo người dùng (theo mili giây)
    const updatedAt = dateNow() // Thời gian cập nhật người dùng (theo mili giây)
    const hotelData = formatKeyObject(body) // Lấy dữ liệu từ body của request
    const serviceData = hotelData.services
    delete hotelData.services // Xóa dữ liệu dịch vụ ra khỏi dữ liệu khách sạn

    const [hotel, created] = await hotelsModel.findOrCreate({
      where: { hotel_name: hotelData.hotel_name }, // Điều kiện tìm khách sạn
      defaults: {
        ...hotelData,
        createdAt,
        updatedAt,
        image_hotel: fileName,
        image_path: filePath
      }, // Dữ liệu mặc định tạo khách sạn
      transaction
    })
    if (created) {
      if (serviceData.length > 0) {
        const servicePromises = serviceData.map(service => {
          return hotelServiceModel.create(
            {
              hotel_id: hotel.id, // Liên kết dịch vụ với khách sạn vừa tạo
              service_id: service, // Liên kết dịch vụ với khách sạn vừa tạo
              createdAt,
              updatedAt
            },
            { transaction }
          )
        })

        // Chờ tất cả các dịch vụ được thêm thành công
        await Promise.all(servicePromises)
      }
      await transaction.commit()
      return {
        status: 201,
        message: 'Thành công',
        data: hotel.dataValues
      } // Trả về kết quả thành công
    } else {
      // Nếu người dùng đã tồn tại, trả về thông báo lỗi
      // Rollback transaction vì không có thay đổi nào
      await transaction.rollback()
      // Xóa file ảnh nếu như khách sạn đã tồn tại
      if (file != null) {
        await fs.promises.unlink(filePath)
      }
      return { status: 409, message: 'khách sạn đã tồn tại.', data: [] } // Trả về thông báo lỗi
    }
  } catch (error) {
    await transaction.rollback() // Nếu có lỗi, rollback giao dịch
    if (file != null) {
      await fs.promises.unlink(filePath)
    }
    throw error // Ném lỗi để xử lý ở nơi khác
  }
}

const update = async (hotelId, body, file) => {
  const transaction = await sequelize.transaction() // Bắt đầu giao dịch
  try {
    const updatedAt = dateNow() // Thời gian cập nhật người dùng (theo mili giây)
    const hotelData = formatKeyObject(body) // Lấy dữ liệu từ body của request
    const serviceData = hotelData.services // Dữ liệu dịch vụ của khách sạn
    delete hotelData.services // Xóa dữ liệu dịch vụ ra khỏi dữ liệu khách sạn
    var fileDataImage =
      file != null
        ? {
            image_hotel: file.filename,
            image_path: file.path
          }
        : {}

    // Cập nhật thông tin khách sạn
    const [updatedCount] = await hotelsModel.update(
      {
        ...hotelData,
        ...fileDataImage,
        updatedAt
      }, // Cập nhật dữ liệu khách sạn
      // Điều kiện tìm khách sạn và giao dịch
      { where: { id: hotelId }, transaction }
    )

    if (updatedCount === 0) {
      await transaction.rollback()
      return { status: 404, message: 'Không tìm thấy khách sạn.', data: [] }
    }

    if (Array.isArray(serviceData) && serviceData.length > 0) {
      // Xóa các dịch vụ cũ của khách sạn
      await hotelServiceModel.destroy({
        where: { hotel_id: hotelId },
        transaction
      })

      // Thêm các dịch vụ mới
      await hotelServiceModel.bulkCreate(
        serviceData.map(service => ({
          hotel_id: hotelId, // ID của khách sạn
          service_id: service, // ID của dịch vụ mới
          createdAt: dateNow(), // Thời gian tạo mới
          updatedAt
        })),
        { transaction }
      )
    }

    // Commit các thay đổi
    await transaction.commit()
    return { status: 200, message: 'Cập nhật thành công', data: hotelData }
  } catch (error) {
    if (file != null) {
      await fs.promises.unlink(filePath)
    }

    await transaction.rollback() // Nếu có lỗi, rollback giao dịch
    throw error // Ném lỗi để xử lý ở nơi khác
  }
}

module.exports = {
  countHotel,
  getAll, // Xuất hàm get tất cả khách sạn
  find, // Tìm khách sạn theo điều kiện
  register, // Đăng ký khách sạn
  update, // Cập nhật khách sạn
  findById, // Tìm khách sạn theo id
  getHotelByUserId,
  getIncomeById,
};
