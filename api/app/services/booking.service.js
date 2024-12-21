const { dateNow } = require(__path_common + 'date')
const bookingsModel = require(__path_models + 'booking.model') // Nhập mô hình booking từ thư mục mô hình
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const { formatKeyObject } = require(__path_common + 'format') // format
const hotelService = require(__path_services + 'hotel.service')
const roomModel = require(__path_models + 'room.model') // Nhập mô hình phòng từ thư mục mô hình
const hotelModel = require(__path_models + 'hotel.model') // Nhập mô hình phòng từ thư mục mô hình
const { Op } = require('sequelize')
/**
 * Lấy thông tin booking theo hotel
 * @param {number} bookingId - ID của booking cần lấy thông tin
 * @returns {Object} - Kết quả với thông tin booking hoặc thông báo lỗi
 */
const getAll = async () => {
  // const transaction = await sequelize.transaction();
  try {
    const query = `
      SELECT
        b.*,
        u.user_name,
        r.room_number,
        r.price,
        h.hotel_name,
        h.image_hotel
      FROM
        bookings b
      LEFT JOIN
        users u ON u.id = b.user_id
      LEFT JOIN
        rooms r ON r.id = b.room_id
      LEFT JOIN
        hotels h ON h.id = r.hotel_id
    `

    const bookings = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
      // transaction,
    })

    if (bookings.length > 0) {
      return {
        status: 200,
        message: 'Thành công',
        data: bookings
      }
    } else {
      return { status: 409, message: 'Không tìm thấy booking', data: [] }
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}
/**
 * Lấy thông tin booking theo hotel
 * @param {number} bookingId - ID của booking cần lấy thông tin
 * @returns {Object} - Kết quả với thông tin booking hoặc thông báo lỗi
 */
const { Sequelize } = require('sequelize')

const getBookingByHotelId = async hotelId => {
  try {
    const query = `
      SELECT
          b.id,
          b.check_in_date,
          b.check_out_date,
          b.total_price,
          b.booking_status,
          u.full_name AS fullname,
          u.phone_number AS phone,
          b.people,
          r.room_number
      FROM
          bookings b
      JOIN
          users u ON b.user_id = u.id
      JOIN
          rooms r ON b.room_id = r.id
      JOIN
          hotels h ON r.hotel_id = h.id
      WHERE
          h.id = :hotelId;
      `

    const result = await sequelize.query(query, {
      replacements: { hotelId },
      type: sequelize.QueryTypes.SELECT
    })
    const results = Array.isArray(result) ? result : []

    if (results.length > 0) {
      return {
        status: 200,
        message: 'Thành công',
        data: results
      }
    } else {
      return {
        status: 404,
        message: 'Không tìm thấy booking',
        data: []
      }
    }
  } catch (error) {
    console.error('Error executing query:', error)
    throw error
  }
}

const getBookingByUserID = async id => {
  // const transaction = await sequelize.transaction();
  try {
    // Execute the SQL query to get comments and user names
    const bookings = await sequelize.query(
      `
      SELECT b.*, h.hotel_name, h.image_hotel
      FROM bookings AS b
      JOIN rooms AS r ON r.id = b.room_id
      JOIN hotels AS h ON h.id = r.hotel_id
      WHERE b.user_id = :id;
      `,
      {
        replacements: { id: id }, // Bind the hotelId parameter
        type: sequelize.QueryTypes.SELECT // Specify the query type
      }
    )

    // Check if bookings array is not empty
    if (bookings.length > 0) {
      return {
        status: 200,
        message: 'Thành công',
        data: bookings
      } // Return success with bookings data
    } else {
      return { status: 409, message: 'Booking không tồn tại', data: [] } // Return not found message
    }
  } catch (error) {
    console.error(error) // Log the error for debugging
    throw error // Throw error to be handled by the controller
  }
}

