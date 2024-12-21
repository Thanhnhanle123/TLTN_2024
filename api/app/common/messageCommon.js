const messages = {
  success: {
    create: item => `${item} đã tạo thành công!`,
    update: item => `${item} đã cập nhật thành công!`,
    delete: item => `${item} đã xóa thành công!`
  },
  error: {
    notFound: item => `${item} không tìm thấy!`,
    serverError: 'Đã xảy ra lỗi máy chủ nội bộ!',
    invalidInput: 'Đầu vào không hợp lệ!',
    forbidden: 'Bạn không có quyền truy cập!',
    badRequest: 'Yêu cầu không hợp lệ!'
  },
  warning: {
    unauthorized: 'Bạn không được phép thực hiện hành động này!',
    missingFields: 'Thiếu một số trường bắt buộc!',
    dataConflict: 'Dữ liệu bị xung đột!'
  },
  // Mã lỗi 500 - Lỗi máy chủ
  code500: {
    serverError: 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau!',
    dbConnectionError: 'Không thể kết nối đến cơ sở dữ liệu!',
    timeout: 'Máy chủ không phản hồi kịp thời!',
    unknownError: 'Lỗi không xác định đã xảy ra!',
    serviceUnavailable:
      'Dịch vụ tạm thời không khả dụng, vui lòng thử lại sau!',
    externalServiceFailure: 'Lỗi từ dịch vụ bên ngoài!',
    memoryOverflow: 'Quá tải bộ nhớ!',
    diskFull: 'Đĩa đã đầy, không thể thực hiện thêm thao tác!',
    resourceLimitReached: 'Đã đạt giới hạn tài nguyên!'
  },
  // Mã lỗi 200 - Thành công
  code200: {
    success: 'Thành công!',
    dataFound: 'Dữ liệu đã được tìm thấy!'
  },
  // Mã lỗi 201 - Tạo mới thành công
  code201: {
    created: item => `${item} đã tạo thành công!`
  },
  // Mã lỗi 202 - Đã chấp nhận xử lý nhưng chưa hoàn thành
  code202: {
    accepted: 'Yêu cầu đã được chấp nhận, đang xử lý!'
  },
  // Mã lỗi 204 - Không có nội dung
  code204: {
    noContent: 'Không có nội dung để trả về!'
  },
  // Mã lỗi 400 - Lỗi phía client
  code400: {
    invalidToken: 'Token không hợp lệ!',
    expiredToken: 'Token đã hết hạn!',
    invalidEmail: 'Email không hợp lệ!',
    invalidPassword: 'Mật khẩu không hợp lệ!',
    existingEmail: 'Email đã tồn tại!',
    invalidRequest: 'Yêu cầu không hợp lệ!',
    missingParams: 'Thiếu tham số yêu cầu!'
  },
  // Mã lỗi 401 - Không được phép
  code401: {
    unauthorized: 'Yêu cầu không có quyền truy cập!',
    tokenExpired: 'Token đã hết hạn, vui lòng đăng nhập lại!'
  },
  // Mã lỗi 403 - Cấm truy cập
  code403: {
    forbidden: 'Bạn không có quyền truy cập vào tài nguyên này!'
  },
  // Mã lỗi 404 - Không tìm thấy tài nguyên
  code404: {
    notFound: item => `${item} không tìm thấy!`,
    pageNotFound: 'Trang bạn yêu cầu không tồn tại!'
  },
  // Mã lỗi 409 - Xung đột dữ liệu
  code409: {
    exit: "Đã tồn tại",
    conflict: 'Dữ liệu bị xung đột, vui lòng kiểm tra lại!'
  },
  // Mã lỗi 422 - Unprocessable Entity (Dữ liệu không xử lý được)
  code422: {
    unprocessable: 'Dữ liệu không thể được xử lý!'
  }
}

module.exports = messages
