const { DataTypes } = require('sequelize')
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const rooms = require('./room.model')
const bookings = sequelize.define(
  'bookings',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    check_in_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    check_out_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    booking_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0 // Giá trị mặc định là 0
    },
    people: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1 // Giá trị mặc định là 1
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    timestamps: false // Tắt tự động tạo createdAt và updatedAt
  }
)
bookings.belongsTo(rooms, { foreignKey: "room_id" });
module.exports = bookings