const cancelBooking = async id => {
  try {
    // Execute the SQL query to update the booking status
    const updatedAt = dateNow()
    await bookingsModel.update(
      { booking_status: 3, updatedAt: updatedAt }, // Giá trị cần cập nhật
      { where: { id: id } } // Điều kiện
    )
    // Check if any rows were affected (i.e., if the booking exists)
    return {
      status: 200,
      message: 'Thành công', // Success message
      data: { id: id, booking_status: 3 } // Return the id and updated booking status
    }
  } catch (error) {
    console.error(error) // Log the error for debugging
    throw error // Throw error to be handled by the controller
  }
}
const checkedInBooking = async id => {
  try {
    // Execute the SQL query to update the booking status
    const updatedAt = dateNow()
    await bookingsModel.update(
      { booking_status: 1, updatedAt: updatedAt }, // Giá trị cần cập nhật
      { where: { id: id } } // Điều kiện
    )
    // Check if any rows were affected (i.e., if the booking exists)
    return {
      status: 200,
      message: 'Thành công', // Success message
      data: { id: id, booking_status: 3 } // Return the id and updated booking status
    }
  } catch (error) {
    console.error(error) // Log the error for debugging
    throw error // Throw error to be handled by the controller
  }
}
const checkedOutBooking = async id => {
  try {
    // Execute the SQL query to update the booking status
    const updatedAt = dateNow()
    await bookingsModel.update(
      { booking_status: 2, updatedAt: updatedAt }, // Giá trị cần cập nhật
      { where: { id: id } } // Điều kiện
    )
    // Check if any rows were affected (i.e., if the booking exists)
    return {
      status: 200,
      message: 'Thành công', // Success message
      data: { id: id, booking_status: 3 } // Return the id and updated booking status
    }
  } catch (error) {
    console.error(error) // Log the error for debugging
    throw error // Throw error to be handled by the controller
  }
}

/**
 * Lấy thông tin booking theo hotel
 * @param {number} bookingId - ID của booking cần lấy thông tin
 * @returns {Object} - Kết quả với thông tin booking hoặc thông báo lỗi
 */
