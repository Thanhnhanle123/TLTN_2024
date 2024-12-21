const { DataTypes } = require('sequelize')
const services = require('./service.model')
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const comments = sequelize.define(
  'comments',
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
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false
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

module.exports = comments
