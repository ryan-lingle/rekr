'use strict';
module.exports = (sequelize, DataTypes) => {
  const rek_update = sequelize.define('rek_update', {
    rekId: DataTypes.INTEGER,
    satoshis: DataTypes.INTEGER,
    timePeriod: DataTypes.STRING,
    removeAt: DataTypes.DATE,
  }, {
    hooks: {
      beforeCreate: async function(rek_update) {
        const date = new Date();
        if (rek_update.timePeriod === "month") {
          date.setMonth(date.getMonth() + 1);
          rek_update.removeAt = date;
        } else if (rek_update.timePeriod === "week") {
          rek_update.removeAt = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        } else {
          throw new Error("no time period provided to rek_update");
        };
      }
    }
  });
  rek_update.associate = function(models) {
    rek_update.belongsTo(models.rek);
  };
  return rek_update;
};
