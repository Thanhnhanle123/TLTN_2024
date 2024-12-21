const { dateNow } = require(__path_common + 'date')
const roomsModel = require(__path_models + 'room.model') // Nhập mô hình phòng từ thư mục mô hình
const auth = require(__path_middlewares + 'authJwt') // middleware xác thực
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const { formatKeyObject } = require(__path_common + 'format') // format

/**
 * Lấy danh sách phòng theo hotel_id
 * @param {number} hotelId - ID của khách sạn
 * @returns {Object} - Kết quả với danh sách phòng hoặc thông báo lỗi
 */
const getRoomsByHotelId = async hotelId => {
  try {
    const query = `
      SELECT
        r.id AS id,
        r.hotel_id,
        r.room_type_id,
        r.room_number,
        r.price AS original_price,
        r.description,
        r.availability_status,
        r.is_deleted,
        r.deleted_at,
        COALESCE(
          CASE
            WHEN p.discount_type = 'percentage' THEN r.price - (r.price * p.discount_value / 100)
            WHEN p.discount_type = 'fixed' THEN r.price - p.discount_value
            ELSE r.price
          END,
          r.price
        ) AS new_price,
        p.discount_type,
        p.discount_value,
        p.start_date,
        p.end_date
      FROM rooms r
      LEFT JOIN promotion_rooms pr ON r.id = pr.room_id
      LEFT JOIN promotions p ON pr.promotion_id = p.id
        AND p.start_date <= NOW()
        AND p.end_date >= NOW()
      WHERE r.hotel_id = :hotelId
    `

    // Execute the query
    const result = await sequelize.query(query, {
      replacements: { hotelId },
      type: sequelize.QueryTypes.SELECT
    })

    // Ensure result is an array
    const rooms = Array.isArray(result) ? result : []

    if (rooms.length > 0) {
      return {
        status: 200,
        message: 'Thành công',
        data: rooms
      }
    } else {
      return {
        status: 200,
        message: 'Không tìm thấy phòng trong khách sạn',
        data: []
      }
    }
  } catch (error) {
    throw error
  }
}

const deleteRoom = async id => {
  try {
    // Attempt to delete the room with the given id
    // const deletedCount = await roomsModel.destroy({
    //   where: { id: id }
    //   // Uncomment the transaction line if transactions are in use
    //   // transaction
    // })
    const createdAt = dateNow()
    const updatedAt = dateNow()
    const deleted_at = dateNow()
    const is_deleted = true
    // Attempt to perform soft delete
    const deleteRoom = await roomsModel.update(
      {
        is_deleted,
        deleted_at,
        createdAt,
        updatedAt
      },
      {
        where: { id } // Use `id` directly instead of `serviceData.id`
      }
    )
    return {
      status: 200,
      message: 'Thành công',
      data: `Deleted ${deleteRoom} room(s)`
    }
  } catch (error) {
    // Rollback the transaction if one was in place
    // await transaction.rollback();
    throw error // Pass the error to the controller for handling
  }
}

const restoreRoom = async id => {
  try {
    // Attempt to delete the room with the given id
    // const deletedCount = await roomsModel.destroy({
    //   where: { id: id }
    //   // Uncomment the transaction line if transactions are in use
    //   // transaction
    // })
    const createdAt = dateNow()
    const updatedAt = dateNow()
    const deleted_at = null
    const is_deleted = false
    // Attempt to perform soft delete
    const restoreRoom = await roomsModel.update(
      {
        is_deleted,
        deleted_at,
        createdAt,
        updatedAt
      },
      {
        where: { id } // Use `id` directly instead of `serviceData.id`
      }
    )
    return {
      status: 200,
      message: 'Thành công',
      data: `restore ${restoreRoom} room(s)`
    }
  } catch (error) {
    // Rollback the transaction if one was in place
    // await transaction.rollback();
    throw error // Pass the error to the controller for handling
  }
}

const createRoom = async body => {
  const transaction = await sequelize.transaction() // Bắt đầu giao dịch
  try {
    const createdAt = dateNow()
    const updatedAt = dateNow()
    const serviceRoom = formatKeyObject(body)
    // Create a new comment
    const [serviceData, created] = await roomsModel.findOrCreate({
      where: {
        hotel_id: serviceRoom.hotel_id,
        room_number: serviceRoom.room_number
      },
      defaults: {
        ...serviceRoom, // Spread the comment data
        createdAt, // Set the createdAt timestamp
        updatedAt // Set the updatedAt timestamp
      },
      transaction
    })
    // If the comment is successfully created, commit the transaction
    if (created) {
      await transaction.commit()
      return { status: 201, message: 'Thành công', data: serviceData } // Success message
    } else {
      await transaction.rollback()
      return {
        status: 409,
        message: 'Phòng đã được tạo',
        data: []
      }
    }
  } catch (error) {
    if (transaction) await transaction.rollback()
    throw error
  }
}

const updateRoom = async body => {
  try {
    const createdAt = dateNow()
    const updatedAt = dateNow()

    const serviceData = formatKeyObject(body)

    const [updatedRooms] = await roomsModel.update(
      {
        ...serviceData,
        createdAt,
        updatedAt
      },
      {
        where: {
          id: serviceData.id
        },
        returning: true
      }
    )

    return { status: 200, message: 'Update successful', data: updatedRooms }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getRoomsByHotelId, // Lấy thông tin phòng theo khách sạn
  createRoom,
  updateRoom,
  deleteRoom,
  restoreRoom
}
