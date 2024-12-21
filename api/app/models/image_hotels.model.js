const { DataTypes } = require('sequelize')
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const image_hotels = sequelize.define(
  'image_hotels',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_main: {
      type: DataTypes.INTEGER,
      length: 1,
      allowNull: false,
      defaultValue: 0
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

module.exports = image_hotels
