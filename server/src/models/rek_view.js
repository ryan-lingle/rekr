'use strict';
module.exports = (sequelize, DataTypes) => {
  const rek_view = sequelize.define('rek_view', {
    userId: DataTypes.INTEGER,
    rekId: DataTypes.INTEGER,
  }, {});
  rek_view.associate = function(models) {
    rek_view.belongsTo(models.user);
    rek_view.belongsTo(models.rek);
  };
  return rek_view;
};
