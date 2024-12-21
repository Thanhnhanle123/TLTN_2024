require('dotenv').config(); // Tải biến môi trường từ file .env

const { Sequelize } = require('sequelize'); // Import Sequelize từ thư viện sequelize

// Cấu hình ẩn log SQL trong terminal nếu cần
const hiddenLog = {
    logging: false // Tắt log SQL
}

// Cấu hình hiện thị log SQL trong terminal nếu cần
const showLog = {
    logging: (sql, timing) => {
        // Hiển thị câu lệnh SQL và thời gian thực thi
        console.log(sql);
    }
};

// Cấu hình kết nối cơ sở dữ liệu
const dbConfig = {
    host:     process.env.DB_HOST,      // Địa chỉ máy chủ cơ sở dữ liệu
    username: process.env.DB_USER,      // Tên người dùng cơ sở dữ liệu
    password: process.env.DB_PASSWORD,  // Mật khẩu cơ sở dữ liệu
    database: process.env.DB_NAME,      // Tên cơ sở dữ liệu
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',                   // Loại cơ sở dữ liệu (MySQL)
    logging: process.env.DB_LOGGING === 'true' ? showLog.logging : hiddenLog.logging // Chọn hiển thị log SQL dựa vào biến môi trường
};

// Tạo đối tượng Sequelize với cấu hình cơ sở dữ liệu
const sequelize = new Sequelize(dbConfig);

// Xuất đối tượng Sequelize để sử dụng ở nơi khác
module.exports = sequelize;
