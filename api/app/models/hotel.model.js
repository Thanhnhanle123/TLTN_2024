const { DataTypes } = require('sequelize')
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const hotels = sequelize.define(
  'hotels',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hotel_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_hotel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true
    },
    typeHotel: {
      type: DataTypes.STRING,
      allowNull: true
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
// hotels.hasMany(roomModel, { foreignKey: "hotel_id" });
module.exports = hotels
