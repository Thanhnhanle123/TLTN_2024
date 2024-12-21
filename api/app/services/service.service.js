const servicesModel = require(__path_models + "service.model");
const hotelServices = require(__path_models + "hotel_services.model");
const sequelize = require(__path_configs + "database");
const { formatKeyObject } = require(__path_common + "format"); // format
const { dateNow } = require(__path_common + "date");

/**
 * Lấy danh sách tất cả các dịch vụ
 * @returns {Object} - Kết quả với danh sách các dịch vụ hoặc thông báo lỗi
 */
const getAll = async () => {
  const transaction = await sequelize.transaction();
  try {
    const services = await servicesModel.findAll({ transaction });
    await transaction.commit();
    return { status: 200, message: "Thành công", data: services };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findByHotelId = async (hotelId) => {
  const transaction = await sequelize.transaction();
  try {
    // Raw SQL query to find services by hotel_id and join with services table
    const results = await sequelize.query(
      `
      SELECT s.service_name
      FROM hotel_services AS hs
      JOIN services AS s ON s.id = hs.service_id
      WHERE hs.hotel_id = :hotelId;
      `,
      {
        replacements: { hotelId: hotelId }, // Bind the hotelId parameter
        type: sequelize.QueryTypes.SELECT, // Specify the query type
      }
    );

    if (results.length > 0) {
      await transaction.commit();
      return {
        status: 200,
        message: "Thành công",
        data: results.map((result) => ({
          service_name: result.service_name, // Return service name from services table
        })),
      };
    } else {
      await transaction.rollback();
      return { status: 409, message: "Dịch vụ không tồn tại", data: [] };
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};



const create = async (body) => {
  const transaction = await sequelize.transaction();
  try {
    const createdAt = dateNow();
    const updatedAt = dateNow();
    const serviceData = formatKeyObject(body);
    const [service, created] = await servicesModel.findOrCreate({
      where: { service_name: serviceData.service_name },
      defaults: { ...serviceData, createdAt, updatedAt },
      transaction,
    });

    if (created) {
      await transaction.commit();
      return { status: 201, message: "Thành công", data: service.dataValues };
    } else {
      await transaction.rollback();
      return { status: 409, message: "Dịch vụ đã tồn tại", data: [] };
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const remove = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const result = await servicesModel.destroy({ where: { id }, transaction });
    if (result) {
      await transaction.commit();
      return { status: 200, message: "Thành công" };
    } else {
      await transaction.rollback();
      return { status: 409, message: "Dịch vụ không tồn tại", data: [] };
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Update an existing service
 * @param {Number} id - ID of the service to update
 * @param {Object} body - New service data
 * @returns {Object} - Updated service or error message
 */
const update = async (id, body) => {
  const transaction = await sequelize.transaction();
  try {
    const updatedAt = dateNow(); // Update the timestamp
    const serviceData = formatKeyObject(body);

    const service = await servicesModel.findByPk(id, { transaction });

    if (!service) {
      await transaction.rollback();
      return { status: 404, message: "Dịch vụ không tồn tại", data: [] };
    }

    // Update the service with the new data
    await service.update({ ...serviceData, updatedAt }, { transaction });

    await transaction.commit();
    return {
      status: 200,
      message: "Cập nhật dịch vụ thành công",
      data: service,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getAll,
  findByHotelId,
  create,
  remove,
  update, // Export the update function
};
