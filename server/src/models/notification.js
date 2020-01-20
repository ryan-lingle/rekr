'use strict';
module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define('notification', {
    userId: DataTypes.INTEGER,
    notifierId: DataTypes.INTEGER,
    rekId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    satoshis: DataTypes.INTEGER
  }, {});
  notification.associate = function(models) {
  };
  return notification;
};
