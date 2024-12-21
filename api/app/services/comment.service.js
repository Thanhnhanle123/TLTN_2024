const { dateNow } = require(__path_common + "date");
const commentsModel = require(__path_models + "comment.model"); // Nhập mô hình bình luận từ thư mục mô hình
const usersModel = require(__path_models + "user.model"); // Nhập mô hình bình luận từ thư mục mô hình
const hotelsModel = require(__path_models + "hotel.model"); // Nhập mô hình bình luận từ thư mục mô hình
const auth = require(__path_middlewares + "authJwt"); // middleware xác thực
const sequelize = require(__path_configs + "database"); // File cấu hình kết nối
const { formatKeyObject } = require(__path_common + "format"); // format

/**
 * Lấy thông tin bình luận theo hotel
 * @param {number} commentId - ID của bình luận cần lấy thông tin
 * @returns {Object} - Kết quả với thông tin bình luận hoặc thông báo lỗi
 */
const getAll = async () => {
  const transaction = await sequelize.transaction();
  try {
    const query = `
      SELECT c.*, u.user_name, h.hotel_name
      FROM comments c
      LEFT JOIN users u ON u.id = c.user_id -- Assuming userId is the foreign key in comments
      LEFT JOIN hotels h ON h.id = c.hotel_id -- Assuming hotelId is the foreign key in comments
    `;

    const comments = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      transaction,
    });

    if (comments.length > 0) {
      return {
        status: 200,
        message: "Thành công",
        data: comments,
      };
    } else {
      return { status: 409, message: "Bình luận không tồn tại", data: [] };
    }
  } catch (error) {
    await transaction.rollback();
    throw error; // Handle error as needed
  }
};


/**
 * Lấy thông tin bình luận theo hotel
 * @param {number} commentId - ID của bình luận cần lấy thông tin
 * @returns {Object} - Kết quả với thông tin bình luận hoặc thông báo lỗi
 */
const getCommentByHotelId = async (id) => {
  // const transaction = await sequelize.transaction();
  try {
    // Execute the SQL query to get comments and user names
    const comments = await sequelize.query(
      `
      SELECT c.*, u.user_name
      FROM comments AS c
      JOIN users AS u ON c.user_id = u.id
      WHERE c.hotel_id = :id;
      `,
      {
        replacements: { id: id }, // Bind the hotelId parameter
        type: sequelize.QueryTypes.SELECT, // Specify the query type
      }
    );

    // Check if comments array is not empty
    if (comments.length > 0) {
      return {
        status: 200,
        message: "Thành công",
        data: comments,
      }; // Return success with comments data
    } else {
      return { status: 409, message: "bình luận không tồn tại", data: [] }; // Return not found message
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    throw error; // Throw error to be handled by the controller
  } finally {
    // await transaction.rollback(); // Ensure transaction is rolled back in case of an error
  }
};


/**
 * Lấy thông tin bình luận theo hotel
 * @param {number} commentId - ID của bình luận cần lấy thông tin
 * @returns {Object} - Kết quả với thông tin bình luận hoặc thông báo lỗi
 */
const deleteComment = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    // Find the comment by its ID
    const comment = await commentsModel.findByPk(id);

    if (comment) {
      // If the comment exists, delete it
      await comment.destroy({ transaction });

      // Commit the transaction
      await transaction.commit();

      return {
        status: 200,
        message: "Thành công", // "Success"
        data: comment.dataValues,
      }; // Return success result
    } else {
      // If the comment was not found
      return { status: 200, message: "Bình luận không tồn tại", data: [] }; // "Comment does not exist"
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    throw error; // Throw error for controller to handle
  }
};


/**
 * Tạo một bình luận mới
 * @param {Object} commentData - Dữ liệu bình luận cần tạo
 * @returns {Object} - Kết quả tạo bình luận
 */
const createComment = async (body) => {
  const transaction = await sequelize.transaction();
  try {
    const createdAt = dateNow();
    const updatedAt = dateNow();
    const serviceData = formatKeyObject(body);

    const { user_id, hotel_id } = serviceData;

    // Check if the user and hotel have an existing booking
    const bookingExists = await sequelize.query(
      `
      SELECT 1
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN hotels h ON r.hotel_id = h.id
      WHERE b.user_id = :userId AND h.id = :hotelId AND b.booking_status = 1; -- Assuming status 1 means active/completed bookings
      `,
      {
        replacements: { userId: user_id, hotelId: hotel_id },
        type: sequelize.QueryTypes.SELECT,
        transaction, // Ensure this check runs within the same transaction
      }
    );

    // If no booking is found, throw an error
    if (!bookingExists.length) {
      return { status: 400, message: "Bạn chưa đặt phòng này" };
    }

    // Create a new comment
    const created = await commentsModel.create(
      {
        ...serviceData, // Spread the comment data
        createdAt, // Set the createdAt timestamp
        updatedAt, // Set the updatedAt timestamp
      },
      { transaction } // Pass the transaction to Sequelize
    );

    // If the comment is successfully created, commit the transaction
    if (created) {
      await transaction.commit();
      return { status: 201, message: "Thành công", data: created.dataValues }; // Success message
    }
  } catch (error) {
    // If any error occurs, rollback the transaction
    await transaction.rollback();
    return { status: 400, message: "Bạn chưa đặt phòng này"};
  }
};



module.exports = {
  getAll,
  getCommentByHotelId, // Lấy thông tin bình luận theo khách sạn
  deleteComment,
  createComment,
};
