// models/PromotionHotel.js
const { DataTypes } = require('sequelize')
const sequelize = require('../database') // Kết nối sequelize
const Promotion = require('./promotion.model')

const PromotionHotel = sequelize.define(
  'PromotionHotel',
  {
    promotion_id: {
      type: DataTypes.INTEGER,
      references: { model: Promotion, key: 'id' }
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'promotion_hotels'
  }
)

Promotion.hasMany(PromotionHotel, { foreignKey: 'promotion_id' })
PromotionHotel.belongsTo(Promotion, { foreignKey: 'promotion_id' })

module.exports = PromotionHotel
