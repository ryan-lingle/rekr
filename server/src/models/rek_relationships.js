'use strict';
module.exports = (sequelize, DataTypes) => {
  const rek_relationships = sequelize.define('rek_relationships', {
    parentRekId: DataTypes.INTEGER,
    childRekId: DataTypes.INTEGER
  }, {});
  rek_relationships.associate = function(models) {
    // associations can be defined here
  };
  return rek_relationships;
};