const countBooking = async () => {
  try {
    // Tìm dịch vụ theo id
    const booking = await bookingsModel.count()

    if (booking) {
      return {
        status: 200,
        message: 'Thành công',
        data: booking
      } // Trả về kết quả thành công
    } else {
      // Nếu vị trí không tìm thấy
      return { status: 409, message: 'booking không tồn tại', data: [] } //Trả về thông báo lỗi
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

const getIncome = async () => {
  const transaction = await sequelize.transaction()
  try {
    // Tìm dịch vụ theo id
    const totalIncome = await bookingsModel.sum('total_price', { transaction })

    if (totalIncome) {
      return {
        status: 200,
        message: 'Thành công',
        data: totalIncome // Return the total income
      }
    } else {
      return { status: 409, message: 'Không có dữ liệu booking', data: 0 }
    }
  } catch (error) {
    throw error // Ném lỗi để controller xử lý
  }
}

const create = async (userId, body) => {
  const transaction = await sequelize.transaction()
  const createdAt = dateNow()
  const updatedAt = dateNow()
  const bookingData = formatKeyObject(body)

  try {
    const hotel = await hotelService.getHotelByUserId(userId)
    const roomById = await roomModel.findByPk(bookingData.room_id)
    if (hotel.data.id == roomById.dataValues.hotel_id) {
      await transaction.rollback()
      return {
        status: 409,
        message: 'Không thể đặt khách sạn của mình',
        data: []
      }
    }
    // Use findOrCreate to check for existing bookings and create a new one if it doesn't exist
    const [booking, created] = await bookingsModel.findOrCreate({
      where: {
        user_id: bookingData.user_id,
        room_id: bookingData.room_id,
        check_in_date: bookingData.check_in_date,
        check_out_date: bookingData.check_out_date
      },
      defaults: {
        ...bookingData,
        createdAt,
        updatedAt
      },
      transaction
    })

    if (created) {
      await transaction.commit()
      return {
        status: 201,
        message: 'Thành công',
        data: booking.dataValues
      }
    } else {
      await transaction.rollback()
      return {
        status: 409,
        message: 'Booking đã tồn tại',
        data: []
      }
    }
  } catch (error) {
    await transaction.rollback()
    // Log the error for debugging (optional)
    console.error('Error creating booking:', error)
    throw error
  }
}

const getIncomeAll = async (hotelId, year, month) => {
  try {
    // Execute the SQL query to update the booking status
    const getIncome = await getIncomeByYearMonth(hotelId, year, month)
    return {
      status: 200,
      message: 'Thành công', // Success message
      data: getIncome // Return the id and updated booking status
    }
  } catch (error) {
    throw error // Throw error to be handled by the controller
  }
}

async function getIncomeByYearMonth (
  hotelId,
  inputYear = null,
  inputMonth = null
) {
  try {
    // Kiểm tra các tham số bắt buộc
    if (!hotelId) {
      throw new Error('hotelId is required')
    }
    const sql = `
      SELECT 
        YEAR(b.check_in_date) AS year,
        MONTH(b.check_in_date) AS month,
        SUM(b.total_price) AS income
      FROM bookings AS b 
      JOIN rooms AS r ON b.room_id = r.id
      JOIN hotels AS h ON h.id = r.hotel_id
      WHERE h.id = ${hotelId} AND booking_status = 2
      AND (
              ${inputYear} IS NULL OR YEAR(b.check_in_date) = ${inputYear}
          )
          AND (
              ${inputMonth} IS NULL OR MONTH(b.check_in_date) = ${inputMonth}
          )
      GROUP BY 
          YEAR(b.check_in_date), MONTH(b.check_in_date)
      ORDER BY 
          YEAR(b.check_in_date) ASC, MONTH(b.check_in_date) ASC
      `
    const bookings = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT // Specify the query type
    })
    if (bookings.length > 0) {
      return bookings
    }
    return []

    // Truy vấn dữ liệu từ bookingsModel
    // const result = await bookingsModel.findAll({
    //   attributes: [
    //     [Sequelize.fn('YEAR', Sequelize.col('check_in_date')), 'year'],
    //     [Sequelize.fn('MONTH', Sequelize.col('check_in_date')), 'month'],
    //     [Sequelize.fn('SUM', Sequelize.col('total_price')), 'income']
    //   ],
    //   include: [
    //     {
    //       model: roomModel,
    //       attributes: [], // Sửa lỗi cú pháp
    //       include: [
    //         {
    //           model: hotelModel,
    //           attributes: [],
    //           where: {
    //             id: hotelId // Điều kiện lọc hotelId
    //           }
    //         }
    //       ]
    //     }
    //   ],
    //   where: {
    //     booking_status: 2, // Chỉ lấy booking đã xác nhận
    //     [Op.and]: [
    //       inputYear !== null
    //         ? Sequelize.where(
    //             Sequelize.fn('YEAR', Sequelize.col('check_in_date')),
    //             inputYear
    //           )
    //         : {}, // Bỏ qua nếu inputYear là null
    //       inputMonth !== null
    //         ? Sequelize.where(
    //             Sequelize.fn('MONTH', Sequelize.col('check_in_date')),
    //             inputMonth
    //           )
    //         : {} // Bỏ qua nếu inputMonth là null
    //     ]
    //   },
    //   group: [
    //     Sequelize.fn('YEAR', Sequelize.col('check_in_date')),
    //     Sequelize.fn('MONTH', Sequelize.col('check_in_date'))
    //   ],
    //   order: [
    //     [Sequelize.fn('YEAR', Sequelize.col('check_in_date')), 'ASC'],
    //     [Sequelize.fn('MONTH', Sequelize.col('check_in_date')), 'ASC']
    //   ],
    //   raw: true // Trả về kết quả thô
    // })

    // // Định dạng kết quả trả về
    // return result.map(row => ({
    //   year: row.year,
    //   month: row.month,
    //   income: parseFloat(row.income) // Định dạng income thành số thực
    // }))
  } catch (error) {
    console.error(error)
    return { error: error.message || 'An error occurred' }
  }
}
module.exports = {
  getAll,
  cancelBooking,
  checkedInBooking,
  checkedOutBooking,
  getBookingByUserID,
  getBookingByHotelId, // Lấy thông tin booking theo khách sạn
  countBooking,
  getIncome,
  create,
  getIncomeAll
}
