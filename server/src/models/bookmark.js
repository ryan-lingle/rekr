'use strict';
module.exports = (sequelize, DataTypes) => {
  const bookmark = sequelize.define('bookmark', {
    userId: DataTypes.INTEGER,
    episodeId: DataTypes.INTEGER
  }, {
  });
  bookmark.associate = function(models) {
    bookmark.belongsTo(models.user)
    bookmark.belongsTo(models.episode)
  };
  return bookmark;
};
