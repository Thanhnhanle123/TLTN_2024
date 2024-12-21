require('dotenv').config()
const express = require('express')
const createError = require('http-errors')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')
const path = require('path')
const http = require('http')
const server = http.createServer(app)

// Cấu hình các middleware cơ bản
app.use(cors()) // Cho phép tất cả các nguồn (CORS)
app.use(express.json()) // Phân tích các dữ liệu JSON trong body của request
app.use(logger('dev')) // Ghi log thông tin yêu cầu bằng morgan
app.use(express.urlencoded({ extended: true })) // For form data
app.use('/public', express.static('public'))
// Cấu hình winston để ghi log vào file với xoay vòng theo ngày
const transport = new DailyRotateFile({
  filename: path.join(__dirname, 'logs', 'error-%DATE%.log'), // Đường dẫn và tên file log, thêm ngày vào tên file
  datePattern: 'YYYY-MM-DD', // Định dạng ngày tháng trong tên file log
  maxSize: '20m', // Kích thước tối đa của mỗi file log
  maxFiles: '14d', // Thời gian giữ lại các file log trước khi xóa
  level: 'error', // Chỉ ghi log với mức độ 'error'
  format: winston.format.combine(
    winston.format.timestamp(), // Thêm timestamp vào log
    winston.format.printf(({ timestamp, level, message }) => {
      // Định dạng log với timestamp, mức độ và thông điệp
      return `${timestamp} - ${level}: ${message}`
    })
  )
})

// Tạo logger winston với cấu hình trên
const loggerWinston = winston.createLogger({
  level: 'error', // Mức độ ghi log
  transports: [transport] // Transport để ghi log vào file
})

// Sử dụng middleware Morgan để ghi log vào tập tin thông qua winston
app.use(
  logger('combined', {
    stream: { write: message => loggerWinston.info(message.trim()) }
  })
)

// Đường dẫn đến các thư mục cấu hình
const pathConfig = require('./path')
global.__base = __dirname + '/'
global.__path_app = __base + pathConfig.folder_app + '/'
global.__path_logs = __path_app + pathConfig.folder_logs + '/'
global.__path_utils = __path_app + pathConfig.folder_utils + '/'
global.__path_common = __path_app + pathConfig.folder_common + '/'
global.__path_models = __path_app + pathConfig.folder_models + '/'
global.__path_configs = __path_app + pathConfig.folder_configs + '/'
global.__path_routers = __path_app + pathConfig.folder_routers + '/'
global.__path_services = __path_app + pathConfig.folder_services + '/'
global.__path_validates = __path_app + pathConfig.folder_validates + '/'
global.__path_controllers = __path_app + pathConfig.folder_controllers + '/'
global.__path_middlewares = __path_app + pathConfig.folder_middlewares + '/'

// Route chính
app.use('/api/v1/', require(__path_routers))

// Xử lý lỗi 404
app.use(function (req, res, next) {
  // Nếu không tìm thấy route, trả về lỗi 404
  next(createError(404))
})

// Middleware ghi log và xử lý lỗi
app.use(function (err, req, res, next) {
  // Ghi log lỗi vào file log với winston
  loggerWinston.error(
    `${req.method} ${req.url} - ${err.message}\nStack trace:\n${err.stack}`
  )
  if (res.statusCode == 500 && req.app.get('env') !== 'development') {
    const { checkForErrors } = require(__path_middlewares + 'sendMail')
    checkForErrors(
      `${req.method} ${req.url} - ${err.message}`,
      `\nStack trace:\n${err.stack}`
    )
  }

  res.locals.message = err.message // Lưu thông điệp lỗi
  res.locals.error = req.app.get('env') === 'development' ? err : {} // Đưa thông tin lỗi chi tiết nếu ở chế độ phát triển
  res.status(err.status || 500) // Đặt mã trạng thái HTTP
  res.end('Error App') // Trả về phản hồi lỗi
})

// Khởi động server
const PORT = process.env.PORT || 3000
const sequelize = require(__path_configs + 'database')
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`) // Lắng nghe kết nối trên cổng đã chỉ định
  })
})
