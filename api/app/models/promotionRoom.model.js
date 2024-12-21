const { DataTypes } = require('sequelize')
const sequelize = require(__path_configs + 'database') // File cấu hình kết nối
const Promotion = require('./promotion.model')
const Room = require('./room.model')

const PromotionRoom = sequelize.define(
  'PromotionRoom',
  {
    promotion_id: {
      type: DataTypes.INTEGER,
      references: { model: Promotion, key: 'id' }
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.INTEGER,
      references: { model: Room, key: 'id' }
    }
  },
  {
    timestamps: false,
    tableName: 'promotion_rooms'
  }
)

Promotion.hasMany(PromotionRoom, { foreignKey: 'promotion_id' })
Room.hasMany(PromotionRoom, { foreignKey: 'room_id' })
PromotionRoom.belongsTo(Promotion, { foreignKey: 'promotion_id' })
PromotionRoom.belongsTo(Room, { foreignKey: 'room_id' })

module.exports = PromotionRoom
