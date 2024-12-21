const { DataTypes } = require('sequelize')
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const services = sequelize.define(
  'service',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    service_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
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

module.exports = services
