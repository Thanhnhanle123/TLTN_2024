const { DataTypes } = require('sequelize')
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối

const tokenDevices = sequelize.define(
  'token_devices',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE' // Xóa token nếu người dùng bị xóa
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Đảm bảo token là duy nhất
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false, // Tắt tự động tạo createdAt và updatedAt
    tableName: 'token_devices' // Đảm bảo tên bảng là chính xác
  }
)

// Thiết lập quan hệ với bảng Users
tokenDevices.associate = models => {
  tokenDevices.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' })
}

module.exports = tokenDevices
