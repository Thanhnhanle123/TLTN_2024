const promotionModel = require(__path_models + "promotion.model"); // Nhập mô hình vị trí từ thư mục mô hình
const promotionRoomModel = require(__path_models + "promotionRoom.model");
const sequelize = require(__path_configs + "database"); // File cấu hình kết nối
const { formatKeyObject } = require(__path_common + "format"); // format

const create = async (body) => {
  const transaction = await sequelize.transaction();
  try {
    const promotion = await promotionModel.create(
      formatKeyObject(body),
      transaction
    );
    await transaction.commit(); // Commit transaction vì dữ liệu đã được truy xuất thành công
    return {
      status: 201,
      message: "Thành công",
      data: promotion.dataValues,
    }; // Trả về danh sách vị trí
  } catch (error) {
    await transaction.rollback(); // Hoàn tác giao dịch nếu có lỗi xảy ra
    throw error;
  }
};
const findAll = async () => {
  try {
    const promotions = await promotionModel.findAll();
    return {
      status: 200,
      message: "Thành công",
      data: promotions,
    }; // Trả về danh sách vị trí
  } catch (error) {
    throw error;
  }
};
const updatePromotion = async (id, body) => {
  try {
    const promotion = await promotionModel.findByPk(id);
    if (!promotion) {
      return {
        status: 404,
        message: "Khuyến mãi không tồn tại",
        data: [],
      };
    }
    promotion.set(formatKeyObject(body));
    promotion.save();
    return {
      status: 200,
      message: "Thành công",
      data: promotion.dataValues,
    }; // Trả về danh sách vị trí
  } catch (error) {
    throw error;
  }
};
const deletePromotion = async (id) => {
  try {
    const promotion = await promotionModel.findByPk(id);
    if (!promotion) {
      return {
        status: 404,
        message: "Khuyến mãi không tồn tại",
        data: [],
      };
    }
    await promotion.destroy();
    return {
      status: 200,
      message: "Xóa thành công",
      data: promotion.dataValues,
    }; // Trả về danh sách vị trí
  } catch (error) {
    throw error;
  }
};

const createPromotionRoom = async (body) => {
  const transaction = await sequelize.transaction(); // Bắt đầu giao dịch
  const promotionRooms = formatKeyObject(body);

  try {
    const [promotionRoom, created] = await promotionRoomModel.findOrCreate({
      where: {
        promotion_id: promotionRooms.promotion_id,
        hotel_id: promotionRooms.hotel_id,
        room_id: promotionRooms.room_id,
      },
      defaults: {
        ...promotionRooms,
      },
      transaction, // Gắn giao dịch vào findOrCreate
    });

    if (created) {
      // Commit transaction nếu dữ liệu được tạo thành công
      await transaction.commit();
      return {
        status: 201,
        message: "Áp dụng mã khuyến mãi thành công",
        data: promotionRoom,
      };
    } else {
      // Rollback nếu mã khuyến mãi đã tồn tại
      await transaction.rollback();
      return {
        status: 409,
        message: "Mã khuyến mãi đã được áp dụng cho phòng này",
        data: [],
      };
    }
  } catch (error) {
    // Rollback transaction nếu xảy ra lỗi
    if (transaction) await transaction.rollback();
    throw error;
  }
};


const getPromotionRoom = async (roomId) => {
  try {
    const promotions = await promotionModel.findAll({
      include: [
        {
          model: promotionRoomModel,
          where: { room_id: roomId },
        },
      ],
    });
    return {
      status: 200,
      message: "Thành công",
      data: promotions,
    }; // Trả về danh sách vị trí
  } catch (error) {
    throw error;
  }
};

const getPromotionHotel = async (roomId) => {
  try {
    const promotions = await promotionModel.findAll({
      include: [
        {
          model: promotionRoomModel,
          where: { hotel_id: roomId },
        },
      ],
    });
    return {
      status: 200,
      message: "Thành công",
      data: promotions,
    }; // Trả về danh sách vị trí
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create,
  findAll,
  updatePromotion,
  deletePromotion,
  createPromotionRoom,
  getPromotionRoom,
  getPromotionHotel,
};
