const common = require("./common/message");
const serviceService = require(__path_services + "service.service");
const messages = require(__path_common + "messageCommon");

// function to list services
const getAll = async (req, res, next) => {
  try {
    const result = await serviceService.getAll();
    common.message(res, result.status, result.message, result.data);
  } catch (error) {
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};

const findByHotelId = async (req, res, next) => {
  try {
    const result = await serviceService.findByHotelId(req.params.id);
    common.message(res, result.status, result.message, result.data);
  } catch (error) {
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await serviceService.create(req.body);
    common.message(res, result.status, result.message, result.data);
  } catch (error) {
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await serviceService.remove(req.params.id);
    common.message(res, result.status, result.message, result.data);
  } catch (error) {
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};

// Create the update function
const update = async (req, res, next) => {
  try {
    const result = await serviceService.update(req.params.id, req.body); // Call the update service method
    common.message(res, result.status, result.message, result.data); // Send the response
  } catch (error) {
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};

module.exports = {
  getAll,
  findByHotelId,
  create,
  remove,
  update, // Export the update function
};
