'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    logo: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    rating: DataTypes.STRING,
    orders: DataTypes.STRING,
    services:  {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('services').split(',')
      },
      set(val) {
        this.setDataValue('services', val.join(','));
      }
    },
    reviewsNumber: DataTypes.STRING
  });
  Company.associate = function(models) {
    // associations can be defined here
  };
  return Company;
};