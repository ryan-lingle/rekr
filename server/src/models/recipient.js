'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipient = sequelize.define('recipient', {
    rekId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    podcastId: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    satoshis: DataTypes.INTEGER
  }, {});
  recipient.associate = function(models) {
    recipient.belongsTo(models.user);
    recipient.belongsTo(models.podcast);
  };
  return recipient;
};
