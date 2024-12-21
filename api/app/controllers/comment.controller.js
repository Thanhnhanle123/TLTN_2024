require('dotenv').config()
const common = require('./common/message')
const commentService = require(__path_services + 'comment.service')
const messages = require(__path_common + 'messageCommon')

// comment.controller.js
const getAll = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await commentService.getAll();
    common.message(res, result.status, result.message, result.data); // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};
// comment.controller.js
const getCommentByHotelId = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await commentService.getCommentByHotelId(req.params.id);
    common.message(res, result.status, result.message, result.data); // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    // Gọi hàm location trong location và xử lý kết quả
    const result = await commentService.deleteComment(req.params.id);
    common.message(res, result.status, result.message, result.data); // Trả về thông tin location
  } catch (error) {
    // Trả về phản hồi lỗi
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};

// Service function to create a new comment
const createComment = async (req, res, next) => {
  try {
    // Insert the new comment into the database (adjust based on your database model)
    const result = await commentService.createComment(req.body);
    common.message(res, result.status, result.message, result.data); // Trả về thông tin location
  } catch (error) {
    next(error);
    common.message(res, 500, messages.code500.serverError);
  }
};


module.exports = {
  getAll,
  getCommentByHotelId,
  deleteComment,
  createComment,
};
